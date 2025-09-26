# Java 核心基础

## 1. Java 语言概述

Java 是一种面向对象的编程语言，由 Sun Microsystems（现在是 Oracle 的一部分）于 1995 年发布。Java 的设计理念是"一次编写，到处运行"（Write Once, Run Anywhere，WORA），这使得 Java 程序可以在不同的平台上运行而不需要重新编译。

### 1.1 Java 的主要特性

- **简单性**：Java 语法基于 C++，但移除了指针、运算符重载等复杂特性
- **面向对象**：Java 是一种纯面向对象语言，除了基本数据类型外都是对象
- **平台无关性**：Java 程序通过 JVM 在不同平台上运行
- **分布式**：内置网络功能，支持分布式计算
- **健壮性**：强类型检查、自动内存管理、异常处理等特性
- **安全性**：安全管理器、类加载器、字节码验证器等安全机制
- **多线程**：内置多线程支持
- **动态性**：支持运行时类型识别和反射

### 1.2 Java 发展历史

| 版本 | 发布时间 | 主要特性 |
|------|----------|----------|
| Java 1.0 | 1996 年 | 第一个官方版本 |
| Java 1.2 | 1998 年 | 引入集合框架，Swing UI |
| Java 5 | 2004 年 | 泛型，注解，枚举，自动装箱拆箱 |
| Java 8 | 2014 年 | Lambda 表达式，Stream API，函数式接口 |
| Java 11 | 2018 年 | 长期支持版本，HTTP 客户端 |
| Java 17 | 2021 年 | 最新长期支持版本，密封类 |
| Java 21 | 2023 年 | 虚拟线程，模式匹配，字符串模板 |

## 2. Java 语言基础

### 2.1 数据类型

Java 有两种数据类型：基本数据类型和引用数据类型。

#### 基本数据类型

| 数据类型 | 大小 | 取值范围 | 默认值 | 示例 |
|----------|------|----------|--------|------|
| byte | 1 字节 | -128 到 127 | 0 | `byte b = 100;` |
| short | 2 字节 | -32768 到 32767 | 0 | `short s = 1000;` |
| int | 4 字节 | -2^31 到 2^31-1 | 0 | `int i = 100000;` |
| long | 8 字节 | -2^63 到 2^63-1 | 0L | `long l = 100000L;` |
| float | 4 字节 | IEEE754 | 0.0f | `float f = 3.14f;` |
| double | 8 字节 | IEEE754 | 0.0d | `double d = 3.14;` |
| char | 2 字节 | 0 到 65535 | '\u0000' | `char c = 'A';` |
| boolean | 1 位 | true/false | false | `boolean b = true;` |

#### 引用数据类型

- 类（Class）
- 接口（Interface）
- 数组（Array）
- 枚举（Enum）
- 注解（Annotation）

### 2.2 变量与常量

#### 变量声明与初始化

```java
// 声明变量
int age;
String name;

// 声明并初始化变量
int age = 25;
String name = "Java";

// 多个变量同时声明
int a, b, c = 10;  // a和b初始化为0，c初始化为10
```

#### 常量声明

```java
// 使用final关键字声明常量
final int MAX_AGE = 120;
final double PI = 3.14159;

// 静态常量（类常量）
public static final String COMPANY_NAME = "Oracle";
```

### 2.3 运算符

#### 算术运算符

`+`, `-`, `*`, `/`, `%`, `++`, `--`

```java
int a = 10, b = 3;
int sum = a + b;       // 13
int diff = a - b;      // 7
int product = a * b;   // 30
int quotient = a / b;  // 3（整数除法）
int remainder = a % b; // 1
```

#### 关系运算符

`==`, `!=`, `>`, `<`, `>=`, `<=`

```java
boolean isEqual = (a == b);    // false
boolean isNotEqual = (a != b); // true
boolean isGreater = (a > b);   // true
```

#### 逻辑运算符

`&&` (短路与), `||` (短路或), `!` (非)

```java
boolean result = (a > 5) && (b < 10);  // true
result = (a > 20) || (b < 5);          // true
result = !(a == b);                    // true
```

#### 赋值运算符

`=`, `+=`, `-=`, `*=`, `/=`, `%=`

```java
a += b;  // 等价于 a = a + b
```

#### 位运算符

`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`

