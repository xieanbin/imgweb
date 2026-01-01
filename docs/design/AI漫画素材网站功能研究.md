# **漫画与创意素材平台的A2UI架构演进：基于React/Next.js的生成式UI深度研究报告**

## **1\. 执行摘要与战略背景**

### **1.1 生成式AI时代的交互范式转移**

在人工智能技术迅猛发展的当下，内容创作平台正经历着从“搜索-下载-编辑”的传统工作流向“意图-生成-交互”的智能化工作流转变。对于拥有百万级漫画素材储备的平台而言，用户的核心痛点已不再是素材的匮乏，而是如何在海量资源中快速定位、组合并构建出符合叙事逻辑的画面。用户提出的需求——“基于一句话自动找出相关素材并按剧情脚本排列”——实质上是对\*\*生成式用户界面（Generative UI, GenUI）\*\*的终极构想。

Google推出的**A2UI (Agent-to-User Interface)** 协议，作为一种新兴的“代理-用户界面”标准，为解决这一复杂工程问题提供了理论基础和技术路径 1。A2UI的核心理念在于打破传统UI的静态束缚，允许后端AI代理（Agent）通过标准化的JSON协议，“指挥”前端渲染出动态、交互式的界面组件，而非仅仅输出文本或代码片段 3。

### **1.2 本报告的研究范围与目标**

本报告将深入剖析如何在一个基于**React \+ Next.js**技术栈、集成**Stable Diffusion (SD)**、**即梦（Jimeng）及Sora**等多模态模型的百万级素材平台上，落地A2UI架构。我们将不仅限于A2UI协议本身的解读，更将重点探讨其在漫画创作垂类场景下的工程实现，包括：

1. **React渲染器的定制开发**：鉴于A2UI目前仅官方支持Lit、Angular和Flutter，我们将详细设计适用于React/Next.js环境的渲染引擎 2。
2. **百万级素材的RAG（检索增强生成）集成**：探讨如何将向量检索与A2UI的组件生成逻辑解耦与融合。
3. **多模态模型的编排**：设计一套机制，使A2UI能够根据脚本需求，动态调度SD（图像生成）、即梦（中文语境优化生成）或Sora（视频流生成），并将其封装为统一的UI组件。
4. **剧情脚本的布局算法**：研究如何利用大语言模型（LLM）的空间推理能力，生成符合漫画叙事逻辑的分镜布局（Layout）。

本报告旨在为技术决策者、系统架构师及高级开发人员提供一份详尽的实施蓝图，字数规模约15,000字，涵盖架构设计、协议规范、安全模型及未来演进策略。

## ---

**2\. A2UI协议深度解析：为代理赋予UI话语权**

### **2.1 传统UI在Agent场景下的局限性**

在A2UI出现之前，将AI集成到Web应用中通常有两种路径：

1. **文本流（Chat UX）**：AI输出文本或Markdown。对于漫画创作这种高度视觉化、结构化的任务，文本描述（如“左上角放一张城堡图”）无法转化为直观的操作界面，用户体验割裂。
2. **代码生成（Code Generation）**：AI直接输出HTML/JSX代码（如Vercel v0）。这种方式在生产环境中存在巨大的安全隐患（XSS攻击、UI注入）和风格一致性问题。AI生成的代码往往难以复用宿主应用的组件库，导致视觉风格混乱 3。

A2UI通过引入“**UI即数据（UI as Data）**”的哲学，从根本上解决了上述矛盾。它不传输可执行代码，而是传输描述界面的**声明式JSON数据** 2。

### **2.2 A2UI的核心架构与组件模型**

#### **2.2.1 协议分层模型**

A2UI并非单一的技术，而是一套分层协议栈。在我们的漫画平台架构中，其位置如下表所示：

| 层次                            | 技术组件                | 职责描述                                                         |
| :------------------------------ | :---------------------- | :--------------------------------------------------------------- |
| **应用层 (Application)**  | React / Next.js Client  | 负责最终的像素渲染、用户交互事件捕获及组件注册表维护。           |
| **表现层 (Presentation)** | **A2UI Protocol** | 定义组件树结构、属性绑定、布局逻辑的JSON Schema 3。              |
| **会话层 (Session)**      | A2A / AG-UI Protocol    | 管理Agent与Client之间的长连接（SSE/WebSocket），处理状态同步 6。 |
| **智能层 (Intelligence)** | Gemini / GPT-4o / RAG   | 负责意图理解、脚本拆解、素材检索决策及布局生成。                 |

