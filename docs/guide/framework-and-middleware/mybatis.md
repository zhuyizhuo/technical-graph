# MyBatis

## 1. 核心概念与概述

MyBatis是一个优秀的持久层框架，它支持定制化SQL、存储过程以及高级映射。MyBatis避免了几乎所有的JDBC代码和手动设置参数以及获取结果集。MyBatis可以使用简单的XML或注解来配置和映射原生类型、接口和Java的POJO（Plain Old Java Objects，普通老式Java对象）为数据库中的记录。

### 1.1 MyBatis的基本概念

- **SqlSessionFactory**：MyBatis的核心接口，负责创建SqlSession实例，通常是线程安全的，一个应用程序只需要一个SqlSessionFactory实例
- **SqlSession**：代表与数据库的一次会话，提供了执行SQL、获取映射器等方法，通常是非线程安全的，每个线程应该有自己的SqlSession实例
- **Mapper接口**：定义数据库操作方法的接口，MyBatis会为这些接口创建动态代理实现
- **映射文件**：包含SQL语句和映射规则的XML文件，定义了如何将数据库结果映射到Java对象
- **参数映射**：将Java对象的属性映射到SQL语句的参数
- **结果映射**：将SQL查询结果映射到Java对象
- **动态SQL**：根据条件动态生成SQL语句的功能
- **缓存**：MyBatis提供的一级缓存和二级缓存机制，提高查询性能

### 1.2 MyBatis的特点

- **简单易用**：相比其他ORM框架，MyBatis更加简单直观，学习成本低
- **灵活**：MyBatis允许开发者直接编写SQL语句，对SQL的控制力强，适合复杂查询场景
- **映射功能强大**：支持多种映射方式，包括XML配置和注解配置
- **动态SQL**：提供了丰富的动态SQL标签，可以根据条件动态生成SQL语句
- **缓存机制**：提供了一级缓存和二级缓存，提高查询性能
- **低侵入性**：MyBatis对应用程序的侵入性低，POJO可以是普通的Java对象，不需要实现特定接口
- **易于集成**：MyBatis可以与Spring、Spring Boot等框架轻松集成

### 1.3 MyBatis的应用场景

- **需要灵活控制SQL的场景**：当业务逻辑复杂，需要优化SQL性能时
- **遗留系统迁移**：当需要将遗留系统迁移到新系统，而数据库结构无法大规模修改时
- **对性能要求高的场景**：当需要精确控制SQL执行计划，优化查询性能时
- **多数据库支持**：当应用程序需要支持多种数据库时，MyBatis的SQL可以根据不同数据库进行调整
- **存储过程调用**：当需要频繁调用存储过程时

## 2. MyBatis架构

### 2.1 整体架构

MyBatis的整体架构分为以下几层：

1. **API接口层**：提供给应用程序调用的接口，如SqlSession接口
2. **数据处理层**：负责SQL的解析、执行和结果映射
3. **基础支撑层**：提供连接管理、事务管理、缓存管理等基础功能

MyBatis的核心组件及其关系如下：

```
应用程序 -> SqlSession -> Executor -> MappedStatement -> SQL执行 -> 结果映射
```

### 2.2 核心组件详解

#### 2.2.1 SqlSessionFactory

SqlSessionFactory是MyBatis的核心接口，负责创建SqlSession实例。SqlSessionFactory通常通过SqlSessionFactoryBuilder来构建，SqlSessionFactoryBuilder读取MyBatis的配置文件，然后创建SqlSessionFactory实例。

**SqlSessionFactory的特点**：
- 线程安全，多个线程可以共享同一个SqlSessionFactory实例
- 一个应用程序通常只需要一个SqlSessionFactory实例
- 负责创建SqlSession实例

