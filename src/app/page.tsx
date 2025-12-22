'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { ShelfSection } from '@/components/ShelfSection'
import { MoodboardDock } from '@/components/MoodboardDock'
import { type Asset } from '@/components/AssetCard'
import {
  findCategoryById,
  getDefaultCategory,
  type Shelf,
} from '@/config/categories'

export default function Home() {
  // 状态管理
  const [activeCategory, setActiveCategory] = useState(getDefaultCategory().id)
  const [activeSubcategory, setActiveSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular')
  const [assets, setAssets] = useState<Asset[]>([])
  const [moodboard, setMoodboard] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  // 获取当前分类
  const currentCategory = findCategoryById(activeCategory) || getDefaultCategory()

  // 获取资产数据
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

  // 切换分类时重置子分类
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setActiveSubcategory('all')
  }

  // 添加到灵感板
  const handleAddToMoodboard = (asset: Asset) => {
    if (!moodboard.find(a => a.id === asset.id)) {
      setMoodboard([...moodboard, asset])
    }
  }

  // 清空灵感板
  const handleClearMoodboard = () => {
    setMoodboard([])
  }

  // 按货架分组资产
  const getAssetsByShelf = (shelf: Shelf): Asset[] => {
    return assets.filter(asset => asset.shelf_id === shelf.id)
  }

  // 获取要显示的货架列表
  const getShelvesToDisplay = (): Shelf[] => {
    if (activeSubcategory === 'all') {
      // 显示所有子分类的货架
      return currentCategory.subcategories.flatMap(sub => sub.shelves)
    }
    // 只显示选中子分类的货架
    const sub = currentCategory.subcategories.find(s => s.id === activeSubcategory)
    return sub?.shelves || []
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* 左侧一级导航 */}
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部筛选栏 */}
        <TopBar
          category={currentCategory}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={setActiveSubcategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 内容滚动区 */}
        <div className="flex-1 overflow-y-auto py-5 px-10 pb-24">
          {loading ? (
            <div className="flex items-center justify-center h-full text-[#888]">
              加载中...
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#888]">
              <div className="text-4xl mb-2">📂</div>
              <p>暂无数据，请先执行数据库迁移</p>
              <p className="text-xs mt-2">运行 supabase/migrations 中的 SQL</p>
            </div>
          ) : (
            getShelvesToDisplay().map(shelf => (
              <ShelfSection
                key={shelf.id}
                shelf={shelf}
                assets={getAssetsByShelf(shelf)}
                onAddToMoodboard={handleAddToMoodboard}
              />
            ))
          )}
        </div>
      </div>

      {/* 悬浮灵感板 */}
      <MoodboardDock
        assets={moodboard}
        onClear={handleClearMoodboard}
      />
    </div>
  )
}
