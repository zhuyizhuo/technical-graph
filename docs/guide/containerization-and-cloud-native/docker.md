# Docker 容器技术详解

## 1. 核心概念与概述

Docker 是一个开源的容器化平台，它允许开发者将应用程序及其依赖项打包到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 操作系统上，也可以在容器云平台上运行。

### 1.1 Docker 的核心价值

- **轻量级虚拟化**：相比传统虚拟机，Docker 容器共享宿主机内核，启动更快，资源占用更少
- **标准化部署**："构建一次，运行 anywhere"，解决环境不一致问题
- **快速交付与部署**：容器化应用可以快速部署和扩展
- **隔离性**：每个容器拥有独立的文件系统、网络空间，确保应用间相互隔离
- **版本控制**：Docker 镜像支持版本管理，便于回滚和跟踪变更

### 1.2 Docker 与传统虚拟机的区别

| 特性 | Docker 容器 | 传统虚拟机 |
|------|------------|------------|
| 启动时间 | 秒级 | 分钟级 |
| 资源占用 | 轻量级(MB级别) | 重量级(GB级别) |
| 隔离级别 | 进程级 | 操作系统级 |
| 运行依赖 | 共享宿主机内核 | 独立操作系统 |
| 镜像大小 | 小(通常几十MB) | 大(通常几个GB) |

## 2. Docker 核心组件与架构

### 2.1 Docker 架构概述

Docker 采用客户端-服务器(C/S)架构模式，主要由以下几个核心组件组成：

- **Docker 守护进程(Docker Daemon)**：运行在主机上，负责管理容器、镜像、网络等 Docker 资源
- **Docker 客户端(Docker Client)**：用户与 Docker 交互的主要界面，通过命令行或 API 与 Docker 守护进程通信
- **Docker 镜像(Docker Image)**：容器的只读模板，包含运行应用所需的所有内容
- **Docker 容器(Docker Container)**：镜像的运行实例，可被创建、启动、停止、删除等操作
- **Docker 仓库(Docker Registry)**：存储 Docker 镜像的仓库，如 Docker Hub

### 2.2 Docker 核心组件详解

#### 2.2.1 Docker 镜像

Docker 镜像是一个特殊的文件系统，包含运行应用程序所需的所有文件和依赖项。镜像是只读的，构建后不能修改。镜像通过分层存储技术实现，每个镜像由多个只读层叠加而成。

#### 2.2.2 Docker 容器

容器是镜像的运行实例，在镜像的基础上添加了一个可写层。容器的生命周期包括创建、运行、暂停、停止、删除等状态。

#### 2.2.3 Docker 仓库

Docker 仓库用于存储和分发 Docker 镜像，分为公开仓库和私有仓库。Docker Hub 是最大的公开仓库，而企业通常会搭建自己的私有仓库，如 Harbor。

#### 2.2.4 Docker 网络

Docker 提供了多种网络模式，包括：
- **bridge**：默认网络模式，为容器创建独立的网络命名空间
- **host**：容器共享主机网络命名空间
- **none**：容器没有网络接口
- **overlay**：多主机网络通信方案
- **macvlan**：为容器分配 MAC 地址，使其看起来像物理设备

#### 2.2.5 Docker 数据管理

Docker 提供两种方式来持久化数据：
- **数据卷(Volumes)**：由 Docker 管理的数据存储，独立于容器生命周期
- **绑定挂载(Bind Mounts)**：将主机上的文件或目录挂载到容器中
- **tmpfs**：临时文件系统，数据只存在于内存中

## 3. Docker 镜像管理

### 3.1 镜像获取与使用

```bash
# 从 Docker Hub 拉取镜像
docker pull ubuntu:20.04

# 查看本地镜像列表
docker images

# 搜索镜像
docker search nginx

# 删除本地镜像
docker rmi ubuntu:20.04
```

### 3.2 镜像构建

Docker 镜像可以通过 Dockerfile 进行构建，Dockerfile 是一个包含构建镜像所需命令的文本文件。

#### 3.2.1 Dockerfile 基本指令

