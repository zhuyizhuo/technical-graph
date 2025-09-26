# 并发编程

## 一、并发编程核心概念与概述

### 1. 并发编程简介

并发编程是指在同一时间段内执行多个任务的编程方式。在计算机科学中，并发编程允许多个任务在宏观上同时进行，微观上可能是交替执行（在单CPU环境下）或真正并行执行（在多核CPU环境下）。

并发编程的主要目标包括：
- 提高程序的执行效率和吞吐量
- 改善用户体验，避免界面卡顿
- 充分利用多核处理器资源
- 实现异步操作和事件驱动编程

### 2. 并发与并行的区别

**并发（Concurrency）：**
- 指在同一时间段内，多个任务交替执行
- 单核CPU也可以实现并发
- 关注的是任务的调度和切换
- 经典比喻：一个人同时处理多个任务（如一边打电话一边打字）

**并行（Parallelism）：**
- 指在同一时刻，多个任务真正同时执行
- 需要多核CPU支持
- 关注的是任务的同时执行
- 经典比喻：多个人同时处理不同的任务

### 3. 进程与线程

**进程（Process）：**
- 操作系统进行资源分配和调度的基本单位
- 每个进程都有独立的内存空间和系统资源
- 进程间通信需要特殊的机制（如管道、消息队列、共享内存等）
- 进程切换的开销较大

**线程（Thread）：**
- 进程内的一个执行单元，是CPU调度的基本单位
- 同一进程内的线程共享进程的内存空间和系统资源
- 线程间通信相对容易（可以直接访问共享变量）
- 线程切换的开销较小

**线程的状态：**
- 新建（New）：线程对象已创建，但尚未启动
- 就绪（Runnable）：线程已启动，等待CPU调度
- 运行（Running）：线程正在执行
- 阻塞（Blocked）：线程等待某个条件满足（如等待锁释放）
- 等待（Waiting）：线程无限期等待某个事件发生
- 计时等待（Timed Waiting）：线程等待指定时间后自动苏醒
- 终止（Terminated）：线程执行完毕或异常终止

## 二、Java 并发基础

### 1. Thread 类与 Runnable 接口

在Java中，创建线程的两种主要方式：

**实现 Runnable 接口：**
```java
public class RunnableDemo implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread is running");
    }
    
    public static void main(String[] args) {
        Thread thread = new Thread(new RunnableDemo());
        thread.start();
    }
}
```

**继承 Thread 类：**
```java
public class ThreadDemo extends Thread {
    @Override
    public void run() {
        System.out.println("Thread is running");
    }
    
    public static void main(String[] args) {
        ThreadDemo thread = new ThreadDemo();
        thread.start();
    }
}
```

**推荐使用实现 Runnable 接口的方式，优点：**
- 避免了单继承的限制
- 更符合面向对象的设计原则（将任务与执行机制分离）
- 便于线程池等高级并发工具的使用

### 2. 线程控制方法

**线程启动与终止：**
- `start()`：启动线程，使线程进入就绪状态
- `run()`：线程的执行体，包含线程要执行的代码
- `join()`：等待线程执行完毕
- `interrupt()`：中断线程（设置中断标志）
- `isInterrupted()`：检查线程是否被中断
- `sleep(long millis)`：使线程休眠指定时间
- `yield()`：让出CPU执行权，使线程回到就绪状态

**线程优先级：**
- `setPriority(int priority)`：设置线程优先级（1-10）
- `getPriority()`：获取线程优先级
- 线程优先级只是给调度器的一个提示，不保证线程按优先级顺序执行

### 3. ThreadLocal 的使用

ThreadLocal 提供了线程本地变量，每个线程都有自己独立的变量副本，互不干扰。

**基本使用：**
```java
public class ThreadLocalDemo {
    private static final ThreadLocal<Integer> threadLocal = ThreadLocal.withInitial(() -> 0);
    
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            final int threadNum = i;
            new Thread(() -> {
                try {
                    // 设置线程本地变量
                    threadLocal.set(threadNum);
                    System.out.println(Thread.currentThread().getName() + ": " + threadLocal.get());
                } finally {
                    // 清理线程本地变量，避免内存泄漏
                    threadLocal.remove();
                }
            }, "Thread-" + i).start();
        }
    }
}
```

