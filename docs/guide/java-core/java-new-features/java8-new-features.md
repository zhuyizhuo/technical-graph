# ☕ Java 8 新特性详解

## 一、核心概念与概述

### 1. Java 8 简介

Java 8 是 Java 编程语言的一个重要版本，于 2014 年 3 月发布。这个版本引入了许多重要的特性和改进，包括函数式编程支持、Stream API、新的日期时间 API 等，极大地提升了 Java 语言的表达能力和开发效率。

Java 8 的主要特性包括：
- Lambda 表达式
- 函数式接口
- Stream API
- Optional 类
- 新的日期时间 API
- 接口默认方法和静态方法
- 方法引用
- Nashorn JavaScript 引擎
- 并行数组
- 类型注解

### 2. 为什么需要 Java 8？

在 Java 8 之前，Java 语言在处理某些场景（如集合操作、并发编程、数据处理等）时显得比较繁琐和冗长。Java 8 通过引入函数式编程范式，使得代码更加简洁、易读、易维护，同时也提高了程序的性能。

Java 8 的特性解决了以下问题：
- 简化集合操作和数据处理
- 提高并发编程的效率和可靠性
- 更好地支持多核处理器
- 提供更优雅的错误处理方式
- 简化日期和时间的处理

## 二、核心特性详解

### 1. Lambda 表达式

#### 1.1 Lambda 表达式基础

Lambda 表达式是 Java 8 中引入的一种新的语法结构，它允许我们将一个函数作为方法参数传递给另一个方法，或者将函数赋值给一个变量。Lambda 表达式的本质是一个匿名函数。

Lambda 表达式的语法格式：
```java
(parameters) -> expression
```
或
```java
(parameters) -> {
    statements;
}
```
**示例：**
```java
// 使用 Lambda 表达式实现 Runnable 接口
Runnable runnable = () -> System.out.println("Hello, Lambda!");

// 使用 Lambda 表达式实现 Comparator 接口
Comparator<Integer> comparator = (a, b) -> a.compareTo(b);

// 使用 Lambda 表达式作为方法参数
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.forEach(name -> System.out.println(name));
```

#### 1.2 Lambda 表达式的类型推断

Java 编译器可以根据上下文推断 Lambda 表达式的参数类型，因此在大多数情况下，我们可以省略参数类型的声明。

**示例：**
```java
// 可以省略参数类型
Comparator<Integer> comparator = (a, b) -> a.compareTo(b);

// 也可以显式声明参数类型
Comparator<Integer> explicitComparator = (Integer a, Integer b) -> a.compareTo(b);
```

#### 1.3 函数式接口与 Lambda 表达式

Lambda 表达式需要与函数式接口配合使用。函数式接口是指只包含一个抽象方法的接口。Java 8 引入了 `@FunctionalInterface` 注解来标记函数式接口。

**示例：**
```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}

// 使用 Lambda 表达式实现函数式接口
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;

System.out.println(add.calculate(3, 4));      // 输出: 7
System.out.println(multiply.calculate(3, 4)); // 输出: 12
```

### 2. 函数式接口

#### 2.1 Java 8 内置函数式接口

Java 8 在 `java.util.function` 包中提供了一系列内置的函数式接口，以满足常见的函数式编程需求。

主要的内置函数式接口包括：
- **`Consumer<T>`**：接收一个参数，无返回值
- **`Supplier<T>`**：不接收参数，返回一个结果  
- **`Function<T, R>`**：接收一个参数，返回一个结果
- **`Predicate<T>`**：接收一个参数，返回布尔值
- **`BiFunction<T, U, R>`**：接收两个参数，返回一个结果