```java
int x = 5;  // 二进制: 0101
int y = 3;  // 二进制: 0011
int z = x & y;  // 0001 (1)
z = x | y;      // 0111 (7)
z = x ^ y;      // 0110 (6)
z = ~x;         // 1010 (补码表示的-6)
z = x << 1;     // 1010 (10)
z = x >> 1;     // 0010 (2)
z = x >>> 1;    // 0010 (2)
```

### 2.4 流程控制

#### 条件语句

```java
// if-else语句
if (age > 18) {
    System.out.println("成年人");
} else if (age > 12) {
    System.out.println("青少年");
} else {
    System.out.println("儿童");
}

// switch语句
switch (day) {
    case 1: System.out.println("星期一"); break;
    case 2: System.out.println("星期二"); break;
    case 3: System.out.println("星期三"); break;
    case 4: System.out.println("星期四"); break;
    case 5: System.out.println("星期五"); break;
    case 6: System.out.println("星期六"); break;
    case 7: System.out.println("星期日"); break;
    default: System.out.println("无效的日期");
}

// Java 12+ switch表达式
String dayName = switch (day) {
    case 1 -> "星期一";
    case 2 -> "星期二";
    case 3 -> "星期三";
    case 4 -> "星期四";
    case 5 -> "星期五";
    case 6 -> "星期六";
    case 7 -> "星期日";
    default -> "无效的日期";
};
```

#### 循环语句

```java
// for循环
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// 增强型for循环（for-each）
int[] numbers = {1, 2, 3, 4, 5};
for (int number : numbers) {
    System.out.println(number);
}

// while循环
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}

// do-while循环
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 10);

// break和continue
for (int k = 0; k < 10; k++) {
    if (k == 5) break;  // 跳出循环
    if (k % 2 == 0) continue;  // 跳过本次循环的剩余部分
    System.out.println(k);
}
```

## 3. 面向对象编程

### 3.1 类与对象

#### 类的定义

```java
public class Person {
    // 成员变量（属性）
    private String name;
    private int age;
    private String address;
    
    // 构造方法
    public Person() {
        // 无参构造方法
    }
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 成员方法（行为）
    public void setName(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public void setAge(int age) {
        if (age >= 0 && age <= 120) {
            this.age = age;
        }
    }
    
    public int getAge() {
        return age;
    }
    
    public void sayHello() {
        System.out.println("Hello, my name is " + name);
    }
}
```

#### 对象的创建与使用

```java
// 创建对象
Person person1 = new Person();
Person person2 = new Person("Alice", 25);

// 使用对象
person1.setName("Bob");
person1.setAge(30);
person1.sayHello();  // 输出: Hello, my name is Bob

System.out.println(person2.getName() + " is " + person2.getAge() + " years old.");
```

### 3.2 封装、继承与多态

#### 封装

封装是将数据（属性）和方法（行为）组合在一个单元中，并控制对其的访问。Java 通过访问修饰符实现封装。

```java
public class Student {
    // private成员变量，只能在类内部访问
    private String name;
    private int score;
    
    // public方法，提供对私有成员的访问
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getScore() {
        return score;
    }
    
    public void setScore(int score) {
        if (score >= 0 && score <= 100) {
            this.score = score;
        }
    }
}
```

#### 继承

继承允许一个类（子类）继承另一个类（父类）的属性和方法。Java 中使用 extends 关键字实现继承。

```java
// 父类
public class Animal {
    protected String name;
    
    public void eat() {
        System.out.println(name + " is eating.");
    }
    
    public void sleep() {
        System.out.println(name + " is sleeping.");
    }
}

// 子类
public class Dog extends Animal {
    public void bark() {
        System.out.println(name + " is barking.");
    }
    
    // 重写父类方法
    @Override
    public void eat() {
        System.out.println(name + " is eating bones.");
    }
}

// 使用
Dog dog = new Dog();
dog.name = "Rex";
dog.eat();  // 输出: Rex is eating bones.
dog.sleep();  // 输出: Rex is sleeping.
dog.bark();  // 输出: Rex is barking.
```

#### 多态

多态允许使用父类引用指向子类对象，并根据对象的实际类型调用相应的方法。

```java
Animal animal1 = new Animal();
Animal animal2 = new Dog();  // 多态：父类引用指向子类对象

animal1.eat();  // 调用Animal的eat()方法
animal2.eat();  // 调用Dog的eat()方法（方法重写）

// 向下转型
if (animal2 instanceof Dog) {
    Dog dog = (Dog) animal2;
    dog.bark();
}
```

