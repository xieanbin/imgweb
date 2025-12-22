'use client'

import Link from 'next/link'
import { categories, type Category } from '@/config/categories'

interface SidebarProps {
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <nav className="w-[64px] bg-[#1a1a1a] flex flex-col items-center pt-3 border-r border-[#333] shrink-0">
      {/* Logo */}
      <div className="font-black text-[#ccff00] text-lg mb-6 tracking-tighter">
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

      {/* View Mode Switcher */}
      <div className="mt-auto mb-3 w-full flex flex-col items-center gap-1">
        <div className="w-8 h-px bg-[#333] mb-1" />
        <ModeLink href="/" icon="M4 6h16v12H4z" label="Gallery" title="Showcase View" />
        <ModeLink href="/creator" icon="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" label="Grid" title="Creator View" />
      </div>
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
        w-full flex flex-col items-center justify-center py-3 cursor-pointer
        transition-all duration-300 border-l-[2px]
        ${isActive
          ? 'text-[#ccff00] border-[#ccff00]'
          : 'text-[#888] border-transparent hover:text-white hover:bg-white/5'
        }
      `}
    >
      <svg className="w-5 h-5 mb-1 fill-current" viewBox="0 0 24 24">
        <path d={category.icon} />
      </svg>
      <span className="text-[10px] font-medium leading-tight">{category.name}</span>
    </button>
  )
}


function ModeLink({ href, icon, label, title }: { href: string; icon: string; label: string; title: string }) {
  return (
    <Link
      href={href}
      title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-[#ccff00] hover:bg-white/5 transition-colors"
    >
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d={icon} />
      </svg>
    </Link>
  )
}
