import { Facebook, Twitter, Instagram, Mail, MapPin, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { SpecialCommerceLawModal } from "./SpecialCommerceLawModal";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { Newsletter } from "./Newsletter";
import { useLanguage } from "./LanguageContext";
import { ReferralProgram } from "./ReferralProgram";
import { SubscriptionPlan } from "./SubscriptionPlan";

export function Footer() {
  const [lawModalOpen, setLawModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* ニュースレター登録 */}
        <div className="mb-12">
          <Newsletter />
        </div>

        {/* 紹介プログラムと定期購入プラン */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <ReferralProgram />
          <SubscriptionPlan />
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl mb-4">{t('footer.farmTitle')}</h3>
            <p className="text-gray-400 text-sm whitespace-pre-line">
              {t('footer.farmDesc')}
            </p>
          </div>
          <div>
            <h3 className="text-xl mb-4">{t('footer.shop')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  {t('footer.shopProducts')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.shopSets')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.shopSubscription')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl mb-4">{t('footer.info')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {t('footer.infoAbout')}
                </a>
              </li>
              <li>
                <a href="#order" className="hover:text-white transition-colors">
                  {t('footer.infoOrder')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.infoFaq')}
                </a>
              </li>
              <li>
                <button
                  onClick={() => setLawModalOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  {t('footer.infoLaw')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  {t('footer.infoPrivacy')}
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>fourseasons.ryu@outlook.jp</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="whitespace-pre-line">{t('footer.location')}</span>
              </li>
            </ul>
            
            {/* ソーシャルメディア */}
            <div className="mt-6">
              <h4 className="text-sm mb-3 text-gray-300">{t('footer.followUs')}</h4>
              <div className="flex gap-3">

                <a
                  href="https://x.com/FourSeasons_831?t=iHxugcuEhSNEIRpAxKV8zQ&s=06"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* メルカリアカウント */}
            <div className="mt-6">
              <h4 className="text-sm mb-3 text-gray-300">{t('footer.otherPlatforms')}</h4>
              <a
                href="https://jp.mercari.com/user/profile/823905869?utm_source=android&utm_medium=share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-sm font-medium">{t('footer.mercari')}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
      <SpecialCommerceLawModal open={lawModalOpen} onOpenChange={setLawModalOpen} />
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
    </footer>
  );
}
