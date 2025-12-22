/**
 * 分类配置文件
 * 支持动态新增分类，所有分类数据从这里读取
 */

// 一级分类 (L1) - 左侧导航
export interface Category {
  id: string
  name: string
  nameEn: string
  icon: string // SVG path
  subcategories: Subcategory[]
}

// 二级分类 (L2) - 顶部标签
export interface Subcategory {
  id: string
  name: string
  nameEn: string
  // 三级分类 (L3) - 货架行
  shelves: Shelf[]
}

// 三级分类 (L3) - 货架行
export interface Shelf {
  id: string
  name: string
  nameEn: string
  description: string
}

// 分类配置
export const categories: Category[] = [
  {
    id: 'expression',
    name: '表情',
    nameEn: 'Expression',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
    subcategories: [
      {
        id: 'happy',
        name: '笑',
        nameEn: 'Happy',
        shelves: [
          { id: 'smirk', name: '微笑', nameEn: 'Smirk', description: '含蓄、讽刺、自信' },
          { id: 'grin', name: '露齿笑', nameEn: 'Grin', description: '阳光、开朗、假笑' },
          { id: 'laugh', name: '大笑', nameEn: 'Laugh', description: '狂喜、捧腹、失控' },
        ]
      },
      {
        id: 'sad',
        name: '哭',
        nameEn: 'Sad',
        shelves: [
          { id: 'tear', name: '流泪', nameEn: 'Tear', description: '伤感、委屈' },
          { id: 'sob', name: '抽泣', nameEn: 'Sob', description: '悲伤、压抑' },
          { id: 'wail', name: '嚎啕', nameEn: 'Wail', description: '崩溃、失控' },
        ]
      },
      {
        id: 'angry',
        name: '怒',
        nameEn: 'Angry',
        shelves: [
          { id: 'annoyed', name: '不悦', nameEn: 'Annoyed', description: '不满、皱眉' },
          { id: 'furious', name: '愤怒', nameEn: 'Furious', description: '暴怒、咆哮' },
          { id: 'rage', name: '狂怒', nameEn: 'Rage', description: '失控、扭曲' },
        ]
      },
      {
        id: 'surprised',
        name: '惊',
        nameEn: 'Surprised',
        shelves: [
          { id: 'shocked', name: '震惊', nameEn: 'Shocked', description: '瞪大眼睛' },
          { id: 'amazed', name: '惊叹', nameEn: 'Amazed', description: '赞叹、佩服' },
        ]
      },
    ]
  },
  {
    id: 'action',
    name: '动作',
    nameEn: 'Action',
    icon: 'M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z',
    subcategories: [
      {
        id: 'standing',
        name: '站立',
        nameEn: 'Standing',
        shelves: [
          { id: 'casual-stand', name: '休闲站', nameEn: 'Casual', description: '放松、自然' },
          { id: 'formal-stand', name: '正式站', nameEn: 'Formal', description: '挺拔、庄重' },
        ]
      },
      {
        id: 'sitting',
        name: '坐姿',
        nameEn: 'Sitting',
        shelves: [
          { id: 'chair-sit', name: '椅坐', nameEn: 'Chair', description: '正坐、侧坐' },
          { id: 'floor-sit', name: '地坐', nameEn: 'Floor', description: '盘腿、跪坐' },
        ]
      },
      {
        id: 'combat',
        name: '战斗',
        nameEn: 'Combat',
        shelves: [
          { id: 'punch', name: '拳击', nameEn: 'Punch', description: '出拳、防守' },
          { id: 'kick', name: '踢腿', nameEn: 'Kick', description: '踢击、扫腿' },
          { id: 'weapon', name: '武器', nameEn: 'Weapon', description: '挥剑、射箭' },
        ]
      },
    ]
  },
  {
    id: 'profession',
    name: '职业',
    nameEn: 'Profession',
    icon: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
    subcategories: [
      {
        id: 'warrior',
        name: '战士',
        nameEn: 'Warrior',
        shelves: [
          { id: 'knight', name: '骑士', nameEn: 'Knight', description: '铠甲、长剑' },
          { id: 'samurai', name: '武士', nameEn: 'Samurai', description: '武士刀、和风' },
        ]
      },
      {
        id: 'mage',
        name: '法师',
        nameEn: 'Mage',
        shelves: [
          { id: 'wizard', name: '巫师', nameEn: 'Wizard', description: '法杖、长袍' },
          { id: 'witch', name: '女巫', nameEn: 'Witch', description: '魔法、神秘' },
        ]
      },
    ]
  },
  {
    id: 'composition',
    name: '构图',
    nameEn: 'Composition',
    icon: 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z',
    subcategories: [
      {
        id: 'angle',
        name: '视角',
        nameEn: 'Angle',
        shelves: [
          { id: 'top-down', name: '俯视', nameEn: 'Top Down', description: '从上往下' },
          { id: 'bottom-up', name: '仰视', nameEn: 'Bottom Up', description: '从下往上' },
          { id: 'eye-level', name: '平视', nameEn: 'Eye Level', description: '平行视角' },
          { id: 'fisheye', name: '鱼眼', nameEn: 'Fisheye', description: '广角畸变' },
        ]
      },
      {
        id: 'layout',
        name: '排版',
        nameEn: 'Layout',
        shelves: [
          { id: 'manga-panel', name: '漫画格', nameEn: 'Manga Panel', description: '分镜排版' },
          { id: 'cover', name: '封面', nameEn: 'Cover', description: '封面构图' },
        ]
      },
    ]
  },
]

// 获取默认选中的分类
export function getDefaultCategory(): Category {
  return categories[0]
}

// 获取默认选中的子分类
export function getDefaultSubcategory(category: Category): Subcategory {
  return category.subcategories[0]
}

// 通过 ID 查找分类
export function findCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}

// 通过 ID 查找子分类
export function findSubcategoryById(categoryId: string, subcategoryId: string): Subcategory | undefined {
  const category = findCategoryById(categoryId)
  return category?.subcategories.find(s => s.id === subcategoryId)
}