**ThreadLocal 可能导致的内存泄漏：**
- ThreadLocal 使用 ThreadLocalMap 存储线程本地变量
- ThreadLocalMap 中的键是 ThreadLocal 的弱引用，值是强引用
- 如果 ThreadLocal 没有被外部强引用持有，可能被GC回收，但值仍然存在
- 线程池中的线程如果不清理 ThreadLocal 变量，可能导致内存泄漏
- 解决方法：使用完毕后调用 `remove()` 方法清理线程本地变量

## 三、Java 并发关键字

### 1. synchronized 关键字

`synchronized` 是 Java 中最基本的同步机制，用于实现线程同步和互斥访问。

**用法：**
- 修饰实例方法：锁是当前对象实例
- 修饰静态方法：锁是当前类的 Class 对象
- 修饰代码块：锁是括号中指定的对象

**代码示例：**
```java
public class SynchronizedDemo {
    // 实例方法同步
    public synchronized void instanceMethod() {
        // 同步代码
    }
    
    // 静态方法同步
    public static synchronized void staticMethod() {
        // 同步代码
    }
    
    // 代码块同步
    public void codeBlock() {
        synchronized (this) {
            // 同步代码
        }
        
        synchronized (SynchronizedDemo.class) {
            // 同步代码
        }
    }
}
```

**synchronized 的实现原理：**
- 基于对象内部的监视器锁（Monitor）实现
- Java 对象头中包含锁状态标志
- 通过 `monitorenter` 和 `monitorexit` 指令实现
- JVM 会对 synchronized 进行优化（如偏向锁、轻量级锁等）

### 2. volatile 关键字

`volatile` 关键字用于确保变量的可见性和有序性，但不保证原子性。

**主要特性：**
- **可见性：** 一个线程修改了 volatile 变量的值，其他线程能立即看到最新值
- **有序性：** 禁止指令重排序优化
- **不保证原子性：** 对于复合操作（如 i++），volatile 无法保证原子性

**适用场景：**
- 状态标志（如停止信号）
- 双重检查锁定（Double-Checked Locking）中的实例变量
- 简单的计数器（但需要确保操作是原子的）

**代码示例：**
```java
public class VolatileDemo {
    private volatile boolean flag = false;
    
    public void start() {
        flag = true;
    }
    
    public void stop() {
        flag = false;
    }
    
    public void run() {
        while (flag) {
            // 执行任务
        }
    }
}
```

### 3. final 关键字与并发

`final` 关键字在并发编程中也有重要作用：

- **不可变性：** final 修饰的变量一旦初始化后不能再修改
- **线程安全：** 不可变对象天然是线程安全的
- **安全发布：** final 字段保证了初始化的安全性，在对象引用被其他线程可见之前，其 final 字段已经完全初始化

**不可变对象的优点：**
- 线程安全，不需要额外的同步机制
- 易于理解和维护
- 可以安全地共享和发布

## 四、Java 并发工具类

### 1. 并发集合

Java 提供了一系列线程安全的集合类，位于 `java.util.concurrent` 包中：

**ConcurrentHashMap：**
- 线程安全的 HashMap 实现
- 分段锁技术，提供更高的并发性能
- 支持高并发的读操作，不需要加锁
- 写操作只锁定部分数据，不影响其他部分的并发访问

**CopyOnWriteArrayList：**
- 线程安全的 ArrayList 实现
- 写操作时复制整个数组，读操作不需要加锁
- 适用于读多写少的场景
- 内存开销较大，不适合频繁修改的场景

**ConcurrentLinkedQueue：**
- 基于链表的无界线程安全队列
- 采用 CAS 操作实现线程安全
- 非阻塞算法，性能高
- 适用于高并发的生产者-消费者模型

**BlockingQueue：**
- 支持阻塞操作的队列接口
- 主要实现类：ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue 等
- 提供 `put()` 和 `take()` 等阻塞方法
- 适用于生产者-消费者模型

### 2. 线程池

线程池是一种线程复用机制，可以避免频繁创建和销毁线程的开销。

**线程池的优点：**
- 降低资源消耗：复用线程，减少线程创建和销毁的开销
- 提高响应速度：线程可以立即执行任务，不需要等待创建
- 提高线程的可管理性：统一管理线程的生命周期

