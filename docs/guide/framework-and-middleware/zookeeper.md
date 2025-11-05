## 一、核心概念与架构

### 1. 核心概念

**ZooKeeper**： 一个开源的分布式协调服务，为分布式应用提供一致性保证、配置管理、命名服务、分布式锁和组服务等功能。

**节点（Node）**： ZooKeeper中的数据单元，也称为znode。节点可以存储少量数据（默认最大1MB），并可以有子节点。

**会话（Session）**： 客户端与ZooKeeper服务器之间的连接。会话建立后，客户端可以发送请求、接收响应和监听事件。

**观察器（Watcher）**： 一种事件监听机制，客户端可以在节点上注册观察器，当节点状态发生变化时，ZooKeeper服务器会通知客户端。

**ACL（Access Control List）**： 访问控制列表，用于控制对节点的操作权限，包括创建、读取、写入、删除、管理等权限。

**临时节点（Ephemeral Node）**： 与客户端会话绑定的节点，当会话结束时，节点会自动删除。

**持久节点（Persistent Node）**： 不会自动删除的节点，只有通过显式调用删除操作才会被删除。

**有序节点（Sequential Node）**： 创建时会自动添加递增序号的节点，序号格式为%010d（10位数字，不足补零）。

### 2. 架构与组成

**ZooKeeper 架构**： 采用主从复制架构，由一个领导者（Leader）和多个跟随者（Follower）组成。

**核心组件**：
- **领导者（Leader）**： 负责处理事务请求（写操作），维护集群一致性，协调Follower的同步。
- **跟随者（Follower）**： 处理读操作请求，转发写操作请求给Leader，并参与投票。
- **观察者（Observer）**： 类似于Follower，但不参与投票，仅用于提高读性能。
- **客户端（Client）**： 连接到ZooKeeper服务器的应用程序。

**ZooKeeper 会话机制**：
- 客户端与ZooKeeper服务器建立TCP连接
- 服务器为客户端分配会话ID（sessionID）
- 客户端定期发送心跳包保持会话活跃
- 会话超时时间（sessionTimeout）决定了客户端多久没有心跳后被视为断开连接

**ZooKeeper 数据模型**：
- 层次化的命名空间，类似于文件系统目录结构
- 每个节点可以存储数据和拥有子节点
- 路径格式：`/path/to/node`，根节点为`/`

### 3. 选举机制

**基本概念**：
- **服务器ID（myid）**：每个ZooKeeper服务器的唯一标识，在myid文件中配置
- **事务ID（zxid）**：服务器上最后一次提交事务的ID，值越大表示数据越新
- **逻辑时钟（epoch）**：选举轮次标识，防止因网络分区导致的脑裂

**选举触发条件**：
1. 集群初始化启动时
2. Leader服务器出现故障时
3. Leader与Follower之间的心跳超时（超过syncLimit*tickTime）

**选举过程**：

#### 1. 初始化阶段
- 每个服务器启动时，初始状态为LOOKING（寻找Leader）
- 每个服务器给自己投票，并向集群中其他服务器发送投票信息（包含myid和zxid）
- 投票信息格式：(服务器ID, 最新事务ID)

#### 2. 投票比较规则
服务器收到其他服务器的投票后，遵循以下规则进行比较：
- **优先比较事务ID（zxid）**：zxid较大的服务器更优先成为Leader
- **zxid相同时，比较服务器ID（myid）**：myid较大的服务器更优先

#### 3. 投票变更与确认
- 如果收到的投票比自己当前的投票更优，则更新自己的投票并重新发送
- 服务器统计投票，当某个服务器获得超过半数（n/2+1）的投票时，该服务器成为Leader
- 一旦确定Leader，其他服务器将自己的状态从LOOKING变更为FOLLOWING

#### 4. 数据同步
- 选举结束后，新当选的Leader会与Follower进行数据同步
- Follower将自己的事务日志与Leader进行对比，同步缺失的数据
- 同步完成后，集群进入正常工作状态

**选举算法特点**：
- **高效性**：只需一轮投票即可完成选举（在网络正常情况下）
- **可靠性**：基于多数派原则，确保即使部分节点故障也能选出Leader
- **数据一致性**：通过优先选择数据最新的节点作为Leader，保证集群数据一致性

## 二、安装与配置

### 1. 系统要求

**硬件要求**：
- 内存： 推荐至少4GB RAM
- 磁盘： 推荐使用SSD，至少10GB空间
- CPU： 多核处理器

**软件要求**：
- Java运行环境： JDK 1.8或更高版本
- 操作系统： Linux、Windows、macOS等

### 2. 单机安装

