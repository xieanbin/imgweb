-- 插入测试数据
-- 每个 shelf 插入 6-10 条数据

-- ============ 表情 - 笑 ============

-- 微笑 (smirk)
INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('微笑-01', 'https://placehold.co/512x512/2a2a2a/666?text=Smirk+01', 'expression', 'happy', 'smirk', '["sketch", "female", "含蓄"]'),
('微笑-02', 'https://placehold.co/512x512/333/777?text=Smirk+02', 'expression', 'happy', 'smirk', '["sketch", "male", "自信"]'),
('微笑-03', 'https://placehold.co/512x512/2a2a2a/666?text=Smirk+03', 'expression', 'happy', 'smirk', '["sketch", "female", "讽刺"]'),
('微笑-04', 'https://placehold.co/512x512/333/777?text=Smirk+04', 'expression', 'happy', 'smirk', '["sketch", "male", "淡然"]'),
('微笑-05', 'https://placehold.co/512x512/2a2a2a/666?text=Smirk+05', 'expression', 'happy', 'smirk', '["sketch", "neutral", "神秘"]'),
('微笑-06', 'https://placehold.co/512x512/333/777?text=Smirk+06', 'expression', 'happy', 'smirk', '["sketch", "female", "优雅"]');

-- 露齿笑 (grin)
INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('露齿笑-01', 'https://placehold.co/512x512/333/888?text=Grin+01', 'expression', 'happy', 'grin', '["sketch", "male", "阳光"]'),
('露齿笑-02', 'https://placehold.co/512x512/2a2a2a/777?text=Grin+02', 'expression', 'happy', 'grin', '["sketch", "female", "开朗"]'),
('露齿笑-03', 'https://placehold.co/512x512/333/888?text=Grin+03', 'expression', 'happy', 'grin', '["sketch", "male", "假笑"]'),
('露齿笑-04', 'https://placehold.co/512x512/2a2a2a/777?text=Grin+04', 'expression', 'happy', 'grin', '["sketch", "female", "灿烂"]'),
('露齿笑-05', 'https://placehold.co/512x512/333/888?text=Grin+05', 'expression', 'happy', 'grin', '["sketch", "neutral", "友好"]');

-- 大笑 (laugh)
INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('大笑-01', 'https://placehold.co/512x512/1a1a1a/555?text=Laugh+01', 'expression', 'happy', 'laugh', '["sketch", "male", "狂喜"]'),
('大笑-02', 'https://placehold.co/512x512/222/666?text=Laugh+02', 'expression', 'happy', 'laugh', '["sketch", "female", "捧腹"]'),
('大笑-03', 'https://placehold.co/512x512/1a1a1a/555?text=Laugh+03', 'expression', 'happy', 'laugh', '["sketch", "male", "失控"]'),
('大笑-04', 'https://placehold.co/512x512/222/666?text=Laugh+04', 'expression', 'happy', 'laugh', '["sketch", "female", "爆笑"]'),
('大笑-05', 'https://placehold.co/512x512/1a1a1a/555?text=Laugh+05', 'expression', 'happy', 'laugh', '["sketch", "neutral", "畅快"]');

-- ============ 表情 - 哭 ============

-- 流泪 (tear)
INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('流泪-01', 'https://placehold.co/512x512/2a3a4a/889?text=Tear+01', 'expression', 'sad', 'tear', '["sketch", "female", "伤感"]'),
('流泪-02', 'https://placehold.co/512x512/3a4a5a/99a?text=Tear+02', 'expression', 'sad', 'tear', '["sketch", "male", "委屈"]'),
('流泪-03', 'https://placehold.co/512x512/2a3a4a/889?text=Tear+03', 'expression', 'sad', 'tear', '["sketch", "female", "感动"]'),
('流泪-04', 'https://placehold.co/512x512/3a4a5a/99a?text=Tear+04', 'expression', 'sad', 'tear', '["sketch", "neutral", "无奈"]');

-- 抽泣 (sob)
INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('抽泣-01', 'https://placehold.co/512x512/3a3a4a/778?text=Sob+01', 'expression', 'sad', 'sob', '["sketch", "female", "悲伤"]'),
('抽泣-02', 'https://placehold.co/512x512/4a4a5a/889?text=Sob+02', 'expression', 'sad', 'sob', '["sketch", "male", "压抑"]'),
('抽泣-03', 'https://placehold.co/512x512/3a3a4a/778?text=Sob+03', 'expression', 'sad', 'sob', '["sketch", "female", "隐忍"]');

-- ============ 表情 - 怒 ============

-- 不悦 (annoyed)
INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('不悦-01', 'https://placehold.co/512x512/4a3a3a/987?text=Annoyed+01', 'expression', 'angry', 'annoyed', '["sketch", "female", "不满"]'),
('不悦-02', 'https://placehold.co/512x512/5a4a4a/a98?text=Annoyed+02', 'expression', 'angry', 'annoyed', '["sketch", "male", "皱眉"]'),
('不悦-03', 'https://placehold.co/512x512/4a3a3a/987?text=Annoyed+03', 'expression', 'angry', 'annoyed', '["sketch", "neutral", "嫌弃"]');

