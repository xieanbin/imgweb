'use client'

import { useState } from 'react'
import Image from 'next/image'
import { type Asset } from './AssetCard'

interface CompactGridProps {
    assets: Asset[]
    onAssetClick?: (asset: Asset) => void
    onAddToMoodboard?: (asset: Asset) => void
}

export function CompactGrid({ assets, onAssetClick, onAddToMoodboard }: CompactGridProps) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-0.5 p-1 content-start">
            {assets.map((asset) => (
                <CompactAssetItem
                    key={asset.id}
                    asset={asset}
                    onClick={() => onAssetClick?.(asset)}
                    onAddToMoodboard={() => onAddToMoodboard?.(asset)}
                />
            ))}
        </div>
    )
}

function CompactAssetItem({
    asset,
    onClick,
    onAddToMoodboard
}: {
    asset: Asset
    onClick: () => void
    onAddToMoodboard: () => void
}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className={`
        relative aspect-square bg-[#2a2a2a] overflow-hidden cursor-pointer
        border border-transparent hover:border-[#ccff00]/50 hover:z-10
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <Image
                src={asset.image_url}
                alt={asset.title}
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                sizes="60px"
                loading="lazy"
            />

            {/* Hover Overlay */}
            {isHovered && (
                <div className="absolute inset-0 bg-black/10 flex items-end justify-end p-0.5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToMoodboard()
                        }}
                        className="w-4 h-4 rounded-sm bg-[#ccff00] text-black flex items-center justify-center text-[10px] font-bold hover:bg-white"
                        title="Add to Moodboard"
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    )
}
