# ☕ Java 17 新特性详解

## 一、核心概念与概述

### 1. Java 17 简介

Java 17 是 Java 编程语言的一个长期支持（LTS）版本，于 2021 年 9 月发布。作为继 Java 11 之后的第三个 LTS 版本，Java 17 带来了许多重要的特性和改进，包括密封类、模式匹配、新的垃圾收集器等。

Java 17 的主要特性包括：
- 密封类（Sealed Classes）
- 模式匹配 for switch（预览）
- 增强的伪随机数生成器
- 移除实验性的 AOT 和 JIT 编译器
- 外部函数和内存 API（预览）
- Vector API（第二轮孵化）
- 特定于平台的桌面应用程序打包
- 移除 Remote Method Invocation (RMI) 激活
- 增强型伪随机数生成器
- macOS/AArch64 端口
- 弃用 Applet API
- 统一日志记录系统（JEP 378）
- 严格的浮点语义

### 2. 为什么需要 Java 17？

Java 17 是一个重要的长期支持版本，提供了更好的性能、安全性和语言表达能力。它引入了一些期待已久的语言特性，如密封类和模式匹配，同时优化了底层实现，使 Java 平台更加现代化和高效。

Java 17 的特性解决了以下问题：
- 增强了 Java 语言的表达能力
- 提高了应用程序的性能和可伸缩性
- 简化了特定场景下的开发工作
- 移除了过时的组件，使平台更加精简
- 改进了安全性和稳定性

## 二、核心特性详解

### 1. 密封类（Sealed Classes）

密封类是 Java 17 中引入的一个重要语言特性，它限制了哪些类可以扩展或实现它。这有助于创建更加可控的类层次结构，提高代码的可维护性和安全性。

**示例：**
```java
// 定义密封类
public sealed class Shape 
    permits Circle, Rectangle, Triangle {
    
    // 共同的方法和属性
    public abstract double area();
}

// 允许的子类
public final class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public non-sealed class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double area() {
        return width * height;
    }
}

// Triangle 类也需要实现
public final class Triangle extends Shape {
    private double base;
    private double height;
    
    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }
    
    @Override
    public double area() {
        return 0.5 * base * height;
    }
}
```

密封类的使用限制：
- 密封类必须在 permits 子句中显式列出所有允许的子类
- 密封类的子类必须使用 final、sealed 或 non-sealed 修饰符
- 密封类及其子类必须在同一个模块中，或者在同一个包中（如果在未命名模块中）

### 2. 模式匹配 for switch（预览）

Java 17 引入了 switch 语句的模式匹配预览特性，允许在 switch 语句中使用类型模式和保护表达式，使代码更加简洁和易读。

**示例：**
```java
// 使用模式匹配的 switch 语句
public static String formatValue(Object obj) {
    return switch (obj) {
        case Integer i -> String.format("整型: %d", i);
        case Long l -> String.format("长整型: %d", l);
        case Double d -> String.format("双精度: %.2f", d);
        case String s -> String.format("字符串: %s", s);
        case null -> "值为 null";
        default -> String.format("未知类型: %s", obj.getClass().getSimpleName());
    };
}

// 使用保护表达式
public static double calculate(Object obj) {
    return switch (obj) {
        case Number n && n.intValue() > 10 -> n.doubleValue() * 2;
        case Number n -> n.doubleValue();
        case String s -> Double.parseDouble(s);
        default -> 0;
    };
}

// 记录模式（Record Patterns）
public record Point(int x, int y) {};

public static String describePoint(Object obj) {
    return switch (obj) {
        case Point p -> String.format("点(%d, %d)", p.x(), p.y());
        default -> "不是点对象";
    };
}
```

模式匹配 switch 的特点：
- 可以直接在 case 标签中声明变量
- 支持类型模式和保护表达式
- 不需要显式的 break 语句
- 支持 null 作为 case 标签
- 确保了穷举检查

### 3. 增强的伪随机数生成器

Java 17 增强了伪随机数生成器（PRNG）的功能，引入了新的接口和实现，提供了更好的性能和灵活性。

**示例：**
```java
import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

// 创建随机数生成器
RandomGenerator rng1 = RandomGenerator.getDefault();
RandomGenerator rng2 = RandomGeneratorFactory.of("L32X64MixRandom").create();

// 生成随机数
int intValue = rng1.nextInt(100); // 0-99 的随机整数
long longValue = rng1.nextLong(); // 随机长整型
boolean booleanValue = rng1.nextBoolean(); // 随机布尔值

// 生成随机数组
byte[] bytes = new byte[10];
rng1.nextBytes(bytes);

// 获取所有可用的随机数生成器算法
RandomGeneratorFactory.all()
    .map(factory -> factory.name())
    .forEach(System.out::println);

// 创建线程安全的随机数生成器
RandomGenerator secureRng = RandomGeneratorFactory.of("SecureRandom").create();
```