**示例：**
```java
// Consumer: 接收参数，不返回结果
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hello, Java 8!");

// Supplier: 不接收参数，返回结果
Supplier<Double> randomValue = () -> Math.random();
System.out.println(randomValue.get());

// Function: 接收参数，返回结果
Function<String, Integer> lengthFunction = s -> s.length();
System.out.println(lengthFunction.apply("Java 8"));

// Predicate: 接收参数，返回布尔值
Predicate<String> isEmpty = s -> s.isEmpty();
System.out.println(isEmpty.test(""));
System.out.println(isEmpty.test("Java"));
```



#### 2.2 自定义函数式接口

除了使用 Java 8 内置的函数式接口外，我们还可以根据需要自定义函数式接口。自定义函数式接口需要使用 `@FunctionalInterface` 注解标记。

**示例：**
```java
@FunctionalInterface
interface Converter<F, T> {
    T convert(F from);
}

// 使用自定义函数式接口
Converter<String, Integer> stringToInt = Integer::parseInt;
System.out.println(stringToInt.convert("42"));
```

### 3. Stream API

#### 3.1 Stream API 概述

Stream API 是 Java 8 中引入的一个强大的处理数据集合的工具。它允许我们以声明性方式处理数据集合，可以执行过滤、映射、排序、聚合等操作，使代码更加简洁、易读。

Stream API 的主要特点：
- **声明性**：更简洁、易读
- **可复合**：支持链式调用
- **并行处理**：轻松实现并行处理
- **惰性求值**：中间操作是惰性的，只有终端操作才会触发实际的计算

**示例：**
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David", "Eve");

// 使用 Stream API 过滤并排序
List<String> result = names.stream()
    .filter(name -> name.length() > 4)
    .sorted()
    .collect(Collectors.toList());

System.out.println(result); // 输出: [Alice, Charlie, David]
```

#### 3.2 Stream 创建方法

在 Java 8 中，我们可以通过多种方式创建 Stream：

**示例：**
```java
// 1. 从集合创建 Stream
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> streamFromList = list.stream();

// 2. 从数组创建 Stream
String[] array = {"a", "b", "c"};
Stream<String> streamFromArray = Arrays.stream(array);

// 3. 使用 Stream.of() 创建 Stream
Stream<String> streamOf = Stream.of("a", "b", "c");

// 4. 创建空 Stream
Stream<String> emptyStream = Stream.empty();

// 5. 创建无限 Stream
Stream<Integer> infiniteStream = Stream.iterate(0, n -> n + 2);

// 6. 使用生成器创建无限 Stream
Stream<Double> randomStream = Stream.generate(Math::random);
```

#### 3.3 Stream 操作分类

Stream 操作可以分为两大类：中间操作和终端操作。

**中间操作**（返回一个新的 Stream）：
- `filter(Predicate<T>)`：过滤元素
- `map(Function<T, R>)`：映射元素
- `flatMap(Function<T, Stream<R>>)`：扁平化映射
- `sorted()`：排序
- `distinct()`：去重
- `limit(long)`：限制元素数量
- `skip(long)`：跳过元素

**终端操作**（返回一个非 Stream 的结果）：
- `forEach(Consumer<T>)`：遍历元素
- `collect(Collector<T, A, R>)`：收集结果
- `reduce(BinaryOperator<T>)`：归约操作
- `count()`：计数
- `anyMatch(Predicate<T>)`：是否有任意元素匹配
- `allMatch(Predicate<T>)`：是否所有元素都匹配
- `noneMatch(Predicate<T>)`：是否没有元素匹配
- `findFirst()`：查找第一个元素
- `findAny()`：查找任意元素

**示例：**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// 计算偶数的和
int sumOfEven = numbers.stream()
    .filter(n -> n % 2 == 0)
    .mapToInt(Integer::intValue)
    .sum();
System.out.println(sumOfEven); // 输出: 30

// 将字符串转换为大写并收集到集合中
List<String> names = Arrays.asList("alice", "bob", "charlie");
List<String> upperCaseNames = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
System.out.println(upperCaseNames); // 输出: [ALICE, BOB, CHARLIE]
```

