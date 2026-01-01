# **架构设计与实现报告：基于开源生态构建AI驱动的漫画素材自动化生产体系**

## **执行摘要**

随着大语言模型（LLM）能力的飞跃，应用开发范式正经历从“人机对话”（Chat-to-Text）向“意图驱动行动”（Chat-to-Action）的根本性转变。本报告旨在深度调研并解析当前开源生态中，如何利用AI能力构建具备自动化干活系统的技术路径，特别是针对“用户输入一句话，自动生成剧情脚本并精准检索相关素材图片”这一具体业务场景。

分析显示，实现这一目标的核心不在于单一模型的选择，而在于构建一个多层级的**Agentic Workflow（代理工作流）**。该体系利用**OpenRouter**等聚合层接入Claude 3.5 Sonnet等具备强推理能力的模型作为“大脑”，采用**Vercel AI SDK**或**LangGraph**作为编排层的“神经系统”，并结合**pgvector**等向量数据库技术实现语义与标签混合的**Hybrid Search（混合检索）**。

本报告将详细阐述如何通过开源技术栈实现从自然语言理解、结构化数据提取、自动化工具调用到生成式用户界面（Generative UI）的全链路架构，揭示如何将单纯的API对接转化为具备业务逻辑闭环的自动化生产力工具。

## ---

**1\. 范式转移：从对话机器人到自动化代理架构**

在探讨具体技术实现之前，必须明确当前AI应用架构的演进趋势。传统的Web应用交互是决定性的：用户点击按钮，系统执行预设代码。早期的AI应用（如ChatGPT的初始版本）是对话式的：用户提问，AI回答文本。而针对漫画素材网站的“自动化生成与查找”需求，代表了第三阶段——**Agentic Architecture（代理架构）**。

### **1.1 核心定义与业务映射**

在漫画素材网站的场景中，“自动化”不仅仅是生成文本，而是系统自主完成“理解意图”、“拆解任务”、“执行检索”、“呈现结果”的闭环。

| 架构阶段           | 交互模式                 | 漫画素材场景应用                                                                                              | 局限性                                                 |
| :----------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------- |
| **传统Web**  | 菜单导航/关键词搜索      | 用户手动筛选标签（如“校园”、“雨天”），浏览列表。                                                          | 效率低，依赖用户对标签系统的熟悉度。                   |
| **Chatbot**  | 文本问答                 | 用户：“给我写个故事。” AI：“好的，故事如下...”                                                            | 仅停留在文本层面，素材查找仍需人工分离操作。           |
| **AI Agent** | **Chat-to-Action** | 用户：“写个雨天分手的校园故事。” AI自动生成脚本，并**同时**调用数据库接口，展示匹配的背景图和角色图。 | **实现了业务流的自动化闭环，大幅降低创作门槛。** |

这种架构的核心在于\*\*Tool Calling（工具调用）\*\*机制。开源社区已经证明，通过让LLM输出特定的结构化数据（如JSON），可以触发后端函数执行，从而连接“生成能力”与“业务数据” 1。

### **1.2 开源生态的技术选型概览**

调研发现，构建此类系统的开源技术栈已趋于成熟，主要分为三个层级：

1. **智能层（Intelligence Layer）：** 提供推理与指令遵循能力。主流方案是通过**OpenRouter**聚合API，或直接对接**Claude SDK**。Claude 3.5 Sonnet因其卓越的代码理解和工具调用能力，成为此类复杂逻辑首选模型 3。
2. **编排层（Orchestration Layer）：** 负责管理对话状态、流式传输和工具回调。**Vercel AI SDK**是目前Next.js生态下的标准选择，它提供了streamText和streamUI等原语，完美支持流式组件渲染；而**LangChain/LangGraph**则在复杂的后端逻辑编排上占据优势 5。
3. **数据层（Data Layer）：** 负责存储与混合检索。对于拥有标签的素材库，单纯的向量搜索（Vector Search）精确度不足，必须结合元数据过滤（Metadata Filtering）。**PostgreSQL**配合**pgvector**插件，或**Supabase**的AI套件，是实现\*\*Hybrid Search（混合检索）\*\*的主流开源方案 7。

