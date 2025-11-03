import image_9dc589bd3cd5d5063e372b550c7ae67fe76a6390 from 'figma:asset/9dc589bd3cd5d5063e372b550c7ae67fe76a6390.png';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Menu, ShoppingCart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Cart } from "./Cart";
import { useCart } from "./CartContext";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "./LanguageContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a 
              href="#" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity -ml-[14mm]"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img 
                src={image_9dc589bd3cd5d5063e372b550c7ae67fe76a6390} 
                alt={t('nav.logoAlt')} 
                className="h-12 w-auto"
                loading="eager"
              />
              <span className="text-green-700 text-[24px] flex flex-col leading-tight">
                <span className="text-[16px]">{t('nav.logoText1')}</span>
                <span className="text-[20px] text-[rgb(5,139,26)] whitespace-nowrap">{t('nav.logoText2')}</span>
              </span>
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-6 whitespace-nowrap ml-[20mm]">
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">
              {t('nav.home')}
            </a>
            <a href="#products" className="text-gray-700 hover:text-green-600 transition-colors">
              {t('nav.products')}
            </a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
              {t('nav.about')}
            </a>
            <a href="#order" className="text-gray-700 hover:text-green-600 transition-colors">
              {t('nav.order')}
            </a>
            <a href="#faq" className="text-gray-700 hover:text-green-600 transition-colors">
              {t('nav.faq')}
            </a>
            <a
              href="https://jp.mercari.com/user/profile/823905869?utm_source=android&utm_medium=share"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 transition-colors group"
              title="メルカリショップ"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm whitespace-nowrap">{t('nav.mercari')}</span>
            </a>
            <LanguageSelector />
            <Button 
              className="bg-green-600 hover:bg-green-700 relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('nav.cart')}
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </nav>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('nav.closeMenu') || "メニューを閉じる" : t('nav.openMenu') || "メニューを開く"}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">
                {t('nav.home')}
              </a>
              <a href="#products" className="text-gray-700 hover:text-green-600 transition-colors">
                {t('nav.products')}
              </a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
                {t('nav.about')}
              </a>
              <a href="#order" className="text-gray-700 hover:text-green-600 transition-colors">
                {t('nav.order')}
              </a>
              <a href="#faq" className="text-gray-700 hover:text-green-600 transition-colors">
                {t('nav.faq')}
              </a>
              <a
                href="https://www.mercari.com/jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {t('nav.mercari')}
              </a>
              <div className="px-2">
                <LanguageSelector />
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700 w-full relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('nav.cart')}
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </nav>
          </div>
        )}
      </div>
      <Cart open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
