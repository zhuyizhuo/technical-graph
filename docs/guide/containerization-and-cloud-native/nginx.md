# 🚀 Nginx 最佳实践

## 1. 核心概念与概述

Nginx (Engine X) 是一个高性能的开源 Web 服务器、反向代理服务器和负载均衡器。它以其高并发处理能力、稳定性、低资源消耗和丰富的功能而闻名。

### 1.1 Nginx 的核心价值

- **高性能**：采用事件驱动的异步非阻塞架构，能高效处理大量并发连接
- **稳定性**：在高负载下保持稳定运行，极少出现崩溃情况
- **低资源消耗**：即使在处理大量请求时，内存和 CPU 占用也相对较低
- **多功能**：支持静态文件服务、反向代理、负载均衡、HTTP 缓存、SSL/TLS 终结等
- **可扩展性**：通过模块化设计和第三方模块支持功能扩展
- **跨平台**：支持主流操作系统，如 Linux、Windows、macOS 等

### 1.2 Nginx 与 Apache 的比较

| 特性 | Nginx | Apache |
|------|-------|--------|
| 架构 | 事件驱动异步非阻塞 | 多进程/多线程阻塞式 |
| 并发连接处理 | 单机支持 10 万+并发 | 受限于进程/线程数量 |
| 内存占用 | 低(处理 10,000 个请求约需 2-3MB) | 高(每个连接需要独立进程/线程) |
| 静态文件处理 | 非常高效 | 相对较低 |
| 动态内容处理 | 通常通过反向代理到应用服务器 | 可通过模块直接处理 |
| 配置风格 | 简洁、基于指令 | 复杂、基于声明 |

## 2. Nginx 安装与基础配置

### 2.1 安装 Nginx

#### 2.1.1 在 Linux 系统上安装

```bash
# Ubuntu/Debian
apt update && apt install nginx -y

# CentOS/RHEL
yum install epel-release -y
yum install nginx -y

# 启动 Nginx 并设置开机自启
systemctl start nginx
systemctl enable nginx
```

#### 2.1.2 使用 Docker 安装

```bash
# 拉取官方 Nginx 镜像
docker pull nginx:latest

# 运行 Nginx 容器
docker run -d --name nginx -p 80:80 nginx:latest

# 带自定义配置的运行方式
docker run -d --name nginx -p 80:80 \
  -v /path/to/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v /path/to/html:/usr/share/nginx/html:ro \
  nginx:latest
```

### 2.2 Nginx 配置文件结构

Nginx 的主配置文件位于 `/etc/nginx/nginx.conf`，典型结构如下：

