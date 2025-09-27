#!/usr/bin/env bash

# =======================================================
# VuePress文档部署脚本 - 增强版
# 功能：自动构建并部署VuePress文档到GitHub Pages
# 作者：技术图谱团队
# 日期：$(date '+%Y-%m-%d')
# 
# 跨平台兼容性说明：
# - Mac/Linux: 使用 npm run docs:deploy 命令
# - Windows: 使用 npm run docs:deploy:win 命令
# =======================================================

# 设置调试模式，显示每个执行的命令
# set -x

# 脚本全局变量
SCRIPT_NAME="$(basename "$0")"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VERBOSE=false
CLEAN=false
HELP=false
COMMIT_MESSAGE=""

# 配置项 - 默认值
REPO_URL="git@github.com:zhuyizhuo/technical-graph-doc.git"
BRANCH="gh-pages"
PROJECT_DIR="$SCRIPT_DIR"
BUILD_DIR="$PROJECT_DIR/docs/.vuepress/dist"
NODE_MODULES_DIR="$PROJECT_DIR/node_modules"
GIT_USER_NAME="GitHub Actions"
GIT_USER_EMAIL="github-actions[bot]@users.noreply.github.com"

# 工具函数
function log_info() {
    echo "[INFO] $1"
}

function log_warn() {
    echo "[WARN] $1"
}

function log_error() {
    echo "[ERROR] $1" >&2
}

function log_debug() {
    if [ "$VERBOSE" = true ]; then
        echo "[DEBUG] $1"
    fi
}

function show_help() {
    cat << EOF
Usage: $SCRIPT_NAME [OPTIONS]

选项:
  -v, --verbose           显示详细输出
  -c, --clean             在部署前清理构建目录
  -m, --message "MESSAGE"  自定义提交消息
  -r, --repo URL          设置GitHub仓库地址 (默认: $REPO_URL)
  -b, --branch BRANCH     设置GitHub Pages分支 (默认: $BRANCH)
  -h, --help              显示帮助信息

示例:
  $SCRIPT_NAME             # 使用默认配置部署
  $SCRIPT_NAME -v          # 显示详细部署过程
  $SCRIPT_NAME -m "更新内容"
  $SCRIPT_NAME -c -v       # 清理并详细显示部署过程
EOF
}

function check_env() {
    log_info "检查系统环境..."
    
    # 检测当前操作系统
    OS_TYPE="unknown"
    if [ "$(uname -s)" = "Linux" ]; then
        OS_TYPE="linux"
    elif [ "$(uname -s)" = "Darwin" ]; then
        OS_TYPE="macos"
    elif [[ "$(uname -s)" == MINGW* ]] || [[ "$(uname -s)" == CYGWIN* ]]; then
        OS_TYPE="windows"
    fi
    
    log_info "当前操作系统: $OS_TYPE"
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log_error "未检测到Node.js。请先安装Node.js。"
        return 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        log_error "未检测到npm。请先安装npm。"
        return 1
    fi
    
    # 检查git
    if ! command -v git &> /dev/null; then
        log_error "未检测到git。请先安装git。"
        return 1
    fi
    
    # 显示版本信息
    NODE_VERSION="$(node --version)"
    NPM_VERSION="$(npm --version)"
    GIT_VERSION="$(git --version)"
    
    log_info "Node.js版本: $NODE_VERSION"
    log_info "npm版本: $NPM_VERSION"
    log_info "git版本: $GIT_VERSION"
    
    # 在Windows上提供特定提示
    if [ "$OS_TYPE" = "windows" ]; then
        log_info "在Windows环境中运行，自动调整脚本行为以兼容Windows系统"
    fi
    
    return 0
}