#### **2.2.2 安全模型：信任阶梯（Trust Ladder）**

A2UI最引人注目的特性是其“安全优先”的设计理念。在拥有百万素材的商业系统中，安全性至关重要。A2UI采用**白名单机制**，客户端维护一个“受信任组件目录（Catalog）” 7。

* **机制**：Agent只能请求渲染目录中存在的组件（如ComicPanel, AssetCard）。如果Agent试图渲染一个不存在的\<MaliciousScript /\>，渲染器将直接忽略或报错。
* **优势**：这构建了一个“信任阶梯”。开发者可以放心地让Agent控制UI布局，因为原子组件的行为是确定且受控的。对于涉及版权素材和模型调用的平台，这种隔离确保了AI无法绕过权限系统直接访问敏感数据 2。

#### **2.2.3 扁平化数据流与LLM友好性**

传统的DOM树是深层嵌套的，而LLM在生成深层嵌套JSON时容易出现括号不匹配的幻觉问题。A2UI针对此进行了优化，推荐使用**扁平化的组件列表**配合ID引用 2。

JSON

// 典型的A2UI扁平化载荷示例
{
  "surfaceUpdate": {
    "surfaceId": "main-canvas",
    "components":\[
    { "id": "root", "type": "Column", "children":\["header", "grid-container"\] },
    { "id": "header", "type": "Text", "props": { "text": "生成的漫画草稿" } },
    { "id": "grid-container", "type": "Grid", "children":\["panel-1", "panel-2"\] }
    \]
  }
}

这种结构不仅利于LLM生成，还支持**增量流式更新（Progressive Rendering）**。在漫画生成的场景中，Agent可以先发送布局骨架，随后在后台慢慢生成图片URL，并通过dataModelUpdate异步填充，极大地提升了首屏响应速度 8。

## ---

**3\. 架构蓝图：React \+ Next.js 环境下的A2UI集成**

鉴于Google目前尚未发布官方的React渲染器 2，本章节将详细阐述如何自行构建这一核心组件。这是实现“一句话生成漫画”功能的工程基石。

### **3.1 渲染器（Renderer）核心设计模式**

#### **3.1.1 智能包装器（Smart Wrappers）与注册表模式**

为了将React组件生态（如Shadcn/UI, Material UI）接入A2UI，我们需要实现**注册表模式（Registry Pattern）**。这相当于在A2UI的抽象协议与Next.js的具体实现之间建立一座桥梁 2。

我们需要定义一个ComponentRegistry对象，将A2UI协议中的type字段映射到具体的React组件：

TypeScript

// src/a2ui/registry.ts
import { ComicPanel } from '@/components/comic/Panel';
import { AssetGrid } from '@/components/asset/Grid';
import { VideoPlayer } from '@/components/media/SoraPlayer';

export const ComponentRegistry: Record\<string, React.ComponentType\<any\>\> \= {
  // 基础布局组件
  'container': ({ children, style }) \=\> \<div className={style}\>{children}\</div\>,
  'column': ({ children }) \=\> \<div className="flex flex-col gap-4"\>{children}\</div\>,
  'row': ({ children }) \=\> \<div className="flex flex-row gap-4"\>{children}\</div\>,

  // 漫画领域特定组件 (Domain Specific Components)
  'comic-panel': ComicPanel,      // 负责展示单格漫画
  'speech-bubble': SpeechBubble,  // 负责展示对话气泡
  'asset-card': AssetCard,        // 负责展示素材搜索结果
  'video-frame': VideoPlayer,     // 负责展示Sora生成的视频
};

这种设计使得我们能够随时扩展系统的能力。例如，当接入即梦（Jimeng）模型生成中文艺术字时，只需注册一个'calligraphy-text': JimengTextComponent，后端Agent即可立即调用，而无需修改核心渲染逻辑 9。

#### **3.1.2 递归渲染引擎与状态管理**

渲染器组件A2UIRenderer必须是一个**客户端组件（Client Component）**，因为它需要处理实时的WebSocket流和用户交互 10。

其核心逻辑如下：

1. **流式解析**：监听A2A/AG-UI传输的JSONL流，实时解析surfaceUpdate和dataModelUpdate消息。
2. **状态归并**：使用React的useReducer或Zustand，将扁平化的组件列表重组为虚拟DOM树。
3. **递归渲染**：从root组件开始，根据ID查找组件定义，从dataModel中获取数据属性，并递归渲染其子组件。

