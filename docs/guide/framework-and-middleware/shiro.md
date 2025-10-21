# Apache Shiro 安全框架详解

## 1. 概述

### 1.1 Shiro简介

Apache Shiro是一个功能强大且灵活的开源安全框架，用于实现身份认证、授权、加密和会话管理等安全功能。它可以与各种Web应用、企业应用和分布式应用无缝集成，为Java应用提供全面的安全保障。

### 1.2 Shiro的核心优势

- **简单直观**: 提供清晰易用的API，简化安全功能的实现
- **全面的安全功能**: 支持身份认证、授权、会话管理、加密等多种安全功能
- **易于集成**: 可以与Spring、Spring Boot等框架轻松集成
- **轻量级**: 核心包小巧，无第三方依赖
- **灵活配置**: 支持多种配置方式，包括INI、XML、Properties、注解等
- **丰富的主题**: 提供用户自定义会话、缓存、数据源等扩展点

### 1.3 Shiro与Spring Security对比

| 特性 | Apache Shiro | Spring Security |
|------|--------------|----------------|
| 易用性 | 简单直观，API友好 | 相对复杂，学习曲线陡峭 |
| 依赖 | 无第三方依赖 | 依赖Spring框架 |
| 会话管理 | 强大的会话管理机制 | 相对较弱 |
| Web集成 | 支持，但不是唯一焦点 | 主要针对Web应用 |
| 学习成本 | 较低 | 较高 |
| 社区活跃度 | 活跃 | 非常活跃 |

## 2. Shiro核心架构

### 2.1 Shiro的三大核心组件

#### Subject

Subject代表当前正在执行操作的用户，是Shiro框架的核心入口点。它可以是一个人，也可以是第三方服务、守护进程、定时任务等。

```java
// 获取当前用户
Subject currentUser = SecurityUtils.getSubject();

// 登录
UsernamePasswordToken token = new UsernamePasswordToken("username", "password");
token.setRememberMe(true);
currentUser.login(token);

// 检查是否认证
boolean authenticated = currentUser.isAuthenticated();

// 检查角色
boolean hasRole = currentUser.hasRole("admin");

// 检查权限
boolean isPermitted = currentUser.isPermitted("user:create");

// 退出登录
currentUser.logout();
```

#### SecurityManager

SecurityManager是Shiro的核心，管理所有用户的安全操作。它协调Shiro的其他组件，确保它们能正确地工作。

#### Realms

Realms是连接Shiro与应用程序安全数据的桥梁。它们负责验证用户身份并获取授权信息。

### 2.2 Shiro的四大安全功能

#### 认证(Authentication)

验证用户身份，确认用户是否为声明的身份。

#### 授权(Authorization)

控制用户对系统资源的访问权限。

#### 会话管理(Session Management)

管理用户会话，即使在非Web应用中也能提供会话功能。

#### 加密(Cryptography)

提供加密和哈希功能，保护敏感数据。

## 3. 认证(Authentication)详解

### 3.1 认证流程

1. **收集用户身份信息**: 通常是用户名和密码
2. **创建认证令牌**: 创建UsernamePasswordToken对象
3. **获取Subject**: 通过SecurityUtils.getSubject()获取当前用户
4. **执行认证**: 调用subject.login(token)进行认证
5. **处理认证结果**: 认证成功或失败的处理逻辑

### 3.2 认证示例

#### 基本认证示例

```java
// 收集用户身份信息
String username = "zhangsan";
String password = "123456";

// 创建认证令牌
UsernamePasswordToken token = new UsernamePasswordToken(username, password);
token.setRememberMe(true); // 设置记住我

// 获取Subject
Subject currentUser = SecurityUtils.getSubject();

// 执行认证
try {
    currentUser.login(token);
    // 认证成功
    System.out.println("登录成功");
} catch (UnknownAccountException uae) {
    // 用户名不存在
    System.out.println("用户名不存在");
} catch (IncorrectCredentialsException ice) {
    // 密码错误
    System.out.println("密码错误");
} catch (LockedAccountException lae) {
    // 账户被锁定
    System.out.println("账户被锁定");
} catch (AuthenticationException ae) {
    // 认证失败
    System.out.println("认证失败: " + ae.getMessage());
}
```

