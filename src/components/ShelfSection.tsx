'use client'

import { useRef } from 'react'
import { AssetCard, type Asset } from './AssetCard'
import type { Shelf } from '@/config/categories'

interface ShelfSectionProps {
  shelf: Shelf
  assets: Asset[]
  onAddToMoodboard?: (asset: Asset) => void
}

export function ShelfSection({ shelf, assets, onAddToMoodboard }: ShelfSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -420, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 420, behavior: 'smooth' })
    }
  }

  if (assets.length === 0) {
    return null
  }

  return (
    <section className="mb-10">
      {/* 货架标题 */}
      <div className="flex items-baseline mb-4">
        <h2 className="text-lg font-bold text-white mr-3">
          {shelf.name} / {shelf.nameEn}
        </h2>
        <span className="text-sm text-[#888]">{shelf.description}</span>
      </div>

      {/* 货架内容区 - 横向滚动 */}
      <div className="relative group">
        {/* 渐变遮罩提示可滚动 */}
        <div
          className="
            pointer-events-none absolute inset-y-0 right-0 w-24 z-10
            bg-gradient-to-l from-[#121212] to-transparent
          "
        />

        {/* 左右滚动按钮 */}
        <button
          onClick={scrollLeft}
          className="
            absolute left-0 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 rounded-full bg-black/70 text-white
            opacity-0 group-hover:opacity-100 transition-opacity
            flex items-center justify-center hover:bg-[#ccff00] hover:text-black
          "
        >
          ←
        </button>
        <button
          onClick={scrollRight}
          className="
            absolute right-0 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 rounded-full bg-black/70 text-white
            opacity-0 group-hover:opacity-100 transition-opacity
            flex items-center justify-center hover:bg-[#ccff00] hover:text-black
          "
        >
          →
        </button>

        {/* 横向滚动行 */}
        <div
          ref={scrollRef}
          className="
            flex gap-4 overflow-x-auto py-2.5 pr-24
            scrollbar-hide scroll-smooth
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onAddToMoodboard={onAddToMoodboard}
            />
          ))}

          {/* 查看更多 */}
          <div className="min-w-[100px] flex items-center justify-center text-[#888] text-sm cursor-pointer hover:text-[#ccff00] transition-colors">
            查看更多 &gt;
          </div>
        </div>
      </div>
    </section>
  )
}