新的随机数生成器框架的优势：
- 统一的接口
- 支持多种算法
- 更好的性能和统计特性
- 支持流式操作
- 改进的可测试性

### 4. 外部函数和内存 API（预览）

Java 17 引入了外部函数和内存 API 的预览版本，这是一个用于与本机代码和内存进行交互的 API，旨在替代 JNI（Java Native Interface）。

**示例：**
```java
import jdk.incubator.foreign.*;

// 加载本机库
System.loadLibrary("mylib");

// 获取外部函数
MethodHandle sqrtHandle = CLinker.getInstance().downcallHandle(
    SymbolLookup.loaderLookup().lookup("sqrt").get(),
    MethodType.methodType(double.class, double.class),
    FunctionDescriptor.of(C_DOUBLE, C_DOUBLE)
);

// 调用外部函数
double result = (double) sqrtHandle.invokeExact(2.0);
System.out.println("平方根: " + result);

// 分配外部内存
try (ResourceScope scope = ResourceScope.newConfinedScope()) {
    MemorySegment segment = MemorySegment.allocateNative(4, scope);
    segment.set(C_INT, 0, 42);
    int value = segment.get(C_INT, 0);
    System.out.println("内存中的值: " + value);
}
```

外部函数和内存 API 的优势：
- 更安全的本机代码交互
- 更好的性能
- 更简洁的 API 设计
- 自动内存管理
- 避免了 JNI 的复杂性和安全问题

### 5. Vector API（第二轮孵化）

Java 17 引入了 Vector API 的第二轮孵化版本，这是一个用于向量计算的 API，可以在支持 CPU 向量指令的平台上实现更好的性能。

**示例：**
```java
import jdk.incubator.vector.*;

// 定义向量形状和物种
VectorSpecies<Float> SPECIES = FloatVector.SPECIES_256;

// 向量计算
public static float[] vectorComputation(float[] a, float[] b) {
    int i = 0;
    int upperBound = SPECIES.loopBound(a.length);
    float[] result = new float[a.length];
    
    // 向量循环
    for (; i < upperBound; i += SPECIES.length()) {
        Vector<Float> va = FloatVector.fromArray(SPECIES, a, i);
        Vector<Float> vb = FloatVector.fromArray(SPECIES, b, i);
        Vector<Float> vc = va.add(vb); // 向量加法
        vc.intoArray(result, i);
    }
    
    // 处理剩余元素
    for (; i < a.length; i++) {
        result[i] = a[i] + b[i];
    }
    
    return result;
}

// 使用向量 API 进行矩阵乘法
public static void matrixMultiply(float[][] a, float[][] b, float[][] c) {
    int m = a.length;
    int n = a[0].length;
    int p = b[0].length;
    
    for (int i = 0; i < m; i++) {
        for (int k = 0; k < n; k++) {
            float aik = a[i][k];
            for (int j = 0; j < p; j++) {
                c[i][j] += aik * b[k][j];
            }
        }
    }
}
```

Vector API 的优势：
- 利用 CPU 的向量指令加速计算
- 平台无关的 API 设计
- 比手动编写的等价标量计算代码更简洁
- 与 Java Stream API 兼容
- 适用于科学计算、图像处理、机器学习等场景

### 6. 特定于平台的桌面应用程序打包

Java 17 增强了 Java 打包工具（jpackage），使其能够创建特定于平台的安装程序和包，如 Windows 上的 MSI 或 EXE、macOS 上的 DMG 或 PKG、Linux 上的 DEB 或 RPM。

**使用示例：**
```bash
# 为 Windows 创建 MSI 安装程序
jpackage --name MyApp --input lib --main-jar myapp.jar --main-class com.example.Main --type msi

# 为 macOS 创建 DMG 安装程序
jpackage --name MyApp --input lib --main-jar myapp.jar --main-class com.example.Main --type dmg

# 为 Linux 创建 DEB 包
jpackage --name myapp --input lib --main-jar myapp.jar --main-class com.example.Main --type deb

# 指定图标和其他选项
jpackage --name MyApp --input lib --main-jar myapp.jar --icon myapp.ico --description "My Java Application" --app-version 1.0
```

