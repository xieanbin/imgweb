'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { CompactGrid } from '@/components/CompactGrid'
import { MoodboardDock } from '@/components/MoodboardDock'
import { type Asset } from '@/components/AssetCard'
import {
    findCategoryById,
    getDefaultCategory,
} from '@/config/categories'

export default function CreatorPage() {
    // State Management
    const [activeCategory, setActiveCategory] = useState(getDefaultCategory().id)
    const [activeSubcategory, setActiveSubcategory] = useState('all')
    const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular')
    const [assets, setAssets] = useState<Asset[]>([])
    const [moodboard, setMoodboard] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)

    // Get Current Category
    const currentCategory = findCategoryById(activeCategory) || getDefaultCategory()

    // Fetch Assets
    const fetchAssets = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                category: activeCategory,
                subcategory: activeSubcategory,
                sort: sortBy,
            })
            const res = await fetch(`/api/assets?${params}`)
            const data = await res.json()
            setAssets(data.assets || [])
        } catch (error) {
            console.error('Failed to fetch assets:', error)
            setAssets([])
        } finally {
            setLoading(false)
        }
    }, [activeCategory, activeSubcategory, sortBy])

    useEffect(() => {
        fetchAssets()
    }, [fetchAssets])

    // Handle Category Change
    const handleCategoryChange = (categoryId: string) => {
        setActiveCategory(categoryId)
        setActiveSubcategory('all')
    }

    // Add to Moodboard
    const handleAddToMoodboard = (asset: Asset) => {
        if (!moodboard.find(a => a.id === asset.id)) {
            setMoodboard([...moodboard, asset])
        }
    }

    // Clear Moodboard
    const handleClearMoodboard = () => {
        setMoodboard([])
    }

    return (
        <div className="h-screen flex overflow-hidden bg-[#0a0a0a]">
            {/* Sidebar - Reused */}
            <Sidebar
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* TopBar - Reused but contextually appropriate */}
                <TopBar
                    category={currentCategory}
                    activeSubcategory={activeSubcategory}
                    onSubcategoryChange={setActiveSubcategory}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                {/* Content Area - Compact Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-[#555]">
                            Loading assets...
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#555]">
                            <div className="text-4xl mb-2">📂</div>
                            <p>No assets found.</p>
                        </div>
                    ) : (
                        <div className="p-1 pb-20">
                            {/* Group assets by shelf to add structure */}
                            {currentCategory.subcategories.flatMap(sub => sub.shelves).map(shelf => {
                                // If a specific subcategory is selected, only show its shelves
                                if (activeSubcategory !== 'all') {
                                    const sub = currentCategory.subcategories.find(s => s.id === activeSubcategory)
                                    if (!sub?.shelves.find(s => s.id === shelf.id)) return null
                                }

                                const shelfAssets = assets.filter(a => a.shelf_id === shelf.id)
                                if (shelfAssets.length === 0) return null

                                return (
                                    <div key={shelf.id} className="mb-2">
                                        <div className="px-2 py-1 flex items-baseline gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                            <h3 className="text-[#ccc] text-[10px] font-bold uppercase tracking-widest">{shelf.name}</h3>
                                            <span className="text-[#666] text-[9px] uppercase tracking-tighter">{shelf.nameEn}</span>
                                            <div className="flex-1 h-px bg-[#222] mx-2" />
                                            <span className="text-[9px] text-[#444] font-mono">{shelfAssets.length}</span>
                                        </div>
                                        <CompactGrid
                                            assets={shelfAssets}
                                            onAddToMoodboard={handleAddToMoodboard}
                                            onAssetClick={(a) => console.log('View', a)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Moodboard Dock */}
            <MoodboardDock
                assets={moodboard}
                onClear={handleClearMoodboard}
            />
        </div>
    )
}