### 3.3 抽象类与接口

#### 抽象类

抽象类是不能实例化的类，可以包含抽象方法和普通方法。

```java
public abstract class Shape {
    // 抽象方法（没有实现）
    public abstract double calculateArea();
    
    // 普通方法
    public void display() {
        System.out.println("Area: " + calculateArea());
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
}
```

#### 接口

接口定义了一组方法规范，不提供任何实现（Java 8 开始可以有默认方法和静态方法）。

```java
public interface Drawable {
    void draw();  // 抽象方法
    
    // 默认方法（Java 8+）
    default void setup() {
        System.out.println("Setting up...");
    }
    
    // 静态方法（Java 8+）
    static void info() {
        System.out.println("This is a Drawable interface");
    }
}

public class Triangle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a triangle");
    }
}

public class Square implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a square");
    }
    
    @Override
    public void setup() {
        System.out.println("Setting up square...");
    }
}
```

### 3.4 内部类

Java 允许在一个类内部定义另一个类，称为内部类。

#### 成员内部类

```java
public class Outer {
    private int outerVar = 1;
    
    public class Inner {
        private int innerVar = 2;
        
        public void display() {
            System.out.println("outerVar: " + outerVar);
            System.out.println("innerVar: " + innerVar);
        }
    }
    
    public void createInner() {
        Inner inner = new Inner();
        inner.display();
    }
}

// 使用
Outer outer = new Outer();
outer.createInner();

// 或
Outer.Inner inner = new Outer().new Inner();
inner.display();
```

#### 静态内部类

```java
public class Outer {
    private static int outerStaticVar = 3;
    private int outerVar = 4;
    
    public static class StaticInner {
        private int innerVar = 5;
        
        public void display() {
            System.out.println("outerStaticVar: " + outerStaticVar);
            // 不能访问非静态成员：System.out.println("outerVar: " + outerVar);
            System.out.println("innerVar: " + innerVar);
        }
    }
}

// 使用
Outer.StaticInner staticInner = new Outer.StaticInner();
staticInner.display();
```

#### 局部内部类

```java
public class Outer {
    public void method() {
        final int localVar = 6;
        
        // 局部内部类，定义在方法内部
        class LocalInner {
            public void display() {
                System.out.println("localVar: " + localVar);
            }
        }
        
        LocalInner localInner = new LocalInner();
        localInner.display();
    }
}
```

#### 匿名内部类

```java
public interface Greeting {
    void sayHello();
}

public class Main {
    public static void main(String[] args) {
        // 匿名内部类实现Greeting接口
        Greeting greeting = new Greeting() {
            @Override
            public void sayHello() {
                System.out.println("Hello from anonymous inner class");
            }
        };
        
        greeting.sayHello();
        
        // Lambda表达式（Java 8+）
        Greeting greeting2 = () -> System.out.println("Hello from lambda expression");
        greeting2.sayHello();
    }
}
```

## 4. 异常处理

### 4.1 异常分类

Java 中的异常分为两类：Checked Exception（受检异常）和 Unchecked Exception（非受检异常）。

- **Checked Exception**：编译时检查的异常，必须显式处理或声明抛出
- **Unchecked Exception**：运行时异常，继承自 RuntimeException，不需要显式处理

### 4.2 异常处理机制

#### try-catch-finally

```java
try {
    // 可能抛出异常的代码
    int result = 10 / 0;
} catch (ArithmeticException e) {
    // 处理特定异常
    System.out.println("除数不能为零: " + e.getMessage());
} catch (Exception e) {
    // 处理其他异常
    System.out.println("发生异常: " + e.getMessage());
} finally {
    // 无论是否发生异常都会执行的代码
    System.out.println("finally块执行");
}
```

#### throws 和 throw

```java
// throws声明方法可能抛出的异常
public void readFile(String filePath) throws FileNotFoundException, IOException {
    File file = new File(filePath);
    if (!file.exists()) {
        // throw抛出具体的异常
        throw new FileNotFoundException("文件不存在: " + filePath);
    }
    // 读取文件的代码
}
```

#### 自定义异常

```java
// 自定义受检异常
public class InsufficientFundsException extends Exception {
    private double amount;
    
    public InsufficientFundsException(double amount) {
        this.amount = amount;
    }
    
    public double getAmount() {
        return amount;
    }
}

// 自定义非受检异常
public class InvalidDataException extends RuntimeException {
    public InvalidDataException(String message) {
        super(message);
    }
}
```