**创建SqlSessionFactory的示例**：
```java
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

#### 2.2.2 SqlSession

SqlSession代表与数据库的一次会话，提供了执行SQL、获取映射器等方法。SqlSession是MyBatis与数据库交互的主要接口。

**SqlSession的主要方法**：
- `selectOne(String statement, Object parameter)`：执行查询，返回单个结果
- `selectList(String statement, Object parameter)`：执行查询，返回结果列表
- `insert(String statement, Object parameter)`：执行插入操作
- `update(String statement, Object parameter)`：执行更新操作
- `delete(String statement, Object parameter)`：执行删除操作
- `commit()`：提交事务
- `rollback()`：回滚事务
- `getMapper(Class<T> type)`：获取映射器接口的代理实现
- `close()`：关闭SqlSession

**SqlSession的使用示例**：
```java
try (SqlSession session = sqlSessionFactory.openSession()) {
    // 执行SQL操作
    User user = session.selectOne("com.example.UserMapper.selectUser", 1);
    // 提交事务
    session.commit();
}
```

#### 2.2.3 Executor

Executor是MyBatis的内部核心接口，负责执行SQL语句。SqlSession的方法实际上是通过Executor来执行的。MyBatis提供了多种Executor实现：

- **SimpleExecutor**：默认的Executor实现，每次执行SQL语句都会创建新的Statement
- **ReuseExecutor**：重用Statement的Executor实现
- **BatchExecutor**：支持批量执行SQL语句的Executor实现
- **CachingExecutor**：支持缓存的Executor实现，是其他Executor的装饰器

#### 2.2.4 MappedStatement

MappedStatement代表映射的SQL语句，包含了SQL语句、参数映射、结果映射等信息。MappedStatement是从MyBatis的配置文件或注解中解析出来的。

**MappedStatement的主要属性**：
- `id`：SQL语句的唯一标识符
- `sqlSource`：SQL语句的源对象，负责生成SQL语句
- `parameterMap`：参数映射信息
- `resultMap`：结果映射信息
- `statementType`：SQL语句的类型（STATEMENT、PREPARED、CALLABLE）
- `fetchSize`：获取结果集的行数
- `timeout`：SQL语句的超时时间
- `keyGenerator`：主键生成器

#### 2.2.5 TypeHandler

TypeHandler负责Java类型和JDBC类型之间的转换。MyBatis内置了多种TypeHandler，也支持自定义TypeHandler。

**常用的TypeHandler**：
- `IntegerTypeHandler`：处理Integer类型
- `StringTypeHandler`：处理String类型
- `DateTypeHandler`：处理Date类型
- `BooleanTypeHandler`：处理Boolean类型

**自定义TypeHandler示例**：
```java
public class EnumTypeHandler<E extends Enum<E>> extends BaseTypeHandler<E> {
    private Class<E> type;
    
    public EnumTypeHandler(Class<E> type) {
        this.type = type;
    }
    
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, E parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name());
    }
    
    @Override
    public E getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : Enum.valueOf(type, value);
    }
    
    // 其他方法实现...
}
```

#### 2.2.6 SqlSource

SqlSource负责生成SQL语句，是MappedStatement的重要组成部分。MyBatis提供了多种SqlSource实现：

- **DynamicSqlSource**：处理动态SQL的SqlSource实现
- **RawSqlSource**：处理静态SQL的SqlSource实现
- **ProviderSqlSource**：处理通过Provider注解生成SQL的SqlSource实现
- **StaticSqlSource**：处理预编译SQL的SqlSource实现

## 3. 配置MyBatis

### 3.1 配置文件概述

MyBatis的配置文件主要包括以下几个部分：

- **properties**：属性配置，可以从外部文件加载
- **settings**：MyBatis的全局配置参数
- **typeAliases**：类型别名配置，简化类名的使用
- **typeHandlers**：类型处理器配置
- **objectFactory**：对象工厂配置
- **plugins**：插件配置
- **environments**：环境配置，包含数据源和事务管理器
- **databaseIdProvider**：数据库标识提供者配置
- **mappers**：映射器配置，指定映射文件或接口的位置

### 3.2 核心配置示例

#### 3.2.1 mybatis-config.xml配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 属性配置 -->
    <properties resource="db.properties"/>
    
    <!-- 设置 -->
    <settings>
        <!-- 开启驼峰命名转换 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- 开启二级缓存 -->
        <setting name="cacheEnabled" value="true"/>
        <!-- 日志实现 -->
        <setting name="logImpl" value="LOG4J"/>
    </settings>
    
    <!-- 类型别名 默认为类名首字母小写（如User别名为user） -->
    <typeAliases>
        <package name="com.example.entity"/>
    </typeAliases>
    
    <!-- 类型处理器 -->
    <typeHandlers>
        <typeHandler handler="com.example.handler.EnumTypeHandler"/>
    </typeHandlers>
    
    <!-- 环境配置 -->
    <environments default="development">
        <environment id="development">
            <!-- 事务管理器 -->
            <transactionManager type="JDBC"/>
            <!-- 数据源 -->
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
    
    <!-- 映射器 -->
    <mappers>
        <package name="com.example.mapper"/>
    </mappers>
</configuration>
```

#### 3.2.2 db.properties配置

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mybatis?useSSL=false&serverTimezone=UTC
jdbc.username=root
jdbc.password=123456
```

### 3.3 Spring集成配置

MyBatis可以与Spring框架轻松集成，通过Spring的依赖注入和事务管理功能，简化MyBatis的使用。

#### 3.3.1 Spring XML配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd">
    
    <!-- 加载属性文件 -->
    <context:property-placeholder location="classpath:db.properties"/>
    
    <!-- 数据源配置 -->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="${jdbc.driver}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>
    
    <!-- SqlSessionFactory配置 -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <property name="mapperLocations" value="classpath:mapper/*.xml"/>
        <property name="typeAliasesPackage" value="com.example.entity"/>
    </bean>
    
    <!-- MapperScannerConfigurer配置，自动扫描Mapper接口 -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.example.mapper"/>
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
    </bean>
    
    <!-- 事务管理器配置 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    
    <!-- 开启事务注解驱动 -->
    <tx:annotation-driven transaction-manager="transactionManager"/>
</beans>
```

#### 3.3.2 Spring Boot配置

在Spring Boot中，MyBatis的配置更加简化，可以通过application.properties或application.yml文件进行配置。

