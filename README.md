# 技术图谱 - Java工程师的进阶之路

<div align="center">
  <img src="docs/public/technical-graph-doc.jpg" alt="技术图谱" width="400"/>
  <p>从底层原理到上层应用，构建完整的Java技术栈知识体系</p>
</div>

## 📚 项目简介

**技术图谱** 是一个面向Java工程师的学习资源库，旨在帮助开发者系统地学习和掌握Java技术栈的核心知识，从Java语言基础到高级框架与中间件，再到分布式系统和云原生技术，构建完整的技术知识体系。

本项目采用VitePress 1.6.4构建，提供了清晰的目录结构、丰富的学习资源和高效的搜索功能，帮助开发者在技术成长道路上少走弯路，实现高效进阶。

## ✨ 项目特点

- **系统化学习路径**：按照技术栈的层级关系组织内容，形成完整的知识图谱
- **深度与广度并重**：在核心技术领域深入讲解，同时覆盖广泛的技术生态
- **实用导向**：结合实际应用场景，注重技术的实际落地和最佳实践
- **持续更新**：跟踪技术发展趋势，及时更新内容，保持技术的前沿性
- **易于导航**：清晰的目录结构和导航设计，方便快速定位所需内容
- **高效搜索**：集成本地搜索功能，支持内容快速检索，提高学习效率
- **现代界面**：采用现代化的UI设计，提供良好的阅读体验

## 📁 目录结构

项目采用模块化的目录结构，主要内容位于`docs/guide/`目录下，按技术领域划分为多个子目录和文件：

```
docs/
├── .vitepress/                 # VitePress配置目录
│   ├── config.js               # 主配置文件
│   └── style.css               # 自定义样式文件
├── guide/                      # 主要内容目录
│   ├── java-core/              # Java语言核心
│   │   ├── core.md             # Java核心基础知识
│   │   ├── java-new-features/  # Java各版本新特性
│   │   ├── jvm.md              # JVM相关知识
│   │   ├── concurrency-programming/ # 并发编程
│   │   ├── java-rmi.md         # Java RMI
│   │   └── java-spi.md         # Java SPI
│   ├── framework-and-middleware/ # 框架与中间件
│   │   ├── mysql/              # MySQL数据库
│   │   ├── redis/              # Redis缓存
│   │   ├── kafka/              # Kafka消息队列
│   │   └── ...                 # 其他框架与中间件
│   ├── containerization-and-cloud-native/ # 容器化与云原生
│   ├── distributed-system/     # 分布式系统
│   ├── microservices-and-api-design/ # 微服务与API设计
│   ├── architecture-design/    # 架构设计
│   ├── system-security/        # 系统安全
│   ├── performance/            # 性能优化
│   ├── test-and-quality/       # 测试与质量保障
│   ├── development-tools/      # 开发工具
│   ├── practice/               # 工程实践
│   ├── new-tech/               # 新兴技术
│   ├── soft/                   # 软技能
│   └── java-language-overview.md # Java语言概述
├── index.md                    # 首页
└── public/                     # 静态资源文件
    ├── favicon.ico             # 网站图标
    ├── technical-graph-doc.jpg # 项目Logo
    └── ...                     # 其他静态资源
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0
- npm >= 7.0

### 安装依赖

由于项目依赖可能存在版本兼容性问题，建议使用`--legacy-peer-deps`选项安装：

```bash
npm install --legacy-peer-deps
```

### 本地开发

```bash
npm run docs:dev
```

启动后可以通过浏览器访问 [http://localhost:5173/technical-graph-doc/](http://localhost:5173/technical-graph-doc/) 查看文档。如果5173端口被占用，系统会自动尝试其他端口。

### 构建网站

```bash
npm run docs:build
```

构建后的文件将生成在 `docs/.vitepress/dist` 目录下，可以部署到任何静态网站托管服务。

## 🔍 搜索功能使用

本项目集成了高效的本地搜索功能，帮助你快速查找所需内容：

1. 在网站顶部导航栏中点击搜索图标或使用快捷键
2. 输入关键词进行搜索
3. 搜索结果会实时显示，点击结果可直接跳转至对应内容

搜索功能支持模糊匹配和关键词高亮显示，优化了用户体验。

## 🤝 贡献指南

我们欢迎并鼓励社区贡献。如果你有任何建议、问题或想要添加新的内容，请按照以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 🚀 自动部署

本项目配置了GitHub Actions自动部署流程，当代码推送到主分支时，会自动构建并部署到GitHub Pages。部署配置位于 `.github/workflows/deploy-docs.yml` 文件中。

你也可以使用项目根目录下的部署脚本手动部署：

```bash
./deploy-to-github-pages.sh
```

## 📝 许可协议

本项目采用 [MIT License](LICENSE) 许可协议。

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