```dockerfile
# 指定基础镜像
FROM ubuntu:20.04

# 设置维护者信息
MAINTAINER example@example.com

# 执行命令
RUN apt-get update && apt-get install -y nginx

# 设置环境变量
ENV PATH=/usr/local/bin:$PATH

# 添加文件到镜像
ADD app.tar.gz /app/

# 复制文件到镜像
COPY config.ini /app/config/

# 定义工作目录
WORKDIR /app

# 暴露端口
EXPOSE 80 443

# 设置容器启动时执行的命令
CMD ["nginx", "-g", "daemon off;"]

# 设置入口点
ENTRYPOINT ["/app/entrypoint.sh"]

# 定义数据卷
VOLUME ["/data"]
```

#### 3.2.2 构建镜像命令

```bash
# 在包含 Dockerfile 的目录中执行构建命令
docker build -t my-nginx:v1 .

# 使用指定的 Dockerfile 构建
docker build -t my-nginx:v1 -f Dockerfile.custom .

# 构建时传递构建参数
docker build --build-arg VERSION=1.0 -t my-app:v1 .
```

### 3.3 镜像优化策略

- **使用多阶段构建**：将构建环境与运行环境分离，减小最终镜像体积
- **选择轻量级基础镜像**：如 Alpine 而非 Ubuntu
- **合并 RUN 指令**：减少镜像层数
- **清理无用文件**：在每个 RUN 指令后清理缓存和临时文件
- **使用 .dockerignore 文件**：排除不必要的文件

```dockerfile
# 多阶段构建示例
FROM maven:3.8-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ ./src/
RUN mvn package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/app.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

## 4. Docker 容器管理

### 4.1 容器的基本操作

```bash
# 创建并启动容器
docker run -d --name my-container -p 80:80 nginx

# 列出正在运行的容器
docker ps

# 列出所有容器(包括停止的)
docker ps -a

# 启动已停止的容器
docker start my-container

# 停止运行中的容器
docker stop my-container

# 重启容器
docker restart my-container

# 删除容器
docker rm my-container

# 强制删除运行中的容器
docker rm -f my-container
```

### 4.2 容器的高级操作

#### 4.2.1 资源限制

```bash
# 限制容器 CPU 使用
docker run -d --cpus="1.5" nginx

# 限制容器内存使用
docker run -d --memory="512m" nginx

# 设置内存和交换空间
docker run -d --memory="512m" --memory-swap="1g" nginx
```

#### 4.2.2 网络设置

```bash
# 创建自定义网络
docker network create my-network

# 运行容器并连接到自定义网络
docker run -d --name container1 --network my-network nginx

# 将现有容器连接到网络
docker network connect my-network container2

# 查看网络详情
docker network inspect my-network
```

#### 4.2.3 数据卷管理

```bash
# 创建数据卷
docker volume create my-volume

# 查看数据卷列表
docker volume ls

# 运行容器并挂载数据卷
docker run -d --name my-container -v my-volume:/data nginx

# 挂载主机目录到容器
docker run -d --name my-container -v /host/path:/container/path nginx

# 查看数据卷详情
docker volume inspect my-volume
```

#### 4.2.4 容器日志与监控

```bash
# 查看容器日志
docker logs my-container

# 实时查看日志
docker logs -f my-container

# 查看容器资源使用情况
docker stats my-container

# 进入运行中的容器
docker exec -it my-container /bin/bash

# 查看容器详细信息
docker inspect my-container
```

## 5. Docker Compose 编排工具

### 5.1 Docker Compose 概述

Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，您可以使用 YAML 文件来配置应用程序的服务、网络和卷，然后使用单个命令创建并启动所有服务。

### 5.2 Compose 文件基本结构

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    depends_on:
      - db
    environment:
      - DB_HOST=db
  db:
    image: postgres:13
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_USER=user
      - POSTGRES_DB=mydb

volumes:
  db-data:

networks:
  default:
    name: app-network
```

### 5.3 Docker Compose 常用命令