**application.properties配置**：
```properties
# 数据库配置
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=123456

# MyBatis配置
mybatis.config-location=classpath:mybatis-config.xml
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.entity

# 日志配置
logging.level.com.example.mapper=debug
```

**Spring Boot主类配置**：
```java
@SpringBootApplication
@MapperScan("com.example.mapper") // 扫描Mapper接口
public class MyBatisApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyBatisApplication.class, args);
    }
}
```

## 4. 映射器（Mapper）

### 4.1 映射器概述

映射器是MyBatis中最重要的组件之一，它定义了数据库操作的接口，MyBatis会为这些接口创建动态代理实现。映射器可以通过XML文件或注解来配置SQL语句和映射规则。

### 4.2 XML映射器

XML映射器是MyBatis中最常用的映射方式，它将SQL语句和映射规则定义在XML文件中。

#### 4.2.1 XML映射器的基本结构

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!-- namespace指定Mapper接口的全限定名 -->
<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 结果映射定义 -->
    <resultMap id="userResultMap" type="User">
        <id property="id" column="id"/>
        <result property="username" column="username"/>
        <result property="password" column="password"/>
        <result property="email" column="email"/>
        <result property="createTime" column="create_time"/>
    </resultMap>
    
    <!-- 查询语句 -->
    <select id="selectUserById" resultMap="userResultMap">
        SELECT * FROM users WHERE id = #{id}
    </select>
    
    <!-- 插入语句 -->
    <insert id="insertUser" parameterType="User">
        INSERT INTO users (username, password, email, create_time)
        VALUES (#{username}, #{password}, #{email}, #{createTime})
    </insert>
    
    <!-- 更新语句 -->
    <update id="updateUser" parameterType="User">
        UPDATE users
        SET username = #{username},
            password = #{password},
            email = #{email}
        WHERE id = #{id}
    </update>
    
    <!-- 删除语句 -->
    <delete id="deleteUserById">
        DELETE FROM users WHERE id = #{id}
    </delete>
</mapper>
```

#### 4.2.2 Mapper接口定义

```java
public interface UserMapper {
    // 根据ID查询用户
    User selectUserById(Integer id);
    
    // 查询所有用户
    List<User> selectAllUsers();
    
    // 插入用户
    int insertUser(User user);
    
    // 更新用户
    int updateUser(User user);
    
    // 根据ID删除用户
    int deleteUserById(Integer id);
}
```

#### 4.2.3 User实体类定义
使用`@Alias`注解自定义别名：如果你不希望使用默认的类名首字母小写作为别名，可以在你的实体类上使用`@Alias`注解来指定一个自定义的别名。
```java
@Alias("User")
public class User {
    // ...
}
```

### 4.3 注解映射器

MyBatis也支持使用注解来配置映射器，将SQL语句直接写在接口方法的注解中。

```java
public interface UserMapper {
    // 根据ID查询用户
    @Select("SELECT * FROM users WHERE id = #{id}")
    User selectUserById(Integer id);
    
    // 查询所有用户
    @Select("SELECT * FROM users")
    List<User> selectAllUsers();
    
    // 插入用户
    @Insert("INSERT INTO users (username, password, email, create_time) VALUES (#{username}, #{password}, #{email}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertUser(User user);
    
    // 更新用户
    @Update("UPDATE users SET username = #{username}, password = #{password}, email = #{email} WHERE id = #{id}")
    int updateUser(User user);
    
    // 根据ID删除用户
    @Delete("DELETE FROM users WHERE id = #{id}")
    int deleteUserById(Integer id);
}
```

### 4.4 结果映射

结果映射是MyBatis中非常重要的功能，它负责将SQL查询结果映射到Java对象。

#### 4.4.1 简单结果映射

对于简单的情况，MyBatis可以自动映射结果，只需要确保Java对象的属性名与数据库表的列名一致，或者通过配置开启驼峰命名转换。

```xml
<!-- 开启驼峰命名转换 -->
<setting name="mapUnderscoreToCamelCase" value="true"/>

<!-- 简单结果映射 -->
<select id="selectUserById" resultType="User">
    SELECT * FROM users WHERE id = #{id}
</select>
```

#### 4.4.2 复杂结果映射

对于复杂的映射关系，如一对一、一对多、多对多等，可以使用resultMap来定义映射规则。

**一对一映射示例**：

```xml
<resultMap id="orderResultMap" type="Order">
    <id property="id" column="id"/>
    <result property="orderNo" column="order_no"/>
    <result property="totalAmount" column="total_amount"/>
    <result property="createTime" column="create_time"/>
    <!-- 一对一关联映射 -->
    <association property="user" javaType="User">
        <id property="id" column="user_id"/>
        <result property="username" column="username"/>
        <result property="email" column="email"/>
    </association>
</resultMap>

<select id="selectOrderById" resultMap="orderResultMap">
    SELECT o.*, u.username, u.email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = #{id}
</select>
```

**一对多映射示例**：

```xml
<resultMap id="userWithOrdersResultMap" type="User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <result property="email" column="email"/>
    <!-- 一对多关联映射 -->
    <collection property="orders" ofType="Order">
        <id property="id" column="order_id"/>
        <result property="orderNo" column="order_no"/>
        <result property="totalAmount" column="total_amount"/>
        <result property="createTime" column="order_create_time"/>
    </collection>
</resultMap>

<select id="selectUserWithOrders" resultMap="userWithOrdersResultMap">
    SELECT u.*, o.id as order_id, o.order_no, o.total_amount, o.create_time as order_create_time
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id = #{id}
</select>
```

## 5. 动态SQL

### 5.1 动态SQL概述

动态SQL是MyBatis的强大特性之一，它允许根据条件动态生成SQL语句，避免了拼接SQL语句的繁琐和安全问题。MyBatis提供了多种动态SQL标签，可以灵活组合使用。

### 5.2 常用动态SQL标签

#### 5.2.1 if标签

if标签用于条件判断，根据条件决定是否包含某个SQL片段。

```xml
<select id="selectUsers" parameterType="User" resultType="User">
    SELECT * FROM users WHERE 1=1
    <if test="username != null and username != ''">
        AND username LIKE CONCAT('%', #{username}, '%')
    </if>
    <if test="email != null and email != ''">
        AND email = #{email}
    </if>
</select>
```

#### 5.2.2 choose、when、otherwise标签

choose、when、otherwise标签类似于Java中的switch-case语句，用于多条件判断。

```xml
<select id="selectUsersByCondition" parameterType="User" resultType="User">
    SELECT * FROM users WHERE 1=1
    <choose>
        <when test="id != null">
            AND id = #{id}
        </when>
        <when test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </when>
        <otherwise>
            AND create_time &gt; #{createTime}
        </otherwise>
    </choose>
</select>
```

#### 5.2.3 where、set标签

where标签用于处理SQL语句中的WHERE条件，它会自动去除多余的AND或OR关键字。set标签用于处理SQL语句中的SET子句，它会自动去除多余的逗号。

**where标签示例**：
```xml
<select id="selectUsers" parameterType="User" resultType="User">
    SELECT * FROM users
    <where>
        <if test="username != null and username != ''">
            username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="email != null and email != ''">
            AND email = #{email}
        </if>
    </where>
</select>
```

**set标签示例**：
```xml
<update id="updateUser" parameterType="User">
    UPDATE users
    <set>
        <if test="username != null and username != ''">
            username = #{username},
        </if>
        <if test="password != null and password != ''">
            password = #{password},
        </if>
        <if test="email != null and email != ''">
            email = #{email}
        </if>
    </set>
    WHERE id = #{id}
</update>
```

#### 5.2.4 foreach标签

foreach标签用于遍历集合，生成IN条件或批量操作的SQL语句。

**IN条件示例**：
```xml
<select id="selectUsersByIds" parameterType="java.util.List" resultType="User">
    SELECT * FROM users WHERE id IN
    <foreach collection="list" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

**批量插入示例**：
```xml
<insert id="batchInsertUsers" parameterType="java.util.List">
    INSERT INTO users (username, password, email, create_time)
    VALUES
    <foreach collection="list" item="user" separator=",">
        (#{user.username}, #{user.password}, #{user.email}, #{user.createTime})
    </foreach>
</insert>
```

#### 5.2.5 trim标签

trim标签是一个更灵活的格式化标签，可以自定义前缀、后缀，以及需要去除的多余字符。

```xml
<select id="selectUsers" parameterType="User" resultType="User">
    SELECT * FROM users
    <trim prefix="WHERE" prefixOverrides="AND |OR ">
        <if test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="email != null and email != ''">
            AND email = #{email}
        </if>
    </trim>
</select>
```

### 5.3 动态SQL最佳实践

- **合理使用动态SQL标签**：根据实际需求选择合适的动态SQL标签
- **避免过于复杂的动态SQL**：过于复杂的动态SQL会降低可读性和维护性
- **使用SQL片段**：将重复的SQL片段抽取出来，提高复用性
- **注意参数类型**：确保传入的参数类型与动态SQL中的测试条件匹配
- **使用OGNL表达式**：熟悉OGNL表达式的语法，正确编写条件判断

## 6. 参数处理

### 6.1 参数传递方式

MyBatis支持多种参数传递方式，包括基本类型、POJO、Map、List等。

#### 6.1.1 单个参数

当只有一个参数时，MyBatis可以直接使用参数名或任意名称来引用参数。

```java
// Mapper接口
User selectUserById(Integer id);

// XML映射器
<select id="selectUserById" resultType="User">
    SELECT * FROM users WHERE id = #{id}
</select>
```

#### 6.1.2 多个参数

当有多个参数时，MyBatis默认会将参数封装为Map，键为param1、param2...或者使用@Param注解指定参数名。

**使用param1、param2...引用参数**：
```java
// Mapper接口
User selectUserByUsernameAndPassword(String username, String password);

// XML映射器
<select id="selectUserByUsernameAndPassword" resultType="User">
    SELECT * FROM users WHERE username = #{param1} AND password = #{param2}
</select>
```

**使用@Param注解**：
```java
// Mapper接口
User selectUserByUsernameAndPassword(@Param("username") String username, @Param("password") String password);

// XML映射器
<select id="selectUserByUsernameAndPassword" resultType="User">
    SELECT * FROM users WHERE username = #{username} AND password = #{password}
</select>
```

#### 6.1.3 POJO参数

当参数较多时，可以将参数封装为POJO对象，MyBatis会自动映射POJO的属性到SQL语句的参数中。

```java
// User类
public class User {
    private Integer id;
    private String username;
    private String password;
    private String email;
    // getter和setter方法...
}

// Mapper接口
int updateUser(User user);

// XML映射器
<update id="updateUser" parameterType="User">
    UPDATE users SET username = #{username}, password = #{password}, email = #{email} WHERE id = #{id}
</update>
```

#### 6.1.4 Map参数

也可以使用Map来传递参数，MyBatis会根据Map的键来引用参数值。

```java
// Mapper接口
List<User> selectUsersByMap(Map<String, Object> map);

// XML映射器
<select id="selectUsersByMap" parameterType="java.util.Map" resultType="User">
    SELECT * FROM users WHERE username LIKE CONCAT('%', #{username}, '%') AND age > #{age}
</select>

// 使用示例
Map<String, Object> map = new HashMap<>();
map.put("username", "admin");
map.put("age", 18);
List<User> users = userMapper.selectUsersByMap(map);
```

#### 6.1.5 List参数

List参数通常用于批量操作或生成IN条件。

```java
// Mapper接口
List<User> selectUsersByIds(List<Integer> ids);

// XML映射器
<select id="selectUsersByIds" parameterType="java.util.List" resultType="User">
    SELECT * FROM users WHERE id IN
    <foreach collection="list" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

### 6.2 参数类型处理

MyBatis会自动处理Java类型和JDBC类型之间的转换，但在某些情况下，可能需要明确指定参数的JDBC类型。

```xml
<insert id="insertUser" parameterType="User">
    INSERT INTO users (username, password, email, create_time)
    VALUES (#{username, jdbcType=VARCHAR}, #{password, jdbcType=VARCHAR}, 
            #{email, jdbcType=VARCHAR}, #{createTime, jdbcType=TIMESTAMP})
</insert>
```

### 6.3 特殊字符处理

在SQL语句中，有些特殊字符（如<、>、&等）需要进行转义，或者使用CDATA区段来包含这些字符。

**使用转义字符**：
```xml
<select id="selectUsersByCreateTime" parameterType="java.util.Date" resultType="User">
    SELECT * FROM users WHERE create_time &gt; #{createTime}
</select>
```

**使用CDATA区段**：
```xml
<select id="selectUsersByCreateTime" parameterType="java.util.Date" resultType="User">
    <![CDATA[
        SELECT * FROM users WHERE create_time > #{createTime}
    ]]>
</select>
```

## 7. 缓存机制

### 7.1 缓存概述

MyBatis提供了两级缓存机制，用于提高查询性能：

- **一级缓存**：SqlSession级别的缓存，默认开启，同一个SqlSession内的查询会共享缓存
- **二级缓存**：Mapper级别的缓存，默认关闭，需要手动开启，可以在多个SqlSession之间共享

### 7.2 一级缓存

一级缓存是SqlSession级别的缓存，每个SqlSession都有自己的缓存区域。当在同一个SqlSession中执行相同的查询时，MyBatis会先从缓存中获取结果，如果缓存中没有，才会执行SQL查询。

**一级缓存的特点**：
- 默认开启，不需要额外配置
- 作用域是SqlSession，不同的SqlSession之间的缓存相互独立
- 当执行增删改操作或调用SqlSession的clearCache()方法时，一级缓存会被清空
- 当SqlSession关闭时，一级缓存也会被清空

**一级缓存示例**：
```java
try (SqlSession session = sqlSessionFactory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    
    // 第一次查询，从数据库获取数据
    User user1 = mapper.selectUserById(1);
    
    // 第二次查询，从一级缓存获取数据
    User user2 = mapper.selectUserById(1);
    
    // user1和user2是同一个对象
    System.out.println(user1 == user2); // true
    
    // 执行更新操作，清空一级缓存
    mapper.updateUser(user1);
    session.commit();
    
    // 第三次查询，从数据库获取数据
    User user3 = mapper.selectUserById(1);
    
    // user1和user3不是同一个对象
    System.out.println(user1 == user3); // false
}
```

### 7.3 二级缓存

二级缓存是Mapper级别的缓存，多个SqlSession可以共享同一个Mapper的缓存。二级缓存需要手动开启，并且实体类需要实现Serializable接口。

**开启二级缓存的步骤**：
1. 在MyBatis的全局配置文件中开启二级缓存
2. 在映射器XML文件中配置cache标签
3. 确保实体类实现了Serializable接口

**全局配置**：
```xml
<settings>
    <setting name="cacheEnabled" value="true"/>
</settings>
```

**映射器配置**：
```xml
<mapper namespace="com.example.mapper.UserMapper">
    <!-- 配置二级缓存 -->
    <cache/>
    
    <!-- 其他SQL语句... -->
</mapper>
```

**实体类实现Serializable接口**：
```java
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    // 属性和方法...
}
```

**二级缓存示例**：
```java
// 第一个SqlSession
try (SqlSession session1 = sqlSessionFactory.openSession()) {
    UserMapper mapper1 = session1.getMapper(UserMapper.class);
    User user1 = mapper1.selectUserById(1);
    session1.close(); // SqlSession关闭时，数据会被写入二级缓存
}

// 第二个SqlSession
try (SqlSession session2 = sqlSessionFactory.openSession()) {
    UserMapper mapper2 = session2.getMapper(UserMapper.class);
    User user2 = mapper2.selectUserById(1); // 从二级缓存获取数据
}
```

### 7.4 缓存配置参数

cache标签支持多个配置参数，可以根据需求进行调整：

```xml
<cache
    eviction="LRU"  <!-- 缓存淘汰策略：LRU(默认)、FIFO、SOFT、WEAK -->
    flushInterval="60000"  <!-- 缓存刷新间隔，单位毫秒 -->
    size="1024"  <!-- 缓存最多可以存储的对象数量 -->
    readOnly="false"  <!-- 是否只读 -->
/>
```

**缓存淘汰策略**：
- **LRU**（Least Recently Used）：最近最少使用，移除最长时间不被使用的对象
- **FIFO**（First In First Out）：先进先出，按对象进入缓存的顺序移除
- **SOFT**：软引用，基于JVM的垃圾回收机制和软引用规则移除对象
- **WEAK**：弱引用，基于JVM的垃圾回收机制和弱引用规则移除对象

### 7.5 缓存最佳实践

- **合理使用缓存**：根据业务需求和数据特点，决定是否使用缓存
- **注意缓存一致性**：当数据发生变化时，确保缓存被及时更新或清除
- **避免缓存过大**：合理设置缓存大小，避免占用过多内存
- **选择合适的淘汰策略**：根据数据访问模式，选择合适的缓存淘汰策略
- **禁用不需要缓存的查询**：对于频繁变化的数据，可以禁用缓存
- **使用第三方缓存**：对于大型应用，可以集成第三方缓存框架，如Ehcache、Redis等

## 8. 插件开发

### 8.1 插件概述

MyBatis的插件机制允许开发者在不修改MyBatis核心代码的情况下，对MyBatis的执行过程进行拦截和扩展。MyBatis插件可以拦截Executor、StatementHandler、ParameterHandler、ResultSetHandler等核心组件的方法。

### 8.2 插件开发步骤

开发MyBatis插件主要包括以下步骤：

1. 创建插件类，实现Interceptor接口
2. 使用@Intercepts和@Signature注解配置要拦截的方法
3. 在MyBatis配置文件中注册插件

**插件实现示例**：

```java
@Intercepts({
    @Signature(
        type = Executor.class,
        method = "update",
        args = {MappedStatement.class, Object.class}
    )
})
public class LogInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // 获取方法参数
        Object[] args = invocation.getArgs();
        MappedStatement ms = (MappedStatement) args[0];
        Object parameter = args[1];
        
        // 获取SQL语句信息
        String sqlId = ms.getId();
        String sqlCommandType = ms.getSqlCommandType().name();
        
        // 记录日志
        System.out.println("执行SQL: " + sqlId + ", 类型: " + sqlCommandType + ", 参数: " + parameter);
        
        // 执行原方法
        long startTime = System.currentTimeMillis();
        Object result = invocation.proceed();
        long endTime = System.currentTimeMillis();
        
        // 记录执行时间
        System.out.println("SQL执行耗时: " + (endTime - startTime) + "ms");
        
        return result;
    }
    
    @Override
    public Object plugin(Object target) {
        // 使用Plugin.wrap方法生成代理对象
        return Plugin.wrap(target, this);
    }
    
    @Override
    public void setProperties(Properties properties) {
        // 可以通过properties获取插件配置的参数
        String logLevel = properties.getProperty("logLevel", "INFO");
        System.out.println("插件日志级别: " + logLevel);
    }
}
```

**插件注册配置**：

```xml
<configuration>
    <!-- 其他配置... -->
    
    <!-- 插件配置 -->
    <plugins>
        <plugin interceptor="com.example.interceptor.LogInterceptor">
            <property name="logLevel" value="DEBUG"/>
        </plugin>
    </plugins>
    
    <!-- 其他配置... -->
</configuration>
```

### 8.3 常用插件场景

- **SQL执行日志记录**：记录SQL语句的执行情况，便于调试和性能分析
- **分页插件**：实现物理分页功能，简化分页查询
- **数据脱敏**：对敏感数据进行脱敏处理
- **数据权限控制**：根据用户权限过滤查询结果
- **性能监控**：监控SQL执行性能，识别慢查询
- **参数加密/解密**：对敏感参数进行加密存储，查询时解密

### 8.4 插件开发注意事项

- **了解MyBatis的执行流程**：在开发插件前，需要了解MyBatis的执行流程和核心组件
- **注意插件的拦截范围**：避免拦截过多的方法，影响性能
- **避免循环代理**：在plugin方法中，需要判断目标对象是否已经被代理
- **处理好异常**：在intercept方法中，需要正确处理异常，避免影响MyBatis的正常执行
- **注意线程安全**：插件可能被多个线程同时访问，需要确保线程安全
- **测试插件功能**：开发完成后，需要进行充分的测试，确保插件功能正常

## 9. 最佳实践

### 9.1 映射器设计最佳实践

- **合理划分Mapper接口**：根据业务模块划分Mapper接口，保持接口的单一职责
- **使用参数注解**：对于多参数方法，使用@Param注解指定参数名，提高代码可读性
- **合理使用结果映射**：对于复杂的映射关系，使用resultMap定义映射规则
- **避免SQL语句过长**：将复杂的SQL语句拆分为多个简单的SQL语句，或使用存储过程
- **使用SQL片段**：将重复的SQL片段抽取出来，提高复用性

### 9.2 SQL编写最佳实践

- **使用参数占位符**：使用#{}代替${}，避免SQL注入
- **优化SQL语句**：确保SQL语句高效，使用索引，避免全表扫描
- **使用动态SQL**：根据条件动态生成SQL语句，避免拼接SQL
- **注意数据库兼容性**：如果需要支持多种数据库，注意SQL语句的兼容性
- **使用别名**：为表和列使用别名，提高SQL语句的可读性

### 9.3 性能优化最佳实践

- **使用缓存**：合理使用一级缓存和二级缓存，提高查询性能
- **优化连接池**：配置合适的连接池参数，避免连接泄露
- **批量操作**：使用MyBatis的批量操作功能，减少数据库交互次数
- **延迟加载**：对于关联对象，使用延迟加载，减少不必要的查询
- **合理设置fetchSize**：根据查询结果集的大小，设置合适的fetchSize参数
- **使用可重用的SqlSession**：在Web应用中，可以使用ThreadLocal管理SqlSession

### 9.4 事务管理最佳实践

- **使用Spring事务管理**：在Spring环境中，使用Spring的事务管理功能，简化事务处理
- **合理设置事务隔离级别**：根据业务需求，设置合适的事务隔离级别
- **控制事务范围**：尽量缩小事务范围，避免长时间占用数据库连接
- **处理事务异常**：正确处理事务中的异常，确保事务能够正确回滚
- **使用编程式事务或声明式事务**：根据实际需求，选择合适的事务管理方式

### 9.5 安全最佳实践

- **防止SQL注入**：使用#{}参数占位符，避免使用${}或拼接SQL
- **输入验证**：对用户输入进行验证，确保数据的合法性
- **权限控制**：在应用层实现细粒度的权限控制，限制用户的操作范围
- **敏感数据保护**：对敏感数据进行加密存储，查询时解密
- **日志审计**：记录关键操作的日志，便于审计和问题排查

## 10. 实践案例

### 10.1 电商系统用户管理案例

**场景描述**：某电商系统需要实现用户管理功能，包括用户的注册、登录、查询、更新等操作。

**挑战**：
- 用户数据量较大，需要优化查询性能
- 需要支持复杂的查询条件，如按用户名、邮箱、注册时间等条件查询
- 对用户密码等敏感信息需要进行加密处理
- 需要确保数据的一致性和安全性

**解决方案**：
- 使用MyBatis作为持久层框架，实现用户数据的CRUD操作
- 设计合理的Mapper接口和XML映射文件，封装SQL操作
- 使用动态SQL，根据不同的查询条件生成对应的SQL语句
- 对用户密码进行加密存储，使用BCrypt等加密算法
- 配置二级缓存，提高查询性能
- 与Spring集成，使用Spring的事务管理功能

**核心代码示例**：

**User实体类**：
```java
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private Date createTime;
    private Date updateTime;
    
    // getter和setter方法...
}
```

**UserMapper接口**：
```java
public interface UserMapper {
    // 根据ID查询用户
    User selectUserById(Integer id);
    
