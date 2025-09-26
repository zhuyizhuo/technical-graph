# ☕ Java 21 新特性详解

## 一、核心概念与概述

### 1. Java 21 简介

Java 21 是 Java 编程语言的一个长期支持（LTS）版本，于 2023 年 9 月发布。作为继 Java 17 之后的第四个 LTS 版本，Java 21 带来了许多重要的特性和改进，包括虚拟线程、记录模式、开关表达式增强等。

Java 21 的主要特性包括：
- 虚拟线程（Virtual Threads）
- 记录模式（Record Patterns）
- 模式匹配 for switch（正式版）
- 字符串模板（预览）
- 未命名变量和模式
- 有序集合（Sequenced Collections）
- 结构化并发（预览）
- 外部函数和内存 API（正式版）
- Vector API（第七轮孵化）
- 废弃 Applet API（最终版）
- 密钥封装机制（KEM）
- 分代 ZGC

### 2. 为什么需要 Java 21？

Java 21 是一个重要的长期支持版本，提供了更好的性能、可扩展性和开发体验。它引入了虚拟线程等革命性特性，彻底改变了 Java 中并发编程的方式，同时还增强了模式匹配等现代语言特性。

Java 21 的特性解决了以下问题：
- 提高并发应用程序的吞吐量和可伸缩性
- 简化并发编程模型，减少线程管理的复杂性
- 增强 Java 语言的表达能力和类型安全性
- 提供更灵活和强大的集合操作
- 优化垃圾收集器性能
- 改进安全性和加密支持

## 二、核心特性详解

### 1. 虚拟线程（Virtual Threads）

虚拟线程是 Java 21 中引入的最具革命性的特性，它是轻量级线程，可以显著提高并发应用程序的吞吐量。虚拟线程在 JDK 内部实现，由 JVM 而不是操作系统调度，因此可以创建数百万个而不会耗尽系统资源。

**示例：**
```java
// 创建并启动单个虚拟线程
Runnable task = () -> System.out.println("Hello from Virtual Thread!");
Thread.ofVirtual().start(task);

// 使用虚拟线程执行多个任务
List<Thread> threads = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
    final int taskId = i;
    Thread vt = Thread.ofVirtual().start(() -> {
        System.out.println("Task " + taskId + " running on " + Thread.currentThread());
        try {
            Thread.sleep(Duration.ofMillis(10));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    });
    threads.add(vt);
}

// 等待所有虚拟线程完成
for (Thread thread : threads) {
    try {
        thread.join();
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}

// 使用 ExecutorService 创建虚拟线程池
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 1000; i++) {
        final int taskId = i;
        executor.submit(() -> {
            System.out.println("Task " + taskId);
            Thread.sleep(Duration.ofMillis(10));
            return taskId;
        });
    }
}
```

虚拟线程的主要特点：
- 轻量级：可以创建数百万个而不会耗尽系统资源
- 兼容现有 API：可以使用现有的 Thread API
- 由 JVM 调度：而不是操作系统调度
- 适合 I/O 密集型任务：特别适合有大量阻塞操作的应用程序
- 保持 Thread API 的语义：包括中断、优先级等

### 2. 记录模式（Record Patterns）

记录模式是 Java 21 中引入的一个重要语言特性，它允许我们在模式匹配中解构记录（record）对象，提取其中的组件值。这使代码更加简洁和易读。