TypeScript

// 概念性代码：递归渲染组件
const RecursiveComponent \= ({ id, componentMap, dataModel }) \=\> {
  const componentDef \= componentMap.get(id);
  if (\!componentDef) return null;

  const Component \= ComponentRegistry;
  const props \= resolveDataBindings(componentDef.props, dataModel); // 解析数据绑定

  return (
    \<Component {...props}\>
    {componentDef.children?.map(childId\=\> (
    \<RecursiveComponent key={childId} id={childId} componentMap={componentMap} dataModel={dataModel} /\>
    ))}
    \</Component\>
  );
};

### **3.2 Next.js App Router (RSC) 的整合策略**

Next.js 14/15引入的App Router架构对服务端渲染（SSR）有严格要求。A2UI天然契合\*\*服务端驱动UI（SDUI）\*\*的理念，但在实现上需要注意服务端组件（RSC）与客户端组件的边界。

* **页面骨架（Server Side）**：漫画编辑器的外壳（导航栏、工具栏、侧边栏）应由RSC静态渲染，保证SEO和首屏加载速度。
* **生成画布（Client Side）**：中心的“创作画布”区域应包裹在\<A2UIProvider\>中。这是一个“客户端岛屿（Client Island）”，专门负责渲染Agent推送的动态UI 10。

**数据流向设计**：

1. 用户在Client Component的输入框输入：“英雄在燃烧的城堡前战斗”。
2. 通过**Server Action**将请求发送至后端Agent。
3. 后端Agent处理后，将A2UI JSON流写回HTTP Response。
4. 前端利用fetch的ReadableStream接口读取数据，驱动A2UIRenderer进行增量渲染。

### **3.3 样式系统与Tailwind CSS的结合**

A2UI协议允许传递styles对象 11。为了避免Agent生成不可控的内联样式，最佳实践是传递**语义化的样式Token**，而非原始CSS值。

在Next.js项目中，我们可以结合Tailwind CSS实现样式的动态映射：

* Agent发送：style: { variant: "destructive", size: "lg" }
* Smart Wrapper映射：\<Button className="bg-red-500 hover:bg-red-600 px-8 py-3" /\>

对于漫画布局（Grid Layout），Agent可以发送具体的行列配置：

* Agent发送：layout: { type: "grid", columns: "1fr 2fr", gap: "10px" }
* 渲染器映射：style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}
  这使得LLM能够像导演一样，通过自然语言精确控制分镜的大小和排列 12。

## ---

**4\. “漫画导演”引擎：后端逻辑与Prompt工程**

系统的核心智能在于后端Agent，它扮演着“导演”的角色。我们需要构建一个能够理解剧本、检索素材并编排UI的智能体。

### **4.1 任务拆解与链式思考（Chain of Thought）**

用户的一句话输入往往隐含着复杂的信息。Agent需要执行以下思维链：

1. **剧本分割（Script Segmentation）**：将一句话拆解为若干个分镜（Panel）。
   * *输入*：“英雄在燃烧的城堡前战斗，然后巨龙飞过。”
   * *输出*：Panel 1（英雄战斗，背景城堡），Panel 2（巨龙飞过）。
2. **视觉描述生成（Visual Prompting）**：为每个分镜生成详细的视觉提示词，用于检索或生成。
3. **布局决策（Layout Decision）**：根据剧情张力选择布局。战斗场景可能需要倾斜的动态布局，对话场景适合规则网格。
4. **UI指令生成（A2UI Generation）**：将上述决策转化为JSON指令。

### **4.2 百万级素材的RAG检索系统**

平台拥有100万素材，如何精准匹配是关键。我们采用\*\*检索增强生成（RAG）\*\*架构。

#### **4.2.1 向量索引策略**

* **模型选择**：考虑到中英文混合的查询场景，应使用支持多语言的Embedding模型，如OpenAI的text-embedding-3-large或Google的Gecko。对于图片，使用CLIP或ViT模型提取视觉特征向量。
* **数据库**：使用Milvus或Pinecone存储百万级向量索引。

#### **4.2.2 检索与生成的决策逻辑（Routing Logic）**

Agent在处理每个分镜时，需通过一个**决策路由**：

1. **检索优先**：先拿视觉描述去向量库检索。
2. **相似度阈值判断**：
   * 如果最高相似度 \> 0.85：判定为“库中有素材”，直接返回该素材的URL，封装为AssetCard组件。
   * 如果最高相似度 \< 0.85：判定为“素材缺失”，自动切换到生成模式，调用SD或即梦API，封装为GenerativeFrame组件。

