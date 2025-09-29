# 🧩 设计模式

## 一、核心概念与分类

设计模式是软件开发中通用的、可复用的解决方案，用于解决在特定环境下重复出现的问题。设计模式不是代码，而是解决问题的思路和方法。

### 1. 设计模式的分类

根据用途和目的，设计模式主要分为三大类：

| 类别 | 主要关注点 | 包含模式 |
|------|------------|---------|
| 创建型模式 | 对象创建机制 | 单例模式、工厂模式、抽象工厂模式、建造者模式、原型模式 |
| 结构型模式 | 类或对象的组合方式 | 适配器模式、桥接模式、装饰器模式、组合模式、外观模式、享元模式、代理模式 |
| 行为型模式 | 对象间的通信和职责分配 | 模板方法模式、策略模式、命令模式、责任链模式、状态模式、观察者模式、中介者模式、迭代器模式、访问者模式、备忘录模式、解释器模式 |

## 二、创建型模式

创建型模式关注对象的创建过程，通过封装对象的创建细节，使系统更加灵活、可维护。

### 2.1 单例模式（Singleton Pattern）

**核心思想**：确保一个类只有一个实例，并提供全局访问点。

**适用场景**：
- 需要频繁创建和销毁的对象
- 创建对象耗时或消耗资源多
- 工具类对象
- 频繁访问数据库或文件的对象

**实现方式**：

```java
// 双重检查锁定（Double-Check Locking）
public class Singleton {
    private static volatile Singleton instance;
    
    private Singleton() {
        // 防止反射创建多个实例
        if (instance != null) {
            throw new RuntimeException("请使用getInstance()方法获取实例");
        }
    }
    
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}

// 静态内部类方式
public class Singleton {
    private Singleton() {}
    
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    
    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

### 2.2 工厂模式（Factory Pattern）

**核心思想**：定义一个创建对象的接口，但由子类决定实例化哪个类。

**适用场景**：
- 创建对象逻辑比较复杂，需要多步骤决策
- 客户端不需要知道对象创建的具体细节
- 系统需要独立于其产品的创建、组合和表示

**实现方式**：

```java
// 简单工厂模式
public class SimpleFactory {
    public static Product createProduct(String type) {
        switch (type) {
            case "A": return new ConcreteProductA();
            case "B": return new ConcreteProductB();
            default: throw new IllegalArgumentException("Unknown product type");
        }
    }
}

// 工厂方法模式
public interface ProductFactory {
    Product createProduct();
}

public class ConcreteProductAFactory implements ProductFactory {
    @Override
    public Product createProduct() {
        return new ConcreteProductA();
    }
}

public class ConcreteProductBFactory implements ProductFactory {
    @Override
    public Product createProduct() {
        return new ConcreteProductB();
    }
}
```

### 2.3 抽象工厂模式（Abstract Factory Pattern）

**核心思想**：提供一个接口，用于创建相关或依赖对象的家族，而无需指定它们的具体类。

**适用场景**：
- 系统需要独立于其产品的创建、组合和表示
- 系统由多个产品族中的一个来配置
- 要强调一系列相关产品的设计以便联合使用

**实现方式**：

```java
public interface AbstractFactory {
    ProductA createProductA();
    ProductB createProductB();
}

public class ConcreteFactory1 implements AbstractFactory {
    @Override
    public ProductA createProductA() {
        return new ConcreteProductA1();
    }
    
    @Override
    public ProductB createProductB() {
        return new ConcreteProductB1();
    }
}

public class ConcreteFactory2 implements AbstractFactory {
    @Override
    public ProductA createProductA() {
        return new ConcreteProductA2();
    }
    
    @Override
    public ProductB createProductB() {
        return new ConcreteProductB2();
    }
}
```

### 2.4 建造者模式（Builder Pattern）

**核心思想**：将复杂对象的构建与表示分离，使得同样的构建过程可以创建不同的表示。

**适用场景**：
- 创建复杂对象，对象内部构建顺序稳定，但各部分的具体实现可能会变化
- 构建过程需要生成具有多个部分的对象，这些部分可能需要以不同的方式创建

**实现方式**：

```java
public class Product {
    private String partA;
    private String partB;
    private String partC;
    
    // getters and setters
    
    public static class Builder {
        private Product product = new Product();
        
        public Builder withPartA(String partA) {
            product.partA = partA;
            return this;
        }
        
        public Builder withPartB(String partB) {
            product.partB = partB;
            return this;
        }
        
        public Builder withPartC(String partC) {
            product.partC = partC;
            return this;
        }
        
        public Product build() {
            // 可以在这里添加验证逻辑
            return product;
        }
    }
}

// 使用方式
Product product = new Product.Builder()
    .withPartA("A")
    .withPartB("B")
    .withPartC("C")
    .build();
```

### 2.5 原型模式（Prototype Pattern）

**核心思想**：用原型实例指定创建对象的种类，并且通过复制这些原型创建新的对象。

**适用场景**：
- 创建新对象成本较高（如初始化需要占用较长时间，占用太多CPU资源或网络资源）
- 系统要保存对象的状态，而对象的状态变化很小
- 需要避免使用分层次的工厂类来创建分层次的对象

**实现方式**：

```java
public interface Prototype extends Cloneable {
    Prototype clone();
}

