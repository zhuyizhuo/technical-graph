# MySQL 集群自建指南

## 1. 集群概述与准备工作

### 1.1 MySQL集群类型

MySQL集群主要有以下几种常见架构：
- **主从复制（Master-Slave Replication）**：最简单的集群架构，适用于读多写少场景
- **主主复制（Master-Master Replication）**：双主互备，可以同时读写
- **半同步复制**：比异步复制更可靠，但性能略低
- **组复制（Group Replication）**：MySQL 5.7+ 提供的高可用解决方案
- **InnoDB Cluster**：官方完整的高可用解决方案

本指南将重点介绍**主从复制**和**组复制**两种常用架构的搭建方法。

### 1.2 环境要求

- **服务器**：至少2台服务器（推荐3台及以上）
- **操作系统**：CentOS 7/8 或 Ubuntu 18.04/20.04
- **MySQL版本**：5.7 或 8.0（推荐8.0）
- **网络**：服务器之间网络互通
- **硬件配置**：根据实际业务需求调整，建议至少4核8G内存

### 1.3 服务器规划

以3节点主从复制为例：
- 主节点：192.168.1.101
- 从节点1：192.168.1.102
- 从节点2：192.168.1.103

## 2. 安装MySQL（所有节点）

### 2.1 CentOS系统安装

```bash
# 更新系统
yum update -y

# 下载MySQL Yum源
wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm

sudo rpm -ivh mysql80-community-release-el7-3.noarch.rpm

# 安装MySQL
yum install mysql-community-server -y

# 启动MySQL服务
systemctl start mysqld
systemctl enable mysqld

# 查看初始密码
grep 'temporary password' /var/log/mysqld.log

# 登录并修改密码
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourNewPassword@123';
```

### 2.2 Ubuntu系统安装

```bash
# 更新系统
apt update && apt upgrade -y

# 安装MySQL服务器
apt install mysql-server -y

# 启动MySQL服务
systemctl start mysql
systemctl enable mysql

# 运行安全脚本
sudo mysql_secure_installation

# 设置root密码和其他安全选项
```

## 3. 配置MySQL主从复制

### 3.1 配置主节点（192.168.1.101）

```bash
# 编辑MySQL配置文件
vi /etc/my.cnf

# 添加以下配置
[mysqld]
server-id=101  # 唯一标识
log-bin=mysql-bin  # 启用二进制日志
binlog-format=ROW  # 二进制日志格式
innodb_flush_log_at_trx_commit=1
sync_binlog=1

# 重启MySQL服务
systemctl restart mysqld

# 登录MySQL创建复制用户
mysql -u root -p
CREATE USER 'repl'@'%' IDENTIFIED WITH mysql_native_password BY 'ReplPassword@123';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;

# 查看主节点状态
SHOW MASTER STATUS;
# 记录File和Position的值，稍后会用到
```

### 3.2 配置从节点（192.168.1.102和192.168.1.103）

```bash
# 编辑MySQL配置文件
vi /etc/my.cnf

# 添加以下配置（从节点1）
[mysqld]
server-id=102  # 唯一标识，不能与主节点相同
log-bin=mysql-bin
read-only=1  # 设置为只读

# 从节点2的server-id设为103

# 重启MySQL服务
systemctl restart mysqld

# 登录MySQL配置复制
mysql -u root -p
CHANGE MASTER TO
MASTER_HOST='192.168.1.101',
MASTER_USER='repl',
MASTER_PASSWORD='ReplPassword@123',
MASTER_LOG_FILE='mysql-bin.000001',  # 替换为实际的File值
MASTER_LOG_POS=157;  # 替换为实际的Position值

# 启动复制进程
START SLAVE;

# 查看复制状态
SHOW SLAVE STATUS\G;
# 确保Slave_IO_Running和Slave_SQL_Running都为Yes
```

## 4. 配置MySQL组复制

### 4.1 所有节点的基础配置