这种“检索兜底，生成补位”的策略，既充分利用了存量资产，又保证了创作的无限性，同时大幅降低了生成成本（检索比生成便宜且快）。

### **4.3 针对A2UI的Prompt工程示例**

为了让Gemini或GPT-4稳定输出符合A2UI Schema的JSON，我们需要精心设计System Prompt。

System Prompt 示例：你是一个专业的漫画分镜导演。你的任务是将用户的剧本转化为A2UI界面描述。你必须遵守以下规则：

1. 始终以JSONL格式输出。
2. 使用 'ComicGrid' 作为根容器。
3. 对于每个分镜，分析其内容。如果描述匹配现有素材库（如常见场景），设置 'source': 'search'。如果是独特场景（如特定角色的动作），设置 'source': 'generate'。
4. 使用 'layout' 属性来控制分镜的 CSS Grid 定义。例如，'1fr 1fr' 表示两列等宽。

可用组件定义：

* ComicPanel(id, description, source\_type, aspect\_ratio)
* SpeechBubble(id, text, position)

Few-Shot Example (输入/输出样本)：
User: "一个赛博朋克侦探在雨中抽烟，突然看到了霓虹灯招牌。"
Agent Output:

JSON

{"surfaceUpdate": {"surfaceId": "comic", "components": \[
  {"id": "root", "type": "ComicGrid", "props": {"columns": "1fr 1fr", "gap": "8px"}, "children": \["panel-1", "panel-2"\]},
  {"id": "panel-1", "type": "ComicPanel", "props": {"prompt": "Cyberpunk detective smoking, rain, noir style", "mode": "generate"}},
  {"id": "panel-2", "type": "ComicPanel", "props": {"query": "Neon sign close up", "mode": "search"}}
\]}}

## ---

**5\. 多模态模型的深度集成：SD、即梦与Sora**

本项目的独特之处在于集成了多种顶级生成模型。A2UI的灵活性允许我们将不同模型的输出封装为统一的UI组件，对用户屏蔽底层差异。

### **5.1 即梦（Jimeng）与中文语境优化**

由于项目背景涉及中文漫画创作，\*\*即梦（Jimeng）\*\*模型的集成至关重要。即梦在理解中文成语、古风场景及东方审美方面优于通用的SD模型。

* **集成策略**：在Prompt工程中增加一个“风格分类器”。
  * 当脚本包含“武侠”、“水墨”、“修仙”等关键词时，Agent自动在A2UI组件的属性中标记model: 'jimeng'。
  * 前端渲染器在接收到该属性时，会向即梦API发起请求，而非SD API。
  * **组件表现**：ComicPanel组件内部可以显示一个“即梦生成中...”的特定Loading动画，增强品牌感知。

### **5.2 Sora与“动态漫画（Motion Comic）”**

Sora的引入将漫画升级为“动态漫画”。这是一个极其前沿的功能。

* **组件设计**：我们需要在A2UI注册表中新增VideoPanel组件。
* **触发逻辑**：Agent分析脚本中的动词。如“爆炸”、“奔跑”、“流泪”。
  * 静态描述：“他很悲伤” \-\> 生成静态图。
  * 动态描述：“他正在在大雨中狂奔” \-\> Agent标记组件为type: 'VideoPanel'，并调用Sora生成3-5秒的循环视频。
* **前端实现**：Next.js使用\<video loop autoPlay muted\>标签渲染Sora返回的MP4流。A2UI的布局系统（Grid/Flex）天然支持视频元素与图片元素的混排，无需额外适配。

### **5.3 渐进式渲染与骨架屏**

调用SD或Sora生成内容通常需要数秒到数十秒。为了不阻塞UI，必须利用A2UI的**异步数据绑定**特性 7。

1. **阶段一（布局生成）**：Agent立即返回surfaceUpdate，构建出分镜的格子。此时图片URL为空，前端渲染器显示灰色的骨架屏或Loading Spinner。
2. **阶段二（任务分发）**：后端并发调用RAG检索和模型生成接口。
3. **阶段三（数据填充）**：
   * 检索完成（100ms）：发送dataModelUpdate，填充检索到的图片。
   * SD生成完成（3s）：发送dataModelUpdate，填充生成的图片。
   * Sora生成完成（10s）：发送dataModelUpdate，填充视频URL。