## 5. 常用工具类

### 5.1 String 类

```java
String str1 = "Hello";
String str2 = new String("Hello");

// 字符串连接
String str3 = str1 + " " + "World";
String str4 = str1.concat(" World");

// 字符串比较
boolean isEqual = str1.equals(str2);  // 内容比较，true
boolean isEqualRef = (str1 == str2);  // 引用比较，false
int compareResult = str1.compareTo(str2);  // 字典序比较，0

// 字符串查找
int index = str1.indexOf('l');  // 2
boolean contains = str1.contains("ell");  // true
boolean startsWith = str1.startsWith("He");  // true
boolean endsWith = str1.endsWith("lo");  // true

// 字符串截取
String substring = str1.substring(1, 4);  // "ell"

// 字符串转换
String upper = str1.toUpperCase();  // "HELLO"
String lower = str1.toLowerCase();  // "hello"
String trimmed = " Hello ".trim();  // "Hello"

// 字符串分割
String[] parts = "a,b,c".split(",");  // ["a", "b", "c"]

// 字符串格式化
String formatted = String.format("Name: %s, Age: %d", "Alice", 25);
```

### 5.2 包装类

Java 为每个基本数据类型提供了对应的包装类，用于在需要对象的场合使用基本数据类型。

| 基本数据类型 | 包装类 |
|--------------|--------|
| byte | Byte |
| short | Short |
| int | Integer |
| long | Long |
| float | Float |
| double | Double |
| char | Character |
| boolean | Boolean |

```java
// 自动装箱（基本类型转为包装类）
Integer i = 100;
Double d = 3.14;

// 自动拆箱（包装类转为基本类型）
int iValue = i;
double dValue = d;

// 字符串转基本类型
int num1 = Integer.parseInt("123");
double num2 = Double.parseDouble("3.14");

// 基本类型转字符串
String strNum1 = String.valueOf(123);
String strNum2 = Integer.toString(123);
```

### 5.3 Math 类

```java
// 数学常量
double pi = Math.PI;  // 3.141592653589793
double e = Math.E;   // 2.718281828459045

// 基本运算
int abs = Math.abs(-10);  // 10
double max = Math.max(5.5, 3.3);  // 5.5
double min = Math.min(5.5, 3.3);  // 3.3
double pow = Math.pow(2, 3);  // 8.0
double sqrt = Math.sqrt(16);  // 4.0
long round = Math.round(3.7);  // 4
int floor = (int) Math.floor(3.7);  // 3
int ceil = (int) Math.ceil(3.7);  // 4

// 三角函数
double sin = Math.sin(Math.PI / 2);  // 1.0
double cos = Math.cos(Math.PI);  // -1.0
double tan = Math.tan(Math.PI / 4);  // 1.0

// 随机数
double random = Math.random();  // 0.0到1.0之间的随机数
```

### 5.4 Date 与时间类

Java 8 引入了新的日期和时间 API（java.time 包）。

```java
// 获取当前日期和时间
LocalDate today = LocalDate.now();
LocalTime now = LocalTime.now();
LocalDateTime current = LocalDateTime.now();

// 创建特定日期和时间
LocalDate date = LocalDate.of(2023, 9, 25);
LocalTime time = LocalTime.of(14, 30, 45);
LocalDateTime dateTime = LocalDateTime.of(2023, 9, 25, 14, 30, 45);

// 日期时间操作
LocalDate tomorrow = today.plusDays(1);
LocalDate yesterday = today.minusDays(1);
boolean isAfter = tomorrow.isAfter(today);  // true
int year = today.getYear();  // 2023
Month month = today.getMonth();  // SEPTEMBER
int dayOfMonth = today.getDayOfMonth();  // 25
DayOfWeek dayOfWeek = today.getDayOfWeek();  // MONDAY

// 格式化和解析
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String formattedDateTime = current.format(formatter);
LocalDateTime parsedDateTime = LocalDateTime.parse("2023-09-25 14:30:45", formatter);

// 时区
ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));
ZonedDateTime newYorkTime = ZonedDateTime.now(ZoneId.of("America/New_York"));
```

## 6. 集合框架

Java 集合框架提供了一组接口和类，用于存储和操作对象组。

### 6.1 集合框架概览

主要接口：
- Collection：所有集合的根接口
  - List：有序集合，允许重复元素
  - Set：不允许重复元素
  - Queue：队列，通常按FIFO顺序处理元素
