# ☕ Java 11 新特性详解

## 一、核心概念与概述

### 1. Java 11 简介

Java 11 是 Java 编程语言的一个长期支持（LTS）版本，于 2018 年 9 月发布。作为继 Java 8 之后的第二个 LTS 版本，Java 11 带来了许多重要的特性和改进，包括性能优化、新的 API、工具增强等。

Java 11 的主要特性包括：
- 局部变量类型推断增强
- HTTP Client API 标准化
- 新的字符串处理方法
- 集合 API 增强
- ZGC 垃圾收集器
- Epsilon 无操作垃圾收集器
- 飞行记录器（JFR）
- 启动单文件源代码程序
- 移除 Java EE 和 CORBA 模块
- 支持 TLS 1.3

### 2. 为什么需要 Java 11？

Java 11 是一个重要的长期支持版本，提供了更好的性能、安全性和稳定性。它引入了许多实用的特性，简化了开发工作，同时移除了过时的组件，使 Java 平台更加现代化。

Java 11 的特性解决了以下问题：
- 提高应用程序的启动速度和响应性能
- 简化 HTTP 客户端开发
- 提供更高效的垃圾回收机制
- 增强字符串和集合的操作能力
- 提升安全性和 TLS 支持
- 优化 Java 平台的模块化结构

## 二、核心特性详解

### 1. 局部变量类型推断增强

Java 11 扩展了 Java 10 中引入的局部变量类型推断（var 关键字），使其可以用于 lambda 表达式的参数声明，这在某些情况下可以提高代码的可读性。

**示例：**
```java
// Java 10 中 var 的使用
var list = new ArrayList<String>();
var stream = list.stream();

// Java 11 中 var 在 lambda 表达式中的使用
(var x, var y) -> x + y;

// 在使用泛型的情况下特别有用
Function<List<String>, Map<String, Integer>> countWords = (var words) -> {
    var counts = new HashMap<String, Integer>();
    for (var word : words) {
        counts.put(word, counts.getOrDefault(word, 0) + 1);
    }
    return counts;
};
```

### 2. HTTP Client API 标准化

Java 11 将 Java 9 中引入的 HTTP/2 客户端 API 从孵化器阶段提升到正式版，提供了一个现代化的 HTTP 客户端 API，支持 HTTP/1.1 和 HTTP/2。

**示例：**
```java
// 创建 HTTP 客户端
HttpClient client = HttpClient.newHttpClient();

// 创建 HTTP 请求
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/data"))
    .header("Accept", "application/json")
    .GET()
    .build();

// 发送同步请求
HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode());
System.out.println(response.body());

// 发送异步请求
CompletableFuture<HttpResponse<String>> future = 
    client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
future.thenApply(HttpResponse::body)
      .thenAccept(System.out::println);

// HTTP/2 支持
HttpClient http2Client = HttpClient.newBuilder()
    .version(HttpClient.Version.HTTP_2)
    .build();
```

### 3. 新的字符串处理方法

Java 11 为 String 类添加了一些实用的新方法，使字符串处理更加便捷。

**示例：**
```java
// 判断字符串是否为空白
String str1 = "   ";
boolean isBlank = str1.isBlank(); // 返回 true

// 将字符串转换为流
String str2 = "Hello\nWorld";
Stream<String> lines = str2.lines();
lines.forEach(System.out::println); // 打印 Hello 和 World

// 重复字符串
String str3 = "Java ";
String repeated = str3.repeat(3); // 结果为 "Java Java Java "

// 去除字符串首尾空白
String str4 = "  Java 11  ";
String stripped = str4.strip(); // 结果为 "Java 11"

// 去除字符串尾部空白
String str5 = "  Java 11\t\n";
String strippedEnd = str5.stripTrailing(); // 结果为 "  Java 11"

// 去除字符串首部空白
String str6 = "\t\n  Java 11";
String strippedStart = str6.stripLeading(); // 结果为 "Java 11"
```

### 4. 集合 API 增强

Java 11 为集合框架添加了一些便利的方法，特别是将集合转换为不可变集合的方法。

**示例：**
```java
// 创建不可变集合
List<String> list = List.of("Java", "11", "Features");
Set<String> set = Set.of("Java", "11", "Features");
Map<String, Integer> map = Map.of("Java", 8, "Java", 11); // 键冲突会抛出异常
Map<String, Integer> map2 = Map.ofEntries(
    Map.entry("Java 8", 2014),
    Map.entry("Java 11", 2018),
    Map.entry("Java 17", 2021)
);

// 集合转数组
List<String> languages = Arrays.asList("Java", "Python", "JavaScript");
String[] languageArray = languages.toArray(String[]::new);

// 创建不可变集合的副本
List<String> mutableList = new ArrayList<>();
mutableList.add("Java");
mutableList.add("11");
List<String> immutableList = List.copyOf(mutableList);
```