## ---

**2\. 智能层架构：模型抽象与推理源选择**

在自动化架构中，AI模型不仅仅是文本生成器，更是**推理引擎（Reasoning Engine）**。它需要理解剧情脚本中的隐性视觉信息，并将其转化为数据库能够识别的显性标签。

### **2.1 为什么选择OpenRouter与Claude**

对于漫画素材网站，用户可能输入模糊的指令：“画面要有一种压抑的悲伤。” 模型需要首先创作出具体的情节（脚本生成），然后分析出“阴天”、“空教室”、“冷色调”等视觉标签（参数提取）。

调研显示，直接依赖单一模型供应商（如OpenAI）存在成本和灵活性风险。开源项目普遍采用\*\*Provider Abstraction（供应商抽象）\*\*模式。

* **OpenRouter的作用：** 作为一个统一的API网关，OpenRouter允许开发者通过一套标准接口访问数百种模型。这对于开发者至关重要，因为可以在开发阶段使用昂贵的**Claude 3.5 Sonnet**进行Prompt调试，而在生产环境的非关键环节切换至**Llama 3**等低成本模型 3。
* **Claude 3.5 Sonnet的优势：** 在处理“工具调用”和“结构化输出”时，Claude 3.5 Sonnet表现出了极高的指令遵循率（Instruction Following）。在素材检索场景中，模型必须严格遵守标签规范（例如只能输出数据库中存在的标签），Claude在此类任务中的表现优于许多同类模型 4。

### **2.2 提示工程（Prompt Engineering）与思维链（CoT）**

为了实现“一句话生成脚本+图片”，Prompt的设计必须引导模型进行**多步推理**。这被称为**Chain-of-Thought (CoT)** 模式。

在系统提示词（System Prompt）中，我们需要明确界定AI的职责：

“你是一名专业的漫画脚本家。你的任务是根据用户输入创作分镜脚本。在创作每一个分镜时，你必须同时思考该画面所需的视觉素材，并从给定的标签库中选择最匹配的标签，调用检索工具查找图片。” 10

这种设计迫使模型在生成文本的同时进行逻辑分析，确保了“脚本”与“检索结果”的上下文一致性。

## ---

**3\. 编排层核心：利用Vercel AI SDK构建自动化回路**

编排层是将模型推理转化为实际数据库操作的枢纽。在Next.js等现代Web框架中，**Vercel AI SDK** 提供了最完善的开源解决方案。

### **3.1 从 streamText 到多步执行（Multi-Step Action）**

Vercel AI SDK 的核心函数 streamText 支持\*\*多步往返（Multi-Step Roundtrips）\*\*机制。这是实现自动化干活的关键 11。

**工作流程解析：**

1. **用户输入：** “男主角在雨中奔跑。”
2. **第一轮推理（Turn 1）：** 模型接收输入，判断需要生成一段脚本，并需要调用检索工具。模型返回一个“工具调用请求”（Tool Call Request），而不是文本。
3. **自动执行（Auto-Execution）：** SDK在后端自动拦截这个请求，执行对应的TypeScript函数（即查询数据库的逻辑）。
4. **第二轮推理（Turn 2）：** SDK将数据库返回的图片URL和元数据回传给模型。模型结合脚本内容和图片信息，生成最终响应流向前端。

通过设置 maxSteps 参数（例如设置为5），开发者允许模型在一次用户交互中进行多次“思考-执行-再思考”的循环，从而处理极其复杂的任务逻辑，而无需用户干预 13。

### **3.2 结构化工具定义（Zod Schema）**

为了让AI准确地查询素材库，必须定义严格的接口规范。开源社区广泛使用 **Zod** 库来定义工具的Schema。

