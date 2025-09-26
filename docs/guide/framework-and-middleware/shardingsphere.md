# ShardingSphere 文档

## 一、核心概念与概述

### 1.1 什么是 ShardingSphere

ShardingSphere 是一套开源的分布式数据库中间件解决方案，提供了数据分片、分布式事务、数据库治理等功能，致力于简化分布式数据库操作。

- **模块化架构**：由 ShardingSphere-JDBC、ShardingSphere-Proxy 和 ShardingSphere-Sidecar 三个产品组成
- **透明化访问**：对应用程序屏蔽底层分布式数据库的复杂性
- **增量功能**：在不改变现有数据库结构的情况下，逐步引入分布式能力

### 1.2 发展历程与生态

ShardingSphere 起源于 2016 年，最初是一个单纯的数据分片框架，经过多年发展，已成为功能完备的分布式数据库中间件生态系统：

- 2016 年：发布 Sharding-JDBC 1.0
- 2018 年：更名为 ShardingSphere，同时发布 ShardingSphere-Proxy
- 2020 年：进入 Apache 孵化器
- 2022 年：成为 Apache 顶级项目

### 1.3 应用场景

ShardingSphere 适用于以下场景：

- **高并发访问**：需要通过读写分离、数据分片提升系统吞吐量
- **海量数据存储**：单库存储容量达到瓶颈，需要水平扩展
- **多数据源整合**：需要统一管理和操作多个异构数据源
- **分布式事务处理**：需要在分布式环境中保证数据一致性

## 二、核心组件与架构

### 2.1 整体架构

ShardingSphere 采用了多层架构设计，包括：

- **接入层**：提供 JDBC、MySQL/PostgreSQL 协议、Kubernetes Sidecar 多种接入方式
- **功能层**：包含数据分片、分布式事务、数据库治理等核心功能模块
- **基础设施层**：提供配置中心、注册中心、分布式锁等公共基础设施