### 5. ZGC 垃圾收集器

Java 11 引入了实验性的 ZGC（Z Garbage Collector），这是一个低延迟的垃圾收集器，旨在将 GC 暂停时间控制在毫秒级别，同时支持大容量内存（TB 级别）。

**使用示例：**
```bash
# 启用 ZGC 垃圾收集器
java -XX:+UseZGC -jar application.jar

# 设置最大堆内存
java -XX:+UseZGC -Xmx16g -jar application.jar
```

ZGC 的主要特点：
- 低延迟（暂停时间小于 10ms）
- 可伸缩性（支持 TB 级别的堆内存）
- 并发执行（主要 GC 操作与应用程序线程并发执行）
- 支持大堆和大对象

### 6. Epsilon 无操作垃圾收集器

Java 11 引入了 Epsilon 垃圾收集器，这是一个特殊的 GC，它不进行任何实际的垃圾回收操作。它主要用于性能测试、内存压力测试和寿命非常短的作业。

**使用示例：**
```bash
# 启用 Epsilon 垃圾收集器
java -XX:+UnlockExperimentalVMOptions -XX:+UseEpsilonGC -jar application.jar
```

Epsilon GC 的主要用途：
- 性能基准测试（减少 GC 对测试结果的影响）
- 内存压力测试
- 寿命极短的作业
- 确定应用程序的内存分配率
- 调试 GC 相关问题

### 7. 飞行记录器（JFR）

Java 飞行记录器（JFR）是一个低开销的事件收集框架，用于对 Java 应用程序进行故障诊断和性能分析。在 Java 11 中，JFR 从商业特性变为开源特性。

**使用示例：**
```bash
# 启动应用程序并启用 JFR
java -XX:StartFlightRecording=duration=60s,filename=recording.jfr -jar application.jar

# 从正在运行的应用程序中获取 JFR 记录
jcmd <pid> JFR.start duration=60s filename=recording.jfr
jcmd <pid> JFR.dump filename=dump.jfr
jcmd <pid> JFR.stop
```

JFR 的主要特点：
- 低开销（通常小于 1% 的性能影响）
- 详细的事件收集（包括 JVM 内部事件、Java 应用程序事件等）
- 可配置性（可以根据需要调整记录的事件类型和细节）
- 与 Java Mission Control（JMC）工具集成

### 8. 启动单文件源代码程序

Java 11 允许直接运行 Java 源代码文件，而不需要先编译。这对于快速原型设计和学习非常有用。

**使用示例：**
```bash
# 直接运行 Java 源代码文件
java HelloWorld.java

# 传递参数给源代码程序
java HelloWorld.java arg1 arg2
```

**示例代码（HelloWorld.java）：**
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java 11!");
        if (args.length > 0) {
            System.out.println("Arguments: " + String.join(", ", args));
        }
    }
}
```

### 9. 移除 Java EE 和 CORBA 模块

Java 11 移除了 Java EE 和 CORBA 相关的模块，这些模块在 Java 9 中已被标记为 deprecated for removal。这是 Java 平台模块化的重要一步。

被移除的模块包括：
- java.xml.ws (JAX-WS)
- java.xml.bind (JAXB)
- java.activation (JAF)
- java.xml.ws.annotation (Common Annotations)
- java.corba
- java.transaction
- java.se.ee

如果需要使用这些功能，可以从 Maven Central 等仓库中获取相应的第三方实现。

### 10. 支持 TLS 1.3

Java 11 增加了对 TLS 1.3 协议的支持，提供了更好的安全性和性能。TLS 1.3 是 TLS 协议的重大更新，简化了握手过程，提供了更强的加密算法。

**使用示例：**
```java
// 创建支持 TLS 1.3 的 SSL 上下文
SSLContext sslContext = SSLContext.getInstance("TLSv1.3");
sslContext.init(null, null, null);

// 创建 SSL 套接字工厂
SSLSocketFactory socketFactory = sslContext.getSocketFactory();

// 检查是否支持 TLS 1.3
String[] supportedProtocols = socketFactory.getSupportedProtocols();
boolean tls13Supported = Arrays.asList(supportedProtocols).contains("TLSv1.3");
```

TLS 1.3 的主要优势：
- 更安全（移除了旧的、不安全的加密算法）
- 更快的握手（减少了往返次数）
- 更好的隐私保护
- 简化的协议设计

## 三、代码案例

### 1. 使用 HTTP Client API 访问 RESTful API

**案例：** 使用 Java 11 的 HTTP Client API 访问一个 RESTful API 并处理响应。

**示例：**
```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;

