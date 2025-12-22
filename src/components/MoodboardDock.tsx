'use client'

import { type Asset } from './AssetCard'

interface MoodboardDockProps {
  assets: Asset[]
  onClear: () => void
}

export function MoodboardDock({ assets, onClear }: MoodboardDockProps) {
  if (assets.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-5 right-10 bg-[#1e1e1e]/90 backdrop-blur-sm border border-[#444] rounded-xl p-4 flex items-center gap-4 shadow-2xl z-50">
      {/* 信息 */}
      <div className="flex flex-col">
        <span className="text-xs font-bold text-white">灵感板</span>
        <span className="text-[10px] text-[#888]">已存 {assets.length} 张</span>
      </div>

      {/* 缩略图预览 (最多显示3个) */}
      <div className="flex -space-x-4">
        {assets.slice(0, 3).map((asset, index) => (
          <div
            key={asset.id}
            className="w-10 h-10 rounded-md border-2 border-[#333] bg-[#555] overflow-hidden"
            style={{ zIndex: 3 - index }}
          >
            <img
              src={asset.image_url}
              alt={asset.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {assets.length > 3 && (
          <div className="w-10 h-10 rounded-md border-2 border-[#333] bg-[#444] flex items-center justify-center text-xs text-white">
            +{assets.length - 3}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <button
        onClick={onClear}
        className="px-2 py-1 text-xs text-[#888] hover:text-white transition-colors"
      >
        清空
      </button>
      <button className="bg-[#ccff00] text-black px-4 py-2 rounded-md font-bold text-xs hover:bg-[#b8e600] transition-colors">
        下载拼图
      </button>
    </div>
  )
}