**Java 线程池的核心组件：**
- `ThreadPoolExecutor`：线程池的核心实现类
- `Executors`：提供创建线程池的静态工厂方法

**线程池的创建：**
```java
// 使用 Executors 创建线程池（不推荐，可能导致资源耗尽）
ExecutorService fixedThreadPool = Executors.newFixedThreadPool(10);
ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();
ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(5);

// 推荐使用 ThreadPoolExecutor 构造函数创建线程池
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    5,                          // 核心线程数
    10,                         // 最大线程数
    60L, TimeUnit.SECONDS,      // 空闲线程存活时间
    new LinkedBlockingQueue<>(100), // 工作队列
    Executors.defaultThreadFactory(), // 线程工厂
    new ThreadPoolExecutor.CallerRunsPolicy() // 拒绝策略
);
```

**线程池的工作流程：**
1. 当有任务提交时，首先检查核心线程是否已满
2. 如果核心线程未满，创建新线程执行任务
3. 如果核心线程已满，检查工作队列是否已满
4. 如果工作队列未满，将任务放入队列等待执行
5. 如果工作队列已满，检查最大线程数是否已满
6. 如果最大线程数未满，创建新线程执行任务
7. 如果最大线程数已满，执行拒绝策略

**线程池的拒绝策略：**
- `AbortPolicy`：直接抛出 RejectedExecutionException 异常
- `CallerRunsPolicy`：由调用者线程执行任务
- `DiscardPolicy`：直接丢弃任务，不抛出异常
- `DiscardOldestPolicy`：丢弃队列中最老的任务，然后尝试提交新任务

### 3. CountDownLatch、CyclicBarrier 与 Semaphore

**CountDownLatch：**
- 允许一个或多个线程等待其他线程完成操作
- 通过计数器实现，计数器初始化为指定值
- 线程完成操作后调用 `countDown()` 方法减少计数器
- 等待的线程调用 `await()` 方法等待计数器为 0
- 计数器一旦为 0，无法重置

**代码示例：**
```java
public class CountDownLatchDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(3);
        
        for (int i = 0; i < 3; i++) {
            final int taskNum = i;
            new Thread(() -> {
                try {
                    System.out.println("Task " + taskNum + " is running");
                    Thread.sleep(1000);
                    System.out.println("Task " + taskNum + " is completed");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    latch.countDown();
                }
            }).start();
        }
        
        System.out.println("Waiting for all tasks to complete");
        latch.await(); // 等待所有任务完成
        System.out.println("All tasks are completed");
    }
}
```

**CyclicBarrier：**
- 允许一组线程互相等待，直到到达某个共同屏障点
- 通过计数器实现，计数器初始化为指定值
- 线程到达屏障点时调用 `await()` 方法等待
- 当最后一个线程到达屏障点时，所有线程继续执行
- 计数器可以通过 `reset()` 方法重置，支持重复使用

**代码示例：**
```java
public class CyclicBarrierDemo {
    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(3, () -> {
            System.out.println("All threads have reached the barrier");
        });
        
        for (int i = 0; i < 3; i++) {
            final int threadNum = i;
            new Thread(() -> {
                try {
                    System.out.println("Thread " + threadNum + " is running");
                    Thread.sleep(1000);
                    System.out.println("Thread " + threadNum + " is waiting at the barrier");
                    barrier.await(); // 等待其他线程到达屏障点
                    System.out.println("Thread " + threadNum + " has crossed the barrier");
                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

**Semaphore：**
- 信号量，用于控制同时访问某个资源的线程数量
- 通过计数器实现，计数器初始化为指定的许可数量
- 线程需要访问资源时调用 `acquire()` 方法获取许可
- 线程使用完资源后调用 `release()` 方法释放许可
- 适用于流量控制和资源池管理

**代码示例：**
```java
public class SemaphoreDemo {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(2); // 最多允许 2 个线程同时访问
        
