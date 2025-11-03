import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Products } from "./components/Products";
import { Awards } from "./components/Awards";
import { About } from "./components/About";
import { ReviewsSection } from "./components/ReviewsSection";
import { HowToOrder } from "./components/HowToOrder";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { CartProvider } from "./components/CartContext";
import { Toaster } from "./components/ui/sonner";
import { SEO } from "./components/SEO";
import { DefaultBreadcrumbSchema } from "./components/BreadcrumbSchema";
import { DefaultFAQSchema } from "./components/FAQSchema";
import { PerformanceOptimizer } from "./components/PerformanceOptimizer";
import { ServiceWorkerRegistration } from "./components/ServiceWorkerRegistration";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Analytics } from "./components/Analytics";
import { IdleLoader } from "./components/IdleLoader";
import { SectionSkeleton, ProductsSkeleton, FooterSkeleton } from "./components/SkeletonLoader";
import { LanguageProvider } from "./components/LanguageContext";
import { LanguagePerformanceMonitor } from "./components/LanguagePerformanceMonitor";
import { AccessibilityChecker } from "./components/AccessibilityChecker";
import { ChatBot } from "./components/ChatBot";
import { TranslationFeedback } from "./components/TranslationFeedback";
import { TranslationManagementPage } from "./components/TranslationManagementPage";
import { ReviewAdminSetup } from "./components/ReviewAdminSetup";

/**
 * メインアプリケーション
 * 
 * パフォーマンス最適化戦略：
 * 1. Critical（即座）: Header, Hero - First Viewに必要
 * 2. High（最初のidle）: Features, Products - スクロールせずに見える可能性が高い
 * 3. Medium（次のidle）: Testimonials, About, HowToOrder - スクロールが必要
 * 4. Low（最後のidle）: CTA, Footer - ページ下部
 */



export default function App() {
  // URLパラメータで管理ページを判定（useStateを使わず直接判定）
  const params = new URLSearchParams(window.location.search);
  const adminParam = params.get('admin');
  const fixParam = params.get('fix');
  
  // デバッグ情報を出力（目立つように）
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 App.tsx: URLパラメータを確認');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  - admin:', adminParam);
  console.log('  - fix:', fixParam);
  console.log('  - Full URL:', window.location.href);
  console.log('  - Search:', window.location.search);
  
  const showAdminPage = adminParam === 'translations' || 
                     adminParam === 'reviews';
  
  console.log('  - showAdminPage:', showAdminPage);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 管理ページを表示
  if (showAdminPage) {
    console.log('🎯 管理ページを表示します');
    console.log('  - adminParam:', adminParam);
    
    return (
      <ErrorBoundary>
        <LanguageProvider>
          <CartProvider>
            {adminParam === 'translations' && <TranslationManagementPage />}
            {adminParam === 'reviews' && <ReviewAdminSetup />}
            <Toaster />
          </CartProvider>
        </LanguageProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <CartProvider>
        <SEO />
        <DefaultBreadcrumbSchema />
        <DefaultFAQSchema />
        <Analytics />
        <PerformanceOptimizer />
        <ServiceWorkerRegistration />
        <PerformanceMonitor />
        <LanguagePerformanceMonitor />
        <AccessibilityChecker />
        <div className="min-h-screen">
          {/* Critical: 即座に表示 */}
          <Header />
          
          <main>
            {/* Critical: ファーストビュー */}
            <Hero />
            
            {/* High Priority: スクロールなしで見える可能性が高い */}
            <IdleLoader priority="high" fallback={<SectionSkeleton height="h-96" />}>
              <Features />
            </IdleLoader>
            
            <IdleLoader priority="high" fallback={<ProductsSkeleton />}>
              <Products />
            </IdleLoader>
            
            {/* Medium Priority: 受賞歴 */}
            <IdleLoader priority="medium" fallback={<SectionSkeleton height="h-96" />}>
              <Awards />
            </IdleLoader>
            
            {/* Medium Priority: スクロールが必要 */}
            <IdleLoader priority="medium" fallback={<SectionSkeleton height="h-screen" />}>
              <About />
            </IdleLoader>
            
            {/* Medium Priority: お客様の声・レビュー */}
            <IdleLoader priority="medium" fallback={<SectionSkeleton height="h-96" />}>
              <ReviewsSection />
            </IdleLoader>
            
            <IdleLoader priority="medium" fallback={<SectionSkeleton height="h-96" />}>
              <HowToOrder />
            </IdleLoader>
            
            {/* Medium Priority: よくある質問 */}
            <IdleLoader priority="medium" fallback={<SectionSkeleton height="h-96" />}>
              <FAQ />
            </IdleLoader>
            
            {/* Low Priority: ページ下部 */}
            <IdleLoader priority="low" fallback={<SectionSkeleton height="h-64" />}>
              <CTA />
            </IdleLoader>
          </main>
          
          {/* Low Priority: ページ最下部 */}
          <IdleLoader priority="low" fallback={<FooterSkeleton />}>
            <Footer />
          </IdleLoader>
          
          {/* ChatBot: 固定位置で常時表示 */}
          <ChatBot />
          
          {/* 翻訳フィードバック: 固定位置で常時表示 */}
          <TranslationFeedback />
          
          <Toaster />
        </div>
      </CartProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