function install_deps() {
    log_info "安装项目依赖..."
    
    # 检查并修复node_modules目录权限（非Windows环境）
    if [ "$(uname -s)" != "MINGW64_NT" ] && [ "$(uname -s)" != "CYGWIN_NT" ] && [ -d "$NODE_MODULES_DIR" ]; then
        CURRENT_USER="$(whoami)"
        NODE_MODULES_OWNER=""
        
        # 检查stat命令是否存在并根据不同系统使用不同参数
        if command -v stat &> /dev/null; then
            if [ "$(uname -s)" = "Darwin" ]; then
                NODE_MODULES_OWNER="$(stat -f '%Su' "$NODE_MODULES_DIR" 2>/dev/null || echo "")"
            else
                NODE_MODULES_OWNER="$(stat -c '%U' "$NODE_MODULES_DIR" 2>/dev/null || echo "")"
            fi
        fi
        
        if [ -n "$NODE_MODULES_OWNER" ] && [ "$NODE_MODULES_OWNER" != "$CURRENT_USER" ]; then
            log_warn "$NODE_MODULES_DIR 目录的所有者不是当前用户，尝试修复权限..."
            if command -v sudo &> /dev/null; then
                sudo chown -R "$CURRENT_USER":"$(id -gn)" "$NODE_MODULES_DIR"
                if [ $? -ne 0 ]; then
                    log_warn "无法修改node_modules目录权限，请手动运行 'sudo chown -R $(whoami):$(id -gn) $NODE_MODULES_DIR' 后重试"
                fi
            else
                log_warn "没有sudo权限，无法自动修复权限问题"
            fi
        fi
    fi
    
    # 安装依赖
    npm install
    if [ $? -ne 0 ]; then
        log_error "npm install 失败。请手动检查项目依赖。"
        return 1
    fi
    
    log_info "依赖安装完成"
    return 0
}

