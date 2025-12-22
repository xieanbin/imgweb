'use client'

import { type Category, type Subcategory } from '@/config/categories'

interface TopBarProps {
  category: Category
  activeSubcategory: string
  onSubcategoryChange: (subcategoryId: string) => void
  sortBy: 'popular' | 'newest'
  onSortChange: (sort: 'popular' | 'newest') => void
}

export function TopBar({
  category,
  activeSubcategory,
  onSubcategoryChange,
  sortBy,
  onSortChange,
}: TopBarProps) {
  return (
    <header className="h-[70px] flex items-center justify-between px-10 bg-[#121212]/95 backdrop-blur-sm sticky top-0 z-50 border-b border-[#333]">
      {/* 左侧：二级标签 */}
      <div className="flex gap-3">
        {/* 全部标签 */}
        <Pill
          name="全部"
          nameEn="All"
          isActive={activeSubcategory === 'all'}
          onClick={() => onSubcategoryChange('all')}
        />
        {category.subcategories.map((sub) => (
          <Pill
            key={sub.id}
            name={sub.name}
            nameEn={sub.nameEn}
            isActive={activeSubcategory === sub.id}
            onClick={() => onSubcategoryChange(sub.id)}
          />
        ))}
      </div>

      {/* 右侧：排序与筛选 */}
      <div className="flex items-center gap-4">
        <ToolButton
          icon="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
          label="热门"
          isActive={sortBy === 'popular'}
          onClick={() => onSortChange('popular')}
        />
        <ToolButton
          icon="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
          label="最新"
          isActive={sortBy === 'newest'}
          onClick={() => onSortChange('newest')}
        />

        <div className="h-6 w-px bg-[#444] mx-2" />

        <ToolButton
          icon="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
          label="筛选"
          isActive={false}
          onClick={() => {}}
        />
      </div>
    </header>
  )
}

interface PillProps {
  name: string
  nameEn: string
  isActive: boolean
  onClick: () => void
}

function Pill({ name, nameEn, isActive, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 rounded-full text-sm transition-all duration-300 border
        ${isActive
          ? 'bg-[#ccff00] text-black font-bold border-transparent'
          : 'bg-[#2a2a2a] text-[#888] border-transparent hover:text-white hover:border-[#555]'
        }
      `}
    >
      {name} {nameEn}
    </button>
  )
}

interface ToolButtonProps {
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
}

function ToolButton({ icon, label, isActive, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-2 py-2 rounded-lg text-sm transition-all duration-300
        ${isActive
          ? 'text-[#ccff00]'
          : 'text-[#888] hover:text-white hover:bg-white/10'
        }
      `}
    >
      <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
        <path d={icon} />
      </svg>
      {label}
    </button>
  )
}
