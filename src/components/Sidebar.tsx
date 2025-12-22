'use client'

import { categories, type Category } from '@/config/categories'

interface SidebarProps {
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <nav className="w-[90px] bg-[#1a1a1a] flex flex-col items-center pt-5 border-r border-[#333] shrink-0">
      {/* Logo */}
      <div className="font-black text-[#ccff00] text-xl mb-10 tracking-tighter">
        RG.
      </div>

      {/* 一级导航 */}
      {categories.map((category) => (
        <NavItem
          key={category.id}
          category={category}
          isActive={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
        />
      ))}
    </nav>
  )
}

interface NavItemProps {
  category: Category
  isActive: boolean
  onClick: () => void
}

function NavItem({ category, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex flex-col items-center justify-center py-5 cursor-pointer
        transition-all duration-300 border-l-[3px]
        ${isActive
          ? 'text-[#ccff00] border-[#ccff00]'
          : 'text-[#888] border-transparent hover:text-white hover:bg-white/5'
        }
      `}
    >
      <svg className="w-6 h-6 mb-2 fill-current" viewBox="0 0 24 24">
        <path d={category.icon} />
      </svg>
      <span className="text-xs font-medium">{category.name}</span>
    </button>
  )
}
