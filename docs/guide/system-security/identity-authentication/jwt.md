# JWT (JSON Web Token) 使用文档

## 1. JWT 概述

JSON Web Token (JWT) 是一种开放标准 (RFC 7519)，用于在各方之间安全地传输信息作为JSON对象。这些信息可以被验证和信任，因为它是经过数字签名的。JWT可以使用秘密（使用HMAC算法）或使用RSA或ECDSA的公钥/私钥对进行签名。

### 1.1 主要特点

- **紧凑性**：JWT的大小相对较小，可以通过URL、POST参数或HTTP头部发送
- **自包含**：JWT包含了用户所需的所有信息，避免了多次查询数据库
- **跨语言**：基于JSON，可在不同编程语言间使用
- **数字签名**：保证了数据的完整性和真实性
- **可扩展性**：可以在JWT中添加自定义声明

### 1.2 应用场景

- 身份认证：用户登录后，后续请求使用JWT进行身份验证
- 信息交换：在分布式系统中安全地传输信息
- API授权：控制对API资源的访问权限
- 单点登录（SSO）系统
- 微服务架构中的服务间认证

## 2. JWT 结构

JWT由三部分组成，用点（`.`）分隔：

```
xxxxx.yyyyy.zzzzz
```

这三部分分别是：

### 2.1 Header（头部）

包含两部分信息：令牌类型（typ，通常为JWT）和所使用的签名算法（alg，如HMAC SHA256或RSA）。

**示例**：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

然后，这个JSON被Base64Url编码，形成JWT的第一部分。

### 2.2 Payload（负载）

包含声明（Claims），即有关实体（通常是用户）和其他数据的声明。JWT定义了一些标准声明，同时也支持自定义声明。

**标准声明**：

- `iss`：令牌颁发者
- `sub`：令牌主题（通常是用户ID）
- `aud`：令牌的受众
- `exp`：令牌过期时间（时间戳）
- `nbf`：令牌生效时间（时间戳）
- `iat`：令牌颁发时间（时间戳）
- `jti`：令牌唯一标识符

**示例**：

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "roles": ["user", "admin"]
}
```

然后，这个JSON也被Base64Url编码，形成JWT的第二部分。

### 2.3 Signature（签名）

用于验证JWT的发送者是它声称的人，并确保消息在传输过程中没有被篡改。

**签名计算方式**：

对于HMAC算法：
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

对于RSA算法：
```
RSASHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  privateKey)
```

签名是JWT的第三部分。

## 3. JWT 工作流程

### 3.1 基本流程

1. 用户使用凭证（如用户名和密码）登录
2. 服务器验证凭证，如果有效，生成JWT并返回给客户端
3. 客户端存储JWT（通常在localStorage、sessionStorage或Cookie中）
4. 客户端在后续请求中，通过HTTP头部（通常是Authorization头部，格式为`Bearer <token>`）发送JWT
5. 服务器验证JWT的签名和有效性（如过期时间），验证通过则处理请求

### 3.2 流程图

```
+--------+                           +---------------+
|        |--(1) 登录请求（凭证）--->| 认证服务器     |
| 客户端 |                           |               |
|        |<--(2) JWT 令牌---------|               |
+--------+                           +---------------+
      |                                      ^
      |                                      |
      |                                      |
      v                                      |
+--------+                           +---------------+
|        |--(3) 请求（带JWT）------>| 资源服务器     |
| 客户端 |                           |               |
|        |<--(4) 响应-------------|               |
+--------+                           +---------------+
```

## 4. JWT 在 Spring Boot 中的实现

### 4.1 添加依赖

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT 依赖 -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

### 4.2 JWT 工具类

```java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // 从令牌中获取用户名
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // 从令牌中获取过期时间
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    // 从令牌中获取指定的声明
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // 获取令牌中的所有声明
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }

    // 检查令牌是否过期
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // 生成令牌
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userDetails.getUsername());
    }

    // 生成令牌的核心方法
    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    // 验证令牌
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // 刷新令牌
    public String refreshToken(String token) {
        final Claims claims = getAllClaimsFromToken(token);
        claims.setIssuedAt(new Date(System.currentTimeMillis()));
        claims.setExpiration(new Date(System.currentTimeMillis() + expiration * 1000));
        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
}
```

### 4.3 认证控制器

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // 登录接口
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 认证用户
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        // 设置认证上下文
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 生成JWT令牌
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String token = jwtTokenUtil.generateToken(userDetails);

        // 返回令牌
        return ResponseEntity.ok(new JwtResponse(token));
    }

    // 获取当前用户信息
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(authentication.getPrincipal());
    }

    // 刷新令牌
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String token) {
        String refreshedToken = jwtTokenUtil.refreshToken(token.substring(7)); // 去掉"Bearer "前缀
        return ResponseEntity.ok(new JwtResponse(refreshedToken));
    }

    // 请求和响应模型（为简洁起见省略了getter和setter）
    public static class LoginRequest {
        private String username;
        private String password;
    }

    public static class JwtResponse {
        private String token;

        public JwtResponse(String token) {
            this.token = token;
        }
    }
}
```