**代码逻辑示例（概念性描述）：**

TypeScript

import { z } from 'zod';
import { tool } from 'ai';

export const searchMangaAssets \= tool({
  description: '根据剧情描述查找漫画背景图和角色立绘',
  parameters: z.object({
    keywords: z.array(z.string()).describe('从剧情中提取的3-5个视觉关键词，如"教室", "夕阳"'),
    emotion: z.enum(\['happy', 'sad', 'angry', 'neutral'\]).describe('场景的情感基调'),
    assetType: z.enum(\['background', 'character'\]).describe('素材类型')
  }),
  execute: async ({ keywords, emotion, assetType }) \=\> {
    // 这里调用数据库检索逻辑
    return await db.hybridSearch(keywords, emotion, assetType);
  }
});

这种定义方式将非结构化的自然语言（“找点悲伤的图”）强行约束为结构化的数据库查询参数（{ emotion: 'sad' }），解决了AI不可控的问题 14。

## ---

**4\. 数据层设计：基于混合检索（Hybrid Search）的素材匹配**

针对漫画素材网站，“标签”是极其重要的资产。纯粹的\*\*向量搜索（Vector Search）**虽然能捕捉语义（如“悲伤”关联到“眼泪”），但往往不够精确（可能会把“悲伤的男人”匹配给“悲伤的女人”）。因此，开源架构普遍采用**混合检索（Hybrid Search）\*\*策略。

### **4.1 技术栈选型：PostgreSQL \+ pgvector**

**PostgreSQL** 配合 **pgvector** 插件是目前开源界处理此类需求的事实标准。它允许在同一个数据库中既存储素材的元数据（Tags, Author, Category），也存储图像的向量Embedding 16。

**Supabase** 是基于Postgres的开源BaaS（Backend-as-a-Service），它提供了开箱即用的向量支持，并被广泛用于Vercel AI SDK的示例项目中 8。

### **4.2 混合检索算法实现**

为了确保素材查找既“懂剧情”又“精准匹配”，检索逻辑通常包含两个步骤：

1. **语义检索（Semantic Search）：** 将AI提取的剧情关键词（如“雨中等待”）转化为向量，在数据库中计算余弦相似度（Cosine Similarity），找出视觉风格相近的图片。
2. **元数据过滤（Metadata Filtering）：** 利用AI提取的硬性标签（如“Tags:”）进行SQL层面的过滤。

倒数排名融合（RRF）算法：
更高级的开源实现（如Weaviate或Supabase的高级查询）会使用RRF算法，将关键词搜索的排名和向量搜索的排名进行加权融合。这能确保返回的结果既符合剧情的语义氛围，又包含必须的视觉元素 19。

| 检索方式             | 优势                           | 劣势                       | 在本场景的应用                     |
| :------------------- | :----------------------------- | :------------------------- | :--------------------------------- |
| **关键词检索** | 精准匹配特定标签（如“校服”） | 无法理解氛围（如“压抑”） | 用于硬性约束（如角色、场景类型）。 |
| **向量检索**   | 理解语义和氛围                 | 容易产生幻觉或不相关匹配   | 用于匹配剧情的整体氛围和构图。     |
| **混合检索**   | **结合两者优点**         | 实现复杂度稍高             | **最佳实践方案。**           |

## ---

**5\. 交互层创新：生成式UI（Generative UI）与流式渲染**

在传统的Chatbot中，AI只能返回Markdown文本或链接。但在“自动化干活”的场景下，用户期望的是直接看到可用的界面。**Generative UI** 是Vercel AI SDK引入的革命性概念，它允许AI直接渲染React组件 13。

### **5.1 React Server Components (RSC) 的流式传输**

通过 **RSC** 技术，后端可以在AI生成数据的同时，将UI组件流式传输到前端。

场景模拟：当AI决定调用 searchMangaAssets 工具并获得图片列表后，它不再是输出一段文字描述“我找到了5张图”，而是直接返回一个 \<AssetGallery /\> 组件。