    // 根据用户名查询用户
    User selectUserByUsername(String username);
    
    // 根据条件查询用户列表
    List<User> selectUsersByCondition(User user);
    
    // 插入用户
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertUser(User user);
    
    // 更新用户
    int updateUser(User user);
    
    // 根据ID删除用户
    int deleteUserById(Integer id);
}
```

**UserMapper.xml映射文件**：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">
    <!-- 配置二级缓存 -->
    <cache/>
    
    <!-- 结果映射 -->
    <resultMap id="userResultMap" type="User">
        <id property="id" column="id"/>
        <result property="username" column="username"/>
        <result property="password" column="password"/>
        <result property="email" column="email"/>
        <result property="phone" column="phone"/>
        <result property="createTime" column="create_time"/>
        <result property="updateTime" column="update_time"/>
    </resultMap>
    
    <!-- 根据ID查询用户 -->
    <select id="selectUserById" resultMap="userResultMap">
        SELECT * FROM users WHERE id = #{id}
    </select>
    
    <!-- 根据用户名查询用户 -->
    <select id="selectUserByUsername" resultMap="userResultMap">
        SELECT * FROM users WHERE username = #{username}
    </select>
    
    <!-- 根据条件查询用户列表 -->
    <select id="selectUsersByCondition" parameterType="User" resultMap="userResultMap">
        SELECT * FROM users
        <where>
            <if test="username != null and username != ''">
                AND username LIKE CONCAT('%', #{username}, '%')
            </if>
            <if test="email != null and email != ''">
                AND email = #{email}
            </if>
            <if test="phone != null and phone != ''">
                AND phone = #{phone}
            </if>
            <if test="createTime != null">
                AND create_time &gt; #{createTime}
            </if>
        </where>
        ORDER BY create_time DESC
    </select>
    
    <!-- 插入用户 -->
    <insert id="insertUser" parameterType="User">
        INSERT INTO users (username, password, email, phone, create_time, update_time)
        VALUES (#{username}, #{password}, #{email}, #{phone}, #{createTime}, #{updateTime})
    </insert>
    
    <!-- 更新用户 -->
    <update id="updateUser" parameterType="User">
        UPDATE users
        <set>
            <if test="username != null and username != ''">
                username = #{username},
            </if>
            <if test="password != null and password != ''">
                password = #{password},
            </if>
            <if test="email != null and email != ''">
                email = #{email},
            </if>
            <if test="phone != null and phone != ''">
                phone = #{phone},
            </if>
            update_time = #{updateTime}
        </set>
        WHERE id = #{id}
    </update>
    
    <!-- 根据ID删除用户 -->
    <delete id="deleteUserById">
        DELETE FROM users WHERE id = #{id}
    </delete>
</mapper>
```

