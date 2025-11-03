import image_8b39236b845ac818f4da3b044d86a0c02a794f90 from 'figma:asset/8b39236b845ac818f4da3b044d86a0c02a794f90.png';
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AwardBadge } from "./Awards";
import { Leaf, ShoppingCart, Sprout, ShoppingBag } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  return (
    <section id="home" aria-label={t('hero.ariaLabel')} className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 md:py-32">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-300 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* 画像セクション */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-green-100 ring-offset-4">
              <ImageWithFallback
                src={image_8b39236b845ac818f4da3b044d86a0c02a794f90}
                alt={t('hero.imageAlt')}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
            </div>
            
            {/* 装飾バッジ */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border-2 border-green-200">
              <div className="flex items-center gap-2">
                <Sprout className="w-6 h-6 text-green-600" />
                <div>
                  <div className="text-xs text-gray-500">{t('hero.morningHarvest')}</div>
                  <div className="text-sm text-green-600">{t('hero.freshnessGuarantee')}</div>
                </div>
              </div>
            </div>
            
            {/* 受賞バッジ */}
            <div className="absolute -bottom-4 -left-4">
              <AwardBadge size="lg" />
            </div>
          </div>

          {/* テキストセクション */}
          <div className="space-y-8 order-1 lg:order-2">
            {/* 初回購入特典バナー */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-xl animate-pulse">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="text-lg font-bold">{t('hero.firstTime')}</div>
                </div>
              </div>
            </div>

            {/* バッジ */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <Leaf className="w-5 h-5" />
              <span className="text-sm">{t('hero.badge')}</span>
            </div>

            {/* メインタイトル */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight mb-4">
                <span className="block text-gray-900">{t('hero.title')}</span>
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-[64px]">
                  新鮮野菜　 農家直送
                </span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
            </div>

            {/* 説明文 */}
            <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
              {t('hero.description')}
            </p>

            {/* 特徴リスト */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-900">{t('hero.minimalPesticides')}</div>
                  <div className="text-xs text-gray-500">{t('hero.safeCultivation')}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-900">{t('hero.sameDayShipping')}</div>
                  <div className="text-xs text-gray-500">{t('hero.outstandingFreshness')}</div>
                </div>
              </div>
            </div>

            {/* CTAボタン */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all" 
                asChild
              >
                <a href="#products" className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t('hero.cta')}
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-green-600 text-green-600 hover:bg-green-50" 
                asChild
              >
                <a href="#about">{t('nav.about')}</a>
              </Button>
            </div>

            {/* メルカリ販売中バッジ */}
            <div className="pt-6 border-t border-green-200 mt-6">
              <p className="text-sm text-gray-600 mb-3">{t('hero.mercariNote')}</p>
              <a
                href="https://jp.mercari.com/user/profile/823905869?utm_source=android&utm_medium=share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition-all shadow-md hover:shadow-lg group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-gray-500">{t('hero.mercariLabel')}</div>
                  <div className="font-medium">{t('hero.mercariText')}</div>
                </div>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