**示例：**
```java
// 定义记录类
public record Point(int x, int y) {};
public record Circle(Point center, int radius) {};
public record Rectangle(Point topLeft, Point bottomRight) {};
public record Triangle(Point a, Point b, Point c) {};

// 使用记录模式解构记录对象
public static void printPoint(Object obj) {
    if (obj instanceof Point(int x, int y)) {
        System.out.printf("点坐标: (%d, %d)%n", x, y);
    }
}

// 嵌套记录模式
public static void printCircle(Object obj) {
    if (obj instanceof Circle(Point(int x, int y), int r)) {
        System.out.printf("圆: 中心(%d, %d), 半径: %d%n", x, y, r);
    }
}

// 在 switch 语句中使用记录模式
public static double calculateArea(Object shape) {
    return switch (shape) {
        case Circle(Point(int x, int y), int r) -> Math.PI * r * r;
        case Rectangle(Point(int x1, int y1), Point(int x2, int y2)) -> 
            Math.abs((x2 - x1) * (y2 - y1));
        case Triangle(Point(int x1, int y1), Point(int x2, int y2), Point(int x3, int y3)) -> 
            Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
        default -> throw new IllegalArgumentException("未知形状: " + shape);
    };
}

// 记录模式与 instanceof 模式结合
public static void processShape(Object shape) {
    if (shape instanceof Circle c && c.radius() > 10) {
        System.out.println("大圆形");
    } else if (shape instanceof Rectangle(Point(int x1, int y1), Point(int x2, int y2)) rect) {
        double width = Math.abs(x2 - x1);
        double height = Math.abs(y2 - y1);
        if (width == height) {
            System.out.println("正方形");
        } else {
            System.out.println("矩形");
        }
    }
}
```

记录模式的主要特点：
- 支持解构记录对象的组件
- 支持嵌套记录模式
- 可以与其他模式结合使用
- 增强了代码的可读性和简洁性
- 提供了更好的类型安全性

### 3. 模式匹配 for switch（正式版）

Java 21 将模式匹配 for switch 从预览特性升级为正式版，提供了更强大和灵活的 switch 语句功能。现在可以在 switch 语句中使用类型模式、记录模式和保护表达式。

**示例：**
```java
// 使用模式匹配的 switch 语句处理不同类型
public static String formatValue(Object obj) {
    return switch (obj) {
        case null -> "值为 null";
        case String s -> String.format("字符串: '%s'", s);
        case Integer i -> String.format("整数: %d", i);
        case Long l -> String.format("长整数: %d", l);
        case Double d -> String.format("浮点数: %.2f", d);
        case Boolean b -> String.format("布尔值: %s", b);
        case List<?> list -> String.format("列表: %s", list);
        default -> String.format("未知类型: %s", obj.getClass().getSimpleName());
    };
}

// 使用记录模式和保护表达式
public static double calculate(Object obj) {
    return switch (obj) {
        case Integer i when i > 10 -> i * 2.0;
        case Integer i -> i * 1.0;
        case Double d when d < 0 -> Math.abs(d);
        case Double d -> d;
        case String s -> Double.parseDouble(s);
        case Point(int x, int y) -> Math.sqrt(x*x + y*y);
        default -> 0.0;
    };
}

// 使用枚举常量作为 case 标签
public enum Season {
    SPRING, SUMMER, AUTUMN, WINTER
}

public static String getSeasonDescription(Season season) {
    return switch (season) {
        case SPRING -> "春天，万物复苏";
        case SUMMER -> "夏天，烈日炎炎";
        case AUTUMN -> "秋天，秋高气爽";
        case WINTER -> "冬天，寒风刺骨";
    };
}

// 多常量 case 标签
public static String getTemperatureCategory(int temperature) {
    return switch (temperature) {
        case 0, 1, 2, 3, 4, 5 -> "非常冷";
        case 6, 7, 8, 9, 10 -> "冷";
        case 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 -> "凉爽";
        case 21, 22, 23, 24, 25, 26, 27, 28 -> "舒适";
        case 29, 30, 31, 32 -> "热";
        default -> temperature > 32 ? "非常热" : "极寒";
    };
}
```

模式匹配 switch 的主要特点：
- 支持类型模式、记录模式和常量模式
- 支持保护表达式（when 子句）
- 不需要 break 语句
- 支持 null 作为 case 标签
- 确保了穷举检查
- 可以直接在 case 标签中声明变量

### 4. 字符串模板（预览）

