import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

// 環境変数の安全な取得
const getEnvVar = (key: string): string => {
  try {
    return import.meta?.env?.[key] || '';
  } catch (error) {
    return '';
  }
};

// Supabase設定（環境変数またはinfo.tsxから取得）
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || `https://${projectId}.supabase.co`;
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || publicAnonKey;

// シングルトンインスタンス
let supabaseInstance: SupabaseClient | null = null;

// Supabaseクライアントの作成（シングルトンパターン）
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'vegifarm-auth',
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
})();

// Supabaseが設定されているかチェック
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && projectId);
};

// データベース型定義
export interface TranslationFeedback {
  id?: string;
  language: string;
  page: string;
  translation_key?: string;
  original_text?: string;
  suggestion: string;
  type: 'improvement' | 'error' | 'unclear';
  status?: 'pending' | 'reviewed' | 'applied' | 'rejected';
  user_email?: string;
  created_at?: string;
  updated_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

export interface TranslationReview {
  id?: string;
  translation_key: string;
  language: string;
  old_value?: string;
  new_value: string;
  reviewer_email: string;
  review_type: 'ui' | 'product';
  status?: 'pending' | 'approved' | 'applied' | 'rejected';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  approved_by?: string;
  approved_at?: string;
}

export interface TranslationQualityReport {
  id?: string;
  report_data: any;
  total_issues: number;
  errors: number;
  warnings: number;
  info: number;
  created_at?: string;
  created_by?: string;
}

export interface AdminUser {
  id?: string;
  email: string;
  role: 'admin' | 'reviewer' | 'translator';
  languages?: string[];
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface ProductReview {
  id?: string;
  product_id: string;
  product_name: string;
  rating: number;
  product_quality?: number | null;
  freshness?: number | null;
  delivery?: number | null;
  title?: string | null;
  review_text: string;
  reviewer_name?: string | null;
  reviewer_email: string;
  is_anonymous: boolean;
  is_verified_purchase?: boolean;
  helpful_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  approved_by?: string;
  approved_at?: string;
}
