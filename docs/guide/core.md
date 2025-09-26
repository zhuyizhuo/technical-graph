# 📚 Java 语言核心
```markdown
Java 新特性树形结构 (8 → 11 → 17 → 21)
│
├── ◉ Java 8 LTS (2014) - 革命性更新
│   ├── 语言特性
│   │   ├── Lambda 表达式
│   │   ├── 方法引用
│   │   ├── 函数式接口 (`@FunctionalInterface`)
│   │   ├── 接口的默认方法和静态方法
│   │   └── Optional 类
│   ├── API 增强
│   │   ├── Stream API
│   │   ├── 新的日期时间 API (java.time)
│   │   └── CompletableFuture
│   └── JVM/工具
│       ├── 移除永久代 (PermGen)，引入元空间 (Metaspace)
│       ├── Nashorn JavaScript 引擎
│       └── 参数 `-parameters` (保留参数名)
│
├── ◉ Java 11 LTS (2018) - 现代化与模块化
│   ├── 语言特性
│   │   └── 局部变量类型推断 (`var`)
│   ├── API 增强
│   │   ├── 新的 HTTP Client (java.net.http)
│   │   ├── 字符串 API 增强
│   │   │   ├── `isBlank()`, `lines()`, `repeat()`, `strip()`
│   │   │   └── `String.stripIndent()`, `String.translateEscapes()`
│   │   ├── Collection.toArray(IntFunction) 方法
│   │   └── 新的文件方法 (`Files.readString`, `writeString`)
│   ├── 工具
│   │   └── 单文件源代码启动 (直接运行 `.java` 文件)
│   ├── 垃圾收集器
│   │   ├── Epsilon GC (无操作垃圾收集器)
│   │   └── ZGC (实验性)
│   └── 重要变更
│       ├── 移除 Java EE 和 CORBA 模块
│       ├── 移除 JavaFX (分离为独立模块)
│       └── HTTP API 过时，推荐使用新的 HTTP Client
│
├── ◉ Java 17 LTS (2021) - 新时代的基石
│   ├── 语言特性
│   │   ├── 密封类 (Sealed Classes) (JEP 409)
│   │   └── 模式匹配 (预览/最终化)
│   │       ├── `instanceof` 模式匹配 (JEP 394) - 最终版
│   │       └── Switch 模式匹配 (JEP 406) - 预览
│   ├── API 增强
│   │   ├── 文本块 (Text Blocks) (JEP 378) - 最终版
│   │   └── 新的 macOS 渲染管道
│   ├── 垃圾收集器
│   │   ├── 弃用并准备移除 Parallel Scavenge + SerialOld GC 组合
│   │   └── 强化 ZGC 和 Shenandoah GC
│   └── 安全/内部
│       ├── 强封装 JDK 内部 API (限制使用 `--illegal-access`)
│       ├── 新的随机数生成器 API (JEP 356)
│       └── 上下文特定的反序列化过滤器 (JEP 415)
│
└── ◉ Java 21 LTS (2023) - 并发的新纪元
│   ├── 语言特性 (核心亮点)
│   │   ├── 虚拟线程 (Virtual Threads) (JEP 444) - 最终版
│   │   ├── 记录模式 (Record Patterns) (JEP 440) - 最终版
│   │   ├── Switch 的模式匹配 (Pattern Matching for switch) (JEP 441) - 最终版
│   │   └── 字符串模板 (String Templates) (JEP 430) - 预览
│   ├── API 增强
│   │   ├── 序列化集合 (Sequenced Collections) (JEP 431)
│   │   └── 分代式 ZGC (Generational ZGC) (JEP 439)
│   ├── 垃圾收集器
│   │   └── 分代式 ZGC (提高性能，减少内存开销)
│   └── 其他
│        └── 弃用 Windows 32 位 x86 端口
│
├── 🧠 JVM 深度理解
│   ├── 内存模型 (JMM)
│   ├── 垃圾回收机制
│   │   ├── GC 算法 (标记清除、复制、标记整理)
│   │   ├── 垃圾收集器 (G1、ZGC、Shenandoah)
│   │   └── GC 调优
│   ├── 类加载机制
│   ├── 字节码执行
│   ├── JVM 调优
│   └── JVM 性能监控
│       ├── jstack、jmap、jstat
│       ├── VisualVM
│       ├── JMX
│       └── Arthas
│
└── ⚡ 并发编程
    ├── Java 内存模型 (JMM)
    ├── 线程池原理与使用
    ├── 并发工具类
    │   ├── CountDownLatch
    │   ├── CyclicBarrier
    │   ├── Semaphore
    │   └── Phaser
    ├── 并发集合
    │   ├── ConcurrentHashMap
    │   ├── CopyOnWriteArrayList
    │   └── BlockingQueue
    ├── Atomic 包
    ├── CompletableFuture
    └── Fork/Join 框架
```