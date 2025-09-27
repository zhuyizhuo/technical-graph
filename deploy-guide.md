# 技术图谱文档部署指南

本文档详细介绍了如何使用项目提供的部署脚本来构建和部署VuePress文档到GitHub Pages。

## 部署脚本概述

项目根目录下的 `deploy-to-code-generator.sh` 脚本是一个增强版部署工具，提供了以下特性：

- 自动检测系统环境（Node.js、npm、git）
- 支持命令行参数定制部署行为
- 完善的日志系统，方便排查问题
- 跨平台兼容性（支持Windows、macOS和Linux）
- 模块化结构，便于维护和扩展

## 部署前提条件

在使用部署脚本之前，请确保您的环境中已安装以下软件：

- **Node.js** (推荐 v14.0.0 或更高版本)
- **npm** (通常随Node.js一起安装)
- **Git** (需要配置好SSH密钥，能够访问GitHub仓库)

## 快速开始

### Mac/Linux 系统

在Mac或Linux系统上，您可以使用以下npm命令运行部署脚本：

```bash
# 标准部署
npm run docs:deploy

# 详细日志模式部署
npm run docs:deploy:verbose

# 清理模式部署（会先清理构建目录）
npm run docs:deploy:clean
```

### Windows 系统

在Windows系统上，使用专门为Windows优化的命令：

```bash
# Windows标准部署
npm run docs:deploy:win

# Windows详细日志模式部署
npm run docs:deploy:verbose:win

# Windows清理模式部署
npm run docs:deploy:clean:win
```

## 命令行参数详解

部署脚本支持以下命令行参数，可以根据需要组合使用：

| 参数 | 简写 | 说明 |
|------|------|------|
| `--verbose` | `-v` | 启用详细日志模式，显示更详细的执行过程信息 |
| `--clean` | `-c` | 清理模式，在构建前清空构建目录 |
| `--message` | `-m` | 自定义提交消息，默认为 `"更新文档 $(date '+%Y-%m-%d %H:%M:%S')"` |
| `--repo` | `-r` | 指定远程仓库地址，默认为 `git@github.com:zhuyizhuo/technical-graph-doc.git` |
| `--branch` | `-b` | 指定部署分支，默认为 `gh-pages` |
| `--help` | `-h` | 显示帮助信息并退出 |

### 示例

自定义提交消息和启用详细日志：

```bash
# Mac/Linux
bash deploy-to-code-generator.sh -v -m "更新技术图谱文档"

# Windows
ddeploy-to-code-generator.sh -v -m "更新技术图谱文档"
```

## 部署流程详解

当执行部署脚本时，它会按照以下步骤进行操作：

1. **环境检查**：验证Node.js、npm和git是否已正确安装
2. **依赖安装**：执行 `npm install` 确保项目依赖完整
3. **文档构建**：执行 `npm run docs:build` 构建VuePress文档
4. **Git配置**：初始化git仓库（如果需要），设置用户信息
5. **提交推送**：将构建好的文档提交并推送到指定的GitHub仓库和分支

## 常见问题排查

### 权限问题

如果在执行脚本时遇到权限错误，可以尝试以下解决方案：

1. 在Mac/Linux上，为脚本添加执行权限：
   ```bash
   chmod +x deploy-to-code-generator.sh
   ```

2. 如果遇到文件所有者问题，脚本会尝试自动修复权限，但如果失败，您可能需要手动修复：
   ```bash
   sudo chown -R $(whoami):$(id -gn) node_modules docs/.vuepress/dist
   ```

### Git连接问题

如果遇到GitHub连接问题，请确保：

1. 您的SSH密钥已正确配置并添加到GitHub账户
2. 您有权限访问目标仓库
3. 尝试使用 `ssh -T git@github.com` 测试SSH连接

### 构建失败

如果文档构建失败，请检查：

1. VuePress配置是否正确
2. 文档源文件是否有语法错误
3. 项目依赖是否已正确安装

## 自定义配置

如果需要长期使用特定的部署配置，可以考虑修改脚本中的默认值：

```bash
# 在脚本中修改以下默认值
DEFAULT_REPO="git@github.com:zhuyizhuo/technical-graph-doc.git"
DEFAULT_BRANCH="gh-pages"
```

## 自动化部署建议

为了简化部署流程，建议在项目的GitHub Actions中配置自动化部署，这样每次代码提交到主分支时，文档会自动重新部署。

## 联系我们

如果您在使用部署脚本时遇到任何问题，请在项目仓库中提交Issue或联系技术图谱团队。

---

**更新时间：** $(date '+%Y-%m-%d')
**技术图谱团队**