```bash
# 启动所有服务
docker-compose up -d

# 启动指定服务
docker-compose up -d web

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs

# 查看指定服务日志
docker-compose logs web

# 停止所有服务
docker-compose down

# 停止并删除容器、网络、卷和镜像
docker-compose down --volumes --rmi all

# 查看服务依赖关系
docker-compose config --services

# 验证 Compose 文件
docker-compose config
```

### 5.4 多环境配置

使用多个 Compose 文件可以实现不同环境的配置管理：

```bash
# 基础配置 docker-compose.yml
# 开发环境配置 docker-compose.dev.yml
# 生产环境配置 docker-compose.prod.yml

# 使用基础配置和开发环境配置
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 使用基础配置和生产环境配置
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 6. Docker 网络与存储管理

### 6.1 Docker 网络详解

#### 6.1.1 网络模式详解

- **bridge 模式**：Docker 默认的网络模式，为每个容器分配 IP 地址，并通过 NAT 方式与宿主机通信
- **host 模式**：容器直接使用宿主机的网络栈，没有网络隔离
- **none 模式**：容器拥有自己的网络命名空间，但不进行任何网络配置
- **overlay 模式**：用于多主机环境下的容器通信，需要 Docker Swarm 或 Kubernetes 等编排工具
- **macvlan 模式**：为容器分配 MAC 地址，使其可以直接连接到物理网络

#### 6.1.2 自定义网络配置

```bash
# 创建自定义 bridge 网络
docker network create --driver bridge --subnet 172.20.0.0/16 --gateway 172.20.0.1 my-network

# 创建 overlay 网络(需要 Swarm 模式)
docker swarm init
docker network create --driver overlay my-overlay-network
```

### 6.2 Docker 存储详解

#### 6.2.1 数据卷类型

- **命名卷(Named Volumes)**：由 Docker 管理的卷，存储在 /var/lib/docker/volumes/ 目录下
- **绑定挂载(Bind Mounts)**：直接映射主机上的文件或目录到容器中
- **tmpfs 挂载**：数据存储在主机内存中，容器停止后数据会丢失

#### 6.2.2 数据卷备份与恢复

```bash
# 备份数据卷
docker run --rm -v my-volume:/data -v $(pwd):/backup ubuntu tar cvf /backup/volume-backup.tar /data

# 恢复数据卷
docker run --rm -v my-volume:/data -v $(pwd):/backup ubuntu tar xvf /backup/volume-backup.tar -C /
```

## 7. Docker 安全与最佳实践

### 7.1 Docker 安全机制

- **命名空间隔离**：Docker 使用 Linux 命名空间实现容器间的隔离
- **控制组(Cgroups)**：限制容器的资源使用
- **镜像安全扫描**：如 Docker Hub、Trivy 等工具可扫描镜像中的安全漏洞
- **容器运行时安全**：如 AppArmor、SELinux 等安全模块可增强容器安全

### 7.2 Docker 安全最佳实践

- **使用官方或可信的镜像源**
- **定期更新镜像和容器**
- **避免以 root 用户运行容器**
- **最小化容器镜像**
- **限制容器的资源和权限**
- **使用只读文件系统**
- **启用 Docker Content Trust(DCT)**
- **使用网络隔离和防火墙规则**

```bash
# 以非 root 用户运行容器
docker run -u 1000:1000 nginx

# 使用只读文件系统
docker run --read-only -v /run -v /tmp nginx

