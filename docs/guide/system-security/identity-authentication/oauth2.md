# OAuth 2.0 使用文档

## 1. OAuth 2.0 概述

OAuth 2.0 是一个开放标准的授权协议，允许第三方应用访问用户在某一服务上的资源，而无需将用户名和密码提供给第三方应用。它被广泛应用于现代 Web 和移动应用的身份认证与授权场景。

### 1.1 主要特点

- **分离式授权**：将用户认证和授权分离
- **多种授权流程**：适应不同应用场景的授权流程
- **令牌机制**：使用访问令牌而非凭证访问资源
- **可扩展性**：支持自定义作用域和授权类型
- **安全性**：减少凭证暴露风险

### 1.2 应用场景

- 第三方登录（如使用微信、GitHub账号登录其他应用）
- API访问授权（如允许第三方应用访问用户在某平台的数据）
- 单点登录系统
- 微服务架构中的服务间认证授权

## 2. OAuth 2.0 核心概念

### 2.1 角色定义

- **资源所有者（Resource Owner）**：能够授予对受保护资源访问权限的实体，通常是用户
- **客户端（Client）**：请求访问受保护资源的应用程序
- **资源服务器（Resource Server）**：托管受保护资源的服务器，能够接受并响应使用访问令牌的请求
- **授权服务器（Authorization Server）**：验证资源所有者身份并颁发访问令牌的服务器

### 2.2 令牌类型

- **访问令牌（Access Token）**：用于访问受保护资源的令牌
- **刷新令牌（Refresh Token）**：用于获取新的访问令牌的令牌，通常在访问令牌过期时使用
- **授权码（Authorization Code）**：用于换取访问令牌的临时码
- **Bearer Token**：一种简单的访问令牌类型，任何持有此令牌的人都可以访问受保护资源

### 2.3 授权范围（Scope）

用于限制访问令牌的访问范围和权限，例如 `read`、`write`、`profile`、`email` 等。

## 3. OAuth 2.0 授权流程

OAuth 2.0 定义了五种授权流程，适用于不同的应用场景：

### 3.1 授权码流程（Authorization Code Grant）

最安全和最常用的流程，适用于有后端服务器的Web应用。

**流程步骤**：

1. 客户端将用户引导至授权服务器的授权端点
2. 用户认证并授权客户端请求
3. 授权服务器重定向用户回客户端，并附带授权码
4. 客户端使用授权码向授权服务器的令牌端点请求访问令牌
5. 授权服务器验证授权码并颁发访问令牌（和可选的刷新令牌）

**流程图**：

```
+--------+                                +---------------+
|        |--(A)------- Authorization Request ----->|               |
|        |                                |               |
|        |<-(B)---- Authorization Grant ---| Authorization |
| Client |                                |     Server    |
|        |--(C)------- Authorization Grant ----->|               |
|        |                                |               |
|        |<-(D)---------- Access Token ---|               |
+--------+                                +---------------+
```

**代码示例**：

```java
// 1. 构建授权URL
String authorizationUrl = "https://auth-server/oauth/authorize?" +
    "response_type=code&" +
    "client_id=client-id&" +
    "redirect_uri=http://client-app/callback&" +
    "scope=read write&" +
    "state=state-parameter";

// 2. 在回调处理中获取授权码并换取访问令牌
@RequestMapping("/callback")
public String callback(@RequestParam("code") String code, @RequestParam("state") String state) {
    // 验证state参数
    if (!state.equals(savedState)) {
        throw new SecurityException("Invalid state parameter");
    }
    
    // 向授权服务器请求访问令牌
    RestTemplate restTemplate = new RestTemplate();
    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("grant_type", "authorization_code");
    params.add("code", code);
    params.add("redirect_uri", "http://client-app/callback");
    params.add("client_id", "client-id");
    params.add("client_secret", "client-secret");
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    
    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
    ResponseEntity<Map> response = restTemplate.postForEntity("https://auth-server/oauth/token", request, Map.class);
    
    // 获取访问令牌
    String accessToken = (String) response.getBody().get("access_token");
    String refreshToken = (String) response.getBody().get("refresh_token");
    
    // 使用访问令牌访问资源
    return "Access token obtained successfully";
}
```

