# Visual Studio Code 详细指南

Visual Studio Code（VS Code）是微软开发的轻量级、高性能的代码编辑器，通过安装插件可以支持Java开发。它以其启动速度快、占用资源少、功能强大和扩展性强而受到开发者的广泛欢迎。

## 常用快捷键

### 编辑操作

| 快捷键 | 功能描述 |
|--------|---------|
| `Ctrl + Space` | 智能代码补全 |
| `Ctrl + Shift + Space` | 参数信息提示 |
| `Alt + Shift + F` | 格式化代码 |
| `Ctrl + H` | 替换 |
| `Ctrl + Shift + F` | 全局搜索 |
| `Ctrl + Shift + H` | 全局替换 |
| `F8` | 跳转到下一个错误或警告 |
| `Shift + F8` | 跳转到上一个错误或警告 |
| `Ctrl + .` | 快速修复/代码操作 |
| `Alt + ↑/↓` | 上下移动当前行 |
| `Shift + Alt + ↑/↓` | 复制当前行到上/下 |
| `Ctrl + X` | 剪切当前行 |
| `Ctrl + /` | 注释/取消注释当前行 |

### 导航操作

| 快捷键 | 功能描述 |
|--------|---------|
| `Ctrl + P` | 快速打开文件 |
| `Ctrl + G` | 跳转到指定行 |
| `F12` | 跳转到定义 |
| `Alt + F12` | 查看定义（不跳转） |
| `Ctrl + Shift + O` | 跳转到符号 |
| `Ctrl + Tab` | 切换到下一个打开的文件 |
| `Ctrl + B` | 显示/隐藏侧边栏 |
| `Ctrl + Backtick` | 显示/隐藏终端 |

### 运行和调试

| 快捷键 | 功能描述 |
|--------|---------|
| `F5` | 开始调试 |
| `Ctrl + F5` | 运行不调试 |
| `F10` | 单步跳过 |
| `F11` | 单步进入 |
| `Shift + F11` | 单步跳出 |
| `Shift + F5` | 停止调试 |
| `Ctrl + Shift + D` | 打开调试视图 |
| `F9` | 切换断点 |

### 窗口和面板

