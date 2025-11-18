import { defineConfig } from 'vitepress'

import { SearchPlugin } from 'vitepress-plugin-search'

export default defineConfig({
  // 添加搜索插件配置
  plugins: [
    SearchPlugin({
      placeholder: '搜索文档',
      buttonLabel: '搜索',
      cancelButtonLabel: '取消',
      noData: '没有找到结果',
      include: '**/*.md',
      depth: 6
    })
  ],
  
  title: '技术图谱',
  description: '从底层原理到上层应用，构建完整的Java技术栈知识体系',
  base: '/technical-graph-doc/',
  head: [
    ['link', { rel: 'icon', href: '/technical-graph-doc/favicon.ico' }],
    ['link', { rel: 'shortcut icon', href: '/technical-graph-doc/favicon.ico' }]
  ],
  ignoreDeadLinks: true,
  themeConfig: {
    // 添加搜索配置
    search: {
      provider: 'local',
      placeholder: '搜索文档',
      buttonLabel: '搜索',
      noData: '没有找到结果'
    },
    logo: '/technical-graph-doc.jpg',
    nav: [
      { text: '首页', link: '/' },
      { text: '图谱', link: '/guide/java-core/core.md' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: "Java 语言核心",
          collapsed: false,
          items: [
            { text: '核心基础', link: '/guide/java-core/core.md' },
            {
              text: "Java 版本新特性",
              collapsed: true,
              items: [
                { text: '概述', link: '/guide/java-core/java-new-features/' },
                { text: 'Java 8', link: '/guide/java-core/java-new-features/java8-new-features.md' },
                { text: 'Java 11', link: '/guide/java-core/java-new-features/java11-new-features.md' },
                { text: 'Java 17', link: '/guide/java-core/java-new-features/java17-new-features.md' },
                { text: 'Java 21', link: '/guide/java-core/java-new-features/java21-new-features.md' }
              ]
            },
            {
              text: "JVM",
              collapsed: true,
              items: [
                { text: 'JVM 基础', link: '/guide/java-core/jvm.md' },
                { text: 'Java 内存模型详解', link: '/guide/java-core/jvm-memory-model.md' },
                { text: 'JVM 内存优化', link: '/guide/java-core/jvm-memory-optimization.md' }
              ]
            },
            {
              text: "并发编程",
              collapsed: true,
              items: [
                { text: 'synchronized 锁', link: '/guide/java-core/concurrency-programming/synchronized-lock.md' },
                { text: 'ReentrantLock', link: '/guide/java-core/concurrency-programming/reentrant-lock.md' }
              ]
            },
            {
              text: "Java RMI",
              collapsed: true,
              items: [{ text: 'RMI 基础', link: '/guide/java-core/java-rmi.md' }]
            },
            {
              text: "Java SPI",
              collapsed: true,
              items: [{ text: 'SPI 基础', link: '/guide/java-core/java-spi.md' }]
            }
          ]
        },
        {
          text: "框架与中间件",
          collapsed: false,
          items: [
            {
              text: "数据库",
              collapsed: true,
              items: [
                {
                  text: "MySQL",
                  collapsed: true,
                  items: [
                    { text: 'MySQL 基础', link: '/guide/framework-and-middleware/mysql.md' },
                    { text: 'MySQL集群基础', link: '/guide/framework-and-middleware/mysql-cluster.md' }
                  ]
                },
                { text: 'PostgreSQL基础', link: '/guide/framework-and-middleware/postgresql.md' },
                { text: 'MongoDB 基础', link: '/guide/framework-and-middleware/mongodb.md' },
                { text: 'H2数据库基础', link: '/guide/framework-and-middleware/h2.md' },
                { text: 'SQLite基础', link: '/guide/framework-and-middleware/sqlite.md' }
              ]
            },
            {
              text: "缓存系统",
              collapsed: true,
              items: [{ text: 'Redis 基础', link: '/guide/framework-and-middleware/redis.md' }]
            },
            { text: "消息队列",
              collapsed: true,
              items: [
                { text: '消息队列概览', link: '/guide/framework-and-middleware/message-queue-overview.md' },
                { text: 'Kafka 基础', link: '/guide/framework-and-middleware/kafka.md' },
                { text: 'RabbitMQ 基础', link: '/guide/framework-and-middleware/rabbitmq.md' },
                { text: 'RocketMQ 基础', link: '/guide/framework-and-middleware/rocketmq.md' }
              ]
            },
            {
              text: "ORM框架",
              collapsed: true,
              items: [{ text: 'MyBatis 基础', link: '/guide/framework-and-middleware/mybatis.md' }]
            },
            {
              text: "分布式服务框架",
              collapsed: true,
              items: [
                { text: 'Dubbo 基础', link: '/guide/framework-and-middleware/dubbo.md' },
                { text: 'Spring Cloud 基础', link: '/guide/framework-and-middleware/spring-cloud.md' }
              ]
            },
            { text: "Spring生态",
              collapsed: true,
              items: [
                { text: 'Spring 基础', link: '/guide/framework-and-middleware/spring.md' },
                { text: 'Spring Boot 基础', link: '/guide/framework-and-middleware/springboot.md' },
                { text: 'Spring Data 基础', link: '/guide/framework-and-middleware/spring-data.md' },
                { text: 'Spring Security 基础', link: '/guide/framework-and-middleware/spring-security.md' }
              ]
            },
            {
              text: "数据分片中间件",
              collapsed: true,
              items: [
                { text: 'ShardingSphere 基础', link: '/guide/framework-and-middleware/shardingsphere.md' },
                { text: 'MyCat 基础', link: '/guide/framework-and-middleware/mycat.md' }
              ]
            },
            {
              text: "搜索相关",
              collapsed: true,
              items: [{ text: 'Elasticsearch 基础', link: '/guide/framework-and-middleware/elasticsearch.md' }]
            },
            {
              text: "其他工具",
              collapsed: true,
              items: [
                { text: 'LDAP 基础', link: '/guide/framework-and-middleware/ldap.md' },
                { text: '邮件协议基础', link: '/guide/framework-and-middleware/email-protocols.md' },
                { text: 'JNDI 基础', link: '/guide/framework-and-middleware/jndi.md' },
                { text: 'Shiro 基础', link: '/guide/framework-and-middleware/shiro.md' },
                { text: 'Quartz 基础', link: '/guide/framework-and-middleware/quartz.md' },
                { text: 'Jenkins 基础', link: '/guide/framework-and-middleware/jenkins.md' },
                { text: 'ZooKeeper 基础', link: '/guide/framework-and-middleware/zookeeper.md' }
              ]
            }
          ]
        },
        {
          text: "容器化与云原生",
          collapsed: false,
          items: [
            {
              text: "Docker",
              collapsed: true,
              items: [{ text: 'Docker 基础', link: '/guide/containerization-and-cloud-native/docker.md' }]
            },
            {
              text: "PolarDB",
              collapsed: true,
              items: [{ text: 'PolarDB 基础', link: '/guide/containerization-and-cloud-native/polardb.md' }]
            },
            {
              text: "CI/CD",
              collapsed: true,
              items: [{ text: 'CI/CD 基础', link: '/guide/containerization-and-cloud-native/cicd.md' }]
            },
            {
              text: "监控告警",
              collapsed: true,
              items: [{ text: '监控告警 基础', link: '/guide/containerization-and-cloud-native/monitoring-alerting.md' }]
            },
            {
              text: "日志管理",
              collapsed: true,
              items: [{ text: '日志管理 基础', link: '/guide/containerization-and-cloud-native/log-management.md' }]
            },
            {
              text: "配置管理",
              collapsed: true,
              items: [{ text: '配置管理 基础', link: '/guide/containerization-and-cloud-native/configuration-management.md' }]
            },
            {
              text: "Nginx",
              collapsed: true,
              items: [{ text: 'Nginx 基础', link: '/guide/containerization-and-cloud-native/nginx.md' }]
            },
            {
              text: "MinIO",
              collapsed: true,
              items: [{ text: 'MinIO 基础', link: '/guide/containerization-and-cloud-native/minio.md' }]
            }
          ]
        },
        {
          text: "分布式系统",
          collapsed: false,
          items: [
            {
              text: "分布式数据库",
              collapsed: true,
              items: [{ text: '分布式数据库 基础', link: '/guide/distributed-system/distributed-database.md' }]
            },
            {
              text: "分布式缓存",
              collapsed: true,
              items: [{ text: '分布式缓存 基础', link: '/guide/distributed-system/distributed-cache.md' }]
            },
            {
              text: "分布式服务治理",
              collapsed: true,
              items: [{ text: '分布式服务治理 基础', link: '/guide/distributed-system/distributed-service-governance.md' }]
            },
            {
              text: "分布式调度",
              collapsed: true,
              items: [{ text: '分布式调度 基础', link: '/guide/distributed-system/distributed-scheduling.md' }]
            },
            {
              text: "分布式缓存问答",
              collapsed: true,
              items: [{ text: 'Memcached 问答', link: '/guide/distributed-system/memcached-qa.md' }]
            }
          ]
        },
        {
          text: "测试与质量保障",
          collapsed: false,
          items: [
            { text: '概述', link: '/guide/test-and-quality/' }
          ]
        },
        {
          text: "开发工具与效率",
          collapsed: false,
          items: [
            { text: '概述', link: '/guide/development-tools/' },
            { text: 'IntelliJ IDEA', link: '/guide/development-tools/idea.md' },
            { text: 'Sublime Text', link: '/guide/development-tools/sublime.md' },
            { text: 'Trae', link: '/guide/development-tools/trae.md' },
            { text: 'Visual Studio Code', link: '/guide/development-tools/vscode.md' },
            { text: 'Emmet语法', link: '/guide/development-tools/emmet.md' },
            { text: 'Gradle', link: '/guide/development-tools/gradle.md' },
            { text: 'Maven', link: '/guide/development-tools/maven.md' }
          ]
        },
        {
          text: "系统安全",
          collapsed: false,
          items: [
            {
              text: "身份认证与授权",
              collapsed: true,
              items: [
                { text: 'OAuth2', link: '/guide/system-security/identity-authentication/oauth2.md' },
                { text: 'JWT', link: '/guide/system-security/identity-authentication/jwt.md' }
              ]
            },
            {
              text: "网络安全",
              collapsed: true,
              items: [
                { text: 'HTTPS/SSL', link: '/guide/system-security/network-security/https-ssl.md' },
                { text: '防火墙', link: '/guide/system-security/network-security/firewall.md' },
                { text: '网络隔离', link: '/guide/system-security/network-security/network-isolation.md' }
              ]
            }
          ]
        },
        {
          text: "架构设计",
          collapsed: false,
          items: [
            { text: '系统架构', link: '/guide/architecture-design/system-architecture.md' },
            { text: '领域驱动设计', link: '/guide/architecture-design/domain-driven-design.md' },
            {
              text: "设计模式",
              collapsed: true,
              items: [
                { text: '设计模式概述', link: '/guide/architecture-design/design-patterns/' }
              ]
            }
          ]
        },
        {
          text: "微服务与API设计",
          collapsed: false,
          items: [
            { text: 'API设计', link: '/guide/microservices-and-api-design/api-design.md' },
            { text: '微服务架构', link: '/guide/microservices-and-api-design/microservices-architecture.md' },
            { text: 'Postman指南', link: '/guide/microservices-and-api-design/postman-guide.md' }
          ]
        },
        {
          text: "性能优化",
          collapsed: false,
          items: [
            { text: 'APM工具', link: '/guide/performance/apm-tools.md' }
          ]
        }
      ]
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/zhuyizhuo/technical-graph'
      }
    ],
    footer: {
      message: '基于 MIT 许可发布',
      copyright: '版权所有 © 2025 yizhuo'
    }
  }
})