- Map：映射接口，存储键值对

### 6.2 List 接口

```java
// ArrayList：基于动态数组实现，查询快，增删慢
List<String> arrayList = new ArrayList<>();
arrayList.add("Java");
arrayList.add("Python");
arrayList.add("C++");
arrayList.add(1, "JavaScript");  // 在指定位置添加元素

// LinkedList：基于双向链表实现，查询慢，增删快
List<String> linkedList = new LinkedList<>();
linkedList.add("Java");
linkedList.add("Python");

// 遍历List
for (int i = 0; i < arrayList.size(); i++) {
    System.out.println(arrayList.get(i));
}

for (String language : arrayList) {
    System.out.println(language);
}

arrayList.forEach(System.out::println);

// List常用方法
boolean contains = arrayList.contains("Java");  // true
int index = arrayList.indexOf("Python");  // 2
String removed = arrayList.remove(1);  // 移除并返回指定位置的元素
arrayList.clear();  // 清空List
```

### 6.3 Set 接口

```java
// HashSet：基于哈希表实现，无序，不重复
Set<String> hashSet = new HashSet<>();
hashSet.add("Java");
hashSet.add("Python");
hashSet.add("Java");  // 重复元素，不会被添加

// LinkedHashSet：基于哈希表和链表实现，有序（插入顺序），不重复
Set<String> linkedHashSet = new LinkedHashSet<>();
linkedHashSet.add("Java");
linkedHashSet.add("Python");
linkedHashSet.add("C++");

// TreeSet：基于红黑树实现，有序（自然排序或自定义排序），不重复
Set<String> treeSet = new TreeSet<>();
treeSet.add("Java");
treeSet.add("Python");
treeSet.add("C++");  // 会自动排序

// 遍历Set
for (String language : hashSet) {
    System.out.println(language);
}

// Set常用方法
hashSet.contains("Java");  // true
hashSet.remove("Python");  // 移除元素
hashSet.clear();  // 清空Set
```

### 6.4 Map 接口

```java
// HashMap：基于哈希表实现，无序，键不重复
Map<String, Integer> hashMap = new HashMap<>();
hashMap.put("Java", 1995);
hashMap.put("Python", 1991);
hashMap.put("C++", 1983);

// LinkedHashMap：基于哈希表和链表实现，有序（插入顺序），键不重复
Map<String, Integer> linkedHashMap = new LinkedHashMap<>();
linkedHashMap.put("Java", 1995);
linkedHashMap.put("Python", 1991);
linkedHashMap.put("C++", 1983);

// TreeMap：基于红黑树实现，有序（键的自然排序或自定义排序），键不重复
Map<String, Integer> treeMap = new TreeMap<>();
treeMap.put("Java", 1995);
treeMap.put("Python", 1991);
treeMap.put("C++", 1983);  // 会按键自动排序

// 获取值
Integer javaYear = hashMap.get("Java");  // 1995

// 遍历Map
// 1. 遍历键
for (String key : hashMap.keySet()) {
    System.out.println(key + ": " + hashMap.get(key));
}

// 2. 遍历值
for (Integer value : hashMap.values()) {
    System.out.println(value);
}

// 3. 遍历键值对
for (Map.Entry<String, Integer> entry : hashMap.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// 4. 使用Lambda表达式
hashMap.forEach((key, value) -> System.out.println(key + ": " + value));

// Map常用方法
hashMap.containsKey("Java");  // true
hashMap.containsValue(1995);  // true
hashMap.remove("Python");  // 移除键值对
hashMap.clear();  // 清空Map
```

### 6.5 集合工具类 Collections

```java
// 排序
List<Integer> numbers = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5, 9));
Collections.sort(numbers);  // 升序排序
Collections.sort(numbers, Collections.reverseOrder());  // 降序排序

// 查找
int max = Collections.max(numbers);  // 9
int min = Collections.min(numbers);  // 1
int index = Collections.binarySearch(numbers, 5);  // 二分查找

// 替换
Collections.fill(numbers, 0);  // 用0替换所有元素
Collections.replaceAll(numbers, 0, 10);  // 用10替换所有0

// 反转
Collections.reverse(numbers);

// 随机打乱
Collections.shuffle(numbers);

// 同步集合（线程安全）
List<String> synchronizedList = Collections.synchronizedList(new ArrayList<>());
Map<String, Integer> synchronizedMap = Collections.synchronizedMap(new HashMap<>());
```