        for (int i = 0; i < 5; i++) {
            final int threadNum = i;
            new Thread(() -> {
                try {
                    semaphore.acquire(); // 获取许可
                    System.out.println("Thread " + threadNum + " is accessing the resource");
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    System.out.println("Thread " + threadNum + " has released the resource");
                    semaphore.release(); // 释放许可
                }
            }).start();
        }
    }
}
```

## 五、Java 锁机制

### 1. Lock 接口与 ReentrantLock

`Lock` 接口是 Java 5 引入的显式锁机制，提供了比 `synchronized` 更灵活的同步操作。

**Lock 接口的主要方法：**
- `lock()`：获取锁，如果锁被占用则阻塞
- `lockInterruptibly()`：获取锁，但可以响应中断
- `tryLock()`：尝试获取锁，如果锁未被占用则获取成功，否则立即返回
- `tryLock(long time, TimeUnit unit)`：在指定时间内尝试获取锁
- `unlock()`：释放锁
- `newCondition()`：创建条件对象

**ReentrantLock 的特性：**
- **可重入性：** 同一个线程可以多次获取同一个锁
- **公平锁与非公平锁：** 可以选择是否按照请求顺序分配锁
- **可中断锁：** 可以响应中断
- **超时机制：** 可以设置获取锁的超时时间
- **条件变量：** 支持多个条件变量

**代码示例：**
```java
public class ReentrantLockDemo {
    private final Lock lock = new ReentrantLock();
    
    public void method() {
        lock.lock();
        try {
            // 同步代码
        } finally {
            lock.unlock(); // 必须在 finally 块中释放锁
        }
    }
    
    // 使用 tryLock 实现非阻塞获取锁
    public boolean tryMethod() {
        if (lock.tryLock()) {
            try {
                // 同步代码
                return true;
            } finally {
                lock.unlock();
            }
        }
        return false;
    }
    
    // 使用条件变量实现等待-通知机制
    public void conditionMethod() throws InterruptedException {
        Condition condition = lock.newCondition();
        
        lock.lock();
        try {
            while (/* 条件不满足 */) {
                condition.await(); // 等待条件满足
            }
            // 条件满足后执行操作
            condition.signalAll(); // 通知其他等待的线程
        } finally {
            lock.unlock();
        }
    }
}
```

**ReentrantLock 与 synchronized 的比较：**
- **灵活性：** ReentrantLock 提供了更灵活的锁定机制
- **性能：** 在高并发场景下，ReentrantLock 的性能可能更好
- **易用性：** synchronized 更简单易用，无需手动释放锁
- **功能：** ReentrantLock 提供了中断、超时、公平性等额外功能
- **内存语义：** 两者都提供了相同的内存可见性保证

### 2. ReadWriteLock 与 ReentrantReadWriteLock

`ReadWriteLock` 接口定义了一种读写分离的锁机制，允许多个读操作同时进行，但写操作需要独占锁。

**主要特性：**
- **读共享，写独占：** 多个线程可以同时读取，但写入时需要独占
- **提高并发性能：** 适用于读多写少的场景
- **可重入性：** 支持读锁和写锁的可重入
- **锁降级：** 支持从写锁降级为读锁，但不支持从读锁升级为写锁

**ReentrantReadWriteLock 的使用：**
```java
public class ReentrantReadWriteLockDemo {
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final Lock readLock = lock.readLock();
    private final Lock writeLock = lock.writeLock();
    
    // 读操作
    public void read() {
        readLock.lock();
        try {
            // 读取操作
        } finally {
            readLock.unlock();
        }
    }
    
    // 写操作
    public void write() {
        writeLock.lock();
        try {
            // 写入操作
        } finally {
            writeLock.unlock();
        }
    }
    
    // 锁降级示例
    public void lockDowngrade() {
        writeLock.lock();
        try {
            // 写入操作
            readLock.lock(); // 获取读锁
        } finally {
            writeLock.unlock(); // 释放写锁，完成降级
        }
        
        try {
            // 读取操作
        } finally {
            readLock.unlock();
        }
    }
}
```

### 3. StampedLock

`StampedLock` 是 Java 8 引入的一种新型锁机制，提供了乐观读模式，性能优于 `ReentrantReadWriteLock`。

**主要特性：**
- **三种模式：** 写锁、悲观读锁和乐观读
- **乐观读：** 先尝试乐观读取，然后验证是否有写操作干扰
- **不可重入：** StampedLock 不支持锁的可重入
- **性能优势：** 在高并发读场景下，性能优于 ReentrantReadWriteLock

**StampedLock 的使用：**
```java
public class StampedLockDemo {
    private final StampedLock lock = new StampedLock();
    private int value = 0;
    