```bash
# 编辑MySQL配置文件
vi /etc/my.cnf

# 添加以下配置
[mysqld]
server-id=101  # 每个节点设置不同的ID
binlog_format=ROW
log_bin=binlog
log_slave_updates=ON
enforce_gtid_consistency=ON
gtid_mode=ON
master_info_repository=TABLE
relay_log_info_repository=TABLE
plugin_load_add='group_replication.so'
transaction_write_set_extraction=XXHASH64
loose-group_replication_group_name='aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
loose-group_replication_start_on_boot=OFF
loose-group_replication_local_address='192.168.1.101:33061'  # 替换为各节点实际IP
loose-group_replication_group_seeds='192.168.1.101:33061,192.168.1.102:33061,192.168.1.103:33061'
loose-group_replication_bootstrap_group=OFF

# 重启MySQL服务
systemctl restart mysqld
```

### 4.2 配置第一个节点（种子节点）

```bash
# 登录MySQL
mysql -u root -p

# 创建复制用户
SET SQL_LOG_BIN=0;
CREATE USER 'repl'@'%' IDENTIFIED WITH mysql_native_password BY 'ReplPassword@123';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;
SET SQL_LOG_BIN=1;
CHANGE MASTER TO MASTER_USER='repl', MASTER_PASSWORD='ReplPassword@123' FOR CHANNEL 'group_replication_recovery';

# 启动组复制
SET GLOBAL group_replication_bootstrap_group=ON;
START GROUP_REPLICATION;
SET GLOBAL group_replication_bootstrap_group=OFF;

# 查看组复制状态
SELECT * FROM performance_schema.replication_group_members;
```

### 4.3 配置其他节点加入集群

```bash
# 在其他两个节点上执行
mysql -u root -p

# 创建复制用户
SET SQL_LOG_BIN=0;
CREATE USER 'repl'@'%' IDENTIFIED WITH mysql_native_password BY 'ReplPassword@123';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;
SET SQL_LOG_BIN=1;
CHANGE MASTER TO MASTER_USER='repl', MASTER_PASSWORD='ReplPassword@123' FOR CHANNEL 'group_replication_recovery';

# 加入组复制
START GROUP_REPLICATION;

# 查看组复制状态
SELECT * FROM performance_schema.replication_group_members;
# 确保所有节点状态都为ONLINE
```

## 5. 验证集群功能

### 5.1 主从复制验证

```bash
# 在主节点创建测试数据库和表
mysql -u root -p
CREATE DATABASE test_cluster;
USE test_cluster;
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50));
INSERT INTO users (name) VALUES ('MySQL Cluster Test');

# 在从节点验证数据同步
mysql -u root -p
USE test_cluster;
SELECT * FROM users;
# 应该能看到主节点插入的数据
```

### 5.2 组复制验证

```bash
# 在任意节点创建测试数据库和表
mysql -u root -p
CREATE DATABASE test_group_replication;
USE test_group_replication;
CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50));
INSERT INTO products (name) VALUES ('Product 1'), ('Product 2');

# 在其他节点验证数据同步
mysql -u root -p
USE test_group_replication;
SELECT * FROM products;
# 所有节点应该都能看到相同的数据
```

## 6. 常见问题处理

### 6.1 主从复制问题

**问题1：Slave_IO_Running状态为Connecting**

```bash
# 可能原因：网络问题、复制用户权限问题、防火墙阻止
# 检查网络连通性
ping 192.168.1.101

# 检查复制用户权限
# 在主节点执行
SHOW GRANTS FOR 'repl'@'%';

# 检查防火墙设置
firewall-cmd --list-ports
# 如需要，添加MySQL端口
sudo firewall-cmd --add-port=3306/tcp --permanent
sudo firewall-cmd --reload

# 重新配置复制
# 在从节点执行
STOP SLAVE;
CHANGE MASTER TO MASTER_HOST='192.168.1.101', MASTER_USER='repl', MASTER_PASSWORD='ReplPassword@123', MASTER_LOG_FILE='mysql-bin.000001', MASTER_LOG_POS=157;
START SLAVE;
```

