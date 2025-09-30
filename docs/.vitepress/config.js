import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '技术图谱',
  description: '从底层原理到上层应用，构建完整的Java技术栈知识体系',
  base: '/technical-graph-doc/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  ignoreDeadLinks: true,
  themeConfig: {
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
              items: [{ text: 'JVM 基础', link: '/guide/java-core/jvm.md' }]
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
              text: "Dubbo",
              collapsed: true,
              items: [{ text: 'Dubbo 基础', link: '/guide/framework-and-middleware/dubbo.md' }]
            },
            {
              text: "Elasticsearch",
              collapsed: true,
              items: [{ text: 'Elasticsearch 基础', link: '/guide/framework-and-middleware/elasticsearch.md' }]
            },
            {
              text: "Kafka",
              collapsed: true,
              items: [{ text: 'Kafka 基础', link: '/guide/framework-and-middleware/kafka.md' }]
            },
            {
              text: "MongoDB",
              collapsed: true,
              items: [{ text: 'MongoDB 基础', link: '/guide/framework-and-middleware/mongodb.md' }]
            },
            {
              text: "MyBatis",
              collapsed: true,
              items: [{ text: 'MyBatis 基础', link: '/guide/framework-and-middleware/mybatis.md' }]
            },
            {
              text: "MyCat",
              collapsed: true,
              items: [{ text: 'MyCat 基础', link: '/guide/framework-and-middleware/mycat.md' }]
            },
            {
              text: "MySQL",
              collapsed: true,
              items: [{ text: 'MySQL 基础', link: '/guide/framework-and-middleware/mysql.md' }]
            },
            {
              text: "RabbitMQ",
              collapsed: true,
              items: [{ text: 'RabbitMQ 基础', link: '/guide/framework-and-middleware/rabbitmq.md' }]
            },
            {
              text: "Redis",
              collapsed: true,
              items: [{ text: 'Redis 基础', link: '/guide/framework-and-middleware/redis.md' }]
            },
            {
              text: "RocketMQ",
              collapsed: true,
              items: [{ text: 'RocketMQ 基础', link: '/guide/framework-and-middleware/rocketmq.md' }]
            },
            {
              text: "ShardingSphere",
              collapsed: true,
              items: [{ text: 'ShardingSphere 基础', link: '/guide/framework-and-middleware/shardingsphere.md' }]
            },
            {
              text: "Spring Boot",
              collapsed: true,
              items: [{ text: 'Spring Boot 基础', link: '/guide/framework-and-middleware/springboot.md' }]
            },
            {
              text: "Spring Cloud",
              collapsed: true,
              items: [{ text: 'Spring Cloud 基础', link: '/guide/framework-and-middleware/spring-cloud.md' }]
            },
            {
              text: "Spring Data",
              collapsed: true,
              items: [{ text: 'Spring Data 基础', link: '/guide/framework-and-middleware/spring-data.md' }]
            },
            {
              text: "LDAP",
              collapsed: true,
              items: [{ text: 'LDAP 基础', link: '/guide/framework-and-middleware/ldap.md' }]
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
            { text: 'Visual Studio Code', link: '/guide/development-tools/vscode.md' }
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
        }
      ]
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/zhuyizhuo/technical-graph'
      }
    ]
  }
})