# Spring Boot 常见问题及答案

## 1. Spring Boot 是什么？

**答案：**

Spring Boot 是一个基于 Spring 框架的快速开发脚手架，它简化了 Spring 应用的初始搭建和开发过程，通过自动配置和约定优于配置的理念，让开发者能够更加专注于业务逻辑的开发。

## 2. Spring Boot 的核心特性有哪些？

**答案：**

- 自动配置（Auto-configuration）：根据项目中添加的依赖自动配置 Spring 应用
- 起步依赖（Starter dependencies）：简化 Maven 配置，提供常用依赖的集合
- 嵌入式容器（Embedded servers）：内置 Tomcat、Jetty 等容器，无需部署 WAR 文件
- Actuator：提供运行时的应用监控和管理功能
- Spring Boot CLI：命令行工具，用于快速创建 Spring Boot 项目
- 无代码生成和 XML 配置：减少配置工作量

## 3. 什么是 Spring Boot Starters？

**答案：**

Spring Boot Starters 是一组依赖描述符的集合，它简化了 Maven 和 Gradle 的依赖管理。每个 Starter 都包含了特定功能所需的所有依赖，开发者只需要在项目中添加对应的 Starter 依赖，就可以获得该功能所需的所有类库。

例如，添加 `spring-boot-starter-web` 依赖，就会自动包含 Spring MVC、Tomcat 等 Web 开发所需的依赖。

## 4. Spring Boot 的自动配置原理是什么？

**答案：**

Spring Boot 的自动配置原理主要基于以下几个核心组件：

1. **@EnableAutoConfiguration 注解**：开启自动配置功能
2. **SpringFactoriesLoader 类**：加载 classpath 下 META-INF/spring.factories 文件中定义的自动配置类
3. **@Conditional 系列注解**：根据条件决定是否应用某一个配置
4. **@ConfigurationProperties 注解**：将配置文件中的属性绑定到 Java Bean 上

当 Spring Boot 应用启动时，会扫描并加载所有符合条件的自动配置类，从而实现自动配置功能。

## 5. 如何自定义 Spring Boot 的自动配置？

**答案：**

自定义 Spring Boot 的自动配置主要包括以下几个步骤：

1. 创建一个配置类，并添加 `@Configuration` 注解
2. 在配置类中定义需要自动配置的 Bean
3. 使用 `@Conditional` 系列注解添加条件判断
4. 使用 `@ConfigurationProperties` 绑定配置属性
5. 在 resources/META-INF/ 目录下创建 spring.factories 文件，并在其中注册自动配置类

例如：
```java
@Configuration
@ConditionalOnClass(MyService.class)
@EnableConfigurationProperties(MyProperties.class)
public class MyAutoConfiguration {
    
    @Autowired
    private MyProperties properties;
    
    @Bean
    @ConditionalOnMissingBean
    public MyService myService() {
        return new MyServiceImpl(properties);
    }
}
```

## 6. Spring Boot 中的 @SpringBootApplication 注解包含哪些注解？

**答案：**

@SpringBootApplication 注解是一个组合注解，它包含了以下三个核心注解：

- **@SpringBootConfiguration**：表示这是一个 Spring Boot 配置类，是 @Configuration 的派生注解
- **@EnableAutoConfiguration**：开启自动配置功能
- **@ComponentScan**：开启组件扫描，默认扫描当前包及其子包下的所有组件

## 7. Spring Boot 支持哪些嵌入式容器？

**答案：**

Spring Boot 支持以下嵌入式容器：

- Tomcat（默认）：轻量级、开源的 Web 应用服务器
- Jetty：轻量级、高性能的 Web 服务器和 Servlet 容器
- Undertow：高性能、非阻塞的 Web 服务器
- Netty：异步事件驱动的网络应用程序框架

可以通过排除默认容器并添加其他容器的依赖来切换嵌入式容器。

## 8. 如何在 Spring Boot 中配置数据库连接？

**答案：**

在 Spring Boot 中配置数据库连接主要有以下几种方式：

1. 使用 application.properties 或 application.yml 配置文件：

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/testdb
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

2. 使用 Java 配置类：

```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }
}
```

## 9. Spring Boot Actuator 有什么作用？

**答案：**

