# Volume Profile POC/VAH/VAL 简化版设计文档

## 目标
从原代码 [`market.pine`](pinecode/market.pine:1) 中提取 POC、VAH 和 VAL 的核心计算逻辑，创建一个最小化的实现版本。

## 核心功能保留

### 1. 输入参数
- `resolution`: 成交量分布的分辨率 (默认30)
- `VAwid`: 价值区域成交量百分比 (默认70%)
- `volType`: 数据类型 (成交量/持仓量)
- `smoothVol`: 是否平滑成交量数据
- `lookbackPeriod`: 回看周期（替代原会话管理）

### 2. 核心数据结构
```pinescript
var vpGreen = array.new_float(resolution, 0)    // 上涨成交量分布
var vpRed = array.new_float(resolution, 0)      // 下跌成交量分布  
var zoneBounds = array.new_float(resolution, 0) // 价格区间边界
```

### 3. 核心函数保留

#### 3.1 成交量分布计算
- [`get_vol()`](pinecode/market.pine:98): 计算单个K线在价格区间的成交量贡献
- [`profileAdd()`](pinecode/market.pine:101): 将K线数据添加到成交量分布
- [`calcVolumeProfile()`](pinecode/market.pine:132): 主计算函数

#### 3.2 POC计算
- [`pocLevel()`](pinecode/market.pine:147): 找出最大成交量价格水平

#### 3.3 VAH/VAL计算  
- [`valueLevels()`](pinecode/market.pine:160): 基于POC计算价值区域高低点

### 4. 移除的功能

#### 4.1 绘图和显示
- 所有 `box.new()` 和 `line.new()` 调用
- 标签和颜色设置
- 会话框绘制

#### 4.2 会话管理
- 东京/伦敦/纽约会话检测
- 日/周/月/季度/年周期检测
- `zoneStart`, `activeZone` 等状态变量
- `newSession`, `zoneEnd` 等逻辑

#### 4.3 其他功能
- 外汇会话特殊处理
- 多种显示模式
- 实时区域更新

## 简化版代码结构

```pinescript
//@version=5
indicator("Volume Profile Core", overlay=true)

// 输入参数
resolution = input.int(30, "Resolution")
VAwid = input.int(70, "Value Area Volume %")
// ... 其他参数

// 核心数组
var vpGreen = array.new_float(resolution, 0)
var vpRed = array.new_float(resolution, 0)
var zoneBounds = array.new_float(resolution, 0)

// 核心函数（从原代码复制）
get_vol(y11, y12, y21, y22, height, vol) =>
    // 原逻辑不变

profileAdd(o, h, l, c, v, g) =>
    // 原逻辑不变

calcVolumeProfile() =>
    // 简化版，移除会话依赖

pocLevel() =>
    // 原逻辑不变

valueLevels(poc) =>
    // 原逻辑不变

// 主计算逻辑
if ta.change(time)
    // 重置和计算

// 输出结果
plot(poc, "POC", color=color.red)
plot(vah, "VAH", color=color.aqua)  
plot(val, "VAL", color=color.aqua)
```

## 关键修改点

1. **移除会话依赖**: 使用固定的 `lookbackPeriod` 替代动态会话检测
2. **简化数据更新**: 直接在主循环中处理，移除复杂的会话状态管理  
3. **保留核心算法**: 所有成交量分布和POC/VAH/VAL计算逻辑保持不变
4. **简化输出**: 只保留基本的 `plot()` 输出

## 验证要点

- [ ] POC计算结果与原代码一致
- [ ] VAH/VAL计算结果与原代码一致  
- [ ] 成交量分布计算逻辑未改变
- [ ] 性能优于原代码（移除了大量绘图操作）