这种机制确保了用户在输入指令后的瞬间就能看到界面的反馈（布局结构），极大降低了心理等待时间。

## ---

**6\. 用户体验与交互式微调：从“生成”到“导演”**

A2UI不仅仅是单向的生成，它更是一个双向的交互协议。在漫画创作中，AI的初稿往往不能完美符合用户心意，\*\*交互式微调（Human-in-the-loop）\*\*是必不可少的环节。

### **6.1 “导演模式”的交互设计**

A2UI支持将用户在前端的操作转化为事件（Event）回传给Agent 6。我们可以利用这一点实现深度的编辑功能。

* **重绘（In-painting）**：用户点击某个分镜，选择“重绘”。前端发送{ action: 'regenerate', componentId: 'panel-2' }给Agent。Agent保持其他分镜不变，仅重新调用SD生成该分镜，并发送针对该ID的dataModelUpdate。
* **布局调整**：用户通过拖拽改变了分镜顺序。前端捕获onDragEnd事件，通知Agent更新内部的状态树。这样当用户下一次说“在最后加一格”时，Agent是基于调整后的新顺序进行生成的。
* **素材替换**：用户对检索结果不满意，点击“换一张”。这触发Agent读取向量检索的下一页结果（Pagination），并更新数据模型。

### **6.2 复杂属性的JSON传参**

对于漫画编辑器中的复杂参数（如滤镜强度、文字气泡的位置坐标），A2UI的Schema支持传递任意JSON对象 2。

JSON

// 复杂属性传递示例
{
  "id": "bubble-1",
  "type": "SpeechBubble",
  "props": {
    "text": "快跑！",
    "position": { "x": 120, "y": 45 }, // 绝对坐标
    "style": {
    "fontFamily": "JimengHandwriting", // 指定即梦手写体
    "bubbleType": "shout" // 爆炸形气泡
    }
  }
}

前端React组件接收到这些props后，可以直接将其传递给Canvas绘图库（如Konva.js或Fabric.js）进行渲染。这意味着A2UI不仅能控制DOM布局，还能深入控制Canvas内部的图形元素。

## ---

**7\. 实施路线图与风险评估**

### **7.1 分阶段实施计划（Roadmap）**

为了稳健地在生产环境中落地，建议遵循以下三个阶段：

#### **第一阶段：基础设施与阅读器（Month 1-2）**

* **目标**：搭建Next.js \+ A2UI的基础架构，实现“只读”漫画生成。
* **任务**：
  1. 开发React版A2UI渲染器，支持基础Grid布局和Image组件。
  2. 搭建Milvus向量数据库，完成100万素材的CLIP特征提取与入库。
  3. 实现简单的Agent，能够根据文本检索素材并排列展示。
* **交付物**：一个智能图片搜索引擎，输入句子，输出排列好的相关图片组。

#### **第二阶段：多模态生成与编辑器（Month 3-4）**

* **目标**：接入生成模型，实现“创作”能力。
* **任务**：
  1. 集成Stable Diffusion和即梦API，实现“检索失败转生成”的逻辑。
  2. 扩展A2UI注册表，加入ComicPanel等复杂交互组件。
  3. 实现前端到后端的事件回传，支持单个分镜的重绘和参数调整。
* **交付物**：AI漫画编辑器Beta版，支持图文混排和简单的生成。

#### **第三阶段：动态漫画与Sora集成（Month 5-6）**

* **目标**：引入视频能力，打造差异化体验。
* **任务**：
  1. 接入Sora模型，开发VideoPanel组件。
  2. 优化长连接流式传输稳定性，处理视频生成的高延迟问题。
  3. 实现复杂的Prompt工程，支持对分镜间连贯性（Consistency）的控制。
* **交付物**：全功能“AI漫画导演”平台。

### **7.2 关键风险与应对策略**

| 风险点                 | 描述                                             | 应对策略                                                                                                                            |
| :--------------------- | :----------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **生成延迟**     | 多模态模型（特别是Sora）生成极慢，导致用户流失。 | 采用**渐进式渲染**；在等待期间展示高质量的骨架屏或趣味动画；优先展示检索到的素材。                                            |
| **幻觉与一致性** | 角色在不同分镜中长相不一致。                     | 在Agent中引入\*\*LoRA（Low-Rank Adaptation）\*\*管理，保持角色特征向量在多次生成中的一致性；支持用户上传参考图（Reference Image）。 |
| **成本控制**     | 频繁调用Sora和GPT-4成本高昂。                    | 建立**缓存层**，对相似的Prompt直接返回历史生成结果；在非关键路径使用小模型（Gemini Flash）处理布局逻辑。                      |
| **内容安全**     | AI生成不当内容。                                 | 在A2UI渲染前增加**审核层**（NSFW Filter）；利用A2UI的“信任阶梯”，在客户端组件层再次拦截非法URL。                            |