Java 21 引入了字符串模板的预览版本，这是一个用于安全地构造字符串的新机制，可以替代字符串连接和格式化操作。

**示例：**
```java
// 使用字符串模板
String name = "Java";
int version = 21;
String message = STR."Hello, \{name} \{version}!";
System.out.println(message); // 输出: Hello, Java 21!

// 嵌套表达式
int a = 10;
int b = 20;
String calc = STR."\{a} + \{b} = \{a + b}";
System.out.println(calc); // 输出: 10 + 20 = 30

// 多行字符串模板
String multiLine = STR."""
    第一行: \{name}
    第二行: \{version}
    第三行: \{calc}
""";
System.out.println(multiLine);

// 原始字符串模板（不转义）
String path = RAW."C:\\Users\\name\\file.txt";
System.out.println(path); // 输出: C:\Users\name\file.txt

// 自定义处理器
interface HtmlProcessor extends StringTemplate.Processor<String, RuntimeException> {
    @Override
    String process(StringTemplate st) {
        // 实现 HTML 转义逻辑
        String processed = st.interpolate((fragment, value) -> {
            if (value == null) return "null";
            String str = value.toString();
            // 转义 HTML 特殊字符
            return str.replace("&", "&amp;")
                     .replace("<", "&lt;")
                     .replace(">", "&gt;")
                     .replace('"', '&quot;')
                     .replace("'", "&#39;");
        });
        return processed;
    }
}

HtmlProcessor HTML = new HtmlProcessor() {};
String userInput = "<script>alert('XSS')</script>";
String safeHtml = HTML."用户输入: \{userInput}";
System.out.println(safeHtml); // 输出: 用户输入: &lt;script&gt;alert('XSS')&lt;/script&gt;
```

字符串模板的主要特点：
- 简化字符串构造
- 支持表达式插值
- 提供安全的字符串处理机制
- 支持多行字符串
- 可扩展的处理器系统
- 比字符串连接更高效

### 5. 有序集合（Sequenced Collections）

Java 21 引入了新的接口来表示有序集合，提供了统一的操作来访问集合的第一个和最后一个元素，以及反向遍历集合。

**示例：**
```java
// 创建有序集合
SequencedSet<String> set = new LinkedHashSet<>(List.of("a", "b", "c"));
SequencedMap<String, Integer> map = new LinkedHashMap<>(Map.of("a", 1, "b", 2, "c", 3));

// 获取第一个和最后一个元素
String firstElement = set.getFirst(); // "a"
String lastElement = set.getLast();   // "c"

Map.Entry<String, Integer> firstEntry = map.firstEntry(); // a=1
Map.Entry<String, Integer> lastEntry = map.lastEntry();   // c=3

// 添加和删除第一个/最后一个元素
set.addFirst("x");  // 集合变为 [x, a, b, c]
set.addLast("z");   // 集合变为 [x, a, b, c, z]
set.removeFirst();  // 集合变为 [a, b, c, z]
set.removeLast();   // 集合变为 [a, b, c]

map.putFirst("x", 0); // 映射变为 {x=0, a=1, b=2, c=3}
map.putLast("z", 4);  // 映射变为 {x=0, a=1, b=2, c=3, z=4}
map.removeFirst();    // 映射变为 {a=1, b=2, c=3, z=4}
map.removeLast();     // 映射变为 {a=1, b=2, c=3}

// 反向遍历集合
SequencedSet<String> reversedSet = set.reversed();  // [c, b, a]
SequencedMap<String, Integer> reversedMap = map.reversed(); // {c=3, b=2, a=1}

// 使用 List 的新方法
List<String> list = new ArrayList<>(List.of("a", "b", "c"));
list.addFirst("x");  // [x, a, b, c]
list.addLast("z");   // [x, a, b, c, z]
List<String> reversedList = list.reversed(); // [z, c, b, a, x]
```