```nginx
# 全局配置块
user nginx;                  # Nginx 运行的用户
worker_processes auto;       # 工作进程数，通常设为 CPU 核心数
error_log /var/log/nginx/error.log warn;  # 错误日志
pid /var/run/nginx.pid;      # PID 文件路径

# 事件模块配置
events {
    worker_connections 1024; # 每个工作进程的最大连接数
    use epoll;               # 事件驱动模型，Linux 推荐使用 epoll
}

# HTTP 核心模块配置
http {
    include       /etc/nginx/mime.types;  # 媒体类型配置
    default_type  application/octet-stream; # 默认媒体类型
    
    # 日志格式定义
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log  /var/log/nginx/access.log  main;  # 访问日志
    
    sendfile        on;  # 开启高效文件传输
    tcp_nopush      on;  # 减少网络报文段数量
    tcp_nodelay     on;  # 提高数据传输实时性
    
    keepalive_timeout  65;  # 长连接超时时间
    
    gzip  on;  # 开启 Gzip 压缩
    
    # 引入额外的服务器配置文件
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### 2.3 基本的服务器配置示例

```nginx
# /etc/nginx/conf.d/default.conf
server {
    listen 80;                 # 监听端口
    server_name example.com;   # 域名
    
    root /usr/share/nginx/html;  # 网站根目录
    index index.html index.htm;  # 默认索引文件
    
    # 访问日志配置
    access_log /var/log/nginx/example.com.access.log main;
    error_log /var/log/nginx/example.com.error.log warn;
    
    # 静态文件缓存设置
    location ~* \.(jpg|jpeg|png|gif|css|js|ico)$ {
        expires 30d;  # 设置缓存过期时间为 30 天
        add_header Cache-Control "public, max-age=2592000";
    }
    
    # 错误页面配置
    error_page 404 /404.html;
    location = /404.html {
        internal;  # 只允许内部重定向访问
    }
    
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        internal;
    }
}
```

## 3. Nginx 作为 Web 服务器

### 3.1 静态文件服务配置

Nginx 非常适合作为静态文件服务器，以下是优化的静态文件服务配置：

```nginx
server {
    listen 80;
    server_name static.example.com;
    
    root /var/www/static;
    
    # 禁用访问日志以提高性能
    access_log off;
    
    # 静态文件处理优化
    location / {
        autoindex off;  # 禁止目录列表
        expires max;    # 最大缓存时间
        add_header Cache-Control "public, immutable";
        
        # 尝试直接提供文件，不存在则返回 404
        try_files $uri =404;
    }
    
    # 图片文件特殊处理
    location ~* \.(png|jpg|jpeg|gif|webp)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        
        # 图片优化
        image_filter resize 800 0;  # 限制宽度为 800px，高度自适应
        image_filter_jpeg_quality 85;  # JPEG 质量
        image_filter_buffer 8M;  # 图片处理缓冲区
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 3.2 虚拟主机配置

Nginx 支持基于名称和基于 IP 的虚拟主机，以下是基于名称的虚拟主机配置示例：

```nginx
# 第一个虚拟主机
server {
    listen 80;
    server_name site1.example.com;
    
    root /var/www/site1;
    index index.html;
}

# 第二个虚拟主机
server {
    listen 80;
    server_name site2.example.com;
    
    root /var/www/site2;
    index index.html;
}

# 默认虚拟主机，处理未匹配的请求
server {
    listen 80 default_server;
    
    return 444;  # 直接关闭连接，不返回任何响应
}
```

## 4. Nginx 作为反向代理

### 4.1 基本反向代理配置

Nginx 常被用作反向代理服务器，将请求转发到后端应用服务器：

```nginx
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        # 设置代理参数
        proxy_pass http://backend_server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 代理缓冲区设置
        proxy_buffering on;
        proxy_buffer_size 16k;
        proxy_buffers 4 64k;
        proxy_busy_buffers_size 128k;
        
        # 代理连接超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 健康检查端点
    location /health {
        proxy_pass http://backend_server:8080/health;
        access_log off;
        log_not_found off;
    }
}
```

### 4.2 SSL/TLS 终结配置

Nginx 可以作为 SSL/TLS 终结点，处理 HTTPS 请求并将解密后的请求转发给后端服务器：

```nginx
server {
    listen 443 ssl http2;
    server_name secure.example.com;
    
    # SSL 证书配置
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    
    # HSTS 配置
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    location / {
        proxy_pass http://backend_server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP 到 HTTPS 重定向
server {
    listen 80;
    server_name secure.example.com;
    
    return 301 https://$host$request_uri;
}
```

### 4.3 WebSocket 代理配置

Nginx 可以代理 WebSocket 连接，实现双向通信：

```nginx
server {
    listen 80;
    server_name ws.example.com;
    
    location /ws {
        proxy_pass http://websocket_server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400s;  # 延长超时时间
    }
}
```

## 5. Nginx 负载均衡配置

### 5.1 负载均衡算法

Nginx 支持多种负载均衡算法：

- **round-robin**：轮询，默认算法，请求依次分配给后端服务器
- **least_conn**：最少连接，请求分配给当前连接数最少的服务器
- **ip_hash**：IP 哈希，同一 IP 的请求总是转发到同一台服务器
- **hash**：基于指定键的哈希，如请求 URL 或请求头
- **random**：随机选择后端服务器

### 5.2 基本负载均衡配置

```nginx
# 定义后端服务器组
upstream backend {
    # 使用轮询算法
    server backend1.example.com:8080;
    server backend2.example.com:8080;
    server backend3.example.com:8080;
}

server {
    listen 80;
    server_name lb.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 5.3 高级负载均衡配置

```nginx
# 带权重和健康检查的负载均衡配置
upstream backend {
    # 使用最少连接算法
    least_conn;
    
    # 服务器配置，weight 表示权重
    server backend1.example.com:8080 weight=3 max_fails=3 fail_timeout=30s;
    server backend2.example.com:8080 weight=2 max_fails=3 fail_timeout=30s;
    server backend3.example.com:8080 weight=1 max_fails=3 fail_timeout=30s;
    
    # 备用服务器，当所有主服务器不可用时启用
    server backup.example.com:8080 backup;
    
    # 健康检查配置
    check interval=3000 rise=2 fall=3 timeout=1000 type=http;
    check_http_send "GET /health HTTP/1.0\r\nHost: $host\r\n\r\n";
    check_http_expect_alive http_2xx http_3xx;
}

server {
    listen 80;
    server_name lb.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 代理重试机制
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_next_upstream_tries 2;
    }
}
```

## 6. Nginx 性能优化

### 6.1 工作进程优化

```nginx
# 全局配置
user nginx;
# 工作进程数设为 CPU 核心数
worker_processes auto;
# 将工作进程绑定到特定 CPU 核心
worker_cpu_affinity auto;