### 3.2 隐式授权流程（Implicit Grant）

适用于纯前端应用（如单页应用SPA），授权服务器直接将访问令牌返回给客户端，不经过服务器端中转。

**注意**：此流程安全性较低，不推荐在生产环境使用，建议使用授权码流程（带PKCE）替代。

### 3.3 密码凭证流程（Resource Owner Password Credentials Grant）

适用于高度受信任的应用，用户直接向客户端提供用户名和密码，客户端使用这些凭据向授权服务器请求访问令牌。

**注意**：此流程要求客户端高度受信任，不推荐在第三方应用中使用。

**代码示例**：

```java
RestTemplate restTemplate = new RestTemplate();
MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
params.add("grant_type", "password");
params.add("username", username);
params.add("password", password);
params.add("scope", "read write");

HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
headers.setBasicAuth("client-id", "client-secret");

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
ResponseEntity<Map> response = restTemplate.postForEntity("https://auth-server/oauth/token", request, Map.class);

String accessToken = (String) response.getBody().get("access_token");
```

### 3.4 客户端凭证流程（Client Credentials Grant）

适用于服务器间通信，客户端使用自己的凭据向授权服务器请求访问令牌，代表客户端自身而非用户。

**代码示例**：

```java
RestTemplate restTemplate = new RestTemplate();
MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
params.add("grant_type", "client_credentials");
params.add("scope", "read");

HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
headers.setBasicAuth("client-id", "client-secret");

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
ResponseEntity<Map> response = restTemplate.postForEntity("https://auth-server/oauth/token", request, Map.class);

String accessToken = (String) response.getBody().get("access_token");
```

### 3.5 授权码流程 with PKCE（Proof Key for Code Exchange）

授权码流程的增强版本，适用于移动应用和单页应用，通过添加代码挑战（code challenge）来防止授权码拦截攻击。

**流程步骤**：

1. 客户端生成随机字符串（code_verifier）
2. 客户端计算code_verifier的哈希值作为code_challenge
3. 客户端将用户引导至授权服务器，包含code_challenge参数
4. 用户认证并授权
5. 授权服务器返回授权码
6. 客户端使用授权码和code_verifier向授权服务器请求访问令牌
7. 授权服务器验证code_verifier和之前的code_challenge，验证通过后颁发访问令牌

## 4. Spring Security OAuth 2.0 实现

Spring Security 提供了完整的 OAuth 2.0 实现，支持作为授权服务器、资源服务器和客户端。

### 4.1 授权服务器配置

**依赖配置**：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security.oauth</groupId>
    <artifactId>spring-security-oauth2</artifactId>
    <version>2.5.2.RELEASE</version>