**效果**：系统成功实现了用户管理功能，支持复杂的查询条件，查询性能良好，数据安全得到保障。

### 10.2 金融系统交易记录查询案例

**场景描述**：某金融系统需要实现交易记录的查询功能，支持按时间范围、交易类型、金额范围等多种条件查询。

**挑战**：
- 交易数据量巨大，每天产生数百万条交易记录
- 查询条件复杂，需要支持多维度的组合查询
- 查询性能要求高，响应时间需要控制在毫秒级
- 需要支持分页查询

**解决方案**：
- 使用MyBatis作为持久层框架，实现交易记录的查询功能
- 设计合理的索引，优化查询性能
- 使用动态SQL，根据不同的查询条件生成最优的SQL语句
- 配置二级缓存，缓存常用的查询结果
- 集成分页插件，简化分页查询
- 使用存储过程处理复杂的统计查询

**效果**：系统成功实现了交易记录的高效查询，支持多维度的组合查询，查询响应时间控制在毫秒级，满足了业务需求。

### 10.3 物流系统订单跟踪案例

**场景描述**：某物流系统需要实现订单跟踪功能，记录订单的每一个状态变化，并支持按订单号、时间范围、状态等条件查询订单轨迹。

**挑战**：
- 订单轨迹数据量大，每个订单可能有多个状态变化记录
- 需要支持按订单号、时间范围、状态等多条件组合查询
- 查询性能要求高，需要快速返回查询结果
- 数据需要实时更新和查询