## ---

**8\. 结论**

将Google A2UI引入基于React/Next.js的漫画素材平台，不仅仅是一次技术升级，更是一场**交互维度的升维**。通过A2UI协议，我们成功地将大语言模型的认知能力（理解剧本）与平台的资源优势（百万素材）及生成能力（SD/Sora）进行了标准化的解耦与重组。

这种架构方案最大化地保留了React生态的灵活性和Next.js的性能优势，同时利用A2UI的安全特性规避了直接生成UI代码的风险。对于用户而言，它实现了从“搜索素材”到“导演故事”的跨越；对于平台而言，它构建了一个可无限扩展的、多模态融合的**Server-Driven UI新基建**。随着即梦、Sora等模型的不断迭代，这套基于A2UI的系统将能够持续演进，始终保持在AI创意工具的最前沿。

#### **引用的著作**

1. Quickstart \- A2UI, 访问时间为 十二月 23, 2025， [https://a2ui.org/quickstart/](https://a2ui.org/quickstart/)
2. google/A2UI \- GitHub, 访问时间为 十二月 23, 2025， [https://github.com/google/A2UI](https://github.com/google/A2UI)
3. Google Introduces A2UI (Agent-to-User Interface): An Open Sourc Protocol for Agent Driven Interfaces \- MarkTechPost, 访问时间为 十二月 23, 2025， [https://www.marktechpost.com/2025/12/22/google-introduces-a2ui-agent-to-user-interface-an-open-sourc-protocol-for-agent-driven-interfaces/](https://www.marktechpost.com/2025/12/22/google-introduces-a2ui-agent-to-user-interface-an-open-sourc-protocol-for-agent-driven-interfaces/)
4. Feat: Add React Renderer for A2UI · Issue \#347 \- GitHub, 访问时间为 十二月 23, 2025， [https://github.com/google/A2UI/issues/347](https://github.com/google/A2UI/issues/347)
5. Google just released A2UI (The new standard for Agent UIs?) · AI Automation Society, 访问时间为 十二月 23, 2025， [https://www.skool.com/ai-automation-society/google-just-released-a2ui-the-new-standard-for-agent-uis](https://www.skool.com/ai-automation-society/google-just-released-a2ui-the-new-standard-for-agent-uis)
6. Google releases A2UI \- How the new spec fits within the generative UI space : r/AI\_Agents, 访问时间为 十二月 23, 2025， [https://www.reddit.com/r/AI\_Agents/comments/1pocrep/google\_releases\_a2ui\_how\_the\_new\_spec\_fits\_within/](https://www.reddit.com/r/AI_Agents/comments/1pocrep/google_releases_a2ui_how_the_new_spec_fits_within/)
7. Components & Structure \- A2UI, 访问时间为 十二月 23, 2025， [https://a2ui.org/concepts/components/](https://a2ui.org/concepts/components/)
8. A2UI, 访问时间为 十二月 23, 2025， [https://a2ui.org/](https://a2ui.org/)
9. A2UI/README.md at main \- GitHub, 访问时间为 十二月 23, 2025， [https://github.com/google/A2UI/blob/main/README.md](https://github.com/google/A2UI/blob/main/README.md)
10. Integrating Lit with Next.js SSR — How are others approaching “client islands” vs full SSR? \- Stack Overflow, 访问时间为 十二月 23, 2025， [https://stackoverflow.com/questions/79785500/integrating-lit-with-next-js-ssr-how-are-others-approaching-client-islands-v](https://stackoverflow.com/questions/79785500/integrating-lit-with-next-js-ssr-how-are-others-approaching-client-islands-v)
11. Message Reference \- A2UI, 访问时间为 十二月 23, 2025， [https://a2ui.org/reference/messages/](https://a2ui.org/reference/messages/)
12. CSS grid layout \- Learn web development | MDN, 访问时间为 十二月 23, 2025， [https://developer.mozilla.org/en-US/docs/Learn\_web\_development/Core/CSS\_layout/Grids](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids)