#### 自定义认证Realm

```java
public class CustomRealm extends AuthorizingRealm {

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        // 获取用户名
        String username = (String) token.getPrincipal();
        
        // 从数据库或其他存储中获取用户信息
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UnknownAccountException("用户名不存在");
        }
        
        // 检查账户是否锁定
        if (user.isLocked()) {
            throw new LockedAccountException("账户被锁定");
        }
        
        // 创建认证信息
        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(
            username,               // 主体
            user.getPassword(),      // 凭据
            ByteSource.Util.bytes(user.getSalt()), // 盐值
            getName()               // Realm名称
        );
        
        return info;
    }
    
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        // 授权相关逻辑，稍后讲解
        return null;
    }
}
```

## 4. 授权(Authorization)详解

### 4.1 授权的基本概念

- **权限(Permission)**: 执行特定操作的能力
- **角色(Role)**: 一组权限的集合
- **主体(Subject)**: 被授权的用户

### 4.2 授权方式

#### 基于角色的访问控制(RBAC)

```java
Subject currentUser = SecurityUtils.getSubject();

// 检查是否有指定角色
boolean hasRole = currentUser.hasRole("admin");

// 检查是否有多个角色
boolean[] hasRoles = currentUser.hasRoles(Arrays.asList("admin", "user"));

// 检查是否有所有指定角色
boolean hasAllRoles = currentUser.hasAllRoles(Arrays.asList("admin", "user"));

// 使用check方法，如果不满足条件会抛出异常
currentUser.checkRole("admin");
currentUser.checkRoles("admin", "user");
currentUser.checkRoles(Arrays.asList("admin", "user"));
```

#### 基于权限的访问控制

```java
Subject currentUser = SecurityUtils.getSubject();

// 检查是否有指定权限
boolean isPermitted = currentUser.isPermitted("user:create");

// 检查是否有多个权限
boolean[] isPermittedArray = currentUser.isPermitted("user:create", "user:update");

// 检查是否有所有指定权限
boolean isAllPermitted = currentUser.isPermittedAll("user:create", "user:update");

// 使用check方法，如果不满足条件会抛出异常
currentUser.checkPermission("user:create");
currentUser.checkPermissions("user:create", "user:update");
currentUser.checkPermissions(Arrays.asList("user:create", "user:update"));
```

### 4.3 自定义授权Realm

```java
public class CustomRealm extends AuthorizingRealm {
    
    @Autowired
    private UserService userService;
    
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        // 认证相关逻辑，前面已讲解
        return null;
    }
    
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        // 获取用户名
        String username = (String) principals.getPrimaryPrincipal();
        
        // 创建授权信息对象
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        
        // 从数据库获取用户角色
        Set<String> roles = userService.findRolesByUsername(username);
        authorizationInfo.setRoles(roles);
        
        // 从数据库获取用户权限
        Set<String> permissions = userService.findPermissionsByUsername(username);
        authorizationInfo.setStringPermissions(permissions);
        
        return authorizationInfo;
    }
}
```

## 5. 会话管理(Session Management)

### 5.1 会话概述

Shiro提供了强大的会话管理功能，即使在非Web环境中也能使用。Shiro的会话是独立于容器的，可以在任何环境中使用相同的API。

### 5.2 会话操作示例

```java
Subject currentUser = SecurityUtils.getSubject();
Session session = currentUser.getSession();

// 设置会话属性
session.setAttribute("key", "value");

// 获取会话属性
Object value = session.getAttribute("key");

// 移除会话属性
session.removeAttribute("key");

// 获取会话ID
String sessionId = session.getId().toString();

// 获取会话创建时间
date creationTime = session.getStartTimestamp();

// 获取会话最后访问时间
date lastAccessTime = session.getLastAccessTime();

// 设置会话过期时间(毫秒)
session.setTimeout(3600000);

// 获取会话过期时间
long timeout = session.getTimeout();

// 立即使会话失效
session.stop();
```