jpackage 工具的主要特性：
- 支持多种打包格式
- 可以自定义应用程序图标、版本信息等
- 可以包含运行时环境
- 支持应用程序更新
- 简化了最终用户的安装体验

### 7. macOS/AArch64 端口

Java 17 增加了对 macOS/AArch64 架构的支持，即 Apple Silicon 芯片（如 M1、M2 等）。这使 Java 应用程序能够在这些新的 Mac 设备上原生运行，获得更好的性能。

**使用示例：**
```bash
# 在 Apple Silicon 上运行 Java 应用程序
java -jar myapp.jar

# 检查 JVM 架构
java -XshowSettings:properties -version | grep os.arch
```

macOS/AArch64 端口的优势：
- 原生支持 Apple Silicon 芯片
- 更好的性能和电池寿命
- 无需 Rosetta 2 翻译层
- 完整的 JDK 功能支持
- 与 x86_64 版本相同的 API

### 8. 统一日志记录系统

Java 17 改进了 JDK 的日志记录系统，提供了更一致的日志记录体验。统一日志记录系统（JEP 378）允许使用单一的命令行选项配置所有 JDK 组件的日志记录。

**使用示例：**
```bash
# 配置特定组件的日志级别
java -Xlog:gc*=info -jar myapp.jar

# 配置多个组件的日志
java -Xlog:gc*=info,jit*=debug -jar myapp.jar

# 将日志输出到文件
java -Xlog:gc*=info:file=gc.log -jar myapp.jar

# 配置日志格式
java -Xlog:gc*=info::time,level,tags -jar myapp.jar
```

统一日志记录系统的优势：
- 一致的日志记录配置
- 更灵活的日志格式选项
- 更好的性能
- 支持日志文件滚动
- 与现有的日志框架兼容

### 9. 其他重要改进

Java 17 还包含许多其他重要的改进和优化：

- **弃用 Applet API**：Applet API 已被标记为弃用，因为现代浏览器不再支持 Java Applet。
- **移除 RMI 激活**：移除了过时的 RMI 激活机制，简化了 RMI 实现。
- **严格的浮点语义**：改进了浮点运算的一致性和可预测性。
- **安全增强**：包括 TLS 1.3 增强、加密算法更新等。
- **性能优化**：包括 JVM 内部改进、垃圾收集器优化等。
- **Java Flight Recorder 增强**：增加了新的事件和功能。

## 三、代码案例

### 1. 使用密封类和模式匹配构建表达式树

**案例：** 使用 Java 17 的密封类和模式匹配 switch 创建一个简单的表达式求值系统。

**示例：**
```java
// 定义密封的表达式类层次结构
public sealed interface Expression 
    permits Constant, Variable, BinaryExpression {
    
    double evaluate();
}

public record Constant(double value) implements Expression {
    @Override
    public double evaluate() {
        return value;
    }
}

public record Variable(String name, double value) implements Expression {
    @Override
    public double evaluate() {
        return value;
    }
}

public sealed abstract class BinaryExpression implements Expression 
    permits Add, Subtract, Multiply, Divide {
    
    protected final Expression left;
    protected final Expression right;
    
    protected BinaryExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }
}

public final class Add extends BinaryExpression {
    public Add(Expression left, Expression right) {
        super(left, right);
    }
    
    @Override
    public double evaluate() {
        return left.evaluate() + right.evaluate();
    }
}

public final class Subtract extends BinaryExpression {
    public Subtract(Expression left, Expression right) {
        super(left, right);
    }
    
    @Override
    public double evaluate() {
        return left.evaluate() - right.evaluate();
    }
}

public final class Multiply extends BinaryExpression {
    public Multiply(Expression left, Expression right) {
        super(left, right);
    }
    
    @Override
    public double evaluate() {
        return left.evaluate() * right.evaluate();
    }
}

public final class Divide extends BinaryExpression {
    public Divide(Expression left, Expression right) {
        super(left, right);
    }
    
    @Override
    public double evaluate() {
        double divisor = right.evaluate();
        if (divisor == 0) {
            throw new ArithmeticException("除数不能为零");
        }
        return left.evaluate() / divisor;
    }
}

// 使用模式匹配格式化表达式
public static String formatExpression(Expression expr) {
    return switch (expr) {
        case Constant c -> String.valueOf(c.value());
        case Variable v -> v.name() + "(" + v.value() + ")";
        case Add a -> "(" + formatExpression(a.left) + " + " + formatExpression(a.right) + ")";
        case Subtract s -> "(" + formatExpression(s.left) + " - " + formatExpression(s.right) + ")";
        case Multiply m -> "(" + formatExpression(m.left) + " * " + formatExpression(m.right) + ")";
        case Divide d -> "(" + formatExpression(d.left) + " / " + formatExpression(d.right) + ")";
    };
}

// 使用示例
public static void main(String[] args) {
    // 创建表达式: (2 + 3) * (4 - 1)
    Expression expr = new Multiply(
        new Add(new Constant(2), new Constant(3)),
        new Subtract(new Constant(4), new Constant(1))
    );
    
    double result = expr.evaluate();
    String formatted = formatExpression(expr);
    
    System.out.println("表达式: " + formatted);
    System.out.println("结果: " + result);
}
```