#### 3.4 并行 Stream

Java 8 的 Stream API 提供了并行处理数据的能力，可以充分利用多核处理器的优势。

**示例：**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// 使用并行 Stream 计算所有数的和
int sum = numbers.parallelStream()
    .reduce(0, Integer::sum);
System.out.println(sum); // 输出: 55
```

需要注意的是，并行 Stream 并不总是比串行 Stream 快，特别是对于小数据集或计算密集型操作。在使用并行 Stream 时，需要考虑数据量、操作复杂度、线程开销等因素。

### 4. Optional 类

#### 4.1 Optional 类概述

Optional 类是 Java 8 中引入的一个容器类，用于表示可能为 null 的值。它可以避免空指针异常（NullPointerException），使代码更加健壮。

Optional 类的主要方法：
- `of(T value)`：创建一个包含非 null 值的 Optional
- `ofNullable(T value)`：创建一个可能包含 null 值的 Optional
- `empty()`：创建一个空的 Optional
- `isPresent()`：检查值是否存在
- `get()`：获取值（如果值不存在，抛出 NoSuchElementException）
- `orElse(T other)`：如果值存在则返回，否则返回指定的默认值
- `orElseGet(Supplier<? extends T> other)`：如果值存在则返回，否则通过 Supplier 获取值
- `orElseThrow(Supplier<? extends X> exceptionSupplier)`：如果值存在则返回，否则抛出指定的异常
- `ifPresent(Consumer<? super T> consumer)`：如果值存在，则对其执行指定的操作
- `map(Function<? super T, ? extends U> mapper)`：如果值存在，将提供的映射函数应用于值
- `flatMap(Function<? super T, Optional<U>> mapper)`：如果值存在，将提供的 Optional 映射函数应用于值

**示例：**
```java
// 创建 Optional 对象
Optional<String> optional1 = Optional.of("Hello");
Optional<String> optional2 = Optional.ofNullable(null);
Optional<String> optional3 = Optional.empty();

// 检查值是否存在
System.out.println(optional1.isPresent()); // 输出: true
System.out.println(optional2.isPresent()); // 输出: false

// 获取值
System.out.println(optional1.get()); // 输出: Hello
// System.out.println(optional2.get()); // 抛出 NoSuchElementException

// 获取值或默认值
System.out.println(optional2.orElse("Default")); // 输出: Default
System.out.println(optional2.orElseGet(() -> "Generated Default")); // 输出: Generated Default

// 如果值存在则执行操作
optional1.ifPresent(s -> System.out.println(s.toUpperCase())); // 输出: HELLO

// 映射值
Optional<Integer> lengthOptional = optional1.map(String::length);
System.out.println(lengthOptional.get()); // 输出: 5
```

#### 4.2 使用 Optional 避免空指针异常

在 Java 8 之前，我们需要使用大量的 null 检查来避免空指针异常。Optional 类提供了一种更优雅的方式来处理可能为 null 的值。

**示例：**
```java
// Java 7 及之前的方式
String str = getString();
if (str != null) {
    int length = str.length();
    System.out.println("Length: " + length);
}

// Java 8 的方式
Optional<String> optionalStr = Optional.ofNullable(getString());
optionalStr.map(String::length)
          .ifPresent(length -> System.out.println("Length: " + length));
```

### 5. 新的日期时间 API

#### 5.1 日期时间 API 概述

Java 8 引入了一个全新的日期时间 API，位于 `java.time` 包下。这个 API 解决了旧的日期时间 API（如 `Date`、`Calendar`）存在的线程安全、设计不一致等问题。

新的日期时间 API 的主要类：
- `LocalDate`：表示日期（年、月、日）
- `LocalTime`：表示时间（时、分、秒）
- `LocalDateTime`：表示日期和时间
- `ZonedDateTime`：表示带时区的日期和时间
- `Instant`：表示时间戳
- `Duration`：表示两个时间之间的间隔
- `Period`：表示两个日期之间的间隔
- `DateTimeFormatter`：用于日期时间的格式化和解析

#### 5.2 主要日期时间类的使用

**LocalDate**：
```java
// 获取当前日期
LocalDate now = LocalDate.now();
System.out.println("Current date: " + now);