# 事件模块配置
events {
    # 每个工作进程的最大连接数
    worker_connections 10240;
    # 使用高效的事件驱动模型
    use epoll;
    # 允许多个连接同时接受
    multi_accept on;
}
```

### 6.2 HTTP 优化

```nginx
http {
    # 隐藏 Nginx 版本信息
    server_tokens off;
    
    # 文件传输优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # 缓冲区优化
    client_body_buffer_size 16k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
    
    # 连接超时优化
    client_body_timeout 12s;
    client_header_timeout 12s;
    keepalive_timeout 65;
    send_timeout 10s;
    
    # 限制请求大小
    client_max_body_size 20m;
    
    # 开启文件描述符缓存
    open_file_cache max=10000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # 启用 Gzip 压缩
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 启用 Brotli 压缩（如果安装了 Brotli 模块）
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 6.3 静态资源缓存优化

```nginx
server {
    # ...其他配置...
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|woff|woff2|ttf|eot)$ {
        # 设置长期缓存
        expires 1y;
        # 启用强缓存
        add_header Cache-Control "public, immutable";
        # 禁用这些资源的日志
        access_log off;
        # 优化文件传输
        open_file_cache max=1000 inactive=120s;
        open_file_cache_valid 45s;
        open_file_cache_min_uses 2;
        open_file_cache_errors off;
    }
    
    # 版本化资源的永久缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|webp)\.[0-9a-f]+\.(css|js|png|jpg|jpeg|gif|webp)$ {
        expires max;
        add_header Cache-Control "public, immutable";
        access_log off;
        try_files $uri =404;
    }
}
```

## 7. Nginx 安全配置

### 7.1 基本安全措施

```nginx
http {
    # 隐藏 Nginx 版本信息
    server_tokens off;
    
    # 限制请求方法
    if ($request_method !~ ^(GET|POST|HEAD|OPTIONS)$) {
        return 405;
    }
    
    # 防止点击劫持
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # 防止 XSS 攻击
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 防止 MIME 类型混淆
    add_header X-Content-Type-Options "nosniff" always;
    
    # 内容安全策略
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src 'none'; object-src 'none'" always;
}

server {
    # ...其他配置...
    
    # 禁止访问 .htaccess 等隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 禁止访问敏感目录
    location ~* /(uploads|wp-content|wp-admin|wp-includes)/.*\.php$ {
        deny all;
    }
    
    # 限制请求体大小，防止 DoS 攻击
    client_max_body_size 10m;
}
```

### 7.2 访问控制

```nginx
server {
    # ...其他配置...
    
    # 基于 IP 的访问控制
    location /admin {
        # 允许特定 IP 访问
        allow 192.168.1.0/24;
        allow 127.0.0.1;
        # 拒绝其他所有 IP
        deny all;
        
        proxy_pass http://backend;
    }
    
    # HTTP 基本认证
    location /private {
        auth_basic "Restricted Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
        
        proxy_pass http://backend;
    }
}
```

创建密码文件：

```bash
# 安装 apache2-utils（包含 htpasswd 工具）
apt install apache2-utils -y

# 创建密码文件
touch /etc/nginx/.htpasswd
chown nginx:nginx /etc/nginx/.htpasswd
chmod 600 /etc/nginx/.htpasswd

# 添加用户
htpasswd -b /etc/nginx/.htpasswd username password
```

### 7.3 防 DDoS 配置

```nginx
http {
    # 限制连接数
    limit_conn_zone $binary_remote_addr zone=per_ip_conn:10m;
    limit_conn_zone $server_name zone=per_server_conn:10m;
    
    # 限制请求速率
    limit_req_zone $binary_remote_addr zone=per_ip_req:10m rate=10r/s;
    
    # 限制每个 IP 的并发连接数
    limit_conn per_ip_conn 10;
    # 限制每个服务器的并发连接数
    limit_conn per_server_conn 100;
    
    server {
        # ...其他配置...
        
        location / {
            # 应用请求速率限制
            limit_req zone=per_ip_req burst=20 nodelay;
            
            # 大文件上传限制
            client_max_body_size 10m;
            
            proxy_pass http://backend;
        }
        
        # 特殊接口的额外保护
        location /api {
            limit_req zone=per_ip_req burst=5 nodelay;
            
            # 增加请求处理时间记录
            log_format api_log '$remote_addr - $remote_user [$time_local] "$request" '
                              '$status $body_bytes_sent "$http_referer" '
                              '"$http_user_agent" "$http_x_forwarded_for" '
                              'rt=$request_time uct="$upstream_connect_time" uht="$upstream_header_time" urt="$upstream_response_time"';
            
            access_log /var/log/nginx/api.access.log api_log;
            
            proxy_pass http://backend_api;
        }
    }
}
```

## 8. Nginx 日志与监控

### 8.1 日志配置

```nginx
http {
    # 自定义日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # 详细的请求处理时间日志格式
    log_format timed_combined '$remote_addr - $remote_user [$time_local] "$request" '
                             '$status $body_bytes_sent "$http_referer" '
                             '"$http_user_agent" "$http_x_forwarded_for" '
                             'rt=$request_time uct="$upstream_connect_time" uht="$upstream_header_time" urt="$upstream_response_time"';
    
    # 访问日志配置
    access_log /var/log/nginx/access.log main;
    
    # 错误日志配置
    error_log /var/log/nginx/error.log warn;
    
    server {
        # ...其他配置...
        
        # 特定服务器的访问日志
        access_log /var/log/nginx/example.com.access.log timed_combined;
        error_log /var/log/nginx/example.com.error.log error;
        
        # 禁用特定 location 的日志
        location /images {
            access_log off;
            log_not_found off;
        }
    }
}
```

### 8.2 日志轮转配置

使用 logrotate 管理 Nginx 日志：

```bash
# 创建或编辑 logrotate 配置文件
vim /etc/logrotate.d/nginx
```

配置内容：

```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 nginx adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

### 8.3 Nginx 状态监控

启用 Nginx 的 stub_status 模块进行基本监控：

```nginx
server {
    listen 80;
    server_name localhost;
    
    # 限制访问状态页面的 IP
    allow 127.0.0.1;
    deny all;
    
    location /nginx_status {
        stub_status on;
        access_log off;
        log_not_found off;
    }
}
```

访问状态页面：

```bash
curl http://localhost/nginx_status
```

响应示例：

```
Active connections: 2 
server accepts handled requests
 123 123 456 
Reading: 0 Writing: 1 Waiting: 1 
```

### 8.4 集成监控系统

Nginx 可以与多种监控系统集成，如 Prometheus、Grafana、Zabbix 等。以下是与 Prometheus 集成的示例：

安装 nginx-prometheus-exporter：

```bash
docker pull nginx/nginx-prometheus-exporter:latest

docker run -d --name nginx-exporter -p 9113:9113 \
  nginx/nginx-prometheus-exporter:latest \
  -nginx.scrape-uri=http://nginx-server:80/nginx_status
```

在 Prometheus 配置中添加抓取目标：

```yaml
scrape_configs:
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']
```

## 9. Nginx 常见问题与解决方案

### 9.1 502 Bad Gateway 错误

**可能原因**：
- 后端服务器不可用或响应超时
- 后端服务器返回了无效响应
- Nginx 配置错误

**解决方案**：
- 检查后端服务器是否正常运行
- 增加 proxy_read_timeout 和 proxy_connect_timeout 值
- 检查 proxy_pass 配置是否正确
- 查看错误日志获取更多详细信息

```nginx
# 增加超时时间示例
location / {
    proxy_pass http://backend;
    proxy_connect_timeout 60s;
    proxy_read_timeout 120s;
    proxy_send_timeout 60s;
}
```

### 9.2 504 Gateway Timeout 错误

**可能原因**：
- 后端服务器处理请求时间过长
- 后端服务器过载
- 网络问题

**解决方案**：
- 优化后端应用性能
- 增加后端服务器数量或启用负载均衡
- 增加 proxy_read_timeout 值
- 检查网络连接状况

### 9.3 静态文件 404 错误

**可能原因**：
- 文件路径配置错误
- 文件权限问题
- SElinux 限制（在 CentOS/RHEL 系统上）

**解决方案**：
- 检查 root 和 alias 配置是否正确
- 确保 Nginx 用户有文件访问权限
- 检查并调整 SElinux 策略或临时禁用 SElinux 测试

```bash
# 检查文件权限
ls -la /path/to/files
chown -R nginx:nginx /path/to/files

# 临时禁用 SElinux
setenforce 0
```

### 9.4 Nginx 启动失败

**可能原因**：
- 配置文件语法错误
- 端口被占用
- 权限问题

**解决方案**：
- 使用 nginx -t 检查配置文件语法
- 使用 netstat 或 lsof 检查端口占用情况
- 确保 Nginx 有足够的权限访问文件和绑定端口

```bash
# 检查配置文件语法
nginx -t

# 检查端口占用情况
netstat -tuln | grep 80

# 查看详细错误日志
journalctl -xe | grep nginx
```

## 10. Nginx 进阶应用

### 10.1 Nginx 作为 API 网关

```nginx
http {
    # API 限流配置
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    # API 服务器组
    upstream api_servers {
        server api1.example.com:8000;
        server api2.example.com:8000;
        server api3.example.com:8000;
        least_conn;
    }
    
    server {
        listen 80;
        server_name api-gateway.example.com;
        
        # 全局 API 前缀
        location /api {
            # 应用限流
            limit_req zone=api_limit burst=20 nodelay;
            
            # API 认证（简单示例）
            if ($http_authorization != "Bearer secret-token") {
                return 401;
            }
            
            # API 路径重写
            rewrite ^/api/(.*)$ /$1 break;
            
            # 代理到 API 服务器组
            proxy_pass http://api_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # 响应头处理
            add_header X-API-Version "1.0" always;
        }
        
        # API 文档路径
        location /docs {
            alias /var/www/api-docs;
            index index.html;
        }
        
        # API 健康检查
        location /health {
            return 200 'OK';
            add_header Content-Type text/plain;
        }
    }
}
```

### 10.2 Nginx 与 Docker 集成

使用 Docker Compose 部署 Nginx 和后端应用：

```yaml
# docker-compose.yml
version: '3'

services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./static:/usr/share/nginx/html
    depends_on:
      - app1
      - app2
    restart: always
    
  app1:
    image: myapp/app1:latest
    expose:
      - "8000"
    restart: always
    
  app2:
    image: myapp/app2:latest
    expose:
      - "8001"
    restart: always
```

Nginx 配置文件 (`./nginx/conf.d/default.conf`):

```nginx
upstream apps {
    server app1:8000;
    server app2:8001;
    least_conn;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://apps;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /static {
        alias /usr/share/nginx/html;
        expires 30d;
    }
}
```

### 10.3 Nginx 缓存配置

启用 Nginx 内容缓存，减轻后端服务器压力：

```nginx
http {
    # 定义缓存路径
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                     inactive=60m use_temp_path=off;
    
    server {
        listen 80;
        server_name cache.example.com;
        
        location / {
            # 启用缓存
            proxy_cache my_cache;
            # 根据请求 URL 和参数生成缓存键
            proxy_cache_key "$scheme$request_method$host$request_uri";
            # 缓存有效状态码
            proxy_cache_valid 200 304 60m;
            # 缓存无效状态码
            proxy_cache_valid any 1m;
            # 缓存控制
            proxy_cache_revalidate on;
            proxy_cache_min_uses 3;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            
            # 设置缓存状态响应头
            add_header X-Cache-Status $upstream_cache_status;
            
            proxy_pass http://backend;
            proxy_set_header Host $host;
        }
        
        # 清除缓存的接口（需限制访问）
        location /purge {
            allow 127.0.0.1;
            deny all;
            proxy_cache_purge my_cache "$scheme$request_method$host$request_uri";
        }
    }
}
```

## 11. 总结与最佳实践建议

Nginx 是一个功能强大且灵活的 Web 服务器和反向代理服务器，通过合理配置可以实现高性能、高可用和安全的 Web 服务。以下是一些关键的最佳实践建议：

1. **合理配置工作进程**：根据服务器 CPU 核心数设置 worker_processes，通常设为 auto 或等于核心数
2. **优化连接处理**：使用 epoll 事件模型，调整 worker_connections 以充分利用系统资源
3. **启用高效文件传输**：开启 sendfile、tcp_nopush 和 tcp_nodelay 提升传输性能
4. **实施安全措施**：隐藏版本信息、配置安全响应头、限制访问、使用 HTTPS
5. **优化静态资源**：设置适当的缓存策略、启用压缩、优化文件传输
6. **实施监控和日志管理**：配置详细日志、启用状态监控、集成监控系统
7. **使用 Docker 简化部署**：利用容器化技术简化 Nginx 部署和管理
8. **定期更新和维护**：及时应用安全补丁和更新，定期检查配置和性能
9. **负载均衡和高可用**：配置负载均衡和健康检查，确保服务高可用
10. **性能测试和调优**：定期进行性能测试，根据测试结果调整配置参数

通过遵循这些最佳实践，您可以充分发挥 Nginx 的潜力，为您的应用提供稳定、高效、安全的 Web 服务。