### 5.3 会话监听器

```java
public class CustomSessionListener implements SessionListener {
    
    @Override
    public void onStart(Session session) {
        // 会话创建时触发
        System.out.println("会话创建: " + session.getId());
    }
    
    @Override
    public void onStop(Session session) {
        // 会话停止时触发
        System.out.println("会话停止: " + session.getId());
    }
    
    @Override
    public void onExpiration(Session session) {
        // 会话过期时触发
        System.out.println("会话过期: " + session.getId());
    }
}
```

## 6. 加密(Cryptography)

### 6.1 Shiro加密功能

Shiro提供了简单易用的加密API，支持多种加密算法，包括散列算法(MD5、SHA等)和对称加密算法(AES、Blowfish等)。

### 6.2 散列算法示例

```java
// MD5加密
String hashAlgorithmName = "MD5";
String credentials = "123456";
ByteSource salt = ByteSource.Util.bytes("salt"); // 盐值
int hashIterations = 1024; // 迭代次数

SimpleHash simpleHash = new SimpleHash(hashAlgorithmName, credentials, salt, hashIterations);
String result = simpleHash.toString();
System.out.println("MD5加密结果: " + result);

// SHA-256加密
hashAlgorithmName = "SHA-256";
simpleHash = new SimpleHash(hashAlgorithmName, credentials, salt, hashIterations);
result = simpleHash.toString();
System.out.println("SHA-256加密结果: " + result);

// 使用加密器
DefaultHashService hashService = new DefaultHashService();
hashService.setHashAlgorithmName("SHA-512");
hashService.setPrivateSalt(ByteSource.Util.bytes("privateSalt"));
hashService.setGeneratePublicSalt(true);
hashService.setHashIterations(1024);

HashRequest request = new HashRequest.Builder()
    .setAlgorithmName("SHA-512")
    .setSource(ByteSource.Util.bytes("password"))
    .setSalt(ByteSource.Util.bytes("salt"))
    .setIterations(1024)
    .build();

String hex = hashService.computeHash(request).toHex();
System.out.println("使用加密器的结果: " + hex);
```

### 6.3 密码匹配器

```java
// 配置密码匹配器
HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
matcher.setHashAlgorithmName("MD5");
matcher.setHashIterations(1024);
matcher.setStoredCredentialsHexEncoded(true); // 存储的凭据是否为十六进制编码

// 设置到Realm
CustomRealm realm = new CustomRealm();
realm.setCredentialsMatcher(matcher);
```

## 7. Shiro与Spring集成

### 7.1 Maven依赖

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-core</artifactId>
    <version>1.11.0</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
    <version>1.11.0</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-web</artifactId>
    <version>1.11.0</version>
</dependency>
```

### 7.2 Spring配置文件

```xml
<!-- 配置自定义Realm -->
<bean id="customRealm" class="com.example.shiro.CustomRealm" />

<!-- 配置SecurityManager -->
<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
    <property name="realm" ref="customRealm" />
    <!-- 配置会话管理器 -->
    <property name="sessionManager" ref="sessionManager" />
    <!-- 配置缓存管理器 -->
    <property name="cacheManager" ref="cacheManager" />
</bean>

<!-- 配置会话管理器 -->
<bean id="sessionManager" class="org.apache.shiro.web.session.mgt.DefaultWebSessionManager">
    <!-- 会话超时时间，单位毫秒 -->
    <property name="globalSessionTimeout" value="3600000" />
    <!-- 定期验证会话是否过期 -->
    <property name="sessionValidationSchedulerEnabled" value="true" />
    <!-- 自定义会话监听器 -->
    <property name="sessionListeners">
        <list>
            <bean class="com.example.shiro.CustomSessionListener" />
        </list>
    </property>
</bean>

<!-- 配置缓存管理器 -->
<bean id="cacheManager" class="org.apache.shiro.cache.MemoryConstrainedCacheManager" />

