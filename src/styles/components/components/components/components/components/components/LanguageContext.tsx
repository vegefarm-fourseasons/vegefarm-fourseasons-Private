import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { trackLanguageChange } from './ConversionTracker';
import { Language, Translations, TranslationData } from '../translations/types';
import { FontOptimizer } from './FontOptimizer';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ローカルストレージのキー
const LANGUAGE_STORAGE_KEY = 'vegifarm-language-preference';

// ブラウザの言語設定から推測
function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('vi')) return 'vi';
  if (browserLang.startsWith('tl')) return 'tl';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('ne')) return 'ne';
  if (browserLang.startsWith('id')) return 'id';
  if (browserLang.startsWith('th')) return 'th';
  return 'en'; // デフォルトは英語
}

// ローカルストレージから言語設定を取得
function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isValidLanguage(stored)) {
      return stored as Language;
    }
  } catch (error) {
    console.error('Failed to read language from localStorage:', error);
  }
  return detectBrowserLanguage();
}

function isValidLanguage(lang: string): boolean {
  const validLanguages: Language[] = ['ja', 'en', 'zh', 'ko', 'vi', 'tl', 'pt', 'ne', 'id', 'th'];
  return validLanguages.includes(lang as Language);
}

// 翻訳キャッシュ（メモリ）
const translationCache = new Map<Language, TranslationData>();

/**
 * 言語ファイルを動的にインポート
 * 一度ロードした言語はキャッシュに保存
 */
async function loadTranslations(lang: Language): Promise<TranslationData> {
  // キャッシュをチェック
  if (translationCache.has(lang)) {
    return translationCache.get(lang)!;
  }

  try {
    let module;
    
    // 明示的なインポート（Viteの静的解析のため）
    switch (lang) {
      case 'ja':
        module = await import('../translations/ja');
        break;
      case 'en':
        module = await import('../translations/en');
        break;
      case 'zh':
        module = await import('../translations/zh');
        break;
      case 'ko':
        module = await import('../translations/ko');
        break;
      case 'vi':
        module = await import('../translations/vi');
        break;
      case 'tl':
        module = await import('../translations/tl');
        break;
      case 'pt':
        module = await import('../translations/pt');
        break;
      case 'ne':
        module = await import('../translations/ne');
        break;
      case 'id':
        module = await import('../translations/id');
        break;
      case 'th':
        module = await import('../translations/th');
        break;
      default:
        throw new Error(`Unsupported language: ${lang}`);
    }
    
    const translations = module.default || module[lang];
    
    // キャッシュに保存
    translationCache.set(lang, translations);
    
    return translations;
  } catch (error) {
    console.warn(`Translation file not found for language: ${lang}, using fallback...`);
    
    // 最終フォールバック: 日本語を読み込む
    if (lang !== 'ja') {
      console.warn(`Falling back to Japanese translations`);
      return loadTranslations('ja');
    }
    
    // 日本語も失敗した場合は空のオブジェクトを返す
    console.error('Fatal: Could not load any translations');
    return {} as TranslationData;
  }
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<TranslationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 翻訳をロード（最適化版：即座に切り替え）
  useEffect(() => {
    let isMounted = true;
    
    async function fetchTranslations() {
      const startTime = performance.now();
      
      // キャッシュがあれば即座に適用（0ms）
      if (translationCache.has(language)) {
        const cachedData = translationCache.get(language)!;
        if (isMounted) {
          setTranslations(cachedData);
          setIsLoading(false);
        }
        const duration = performance.now() - startTime;
        console.log(`✅ Language switch to ${language}: ${duration.toFixed(2)}ms (cached)`);
        return;
      }
      
      // キャッシュがない場合のみロード
      setIsLoading(true);
      try {
        const data = await loadTranslations(language);
        if (isMounted) {
          setTranslations(data);
        }
        const duration = performance.now() - startTime;
        console.log(`✅ Language loaded ${language}: ${duration.toFixed(2)}ms`);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTranslations();

    return () => {
      isMounted = false;
    };
  }, [language]);

  // 言語変更時の処理
  useEffect(() => {
    // HTML lang属性を更新（SEO対策）
    document.documentElement.lang = language;
    
    // ローカルストレージに保存
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Failed to save language to localStorage:', error);
    }
  }, [language]);

  // 初回ロード後、即座に全言語を並列プリロード（超高速化）
  useEffect(() => {
    if (!translations) return;
    
    // 全言語を並列で即座にロード
    const preloadAllLanguages = async () => {
      const allLanguages: Language[] = ['ja', 'en', 'zh', 'ko', 'vi', 'tl', 'pt', 'ne', 'id', 'th'];
      const otherLanguages = allLanguages.filter(lang => lang !== language && !translationCache.has(lang));
      
      if (otherLanguages.length === 0) {
        console.log('✅ All languages already cached');
        return;
      }
      
      console.log(`🚀 Preloading ${otherLanguages.length} languages in parallel...`);
      const startTime = performance.now();
      
      // 全言語を並列でロード（Promise.all）
      const loadPromises = otherLanguages.map(async (lang) => {
        try {
          await loadTranslations(lang);
          console.log(`✅ Preloaded: ${lang}`);
          return { lang, success: true };
        } catch (error) {
          console.warn(`❌ Failed to preload ${lang}:`, error);
          return { lang, success: false };
        }
      });
      
      const results = await Promise.all(loadPromises);
      const duration = performance.now() - startTime;
      const successCount = results.filter(r => r.success).length;
      
      console.log(`🎉 Preloaded ${successCount}/${otherLanguages.length} languages in ${duration.toFixed(0)}ms`);
      console.log('⚡ Language switching will now be instant (< 5ms)!');
    };
    
    // 即座に実行（遅延なし）
    preloadAllLanguages();
  }, [translations, language]);

  // 言語設定関数
  const setLanguage = useCallback((lang: Language) => {
    if (isValidLanguage(lang)) {
      setLanguageState(lang);
      // コンバージョン追跡
      trackLanguageChange(lang);
    } else {
      console.error(`Invalid language: ${lang}`);
    }
  }, []);

  // 翻訳関数
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    if (!translations) {
      return key;
    }

    let translation = translations[key as keyof Translations];
    if (!translation) {
      // 開発環境では警告を出力
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
      }
      return key;
    }
    
    // パラメータを置換（{count}、{stock}、{amount}など）
    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), String(params[param]));
      });
    }
    
    return translation;
  }, [translations, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      <FontOptimizer language={language} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// 後方互換性のためのエクスポート
export type { Language };