* 用户端看到的界面：文字脚本正在逐字生成 \-\> 突然在脚本下方出现一个加载骨架屏 \-\> 瞬间替换为一组可横向滑动的精美图片卡片。
* 这一切都是在一次HTTP流式响应中完成的，无需前端编写复杂的useEffect或状态管理代码去轮询API 22。

### **5.2 乐观更新（Optimistic UI）与加载状态**

为了提升用户体验，避免AI调用外部API时的等待感，开源项目通常采用**乐观UI**模式。在工具被调用的瞬间（数据尚未返回），前端通过 tool-call 事件立即渲染一个具有动画效果的“正在查找素材...”组件。这让用户感知到AI正在“干活”，而不是卡顿 24。

## ---

**6\. 综合架构蓝图与实施路径**

基于上述调研，我们为漫画素材网站构建AI驱动自动化能力的推荐架构如下：

### **6.1 架构分层图**

代码段

graph TD
    User\[用户输入: "生成一段雨夜侦探故事"\] \--\> Frontend\[Next.js前端 (Generative UI)\]
    Frontend\--\> AI\_Gateway

    subgraph Intelligence Layer
    AI\_Gateway \--\>|Stream Request| OpenRouter
    OpenRouter\--\>|Reasoning| Claude
    end

    subgraph Data Layer
    AI\_Gateway \--\>|Tool Execution (Search)| DB\_Interface
    DB\_Interface \--\>|Hybrid Search| VectorDB
    VectorDB\--\>|Tags \+ Embeddings| DB\_Interface
    end

    Claude\--\>|Generate Script| AI\_Gateway
    Claude\--\>|Extract Tags| AI\_Gateway

    DB\_Interface \--\>|Image Data| AI\_Gateway
    AI\_Gateway \--\>|Stream React Component| Frontend

### **6.2 关键实施步骤**

1. **数据准备（Embedding Pipeline）：**
   * 利用开源模型（如CLIP或BGE-M3）对现有的漫画素材库进行预处理，为每一张图片生成向量索引。
   * 确保所有图片已有结构化标签（Tags），并在Postgres中建立GIN索引以加速标签过滤。
2. **后端服务搭建（Agent Setup）：**
   * 使用Next.js App Router创建API路由。
   * 配置Vercel AI SDK，定义 generateScript 和 searchAssets 两个核心工具。
   * 在System Prompt中植入“脚本-素材联动”的指令逻辑。
3. **前端交互开发（UI Streaming）：**
   * 利用 useChat hook 管理对话状态。
   * 针对 searchAssets 工具的返回结果，设计专门的 \<GalleryComponent /\>，支持用户点击图片直接插入到编辑器或下载。
4. **优化与迭代（Feedback Loop）：**
   * 引入用户反馈机制。如果用户没有采纳AI推荐的图片，记录该次失败的Query-Image对，用于后续微调检索算法权重。

## ---

**7\. 深度洞察与未来展望**

通过对开源项目的深度剖析，我们发现“AI驱动的自动化”正在从单一的API调用演变为一种**生态系统的整合**。

### **7.1 为什么是“现在”？**

过去做不到这一点，是因为模型缺乏稳定的结构化输出能力（经常输出错误的JSON格式），且上下文窗口（Context Window）太小，无法容纳大量素材信息。现在，随着Claude 3.5等模型在**Tool Use**基准测试上的高分表现，以及**pgvector**降低了向量检索的门槛，技术临界点已经突破。

### **7.2 潜在挑战与应对**

* **标签幻觉（Tag Hallucination）：** AI可能会创造数据库中不存在的标签（例如“赛博朋克风”vs数据库中的“科幻”）。
  * *解决方案：* 在Prompt中动态注入数据库中最高频的Top 100标签作为参考，或者在工具执行层增加模糊匹配（Fuzzy Matching）逻辑。