<!-- 配置Shiro Filter -->
<bean id="shiroFilter" class="org.apache.shiro.spring.web.ShiroFilterFactoryBean">
    <property name="securityManager" ref="securityManager" />
    <!-- 登录页面 -->
    <property name="loginUrl" value="/login" />
    <!-- 登录成功页面 -->
    <property name="successUrl" value="/index" />
    <!-- 未授权页面 -->
    <property name="unauthorizedUrl" value="/unauthorized" />
    <!-- 配置过滤器链 -->
    <property name="filterChainDefinitions">
        <value>
            /login = anon
            /logout = logout
            /static/** = anon
            /admin/** = authc, roles[admin]
            /user/** = authc, roles[user]
            /** = authc
        </value>
    </property>
</bean>

<!-- 配置Shiro生命周期处理器 -->
<bean id="lifecycleBeanPostProcessor" class="org.apache.shiro.spring.LifecycleBeanPostProcessor" />

<!-- 开启Shiro注解支持 -->
<bean class="org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator" depends-on="lifecycleBeanPostProcessor" />
<bean class="org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor">
    <property name="securityManager" ref="securityManager" />
</bean>
```

## 8. Shiro与Spring Boot集成

### 8.1 Maven依赖

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring-boot-starter</artifactId>
    <version>1.11.0</version>
</dependency>
```

### 8.2 Java配置类

```java
@Configuration
public class ShiroConfig {
    
    @Bean
    public CustomRealm customRealm() {
        CustomRealm realm = new CustomRealm();
        // 配置密码匹配器
        HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
        matcher.setHashAlgorithmName("MD5");
        matcher.setHashIterations(1024);
        realm.setCredentialsMatcher(matcher);
        return realm;
    }
    
    @Bean
    public SecurityManager securityManager() {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(customRealm());
        securityManager.setSessionManager(sessionManager());
        securityManager.setCacheManager(cacheManager());
        return securityManager;
    }
    
    @Bean
    public SessionManager sessionManager() {
        DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
        sessionManager.setGlobalSessionTimeout(3600000);
        sessionManager.setSessionValidationSchedulerEnabled(true);
        List<SessionListener> listeners = new ArrayList<>();
        listeners.add(new CustomSessionListener());
        sessionManager.setSessionListeners(listeners);
        return sessionManager;
    }
    
    @Bean
    public CacheManager cacheManager() {
        return new MemoryConstrainedCacheManager();
    }
    
    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean() {
        ShiroFilterFactoryBean factoryBean = new ShiroFilterFactoryBean();
        factoryBean.setSecurityManager(securityManager());
        factoryBean.setLoginUrl("/login");
        factoryBean.setSuccessUrl("/index");
        factoryBean.setUnauthorizedUrl("/unauthorized");
        
        // 配置过滤器链
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
        filterChainDefinitionMap.put("/login", "anon");
        filterChainDefinitionMap.put("/logout", "logout");
        filterChainDefinitionMap.put("/static/**", "anon");
        filterChainDefinitionMap.put("/admin/**", "authc, roles[admin]");
        filterChainDefinitionMap.put("/user/**", "authc, roles[user]");
        filterChainDefinitionMap.put("/**", "authc");
        
        factoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
        return factoryBean;
    }
    
    @Bean
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }
    
    @Bean
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator creator = new DefaultAdvisorAutoProxyCreator();
        creator.setProxyTargetClass(true);
        return creator;
    }
    
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor advisor = new AuthorizationAttributeSourceAdvisor();
        advisor.setSecurityManager(securityManager());
        return advisor;
    }
}
```

### 8.3 控制器示例

```java
@Controller
public class LoginController {
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @PostMapping("/login")
    public String doLogin(String username, String password, boolean rememberMe, Model model) {
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken(username, password);
        token.setRememberMe(rememberMe);
        
        try {
            subject.login(token);
            return "redirect:/index";
        } catch (UnknownAccountException e) {
            model.addAttribute("error", "用户名不存在");
        } catch (IncorrectCredentialsException e) {
            model.addAttribute("error", "密码错误");
        } catch (LockedAccountException e) {
            model.addAttribute("error", "账户被锁定");
        } catch (AuthenticationException e) {
            model.addAttribute("error", "认证失败: " + e.getMessage());
        }
        
        return "login";
    }
    
    @GetMapping("/logout")
    public String logout() {
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        return "redirect:/login";
    }
    
    @GetMapping("/index")
    public String index() {
        return "index";
    }
    
    @GetMapping("/unauthorized")
    public String unauthorized() {
        return "unauthorized";
    }
    
    @GetMapping("/admin/page")
    @RequiresRoles("admin")
    public String adminPage() {
        return "admin";
    }
    
    @GetMapping("/user/page")
    @RequiresRoles("user")
    public String userPage() {
        return "user";
    }
    
    @GetMapping("/user/create")
    @RequiresPermissions("user:create")
    public String createUser() {
        return "create_user";
    }
}
```

## 9. Shiro高级特性

### 9.1 缓存机制

Shiro提供了缓存接口，可以与各种缓存框架集成，如EhCache、Redis等，提高授权性能。

```java
// Redis缓存实现示例
public class RedisCacheManager implements CacheManager {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public <K, V> Cache<K, V> getCache(String name) throws CacheException {
        return new RedisCache<>(name, redisTemplate);
    }
    
    private static class RedisCache<K, V> implements Cache<K, V> {
        
        private String name;
        private RedisTemplate<String, Object> redisTemplate;
        
        public RedisCache(String name, RedisTemplate<String, Object> redisTemplate) {
            this.name = name;
            this.redisTemplate = redisTemplate;
        }
        
        private String getKey(K key) {
            return name + ":" + key.toString();
        }
        
        @Override
        public V get(K key) throws CacheException {
            return (V) redisTemplate.opsForValue().get(getKey(key));
        }
        
        @Override
        public V put(K key, V value) throws CacheException {
            redisTemplate.opsForValue().set(getKey(key), value, 30, TimeUnit.MINUTES);
            return value;
        }
        
        @Override
        public V remove(K key) throws CacheException {
            V value = get(key);
            redisTemplate.delete(getKey(key));
            return value;
        }
        
        @Override
        public void clear() throws CacheException {
            // 使用Redis的键模式匹配删除所有相关键
            Set<String> keys = redisTemplate.keys(name + ":*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        }
        
        @Override
        public int size() {
            Set<String> keys = redisTemplate.keys(name + ":*");
            return keys != null ? keys.size() : 0;
        }
        
        @Override
        public Set<K> keys() {
            Set<String> keys = redisTemplate.keys(name + ":*");
            Set<K> result = new HashSet<>();
            if (keys != null) {
                for (String key : keys) {
                    // 移除前缀
                    String realKey = key.substring(name.length() + 1);
                    result.add((K) realKey);
                }
            }
            return result;
        }
        
        @Override
        public Collection<V> values() {
            Set<String> keys = redisTemplate.keys(name + ":*");
            Collection<V> result = new ArrayList<>();
            if (keys != null && !keys.isEmpty()) {
                for (String key : keys) {
                    V value = (V) redisTemplate.opsForValue().get(key);
                    if (value != null) {
                        result.add(value);
                    }
                }
            }
            return result;
        }
    }
}
```

### 9.2 分布式会话

在分布式环境中，需要将会话存储在共享位置，如Redis、Memcached等。

```java
// Redis会话DAO示例
public class RedisSessionDAO extends AbstractSessionDAO {
    
    @Autowired
    private RedisTemplate<String, Session> redisTemplate;
    
    private static final String SESSION_KEY_PREFIX = "shiro:session:";
    private static final long SESSION_EXPIRE_TIME = 3600000; // 1小时
    
    @Override
    protected Serializable doCreate(Session session) {
        Serializable sessionId = generateSessionId(session);
        assignSessionId(session, sessionId);
        saveSession(session);
        return sessionId;
    }
    
    @Override
    protected Session doReadSession(Serializable sessionId) {
        if (sessionId == null) {
            return null;
        }
        String key = getSessionKey(sessionId);
        return redisTemplate.opsForValue().get(key);
    }
    
    @Override
    public void update(Session session) throws UnknownSessionException {
        saveSession(session);
    }
    
    @Override
    public void delete(Session session) {
        if (session == null || session.getId() == null) {
            return;
        }
        String key = getSessionKey(session.getId());
        redisTemplate.delete(key);
    }
    
    @Override
    public Collection<Session> getActiveSessions() {
        Set<String> keys = redisTemplate.keys(SESSION_KEY_PREFIX + "*");
        if (keys == null || keys.isEmpty()) {
            return Collections.emptySet();
        }
        return new HashSet<>(redisTemplate.opsForValue().multiGet(keys));
    }
    
    private void saveSession(Session session) {
        if (session == null || session.getId() == null) {
            return;
        }
        String key = getSessionKey(session.getId());
        redisTemplate.opsForValue().set(key, session, session.getTimeout(), TimeUnit.MILLISECONDS);
    }
    
    private String getSessionKey(Serializable sessionId) {
        return SESSION_KEY_PREFIX + sessionId;
    }
}
```

### 9.3 自定义过滤器

Shiro允许自定义过滤器，以满足特定的业务需求。

```java
public class CustomFilter extends AccessControlFilter {
    
    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
        Subject subject = getSubject(request, response);
        // 检查是否有自定义权限
        return subject.isPermitted("custom:permission");
    }
    
    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // 如果是Ajax请求，返回JSON
        if (isAjaxRequest(httpRequest)) {
            httpResponse.setCharacterEncoding("UTF-8");
            httpResponse.setContentType("application/json; charset=utf-8");
            httpResponse.getWriter().write("{\"code\":403,\"msg\":\"没有权限访问\"}");
            return false;
        }
        
        // 否则重定向到未授权页面
        saveRequestAndRedirectToLogin(request, response);
        return false;
    }
    
    private boolean isAjaxRequest(HttpServletRequest request) {
        String header = request.getHeader("X-Requested-With");
        return "XMLHttpRequest".equals(header);
    }
}
```

## 10. 最佳实践

### 10.1 安全配置建议

1. **使用强密码哈希算法**: 如SHA-256、SHA-512等，并使用盐值和多次迭代
2. **实现账户锁定机制**: 防止暴力破解
3. **配置合理的会话超时时间**: 减少会话劫持风险
4. **使用HTTPS**: 保护传输中的数据
5. **实现CSRF防护**: 防止跨站请求伪造攻击
6. **定期清理过期会话**: 避免会话数据积累
7. **使用缓存**: 提高授权性能
8. **实现细粒度的权限控制**: 遵循最小权限原则

### 10.2 性能优化建议

1. **使用缓存**: 缓存用户权限信息，减少数据库查询
2. **实现自定义会话DAO**: 使用Redis等高性能存储
3. **合理设置会话超时时间**: 避免会话过多占用资源
4. **使用异步处理**: 对于耗时的权限检查使用异步处理
5. **定期清理缓存**: 避免缓存数据过期导致的问题

## 11. 常见问题与解决方案

### 11.1 认证失败的常见原因

- 用户名不存在
- 密码错误
- 账户被锁定
- 账户过期
- 凭证过期
- 自定义认证逻辑抛出异常

### 11.2 授权失败的常见原因

- 用户没有所需的角色
- 用户没有所需的权限
- 缓存中的权限信息过期
- 权限字符串格式不正确

### 11.3 会话相关问题

- 会话超时: 调整会话超时时间
- 会话丢失: 检查会话存储配置
- 会话并发: 实现自定义会话管理器处理并发登录

## 12. 总结

Apache Shiro是一个功能强大、易于使用的安全框架，它提供了全面的安全功能，包括认证、授权、会话管理和加密。通过与Spring、Spring Boot等框架的集成，可以轻松地为Java应用提供安全保障。在实际应用中，我们应该根据具体需求，合理配置Shiro的各项功能，并遵循安全最佳实践，确保应用的安全性。