### 4.4 JWT 过滤器

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // JWT令牌在请求头中的格式为：Bearer token
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                logger.error("无法获取JWT令牌");
            } catch (Exception e) {
                logger.error("JWT令牌过期或无效");
            }
        }

        // 验证令牌并设置认证上下文
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            
            // 如果令牌有效，配置Spring Security认证
            if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                usernamePasswordAuthenticationToken
                    .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 设置Security上下文
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### 4.5 安全配置

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // 添加JWT过滤器
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## 5. JWT 最佳实践

### 5.1 安全性最佳实践

- **使用HTTPS**：始终通过HTTPS传输JWT，防止中间人攻击
- **保持令牌有效期短**：设置较短的令牌过期时间（通常为15分钟到1小时）
- **安全存储**：客户端应妥善存储JWT，避免XSS攻击
- **使用适当的签名算法**：优先使用非对称加密算法（如RSA）而非对称算法（如HMAC）
- **敏感信息不存储在Payload中**：JWT的Payload是可解码的，不应存储敏感信息
- **实现令牌撤销机制**：在必要时能够撤销有效令牌
- **使用刷新令牌**：结合使用访问令牌和刷新令牌，提高安全性
- **验证所有令牌声明**：包括签名、过期时间、颁发者等

### 5.2 性能优化

- **减少Payload大小**：只包含必要的信息，避免大型JWT
- **缓存验证结果**：避免每次请求都重新解析和验证JWT
- **使用适当的存储方案**：对于分布式系统，可以考虑使用Redis等缓存存储撤销的令牌

### 5.3 集成与扩展

- **与OAuth 2.0集成**：JWT可以作为OAuth 2.0的访问令牌使用
- **多因素认证**：在敏感操作前，要求额外的验证
- **跨域资源共享（CORS）**：正确配置CORS策略，允许跨域请求携带JWT

## 6. 常见问题与解决方案

### 6.1 令牌泄露

**问题**：JWT被截获可能导致未授权访问

**解决方案**：
- 使用HTTPS加密所有通信
- 实现令牌绑定（如绑定IP地址或设备指纹）
- 缩短令牌有效期
- 实施令牌撤销机制

### 6.2 令牌过期处理

**问题**：令牌过期后需要重新登录，影响用户体验

**解决方案**：
- 实现自动刷新令牌机制
- 结合使用访问令牌（短时效）和刷新令牌（长时效）
- 在令牌即将过期前通知客户端

### 6.3 分布式系统中的JWT验证

**问题**：在分布式系统中，如何确保所有服务都能正确验证JWT

**解决方案**：
- 使用集中式的密钥管理系统
- 对于使用非对称加密的场景，确保所有服务都可以访问公钥
- 实现统一的JWT验证库，供所有服务使用

### 6.4 前端存储JWT的安全问题

**问题**：在前端存储JWT可能面临XSS和CSRF攻击

**解决方案**：
- 使用HttpOnly Cookie存储JWT，防止XSS攻击
- 实现CSRF保护机制
- 考虑使用localStorage结合其他安全措施
- 定期清除未使用的令牌

## 7. 参考资源

- [JWT 官方网站](https://jwt.io/)
- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
- [Spring Security 官方文档](https://spring.io/projects/spring-security)
- [JJWT - Java JWT: JSON Web Token for Java and Android](https://github.com/jwtk/jjwt)
- [OAuth 2.0 与 JWT 详解](https://www.baeldung.com/spring-security-oauth-jwt)