-- 愤怒 (furious)
INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('愤怒-01', 'https://placehold.co/512x512/5a2a2a/c87?text=Furious+01', 'expression', 'angry', 'furious', '["sketch", "male", "暴怒"]'),
('愤怒-02', 'https://placehold.co/512x512/6a3a3a/d98?text=Furious+02', 'expression', 'angry', 'furious', '["sketch", "female", "咆哮"]'),
('愤怒-03', 'https://placehold.co/512x512/5a2a2a/c87?text=Furious+03', 'expression', 'angry', 'furious', '["sketch", "male", "怒视"]');

-- ============ 动作 - 站立 ============

INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('休闲站-01', 'https://placehold.co/512x680/2a4a2a/8a8?text=CasualStand+01', 'action', 'standing', 'casual-stand', '["sketch", "male", "放松", "全身"]'),
('休闲站-02', 'https://placehold.co/512x680/3a5a3a/9b9?text=CasualStand+02', 'action', 'standing', 'casual-stand', '["sketch", "female", "自然", "全身"]'),
('休闲站-03', 'https://placehold.co/512x680/2a4a2a/8a8?text=CasualStand+03', 'action', 'standing', 'casual-stand', '["sketch", "male", "插袋", "全身"]'),
('正式站-01', 'https://placehold.co/512x680/4a4a5a/aab?text=FormalStand+01', 'action', 'standing', 'formal-stand', '["sketch", "male", "挺拔", "全身"]'),
('正式站-02', 'https://placehold.co/512x680/5a5a6a/bbc?text=FormalStand+02', 'action', 'standing', 'formal-stand', '["sketch", "female", "庄重", "全身"]');

-- ============ 动作 - 战斗 ============

INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('拳击-01', 'https://placehold.co/512x680/5a3a2a/ca8?text=Punch+01', 'action', 'combat', 'punch', '["sketch", "male", "出拳", "全身"]'),
('拳击-02', 'https://placehold.co/512x680/6a4a3a/db9?text=Punch+02', 'action', 'combat', 'punch', '["sketch", "female", "防守", "全身"]'),
('踢腿-01', 'https://placehold.co/512x680/5a4a3a/ba9?text=Kick+01', 'action', 'combat', 'kick', '["sketch", "male", "侧踢", "全身"]'),
('武器-01', 'https://placehold.co/512x680/4a3a4a/9a9?text=Weapon+01', 'action', 'combat', 'weapon', '["sketch", "male", "挥剑", "全身"]'),
('武器-02', 'https://placehold.co/512x680/5a4a5a/aba?text=Weapon+02', 'action', 'combat', 'weapon', '["sketch", "female", "射箭", "全身"]');

-- ============ 职业 - 战士 ============

INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('骑士-01', 'https://placehold.co/512x680/4a4a4a/999?text=Knight+01', 'profession', 'warrior', 'knight', '["sketch", "male", "铠甲", "全身"]'),
('骑士-02', 'https://placehold.co/512x680/5a5a5a/aaa?text=Knight+02', 'profession', 'warrior', 'knight', '["sketch", "female", "长剑", "全身"]'),
('武士-01', 'https://placehold.co/512x680/3a3a4a/889?text=Samurai+01', 'profession', 'warrior', 'samurai', '["sketch", "male", "和风", "全身"]'),
('武士-02', 'https://placehold.co/512x680/4a4a5a/99a?text=Samurai+02', 'profession', 'warrior', 'samurai', '["sketch", "male", "武士刀", "全身"]');

-- ============ 构图 - 视角 ============

INSERT INTO assets (title, image_url, category_id, subcategory_id, shelf_id, tags) VALUES
('俯视-01', 'https://placehold.co/512x512/3a4a3a/8a9?text=TopDown+01', 'composition', 'angle', 'top-down', '["sketch", "俯视", "构图"]'),
('俯视-02', 'https://placehold.co/512x512/4a5a4a/9ba?text=TopDown+02', 'composition', 'angle', 'top-down', '["sketch", "俯视", "构图"]'),
('仰视-01', 'https://placehold.co/512x512/4a3a4a/9a8?text=BottomUp+01', 'composition', 'angle', 'bottom-up', '["sketch", "仰视", "构图"]'),
('仰视-02', 'https://placehold.co/512x512/5a4a5a/ab9?text=BottomUp+02', 'composition', 'angle', 'bottom-up', '["sketch", "仰视", "构图"]'),
('鱼眼-01', 'https://placehold.co/512x512/5a5a3a/aaa?text=Fisheye+01', 'composition', 'angle', 'fisheye', '["sketch", "鱼眼", "广角", "构图"]');

-- 更新统计数据 (随机)
UPDATE assets SET
  view_count = floor(random() * 1000)::int,
  download_count = floor(random() * 100)::int,
  favorite_count = floor(random() * 50)::int;
