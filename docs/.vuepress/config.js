module.exports = {
  title: '技术图谱',
  description: '技术图谱',
  base: '/technical-graph-doc/',
  head: [['link', {rel: 'icon', href: '/favicon.ico'}]],
  themeConfig: {
    sidebarDepth: 3,
    logo: '/technical-graph-doc.jpg',
    nav: [
      { text: '首页', link: '/' },
      { text: '图谱', link: '/guide/java-core/index' },
      { text: 'GitHub', link: 'https://github.com/zhuyizhuo/technical-graph' }
    ],
    sidebar: {
      '/guide/': [
        {
          title: "Java 语言核心",
          collapsable: false,
          children: [
            "java-core/",
            "java-core/core",
            {
              title: "Java 版本新特性",
              collapsable: true,
              children: [
                "java-core/java-new-features/java8-new-features",
                "java-core/java-new-features/java11-new-features",
                "java-core/java-new-features/java17-new-features",
                "java-core/java-new-features/java21-new-features"
              ]
            },
            {
              title: "JVM",
              collapsable: true,
              children: ["java-core/jvm"]
            },
            {
              title: "并发编程",
              collapsable: true,
              children: ["java-core/concurrency-programming/"]
            }
          ]
        },
        {
          title: "框架与中间件",
          collapsable: false,
          children: [
            "framework-and-middleware",
            {
              title: "Dubbo",
              collapsable: true,
              children: ["framework-and-middleware/dubbo"]
            },
            {
              title: "Elasticsearch",
              collapsable: true,
              children: ["framework-and-middleware/elasticsearch"]
            },
            {
              title: "Kafka",
              collapsable: true,
              children: ["framework-and-middleware/kafka"]
            },
            {
              title: "MongoDB",
              collapsable: true,
              children: ["framework-and-middleware/mongodb"]
            },
            {
              title: "MyBatis",
              collapsable: true,
              children: ["framework-and-middleware/mybatis"]
            },
            {
              title: "MyCat",
              collapsable: true,
              children: ["framework-and-middleware/mycat"]
            },
            {
              title: "MySQL",
              collapsable: true,
              children: ["framework-and-middleware/mysql"]
            },
            {
              title: "RabbitMQ",
              collapsable: true,
              children: ["framework-and-middleware/rabbitmq"]
            },
            {
              title: "Redis",
              collapsable: true,
              children: ["framework-and-middleware/redis"]
            },
            {
              title: "RocketMQ",
              collapsable: true,
              children: ["framework-and-middleware/rocketmq"]
            },
            {
              title: "ShardingSphere",
              collapsable: true,
              children: ["framework-and-middleware/shardingsphere"]
            },
            {
              title: "Spring Cloud",
              collapsable: true,
              children: ["framework-and-middleware/spring-cloud"]
            },
            {
              title: "Spring Data",
              collapsable: true,
              children: ["framework-and-middleware/spring-data"]
            }
          ]
        },
        {
          title: "容器化与云原生",
          collapsable: false,
          children: [
            "containerization-and-cloud-native",
            {
              title: "Docker",
              collapsable: true,
              children: ["containerization-and-cloud-native/docker"]
            },
            {
              title: "CI/CD",
              collapsable: true,
              children: ["containerization-and-cloud-native/cicd"]
            },
            {
              title: "监控告警",
              collapsable: true,
              children: ["containerization-and-cloud-native/monitoring-alerting"]
            },
            {
              title: "日志管理",
              collapsable: true,
              children: ["containerization-and-cloud-native/log-management"]
            },
            {
              title: "配置管理",
              collapsable: true,
              children: ["containerization-and-cloud-native/configuration-management"]
            }
          ]
        },
        {
          title: "分布式系统",
          collapsable: false,
          children: [
            "distributed-system",
            {
              title: "分布式数据库",
              collapsable: true,
              children: ["distributed-system/distributed-database"]
            },
            {
              title: "分布式缓存",
              collapsable: true,
              children: ["distributed-system/distributed-cache"]
            },
            {
              title: "分布式服务治理",
              collapsable: true,
              children: ["distributed-system/distributed-service-governance"]
            },
            {
              title: "分布式调度",
              collapsable: true,
              children: ["distributed-system/distributed-scheduling"]
            }
          ]
        }
        // {
        //   title: "系统安全",
        //   collapsable: false,
        //   children: ["system-security"]
        // },
        // {
        //   title: "性能工程",
        //   collapsable: false,
        //   children: ["performance"]
        // },
        // {
        //   title: "工程实践",
        //   collapsable: false,
        //   children: ["practice"]
        // },
        // {
        //   title: "新兴技术",
        //   collapsable: false,
        //   children: ["new-tech"]
        // },
        // {
        //   title: "软技能",
        //   collapsable: false,
        //   children: ["soft"]
        // }
      ]
    }
  }
};
