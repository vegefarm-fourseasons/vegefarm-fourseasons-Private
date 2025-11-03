import { useState } from "react";
import { useCart } from "./CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Minus, Plus, Trash2, AlertCircle, Package } from "lucide-react";
import { OrderConfirmationModal } from "./OrderConfirmationModal";
import { Badge } from "./ui/badge";
import { useLanguage } from "./LanguageContext";

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Cart({ open, onOpenChange }: CartProps) {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getShippingFee,
    getFinalTotal,
  } = useCart();
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { t } = useLanguage();

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>{t('cart.title')}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              {t('cart.continueShopping')}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3>{item.name}</h3>
                        {item.stock !== undefined && item.stock <= 5 && item.stock > 0 && (
                          <Badge className="bg-orange-500 text-xs flex-shrink-0">
                            <Package className="w-2.5 h-2.5 mr-1" />
                            {t('cart.stockRemaining', { count: item.stock })}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatPrice(item.priceNumber)} / {item.unit}
                      </p>
                      
                      {/* 在庫警告 */}
                      {item.stock !== undefined && item.quantity > item.stock && (
                        <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded mb-2">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{t('cart.outOfStock', { stock: item.stock })}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              {/* 購入促進メッセージ */}
              {getTotalPrice() < 3000 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    {t('cart.promo3000', { amount: formatPrice(3000 - getTotalPrice()) })}
                  </p>
                </div>
              )}
              {getTotalPrice() >= 3000 && getTotalPrice() < 5000 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    🎉 <span className="font-bold">{t('cart.promo3000Achieved')}</span>
                    <br />
                    <span className="text-xs">{t('cart.shippingNote')}</span>
                  </p>
                </div>
              )}
              {getTotalPrice() >= 5000 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    ✨ <span className="font-bold">{t('cart.promo5000')}</span>
                    <br />
                    <span className="text-xs">{t('cart.bulkDiscount')}</span>
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('cart.shipping')}</span>
                  <span className="text-gray-500">{t('cart.shippingTBD')}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {t('cart.shippingNote')}
                </p>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-lg">{t('cart.total')}</span>
                <span className="text-2xl text-green-600">
                  {formatPrice(getFinalTotal())}
                </span>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={() => setOrderModalOpen(true)}
              >
                {t('cart.checkout')}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                {t('cart.keepShopping')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
      <OrderConfirmationModal
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
      />
    </Sheet>
  );
}