public class HttpClientExample {
    public static void main(String[] args) throws Exception {
        // 创建 HTTP 客户端
        HttpClient client = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(10))
            .build();

        // 创建 HTTP 请求
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/posts/1"))
            .header("Accept", "application/json")
            .GET()
            .build();

        // 发送同步请求
        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());
        System.out.println("Status Code: " + response.statusCode());
        System.out.println("Response Body: " + response.body());

        // 发送异步请求
        CompletableFuture<HttpResponse<String>> future = 
            client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        future.thenApply(HttpResponse::body)
              .thenAccept(body -> System.out.println("Async Response: " + body))
              .join();

        // 发送 POST 请求
        HttpRequest postRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/posts"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{\"title\":\"foo\",\"body\":\"bar\",\"userId\":1}"))
            .build();
        HttpResponse<String> postResponse = client.send(postRequest,
            HttpResponse.BodyHandlers.ofString());
        System.out.println("POST Status: " + postResponse.statusCode());
    }
}
```

### 2. 使用 String 新方法处理文本

**案例：** 使用 Java 11 中 String 类的新方法处理文本数据。

**示例：**
```java
import java.util.stream.Collectors;

public class StringMethodsExample {
    public static void main(String[] args) {
        // 示例文本
        String text = "\n  Java 11 新特性\n  String 方法增强\t\n  ";

        // 检查是否为空白
        System.out.println("Is blank: " + text.isBlank()); // false
        System.out.println("Is blank: " + "\t\n\r".isBlank()); // true

        // 去除空白
        String stripped = text.strip();
        System.out.println("Stripped: [" + stripped + "]");

        String strippedStart = text.stripLeading();
        System.out.println("Stripped start: [" + strippedStart + "]");

        String strippedEnd = text.stripTrailing();
        System.out.println("Stripped end: [" + strippedEnd + "]");

        // 转换为行流并处理
        String multilineText = "Line 1\nLine 2\nLine 3";
        String result = multilineText.lines()
            .filter(line -> line.contains("2"))
            .collect(Collectors.joining(", "));
        System.out.println("Filtered lines: " + result);

        // 重复字符串
        String repeated = "Java ".repeat(3);
        System.out.println("Repeated: " + repeated);

        // 计算字符串的空白部分
        long whitespaceCount = text.chars()
            .filter(Character::isWhitespace)
            .count();
        System.out.println("Whitespace count: " + whitespaceCount);
    }
}
```

## 四、Java 11 新特性的优势与最佳实践

### 1. 优势总结

Java 11 新特性带来的主要优势：
- **现代 HTTP 客户端**：标准化的 HTTP Client API 使网络编程更加简单高效
- **性能优化**：ZGC 等新的垃圾收集器提供了更好的性能和更低的延迟
- **代码简化**：局部变量类型推断增强、新的字符串方法等使代码更加简洁
- **安全性提升**：支持 TLS 1.3 提供了更好的安全保障
- **开发效率**：启动单文件源代码程序等特性提高了开发效率
- **长期支持**：作为 LTS 版本，提供了长期的支持和稳定性

### 2. 最佳实践

使用 Java 11 新特性的最佳实践：

- **优先使用 HTTP Client API**：替代传统的 HttpURLConnection，享受更好的性能和 API 设计
- **合理选择垃圾收集器**：根据应用程序的特点选择合适的 GC，如对延迟敏感的应用考虑 ZGC
- **充分利用字符串新方法**：使用 isBlank()、lines()、repeat()、strip() 等方法简化字符串处理
- **使用不可变集合**：使用 List.of()、Set.of()、Map.of() 等方法创建不可变集合
- **注意模块路径变化**：了解并适应 Java EE 和 CORBA 模块的移除
- **利用 JFR 进行性能分析**：使用 JFR 收集低开销的性能数据进行分析
- **保持代码兼容性**：在升级过程中注意潜在的兼容性问题

### 3. 常见陷阱和注意事项

使用 Java 11 新特性时需要注意的常见陷阱：
- **过度使用局部变量类型推断**：在复杂的场景中过度使用 var 可能会降低代码可读性
- **ZGC 的实验性质**：Java 11 中的 ZGC 仍然是实验性的，在生产环境中使用需要谨慎
- **忽略 TLS 配置**：启用 TLS 1.3 时需要确保所有客户端都支持该协议
- **忘记添加移除的模块依赖**：如果应用程序依赖于被移除的 Java EE 模块，需要添加相应的第三方库
- **错误使用不可变集合**：尝试修改不可变集合会抛出 UnsupportedOperationException
- **JFR 性能影响**：虽然 JFR 的开销很小，但在极端性能敏感的场景中仍需注意
- **忽略兼容性检查**：从旧版本升级到 Java 11 时，应当进行全面的兼容性测试