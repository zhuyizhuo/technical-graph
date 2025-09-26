#!/usr/bin/env bash

# 设置调试模式，显示每个执行的命令
#set -x

# 注释掉set -e，因为它会导致环境变量文件加载失败时脚本立即退出
#set -e

echo "脚本开始执行..."

# 暂时保存当前的错误处理设置
saved_set="$(set +o)"
# 禁用错误退出，以便安全地加载环境变量文件
set +e

echo "正在设置环境变量..."
echo "当前用户: $(whoami)"
echo "当前目录: $(pwd)"
source /etc/profile 2>/dev/null || echo "警告：无法加载/etc/profile"
source ~/.bashrc 2>/dev/null || echo "警告：无法加载~/.bashrc"
source ~/.zshrc 2>/dev/null || echo "警告：无法加载~/.zshrc"
echo "环境变量设置完成"

# 恢复之前的错误处理设置
eval "$saved_set"

# 重新启用错误退出，但添加管道失败也会退出的设置（这是更安全的设置）
set -eo pipefail

# 配置项
REPO_URL="git@github.com:zhuyizhuo/code-generator-doc.git"
BRANCH="gh-pages"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$PROJECT_DIR/docs/.vuepress/dist"
NODE_MODULES_DIR="$PROJECT_DIR/node_modules"

# 打印脚本开始信息
printf "\n=== 开始部署 VuePress 文档到 GitHub Pages ===\n\n"
echo "当前项目目录: $PROJECT_DIR"
echo "构建目录: $BUILD_DIR"
echo "Node.js模块目录: $NODE_MODULES_DIR"
echo "GitHub仓库地址: $REPO_URL"
echo "GitHub Pages分支: $BRANCH"
echo "----------------------------------------"

# 检查是否安装了Node.js和npm
echo "检查Node.js和npm环境..."
if ! command -v node &> /dev/null; then
    echo "错误：未检测到Node.js。请先安装Node.js。"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "错误：未检测到npm。请先安装npm。"
    exit 1
fi

NODE_VERSION="$(node --version)"
NPM_VERSION="$(npm --version)"
echo "Node.js版本: $NODE_VERSION"
echo "npm版本: $NPM_VERSION"
echo "----------------------------------------"

# 检查并修复node_modules目录权限
echo "检查node_modules目录权限..."
if [ -d "$NODE_MODULES_DIR" ] && [ "$(stat -f '%Su' "$NODE_MODULES_DIR")" != "$(whoami)" ]; then
    echo "注意：$NODE_MODULES_DIR 目录的所有者不是当前用户，尝试修复权限..."
    sudo chown -R "$(whoami)":"$(id -gn)" "$NODE_MODULES_DIR"
    if [ $? -ne 0 ]; then
        echo "警告：无法修改node_modules目录权限，请手动运行 'sudo chown -R $(whoami):$(id -gn) $NODE_MODULES_DIR' 后重试"
    fi
fi

# 安装依赖
echo "安装项目依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "错误：npm install 失败。请手动检查项目依赖。"
    exit 1
fi
echo "依赖安装完成"
echo "----------------------------------------"

# 构建文档
echo "构建VuePress文档..."
npm run docs:build
if [ $? -ne 0 ]; then
    echo "错误：文档构建失败。请检查VuePress配置。"
    exit 1
fi
echo "文档构建完成"
echo "----------------------------------------"

# 检查构建是否成功
if [ ! -d "$BUILD_DIR" ]; then
    echo "错误：文档构建失败，未找到$BUILD_DIR目录。请检查构建命令是否正确。"
    exit 1
fi

# 检查并修复构建目录权限
if [ -d "$BUILD_DIR" ] && [ "$(stat -f '%Su' "$BUILD_DIR")" != "$(whoami)" ]; then
    echo "注意：$BUILD_DIR 目录的所有者不是当前用户，尝试修复权限..."
    sudo chown -R "$(whoami)":"$(id -gn)" "$BUILD_DIR"
    if [ $? -ne 0 ]; then
        echo "警告：无法修改构建目录权限，请手动运行 'sudo chown -R $(whoami):$(id -gn) $BUILD_DIR' 后重试"
    fi