有序集合的主要接口：
- `SequencedCollection<E>`：表示有序的集合，如 List 和 LinkedHashSet
- `SequencedSet<E>`：表示有序的集合，如 LinkedHashSet
- `SequencedMap<K, V>`：表示有序的映射，如 LinkedHashMap

### 6. 结构化并发（预览）

Java 21 引入了结构化并发的预览版本，这是一种并发编程范式，旨在简化多任务并发执行的管理，确保任务要么全部成功，要么全部失败，同时提供更好的错误处理和资源管理。

**示例：**
```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.Future;

// 使用结构化并发执行多个任务
public record UserInfo(String name, int age, String email) {};

public UserInfo fetchUserInfo(String userId) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        // 并行执行多个任务
        Future<String> nameFuture = scope.fork(() -> fetchUserName(userId));
        Future<Integer> ageFuture = scope.fork(() -> fetchUserAge(userId));
        Future<String> emailFuture = scope.fork(() -> fetchUserEmail(userId));
        
        // 等待所有任务完成，如有任一任务失败则取消其他任务
        scope.join();
        scope.throwIfFailed();
        
        // 获取所有任务的结果
        return new UserInfo(
            nameFuture.resultNow(),
            ageFuture.resultNow(),
            emailFuture.resultNow()
        );
    }
}

// 模拟异步API调用
private String fetchUserName(String userId) throws InterruptedException {
    Thread.sleep(100); // 模拟网络延迟
    return "User " + userId;
}

private Integer fetchUserAge(String userId) throws InterruptedException {
    Thread.sleep(150); // 模拟网络延迟
    return 30;
}

private String fetchUserEmail(String userId) throws InterruptedException {
    Thread.sleep(120); // 模拟网络延迟
    return userId + "@example.com";
}

// 使用结构化并发与虚拟线程
public void processBatch(List<String> userIds) throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        for (String userId : userIds) {
            scope.fork(() -> {
                // 使用虚拟线程处理每个用户
                Thread.ofVirtual().start(() -> {
                    try {
                        UserInfo userInfo = fetchUserInfo(userId);
                        System.out.println("Processed user: " + userInfo);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }).join();
                return userId;
            });
        }
        
        scope.join();
        scope.throwIfFailed();
    }
}
```

结构化并发的主要特点：
- 提供任务的层次结构管理
- 确保任务要么全部成功，要么全部失败
- 自动取消未完成的任务
- 简化错误处理
- 防止线程泄漏
- 与虚拟线程良好集成

### 7. 外部函数和内存 API（正式版）

Java 21 将外部函数和内存 API 从预览特性升级为正式版，这是一个用于与本机代码和内存进行交互的 API，旨在替代 JNI（Java Native Interface）。

**示例：**
```java
import java.lang.foreign.*;

// 加载本机库
System.loadLibrary("mylib");

// 获取外部函数
SymbolLookup libLookup = SymbolLookup.loaderLookup();
MethodHandle sumHandle = Linker.nativeLinker().downcallHandle(
    libLookup.lookup("sum").orElseThrow(),
    FunctionDescriptor.of(ValueLayout.JAVA_INT, ValueLayout.JAVA_INT, ValueLayout.JAVA_INT)
);

// 调用外部函数
int result = (int) sumHandle.invokeExact(10, 20);
System.out.println("Sum: " + result);

// 分配外部内存
try (Arena arena = Arena.ofConfined()) {
    // 分配整数数组内存
    MemorySegment array = arena.allocateArray(ValueLayout.JAVA_INT, 10, 20, 30, 40, 50);
    
    // 读取内存内容
    int firstElement = array.get(ValueLayout.JAVA_INT, 0);
    int lastElement = array.get(ValueLayout.JAVA_INT, array.byteSize() - ValueLayout.JAVA_INT.byteSize());
    
    System.out.println("First element: " + firstElement);
    System.out.println("Last element: " + lastElement);
    
    // 遍历数组
    for (int i = 0; i < 5; i++) {
        int value = array.getAtIndex(ValueLayout.JAVA_INT, i);
        System.out.println("Element " + i + ": " + value);
    }
}
```