**解决方案**：
- 使用MyBatis作为持久层框架，实现订单轨迹的CRUD操作
- 设计合理的数据库表结构，优化查询性能
- 使用动态SQL，根据不同的查询条件生成对应的SQL语句
- 对常用查询字段建立索引
- 与Spring集成，使用Spring的事务管理功能
- 实现订单轨迹的实时更新和查询

**效果**：系统成功实现了订单跟踪功能，支持多条件组合查询，查询性能良好，满足了业务需求。

## 11. 发展趋势

### 11.1 云原生支持

随着云原生技术的发展，MyBatis也在加强对云环境的支持：

- 提供与云数据库的集成，如RDS、云原生数据库等
- 支持容器化部署，提供Docker镜像
- 支持在Kubernetes环境中运行和管理
- 提供与Serverless架构的集成方案

### 11.2 性能优化

MyBatis持续优化性能，提高系统的吞吐量和响应速度：

- 优化SQL解析和执行过程
- 改进缓存机制，提高缓存命中率
- 优化连接池管理，减少连接创建和销毁的开销
- 提供更高效的批量操作支持
- 优化内存使用，减少GC压力

### 11.3 功能增强

MyBatis不断增强功能，提供更多的便利特性：

- 增强动态SQL功能，提供更多的动态SQL标签
- 提供更丰富的映射功能，支持复杂的数据映射关系
- 增强插件机制，提供更多的扩展点
- 提供更完善的类型处理支持
- 增强与其他框架的集成，如Spring Boot、Quarkus等

### 11.4 安全性增强

随着数据安全越来越受到重视，MyBatis不断加强安全特性：

- 提供更强大的SQL注入防护机制
- 增强数据加密和传输安全
- 提供更细粒度的访问控制
- 支持审计日志，记录所有操作
- 符合更多行业的安全合规要求

### 11.5 生态完善

MyBatis的生态系统不断完善，提供更多的工具和组件：

- 提供官方的代码生成工具MyBatis Generator
- 提供官方的分页插件MyBatis PageHelper
- 提供更多的第三方插件和扩展
- 提供更完善的文档和示例
- 活跃的社区支持和贡献