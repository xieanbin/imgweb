import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category') || 'expression'
  const subcategory = searchParams.get('subcategory') || 'all'
  const sort = searchParams.get('sort') || 'popular'

  try {
    let query = supabase
      .from('assets')
      .select('*')
      .eq('category_id', category)

    // 筛选子分类
    if (subcategory !== 'all') {
      query = query.eq('subcategory_id', subcategory)
    }

    // 排序
    if (sort === 'popular') {
      query = query.order('download_count', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // 限制数量
    query = query.limit(100)

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ assets: [], error: error.message }, { status: 500 })
    }

    // 处理 tags 字段 (JSONB -> string[])
    const assets = (data || []).map(item => ({
      ...item,
      tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags || []
    }))

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ assets: [], error: 'Internal server error' }, { status: 500 })
  }
}