# 限制容器能力
docker run --cap-drop=all --cap-add=NET_BIND_SERVICE nginx
```

### 7.3 Docker 最佳实践

- **镜像层优化**：合并 RUN 指令，清理临时文件
- **使用 .dockerignore 文件**：排除不必要的文件
- **设置 HEALTHCHECK**：监控容器健康状态
- **使用多阶段构建**：减小镜像体积
- **合理使用缓存**：优化构建速度
- **使用标签管理镜像**：版本控制

```dockerfile
# 添加 HEALTHCHECK\FROM nginx
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
```

## 8. Docker 在 CI/CD 中的应用

### 8.1 Docker 与持续集成

Docker 容器可以提供一致的构建环境，避免"在我的机器上可以运行"的问题。在 CI 流程中，可以使用 Docker 来：

- 构建应用程序镜像
- 运行自动化测试
- 进行代码质量检查
- 生成构建产物

示例 Jenkinsfile：

```groovy
pipeline {
    agent {
        docker {
            image 'maven:3.8-openjdk-17'
            args '-v /root/.m2:/root/.m2'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        stage('Build Image') {
            steps {
                sh 'docker build -t my-app:${BUILD_NUMBER} .'
            }
        }
    }
}
```

### 8.2 Docker 与持续部署

在 CD 流程中，Docker 可以帮助实现：

- 标准化部署包
- 快速滚动更新和回滚
- 自动化部署流程
- 蓝绿部署和金丝雀发布

示例 GitLab CI/CD 配置：

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t my-app:${CI_COMMIT_TAG} .
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push my-app:${CI_COMMIT_TAG}
  only:
    - tags

test:
  stage: test
  image: maven:3.8-openjdk-17
  script:
    - mvn test

 deploy_production:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/my-app my-app=my-registry/my-app:${CI_COMMIT_TAG}
  environment:
    name: production
  only:
    - tags
```

## 9. Docker 生态系统与周边工具

### 9.1 Docker 生态系统组件

- **Docker Hub**：公共镜像仓库
- **Docker Desktop**：桌面应用，提供统一的 Docker 体验
- **Docker Engine**：Docker 的核心运行时
- **Docker Swarm**：容器编排工具
- **Docker Compose**：多容器应用编排
- **Docker Machine**：自动化 Docker 主机配置
- **Docker Registry**：私有镜像仓库

### 9.2 周边工具

- **Harbor**：VMware 开源的企业级容器镜像仓库
- **Trivy**：容器镜像漏洞扫描工具
- **Watchtower**：自动更新 Docker 容器
- **Portainer**：Docker 可视化管理界面
- **BuildKit**：新一代镜像构建工具
- **Skopeo**：容器镜像管理工具

### 9.3 容器编排与云原生

- **Kubernetes**：开源容器编排平台，现已成为容器编排的事实标准
- **Docker Swarm**：Docker 原生的容器编排工具
- **Amazon ECS**：AWS 提供的容器服务
- **Google GKE**：Google Cloud 提供的 Kubernetes 服务
- **Azure AKS**：Microsoft Azure 提供的 Kubernetes 服务

## 10. Docker 进阶主题与发展趋势

### 10.1 容器运行时发展

- **containerd**：从 Docker Engine 中分离出来的容器运行时，符合 OCI 规范
- **CRI-O**：专为 Kubernetes 设计的容器运行时
- **runC**：OCI 规范的参考实现
- **Kata Containers**：轻量级虚拟机与容器技术的结合，提供更强的隔离性

### 10.2 无服务器与容器技术

- **Docker Serverless**：容器技术与无服务器架构的结合
- **Knative**：Kubernetes 上的无服务器平台
- **AWS Fargate**：无服务器容器服务
- **Azure Container Instances**：Microsoft Azure 的无服务器容器服务

### 10.3 容器安全与供应链安全

- **镜像签名与验证**：确保镜像来源可信
- **镜像扫描**：自动化检测镜像中的安全漏洞
- **运行时安全监控**：实时监控容器运行状态和行为
- **软件供应链安全**：确保从源码到部署的整个流程安全

### 10.4 容器优化与性能调优

- **镜像体积优化**：使用 Alpine 基础镜像，多阶段构建
- **运行时性能优化**：合理设置资源限制，优化容器网络
- **存储性能优化**：选择合适的存储驱动，合理配置数据卷
- **容器密度优化**：提高单台主机上的容器密度

---

通过本文档，我们详细介绍了 Docker 容器技术的核心概念、架构组成、使用方法和最佳实践。Docker 作为现代应用开发和部署的重要基础设施，已经成为云原生时代的核心技术之一。随着容器技术的不断发展，Docker 及其生态系统也在持续演进，为开发人员提供更加高效、安全和便捷的应用交付体验。