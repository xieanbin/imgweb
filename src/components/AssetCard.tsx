'use client'

import { useState } from 'react'
import Image from 'next/image'

export interface Asset {
  id: number
  title: string
  image_url: string
  category_id: string
  subcategory_id: string
  shelf_id: string
  tags: string[]
  view_count: number
  download_count: number
  favorite_count: number
}

interface AssetCardProps {
  asset: Asset
  onAddToMoodboard?: (asset: Asset) => void
}

export function AssetCard({ asset, onAddToMoodboard }: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        min-w-[200px] h-[280px] bg-[#2a2a2a] rounded-lg overflow-hidden relative cursor-pointer
        transition-all duration-300 border border-[#333]
        ${isHovered ? 'scale-110 -translate-y-1 z-10 shadow-2xl border-[#ccff00]' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 图片 */}
      <div className="relative w-full h-full">
        <Image
          src={asset.image_url}
          alt={asset.title}
          fill
          className={`object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}
          sizes="200px"
        />
      </div>

      {/* 悬停操作按钮 */}
      <div
        className={`
          absolute bottom-2.5 right-2.5 flex gap-2
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <MiniButton
          icon="📌"
          onClick={() => onAddToMoodboard?.(asset)}
        />
        <MiniButton
          icon="🔍"
          onClick={() => console.log('View detail:', asset.id)}
        />
      </div>
    </div>
  )
}

interface MiniButtonProps {
  icon: string
  onClick: () => void
}

function MiniButton({ icon, onClick }: MiniButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="w-[30px] h-[30px] rounded-full bg-black/80 text-white flex items-center justify-center text-sm hover:bg-[#ccff00] hover:text-black transition-colors"
    >
      {icon}
    </button>
  )
}