**问题2：Slave_SQL_Running状态为No**

```bash
# 可能原因：数据不一致、从库执行了写操作
# 方法1：忽略错误继续同步
STOP SLAVE;
SET GLOBAL sql_slave_skip_counter = 1;
START SLAVE;

# 方法2：重新初始化从库
# 在主节点导出数据
mysqldump -u root -p --all-databases --master-data=2 > all_dbs.sql

# 在从节点导入数据
mysql -u root -p < all_dbs.sql

# 重新配置复制
CHANGE MASTER TO MASTER_HOST='192.168.1.101', MASTER_USER='repl', MASTER_PASSWORD='ReplPassword@123', MASTER_LOG_FILE='mysql-bin.000001', MASTER_LOG_POS=157;
START SLAVE;
```

### 6.2 组复制问题

**问题1：节点无法加入集群**

```bash
# 可能原因：网络问题、集群名称不一致、GTID不一致
# 检查网络连通性和组复制端口
ping 192.168.1.101
telnet 192.168.1.101 33061

# 检查集群名称是否一致
SHOW VARIABLES LIKE 'group_replication_group_name';

# 重置GTID并重新加入
RESET MASTER;
SET GLOBAL gtid_purged = '';
START GROUP_REPLICATION;
```

**问题2：节点状态为RECOVERING或OFFLINE**

```bash
# 查看错误日志
SHOW ERROR LOGS;
# 或直接查看日志文件
cat /var/log/mysqld.log

# 常见解决方法
# 1. 检查复制用户权限
# 2. 检查防火墙设置，确保3306和33061端口开放
# 3. 如集群脑裂，可能需要重新初始化集群
```

## 7. 集群监控与维护

### 7.1 监控复制状态

```bash
# 主从复制监控
SHOW SLAVE STATUS\G;

# 组复制监控
SELECT * FROM performance_schema.replication_group_members;
SELECT * FROM performance_schema.replication_group_member_stats;

# 查看复制延迟
SHOW GLOBAL STATUS LIKE 'Slave_%_Behind_Master';
```

### 7.2 定期维护任务

```bash
# 备份数据库
mysqldump -u root -p --all-databases --single-transaction --routines --triggers > backup.sql

# 优化表
OPTIMIZE TABLE table_name;

# 重建索引
ALTER TABLE table_name ENGINE=InnoDB;

# 监控磁盘空间
df -h

# 监控内存使用
free -h

# 定期更新统计信息
ANALYZE TABLE table_name;
```

### 7.3 主节点故障切换

```bash
# 手动故障切换
# 1. 在从节点提升为主节点
STOP SLAVE;
RESET SLAVE ALL;

# 2. 修改配置文件，开启写权限
vi /etc/my.cnf
read-only=0

# 3. 重启MySQL服务
systemctl restart mysqld

# 4. 其他从节点指向新的主节点
CHANGE MASTER TO MASTER_HOST='新主节点IP', MASTER_USER='repl', MASTER_PASSWORD='ReplPassword@123', MASTER_LOG_FILE='mysql-bin.000001', MASTER_LOG_POS=157;
START SLAVE;
```

## 8. 集群优化建议

1. **硬件优化**：使用SSD存储，增加内存大小
2. **配置优化**：根据服务器配置调整innodb_buffer_pool_size等参数
3. **读写分离**：使用代理工具（如Mycat、MaxScale）实现读写分离
4. **分库分表**：对于大数据量场景，考虑分库分表策略
5. **定期备份**：制定完善的备份策略，包括全量备份和增量备份
6. **监控告警**：配置监控系统，及时发现并解决问题
7. **高可用方案**：结合Keepalived等工具实现自动故障切换

通过以上步骤，您可以成功搭建MySQL集群并进行日常维护。根据实际业务需求，可以选择合适的集群架构并进行相应的优化调整。