Spring Boot Actuator 是 Spring Boot 的一个核心功能模块，它提供了生产级别的应用监控和管理功能。通过 Actuator，可以：

- 监控应用的健康状态、内存使用、线程使用等信息
- 查看应用的配置信息、环境变量、Bean 信息等
- 跟踪 HTTP 请求处理情况
- 查看应用的日志配置和日志内容
- 执行应用的 shutdown 操作（需要配置）

常用的 Actuator 端点包括：/health、/info、/metrics、/env、/beans 等。

## 10. Spring Boot 中的配置文件有哪些格式？它们有什么区别？

**答案：**

Spring Boot 支持以下两种主要的配置文件格式：

1. **application.properties**：使用键值对的形式配置，格式为 `key=value`
2. **application.yml**：使用 YAML 格式配置，格式为缩进的键值对

两者的主要区别：

- YAML 格式更加简洁，可读性更好，尤其是对于层次结构复杂的配置
- Properties 格式更加直观，对于简单的键值对配置更方便
- YAML 对缩进有严格要求，而 Properties 没有
- Spring Boot 会优先加载 properties 文件，但如果同时存在两种格式的文件，它们会合并，且 properties 文件中的配置会覆盖 YAML 文件中的同名配置

## 11. 如何在 Spring Boot 中实现热部署？

**答案：**

在 Spring Boot 中实现热部署主要有以下几种方式：

1. 使用 Spring Boot DevTools：

添加依赖：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

2. 使用 IDE 的热部署功能：
   - IntelliJ IDEA：开启自动编译（Settings -> Build, Execution, Deployment -> Compiler -> Build Project automatically）
   - Eclipse：开启自动编译（Project -> Build Automatically）

3. 使用 JVM 热交换（HotSwap）：但只能修改方法体，不能添加新的类、方法或字段

## 12. Spring Boot 中的 @Conditional 注解有什么作用？有哪些常用的派生注解？

**答案：**

@Conditional 注解用于根据条件决定是否注册某个 Bean 或配置类。它可以根据特定条件动态地控制 Bean 的创建。

常用的 @Conditional 派生注解包括：

- **@ConditionalOnBean**：当容器中存在指定 Bean 时生效
- **@ConditionalOnMissingBean**：当容器中不存在指定 Bean 时生效
- **@ConditionalOnClass**：当类路径中存在指定类时生效
- **@ConditionalOnMissingClass**：当类路径中不存在指定类时生效
- **@ConditionalOnProperty**：当配置属性满足指定条件时生效
- **@ConditionalOnResource**：当类路径中存在指定资源时生效
- **@ConditionalOnWebApplication**：当应用是 Web 应用时生效
- **@ConditionalOnNotWebApplication**：当应用不是 Web 应用时生效

## 13. 什么是 Spring Boot Starter Parent？

**答案：**

Spring Boot Starter Parent 是一个特殊的 Starter，它提供了 Spring Boot 应用的默认配置和依赖管理。它的主要作用包括：

- 提供默认的 Java 版本和编码设置
- 提供默认的依赖版本管理
- 提供默认的资源过滤和插件配置
- 提供默认的 application.properties 和 application.yml 文件的过滤规则

