-- 客户经理
CREATE TABLE IF NOT EXISTS public.managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  feishu_user_id TEXT,
  feishu_open_id TEXT,
  role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 公司
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credit_code TEXT,
  source_ids JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 经理-公司 多对多
CREATE TABLE IF NOT EXISTS public.manager_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(manager_id, company_id)
);

CREATE INDEX IF NOT EXISTS idx_manager_companies_manager ON public.manager_companies(manager_id);
CREATE INDEX IF NOT EXISTS idx_manager_companies_company ON public.manager_companies(company_id);

-- 信息条目
CREATE TABLE IF NOT EXISTS public.info_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT,
  source TEXT NOT NULL,
  raw JSONB,
  fetched_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_info_items_company ON public.info_items(company_id);
CREATE INDEX IF NOT EXISTS idx_info_items_fetched ON public.info_items(fetched_at DESC);

-- 推送配置
CREATE TABLE IF NOT EXISTS public.push_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  info_type TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('manager', 'feishu_group')),
  target_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.info_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_config ENABLE ROW LEVEL SECURITY;

-- 使用 anon key 的 API 可读全部（由 Next.js API 或 service_role 写）；若后续接 Supabase Auth 可改为按 user 过滤
CREATE POLICY "Allow read managers" ON public.managers FOR SELECT USING (true);
CREATE POLICY "Allow read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow read manager_companies" ON public.manager_companies FOR SELECT USING (true);
CREATE POLICY "Allow read info_items" ON public.info_items FOR SELECT USING (true);
CREATE POLICY "Allow read push_config" ON public.push_config FOR SELECT USING (true);

-- 写操作仅允许 service_role（由 Next API 用 service_role 调用）
-- 若需在 Supabase 控制台或 SQL 里直接改数据，可加：
-- CREATE POLICY "Allow all for service role" ON ... FOR ALL USING (auth.role() = 'service_role');
-- 默认 service_role 绕过 RLS，无需额外 policy

-- updated_at 触发器
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER managers_updated_at
  BEFORE UPDATE ON public.managers
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER push_config_updated_at
  BEFORE UPDATE ON public.push_config
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