```
┌─────────────────────────────────────────────────────────────────┐
│                    用户应用程序                                  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────────────┐
│                           接入层                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ ShardingSphere│  │ ShardingSphere│  │ ShardingSphere-Sidecar ││
│  │   -JDBC      │  │   -Proxy     │  │                       ││
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────────────┐
│                           功能层                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ 数据分片     │  │ 分布式事务   │  │ 数据库治理            │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────────────┐
│                         基础设施层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ 配置中心     │  │ 注册中心     │  │ 分布式锁              │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────────────┐
│                      后端数据库集群                               │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件介绍

#### 2.2.1 ShardingSphere-JDBC

轻量级 Java ORM 框架增强版，以 JDBC 驱动的形式嵌入到应用程序中：

- **零侵入性**：对应用程序代码无侵入，只需修改数据源配置
- **高性能**：客户端直连数据库，无额外网络开销
- **支持所有基于 JDBC 的 ORM 框架**：如 JPA、Hibernate、MyBatis 等

#### 2.2.2 ShardingSphere-Proxy

透明化的数据库代理服务，提供 MySQL/PostgreSQL 协议接口：

- **多语言支持**：任何支持 MySQL/PostgreSQL 协议的客户端都可使用
- **集中式管理**：配置集中管理，应用程序无需感知分片规则
- **完整的数据库功能**：支持复杂 SQL、视图、存储过程等

#### 2.2.3 ShardingSphere-Sidecar

Kubernetes 环境下的服务网格组件，以 Sidecar 模式部署：

- **云原生设计**：与 Kubernetes 深度集成
- **自动扩缩容**：配合 Kubernetes 实现自动扩缩容
- **服务网格兼容**：可与 Istio 等服务网格组件协同工作

## 三、数据分片功能详解

### 3.1 分片策略

ShardingSphere 提供了多种分片策略，满足不同场景需求：

#### 3.1.1 精确分片策略

根据分片键的精确值进行分片，适用于如按用户 ID 分片的场景：

```java
// 精确分片策略配置示例
props.put("sharding.jdbc.config.sharding.tables.t_order.database-strategy.standard.sharding-column", "user_id");
props.put("sharding.jdbc.config.sharding.tables.t_order.database-strategy.standard.precise-algorithm-class-name", "com.example.PreciseModuloDatabaseShardingAlgorithm");
```

#### 3.1.2 范围分片策略

根据分片键的范围进行分片，适用于如按时间范围分片的场景：

```java
// 范围分片策略配置示例
props.put("sharding.jdbc.config.sharding.tables.t_order.table-strategy.complex.sharding-columns", "order_id,create_time");
props.put("sharding.jdbc.config.sharding.tables.t_order.table-strategy.complex.algorithm-class-name", "com.example.ComplexShardingAlgorithm");
```

#### 3.1.3 复合分片策略

结合多个分片键进行分片，适用于复杂业务场景：

```java
// 复合分片策略配置示例
props.put("sharding.jdbc.config.sharding.tables.t_order_item.table-strategy.complex.sharding-columns", "order_id,user_id");
props.put("sharding.jdbc.config.sharding.tables.t_order_item.table-strategy.complex.algorithm-class-name", "com.example.MultiKeyShardingAlgorithm");
```

### 3.2 分片算法

ShardingSphere 内置了多种分片算法，并支持自定义分片算法：

- **取模分片算法**：基于分片键的哈希值对分片数量取模
- **哈希分片算法**：基于分片键的哈希值进行分片
- **范围分片算法**：基于分片键的值范围进行分片
- **时间分片算法**：基于时间字段进行分片
- **自动递增分片算法**：基于分片键的递增特性进行分片

### 3.3 分片键设计

合理的分片键设计是实现高效数据分片的关键：

- **唯一性**：分片键应该能够唯一标识一条记录
- **均匀分布**：确保数据能够均匀分布到各个分片
- **查询友好**：尽量与业务查询条件匹配，减少跨分片查询
- **不可变性**：分片键值应尽量保持不变，避免数据迁移

## 四、分布式事务

### 4.1 事务类型

ShardingSphere 支持多种分布式事务解决方案：

#### 4.1.1 XA 事务

基于 XA 协议的两阶段提交事务，保证强一致性：

- **优点**：保证数据强一致性
- **缺点**：性能较低，存在长事务阻塞风险
- **适用场景**：对数据一致性要求极高的业务场景

#### 4.1.2 AT 事务

基于 TCC (Try-Confirm-Cancel) 思想的改进型事务，保证最终一致性：

- **优点**：性能较好，无阻塞
- **缺点**：需要应用层配合，有代码侵入性
- **适用场景**：对性能要求较高，可接受最终一致性的场景

#### 4.1.3 BASE 事务

基于 SAGA 模式的柔性事务，保证最终一致性：

- **优点**：完全异步，性能最高
- **缺点**：实现复杂度高，一致性最弱
- **适用场景**：对性能要求极高，业务流程明确的场景

### 4.2 事务隔离级别

ShardingSphere 支持多种事务隔离级别：

- **读未提交（READ_UNCOMMITTED）**
- **读已提交（READ_COMMITTED）**
- **可重复读（REPEATABLE_READ）**
- **串行化（SERIALIZABLE）**

### 4.3 事务管理配置

以下是配置 XA 事务的示例：

```java
// 配置 XA 事务
props.put("sharding.jdbc.config.sharding.props.sql.show", "true");
props.put("sharding.jdbc.config.sharding.props.max.connections.size.per.query", "1");
props.put("sharding.jdbc.config.sharding.transaction.type", "XA");
```

## 五、数据库治理功能

### 5.1 配置中心

ShardingSphere 支持多种配置中心，实现配置的集中管理和动态更新：

- **ZooKeeper**：分布式协调服务，提供高可用的配置存储
- **Nacos**：阿里巴巴开源的配置中心和服务发现平台
- **Etcd**：云原生时代的配置存储和服务发现系统
- **Apollo**：携程开源的分布式配置中心

### 5.2 注册中心

通过注册中心实现实例的自动发现和管理：

- **服务注册**：自动注册数据库实例信息
- **健康检查**：定期检查实例健康状态
- **动态扩缩容**：支持实例的动态添加和移除

### 5.3 分布式锁

提供分布式锁机制，保证分布式环境下的数据一致性：

- **基于 ZooKeeper 的分布式锁**
- **基于 Redis 的分布式锁**
- **基于数据库的分布式锁**

## 六、基本使用指南

### 6.1 ShardingSphere-JDBC 快速开始

#### 6.1.1 引入依赖

```xml
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>shardingsphere-jdbc-core</artifactId>
    <version>5.1.1</version>
</dependency>
```

#### 6.1.2 配置分片规则

```java
// 创建数据源集合
Map<String, DataSource> dataSourceMap = new HashMap<>();

