# Gradle 详细指南

Gradle是一款强大的构建自动化工具，它结合了Ant的灵活性和Maven的约定优于配置的思想，并使用Groovy或Kotlin DSL作为构建脚本语言。Gradle广泛用于Java、Kotlin、Android等项目的构建。

## 一、Gradle 概述

### 1.1 什么是 Gradle

Gradle 是一个开源的构建自动化系统，它基于Apache Ant和Apache Maven的概念，但引入了基于Groovy的特定领域语言(DSL)，而不是XML。Gradle提供了：

- 声明式构建和基于约定的构建文件
- 构建脚本的灵活性和可扩展性
- 强大的依赖管理
- 多项目构建支持
- 增量构建能力
- 与多种IDE的良好集成

### 1.2 Gradle 与 Maven 比较

| 特性 | Gradle | Maven |
|------|--------|-------|
| 构建脚本语言 | Groovy/Kotlin DSL (脚本化) | XML (声明式) |
| 灵活性 | 非常高，支持自定义逻辑 | 中等，基于约定 |
| 依赖解析 | 支持动态版本，缓存机制更高效 | 静态版本管理 |
| 构建速度 | 更快，支持增量构建和并行任务 | 相对较慢 |
| 学习曲线 | 较陡，需要学习脚本语言 | 平缓，基于XML |
| 插件生态 | 丰富，包括Maven兼容插件 | 极为丰富 |

## 二、安装与配置

### 2.1 安装 Gradle

#### 通过包管理器安装

**macOS (Homebrew)**:
```bash
brew install gradle
```

**Linux (apt)**:
```bash
sudo apt update
sudo apt install gradle
```

**Windows (Chocolatey)**:
```powershell
choco install gradle
```

#### 手动安装