在 Maven 项目中，可以通过以下方式继承 Spring Boot Starter Parent：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.5</version>
</parent>
```

## 14. Spring Boot 2.x 与 Spring Boot 1.x 相比有哪些主要变化？

**答案：**

Spring Boot 2.x 相比 Spring Boot 1.x 的主要变化包括：

- 基于 Java 8 构建，支持 Java 9
- 引入了 Spring WebFlux，支持响应式编程
- 改进了自动配置，支持更多的自动配置场景
- 升级了依赖组件的版本，如 Spring Framework 5.x
- 增强了 Actuator 功能，提供了更多的监控端点
- 改进了安全自动配置
- 优化了启动性能
- 提供了对 Kotlin 语言的支持
- 引入了 Spring Boot Starters for POMs 功能

## 15. 如何在 Spring Boot 中使用 profiles？

**答案：**

在 Spring Boot 中使用 profiles 主要有以下几种方式：

1. 创建不同环境的配置文件：
   - application-dev.properties/yml：开发环境配置
   - application-test.properties/yml：测试环境配置
   - application-prod.properties/yml：生产环境配置

2. 在主配置文件中指定激活的 profile：
   ```properties
   spring.profiles.active=dev
   ```

3. 通过命令行参数指定激活的 profile：
   ```
   java -jar myapp.jar --spring.profiles.active=prod
   ```

4. 通过环境变量指定激活的 profile：
   ```
   export SPRING_PROFILES_ACTIVE=test
   ```

5. 在代码中使用 `@Profile` 注解指定 Bean 在特定 profile 下生效：
   ```java
   @Configuration
   @Profile("dev")
   public class DevConfig {
       // 开发环境配置
   }
   ```

## 16. Spring Boot 中的 @RestController 和 @Controller 注解有什么区别？

**答案：**

@RestController 和 @Controller 注解的主要区别在于：

- **@Controller**：用于标记一个类是 Spring MVC 的控制器，通常需要配合 @ResponseBody 注解使用，将方法的返回值转换为 JSON 或 XML 响应
- **@RestController**：是 @Controller 和 @ResponseBody 的组合注解，所有方法的返回值都会自动转换为 HTTP 响应体，无需再单独添加 @ResponseBody 注解

示例：

```java
// 使用 @Controller
@Controller
public class UserController {
    @GetMapping("/users")
    @ResponseBody
    public List<User> getUsers() {
        // 返回用户列表
    }
}

// 使用 @RestController
@RestController
public class UserController {
    @GetMapping("/users")
    public List<User> getUsers() {
        // 返回用户列表
    }
}
```

## 17. 如何在 Spring Boot 中集成 Spring Security？

**答案：**

在 Spring Boot 中集成 Spring Security 主要包括以下几个步骤：

1. 添加依赖：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

2. 创建 Security 配置类：
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/", "/home").permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
            .logout()
                .permitAll();
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
                .withUser("user").password("password").roles("USER");
    }
}
```

3. 自定义用户认证服务（可选）：
```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 从数据库或其他存储中获取用户信息
        // 返回 UserDetails 对象
    }
}
```

## 18. Spring Boot 中的 Starter 和 Starter Parent 有什么区别？

**答案：**

Spring Boot Starter 和 Starter Parent 的主要区别在于：

- **Starter Parent**：是一个特殊的项目父 POM，提供了默认的 Maven 配置、依赖版本管理、插件配置等功能，是整个 Spring Boot 依赖管理的基础
- **Starter**：是一组相关依赖的集合，每个 Starter 都针对特定的功能场景，例如 web、data-jpa、security 等，它简化了依赖的添加和管理

简单来说，Starter Parent 是管理所有 Starter 的父级项目，而 Starter 是针对特定功能的依赖集合。

## 19. 如何在 Spring Boot 中使用 JPA？

**答案：**

在 Spring Boot 中使用 JPA 主要包括以下几个步骤：

1. 添加依赖：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

2. 配置数据库连接：
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/testdb
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

3. 创建实体类：
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    // getter 和 setter 方法
}
```

4. 创建 Repository 接口：
```java
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByEmailContaining(String email);
}
```

5. 在 Service 或 Controller 中使用 Repository：
```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
```

## 20. Spring Boot 中的拦截器和过滤器有什么区别？如何实现？

**答案：**

Spring Boot 中的拦截器（Interceptor）和过滤器（Filter）的主要区别在于：

- **过滤器**：属于 Servlet 规范，作用于请求进入容器之后，进入 Servlet 之前，对所有请求都有效，可以修改请求和响应内容
- **拦截器**：属于 Spring MVC 框架，作用于控制器方法调用前后，可以访问 Spring 容器中的 Bean，只能拦截控制器的请求

**实现过滤器：**
```java
@Component
public class LoggingFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        // 过滤前处理
        chain.doFilter(request, response);
        // 过滤后处理
    }
}
```

**实现拦截器：**
```java
@Component
public class LoggingInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 控制器方法调用前处理
        return true; // 返回 false 则中断请求
    }
    
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // 控制器方法调用后处理
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 请求完成后处理
    }
}

// 注册拦截器
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private LoggingInterceptor loggingInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loggingInterceptor).addPathPatterns("/**");
    }
}