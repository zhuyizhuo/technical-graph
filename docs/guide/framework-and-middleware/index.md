# 框架与中间件

框架与中间件是现代Java应用开发的重要基础设施，它们提供了丰富的功能组件和最佳实践，极大地提高了开发效率和系统质量。本模块将介绍Java生态系统中常用的框架与中间件，帮助您选择合适的技术栈构建高质量的应用系统。

## 模块知识体系

```markdown
├── 🌸 Spring 生态系统
│   ├── Spring Framework
│   │   ├── IOC/DI
│   │   ├── AOP
│   │   ├── 事务管理
│   │   └── Spring EL
│   │
│   ├── Spring Boot
│   │   ├── 自动配置
│   │   ├── Starter 原理
│   │   ├── 监控 Actuator
│   │   └── 外部化配置
│   │
│   ├── Spring Cloud
│   │   ├── 服务注册发现 (Eureka/Nacos)
│   │   ├── 配置中心 (Config/Nacos)
│   │   ├── 服务网关 (Gateway/Zuul)
│   │   ├── 负载均衡 (Ribbon)
│   │   ├── 服务熔断 (Hystrix/Sentinel)
│   │   ├── 分布式追踪 (Sleuth/Zipkin)
│   │   └── 消息驱动 (Stream)
│   │
│   └── Spring Data
│       ├── Spring Data JPA
│       ├── Spring Data Redis
│       └── Spring Data MongoDB
│
├── 💾 数据库技术
│   ├── SQL 数据库
│   │   ├── MySQL (高级特性、优化)
│   │   ├── PostgreSQL
│   │   └── Oracle
│   │
│   ├── NoSQL 数据库
│   │   ├── Redis (集群、持久化)
│   │   ├── MongoDB (分片、复制集)
│   │   ├── Elasticsearch
│   │   └── Cassandra
│   │
│   ├── ORM 框架
│   │   ├── MyBatis (原理、插件开发)
│   │   └── Hibernate (缓存、性能)
│   │
│   └── 数据库中间件
│       ├── ShardingSphere
│       ├── MyCat
│       └── 数据同步工具
```

## 模块内容概览

本模块按照功能分类，包含以下核心内容：

### [数据库](mysql.md)
- **MySQL**：流行的关系型数据库，包括[基础](mysql.md)和[集群](mysql-cluster.md)相关知识
- **PostgreSQL**：功能强大的开源关系型数据库
- **MongoDB**：面向文档的NoSQL数据库
- **H2数据库**：轻量级嵌入式数据库
- **SQLite**：轻量级文件数据库

### [缓存系统](redis.md)
- **Redis**：高性能键值存储，广泛用于缓存、会话存储等场景

### [消息队列](kafka.md)
- **Kafka**：高吞吐量的分布式流处理平台
- **RabbitMQ**：基于AMQP协议的消息队列
- **RocketMQ**：阿里开源的分布式消息中间件

### [ORM框架](mybatis.md)
- **MyBatis**：支持自定义SQL、存储过程和高级映射的持久层框架

### [分布式服务框架](dubbo.md)
- **Dubbo**：高性能的分布式服务框架
- **Spring Cloud**：微服务生态系统

### [Spring生态](springboot.md)
- **Spring Boot**：简化Spring应用开发的框架
- **Spring Data**：提供统一的数据访问编程模型

### [数据分片中间件](shardingsphere.md)
- **ShardingSphere**：开源分布式数据库中间件生态系统
- **MyCat**：开源的分布式数据库中间件

### [搜索相关](elasticsearch.md)
- **Elasticsearch**：分布式搜索和分析引擎

### [其他工具](ldap.md)
- **LDAP**：轻量目录访问协议实现
- **邮件协议**：电子邮件相关协议实现
- **Jenkins**：开源的持续集成/持续部署工具
- **Navicat Lite**：轻量级数据库管理工具
- **XXL-JOB**：轻量级分布式任务调度平台

通过本模块的学习，您将全面了解Java生态系统中的主流框架与中间件，掌握它们的核心概念和使用方法，为构建高性能、可扩展的Java应用系统提供技术支持。