## 7. 泛型

泛型允许在定义类、接口和方法时使用类型参数，提高代码的类型安全性和可重用性。

### 7.1 泛型类

```java
public class Box<T> {
    private T content;
    
    public void setContent(T content) {
        this.content = content;
    }
    
    public T getContent() {
        return content;
    }
}

// 使用泛型类
Box<String> stringBox = new Box<>();
stringBox.setContent("Hello");
String content = stringBox.getContent();

Box<Integer> integerBox = new Box<>();
integerBox.setContent(123);
Integer number = integerBox.getContent();
```

### 7.2 泛型接口

```java
public interface List<T> {
    void add(T element);
    T get(int index);
    // 其他方法
}

// 实现泛型接口
public class ArrayList<T> implements List<T> {
    // 实现方法
}
```

### 7.3 泛型方法

```java
public class Util {
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.print(element + " ");
        }
        System.out.println();
    }
    
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) > 0 ? a : b;
    }
}

// 使用泛型方法
Integer[] intArray = {1, 2, 3, 4, 5};
String[] strArray = {"Hello", "World"};
Util.printArray(intArray);
Util.printArray(strArray);

Integer maxInt = Util.max(5, 10);
String maxStr = Util.max("Apple", "Banana");
```

### 7.4 泛型通配符

```java
// 上界通配符：? extends T，表示可以接受T或T的子类
public void printList(List<? extends Number> list) {
    for (Number number : list) {
        System.out.println(number);
    }
}

// 下界通配符：? super T，表示可以接受T或T的父类
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    list.add(3);
}

// 无限通配符：?，表示可以接受任意类型
public void processList(List<?> list) {
    for (Object obj : list) {
        System.out.println(obj);
    }
}

// 使用
List<Integer> intList = Arrays.asList(1, 2, 3);
List<Double> doubleList = Arrays.asList(1.1, 2.2, 3.3);
List<String> strList = Arrays.asList("A", "B", "C");

printList(intList);  // 可以
printList(doubleList);  // 可以
// printList(strList);  // 编译错误

List<Number> numberList = new ArrayList<>();
addNumbers(numberList);  // 可以
addNumbers(intList);  // 可以

processList(intList);  // 可以
processList(doubleList);  // 可以
processList(strList);  // 可以
```

## 8. 输入输出

Java 的 I/O 系统通过 java.io 包提供，主要包括字节流和字符流。

### 8.1 字节流

字节流用于处理二进制数据，主要类有 InputStream 和 OutputStream。

