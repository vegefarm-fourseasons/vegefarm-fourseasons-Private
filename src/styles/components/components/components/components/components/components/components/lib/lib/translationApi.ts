import { supabase, isSupabaseConfigured, TranslationFeedback, TranslationReview, TranslationQualityReport } from './supabase';
import { toast } from 'sonner@2.0.3';

/**
 * 翻訳フィードバックAPI
 */
export const translationFeedbackApi = {
  /**
   * フィードバックを送信
   */
  async create(feedback: Omit<TranslationFeedback, 'id' | 'created_at' | 'updated_at'>): Promise<TranslationFeedback | null> {
    if (!isSupabaseConfigured()) {
      // Supabaseが設定されていない場合、ローカルストレージに保存
      console.warn('Supabase not configured, saving to localStorage');
      const localFeedback = JSON.parse(localStorage.getItem('translation-feedback') || '[]');
      const newFeedback = {
        ...feedback,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      localFeedback.push(newFeedback);
      localStorage.setItem('translation-feedback', JSON.stringify(localFeedback));
      return newFeedback;
    }

    const { data, error } = await supabase
      .from('translation_feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      console.error('Error creating feedback:', error);
      toast.error('フィードバックの送信に失敗しました');
      return null;
    }

    // Slack通知を送信（環境変数が設定されている場合）
    await sendSlackNotification(data);

    return data;
  },

  /**
   * すべてのフィードバックを取得
   */
  async getAll(limit = 100): Promise<TranslationFeedback[]> {
    if (!isSupabaseConfigured()) {
      const localFeedback = JSON.parse(localStorage.getItem('translation-feedback') || '[]');
      return localFeedback.slice(0, limit);
    }

    const { data, error } = await supabase
      .from('translation_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }

    return data || [];
  },

  /**
   * ステータスでフィルタリング
   */
  async getByStatus(status: TranslationFeedback['status'], limit = 100): Promise<TranslationFeedback[]> {
    if (!isSupabaseConfigured()) {
      const localFeedback = JSON.parse(localStorage.getItem('translation-feedback') || '[]');
      return localFeedback.filter((f: TranslationFeedback) => f.status === status).slice(0, limit);
    }

    const { data, error } = await supabase
      .from('translation_feedback')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching feedback by status:', error);
      return [];
    }

    return data || [];
  },

  /**
   * 言語でフィルタリング
   */
  async getByLanguage(language: string, limit = 100): Promise<TranslationFeedback[]> {
    if (!isSupabaseConfigured()) {
      const localFeedback = JSON.parse(localStorage.getItem('translation-feedback') || '[]');
      return localFeedback.filter((f: TranslationFeedback) => f.language === language).slice(0, limit);
    }

    const { data, error } = await supabase
      .from('translation_feedback')
      .select('*')
      .eq('language', language)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching feedback by language:', error);
      return [];
    }

    return data || [];
  },

  /**
   * フィードバックを更新
   */
  async update(id: string, updates: Partial<TranslationFeedback>): Promise<TranslationFeedback | null> {
    if (!isSupabaseConfigured()) {
      const localFeedback = JSON.parse(localStorage.getItem('translation-feedback') || '[]');
      const index = localFeedback.findIndex((f: TranslationFeedback) => f.id === id);
      if (index !== -1) {
        localFeedback[index] = { ...localFeedback[index], ...updates };
        localStorage.setItem('translation-feedback', JSON.stringify(localFeedback));
        return localFeedback[index];
      }
      return null;
    }

    const { data, error } = await supabase
      .from('translation_feedback')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating feedback:', error);
      toast.error('フィードバックの更新に失敗しました');
      return null;
    }

    return data;
  },

  /**
   * 統計情報を取得
   */
  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byLanguage: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const feedback = await this.getAll(1000);
    
    const stats = {
      total: feedback.length,
      byStatus: {} as Record<string, number>,
      byLanguage: {} as Record<string, number>,
      byType: {} as Record<string, number>,
    };

    feedback.forEach(f => {
      // ステータス別
      stats.byStatus[f.status || 'pending'] = (stats.byStatus[f.status || 'pending'] || 0) + 1;
      
      // 言語別
      stats.byLanguage[f.language] = (stats.byLanguage[f.language] || 0) + 1;
      
      // タイプ別
      stats.byType[f.type] = (stats.byType[f.type] || 0) + 1;
    });

    return stats;
  },
};

/**
 * 翻訳レビューAPI
 */
export const translationReviewApi = {
  /**
   * レビューを作成
   */
  async create(review: Omit<TranslationReview, 'id' | 'created_at' | 'updated_at'>): Promise<TranslationReview | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, review not saved');
      return null;
    }

    const { data, error } = await supabase
      .from('translation_reviews')
      .insert([review])
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      toast.error('レビューの保存に失敗しました');
      return null;
    }

    return data;
  },

  /**
   * すべてのレビューを取得
   */
  async getAll(limit = 100): Promise<TranslationReview[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('translation_reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data || [];
  },

  /**
   * レビューを承認
   */
  async approve(id: string, approverEmail: string): Promise<TranslationReview | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const { data, error } = await supabase
      .from('translation_reviews')
      .update({
        status: 'approved',
        approved_by: approverEmail,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error approving review:', error);
      toast.error('レビューの承認に失敗しました');
      return null;
    }

    return data;
  },
};

/**
 * 品質レポートAPI
 */
export const qualityReportApi = {
  /**
   * レポートを保存
   */
  async create(report: Omit<TranslationQualityReport, 'id' | 'created_at'>): Promise<TranslationQualityReport | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, report not saved');
      return null;
    }

    const { data, error } = await supabase
      .from('translation_quality_reports')
      .insert([report])
      .select()
      .single();

    if (error) {
      console.error('Error creating quality report:', error);
      return null;
    }

    return data;
  },

  /**
   * 最新のレポートを取得
   */
  async getLatest(limit = 10): Promise<TranslationQualityReport[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('translation_quality_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching quality reports:', error);
      return [];
    }

    return data || [];
  },
};

/**
 * 環境変数の安全な取得
 */
const getEnvVar = (key: string): string => {
  try {
    return import.meta?.env?.[key] || '';
  } catch (error) {
    return '';
  }
};

/**
 * Slack通知を送信
 */
async function sendSlackNotification(feedback: TranslationFeedback): Promise<void> {
  const webhookUrl = getEnvVar('VITE_SLACK_WEBHOOK_URL');
  
  if (!webhookUrl) {
    return; // Slack未設定の場合はスキップ
  }

  const typeEmoji = {
    improvement: '💡',
    error: '❌',
    unclear: '❓',
  };

  const message = {
    text: '新しい翻訳フィードバックが届きました',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${typeEmoji[feedback.type]} 新しい翻訳フィードバック`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*言語:*\n${feedback.language}`,
          },
          {
            type: 'mrkdwn',
            text: `*タイプ:*\n${feedback.type}`,
          },
          {
            type: 'mrkdwn',
            text: `*ページ:*\n${feedback.page}`,
          },
          {
            type: 'mrkdwn',
            text: `*キー:*\n${feedback.translation_key || 'N/A'}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*提案内容:*\n${feedback.suggestion}`,
        },
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}

/**
 * メール通知を送信（将来の拡張用）
 */
export async function sendEmailNotification(feedback: TranslationFeedback): Promise<void> {
  // Resend、SendGrid、またはSupabase Functionsを使用して実装
  console.log('Email notification:', feedback);
}
