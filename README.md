# 技术图谱 - Java工程师的进阶之路

<div align="center">
  <img src="docs/.vuepress/public/technical-graph-doc.jpg" alt="技术图谱" width="400"/>
  <p>从底层原理到上层应用，构建完整的Java技术栈知识体系</p>
</div>

## 📚 项目简介

**技术图谱** 是一个面向Java工程师的学习资源库，旨在帮助开发者系统地学习和掌握Java技术栈的核心知识，从Java语言基础到高级框架与中间件，再到分布式系统和云原生技术，构建完整的技术知识体系。

本项目采用VuePress构建，提供了清晰的目录结构和丰富的学习资源，帮助开发者在技术成长道路上少走弯路，实现高效进阶。

## ✨ 项目特点

- **系统化学习路径**：按照技术栈的层级关系组织内容，形成完整的知识图谱
- **深度与广度并重**：在核心技术领域深入讲解，同时覆盖广泛的技术生态
- **实用导向**：结合实际应用场景，注重技术的实际落地和最佳实践
- **持续更新**：跟踪技术发展趋势，及时更新内容，保持技术的前沿性
- **易于导航**：清晰的目录结构和导航设计，方便快速定位所需内容

## 📁 目录结构

项目采用模块化的目录结构，主要内容位于`docs/guide/`目录下，按技术领域划分为多个子目录和文件：

```
docs/
├── guide/
│   ├── java-core/              # Java语言核心
│   │   ├── core.md             # Java核心基础知识
│   │   ├── java-new-features/  # Java各版本新特性
│   │   ├── jvm.md              # JVM相关知识
│   │   └── concurrency-programming/ # 并发编程
│   ├── framework-and-middleware/ # 框架与中间件
│   │   ├── dubbo/              # Dubbo框架
│   │   ├── elasticsearch/      # Elasticsearch
│   │   ├── kafka/              # Kafka
│   │   ├── redis/              # Redis
│   │   └── ...                 # 其他框架与中间件
│   ├── containerization-and-cloud-native/ # 容器化与云原生
│   ├── distributed-system/     # 分布式系统
│   ├── system-security.md      # 系统安全
│   ├── performance.md          # 性能工程
│   ├── practice.md             # 工程实践
│   ├── new-tech.md             # 新兴技术
│   └── soft.md                 # 软技能
└── .vuepress/                  # VuePress配置
```

## 🚀 快速开始

### 环境要求
- Node.js >= 10.16
- npm >= 6.9

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run docs:dev
```

启动后可以通过浏览器访问 [http://localhost:8080/technical-graph-doc/](http://localhost:8080/technical-graph-doc/) 查看文档。

### 构建网站

```bash
npm run docs:build
```

构建后的文件将生成在 `docs/.vuepress/dist` 目录下，可以部署到任何静态网站托管服务。

## 🤝 贡献指南

我们欢迎并鼓励社区贡献。如果你有任何建议、问题或想要添加新的内容，请按照以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📝 许可协议

本项目采用 [Apache License 2.0](LICENSE) 许可协议。

## 🔗 相关链接

- [在线文档](https://zhuyizhuo.github.io/technical-graph-doc/) 
- [GitHub 仓库](https://github.com/zhuyizhuo/technical-graph)

## 📧 联系我们

如有任何问题或建议，请随时联系我们。

---

<div align="center">
  <p>感谢您对技术图谱项目的关注与支持！</p>
  <p>让我们一起构建更完整的Java技术知识体系 🚀</p>
</div>