**下载ZooKeeper**：
1. 访问[Apache ZooKeeper官网](https://zookeeper.apache.org/releases.html)
2. 下载稳定版本的二进制压缩包（如apache-zookeeper-3.8.1-bin.tar.gz）

**解压安装**：
```bash
# 解压压缩包
tar -xzvf apache-zookeeper-3.8.1-bin.tar.gz

# 移动到安装目录
mv apache-zookeeper-3.8.1-bin /opt/zookeeper
```

**Windows安装**：
1. 下载ZooKeeper的zip压缩包
2. 解压到安装目录（如D:\zookeeper）

### 3. 配置文件设置

**创建配置文件**：
```bash
# 进入配置目录
cd /opt/zookeeper/conf

# 复制默认配置文件
cp zoo_sample.cfg zoo.cfg
```

**基本配置（zoo.cfg）**：
```properties
# 客户端会话超时时间（毫秒）
syncLimit=5

# 服务器间心跳时间（毫秒）
tickTime=2000

# 初始同步阶段最多能容忍的心跳次数
initLimit=10

# 数据目录
dataDir=/var/lib/zookeeper

# 客户端连接端口
clientPort=2181

# 最大客户端连接数（0表示无限制）
maxClientCnxns=60

# 自动清除事务日志和快照文件（天）
autopurge.purgeInterval=1

# 保留的快照文件数量
autopurge.snapRetainCount=3
```

**Windows配置示例**：
```properties
tickTime=2000
initLimit=10
syncLimit=5
dataDir=D:\zookeeper\data
clientPort=2181
```

### 4. 启动和停止

**Linux启动**：
```bash
# 启动ZooKeeper服务器
/opt/zookeeper/bin/zkServer.sh start

# 停止ZooKeeper服务器
/opt/zookeeper/bin/zkServer.sh stop

# 重启ZooKeeper服务器
/opt/zookeeper/bin/zkServer.sh restart

# 查看状态
/opt/zookeeper/bin/zkServer.sh status
```

**Windows启动**：
```cmd
# 启动ZooKeeper服务器
D:\zookeeper\bin\zkServer.cmd

# 后台启动（使用nssm等工具）
nssm install ZooKeeper D:\zookeeper\bin\zkServer.cmd
nssm start ZooKeeper
```

### 5. 集群配置

**配置文件（zoo.cfg）**：
```properties
# 基本配置
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/var/lib/zookeeper
clientPort=2181

# 集群节点配置（格式：server.节点ID=主机:数据同步端口:选举端口）
server.1=zookeeper1:2888:3888
server.2=zookeeper2:2888:3888
server.3=zookeeper3:2888:3888
```

**创建myid文件**：
在每个节点的数据目录（dataDir）中创建myid文件，内容为该节点的ID：
```bash
# 在zookeeper1上
echo 1 > /var/lib/zookeeper/myid

# 在zookeeper2上
echo 2 > /var/lib/zookeeper/myid

# 在zookeeper3上
echo 3 > /var/lib/zookeeper/myid
```

**启动集群**：
在每个节点上执行启动命令：
```bash
/opt/zookeeper/bin/zkServer.sh start
```

## 三、常用命令

### 1. 客户端连接命令

**启动客户端**：
```bash
# 连接到本地ZooKeeper服务器
/opt/zookeeper/bin/zkCli.sh

# 连接到远程ZooKeeper服务器
/opt/zookeeper/bin/zkCli.sh -server host:port

# 指定会话超时时间（毫秒）
/opt/zookeeper/bin/zkCli.sh -server host:port -timeout 5000
```

**Windows客户端**：
```cmd
D:\zookeeper\bin\zkCli.cmd -server localhost:2181
```

### 2. 节点操作命令

**创建节点**：
```bash
# 创建持久节点
create /path "data"

# 创建临时节点
create -e /path "data"

# 创建有序节点
create -s /path "data"

# 创建临时有序节点
create -e -s /path "data"

# 创建带ACL的节点
create /path "data" digest:username:password:rwcda
```

**读取节点**：
```bash
# 获取节点数据
get /path

# 获取节点数据并设置观察器
get -w /path

# 获取节点数据并查看详细信息
get -s /path
```

**更新节点**：
```bash
# 更新节点数据
set /path "newdata"

# 基于版本号更新节点数据
set -v 1 /path "newdata"
```

**删除节点**：
```bash
# 删除空节点
delete /path

# 基于版本号删除节点
delete -v 1 /path

# 递归删除节点及其子节点
deleteall /path
```

**列出子节点**：
```bash
# 列出节点的子节点
ls /path

# 列出节点的子节点并设置观察器
ls -w /path

# 列出节点的子节点并查看详细信息
ls -s /path
```

### 3. 会话和状态命令

**查看会话信息**：
```bash
# 查看会话超时时间
conf

# 查看连接状态
cons

# 查看统计信息
srvr

# 查看环境变量
env

# 查看四字命令帮助
telnet localhost 2181
srvr
```

**四字命令**：
ZooKeeper支持通过telnet或nc发送四字命令：
```bash
# 查看服务器状态
echo stat | nc localhost 2181

# 查看连接信息
echo cons | nc localhost 2181

# 查看服务器配置
echo conf | nc localhost 2181

# 查看统计信息
echo mntr | nc localhost 2181

# 查看健康状态
echo ruok | nc localhost 2181
```

### 4. ACL操作命令

**设置ACL**：
```bash
# 设置节点的ACL
setAcl /path digest:username:password:rwcda

# 基于版本号设置ACL
setAcl -v 1 /path digest:username:password:rwcda
```

**获取ACL**：
```bash
# 获取节点的ACL
getAcl /path
```

**添加授权用户**：
```bash
# 添加授权用户（在客户端中）
addauth digest username:password
```

### 5. 事务日志和快照命令

**手动清理**：
```bash
# 手动清理事务日志和快照文件
/opt/zookeeper/bin/zkCleanup.sh -n 3 /var/lib/zookeeper
```

**查看快照信息**：
```bash
# 查看快照内容（需要下载ZooKeeper源码构建）
java -cp zookeeper.jar:lib/* org.apache.zookeeper.server.SnapshotFormatter /var/lib/zookeeper/version-2/snapshot.xxxx
```

## 四、应用场景与最佳实践

### 1. 配置管理

**实现方式**：
- 在ZooKeeper中创建配置节点，存储应用配置信息
- 应用程序监听配置节点的变化
- 当配置更新时，应用程序自动获取最新配置并应用

**最佳实践**：
- 使用持久节点存储配置信息
- 配置变更时使用事务保证一致性
- 应用程序实现优雅的配置重载机制

### 2. 命名服务

**实现方式**：
- 在ZooKeeper中创建命名空间节点
- 服务注册时在命名空间下创建临时节点
- 服务发现时查询命名空间下的子节点

**最佳实践**：
- 使用临时节点表示服务实例的存活状态
- 使用有序节点避免命名冲突
- 结合DNS或负载均衡器使用

### 3. 分布式锁

**实现方式**：
- 基于临时节点的分布式锁：在锁路径下创建临时节点
- 基于临时有序节点的分布式锁：在锁路径下创建临时有序节点，序号最小的节点获得锁

**最佳实践**：
- 使用临时节点确保锁的自动释放
- 实现超时机制避免死锁
- 使用公平锁算法（基于有序节点）

### 4. 领导者选举

**实现方式**：
- 在指定路径下创建临时有序节点
- 节点序号最小的实例成为领导者
- 其他实例监听领导者节点的变化

**最佳实践**：
- 实现领导者健康检查机制
- 避免频繁的领导选举（增加稳定性）
- 结合业务逻辑实现平滑的领导交接

## 五、常见问题及解决方案

### 1. 连接问题

**问题**：客户端无法连接到ZooKeeper服务器

**解决方案**：
- 检查网络连接和防火墙设置
- 确认ZooKeeper服务是否正常运行（`zkServer.sh status`）
- 验证clientPort配置是否正确
- 检查maxClientCnxns限制是否被触发

### 2. 会话超时

**问题**：客户端会话频繁超时

**解决方案**：
- 调整客户端会话超时时间（sessionTimeout）
- 确保客户端网络稳定
- 检查客户端心跳机制是否正常工作
- 考虑增加tickTime和initLimit配置值

### 3. 集群同步问题

**问题**：集群节点间数据不同步

**解决方案**：
- 检查网络连接和延迟
- 确保所有节点的系统时间同步
- 调整syncLimit和tickTime配置
- 查看ZooKeeper日志，识别同步失败的原因

### 4. 性能问题

**问题**：ZooKeeper响应缓慢

**解决方案**：
- 增加服务器资源（CPU、内存）
- 使用SSD存储提高IO性能
- 增加观察者节点（Observer）分担读压力
- 优化客户端代码，减少不必要的请求
- 适当调整JVM参数（堆内存、GC策略）

## 六、监控与维护

### 1. 日志监控

**主要日志文件**：
- ZooKeeper服务器日志：`/opt/zookeeper/logs/zookeeper.out`
- 事务日志：`${dataDir}/version-2/`
- 快照文件：`${dataDir}/version-2/`

**关键指标监控**：
- 请求延迟（latency）
- 连接数（connections）
- 未完成请求数（outstanding requests）
- 快照创建频率
- 事务日志增长速率

### 2. 健康检查

**四字命令健康检查**：
```bash
echo ruok | nc localhost 2181
```

**统计信息监控**：
```bash
echo mntr | nc localhost 2181
```

### 3. 备份与恢复

**数据备份**：
- 定期备份dataDir目录
- 可以使用脚本自动备份快照文件

**数据恢复**：
- 停止ZooKeeper服务
- 恢复备份的dataDir目录
- 重启ZooKeeper服务

### 4. 升级策略

**滚动升级**：
1. 停止一个Follower节点
2. 升级该节点的ZooKeeper版本
3. 重启该节点并确认其加入集群
4. 对其他Follower节点重复上述步骤
5. 最后升级Leader节点（会触发新的领导选举）

**升级注意事项**：
- 详细阅读升级文档中的兼容性说明
- 在测试环境验证升级流程
- 升级前备份所有数据
- 升级后监控系统稳定性