外部函数和内存 API 的主要优势：
- 安全地访问本机代码和内存
- 比 JNI 更简单、更现代的 API
- 自动内存管理
- 避免了 JNI 的复杂性和安全问题
- 更好的性能

### 8. 分代 ZGC

Java 21 引入了分代 ZGC（Generational ZGC），这是对 ZGC 垃圾收集器的重大改进。分代 ZGC 将堆内存分为年轻代和老年代，针对不同代的对象使用不同的收集策略，提高了垃圾收集效率。

**使用示例：**
```bash
# 启用分代 ZGC
java -XX:+UseZGC -XX:+ZGenerational -jar application.jar

# 设置年轻代大小
java -XX:+UseZGC -XX:+ZGenerational -XX:ZYoungGenerationSize=8g -jar application.jar

# 查看 ZGC 统计信息
java -XX:+UseZGC -XX:+ZGenerational -XX:+PrintGCDetails -jar application.jar
```

分代 ZGC 的主要优势：
- 提高了应用程序的吞吐量
- 降低了 GC 暂停时间
- 更有效地回收年轻对象
- 减少了内存占用
- 适用于更广泛的应用场景

## 三、代码案例

### 1. 使用虚拟线程和结构化并发实现高性能 Web 服务器

**案例：** 使用 Java 21 的虚拟线程和结构化并发构建一个高性能的 Web 服务器，可以同时处理大量请求。

**示例：**
```java
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.net.InetSocketAddress;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.Future;

public class VirtualThreadWebServer {
    
    public static void main(String[] args) throws Exception {
        // 创建 HTTP 服务器
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // 设置处理器，使用虚拟线程处理请求
        server.createContext("/hello", new VirtualThreadHttpHandler());
        server.createContext("/data", new DataHandler());
        
        // 启动服务器
        server.start();
        System.out.println("服务器已启动在端口 8080");
    }
    
    // 使用虚拟线程的 HTTP 处理器
    static class VirtualThreadHttpHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            // 提交到虚拟线程执行
            Thread.ofVirtual().start(() -> {
                try {
                    handleRequest(exchange);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
        
        private void handleRequest(HttpExchange exchange) throws Exception {
            // 模拟处理时间
            Thread.sleep(100);
            
            String response = "Hello from Virtual Thread!"; 
            exchange.sendResponseHeaders(200, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes(StandardCharsets.UTF_8));
            }
            exchange.close();
        }
    }
    
    // 使用结构化并发的处理器
    static class DataHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            Thread.ofVirtual().start(() -> {
                try {
                    handleDataRequest(exchange);
                } catch (Exception e) {
                    e.printStackTrace();
                    try {
                        String errorResponse = "Error: " + e.getMessage();
                        exchange.sendResponseHeaders(500, errorResponse.length());
                        try (OutputStream os = exchange.getResponseBody()) {
                            os.write(errorResponse.getBytes(StandardCharsets.UTF_8));
                        }
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    } finally {
                        exchange.close();
                    }
                }
            });
        }
        
        private void handleDataRequest(HttpExchange exchange) throws Exception {
            try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
                // 并行获取多种数据
                Future<String> userData = scope.fork(() -> fetchUserData());
                Future<String> productData = scope.fork(() -> fetchProductData());
                Future<String> statsData = scope.fork(() -> fetchStatsData());
                
                // 等待所有数据获取完成
                scope.join();
                scope.throwIfFailed();
                
                // 组合结果
                String response = STR."""
                    \{userData.resultNow()}
                    \{productData.resultNow()}
                    \{statsData.resultNow()}
                """;
                
                exchange.sendResponseHeaders(200, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes(StandardCharsets.UTF_8));
                }
            } finally {
                exchange.close();
            }
        }
        
        private String fetchUserData() throws InterruptedException {
            Thread.sleep(200); // 模拟网络延迟
            return "用户数据: {name: 'John', age: 30}";
        }
        
        private String fetchProductData() throws InterruptedException {
            Thread.sleep(150); // 模拟网络延迟
            return "产品数据: {id: 'p123', name: 'Product X'}";
        }
        
        private String fetchStatsData() throws InterruptedException {
            Thread.sleep(180); // 模拟网络延迟
            return "统计数据: {visits: 1000, conversion: 0.05}";
        }
    }
}
```