* **延迟问题（Latency）：** 串行执行（写完脚本再找图）太慢。
  * *解决方案：* 采用**并行工具调用（Parallel Tool Calling）**，让AI在生成脚本的段落间隙预加载图片，实现“边写边找”的流畅体验 11。

综上所述，利用开源生态构建AI驱动的漫画素材自动化系统，本质上是一场**架构重组**。它要求开发者跳出传统的CRUD思维，转向以模型推理为核心、以工具调用为触手、以流式UI为界面的全新开发模式。这不仅能极大地提升用户创作效率，也将彻底重塑内容素材平台的竞争壁垒。

## ---

**8\. 技术细节深挖：代码级实现策略**

为了更具体地指导落地，本章节将深入探讨在代码层面如何实现上述架构的关键环节。

### **8.1 提示词工程的精细化设计 (Advanced Prompt Engineering)**

在实现“一句话生成脚本并查找图片”的过程中，Prompt的设计决定了系统的上限。我们不能仅仅依赖简单的指令，而需要使用**结构化提示（Structured Prompting）**。

**推荐的System Prompt结构：**

# **Role**

你是一个资深的漫画分镜师和素材库管理员。

# **Objective**

根据用户的自然语言描述，编写一段详细的分镜脚本。
同时，必须为每一个关键的分镜画面，调用 searchAssets 工具查找对应的参考素材。

# **Constraints**

1. **脚本风格**：专业、简洁，包含“景别”、“动作”、“对白”。
2. **素材检索**：
   * 必须从脚本中提取视觉关键词（如：雨、校服、奔跑）。
   * 必须推断情感基调（如：悲伤、紧张）。
   * **严禁**捏造不存在的抽象标签。仅使用具体的视觉名词。
3. **输出逻辑**：
   * 先生成分镜描述。
   * 紧接着调用工具展示图片。
   * 保持“描述 \-\> 图片 \-\> 描述 \-\> 图片”的穿插节奏。

# **Example**

User: "男主在屋顶告白"
Assistant:
: "场景一：学校屋顶，黄昏。男主手扶栏杆，背影逆光..."
: searchAssets({ keywords: \["sunset", "rooftop", "school", "boy"\], emotion: "romantic" })
这种结构化的提示词利用了**Few-Shot Learning（少样本学习）**，通过提供Example让模型明确知道“在什么时候调用工具”以及“参数该长什么样” 27。

### **8.2 数据层：Supabase与pgvector的实战配置**

在开源实现中，**Supabase** 是最快落地的后端选择。以下是如何在Supabase中配置混合检索的具体步骤 8：

1. **启用扩展：**SQLcreate extension vector;
2. **创建素材表：**SQLcreate table assets (id bigserial primary key,content text, \-- 图片描述或OCR文字tags text, \-- 标签数组，例如 \['school', 'rain'\]embedding vector(1536) \-- 对应OpenAI/CLIP的向量维度);
3. 创建混合检索函数（关键）：
   这个SQL函数是连接AI与数据的桥梁。它接受向量和标签，返回最匹配的记录。
   SQL
   create or replace function hybrid\_search(
   query\_embedding vector(1536),
   filter\_tags text,
   match\_threshold float,
   match\_count int
   )
   returns table (
   id bigint,
   content text,
   similarity float
   )
   language plpgsql
   as $$
   begin
   return query
   select
   assets.id,
   assets.content,
   1 \- (assets.embedding \<=\> query\_embedding) as similarity
   from assets
   where 1 \- (assets.embedding \<=\> query\_embedding) \> match\_threshold
   and assets.tags @\> filter\_tags \-- 数组包含操作符，实现标签过滤
   order by similarity desc
   limit match\_count;
   end;

   $$
   ;
   $$

### **8.3 编排层：Vercel AI SDK的工具定义实战**

在Next.js后端（Route Handler）中，我们需要将上述数据库函数封装为AI可调用的工具。

TypeScript