// 创建指定日期
LocalDate date = LocalDate.of(2023, 1, 1);
System.out.println("Specific date: " + date);

// 获取年、月、日
int year = now.getYear();
Month month = now.getMonth();
int dayOfMonth = now.getDayOfMonth();
System.out.println("Year: " + year + ", Month: " + month + ", Day: " + dayOfMonth);

// 日期计算
LocalDate tomorrow = now.plusDays(1);
LocalDate previousMonth = now.minusMonths(1);
System.out.println("Tomorrow: " + tomorrow);
System.out.println("Previous month: " + previousMonth);
```

**LocalTime**：
```java
// 获取当前时间
LocalTime now = LocalTime.now();
System.out.println("Current time: " + now);

// 创建指定时间
LocalTime time = LocalTime.of(12, 30, 45);
System.out.println("Specific time: " + time);

// 获取时、分、秒
int hour = now.getHour();
int minute = now.getMinute();
int second = now.getSecond();
System.out.println("Hour: " + hour + ", Minute: " + minute + ", Second: " + second);

// 时间计算
LocalTime later = now.plusHours(2);
LocalTime earlier = now.minusMinutes(30);
System.out.println("Two hours later: " + later);
System.out.println("Thirty minutes earlier: " + earlier);
```

**LocalDateTime**：
```java
// 获取当前日期时间
LocalDateTime now = LocalDateTime.now();
System.out.println("Current date and time: " + now);

// 创建指定日期时间
LocalDateTime dateTime = LocalDateTime.of(2023, 1, 1, 12, 30, 45);
System.out.println("Specific date and time: " + dateTime);

// 转换为 LocalDate 和 LocalTime
LocalDate date = now.toLocalDate();
LocalTime time = now.toLocalTime();
System.out.println("Date: " + date + ", Time: " + time);
```

**DateTimeFormatter**：
```java
// 格式化日期时间
LocalDateTime now = LocalDateTime.now();
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String formattedDateTime = now.format(formatter);
System.out.println("Formatted date time: " + formattedDateTime);

// 解析日期时间字符串
String dateTimeString = "2023-01-01 12:30:45";
LocalDateTime parsedDateTime = LocalDateTime.parse(dateTimeString, formatter);
System.out.println("Parsed date time: " + parsedDateTime);
```

#### 5.3 日期时间的比较和计算

**比较日期时间**：
```java
LocalDate date1 = LocalDate.of(2023, 1, 1);
LocalDate date2 = LocalDate.of(2023, 12, 31);

// 比较日期
boolean isBefore = date1.isBefore(date2);
boolean isAfter = date1.isAfter(date2);
boolean isEqual = date1.isEqual(date2);

System.out.println("date1 is before date2: " + isBefore); // 输出: true
System.out.println("date1 is after date2: " + isAfter);   // 输出: false
System.out.println("date1 is equal to date2: " + isEqual); // 输出: false
```

**计算日期时间间隔**：
```java
LocalDate startDate = LocalDate.of(2023, 1, 1);
LocalDate endDate = LocalDate.of(2023, 12, 31);

// 计算日期间隔
Period period = Period.between(startDate, endDate);
System.out.println("Years: " + period.getYears() + ", Months: " + period.getMonths() + ", Days: " + period.getDays());

LocalTime startTime = LocalTime.of(10, 0, 0);
LocalTime endTime = LocalTime.of(12, 30, 0);