### 2. 使用记录模式和模式匹配 switch 实现表达式计算器

**案例：** 使用 Java 21 的记录模式和模式匹配 switch 创建一个表达式计算器，可以处理基本的数学表达式。

**示例：**
```java
// 定义表达式接口和实现类
public sealed interface Expression permits Constant, Variable, BinaryOperation, UnaryOperation {};

public record Constant(double value) implements Expression {};

public record Variable(String name, double value) implements Expression {};

public sealed abstract class BinaryOperation implements Expression 
    permits Add, Subtract, Multiply, Divide, Power {};

public record Add(Expression left, Expression right) implements BinaryOperation {};

public record Subtract(Expression left, Expression right) implements BinaryOperation {};

public record Multiply(Expression left, Expression right) implements BinaryOperation {};

public record Divide(Expression left, Expression right) implements BinaryOperation {};

public record Power(Expression base, Expression exponent) implements BinaryOperation {};

public sealed abstract class UnaryOperation implements Expression 
    permits Negate, Sine, Cosine, SquareRoot {};

public record Negate(Expression operand) implements UnaryOperation {};

public record Sine(Expression operand) implements UnaryOperation {};

public record Cosine(Expression operand) implements UnaryOperation {};

public record SquareRoot(Expression operand) implements UnaryOperation {};

// 表达式计算器
public class ExpressionCalculator {
    
    // 计算表达式的值
    public static double evaluate(Expression expr) {
        return switch (expr) {
            case Constant(double value) -> value;
            case Variable(String name, double value) -> value;
            case Add(Expression left, Expression right) -> 
                evaluate(left) + evaluate(right);
            case Subtract(Expression left, Expression right) -> 
                evaluate(left) - evaluate(right);
            case Multiply(Expression left, Expression right) -> 
                evaluate(left) * evaluate(right);
            case Divide(Expression left, Expression right) -> {
                double divisor = evaluate(right);
                if (divisor == 0) {
                    throw new ArithmeticException("除数不能为零");
                }
                yield evaluate(left) / divisor;
            }
            case Power(Expression base, Expression exponent) -> 
                Math.pow(evaluate(base), evaluate(exponent));
            case Negate(Expression operand) -> 
                -evaluate(operand);
            case Sine(Expression operand) -> 
                Math.sin(evaluate(operand));
            case Cosine(Expression operand) -> 
                Math.cos(evaluate(operand));
            case SquareRoot(Expression operand) -> {
                double value = evaluate(operand);
                if (value < 0) {
                    throw new ArithmeticException("不能计算负数的平方根");
                }
                yield Math.sqrt(value);
            }
        };
    }
    
    // 格式化表达式为字符串
    public static String format(Expression expr) {
        return switch (expr) {
            case Constant(double value) -> String.valueOf(value);
            case Variable(String name, double value) -> STR."\{name}(\{value})";
            case Add(Expression left, Expression right) -> 
                STR."(\{format(left)} + \{format(right)})";
            case Subtract(Expression left, Expression right) -> 
                STR."(\{format(left)} - \{format(right)})";
            case Multiply(Expression left, Expression right) -> 
                STR."(\{format(left)} * \{format(right)})";
            case Divide(Expression left, Expression right) -> 
                STR."(\{format(left)} / \{format(right)})";
            case Power(Expression base, Expression exponent) -> 
                STR."\{format(base)}^(\{format(exponent)})";
            case Negate(Expression operand) -> 
                STR."-(\{format(operand)})";
            case Sine(Expression operand) -> 
                STR."sin(\{format(operand)})";
            case Cosine(Expression operand) -> 
                STR."cos(\{format(operand)})";
            case SquareRoot(Expression operand) -> 
                STR."sqrt(\{format(operand)})";
        };
    }
    
    // 测试示例
    public static void main(String[] args) {
        // 创建表达式: 2 * (3 + 4) - sqrt(16)
        Expression expr = new Subtract(
            new Multiply(
                new Constant(2),
                new Add(new Constant(3), new Constant(4))
            ),
            new SquareRoot(new Constant(16))
        );
        
        double result = evaluate(expr);
        String formatted = format(expr);
        
        System.out.println("表达式: " + formatted);
        System.out.println("结果: " + result);
        
        // 创建更复杂的表达式: sin(2 * x) + cos(y^2), x=0.5, y=1.0
        Expression complexExpr = new Add(
            new Sine(new Multiply(new Constant(2), new Variable("x", 0.5))),
            new Cosine(new Power(new Variable("y", 1.0), new Constant(2)))
        );
        
        double complexResult = evaluate(complexExpr);
        String complexFormatted = format(complexExpr);
        
        System.out.println("复杂表达式: " + complexFormatted);
        System.out.println("结果: " + complexResult);
    }
}
```