| 快捷键 | 功能描述 |
|--------|---------|
| `Ctrl + N` | 新建文件 |
| `Ctrl + W` | 关闭当前文件 |
| `Ctrl + Shift + W` | 关闭所有文件 |
| `Ctrl + ,` | 打开设置 |
| `Ctrl + Shift + P` | 打开命令面板 |
| `Ctrl + \` | 分割编辑器 |
| `Ctrl + 1/2/3` | 切换到指定编辑器组 |

## 推荐插件

### Java开发必备插件

- **Extension Pack for Java**：提供Java开发的核心功能，包括代码补全、调试、重构等
- **Spring Boot Extension Pack**：Spring Boot开发的增强功能，包括自动完成、代码片段、验证等
- **Maven for Java**：Maven构建工具的支持，包括pom.xml编辑辅助、依赖管理等
- **Gradle for Java**：Gradle构建工具的支持
- **Debugger for Java**：Java调试功能
- **Test Runner for Java**：Java测试运行功能

### 效率提升插件

- **GitLens**：增强Git集成功能，显示代码作者、提交信息等
- **Bracket Pair Colorizer**：为括号添加不同颜色，提高代码可读性
- **Path Intellisense**：文件路径自动补全
- **Live Server**：本地开发服务器，支持热重载
- **Todo Tree**：TODO注释导航和管理
- **Better Comments**：增强注释功能，支持不同类型的注释高亮

### 代码质量插件

- **SonarLint**：实时代码质量分析
- **CheckStyle for Java**：Java代码风格检查
- **PMD for Java**：Java代码静态分析
- **Error Lens**：将错误和警告直接显示在代码行旁边
- **Code Spell Checker**：代码拼写检查

### 主题和外观插件

- **Material Theme**：Material Design风格的主题
- **One Dark Pro**：Atom风格的深色主题
- **Dracula Official**：Dracula风格的主题
- **Fira Code**：支持连字功能的等宽字体
- **VSCode Icons**：增强文件和文件夹图标

## 最佳实践

### 编辑器配置

1. **设置主题**：选择适合长时间编程的主题，推荐使用深色主题减少眼部疲劳
2. **配置字体**：选择等宽字体，如Fira Code（支持连字功能）
3. **调整字体大小和行高**：根据个人偏好和屏幕分辨率调整
4. **配置文件关联**：确保Java文件使用正确的语法高亮和编辑器配置
5. **设置自动保存**：配置编辑器自动保存文件，避免意外丢失更改

### 工作区优化

1. **使用多根工作区**：在一个窗口中管理多个相关项目
2. **使用工作区设置**：为不同项目配置特定的设置
3. **使用搜索功能**：利用强大的搜索功能快速查找文件、符号和代码片段
4. **使用代码片段**：创建和使用自定义代码片段，提高编码速度
5. **使用任务管理**：配置自定义任务，自动化重复操作

### Java开发技巧

1. **配置JDK**：确保正确设置JDK路径和版本
2. **配置构建工具**：正确配置Maven或Gradle，以便能够编译和构建项目
3. **使用代码格式化**：配置和使用Java代码格式化规则，保持代码风格一致性
4. **使用代码分析**：利用内置的代码分析工具发现潜在问题
5. **使用调试工具**：熟悉和使用调试工具，提高问题排查效率

### 性能优化

1. **关闭不必要的插件**：只启用必要的插件，减少资源占用
2. **配置文件排除**：排除大型二进制文件和生成文件，提高搜索和索引性能
3. **清理工作区**：定期清理未使用的文件和项目
4. **调整内存分配**：根据需要调整VSCode的内存分配

### 自定义配置

1. **自定义快捷键**：根据个人习惯修改快捷键配置
2. **自定义代码模板**：创建符合个人或团队编码规范的代码模板
3. **自定义用户片段**：创建常用代码块的用户片段
4. **创建工作区配置**：为不同类型的项目创建和保存特定的工作区配置

## Emmet在VSCode中的使用

VSCode内置了对Emmet的支持，可以直接使用Emmet语法来快速编写HTML和CSS代码。

### 基本使用方法

1. **输入Emmet缩写**：在HTML或CSS文件中输入Emmet缩写表达式
2. **展开缩写**：按下`Tab`键或`Enter`键展开缩写
3. **示例**：输入`div>p*3`，然后按下`Tab`键，将展开为嵌套的div和三个p标签（HTML标签将显示为`&lt;div&gt;&lt;p&gt;&lt;/p&gt;&lt;p&gt;&lt;/p&gt;&lt;p&gt;&lt;/p&gt;&lt;/div&gt;`）

### VSCode中Emmet的特殊功能

#### 1. 快速生成HTML结构

- **生成完整HTML文档**：输入`!`然后按`Tab`，生成标准HTML5模板（HTML标签将显示为实体编码形式，如`&lt;!DOCTYPE html&gt;`等）
- **生成带lang属性的HTML**：输入`!+lang:zh-CN`然后按`Tab`，生成中文HTML文档（HTML标签将显示为实体编码形式）

#### 2. 代码片段选择器

- 当展开的结果有多个选项时，VSCode会显示选择器让你选择所需的结果
- 按下`Ctrl+Space`可以在输入过程中显示可用的Emmet建议

#### 3. Emmet的CSS支持

- 在CSS文件中输入CSS缩写后按`Tab`键展开
- 示例：输入`w100+p20+m10`，展开为三个CSS属性声明

#### 4. 在不同文件类型中使用Emmet

VSCode允许在JavaScript、TypeScript等文件中使用Emmet缩写，需要通过设置启用：

1. 打开设置（`Ctrl+,`）
2. 搜索"emmet include languages"
3. 点击"添加项"，在"项"中输入文件类型（如`javascript`），在"值"中输入`html`

#### 5. 自定义Emmet配置

VSCode允许自定义Emmet的行为：

1. 打开设置（`Ctrl+,`）
2. 搜索"emmet"
3. 可以配置以下选项：
   - `Emmet: Trigger Expansion On Tab`：是否在按Tab键时展开Emmet缩写
   - `Emmet: Show Suggestions As Snippets`：是否将Emmet建议显示为代码片段
   - `Emmet: Preferences`：自定义Emmet首选项

#### 6. 高级Emmet功能

- **快速包装代码**：选中要包装的代码，按下`Ctrl+Shift+P`，输入"Emmet: Wrap with Abbreviation"，然后输入包装的缩写
- **使用Emmet的缩写预览**：启用`Emmet: Show Abbreviation Suggestions`设置，可以预览Emmet缩写的展开结果

### 实用Emmet技巧在VSCode中

1. **快速创建列表**：输入`ul>li*5{item $}`然后按`Tab`，生成5个带编号的列表项（HTML标签将显示为`&lt;ul&gt;&lt;li&gt;item 1&lt;/li&gt;...&lt;/ul&gt;`形式）
2. **创建表格**：输入`table>thead>tr>th*3{Header $}^tbody>tr*2>td*3{$}`然后按`Tab`，生成一个3列2行的表格（HTML标签将显示为实体编码形式）
3. **生成响应式布局**：输入`div.container>div.row>div.col-md-6*2`然后按`Tab`，生成Bootstrap风格的响应式布局（HTML标签将显示为实体编码形式）
4. **快速创建表单**：输入`form>div.form-group*3>label{${label $}}+input[type="text" name="field$" placeholder="请输入${label $}"]`然后按`Tab`，生成表单组（HTML标签将显示为实体编码形式）

通过结合VSCode强大的编辑功能和Emmet的高效语法，可以显著提高前端开发的效率。掌握Emmet在VSCode中的使用方法，可以让你的编码速度提升数倍。

> 注意：详细的Emmet语法规则，请参考[Emmet语法详解](./emmet.md)文档。

VSCode作为一个轻量级但功能强大的代码编辑器，通过插件系统可以成为一个高效的Java开发环境。通过合理配置和使用VSCode的功能和插件，可以显著提高Java开发的效率和质量。