</dependency>
```

**配置示例**：

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private DataSource dataSource;

    @Bean
    public TokenStore tokenStore() {
        return new JdbcTokenStore(dataSource);
    }

    @Bean
    public ClientDetailsService clientDetailsService() {
        return new JdbcClientDetailsService(dataSource);
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        // 从数据库加载客户端配置
        clients.withClientDetails(clientDetailsService());
        
        // 或内存配置
        /*
        clients.inMemory()
            .withClient("client-app")
            .secret(passwordEncoder().encode("client-secret"))
            .authorizedGrantTypes("authorization_code", "password", "client_credentials", "implicit", "refresh_token")
            .scopes("read", "write")
            .redirectUris("http://localhost:8080/callback")
            .accessTokenValiditySeconds(3600)
            .refreshTokenValiditySeconds(86400);
        */
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints
            .tokenStore(tokenStore())
            .authenticationManager(authenticationManager)
            .userDetailsService(userDetailsService)
            .allowedTokenEndpointRequestMethods(HttpMethod.GET, HttpMethod.POST);
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        security
            .tokenKeyAccess("permitAll()")
            .checkTokenAccess("isAuthenticated()")
            .allowFormAuthenticationForClients();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 4.2 资源服务器配置

**配置示例**：

```java
@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/public/**").permitAll()
            .antMatchers("/api/**").authenticated()
            .antMatchers("/api/admin/**").hasRole("ADMIN")
            .and()
            .csrf().disable();
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.resourceId("resource-server");
    }
}
```

### 4.3 OAuth 2.0 客户端配置

**配置示例**：

```java
@Configuration
@EnableOAuth2Client
public class OAuth2ClientConfig {

    @Value("${oauth2.client.client-id}")
    private String clientId;

    @Value("${oauth2.client.client-secret}")
    private String clientSecret;

    @Value("${oauth2.client.access-token-uri}")
    private String accessTokenUri;

    @Value("${oauth2.client.user-authorization-uri}")
    private String userAuthorizationUri;

    @Bean
    public OAuth2ProtectedResourceDetails oauth2RemoteResource() {
        AuthorizationCodeResourceDetails details = new AuthorizationCodeResourceDetails();
        details.setClientId(clientId);
        details.setClientSecret(clientSecret);
        details.setAccessTokenUri(accessTokenUri);
        details.setUserAuthorizationUri(userAuthorizationUri);
        details.setScope(Arrays.asList("read", "write"));
        details.setPreEstablishedRedirectUri("http://localhost:8080/callback");
        details.setUseCurrentUri(false);
        return details;
    }

    @Bean
    public OAuth2RestTemplate oauth2RestTemplate(OAuth2ClientContext oauth2ClientContext) {
        return new OAuth2RestTemplate(oauth2RemoteResource(), oauth2ClientContext);
    }
}
```

## 5. OAuth 2.0 最佳实践

### 5.1 安全性最佳实践

- **选择合适的授权流程**：根据应用类型选择适当的授权流程（推荐使用授权码流程 with PKCE）
- **保护客户端密钥**：不要在客户端暴露客户端密钥
- **使用HTTPS**：所有OAuth 2.0通信必须使用HTTPS加密
- **合理设置令牌有效期**：访问令牌有效期不宜过长，可配合刷新令牌使用
- **验证重定向URI**：授权服务器应验证重定向URI是否与注册的一致
- **使用state参数**：防止CSRF攻击
- **实施PKCE**：对于移动应用和单页应用，使用PKCE增强安全性

### 5.2 性能与扩展性考虑

- **使用缓存**：缓存访问令牌和用户信息，减少对授权服务器的请求
- **令牌存储优化**：选择合适的令牌存储方案（如JWT、Redis等）
- **限流与熔断**：对授权服务器和资源服务器实施限流和熔断机制
- **监控与告警**：监控OAuth 2.0相关指标和异常情况

## 6. 常见问题与解决方案

### 6.1 令牌过期处理

**问题**：访问令牌过期导致API请求失败

**解决方案**：
- 使用刷新令牌获取新的访问令牌
- 实现自动刷新令牌的机制
- 为用户提供重新授权的选项

**代码示例**：

```java
public String refreshAccessToken(String refreshToken) {
    RestTemplate restTemplate = new RestTemplate();
    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("grant_type", "refresh_token");
    params.add("refresh_token", refreshToken);
    params.add("client_id", "client-id");
    params.add("client_secret", "client-secret");
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    
    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
    ResponseEntity<Map> response = restTemplate.postForEntity("https://auth-server/oauth/token", request, Map.class);
    
    return (String) response.getBody().get("access_token");
}
```

### 6.2 跨域资源共享（CORS）问题

**问题**：在单页应用中调用OAuth 2.0相关API时出现跨域问题

**解决方案**：
- 在授权服务器和资源服务器上配置CORS支持
- 使用代理服务器转发请求
- 使用后端通道处理OAuth 2.0流程

### 6.3 令牌泄露防护

**问题**：访问令牌可能被截获或泄露

**解决方案**：
- 使用HTTPS加密所有通信
- 实现令牌绑定（如绑定客户端IP）
- 定期轮换令牌
- 监控异常令牌使用情况

## 7. 参考资源

- [OAuth 2.0 官方文档](https://oauth.net/2/)
- [Spring Security OAuth 2.0 文档](https://projects.spring.io/spring-security-oauth/)
- [OAuth 2.0 威胁模型与安全考量](https://tools.ietf.org/html/rfc6819)
- [OpenID Connect 官方文档](https://openid.net/connect/)
- [OAuth 2.0 简化指南](https://aaronparecki.com/oauth-2-simplified/)