## 四、Java 21 新特性的优势与最佳实践

### 1. 优势总结

Java 21 新特性带来的主要优势：
- **革命性的并发编程模型**：虚拟线程彻底改变了 Java 中的并发编程方式，大幅提高了吞吐量
- **增强的语言表达能力**：模式匹配、记录模式等特性使代码更加简洁和类型安全
- **更高效的垃圾收集**：分代 ZGC 提供了更好的性能和更低的延迟
- **简化的字符串处理**：字符串模板使字符串构造更加安全和简洁
- **更强大的集合操作**：有序集合提供了统一的操作来处理有序数据
- **现代化的本机代码交互**：外部函数和内存 API 替代了过时的 JNI
- **长期支持**：作为 LTS 版本，提供了长期的支持和稳定性

### 2. 最佳实践

使用 Java 21 新特性的最佳实践：

- **在 I/O 密集型应用中使用虚拟线程**：虚拟线程特别适合处理大量并发的 I/O 操作
- **利用结构化并发管理复杂任务**：在需要协调多个并发任务时，考虑使用结构化并发
- **使用模式匹配简化条件逻辑**：在处理多种类型和模式时，使用模式匹配 switch 替代复杂的条件语句
- **使用记录模式解构数据**：在处理记录对象时，使用记录模式提取组件值
- **利用字符串模板替代字符串连接**：字符串模板比传统的字符串连接更安全、更高效
- **选择合适的集合类型**：根据需求选择合适的集合类型，优先考虑新的有序集合
- **注意预览特性的使用**：对于预览特性，注意它们在未来版本中可能会有变化

### 3. 常见陷阱和注意事项

使用 Java 21 新特性时需要注意的常见陷阱：
- **过度使用虚拟线程**：虚拟线程适合 I/O 密集型任务，但对于 CPU 密集型任务，传统线程可能更合适
- **忽略结构化并发的异常处理**：结构化并发改变了异常处理的方式，需要正确理解和使用
- **模式匹配的复杂性**：复杂的模式匹配可能会降低代码可读性
- **字符串模板的安全使用**：在处理用户输入时，需要注意防止注入攻击
- **外部内存管理**：使用外部内存 API 时需要注意内存泄漏问题
- **兼容性问题**：从旧版本升级到 Java 21 时，可能会遇到兼容性问题
- **JVM 参数配置**：对于新的垃圾收集器等特性，需要正确配置 JVM 参数以获得最佳性能