// 配置第一个数据源
BasicDataSource dataSource1 = new BasicDataSource();
dataSource1.setDriverClassName("com.mysql.jdbc.Driver");
dataSource1.setUrl("jdbc:mysql://localhost:3306/ds0");
dataSource1.setUsername("root");
dataSource1.setPassword("password");
dataSourceMap.put("ds0", dataSource1);

// 配置第二个数据源
BasicDataSource dataSource2 = new BasicDataSource();
dataSource2.setDriverClassName("com.mysql.jdbc.Driver");
dataSource2.setUrl("jdbc:mysql://localhost:3306/ds1");
dataSource2.setUsername("root");
dataSource2.setPassword("password");
dataSourceMap.put("ds1", dataSource2);

// 配置分片规则
ShardingRuleConfiguration shardingRuleConfig = new ShardingRuleConfiguration();

// 配置表分片规则
TableRuleConfiguration orderTableRuleConfig = new TableRuleConfiguration("t_order", "ds${0..1}.t_order${0..1}");

// 配置分库策略
orderTableRuleConfig.setDatabaseShardingStrategy(new StandardShardingStrategyConfiguration("user_id", new PreciseModuloDatabaseShardingAlgorithm()));

// 配置分表策略
orderTableRuleConfig.setTableShardingStrategy(new StandardShardingStrategyConfiguration("order_id", new PreciseModuloTableShardingAlgorithm()));

shardingRuleConfig.getTables().add(orderTableRuleConfig);

// 创建 ShardingSphere 数据源
DataSource dataSource = ShardingSphereDataSourceFactory.createDataSource(dataSourceMap, Collections.singleton(shardingRuleConfig), new Properties());
```

#### 6.1.3 使用数据源

```java
// 获取数据库连接
Connection conn = dataSource.getConnection();

// 创建 SQL 语句
PreparedStatement pstmt = conn.prepareStatement("INSERT INTO t_order (order_id, user_id, status) VALUES (?, ?, ?)");
pstmt.setLong(1, 1001);
pstmt.setLong(2, 100);
pstmt.setString(3, "SUCCESS");
pstmt.executeUpdate();

// 关闭连接
pstmt.close();
conn.close();
```

### 6.2 ShardingSphere-Proxy 快速开始

#### 6.2.1 下载安装

从 Apache 官网下载 ShardingSphere-Proxy 发行包，并解压到本地目录。

#### 6.2.2 配置分片规则

编辑 `conf/server.yaml` 配置认证信息：

```yaml
rules:
  - !AUTHORITY
    users:
      - root@%:root
      - sharding@:sharding
    provider:
      type: ALL_PERMITTED

props:
  max-connections-size-per-query: 1
  acceptor-size: 16  # The default value is cpu core count
  executor-size: 16  # Infinite by default
  proxy-frontend-flush-threshold: 128  # The default value is 128
  proxy-opentracing-enabled: false
  proxy-hint-enabled: false
  query-with-cipher-column: false
  sql-show: false
```

编辑 `conf/config-sharding.yaml` 配置分片规则：

```yaml
dataSources:
  ds_0:
    url: jdbc:mysql://localhost:3306/ds0?serverTimezone=UTC&useSSL=false
    username: root
    password: password
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
  ds_1:
    url: jdbc:mysql://localhost:3306/ds1?serverTimezone=UTC&useSSL=false
    username: root
    password: password
    connectionTimeoutMilliseconds: 30000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50

rules:
  - !SHARDING
    tables:
      t_order:
        actualDataNodes: ds_${0..1}.t_order_${0..1}
        tableStrategy:
          standard:
            shardingColumn: order_id
            shardingAlgorithmName: t_order_inline
        databaseStrategy:
          standard:
            shardingColumn: user_id
            shardingAlgorithmName: database_inline
    shardingAlgorithms:
      database_inline:
        type: INLINE
        props:
          algorithm-expression: ds_${user_id % 2}
      t_order_inline:
        type: INLINE
        props:
          algorithm-expression: t_order_${order_id % 2}
```

#### 6.2.3 启动服务

执行以下命令启动 ShardingSphere-Proxy：

```bash
# Linux/Unix
bin/start.sh