```java
// 文件读取（字节流）
try (FileInputStream fis = new FileInputStream("input.txt")) {
    int data;
    while ((data = fis.read()) != -1) {
        System.out.print((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 文件写入（字节流）
try (FileOutputStream fos = new FileOutputStream("output.txt")) {
    String content = "Hello, World!";
    fos.write(content.getBytes());
} catch (IOException e) {
    e.printStackTrace();
}

// 缓冲字节流
// 使用BufferedInputStream和BufferedOutputStream提高读写效率
try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream("input.txt"));
     BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("output.txt"))) {
    int data;
    while ((data = bis.read()) != -1) {
        bos.write(data);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### 8.2 字符流

字符流用于处理文本数据，主要类有 Reader 和 Writer。

```java
// 文件读取（字符流）
try (FileReader fr = new FileReader("input.txt")) {
    int data;
    while ((data = fr.read()) != -1) {
        System.out.print((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 文件写入（字符流）
try (FileWriter fw = new FileWriter("output.txt")) {
    String content = "Hello, World!";
    fw.write(content);
} catch (IOException e) {
    e.printStackTrace();
}

// 缓冲字符流
// 使用BufferedReader和BufferedWriter提高读写效率
try (BufferedReader br = new BufferedReader(new FileReader("input.txt"));
     BufferedWriter bw = new BufferedWriter(new FileWriter("output.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        bw.write(line);
        bw.newLine();
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### 8.3 Java 7 的 try-with-resources

Java 7 引入了 try-with-resources 语句，简化了资源管理。

```java
// try-with-resources语句自动关闭实现了AutoCloseable接口的资源
try (FileInputStream fis = new FileInputStream("input.txt");
     FileOutputStream fos = new FileOutputStream("output.txt")) {
    int data;
    while ((data = fis.read()) != -1) {
        fos.write(data);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### 8.4 NIO

Java NIO（New I/O）是 Java 4 引入的一个替代标准 I/O API 的库，提供了更高效的 I/O 操作。

```java
// NIO Path和Files
Path filePath = Paths.get("input.txt");

// 读取文件所有行
List<String> lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
for (String line : lines) {
    System.out.println(line);
}

// 写入文件
List<String> content = Arrays.asList("Line 1", "Line 2", "Line 3");
Files.write(Paths.get("output.txt"), content, StandardCharsets.UTF_8);

// 复制文件
Files.copy(Paths.get("input.txt"), Paths.get("input_copy.txt"), StandardCopyOption.REPLACE_EXISTING);

// 创建目录
Files.createDirectories(Paths.get("dir/subdir"));

// 检查文件是否存在
boolean exists = Files.exists(filePath);
```

## 9. 多线程编程

Java 提供了内置的多线程支持，通过 Thread 类和 Runnable 接口实现。

### 9.1 创建线程

```java
// 方式1：继承Thread类
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread is running: " + Thread.currentThread().getName());
    }
}

// 方式2：实现Runnable接口
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Runnable is running: " + Thread.currentThread().getName());
    }
}

// 启动线程
MyThread thread1 = new MyThread();
thread1.start();

Thread thread2 = new Thread(new MyRunnable());
thread2.start();

// 方式3：使用Lambda表达式（Java 8+）
Thread thread3 = new Thread(() -> {
    System.out.println("Lambda thread is running: " + Thread.currentThread().getName());
});
thread3.start();
```

### 9.2 线程状态

Java 线程有以下状态：
- NEW：新建状态
- RUNNABLE：就绪状态
- RUNNING：运行状态
- BLOCKED：阻塞状态
- WAITING：等待状态
- TIMED_WAITING：超时等待状态
- TERMINATED：终止状态

### 9.3 线程控制

```java
// 线程休眠
try {
    Thread.sleep(1000);  // 休眠1000毫秒
} catch (InterruptedException e) {
    e.printStackTrace();
}

// 线程优先级
thread1.setPriority(Thread.MAX_PRIORITY);  // 10
thread2.setPriority(Thread.MIN_PRIORITY);  // 1
thread3.setPriority(Thread.NORM_PRIORITY);  // 5

// 线程等待与通知
// wait()和notify()/notifyAll()方法必须在同步代码块或同步方法中使用
synchronized (object) {
    try {
        object.wait();  // 等待通知
        // 或等待指定时间
        // object.wait(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}

synchronized (object) {
    object.notify();  // 唤醒一个等待的线程
    // 或唤醒所有等待的线程
    // object.notifyAll();
}

// 线程中断
thread1.interrupt();
if (Thread.interrupted()) {
    // 线程被中断
}

// 线程等待（join）
try {
    thread1.join();  // 等待thread1执行完毕
    // 或等待指定时间
    // thread1.join(1000);
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

### 9.4 线程安全

线程安全是指多线程环境下，程序能够正确地执行，不会出现数据不一致或其他异常情况。

```java
// 同步代码块
synchronized (this) {
    // 线程安全的代码
}

// 同步方法
public synchronized void synchronizedMethod() {
    // 线程安全的代码
}

// 显式锁（ReentrantLock）
Lock lock = new ReentrantLock();
lock.lock();
try {
    // 线程安全的代码
} finally {
    lock.unlock();  // 确保释放锁
}

// 线程安全的集合
List<String> synchronizedList = Collections.synchronizedList(new ArrayList<>());
Map<String, Integer> concurrentHashMap = new ConcurrentHashMap<>();

// 原子变量
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();  // 原子递增
count.addAndGet(10);  // 原子增加指定值
```

## 10. 反射

反射机制允许程序在运行时获取类的信息、创建类的实例、调用类的方法和访问类的属性。

```java
// 获取Class对象
Class<?> clazz1 = Class.forName("java.lang.String");
Class<?> clazz2 = String.class;
String str = "Hello";
Class<?> clazz3 = str.getClass();

// 获取类信息
String className = clazz1.getName();  // 类名
Package pkg = clazz1.getPackage();  // 包
Class<?> superClass = clazz1.getSuperclass();  // 父类
Class<?>[] interfaces = clazz1.getInterfaces();  // 实现的接口

// 获取构造方法
Constructor<?>[] constructors = clazz1.getDeclaredConstructors();
Constructor<?> constructor = clazz1.getConstructor(String.class);

// 创建实例
Object obj = constructor.newInstance("Hello");

// 获取方法
Method[] methods = clazz1.getDeclaredMethods();
Method method = clazz1.getMethod("length");

// 调用方法
Object result = method.invoke(obj);  // 5

// 获取字段
Field[] fields = clazz1.getDeclaredFields();
Field field = clazz1.getDeclaredField("value");
field.setAccessible(true);  // 设置为可访问私有字段

// 访问字段
Object value = field.get(obj);  // 字符数组
field.set(obj, "World".toCharArray());  // 修改私有字段的值

// 获取注解
Annotation[] annotations = clazz1.getAnnotations();
Annotation annotation = clazz1.getAnnotation(Deprecated.class);
```

## 11. 枚举与注解

### 11.1 枚举

枚举是一种特殊的类，用于表示固定数量的常量。

```java
// 简单枚举
enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

// 使用枚举
Weekday today = Weekday.MONDAY;
switch (today) {
    case MONDAY:
        System.out.println("星期一");
        break;
    case FRIDAY:
        System.out.println("星期五");
        break;
    default:
        System.out.println("其他天");
}

// 带属性和方法的枚举
enum Season {
    SPRING("春季", 1),
    SUMMER("夏季", 2),
    AUTUMN("秋季", 3),
    WINTER("冬季", 4);
    
    private final String name;
    private final int code;
    
    Season(String name, int code) {
        this.name = name;
        this.code = code;
    }
    
    public String getName() {
        return name;
    }
    
    public int getCode() {
        return code;
    }
}

// 使用带属性和方法的枚举
Season season = Season.SPRING;
System.out.println(season.getName() + ": " + season.getCode());  // 春季: 1
```

### 11.2 注解

注解是一种特殊的接口，用于提供元数据。

```java
// 预定义注解
@Override  // 标记方法重写
@Deprecated  // 标记已过时的方法或类
@SuppressWarnings("unchecked")  // 抑制编译器警告

// 自定义注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Log {
    String value() default "";
    boolean enabled() default true;
}

// 使用自定义注解
public class UserService {
    @Log("登录操作")
    public void login(String username, String password) {
        // 登录逻辑
    }
    
    @Log(value = "注销操作", enabled = false)
    public void logout(String username) {
        // 注销逻辑
    }
}

// 通过反射获取注解信息
Class<?> serviceClass = UserService.class;
Method[] methods = serviceClass.getDeclaredMethods();
for (Method method : methods) {
    if (method.isAnnotationPresent(Log.class)) {
        Log logAnnotation = method.getAnnotation(Log.class);
        System.out.println("方法: " + method.getName());
        System.out.println("日志: " + logAnnotation.value());
        System.out.println("启用: " + logAnnotation.enabled());
    }
}
```

## 12. Java 各版本新特性

Java 语言自发布以来不断发展，每个主要版本都带来了重要的特性和改进。本节提供了各主要 Java 版本新特性的概览，详细内容请参考以下链接文档：

### 12.1 Java 8 新特性

Java 8 于 2014 年 3 月发布，引入了函数式编程支持、Stream API、新的日期时间 API 等重要特性。

详细内容请查看：[Java 8 新特性文档](java-new-features/java8-new-features.md)

### 12.2 Java 11 新特性

Java 11 是 Java 编程语言的一个长期支持（LTS）版本，于 2018 年 9 月发布。作为继 Java 8 之后的第二个 LTS 版本，Java 11 带来了性能优化、新的 API、工具增强等改进。

详细内容请查看：[Java 11 新特性文档](java-new-features/java11-new-features.md)

### 12.3 Java 17 新特性

Java 17 是 Java 编程语言的一个长期支持（LTS）版本，于 2021 年 9 月发布。作为继 Java 11 之后的第三个 LTS 版本，Java 17 带来了密封类、模式匹配、新的垃圾收集器等特性。

详细内容请查看：[Java 17 新特性文档](java-new-features/java17-new-features.md)

### 12.4 Java 21 新特性

Java 21 是 Java 编程语言的一个长期支持（LTS）版本，于 2023 年 9 月发布。作为继 Java 17 之后的第四个 LTS 版本，Java 21 带来了虚拟线程、记录模式、开关表达式增强等重要特性。

详细内容请查看：[Java 21 新特性文档](java-new-features/java21-new-features.md)