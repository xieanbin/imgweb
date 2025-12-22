-- 创建 assets 表
-- 用于存储图片资源信息

CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,

  -- 分类层级
  category_id VARCHAR(50) NOT NULL,      -- L1 一级分类 (expression/action/profession/composition)
  subcategory_id VARCHAR(50) NOT NULL,   -- L2 二级分类 (happy/sad/angry...)
  shelf_id VARCHAR(50) NOT NULL,         -- L3 三级分类 (smirk/grin/laugh...)

  -- 标签 (JSONB 支持灵活扩展)
  tags JSONB DEFAULT '[]'::jsonb,

  -- 统计信息
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,

  -- 元数据
  width INTEGER DEFAULT 512,
  height INTEGER DEFAULT 512,
  file_size INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 GIN 索引加速 JSONB 标签查询
CREATE INDEX IF NOT EXISTS idx_assets_tags ON assets USING GIN (tags);

-- 创建分类索引
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets (category_id, subcategory_id, shelf_id);

-- 创建时间索引 (用于排序)
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets (created_at DESC);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 添加注释
COMMENT ON TABLE assets IS '图片资源表';
COMMENT ON COLUMN assets.category_id IS 'L1 一级分类';
COMMENT ON COLUMN assets.subcategory_id IS 'L2 二级分类';
COMMENT ON COLUMN assets.shelf_id IS 'L3 三级分类/货架';
COMMENT ON COLUMN assets.tags IS '标签数组，支持多维筛选';