function build_docs() {
    log_info "构建VuePress文档..."
    
    # 清理构建目录（如果需要）
    if [ "$CLEAN" = true ] && [ -d "$BUILD_DIR" ]; then
        log_info "清理构建目录: $BUILD_DIR"
        
        # 跨平台清理目录方式
        if [[ "$(uname -s)" == MINGW* ]] || [[ "$(uname -s)" == CYGWIN* ]]; then
            # Windows环境
            rmdir /s /q "$BUILD_DIR" 2>nul || del /s /q "$BUILD_DIR\*" 2>nul
            mkdir "$BUILD_DIR" 2>nul
        else
            # Unix-like环境
            rm -rf "$BUILD_DIR"/*
        fi
    fi
    
    # 构建文档
    npm run docs:build
    if [ $? -ne 0 ]; then
        log_error "文档构建失败。请检查VuePress配置。"
        return 1
    fi
    
    # 检查构建是否成功
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "文档构建失败，未找到$BUILD_DIR目录。请检查构建命令是否正确。"
        return 1
    fi
    
    # 检查并修复构建目录权限（非Windows环境）
    if [ "$(uname -s)" != "MINGW64_NT" ] && [ "$(uname -s)" != "CYGWIN_NT" ]; then
        CURRENT_USER="$(whoami)"
        BUILD_DIR_OWNER=""
        
        # 检查stat命令是否存在并根据不同系统使用不同参数
        if command -v stat &> /dev/null; then
            if [ "$(uname -s)" = "Darwin" ]; then
                BUILD_DIR_OWNER="$(stat -f '%Su' "$BUILD_DIR" 2>/dev/null || echo "")"
            else
                BUILD_DIR_OWNER="$(stat -c '%U' "$BUILD_DIR" 2>/dev/null || echo "")"
            fi
        fi
        
        if [ -n "$BUILD_DIR_OWNER" ] && [ "$BUILD_DIR_OWNER" != "$CURRENT_USER" ]; then
            log_warn "$BUILD_DIR 目录的所有者不是当前用户，尝试修复权限..."
            if command -v sudo &> /dev/null; then
                sudo chown -R "$CURRENT_USER":"$(id -gn)" "$BUILD_DIR"
                if [ $? -ne 0 ]; then
                    log_warn "无法修改构建目录权限，请手动运行 'sudo chown -R $(whoami):$(id -gn) $BUILD_DIR' 后重试"
                fi
            else
                log_warn "没有sudo权限，无法自动修复权限问题"
            fi
        fi
    fi
    
    log_info "文档构建完成"
    return 0
}

function deploy_to_github() {
    log_info "开始部署到GitHub Pages..."
    
    # 导航到构建输出目录
    log_info "导航到构建输出目录: $BUILD_DIR"
    cd "$BUILD_DIR"
    if [ $? -ne 0 ]; then
        log_error "无法导航到构建目录: $BUILD_DIR"
        return 1
    fi
    
    log_debug "当前工作目录: $(pwd)"
    
    # 初始化git仓库（如果不存在）
    if [ ! -d ".git" ]; then
        log_info "初始化git仓库..."
        git init
        if [ $? -ne 0 ]; then
            log_error "git init 失败。"
            return 1
        fi
    else
        log_info "git仓库已存在"
    fi
    
    # 添加远程仓库
    log_info "配置远程仓库..."
    git remote remove origin 2> /dev/null || log_debug "没有找到现有的origin远程仓库"
    git remote add origin "$REPO_URL"
    if [ $? -ne 0 ]; then
        log_error "添加远程仓库失败。请检查仓库地址是否正确。"
        return 1
    fi
    
    log_debug "远程仓库配置完成: $(git remote -v)"
    
    # 配置git用户信息
    log_info "配置git用户信息..."
    CURRENT_GIT_USER="$(git config user.name)"
    CURRENT_GIT_EMAIL="$(git config user.email)"
    
    if [ -z "$CURRENT_GIT_USER" ]; then
        log_info "设置git用户名: $GIT_USER_NAME"
        git config user.name "$GIT_USER_NAME"
    else
        log_info "已设置git用户名: $CURRENT_GIT_USER"
    fi
    
    if [ -z "$CURRENT_GIT_EMAIL" ]; then
        log_info "设置git邮箱: $GIT_USER_EMAIL"
        git config user.email "$GIT_USER_EMAIL"
    else
        log_info "已设置git邮箱: $CURRENT_GIT_EMAIL"
    fi
    
    # 切换到GitHub Pages分支
    log_info "切换到GitHub Pages分支: $BRANCH"
    if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
        log_info "分支 $BRANCH 已存在，切换到该分支..."
        git checkout "$BRANCH"
        if [ $? -ne 0 ]; then
            log_error "切换分支失败。"
            return 1
        fi
    else
        log_info "分支 $BRANCH 不存在，创建并切换到该分支..."
        git checkout -b "$BRANCH"
        if [ $? -ne 0 ]; then
            log_error "创建分支失败。"
            return 1
        fi
    fi
    
    log_debug "当前分支: $(git branch --show-current)"
    
    # 添加所有文件
    log_info "添加所有文件到git..."
    git add -A
    if [ $? -ne 0 ]; then
        log_error "git add 失败。请检查文件权限。"
        return 1
    fi
    
    # 提交更改
    log_info "准备提交更改..."
    if [ -z "$COMMIT_MESSAGE" ]; then
        COMMIT_MESSAGE="更新文档 $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    git commit -m "$COMMIT_MESSAGE"
    if [ $? -ne 0 ]; then
        log_warn "没有可提交的更改或提交失败"
    else
        log_info "提交成功：$COMMIT_MESSAGE"
    fi
    
    # 推送到GitHub
    log_info "推送到GitHub $BRANCH 分支..."
    git push -f origin "$BRANCH"
    if [ $? -ne 0 ]; then
        log_error "推送失败。请检查GitHub SSH配置和权限。"
        log_error "常见问题："
        log_error "1. 确保您的SSH密钥已添加到GitHub账户"
        log_error "2. 确保您有访问仓库的权限"
        log_error "3. 尝试使用HTTPS URL替代SSH URL"
        return 1
    fi
    
    log_info "推送成功！"
    return 0
}

function main() {
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -c|--clean)
                CLEAN=true
                shift
                ;;
            -m|--message)
                COMMIT_MESSAGE="$2"
                shift 2
                ;;
            -r|--repo)
                REPO_URL="$2"
                shift 2
                ;;
            -b|--branch)
                BRANCH="$2"
                shift 2
                ;;
            -h|--help)
                HELP=true
                shift
                ;;
            *)
                log_error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 显示帮助信息
    if [ "$HELP" = true ]; then
        show_help
        exit 0
    fi
    
    # 打印脚本开始信息
    printf "\n=== VuePress文档部署工具 ===\n\n"
    log_info "当前项目目录: $PROJECT_DIR"
    log_info "构建目录: $BUILD_DIR"
    log_info "GitHub仓库地址: $REPO_URL"
    log_info "GitHub Pages分支: $BRANCH"
    if [ -n "$COMMIT_MESSAGE" ]; then
        log_info "自定义提交消息: $COMMIT_MESSAGE"
    fi
    
    # 检查系统环境
    if ! check_env; then
        exit 1
    fi
    
    # 安装依赖
    if ! install_deps; then
        exit 1
    fi
    
    # 构建文档
    if ! build_docs; then
        exit 1
    fi
    
    # 部署到GitHub
    if ! deploy_to_github; then
        exit 1
    fi
    
    # 清理并返回项目根目录
    log_info "返回项目根目录..."
    cd - > /dev/null
    log_debug "当前目录: $(pwd)"
    
    # 打印完成信息
    printf "\n=== 文档部署成功！==="
    printf "\n访问地址：https://zhuyizhuo.github.io/technical-graph-doc/\n\n"
    
    # 脚本完成时间
    log_info "脚本执行完成于 $(date '+%Y-%m-%d %H:%M:%S')"
    
    exit 0
}

# 执行主函数
main "$@"