# Windows
bin/start.bat
```

#### 6.2.4 客户端连接

使用任何 MySQL 客户端连接 ShardingSphere-Proxy：

```bash
mysql -h localhost -P 3307 -u root -p
```

## 七、高级特性

### 7.1 读写分离

ShardingSphere 支持数据库读写分离，提高系统整体吞吐量：

- **一主多从**：支持一个主库多个从库的架构
- **多主多从**：支持多个主库多个从库的架构
- **动态切换**：支持根据 SQL 类型自动切换读写库
- **负载均衡**：支持多种从库负载均衡策略

### 7.2 数据脱敏

提供数据脱敏功能，保护敏感数据安全：

- **多种加密算法**：支持 AES、RSA、MD5 等多种加密算法
- **列级加密**：支持对指定列进行加密存储和解密查询
- **透明加密**：应用程序无需关心加密逻辑，对业务代码无侵入

### 7.3 影子库

支持影子库功能，实现线上灰度测试：

- **SQL 拦截**：根据规则拦截特定 SQL 路由到影子库
- **影子表**：支持影子表与生产表的映射关系
- **动态规则**：支持动态调整影子库路由规则

### 7.4 高可用

提供完善的高可用机制，确保系统稳定运行：

- **故障检测**：自动检测数据库实例故障
- **自动切换**：支持主库故障自动切换到备库
- **优雅降级**：支持部分分片不可用时的优雅降级

## 八、最佳实践

### 8.1 分片设计最佳实践

1. **合理选择分片键**：选择查询频率高、分布均匀的字段作为分片键

2. **分片数量规划**：
   - 分片数量不宜过多，建议控制在 200 以内
   - 考虑未来 3-5 年的数据增长，预留扩展空间
   - 结合硬件资源和性能需求进行调整

3. **避免跨分片查询**：
   - 设计业务逻辑时尽量基于分片键进行查询
   - 必须跨分片查询时，优化 SQL 语句减少数据传输

4. **热点数据处理**：
   - 对热点数据进行单独分片或缓存
   - 使用一致性哈希等算法分散热点数据

### 8.2 性能优化

1. **连接池优化**：
   - 合理设置连接池大小
   - 使用连接池预热
   - 配置合适的连接超时和空闲超时时间

2. **SQL 优化**：
   - 避免使用复杂 SQL 和子查询
   - 合理使用索引
   - 避免全表扫描

3. **缓存策略**：
   - 引入本地缓存和分布式缓存
   - 对热点数据进行缓存
   - 合理设置缓存过期时间

### 8.3 部署架构建议

1. **小型应用**：单实例部署 ShardingSphere-JDBC

2. **中型应用**：集群部署 ShardingSphere-JDBC + 配置中心

3. **大型应用**：ShardingSphere-Proxy 集群 + ShardingSphere-JDBC 混合部署

## 九、常见问题与解决方案

### 9.1 数据不一致问题

**问题现象**：分片后，不同分片间数据出现不一致。

**解决方案**：
- 使用分布式事务保证数据一致性
- 合理设计分片键，避免分布式事务
- 引入最终一致性机制，如消息队列补偿

### 9.2 跨分片查询性能问题

**问题现象**：执行跨分片查询时，响应时间过长。

**解决方案**：
- 优化 SQL 语句，减少返回数据量
- 引入读写分离，分散查询压力
- 调整分片策略，尽量避免跨分片查询
- 使用二级缓存缓存查询结果

### 9.3 热点分片问题

**问题现象**：部分分片数据量过大或访问频率过高，成为性能瓶颈。

**解决方案**：
- 重新设计分片策略，采用复合分片键
- 对热点数据进行单独分片或缓存
- 考虑数据迁移，手动调整数据分布

### 9.4 扩容问题

**问题现象**：随着数据量增长，需要增加分片数量。

**解决方案**：
- 采用预分片策略，提前规划足够的分片数量
- 使用在线数据迁移工具，如 ShardingSphere-Scaling
- 考虑使用一致性哈希分片算法，减少数据迁移量

## 十、总结与展望

ShardingSphere 作为开源的分布式数据库中间件解决方案，为开发者提供了完整的数据分片、分布式事务和数据库治理功能，帮助企业轻松应对高并发、海量数据存储的挑战。

未来，ShardingSphere 将继续朝着以下方向发展：

- **云原生深度整合**：进一步增强与 Kubernetes、Istio 等云原生组件的集成
- **多模态数据处理**：支持结构化数据和非结构化数据的混合分片
- **智能化运维**：引入 AI 技术，实现自动调优和故障自愈
- **全球化部署支持**：提供跨区域、跨数据中心的部署和数据同步能力

通过持续的技术创新和社区贡献，ShardingSphere 将为分布式数据库领域提供更加完善的解决方案。