// app/api/chat/route.ts
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// 初始化Supabase客户端
const supabase \= createClient(process.env.SUPABASE\_URL, process.env.SUPABASE\_KEY);

// 定义工具
const tools \= {
  searchAssets: tool({
    description: 'Find image assets based on visual tags and description.',
    parameters: z.object({
    description: z.string().describe('The visual description for semantic search'),
    tags: z.array(z.string()).describe('Specific tags to filter by'),
    }),
    execute: async ({ description, tags })\=\> {
    // 1\. 将描述转化为向量 (使用OpenAI embedding或其他开源模型)
    const { embedding }\= await generateEmbedding(description);

    // 2\. 调用数据库的混合检索函数
    const { data, error }\= await supabase.rpc('hybrid\_search', {
    query\_embedding: embedding,
    filter\_tags: tags,
    match\_threshold: 0.7,
    match\_count: 4
    });

    if (error) throw error;
    return data; // 返回给AI，或者直接在前端通过Generative UI渲染
    },
  }),
};

这段代码展示了如何将**自然语言理解**（生成embedding）与**结构化数据查询**（RPC调用）结合起来。这是“自动化干活”的技术底座 14。

## ---

**9\. 性能优化与成本控制 (Performance & Cost)**

在构建此类系统时，性能和成本是不可忽视的因素。开源项目通常采用以下策略进行优化：

### **9.1 缓存策略 (Caching Strategy)**

* **Prompt Caching（提示词缓存）：** Anthropic等提供商支持Prompt Caching。对于庞大的System Prompt（可能包含数千个标签的列表），启用缓存可以显著降低延迟和成本 30。
* **工具结果缓存：** 对于相同的搜索请求（如“校园背景”），可以直接在应用层缓存数据库查询结果，无需每次都重新计算向量相似度。

### **9.2 模型路由与降级 (Model Routing & Fallback)**

利用 **OpenRouter** 或 **Vercel AI Gateway**，可以配置模型路由策略：

* **首选：** 使用 Claude 3.5 Sonnet 处理复杂的脚本生成任务。
* **降级/辅佐：** 如果只是单纯的同义词扩充（如将“悲伤”扩充为“流泪，低头，阴沉”），可以调用更便宜的 **Llama 3 8B** 或 **Gemini Flash** 模型。这种\*\*大小模型协同（Model Orchestration）\*\*是降低运营成本的关键 31。

### **9.3 延迟感知设计 (Latency-Aware Design)**

由于向量检索和LLM生成都需要时间，前端体验优化至关重要：

* **流式输出（Streaming）：** 确保文本在生成的瞬间就显示，而不是等待整个脚本写完。
* **骨架屏（Skeleton Screens）：** 在AI决定调用工具但数据未返回的间隙，展示动态骨架屏，暗示系统正在“思考”和“查找”，减少用户的焦虑感。

## ---

**结论**

构建一个“用户说一句话，AI自动生成脚本并找图”的系统，不再是遥不可及的科幻设想，而是完全可以通过现有的开源技术栈实现的工程任务。

通过 **Vercel AI SDK** 解决前后端交互与状态管理，利用 **OpenRouter** 接入 **Claude 3.5** 等强推理模型作为大脑，并结合 **pgvector** 实现精准的混合检索，开发者可以构建出具有高度自动化、智能化体验的下一代内容创作平台。这一架构不仅适用于漫画素材，同样可以复用到视频脚本生成、电商营销文案配图等广泛的业务场景中，代表了Web应用从“工具属性”向“代理属性”进化的必然方向。

#### **引用的著作**