### 2. 使用增强的随机数生成器实现蒙特卡洛模拟

**案例：** 使用 Java 17 增强的伪随机数生成器实现蒙特卡洛方法计算 π 的值。

**示例：**
```java
import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MonteCarloPi {
    
    public static void main(String[] args) throws InterruptedException {
        int numThreads = Runtime.getRuntime().availableProcessors();
        long totalIterations = 10_000_000;
        long iterationsPerThread = totalIterations / numThreads;
        
        // 创建线程池
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(numThreads);
        
        // 每个线程的结果数组
        long[] hits = new long[numThreads];
        
        // 启动工作线程
        for (int i = 0; i < numThreads; i++) {
            final int threadIndex = i;
            executor.submit(() -> {
                try {
                    // 为每个线程创建独立的随机数生成器
                    RandomGenerator rng = RandomGeneratorFactory.of("L64X128MixRandom").create();
                    long localHits = 0;
                    
                    // 执行蒙特卡洛模拟
                    for (long j = 0; j < iterationsPerThread; j++) {
                        double x = rng.nextDouble();
                        double y = rng.nextDouble();
                        if (x * x + y * y <= 1.0) {
                            localHits++;
                        }
                    }
                    
                    hits[threadIndex] = localHits;
                } finally {
                    latch.countDown();
                }
            });
        }
        
        // 等待所有线程完成
        latch.await();
        executor.shutdown();
        
        // 计算总命中次数
        long totalHits = 0;
        for (long hit : hits) {
            totalHits += hit;
        }
        
        // 计算 π 的近似值
        double pi = 4.0 * totalHits / totalIterations;
        System.out.println("π 的近似值: " + pi);
        System.out.println("误差: " + Math.abs(pi - Math.PI));
    }
}
```

## 四、Java 17 新特性的优势与最佳实践

### 1. 优势总结

Java 17 新特性带来的主要优势：
- **增强的语言表达能力**：密封类和模式匹配使代码更加简洁和类型安全
- **更好的性能**：Vector API、ZGC 优化等提供了更好的性能
- **简化的本机代码交互**：外部函数和内存 API 简化了与本机代码的交互
- **更好的平台支持**：增加了对 macOS/AArch64 的支持
- **更简单的应用程序打包**：jpackage 工具使应用程序分发更加简单
- **长期支持**：作为 LTS 版本，提供了长期的支持和稳定性

### 2. 最佳实践

使用 Java 17 新特性的最佳实践：

- **利用密封类构建安全的类层次结构**：在需要限制继承的场景中使用密封类
- **使用模式匹配简化代码**：在适当的场景中使用模式匹配 switch 替代复杂的 instanceof 检查和类型转换
- **选择合适的随机数生成器**：根据应用程序的需求选择合适的 PRNG 算法
- **使用 jpackage 简化应用程序分发**：为不同平台创建特定的安装包
- **注意预览特性的使用**：对于预览特性，注意它们在未来版本中可能会有变化
- **迁移到现代 API**：逐步替换过时的 API，如 Applet API、RMI 激活等
- **测试兼容性**：在升级过程中彻底测试应用程序的兼容性

### 3. 常见陷阱和注意事项

使用 Java 17 新特性时需要注意的常见陷阱：
- **过度使用预览特性**：预览特性可能会在未来版本中发生变化，在生产环境中使用需要谨慎
- **密封类的限制**：密封类有严格的使用限制，需要正确理解和遵循
- **模式匹配的复杂性**：复杂的模式匹配可能会降低代码可读性
- **本机内存管理**：使用外部内存 API 时需要注意内存泄漏问题
- **兼容性问题**：从旧版本升级到 Java 17 时，可能会遇到兼容性问题
- **忽略性能特性**：没有充分利用 Java 17 提供的性能优化特性
- **不熟悉新的 API**：使用新 API 时需要仔细阅读文档，了解其正确用法