// 计算时间间隔
Duration duration = Duration.between(startTime, endTime);
System.out.println("Hours: " + duration.toHours() + ", Minutes: " + duration.toMinutes());
```

### 6. 接口默认方法和静态方法

#### 6.1 接口默认方法

Java 8 允许在接口中定义默认方法（Default Method），默认方法使用 `default` 关键字修饰，并提供默认实现。这样可以在不破坏现有实现的情况下，向接口添加新的方法。

**示例：**
```java
interface Vehicle {
    void start();
    
    // 默认方法
    default void honk() {
        System.out.println("Beep beep!");
    }
}

class Car implements Vehicle {
    @Override
    public void start() {
        System.out.println("Car starting...");
    }
    
    // 可选：覆盖默认方法
    @Override
    public void honk() {
        System.out.println("Car horn: Beep beep!");
    }
}

// 使用
Vehicle car = new Car();
car.start(); // 输出: Car starting...
car.honk();  // 输出: Car horn: Beep beep!
```

#### 6.2 接口静态方法

Java 8 还允许在接口中定义静态方法（Static Method），静态方法使用 `static` 关键字修饰。

**示例：**
```java
interface Utility {
    // 静态方法
    static void printInfo() {
        System.out.println("Utility interface static method");
    }
}

// 直接通过接口调用静态方法
Utility.printInfo(); // 输出: Utility interface static method
```

#### 6.3 默认方法的冲突解决

当一个类实现了多个接口，而这些接口中定义了相同的默认方法时，就会发生冲突。Java 8 提供了以下冲突解决规则：

1. 类中的方法优先级最高
2. 如果类没有覆盖该方法，则优先选择实现的接口中明确指定的方法
3. 如果以上规则都不适用，则需要显式覆盖该方法

**示例：**
```java
interface InterfaceA {
    default void method() {
        System.out.println("InterfaceA method");
    }
}

interface InterfaceB {
    default void method() {
        System.out.println("InterfaceB method");
    }
}

// 需要显式覆盖 method 方法
class MyClass implements InterfaceA, InterfaceB {
    @Override
    public void method() {
        // 可以选择调用哪个接口的默认方法
        InterfaceA.super.method(); // 调用 InterfaceA 的默认方法
        // 或者提供自己的实现
        // System.out.println("MyClass method");
    }
}
```

### 7. 方法引用

#### 7.1 方法引用概述

方法引用（Method Reference）是 Java 8 中引入的一种语法糖，它允许我们直接引用已有的方法，而不必编写 Lambda 表达式。方法引用可以看作是 Lambda 表达式的简化形式。

方法引用的语法格式：
```java
ClassName::methodName
```
或
```java
ObjectName::methodName
```

#### 7.2 方法引用的类型

Java 8 支持以下四种类型的方法引用：

1. **静态方法引用**：`ClassName::staticMethodName`
2. **实例方法引用**：`instance::instanceMethodName`
3. **类的任意对象的实例方法引用**：`ClassName::instanceMethodName`
4. **构造器引用**：`ClassName::new`

**示例：**
```java
// 静态方法引用
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.sort(String::compareToIgnoreCase);
System.out.println(names);

// 实例方法引用
String prefix = "Hello, ";
List<String> greetings = names.stream()
    .map(prefix::concat)
    .collect(Collectors.toList());
System.out.println(greetings);

// 类的任意对象的实例方法引用
List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());
System.out.println(lengths);

// 构造器引用
List<String> newNames = names.stream()
    .map(String::new)
    .collect(Collectors.toList());
System.out.println(newNames);

// 数组构造器引用
int[] array = names.stream()
    .mapToInt(String::length)
    .toArray();
System.out.println(Arrays.toString(array));
```

## 三、Java 8 新特性实践案例

### 1. 使用 Stream API 处理集合数据

**案例：** 统计员工信息

假设我们有一个员工列表，需要执行以下操作：
- 过滤出薪资大于 5000 的员工
- 按照部门分组
- 计算每个部门的平均薪资

**示例：**
```java
class Employee {
    private String name;
    private String department;
    private double salary;
    