public class ConcretePrototype implements Prototype {
    private String field;
    
    public ConcretePrototype(String field) {
        this.field = field;
    }
    
    @Override
    public Prototype clone() {
        try {
            return (ConcretePrototype) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## 三、结构型模式

结构型模式关注类和对象的组合方式，通过组合来实现新的功能，同时保持结构的灵活和高效。

### 3.1 适配器模式（Adapter Pattern）

**核心思想**：将一个类的接口转换成客户端希望的另一个接口，使得原本不兼容的类可以一起工作。

**适用场景**：
- 系统需要使用现有的类，但这些类的接口不符合系统的需要
- 想要创建一个可以复用的类，该类可以与其他不相关的类或不可预见的类协同工作

**实现方式**：

```java
// 类适配器（继承）
public interface Target {
    void request();
}

public class Adaptee {
    public void specificRequest() {
        System.out.println("Adaptee's specific request");
    }
}

public class ClassAdapter extends Adaptee implements Target {
    @Override
    public void request() {
        super.specificRequest();
    }
}

// 对象适配器（组合）
public class ObjectAdapter implements Target {
    private Adaptee adaptee;
    
    public ObjectAdapter(Adaptee adaptee) {
        this.adaptee = adaptee;
    }
    
    @Override
    public void request() {
        adaptee.specificRequest();
    }
}
```

### 3.2 桥接模式（Bridge Pattern）

**核心思想**：将抽象部分与实现部分分离，使它们都可以独立地变化。

**适用场景**：
- 一个类存在两个或多个独立变化的维度，且这些维度都需要进行扩展
- 不希望使用继承导致类爆炸的情况
- 一个系统需要在构件的抽象化角色和具体化角色之间增加更多的灵活性

**实现方式**：

```java
// 实现部分接口
public interface Implementor {
    void operationImpl();
}

// 具体实现
public class ConcreteImplementorA implements Implementor {
    @Override
    public void operationImpl() {
        System.out.println("Concrete Implementor A");
    }
}

public class ConcreteImplementorB implements Implementor {
    @Override
    public void operationImpl() {
        System.out.println("Concrete Implementor B");
    }
}

// 抽象部分
public abstract class Abstraction {
    protected Implementor implementor;
    
    public Abstraction(Implementor implementor) {
        this.implementor = implementor;
    }
    
    public abstract void operation();
}

// 扩展抽象部分
public class RefinedAbstraction extends Abstraction {
    public RefinedAbstraction(Implementor implementor) {
        super(implementor);
    }
    
    @Override
    public void operation() {
        // 可以添加自己的业务逻辑
        implementor.operationImpl();
    }
}
```

### 3.3 装饰器模式（Decorator Pattern）

**核心思想**：动态地给一个对象添加一些额外的职责，就增加功能来说，装饰器模式比生成子类更为灵活。

**适用场景**：
- 需要给一个对象添加额外的职责，且这些职责可以动态地添加和移除
- 不希望通过继承来扩展对象的功能，因为会导致类爆炸
- 对已有对象的功能进行扩展，而不影响其他对象

**实现方式**：

```java
// 组件接口
public interface Component {
    void operation();
}

// 具体组件
public class ConcreteComponent implements Component {
    @Override
    public void operation() {
        System.out.println("Concrete Component operation");
    }
}

// 装饰器抽象类
public abstract class Decorator implements Component {
    protected Component component;
    
    public Decorator(Component component) {
        this.component = component;
    }
    
    @Override
    public void operation() {
        component.operation();
    }
}

// 具体装饰器
public class ConcreteDecoratorA extends Decorator {
    public ConcreteDecoratorA(Component component) {
        super(component);
    }
    
    @Override
    public void operation() {
        super.operation();
        addedFunctionalityA();
    }
    
    private void addedFunctionalityA() {
        System.out.println("Added functionality A");
    }
}

public class ConcreteDecoratorB extends Decorator {
    public ConcreteDecoratorB(Component component) {
        super(component);
    }
    
    @Override
    public void operation() {
        super.operation();
        addedFunctionalityB();
    }
    
    private void addedFunctionalityB() {
        System.out.println("Added functionality B");
    }
}
```

### 3.4 组合模式（Composite Pattern）

**核心思想**：将对象组合成树形结构以表示"部分-整体"的层次结构，使得客户端对单个对象和组合对象的使用具有一致性。

**适用场景**：
- 需要表示对象的部分-整体层次结构
- 希望客户端能够忽略单个对象和组合对象的差异，统一使用它们
- 当一个对象的结构是动态的，并且可以递归组合时

**实现方式**：

```java
// 组件接口
public interface Component {
    void operation();
    void add(Component component);
    void remove(Component component);
    Component getChild(int index);
}

// 叶子节点
public class Leaf implements Component {
    private String name;
    
    public Leaf(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Leaf " + name + " operation");
    }
    
    @Override
    public void add(Component component) {
        throw new UnsupportedOperationException();
    }
    
    @Override
    public void remove(Component component) {
        throw new UnsupportedOperationException();
    }
    
    @Override
    public Component getChild(int index) {
        throw new UnsupportedOperationException();
    }
}

// 组合节点
public class Composite implements Component {
    private List<Component> children = new ArrayList<>();
    private String name;
    
    public Composite(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Composite " + name + " operation");
        for (Component child : children) {
            child.operation();
        }
    }
    
    @Override
    public void add(Component component) {
        children.add(component);
    }
    
    @Override
    public void remove(Component component) {
        children.remove(component);
    }
    
    @Override
    public Component getChild(int index) {
        return children.get(index);
    }
}
```

### 3.5 外观模式（Facade Pattern）

**核心思想**：为子系统中的一组接口提供一个统一的接口，使得子系统更容易使用。

**适用场景**：
- 当客户端需要与多个子系统交互时，通过外观模式可以减少客户端与子系统的耦合
- 当子系统相对复杂，而客户端只需要使用其中一部分功能时
- 当需要构建一个层次结构的子系统时，使用外观模式定义子系统中每层的入口点

**实现方式**：

```java
// 子系统类
public class SubSystemA {
    public void operationA() {
        System.out.println("SubSystemA operation");
    }
}

public class SubSystemB {
    public void operationB() {
        System.out.println("SubSystemB operation");
    }
}

public class SubSystemC {
    public void operationC() {
        System.out.println("SubSystemC operation");
    }
}

// 外观类
public class Facade {
    private SubSystemA subSystemA;
    private SubSystemB subSystemB;
    private SubSystemC subSystemC;
    
    public Facade() {
        subSystemA = new SubSystemA();
        subSystemB = new SubSystemB();
        subSystemC = new SubSystemC();
    }
    
    public void operation1() {
        subSystemA.operationA();
        subSystemB.operationB();
    }
    
    public void operation2() {
        subSystemB.operationB();
        subSystemC.operationC();
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        Facade facade = new Facade();
        facade.operation1(); // 使用外观，而不是直接调用子系统
        facade.operation2();
    }
}
```

### 3.6 享元模式（Flyweight Pattern）

**核心思想**：运用共享技术有效地支持大量细粒度对象。

**适用场景**：
- 系统中存在大量相似的对象，消耗大量内存
- 对象的大部分状态可以外部化，可以将这些外部状态传入对象
- 需要缓冲池的场景

**实现方式**：

```java
// 享元接口
public interface Flyweight {
    void operation(ExtrinsicState state);
}

// 外部状态
public class ExtrinsicState {
    private String color;
    
    public ExtrinsicState(String color) {
        this.color = color;
    }
    
    public String getColor() {
        return color;
    }
}

// 具体享元类
public class ConcreteFlyweight implements Flyweight {
    private IntrinsicState intrinsicState;
    
    public ConcreteFlyweight(IntrinsicState intrinsicState) {
        this.intrinsicState = intrinsicState;
    }
    
    @Override
    public void operation(ExtrinsicState state) {
        System.out.println("Intrinsic State: " + intrinsicState.getValue());
        System.out.println("Extrinsic State: " + state.getColor());
    }
}

// 内部状态
public class IntrinsicState {
    private String value;
    
    public IntrinsicState(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
}

// 享元工厂
public class FlyweightFactory {
    private Map<String, Flyweight> flyweights = new HashMap<>();
    
    public Flyweight getFlyweight(String key) {
        if (flyweights.containsKey(key)) {
            return flyweights.get(key);
        } else {
            Flyweight flyweight = new ConcreteFlyweight(new IntrinsicState(key));
            flyweights.put(key, flyweight);
            return flyweight;
        }
    }
}
```

### 3.7 代理模式（Proxy Pattern）

**核心思想**：为其他对象提供一种代理以控制对这个对象的访问。

**适用场景**：
- 需要控制对原始对象的访问权限
- 需要在访问对象前后添加额外的处理逻辑
- 需要延迟加载大对象
- 远程代理（RMI）

**实现方式**：

```java
// 主题接口
public interface Subject {
    void request();
}

// 真实主题
public class RealSubject implements Subject {
    @Override
    public void request() {
        System.out.println("RealSubject handles request");
    }
}

// 代理
public class Proxy implements Subject {
    private RealSubject realSubject;
    
    @Override
    public void request() {
        // 前置处理
        if (realSubject == null) {
            realSubject = new RealSubject();
        }
        
        realSubject.request();
        
        // 后置处理
    }
}

// JDK动态代理示例
public class DynamicProxyDemo {
    public static void main(String[] args) {
        RealSubject realSubject = new RealSubject();
        
        Subject proxy = (Subject) java.lang.reflect.Proxy.newProxyInstance(
            realSubject.getClass().getClassLoader(),
            realSubject.getClass().getInterfaces(),
            (proxy1, method, args1) -> {
                // 前置处理
                System.out.println("Before method call");
                Object result = method.invoke(realSubject, args1);
                // 后置处理
                System.out.println("After method call");
                return result;
            }
        );
        
        proxy.request();
    }
}
```

## 四、行为型模式

行为型模式关注对象间的通信和职责分配，通过定义对象间的交互方式，提高系统的灵活性和可扩展性。

### 4.1 模板方法模式（Template Method Pattern）

**核心思想**：定义一个操作中的算法骨架，将一些步骤延迟到子类中实现。

**适用场景**：
- 多个子类有公有的方法，并且逻辑基本相同
- 重要的、复杂的算法，可以把核心算法设计为模板方法，周边的相关细节功能由各个子类实现
- 需要通过子类来决定父类算法中的某个步骤是否执行，实现子类对父类的反向控制

**实现方式**：

```java
// 抽象类定义算法骨架
public abstract class AbstractClass {
    // 模板方法，定义算法骨架
    public final void templateMethod() {
        step1();
        step2(); // 由子类实现
        step3();
    }
    
    private void step1() {
        System.out.println("Step 1 executed");
    }
    
    protected abstract void step2(); // 抽象方法，由子类实现
    
    private void step3() {
        System.out.println("Step 3 executed");
    }
}

// 具体子类实现抽象方法
public class ConcreteClassA extends AbstractClass {
    @Override
    protected void step2() {
        System.out.println("ConcreteClassA's implementation of step 2");
    }
}

public class ConcreteClassB extends AbstractClass {
    @Override
    protected void step2() {
        System.out.println("ConcreteClassB's implementation of step 2");
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        AbstractClass classA = new ConcreteClassA();
        classA.templateMethod();
        
        AbstractClass classB = new ConcreteClassB();
        classB.templateMethod();
    }
}
```

### 4.2 策略模式（Strategy Pattern）

**核心思想**：定义一系列算法，把它们封装起来，并且使它们可以互相替换。

**适用场景**：
- 一个系统需要动态地在几种算法中选择一种
- 有多个类仅在行为上有区别的情况
- 算法需要自由切换的场景

**实现方式**：

```java
// 策略接口
public interface Strategy {
    void algorithm();
}

// 具体策略
public class ConcreteStrategyA implements Strategy {
    @Override
    public void algorithm() {
        System.out.println("Strategy A executed");
    }
}

public class ConcreteStrategyB implements Strategy {
    @Override
    public void algorithm() {
        System.out.println("Strategy B executed");
    }
}

// 上下文类
public class Context {
    private Strategy strategy;
    
    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }
    
    public void executeStrategy() {
        if (strategy != null) {
            strategy.algorithm();
        }
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        Context context = new Context();
        
        // 使用策略A
        context.setStrategy(new ConcreteStrategyA());
        context.executeStrategy();
        
        // 切换到策略B
        context.setStrategy(new ConcreteStrategyB());
        context.executeStrategy();
    }
}
```

### 4.3 命令模式（Command Pattern）

**核心思想**：将请求封装为一个对象，从而使用户能够用不同的请求参数化对象、队列请求、记录请求日志，以及支持可撤销的操作。

**适用场景**：
- 需要将请求发送者和请求接收者解耦
- 需要支持操作的撤销和重做
- 需要将一系列操作组合在一起（宏命令）
- 需要记录请求日志，以便后期重新执行

**实现方式**：

```java
// 命令接口
public interface Command {
    void execute();
    void undo();
}

// 具体命令
public class ConcreteCommand implements Command {
    private Receiver receiver;
    private String state;
    
    public ConcreteCommand(Receiver receiver) {
        this.receiver = receiver;
    }
    
    @Override
    public void execute() {
        // 记录执行前状态，用于撤销操作
        state = receiver.getState();
        receiver.action();
    }
    
    @Override
    public void undo() {
        // 恢复到执行前状态
        receiver.setState(state);
    }
}

// 接收者
public class Receiver {
    private String state;
    
    public void action() {
        System.out.println("Receiver performs action");
        // 执行具体操作并更新状态
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
}

// 调用者
public class Invoker {
    private List<Command> commandHistory = new ArrayList<>();
    
    public void executeCommand(Command command) {
        command.execute();
        commandHistory.add(command);
    }
    
    public void undoLastCommand() {
        if (!commandHistory.isEmpty()) {
            Command command = commandHistory.remove(commandHistory.size() - 1);
            command.undo();
        }
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        Receiver receiver = new Receiver();
        Command command = new ConcreteCommand(receiver);
        Invoker invoker = new Invoker();
        
        invoker.executeCommand(command);
        invoker.undoLastCommand();
    }
}
```

### 4.4 责任链模式（Chain of Responsibility Pattern）

**核心思想**：为请求创建一个处理对象的链，每个处理对象决定是否处理请求，或者将请求传递给链中的下一个对象。

**适用场景**：
- 有多个对象可以处理一个请求，具体哪个对象处理该请求由运行时刻自动确定
- 提交一个请求给多个对象中的一个，而不需要明确指定接收者
- 动态指定一组对象处理请求

**实现方式**：

```java
// 处理器接口
public abstract class Handler {
    protected Handler successor;
    
    public void setSuccessor(Handler successor) {
        this.successor = successor;
    }
    
    public abstract void handleRequest(Request request);
}

// 请求类
public class Request {
    private RequestType type;
    private int priority;
    
    public Request(RequestType type, int priority) {
        this.type = type;
        this.priority = priority;
    }
    
    public RequestType getType() {
        return type;
    }
    
    public int getPriority() {
        return priority;
    }
}

// 请求类型枚举
public enum RequestType {
    TYPE1, TYPE2, TYPE3
}

// 具体处理器
public class ConcreteHandler1 extends Handler {
    @Override
    public void handleRequest(Request request) {
        if (request.getType() == RequestType.TYPE1) {
            System.out.println("ConcreteHandler1 handles request of type " + request.getType());
        } else if (successor != null) {
            successor.handleRequest(request);
        }
    }
}

public class ConcreteHandler2 extends Handler {
    @Override
    public void handleRequest(Request request) {
        if (request.getType() == RequestType.TYPE2) {
            System.out.println("ConcreteHandler2 handles request of type " + request.getType());
        } else if (successor != null) {
            successor.handleRequest(request);
        }
    }
}

public class ConcreteHandler3 extends Handler {
    @Override
    public void handleRequest(Request request) {
        if (request.getType() == RequestType.TYPE3) {
            System.out.println("ConcreteHandler3 handles request of type " + request.getType());
        } else if (successor != null) {
            successor.handleRequest(request);
        }
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        Handler handler1 = new ConcreteHandler1();
        Handler handler2 = new ConcreteHandler2();
        Handler handler3 = new ConcreteHandler3();
        
        // 设置责任链
        handler1.setSuccessor(handler2);
        handler2.setSuccessor(handler3);
        
        // 创建请求并提交到责任链
        Request request1 = new Request(RequestType.TYPE1, 1);
        Request request2 = new Request(RequestType.TYPE2, 2);
        Request request3 = new Request(RequestType.TYPE3, 3);
        
        handler1.handleRequest(request1);
        handler1.handleRequest(request2);
        handler1.handleRequest(request3);
    }
}
```

### 4.5 状态模式（State Pattern）

**核心思想**：允许对象在内部状态改变时改变它的行为，对象看起来好像修改了它的类。

**适用场景**：
- 一个对象的行为取决于它的状态，并且它必须在运行时根据状态改变它的行为
- 一个操作中包含大量的条件语句（switch-case或if-else），这些条件语句的分支依赖于对象的状态
- 对象的状态可以动态地改变，并且需要根据状态执行不同的行为

**实现方式**：

```java
// 状态接口
public interface State {
    void handle(Context context);
}

// 具体状态
public class ConcreteStateA implements State {
    @Override
    public void handle(Context context) {
        System.out.println("Handling in State A");
        // 状态转换逻辑
        context.setState(new ConcreteStateB());
    }
}

public class ConcreteStateB implements State {
    @Override
    public void handle(Context context) {
        System.out.println("Handling in State B");
        // 状态转换逻辑
        context.setState(new ConcreteStateA());
    }
}

// 上下文类
public class Context {
    private State state;
    
    public Context() {
        // 初始状态
        this.state = new ConcreteStateA();
    }
    
    public void setState(State state) {
        this.state = state;
    }
    
    public void request() {
        state.handle(this);
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        Context context = new Context();
        
        // 多次请求，观察状态变化
        context.request(); // State A -> State B
        context.request(); // State B -> State A
        context.request(); // State A -> State B
    }
}
```

### 4.6 观察者模式（Observer Pattern）

**核心思想**：定义对象之间的一种一对多依赖关系，使得当一个对象状态发生变化时，所有依赖于它的对象都会得到通知并自动更新。

**适用场景**：
- 一个对象的改变需要同时改变其他对象
- 一个对象必须通知其他对象，而又不希望这些对象与自己紧密耦合
- 当一个系统需要在运行时建立对象之间的依赖关系

**实现方式**：

```java
// 观察者接口
public interface Observer {
    void update(Observable observable, Object data);
}

// 被观察者（主题）
public class Observable {
    private List<Observer> observers = new ArrayList<>();
    private boolean changed = false;
    
    public void addObserver(Observer observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
        }
    }
    
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers() {
        notifyObservers(null);
    }
    
    public void notifyObservers(Object data) {
        if (hasChanged()) {
            for (Observer observer : observers) {
                observer.update(this, data);
            }
            clearChanged();
        }
    }
    
    protected void setChanged() {
        changed = true;
    }
    
    protected void clearChanged() {
        changed = false;
    }
    
    public boolean hasChanged() {
        return changed;
    }
}

// 具体被观察者
public class ConcreteObservable extends Observable {
    private String state;
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
        setChanged();
        notifyObservers(state);
    }
}

// 具体观察者
public class ConcreteObserver implements Observer {
    private String name;
    
    public ConcreteObserver(String name) {
        this.name = name;
    }
    
    @Override
    public void update(Observable observable, Object data) {
        System.out.println(name + " received update: " + data);
        // 执行更新操作
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        ConcreteObservable observable = new ConcreteObservable();
        
        Observer observer1 = new ConcreteObserver("Observer 1");
        Observer observer2 = new ConcreteObserver("Observer 2");
        
        observable.addObserver(observer1);
        observable.addObserver(observer2);
        
        // 改变状态，触发通知
        observable.setState("New State");
        
        // 移除一个观察者
        observable.removeObserver(observer1);
        
        // 再次改变状态
        observable.setState("Another State");
    }
}
```

### 4.7 中介者模式（Mediator Pattern）

**核心思想**：用一个中介对象来封装一系列的对象交互，中介者使各对象之间不需要显式地相互引用，从而降低它们之间的耦合，并且可以独立地改变它们之间的交互。

**适用场景**：
- 系统中对象之间存在复杂的引用关系，产生的相互依赖关系结构混乱且难以理解
- 一个对象由于引用了其他很多对象并且直接与这些对象通信，导致难以复用该对象
- 想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类

**实现方式**：

```java
// 中介者接口
public interface Mediator {
    void registerColleague(Colleague colleague);
    void sendMessage(Colleague sender, String message);
}

// 同事类
public abstract class Colleague {
    protected Mediator mediator;
    protected String name;
    
    public Colleague(Mediator mediator, String name) {
        this.mediator = mediator;
        this.name = name;
    }
    
    public abstract void receive(String message);
    
    public void send(String message) {
        System.out.println(name + " sends: " + message);
        mediator.sendMessage(this, message);
    }
    
    public String getName() {
        return name;
    }
}

// 具体中介者
public class ConcreteMediator implements Mediator {
    private List<Colleague> colleagues = new ArrayList<>();
    
    @Override
    public void registerColleague(Colleague colleague) {
        colleagues.add(colleague);
    }
    
    @Override
    public void sendMessage(Colleague sender, String message) {
        // 向除发送者外的所有同事转发消息
        for (Colleague colleague : colleagues) {
            if (colleague != sender) {
                colleague.receive(message);
            }
        }
    }
}

// 具体同事
public class ConcreteColleague extends Colleague {
    public ConcreteColleague(Mediator mediator, String name) {
        super(mediator, name);
    }
    
    @Override
    public void receive(String message) {
        System.out.println(name + " receives: " + message);
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        Mediator mediator = new ConcreteMediator();
        
        Colleague colleague1 = new ConcreteColleague(mediator, "Colleague 1");
        Colleague colleague2 = new ConcreteColleague(mediator, "Colleague 2");
        Colleague colleague3 = new ConcreteColleague(mediator, "Colleague 3");
        
        mediator.registerColleague(colleague1);
        mediator.registerColleague(colleague2);
        mediator.registerColleague(colleague3);
        
        colleague1.send("Hello everyone!");
        colleague2.send("Hi there!");
    }
}
```

### 4.8 迭代器模式（Iterator Pattern）

**核心思想**：提供一种方法来访问一个容器对象中的各个元素，而不需要暴露该对象的内部表示。

**适用场景**：
- 访问一个容器对象的内容而无需暴露其内部表示
- 支持对容器对象的多种遍历方式
- 为遍历不同的容器结构提供一个统一的接口

**实现方式**：

```java
// 迭代器接口
public interface Iterator<T> {
    boolean hasNext();
    T next();
}

// 容器接口
public interface Container<T> {
    Iterator<T> createIterator();
}

// 具体容器
public class ConcreteContainer<T> implements Container<T> {
    private List<T> elements = new ArrayList<>();
    
    public void add(T element) {
        elements.add(element);
    }
    
    public void remove(T element) {
        elements.remove(element);
    }
    
    @Override
    public Iterator<T> createIterator() {
        return new ConcreteIterator<>(elements);
    }
}

// 具体迭代器
public class ConcreteIterator<T> implements Iterator<T> {
    private List<T> elements;
    private int position = 0;
    
    public ConcreteIterator(List<T> elements) {
        this.elements = elements;
    }
    
    @Override
    public boolean hasNext() {
        return position < elements.size();
    }
    
    @Override
    public T next() {
        if (hasNext()) {
            return elements.get(position++);
        }
        throw new NoSuchElementException();
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        ConcreteContainer<String> container = new ConcreteContainer<>();
        container.add("Element 1");
        container.add("Element 2");
        container.add("Element 3");
        
        Iterator<String> iterator = container.createIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
        
        // Java内置迭代器示例
        List<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        
        for (String element : list) {
            System.out.println(element);
        }
        
        // Java 8+ Stream API
        list.stream().forEach(System.out::println);
    }
}
```

### 4.9 访问者模式（Visitor Pattern）

**核心思想**：表示一个作用于某对象结构中的各元素的操作，它使我们可以在不改变各元素的类的前提下定义作用于这些元素的新操作。

**适用场景**：
- 对象结构相对稳定，但操作多变
- 需要对一个对象结构中的对象进行很多不同且不相关的操作，而不希望这些操作"污染"这些对象的类
- 想在不修改已有类的前提下，增加新的操作

**实现方式**：

```java
// 元素接口
public interface Element {
    void accept(Visitor visitor);
}

// 具体元素
public class ConcreteElementA implements Element {
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
    
    public String getSpecificPropertyA() {
        return "Property A";
    }
}

public class ConcreteElementB implements Element {
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
    
    public String getSpecificPropertyB() {
        return "Property B";
    }
}

// 访问者接口
public interface Visitor {
    void visit(ConcreteElementA element);
    void visit(ConcreteElementB element);
}

// 具体访问者
public class ConcreteVisitor1 implements Visitor {
    @Override
    public void visit(ConcreteElementA element) {
        System.out.println("Visitor 1 processes element A: " + element.getSpecificPropertyA());
    }
    
    @Override
    public void visit(ConcreteElementB element) {
        System.out.println("Visitor 1 processes element B: " + element.getSpecificPropertyB());
    }
}

public class ConcreteVisitor2 implements Visitor {
    @Override
    public void visit(ConcreteElementA element) {
        System.out.println("Visitor 2 processes element A: " + element.getSpecificPropertyA());
    }
    
    @Override
    public void visit(ConcreteElementB element) {
        System.out.println("Visitor 2 processes element B: " + element.getSpecificPropertyB());
    }
}

// 对象结构
public class ObjectStructure {
    private List<Element> elements = new ArrayList<>();
    
    public void addElement(Element element) {
        elements.add(element);
    }
    
    public void removeElement(Element element) {
        elements.remove(element);
    }
    
    public void accept(Visitor visitor) {
        for (Element element : elements) {
            element.accept(visitor);
        }
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        ObjectStructure structure = new ObjectStructure();
        structure.addElement(new ConcreteElementA());
        structure.addElement(new ConcreteElementB());
        
        Visitor visitor1 = new ConcreteVisitor1();
        Visitor visitor2 = new ConcreteVisitor2();
        
        structure.accept(visitor1);
        System.out.println("------------------------");
        structure.accept(visitor2);
    }
}
```

### 4.10 备忘录模式（Memento Pattern）

**核心思想**：在不破坏封装的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便在需要时恢复对象到原先保存的状态。

**适用场景**：
- 需要保存和恢复数据的相关状态场景
- 提供一个可回滚的操作
- 需要记录对象历史状态，以便在将来某个时刻恢复

**实现方式**：

```java
// 备忘录类
public class Memento {
    private String state;
    
    public Memento(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
}

// 发起人（Originator）类
public class Originator {
    private String state;
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
    
    public Memento saveStateToMemento() {
        return new Memento(state);
    }
    
    public void restoreStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}

// 管理者（Caretaker）类
public class Caretaker {
    private List<Memento> mementoList = new ArrayList<>();
    
    public void add(Memento state) {
        mementoList.add(state);
    }
    
    public Memento get(int index) {
        return mementoList.get(index);
    }
}

// 客户端使用
public class Client {
    public static void main(String[] args) {
        Originator originator = new Originator();
        Caretaker caretaker = new Caretaker();
        
        originator.setState("State #1");
        originator.setState("State #2");
        caretaker.add(originator.saveStateToMemento()); // 保存状态2
        
        originator.setState("State #3");
        caretaker.add(originator.saveStateToMemento()); // 保存状态3
        
        originator.setState("State #4");
        
        System.out.println("Current State: " + originator.getState());
        originator.restoreStateFromMemento(caretaker.get(0)); // 恢复到状态2
        System.out.println("First saved State: " + originator.getState());
        originator.restoreStateFromMemento(caretaker.get(1)); // 恢复到状态3
        System.out.println("Second saved State: " + originator.getState());
    }
}
```

### 4.11 解释器模式（Interpreter Pattern）

**核心思想**：定义语言的文法，并建立一个解释器来解释该语言中的句子。

**适用场景**：
- 当有一个语言需要解释执行，并且语言中的句子可以表示为一个抽象语法树时
- 当语法比较简单，且执行频率不高时
- 当需要解释简单语言或表达式时

**实现方式**：

```java
// 抽象表达式
public interface Expression {
    boolean interpret(String context);
}

// 终结表达式
public class TerminalExpression implements Expression {
    private String data;
    
    public TerminalExpression(String data) {
        this.data = data;
    }
    
    @Override
    public boolean interpret(String context) {
        return context.contains(data);
    }
}

// 非终结表达式 - AND
public class AndExpression implements Expression {
    private Expression expr1;
    private Expression expr2;
    
    public AndExpression(Expression expr1, Expression expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }
    
    @Override
    public boolean interpret(String context) {
        return expr1.interpret(context) && expr2.interpret(context);
    }
}

// 非终结表达式 - OR
public class OrExpression implements Expression {
    private Expression expr1;
    private Expression expr2;
    
    public OrExpression(Expression expr1, Expression expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }
    
    @Override
    public boolean interpret(String context) {
        return expr1.interpret(context) || expr2.interpret(context);
    }
}

// 客户端使用
public class Client {
    // 创建规则：Robert和John是男性
    public static Expression getMaleExpression() {
        Expression robert = new TerminalExpression("Robert");
        Expression john = new TerminalExpression("John");
        return new OrExpression(robert, john);
    }
    
    // 创建规则：Julie是一个已婚的女性
    public static Expression getMarriedWomanExpression() {
        Expression julie = new TerminalExpression("Julie");
        Expression married = new TerminalExpression("Married");
        return new AndExpression(julie, married);
    }
    
    public static void main(String[] args) {
        Expression isMale = getMaleExpression();
        Expression isMarriedWoman = getMarriedWomanExpression();
        
        System.out.println("John is male? " + isMale.interpret("John"));
        System.out.println("Julie is a married woman? " + isMarriedWoman.interpret("Married Julie"));
    }
}
```

## 五、设计模式的应用与最佳实践

### 5.1 设计模式的选择原则

1. **单一职责原则**：一个类应该只有一个引起它变化的原因
2. **开放封闭原则**：对扩展开放，对修改封闭
3. **里氏替换原则**：子类型必须能够替换掉它们的父类型
4. **依赖倒置原则**：高层模块不应该依赖低层模块，两者都应该依赖于抽象；抽象不应该依赖于细节，细节应该依赖于抽象
5. **接口隔离原则**：客户端不应该被迫依赖于它不使用的方法
6. **迪米特法则**：一个对象应该对其他对象有最少的了解

### 5.2 设计模式的组合使用

设计模式很少单独使用，通常是多个模式组合使用来解决复杂问题。以下是一些常见的模式组合：

- **单例模式 + 工厂模式**：工厂类通常设计为单例，因为只需要一个工厂实例
- **装饰器模式 + 策略模式**：可以动态地为对象添加不同的行为策略
- **观察者模式 + 责任链模式**：事件处理系统中常用的组合
- **适配器模式 + 装饰器模式**：在不改变现有代码的情况下，为对象添加新功能
- **命令模式 + 责任链模式**：构建一个命令处理管道
- **工厂模式 + 原型模式**：用于创建复杂对象

### 5.3 设计模式在框架中的应用

主流Java框架中广泛应用了各种设计模式，下面列举一些典型应用：

#### 5.3.1 Spring框架中的设计模式

- **单例模式**：Spring容器中的Bean默认是单例的
- **工厂模式**：BeanFactory、ApplicationContext都是工厂模式的体现
- **代理模式**：AOP功能的实现基于动态代理
- **模板方法模式**：JdbcTemplate、RestTemplate等模板类
- **观察者模式**：Spring的事件驱动机制
- **装饰器模式**：为Bean添加额外的功能
- **策略模式**：ResourceLoader、MessageConverter等

#### 5.3.2 MyBatis框架中的设计模式

- **工厂模式**：SqlSessionFactory
- **建造者模式**：SqlSessionFactoryBuilder
- **代理模式**：Mapper接口的动态代理实现
- **模板方法模式**：BaseExecutor、SimpleExecutor等执行器
- **装饰器模式**：CachingExecutor、BatchExecutor等

#### 5.3.3 Dubbo框架中的设计模式

- **工厂模式**：ProtocolFactory、ClusterFactory等
- **代理模式**：服务代理
- **观察者模式**：监听服务的注册和发现
- **装饰器模式**：Filter链的实现
- **策略模式**：负载均衡、集群容错等策略

## 六、反模式与常见误区

### 6.1 反模式（Anti-patterns）

反模式是指在软件工程中常见的不良设计和实现方式，以下是一些常见的反模式：

- **过度设计（Over-Engineering）**：为了未来可能的需求而过度复杂化当前的设计
- **大泥球（Big Ball of Mud）**：系统没有清晰的结构，代码组织混乱
- **意大利面代码（Spaghetti Code）**：代码流程复杂，难以理解和维护
- **复制粘贴编程（Copy-Paste Programming）**：通过复制现有代码来实现新功能，导致代码重复
- **上帝对象（God Object）**：一个类承担了过多的责任
- **紧耦合（Tight Coupling）**：模块之间过度依赖，难以独立开发和测试

### 6.2 设计模式的常见误区

使用设计模式时，需要避免以下误区：

- **为了使用模式而使用模式**：应该根据问题选择合适的模式，而不是为了展示知识而使用
- **过度设计**：简单问题复杂化
- **模式滥用**：不考虑实际情况，生搬硬套模式
- **忽略性能考虑**：某些模式可能会带来额外的性能开销
- **不理解模式的本质**：只关注模式的实现，而不理解其解决问题的核心思想

## 七、总结

设计模式是软件工程中的宝贵财富，是经验的总结和提炼。掌握设计模式可以帮助我们：

1. **提高代码质量**：设计模式提供了经过验证的解决方案，可以提高代码的可重用性、可维护性和可扩展性
2. **促进团队沟通**：设计模式为团队提供了共同的语言，便于交流和理解
3. **加速开发过程**：可以复用已有的设计思路，避免重复造轮子
4. **降低系统风险**：成熟的设计模式经过了时间的检验，降低了系统设计的风险

然而，设计模式不是银弹，不能解决所有问题。在实际开发中，应该根据具体情况灵活运用，结合项目特点和团队经验，选择合适的设计模式或创造新的解决方案。

最重要的是，我们应该理解设计模式背后的设计原则和思想，而不仅仅是记住它们的实现方式。这样才能在面对新问题时，创造性地应用这些思想，设计出更好的解决方案。