1. 从 [Gradle官网](https://gradle.org/releases/) 下载最新版本
2. 解压到本地目录
3. 配置环境变量 `GRADLE_HOME` 指向解压目录
4. 将 `GRADLE_HOME/bin` 添加到系统 `PATH` 中

### 2.2 验证安装

```bash
gradle -v
```

成功安装后，会显示Gradle版本信息。

### 2.3 Gradle Wrapper

Gradle Wrapper是Gradle项目的标准部分，它允许项目使用指定版本的Gradle，而不需要在系统上全局安装该版本。

#### 创建Gradle Wrapper

在项目根目录执行：

```bash
gradle wrapper --gradle-version 7.5.1
```

这将在项目中生成以下文件：
- `gradlew` (Unix/Linux/Mac脚本)
- `gradlew.bat` (Windows脚本)
- `gradle/wrapper/gradle-wrapper.jar`
- `gradle/wrapper/gradle-wrapper.properties`

## 三、Gradle 核心概念

### 3.1 项目与任务

**项目(Project)**：代表一个构建的组件，通常对应一个软件模块。每个项目包含多个任务。

**任务(Task)**：代表构建过程中的一个原子操作，如编译、测试、打包等。

```groovy
// 定义一个简单的任务
task hello {
    doLast {
        println 'Hello Gradle!'
    }
}
```

### 3.2 构建脚本

Gradle使用构建脚本(`build.gradle`或`build.gradle.kts`)来定义项目的构建过程。

**Groovy DSL示例**：
```groovy
plugins {
    id 'java'
}

group 'com.example'
version '1.0-SNAPSHOT'

sourceCompatibility = 17

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.8.1'
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.8.1'
}

test {
    useJUnitPlatform()
}
```

**Kotlin DSL示例**：
```kotlin
plugins {
    java
}

group = "com.example"
version = "1.0-SNAPSHOT"

sourceCompatibility = JavaVersion.VERSION_17

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.8.1")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.8.1")
}

tasks.test {
    useJUnitPlatform()
}
```

### 3.3 依赖管理

Gradle提供强大的依赖管理功能，支持从Maven仓库、Ivy仓库或本地文件系统解析依赖。

**依赖配置**：
- `implementation`：编译时和运行时依赖
- `compileOnly`：仅编译时依赖
- `runtimeOnly`：仅运行时依赖
- `testImplementation`：测试编译和运行时依赖
- `testCompileOnly`：仅测试编译时依赖
- `testRuntimeOnly`：仅测试运行时依赖

### 3.4 仓库

Gradle从仓库中下载依赖，可以配置多种仓库类型：

```groovy
repositories {
    // Maven中央仓库
    mavenCentral()
    
    // JCenter仓库（已弃用）
    // jcenter()
    
    // 本地Maven仓库
    mavenLocal()
    
    // 自定义Maven仓库
    maven {
        url 'https://repo.example.com/maven2'
        credentials {
            username 'username'
            password 'password'
        }
    }
    
    // Ivy仓库
    ivy {
        url 'https://repo.example.com/ivy'
    }
}
```

## 四、基本配置

### 4.1 项目配置

```groovy
// 项目组
group = 'com.example'

// 项目版本
version = '1.0.0'

// 项目描述
description = 'Gradle Example Project'

// Java版本配置
sourceCompatibility = JavaVersion.VERSION_17
targetCompatibility = JavaVersion.VERSION_17

// 编译选项
tasks.withType(JavaCompile) {
    options.encoding = 'UTF-8'
    options.compilerArgs += ['-parameters']
}
```

### 4.2 插件配置

```groovy
// 使用插件的方式1：插件ID
plugins {
    id 'java'
    id 'application'
    id 'org.springframework.boot' version '2.6.3'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
}

// 使用插件的方式2：apply
apply plugin: 'java'
apply plugin: 'war'

// 自定义插件配置
application {
    mainClass = 'com.example.Application'
}
```

### 4.3 任务配置

```groovy
// 配置现有任务
test {
    useJUnitPlatform()
    testLogging {
        events 'passed', 'skipped', 'failed'
    }
    maxParallelForks = Runtime.runtime.availableProcessors()
}

// 创建自定义任务
task copyResources(type: Copy) {
    from 'src/main/resources'
    into 'build/resources'
    include '**/*.properties'
    exclude '**/*.tmp'
}

// 任务依赖
compileJava.dependsOn copyResources
```

### 4.4 多项目构建

**settings.gradle**：
```groovy
rootProject.name = 'multi-project-example'
include 'app-core'
include 'app-service'
include 'app-web'
```

**根项目 build.gradle**：
```groovy
subprojects {
    apply plugin: 'java'
    
    group = 'com.example'
    version = '1.0.0'
    
    repositories {
        mavenCentral()
    }
    
    dependencies {
        testImplementation 'org.junit.jupiter:junit-jupiter:5.8.2'
    }
    
    test {
        useJUnitPlatform()
    }
}
```

**子项目 build.gradle**：
```groovy
// app-web/build.gradle
dependencies {
    implementation project(':app-service')
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

## 五、常用插件

### 5.1 Java插件

Java插件提供了Java项目构建的核心功能。

```groovy
plugins {
    id 'java'
}

// Java插件提供的主要任务
// - compileJava: 编译Java源代码
// - processResources: 处理资源文件
// - classes: 编译Java代码和处理资源
// - jar: 创建JAR文件
// - testCompileJava: 编译测试Java代码
// - test: 运行测试
// - clean: 清理构建目录
// - build: 构建项目（包括测试）
```

### 5.2 Spring Boot插件

为Spring Boot应用提供构建支持。

```groovy
plugins {
    id 'org.springframework.boot' version '2.6.3'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

// Spring Boot插件提供的任务
// - bootJar: 创建可执行的JAR文件
// - bootRun: 直接运行应用
```

### 5.3 Application插件

用于构建可执行应用程序。

```groovy
plugins {
    id 'application'
}

application {
    mainClass = 'com.example.Main'
    // 可选：自定义JVM参数
    applicationDefaultJvmArgs = ['-Dspring.profiles.active=dev']
}

// Application插件提供的任务
// - run: 运行应用
// - installDist: 安装应用到build/install目录
// - distZip/distTar: 创建分发包
```

### 5.4 Checkstyle插件

代码风格检查。

```groovy
plugins {
    id 'checkstyle'
}

checkstyle {
    toolVersion = '8.44'
    configFile = file('config/checkstyle/checkstyle.xml')
}
```

## 六、常用命令

### 6.1 基础命令

```bash
# 查看项目帮助
gradle help

# 查看所有任务
gradle tasks

# 查看任务详情
gradle help --task <taskName>

# 执行单个任务
gradle <taskName>

# 执行多个任务
gradle <task1> <task2>

# 强制重新执行任务
gradle <taskName> --rerun-tasks

# 跳过测试
gradle build -x test

# 并行执行任务
gradle build --parallel

# 使用守护进程加速构建
gradle build --daemon
```

### 6.2 构建与测试

```bash
# 编译项目
gradle compileJava

# 运行测试
gradle test

# 构建项目
gradle build

# 生成JAR文件
gradle jar

# 生成并安装到本地仓库
gradle install

# 清理构建产物
gradle clean
```

### 6.3 依赖管理

```bash
# 显示依赖树
gradle dependencies

# 显示特定配置的依赖
gradle dependencies --configuration implementation

# 显示依赖报告
gradle dependencyReport

# 检查依赖更新
gradle dependencyUpdates
```

## 七、实战示例

### 7.1 基本Java项目

**build.gradle**：
```groovy
plugins {
    id 'java'
    id 'application'
}

group 'com.example'
version '1.0.0'

sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.google.guava:guava:31.0.1-jre'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.8.2'
}

application {
    mainClass = 'com.example.Main'
}

test {
    useJUnitPlatform()
    testLogging {
        events 'passed', 'skipped', 'failed'
    }
}
```

### 7.2 Spring Boot项目

**build.gradle**：
```groovy
plugins {
    id 'org.springframework.boot' version '2.6.3'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.h2database:h2'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

### 7.3 多模块项目

**settings.gradle**：
```groovy
rootProject.name = 'my-multi-module'
include 'core'
include 'service'
include 'api'
```

**root build.gradle**：
```groovy
plugins {
    id 'java'
}

extra {
    springBootVersion = '2.6.3'
    springCloudVersion = '2021.0.1'
}

subprojects {
    apply plugin: 'java'
    
    group = 'com.example'
    version = '1.0.0-SNAPSHOT'
    
    sourceCompatibility = JavaVersion.VERSION_17
    
    repositories {
        mavenCentral()
    }
    
    dependencies {
        testImplementation 'org.junit.jupiter:junit-jupiter:5.8.2'
    }
    
    test {
        useJUnitPlatform()
    }
}
```

**api/build.gradle**：
```groovy
plugins {
    id 'org.springframework.boot'
}

dependencies {
    implementation project(':service')
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}
```

## 八、最佳实践

### 8.1 构建脚本组织

1. **使用插件DSL**：优先使用`plugins {}`块来应用插件
2. **使用依赖管理插件**：对于Spring Boot项目，使用`dependency-management`插件管理版本
3. **提取版本号**：将版本号定义在变量或ext块中
4. **模块化构建脚本**：对于复杂项目，使用`apply from: 'scripts/common.gradle'`拆分脚本

### 8.2 性能优化

1. **使用Gradle守护进程**：启用守护进程加速构建
   ```bash
    export GRADLE_OPTS="-Dorg.gradle.daemon=true"
   ```

2. **使用并行构建**：在`gradle.properties`中添加
   ```properties
    org.gradle.parallel=true
   ```

3. **配置堆大小**：在`gradle.properties`中添加
   ```properties
    org.gradle.jvmargs=-Xmx2g -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
   ```

4. **增量构建**：利用Gradle的增量构建特性，避免重新构建未变更的部分

### 8.3 依赖管理最佳实践

1. **明确版本号**：避免使用动态版本号（如`1.+`）
2. **使用依赖锁定**：对于生产环境，使用`dependencyLocking { lockAllConfigurations() }`
3. **定期更新依赖**：使用`gradle dependencyUpdates`检查依赖更新
4. **解决依赖冲突**：使用`resolutionStrategy`解决冲突
   ```groovy
   configurations.all {
       resolutionStrategy {
           force 'com.google.guava:guava:31.0.1-jre'
       }
   }
   ```

### 8.4 多项目构建最佳实践

1. **统一配置**：在根项目中配置共享属性和仓库
2. **明确模块边界**：避免循环依赖
3. **合理分层**：按照功能或层次结构组织模块
4. **使用`api`和`implementation`**：明确依赖可见性

### 8.5 CI/CD集成

```groovy
// GitHub Actions集成示例
task ciBuild {
    dependsOn clean, build
    finalizedBy jacocoTestReport
}

jacocoTestReport {
    reports {
        xml.enabled true
        html.enabled true
    }
}
```

## 九、常见问题与解决方案

### 9.1 依赖冲突

**问题**：不同依赖引用了同一个库的不同版本

**解决方案**：
```groovy
configurations.all {
    resolutionStrategy {
        // 强制使用特定版本
        force 'com.google.guava:guava:31.0.1-jre'
        
        // 优先使用最新版本
        preferLatestVersion()
        
        // 失败快速模式
        failOnVersionConflict()
    }
}
```

### 9.2 构建速度慢

**解决方案**：
- 启用守护进程
- 使用并行构建
- 增加JVM内存
- 避免不必要的任务执行
- 使用增量构建

### 9.3 OutOfMemoryError

**解决方案**：
在`gradle.properties`中增加内存配置
```properties
org.gradle.jvmargs=-Xmx4g -XX:MaxPermSize=1g
```

### 9.4 插件冲突

**解决方案**：
- 检查插件版本兼容性
- 按正确的顺序应用插件
- 避免使用功能重叠的插件

## 十、Gradle 7.x 新特性

### 10.1 主要改进

- **Java 17 支持**：完全支持Java 17
- **Kotlin DSL 改进**：更好的IDE支持和性能
- **配置缓存**：显著提高后续构建速度
- **构建初始化插件**：改进的项目脚手架
- **依赖管理改进**：版本目录功能

### 10.2 版本目录

```groovy
// settings.gradle
dependencyResolutionManagement {
    versionCatalogs {
        libs {
            version('groovy', '3.0.9')
            library('groovy-core', 'org.codehaus.groovy', 'groovy').versionRef('groovy')
            library('groovy-json', 'org.codehaus.groovy', 'groovy-json').versionRef('groovy')
        }
    }
}

// build.gradle
dependencies {
    implementation libs.groovy.core
    implementation libs.groovy.json
}
```

## 十一、总结

Gradle是一个功能强大、灵活且高效的构建工具，适合各种规模的项目。通过掌握Gradle的核心概念、配置方法和最佳实践，开发者可以显著提高构建效率，优化项目结构，提升开发体验。

随着Gradle版本的不断更新，它也在持续引入新特性和改进，为开发者提供更好的构建体验。对于Java开发者来说，学习和掌握Gradle是提升工程能力的重要一步。