    // 构造器、getter、setter 等省略
}

List<Employee> employees = Arrays.asList(
    new Employee("Alice", "HR", 5000),
    new Employee("Bob", "IT", 6000),
    new Employee("Charlie", "IT", 7000),
    new Employee("David", "Finance", 8000),
    new Employee("Eve", "HR", 5500)
);

// 统计每个部门的平均薪资
Map<String, Double> averageSalaryByDepartment = employees.stream()
    .filter(employee -> employee.getSalary() > 5000)
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.averagingDouble(Employee::getSalary)
    ));

System.out.println(averageSalaryByDepartment);
```

### 2. 使用 Optional 处理可能为 null 的值

**案例：** 安全地获取用户信息

假设我们需要获取用户的订单信息，但用户可能不存在，或者用户没有订单。

**示例：**
```java
class User {
    private String name;
    private Optional<List<Order>> orders;
    
    // 构造器、getter、setter 等省略
}

class Order {
    private String orderId;
    private double amount;
    
    // 构造器、getter、setter 等省略
}

// 获取用户的第一个订单金额
Optional<User> userOptional = getUserById(1);
double firstOrderAmount = userOptional
    .flatMap(User::getOrders)
    .flatMap(orders -> orders.stream().findFirst())
    .map(Order::getAmount)
    .orElse(0.0);

System.out.println("First order amount: " + firstOrderAmount);
```

### 3. 使用新的日期时间 API 处理日期和时间

**案例：** 计算工作日天数

假设我们需要计算两个日期之间的工作日天数（周一到周五）。

**示例：**
```java
LocalDate startDate = LocalDate.of(2023, 1, 1);
LocalDate endDate = LocalDate.of(2023, 1, 31);

// 计算工作日天数
long workingDays = startDate.datesUntil(endDate.plusDays(1))
    .filter(date -> {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        return dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY;
    })
    .count();

System.out.println("Working days: " + workingDays);
```

## 四、Java 8 新特性的优势与最佳实践

### 1. 优势总结

Java 8 新特性带来的主要优势：
- **代码更简洁**：Lambda 表达式和方法引用使代码更加简洁、易读
- **提高开发效率**：Stream API 简化了集合操作，减少了样板代码
- **更好的错误处理**：Optional 类避免了空指针异常
- **更强大的日期时间处理**：新的日期时间 API 解决了旧 API 的诸多问题
- **更好的并行处理**：Stream API 和 CompletableFuture 简化了并行编程
- **向后兼容**：新特性的设计考虑了向后兼容性

### 2. 最佳实践

使用 Java 8 新特性的最佳实践：

- **优先使用 Lambda 表达式和方法引用**：使代码更加简洁、易读
- **合理使用 Stream API**：了解 Stream 的操作类型和特性，避免不必要的性能损失
- **使用 Optional 处理可能为 null 的值**：避免空指针异常
- **使用新的日期时间 API**：替代旧的 `Date` 和 `Calendar` 类
- **注意并行 Stream 的使用场景**：并行 Stream 并不总是比串行 Stream 快
- **遵循函数式编程的原则**：尽量保持函数的纯性，避免副作用
- **结合传统编程范式**：Java 8 是混合范式语言，根据场景选择合适的编程方式

### 3. 常见陷阱和注意事项

使用 Java 8 新特性时需要注意的常见陷阱：
- **过度使用 Stream API**：对于简单的集合操作，传统的 for 循环可能更高效
- **忽略并行 Stream 的开销**：并行 Stream 的创建和管理需要一定的开销
- **错误使用 Optional 类**：过度使用 Optional 可能使代码变得复杂
- **忽略闭包中的变量引用**：Lambda 表达式中引用的外部变量需要是 effectively final 的
- **忘记处理异常**：Stream API 中的异常处理比较复杂，需要特别注意
- **忽略方法引用的上下文**：方法引用的行为取决于上下文