1. Overview of Microsoft 365 Copilot Chat, 访问时间为 十二月 22, 2025， [https://learn.microsoft.com/en-us/copilot/overview](https://learn.microsoft.com/en-us/copilot/overview)
2. Copilot Studio overview \- Microsoft Learn, 访问时间为 十二月 22, 2025， [https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)
3. Vercel AI SDK | OpenRouter | Documentation, 访问时间为 十二月 22, 2025， [https://openrouter.ai/docs/guides/community/vercel-ai-sdk](https://openrouter.ai/docs/guides/community/vercel-ai-sdk)
4. Claude Sonnet 3.5 (Bedrock) Always announces which tool it's going to use. \#3616 \- GitHub, 访问时间为 十二月 22, 2025， [https://github.com/vercel/ai/discussions/3616](https://github.com/vercel/ai/discussions/3616)
5. Building with AI SDK: A Practical Guide With Examples | by Sumant Sogikar \- Medium, 访问时间为 十二月 22, 2025， [https://medium.com/@sumant1122/building-with-ai-sdk-a-practical-guide-with-examples-df24e3c440ef](https://medium.com/@sumant1122/building-with-ai-sdk-a-practical-guide-with-examples-df24e3c440ef)
6. Building a Deep Research Agent with LangGraph And Exa \- Sid Bharath, 访问时间为 十二月 22, 2025， [https://www.siddharthbharath.com/build-deep-research-agent-langgraph/](https://www.siddharthbharath.com/build-deep-research-agent-langgraph/)
7. pgvector Hybrid Search: Benefits, Use Cases & Quick Tutorial, 访问时间为 十二月 22, 2025， [https://www.instaclustr.com/education/vector-database/pgvector-hybrid-search-benefits-use-cases-and-quick-tutorial/](https://www.instaclustr.com/education/vector-database/pgvector-hybrid-search-benefits-use-cases-and-quick-tutorial/)
8. Hybrid search | Supabase Docs, 访问时间为 十二月 22, 2025， [https://supabase.com/docs/guides/ai/hybrid-search](https://supabase.com/docs/guides/ai/hybrid-search)
9. Community Providers: OpenRouter \- AI SDK, 访问时间为 十二月 22, 2025， [https://ai-sdk.dev/providers/community-providers/openrouter](https://ai-sdk.dev/providers/community-providers/openrouter)
10. What is chain of thought (CoT) prompting? \- IBM, 访问时间为 十二月 22, 2025， [https://www.ibm.com/think/topics/chain-of-thoughts](https://www.ibm.com/think/topics/chain-of-thoughts)
11. Multi-Step & Generative UI | Vercel Academy, 访问时间为 十二月 22, 2025， [https://vercel.com/academy/ai-sdk/multi-step-and-generative-ui](https://vercel.com/academy/ai-sdk/multi-step-and-generative-ui)
12. Next.js: Call Tools in Multiple Steps \- AI SDK, 访问时间为 十二月 22, 2025， [https://ai-sdk.dev/cookbook/next/call-tools-multiple-steps](https://ai-sdk.dev/cookbook/next/call-tools-multiple-steps)
13. Generative User Interfaces \- AI SDK UI, 访问时间为 十二月 22, 2025， [https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces](https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces)
14. How to build AI Agents with Vercel and the AI SDK, 访问时间为 十二月 22, 2025， [https://vercel.com/kb/guide/how-to-build-ai-agents-with-vercel-and-the-ai-sdk](https://vercel.com/kb/guide/how-to-build-ai-agents-with-vercel-and-the-ai-sdk)
15. AI SDK \- Vercel, 访问时间为 十二月 22, 2025， [https://vercel.com/docs/ai-sdk](https://vercel.com/docs/ai-sdk)
16. pgvector/pgvector: Open-source vector similarity search for Postgres \- GitHub, 访问时间为 十二月 22, 2025， [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)
17. Postgres as a vector Database | Implementing Hybrid search with Postgres for RAG Using Groq. | by Meeran Malik | Medium, 访问时间为 十二月 22, 2025， [https://medium.com/@meeran03/postgres-as-a-vector-database-implementing-hybrid-search-with-postgres-for-rag-using-groq-494ca3e41d57](https://medium.com/@meeran03/postgres-as-a-vector-database-implementing-hybrid-search-with-postgres-for-rag-using-groq-494ca3e41d57)
18. AI & Vectors | Supabase Docs, 访问时间为 十二月 22, 2025， [https://supabase.com/docs/guides/ai](https://supabase.com/docs/guides/ai)
19. Unlocking the Power of Hybrid Search \- A Deep Dive into Weaviate's Fusion Algorithms, 访问时间为 十二月 22, 2025， [https://weaviate.io/blog/hybrid-search-fusion-algorithms](https://weaviate.io/blog/hybrid-search-fusion-algorithms)
20. A Web Developers Guide to Hybrid Search \- Weaviate, 访问时间为 十二月 22, 2025， [https://weaviate.io/blog/hybrid-search-for-web-developers](https://weaviate.io/blog/hybrid-search-for-web-developers)
21. Introducing AI SDK 3.0 with Generative UI support \- Vercel, 访问时间为 十二月 22, 2025， [https://vercel.com/blog/ai-sdk-3-generative-ui](https://vercel.com/blog/ai-sdk-3-generative-ui)
22. Streaming React Components \- AI SDK RSC, 访问时间为 十二月 22, 2025， [https://ai-sdk.dev/docs/ai-sdk-rsc/streaming-react-components](https://ai-sdk.dev/docs/ai-sdk-rsc/streaming-react-components)
23. AI SDK RSC: streamUI, 访问时间为 十二月 22, 2025， [https://ai-sdk.dev/docs/reference/ai-sdk-rsc/stream-ui](https://ai-sdk.dev/docs/reference/ai-sdk-rsc/stream-ui)
24. Optimistic UI \- Apollo GraphQL Docs, 访问时间为 十二月 22, 2025， [https://www.apollographql.com/docs/react/v2/performance/optimistic-ui](https://www.apollographql.com/docs/react/v2/performance/optimistic-ui)
25. Optimistic UI: Making Apps Feel Faster (Even When They're Not) | by Alex Glushenkov, 访问时间为 十二月 22, 2025， [https://medium.com/@alexglushenkov/optimistic-ui-making-apps-feel-faster-even-when-theyre-not-ea296bc84720](https://medium.com/@alexglushenkov/optimistic-ui-making-apps-feel-faster-even-when-theyre-not-ea296bc84720)
26. React Server Components: Call Tools in Parallel \- AI SDK, 访问时间为 十二月 22, 2025， [https://ai-sdk.dev/cookbook/rsc/call-tools-in-parallel](https://ai-sdk.dev/cookbook/rsc/call-tools-in-parallel)
27. Prompt Engineering Techniques for LLMs: A Comprehensive Guide | by Aloy Banerjee, 访问时间为 十二月 22, 2025， [https://medium.com/@aloy.banerjee30/prompt-engineering-techniques-for-llms-a-comprehensive-guide-46ca6466a41f](https://medium.com/@aloy.banerjee30/prompt-engineering-techniques-for-llms-a-comprehensive-guide-46ca6466a41f)
28. Prompt Engineering for Code Generation \- Leanware, 访问时间为 十二月 22, 2025， [https://www.leanware.co/insights/prompt-engineering-for-code-generation](https://www.leanware.co/insights/prompt-engineering-for-code-generation)
29. Supabase Hybrid Search \- Docs by LangChain, 访问时间为 十二月 22, 2025， [https://docs.langchain.com/oss/javascript/integrations/retrievers/supabase-hybrid](https://docs.langchain.com/oss/javascript/integrations/retrievers/supabase-hybrid)
30. Foundations: Providers and Models \- AI SDK, 访问时间为 十二月 22, 2025， [https://ai-sdk.dev/docs/foundations/providers-and-models](https://ai-sdk.dev/docs/foundations/providers-and-models)
31. Provider Options \- Vercel, 访问时间为 十二月 22, 2025， [https://vercel.com/docs/ai-gateway/provider-options](https://vercel.com/docs/ai-gateway/provider-options)