fi

# 导航到构建输出目录
echo "导航到构建输出目录: $BUILD_DIR"
cd "$BUILD_DIR"
echo "当前工作目录: $(pwd)"
echo "----------------------------------------"

# 检查是否存在git环境
echo "检查git环境..."
if ! command -v git &> /dev/null; then
    echo "错误：未检测到git。请先安装git。"
    exit 1
fi

echo "git版本: $(git --version)"
echo "----------------------------------------"

# 初始化git仓库（如果不存在）
echo "检查是否需要初始化git仓库..."
if [ ! -d ".git" ]; then
    echo "初始化git仓库..."
    git init
    if [ $? -ne 0 ]; then
        echo "错误：git init 失败。"
        exit 1
    fi
else
    echo "git仓库已存在"
fi
echo "----------------------------------------"

# 添加远程仓库
echo "配置远程仓库..."
git remote remove origin 2> /dev/null || echo "没有找到现有的origin远程仓库"
git remote add origin "$REPO_URL"
if [ $? -ne 0 ]; then
    echo "错误：添加远程仓库失败。请检查仓库地址是否正确。"
    exit 1
fi
echo "远程仓库配置完成: $(git remote -v)"
echo "----------------------------------------"

# 配置git用户信息（如果未配置）
echo "配置git用户信息..."
GIT_USER_NAME="$(git config user.name)"
GIT_USER_EMAIL="$(git config user.email)"

if [ -z "$GIT_USER_NAME" ]; then
    echo "设置git用户名: GitHub Actions"
    git config user.name "GitHub Actions"
else
    echo "已设置git用户名: $GIT_USER_NAME"
fi

if [ -z "$GIT_USER_EMAIL" ]; then
    echo "设置git邮箱: github-actions[bot]@users.noreply.github.com"
    git config user.email "github-actions[bot]@users.noreply.github.com"
else
    echo "已设置git邮箱: $GIT_USER_EMAIL"
fi
echo "----------------------------------------"

# 切换到GitHub Pages分支
echo "切换到GitHub Pages分支: $BRANCH"
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    echo "分支 $BRANCH 已存在，切换到该分支..."
    git checkout "$BRANCH"
    if [ $? -ne 0 ]; then
        echo "错误：切换分支失败。"
        exit 1
    fi
else
    echo "分支 $BRANCH 不存在，创建并切换到该分支..."
    git checkout -b "$BRANCH"
    if [ $? -ne 0 ]; then
        echo "错误：创建分支失败。"
        exit 1
    fi
fi
echo "当前分支: $(git branch --show-current)"
echo "----------------------------------------"

# 添加所有文件
echo "添加所有文件到git..."
git add -A
if [ $? -ne 0 ]; then
    echo "错误：git add 失败。请检查文件权限。"
    exit 1
fi
echo "文件添加完成"
echo "----------------------------------------"

# 提交更改
echo "准备提交更改..."
COMMIT_MESSAGE="更新文档 $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MESSAGE"
if [ $? -ne 0 ]; then
    echo "没有可提交的更改或提交失败"
else
    echo "提交成功：$COMMIT_MESSAGE"
fi
echo "----------------------------------------"

# 推送到GitHub
echo "推送到GitHub $BRANCH 分支..."
git push -f origin "$BRANCH"
if [ $? -ne 0 ]; then
    echo "错误：推送失败。请检查GitHub SSH配置和权限。"
    exit 1
fi
echo "推送成功！"
echo "----------------------------------------"

# 清理并返回项目根目录
echo "返回项目根目录..."
cd - > /dev/null

echo "当前目录: $(pwd)"

# 打印完成信息
printf "\n=== 文档部署成功！===\n"
printf "访问地址：https://zhuyizhuo.github.io/code-generator-doc/\n\n"

# 脚本完成时间
echo "脚本执行完成于 $(date '+%Y-%m-%d %H:%M:%S')"