    // 写操作
    public void write(int newValue) {
        long stamp = lock.writeLock();
        try {
            value = newValue;
        } finally {
            lock.unlockWrite(stamp);
        }
    }
    
    // 悲观读操作
    public int readPessimistic() {
        long stamp = lock.readLock();
        try {
            return value;
        } finally {
            lock.unlockRead(stamp);
        }
    }
    
    // 乐观读操作
    public int readOptimistic() {
        long stamp = lock.tryOptimisticRead();
        int currentValue = value;
        
        // 验证是否有写操作干扰
        if (!lock.validate(stamp)) {
            // 有写操作干扰，升级为悲观读锁
            stamp = lock.readLock();
            try {
                currentValue = value;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        
        return currentValue;
    }
    
    // 读锁升级为写锁
    public void readThenWrite(int newValue) {
        long stamp = lock.readLock();
        try {
            if (/* 需要写入 */) {
                // 释放读锁，获取写锁
                lock.unlockRead(stamp);
                stamp = lock.writeLock();
                try {
                    value = newValue;
                } finally {
                    lock.unlockWrite(stamp);
                }
            }
        } finally {
            if (lock.isReadLockedStamp(stamp)) {
                lock.unlockRead(stamp);
            }
        }
    }
}
```

## 六、Java 并发设计模式

### 1. 生产者-消费者模式

生产者-消费者模式是一种经典的并发设计模式，用于解耦生产者和消费者，通过缓冲区实现两者之间的通信。

**主要组件：**
- **生产者：** 生成数据并放入缓冲区
- **消费者：** 从缓冲区取出数据并处理
- **缓冲区：** 存储生产者生成的数据，支持生产者和消费者并发访问

**使用 BlockingQueue 实现：**
```java
public class ProducerConsumerDemo {
    private static final BlockingQueue<Integer> queue = new LinkedBlockingQueue<>(10);
    
    // 生产者
    static class Producer implements Runnable {
        private final int id;
        
        public Producer(int id) {
            this.id = id;
        }
        
        @Override
        public void run() {
            try {
                for (int i = 0; i < 10; i++) {
                    int data = id * 100 + i;
                    queue.put(data); // 阻塞直到队列有空间
                    System.out.println("Producer " + id + " produced: " + data);
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    // 消费者
    static class Consumer implements Runnable {
        private final int id;
        
        public Consumer(int id) {
            this.id = id;
        }
        
        @Override
        public void run() {
            try {
                for (int i = 0; i < 15; i++) {
                    int data = queue.take(); // 阻塞直到队列有数据
                    System.out.println("Consumer " + id + " consumed: " + data);
                    Thread.sleep(200);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    public static void main(String[] args) {
        // 创建 2 个生产者和 3 个消费者
        ExecutorService executor = Executors.newFixedThreadPool(5);
        
        for (int i = 0; i < 2; i++) {
            executor.execute(new Producer(i));
        }
        
        for (int i = 0; i < 3; i++) {
            executor.execute(new Consumer(i));
        }
        
        executor.shutdown();
    }
}
```

### 2. 读写锁分离模式

读写锁分离模式通过分离读操作和写操作的锁，允许多个读操作同时进行，提高并发性能。

**主要思想：**
- 读操作之间不互斥，可以并发执行
- 写操作与其他操作（读或写）互斥，需要独占锁
- 适用于读多写少的场景

**使用 ReadWriteLock 实现：**
```java
public class ReadWriteLockDemo {
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final Lock readLock = lock.readLock();
    private final Lock writeLock = lock.writeLock();
    
    private Map<String, Object> cache = new HashMap<>();
    
    // 读操作
    public Object get(String key) {
        readLock.lock();
        try {
            return cache.get(key);
        } finally {
            readLock.unlock();
        }
    }
    
    // 写操作
    public void put(String key, Object value) {
        writeLock.lock();
        try {
            cache.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }
    
    // 批量写入操作
    public void putAll(Map<String, Object> values) {
        writeLock.lock();
        try {
            cache.putAll(values);
        } finally {
            writeLock.unlock();
        }
    }
    
    // 获取缓存大小（读操作）
    public int size() {
        readLock.lock();
        try {
            return cache.size();
        } finally {
            readLock.unlock();
        }
    }
}
```

### 3. 线程池模式

线程池模式通过预先创建一定数量的线程，并重用这些线程执行任务，避免频繁创建和销毁线程的开销。

**主要优势：**
- 降低资源消耗：复用线程，减少线程创建和销毁的开销
- 提高响应速度：任务可以立即执行，不需要等待线程创建
- 提高线程的可管理性：统一管理线程的生命周期
- 支持定时任务和批量任务处理

**线程池的最佳实践：**
- 避免使用 Executors 创建线程池，推荐使用 ThreadPoolExecutor 构造函数
- 根据任务类型和系统资源合理配置线程池参数
- 使用有界队列避免任务积压导致的内存溢出
- 选择合适的拒绝策略处理无法执行的任务
- 线程池使用完毕后调用 shutdown() 方法关闭

## 七、并发性能优化

### 1. 减少锁持有时间

减少锁的持有时间是提高并发性能的有效手段，只在必要的代码块上加锁，避免长时间持有锁。

**优化方法：**
- 将不涉及共享资源的操作移到锁外执行
- 尽量缩小同步代码块的范围
- 避免在锁内执行耗时操作（如 I/O 操作、网络请求等）

**示例：**
```java
// 优化前
public synchronized void method() {
    // 不涉及共享资源的操作
    // 涉及共享资源的操作
    // 不涉及共享资源的耗时操作
}

// 优化后
public void method() {
    // 不涉及共享资源的操作
    synchronized (this) {
        // 涉及共享资源的操作
    }
    // 不涉及共享资源的耗时操作
}
```

### 2. 锁粒度优化

锁粒度优化是指通过减小锁的覆盖范围，提高并发性能。

**优化方法：**
- **锁分解：** 将一个大锁分解为多个小锁，每个锁保护不同的共享资源
- **锁分段：** 对数据结构进行分段，每个段使用独立的锁（如 ConcurrentHashMap）
- **读写锁分离：** 使用 ReadWriteLock 分离读操作和写操作

**示例：**
```java
// 优化前：一个锁保护多个资源
public class LockGranularityDemo {
    private final Object lock = new Object();
    private int count1 = 0;
    private int count2 = 0;
    
    public void incrementCount1() {
        synchronized (lock) {
            count1++;
        }
    }
    
    public void incrementCount2() {
        synchronized (lock) {
            count2++;
        }
    }
}

// 优化后：每个资源使用独立的锁
public class LockGranularityDemo {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    private int count1 = 0;
    private int count2 = 0;
    
    public void incrementCount1() {
        synchronized (lock1) {
            count1++;
        }
    }
    
    public void incrementCount2() {
        synchronized (lock2) {
            count2++;
        }
    }
}
```

### 3. 无锁化编程

无锁化编程是指不使用锁机制，而是通过原子操作（如 CAS 操作）实现线程安全，避免锁带来的性能开销。

**原子操作类：**
Java 提供了一系列原子操作类，位于 `java.util.concurrent.atomic` 包中：
- `AtomicBoolean`、`AtomicInteger`、`AtomicLong`：原子布尔、整型、长整型
- `AtomicReference`：原子引用类型
- `AtomicStampedReference`：带版本戳的原子引用，解决 ABA 问题
- `AtomicIntegerFieldUpdater`、`AtomicLongFieldUpdater`：原子更新字段

**CAS 操作原理：**
CAS（Compare-And-Swap）是一种无锁算法，包含三个操作数：
- 内存位置（V）
- 预期值（A）
- 新值（B）

当且仅当内存位置 V 的值等于预期值 A 时，才将内存位置 V 的值更新为新值 B，否则不做任何操作。整个操作是原子的。

**代码示例：**
```java
public class AtomicDemo {
    private final AtomicInteger count = new AtomicInteger(0);
    
    // 原子递增
    public int increment() {
        return count.incrementAndGet(); // 相当于原子的 ++count
    }
    
    // 原子递减
    public int decrement() {
        return count.decrementAndGet(); // 相当于原子的 --count
    }
    
    // 原子添加指定值
    public int add(int delta) {
        return count.addAndGet(delta); // 相当于原子的 count += delta
    }
    
    // 原子更新值（CAS 操作）
    public boolean compareAndSet(int expect, int update) {
        return count.compareAndSet(expect, update);
    }
}
```

### 4. 避免线程阻塞

线程阻塞会导致上下文切换，增加系统开销。尽量避免不必要的线程阻塞。

**优化方法：**
- 使用非阻塞算法和数据结构
- 避免在高并发场景下使用阻塞式 I/O
- 使用异步编程模型处理耗时操作
- 合理设置超时时间，避免线程无限期等待

**示例：**
```java
// 使用 CompletableFuture 进行异步编程
public CompletableFuture<String> asyncOperation() {
    return CompletableFuture.supplyAsync(() -> {
        // 耗时操作
        return "result";
    });
}

// 使用非阻塞 I/O
public void nonBlockingIO() throws IOException {
    AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(Paths.get("file.txt"));
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    
    fileChannel.read(buffer, 0, buffer, new CompletionHandler<Integer, ByteBuffer>() {
        @Override
        public void completed(Integer result, ByteBuffer attachment) {
            // 处理读取结果
        }
        
        @Override
        public void failed(Throwable exc, ByteBuffer attachment) {
            // 处理失败情况
        }
    });
}
```

## 八、常见并发问题及解决方案

### 1. 线程安全问题

**问题描述：**
多个线程同时访问共享资源，导致数据不一致或程序行为异常。

**常见表现：**
- 数据脏读、幻读、不可重复读
- 数据丢失或覆盖
- 程序死循环或崩溃

**解决方案：**
- 使用同步机制（synchronized、Lock 等）保护共享资源
- 使用线程安全的数据结构（ConcurrentHashMap、CopyOnWriteArrayList 等）
- 使用原子操作类（AtomicInteger、AtomicReference 等）
- 避免共享可变状态，使用不可变对象
- 采用线程本地存储（ThreadLocal）隔离线程状态

### 2. 死锁（Deadlock）

**问题描述：**
两个或多个线程互相等待对方释放资源，导致所有线程都无法继续执行。

**死锁的必要条件：**
- 互斥条件：资源不能被共享，一次只能一个线程使用
- 请求与保持条件：线程已获得一个资源，同时又提出新的资源请求
- 不剥夺条件：已获得的资源在使用完之前不能被强行剥夺
- 循环等待条件：若干线程之间形成头尾相接的循环等待资源关系

**死锁示例：**
```java
public class DeadlockDemo {
    private static final Object lockA = new Object();
    private static final Object lockB = new Object();
    
    public static void main(String[] args) {
        // 线程 1：先获取 lockA，再获取 lockB
        new Thread(() -> {
            synchronized (lockA) {
                System.out.println("Thread 1: Holding lock A");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Thread 1: Waiting for lock B");
                synchronized (lockB) {
                    System.out.println("Thread 1: Holding lock B");
                }
            }
        }).start();
        
        // 线程 2：先获取 lockB，再获取 lockA
        new Thread(() -> {
            synchronized (lockB) {
                System.out.println("Thread 2: Holding lock B");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Thread 2: Waiting for lock A");
                synchronized (lockA) {
                    System.out.println("Thread 2: Holding lock A");
                }
            }
        }).start();
    }
}
```

**死锁预防与解决：**
- **破坏互斥条件：** 尽量使用可共享的资源
- **破坏请求与保持条件：** 一次性获取所有需要的资源
- **破坏不剥夺条件：** 允许线程在无法获取新资源时释放已拥有的资源
- **破坏循环等待条件：** 按顺序获取资源
- 使用超时锁（如 tryLock() 方法）避免无限期等待
- 使用 JVM 工具（如 jstack）检测死锁

### 3. 活锁（Livelock）

**问题描述：**
线程虽然没有阻塞，但由于不断尝试重试操作，导致无法继续执行。

**活锁示例：**
```java
public class LivelockDemo {
    private static final Object lockA = new Object();
    private static final Object lockB = new Object();
    
    public static void main(String[] args) {
        Thread thread1 = new Thread(() -> {
            while (true) {
                synchronized (lockA) {
                    System.out.println("Thread 1: Holding lock A");
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    
                    if (Thread.holdsLock(lockB)) {
                        System.out.println("Thread 1: Already holding lock B");
                        break;
                    }
                    
                    synchronized (lockB) {
                        System.out.println("Thread 1: Holding lock B");
                        break;
                    }
                }
            }
        });
        
        Thread thread2 = new Thread(() -> {
            while (true) {
                synchronized (lockB) {
                    System.out.println("Thread 2: Holding lock B");
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    
                    if (Thread.holdsLock(lockA)) {
                        System.out.println("Thread 2: Already holding lock A");
                        break;
                    }
                    
                    synchronized (lockA) {
                        System.out.println("Thread 2: Holding lock A");
                        break;
                    }
                }
            }
        });
        
        thread1.start();
        thread2.start();
    }
}
```

**活锁预防与解决：**
- 引入随机等待时间，避免多个线程同时重试
- 限制重试次数，超过次数后放弃或降级处理
- 使用队列等机制，保证操作的顺序性
- 采用指数退避策略，逐渐增加重试间隔

### 4. 线程饥饿（Starvation）

**问题描述：**
某些线程长期无法获取资源，导致无法执行。

**常见原因：**
- 线程优先级设置不合理，低优先级线程长期无法获取 CPU 时间片
- 锁持有时间过长，导致其他线程长期等待
- 资源分配策略不公平，某些线程长期无法获取资源

**饥饿示例：**
```java
public class StarvationDemo {
    private static final Object lock = new Object();
    
    public static void main(String[] args) {
        // 创建一个高优先级线程
        Thread highPriorityThread = new Thread(() -> {
            while (true) {
                synchronized (lock) {
                    try {
                        System.out.println("High priority thread is running");
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
        highPriorityThread.setPriority(Thread.MAX_PRIORITY);
        
        // 创建一个低优先级线程
        Thread lowPriorityThread = new Thread(() -> {
            while (true) {
                synchronized (lock) {
                    System.out.println("Low priority thread is running");
                }
            }
        });
        lowPriorityThread.setPriority(Thread.MIN_PRIORITY);
        
        highPriorityThread.start();
        lowPriorityThread.start();
    }
}
```

**饥饿预防与解决：**
- 合理设置线程优先级，避免优先级差距过大
- 减少锁持有时间，避免长时间占用资源
- 使用公平锁（如 ReentrantLock 的公平锁模式）
- 避免线程无限期等待资源
- 使用线程池管理线程，避免创建过多线程

## 九、Java 并发编程最佳实践

### 1. 线程安全编程原则

- **最小化共享状态：** 尽量减少共享可变状态，优先使用局部变量和不可变对象
- **使用线程安全的数据结构：** 优先使用 `java.util.concurrent` 包中的线程安全集合
- **合理使用同步机制：** 根据场景选择合适的同步机制（synchronized、Lock、原子操作等）
- **避免过度同步：** 只在必要的代码块上加锁，减少锁的粒度
- **正确使用 ThreadLocal：** 使用完毕后调用 `remove()` 方法清理，避免内存泄漏
- **避免使用 Thread.stop()、Thread.suspend() 等过时方法：** 这些方法可能导致线程死锁或资源泄漏

### 2. 并发性能优化技巧

- **使用无锁数据结构和算法：** 优先使用基于 CAS 操作的无锁数据结构
- **合理配置线程池：** 根据任务类型和系统资源配置合适的线程池参数
- **避免阻塞操作：** 尽量使用非阻塞 I/O 和异步编程模型
- **使用读写锁分离：** 在读写分离场景下，使用 ReadWriteLock 提高并发性能
- **预计算和缓存：** 对热点数据进行预计算和缓存，减少计算开销
- **批量操作：** 合并多个小操作，减少锁的获取和释放次数

### 3. 并发调试与监控

- **使用日志记录：** 添加详细的日志记录，帮助排查并发问题
- **使用 JVM 工具：** 利用 jstack、jmap、jstat 等工具分析线程状态和内存使用情况
- **使用监控工具：** 使用 VisualVM、JConsole 等工具监控应用程序的运行状态
- **添加线程名称：** 为线程设置有意义的名称，方便调试和监控
- **使用线程转储：** 定期生成线程转储，分析线程阻塞和死锁情况
- **使用 JFR（Java Flight Recorder）：** 记录和分析应用程序的运行时行为

通过掌握和应用这些并发编程知识和最佳实践，你可以编写高性能、线程安全的并发应用程序，充分利用多核处理器的优势，提高应用程序的响应速度和吞吐量。