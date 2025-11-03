import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart, Product } from "./CartContext";
import { toast } from "sonner@2.0.3";
import { ProductDetailModal } from "./ProductDetailModal";
import { AddProductModal } from "./AddProductModal";
import { StockNotificationModal } from "./StockNotificationModal";
import { ShareButtons } from "./ShareButtons";
import { AwardBadge } from "./Awards";
import { AllProductsSchema } from "./ProductSchema";
import { useState } from "react";
import { Heart, Eye, Plus, Pencil, Trash2, Bell, AlertCircle, Package } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function Products() {
  const { addToCart, isFavorite, addToFavorites, removeFromFavorites, products, localizedProducts, deleteProduct } =
    useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState<Product | null>(null);
  const { t } = useLanguage();

  const handleAddToCart = (product: Product) => {
    // 在庫チェック
    if (product.stock !== undefined && product.stock <= 0) {
      toast.error(t('products.errorSoldOut'));
      return;
    }
    
    addToCart(product);
    toast.success(t('products.addedToCart').replace('{name}', product.name));
    
    // 在庫が少ない場合の警告
    if (product.stock !== undefined && product.stock <= 3) {
      toast.info(t('products.lowStockWarning').replace('{count}', product.stock.toString()), {
        duration: 5000,
      });
    }
  };

  const handleNotificationClick = (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNotificationProduct(product);
    setNotificationModalOpen(true);
  };

  const getStockStatus = (stock: number | undefined) => {
    if (stock === undefined) return null; // 在庫管理なし
    if (stock === 0) return { label: t('products.soldOut'), color: "bg-gray-500", icon: AlertCircle };
    if (stock <= 5) return { label: t('products.remaining').replace('{count}', stock.toString()), color: "bg-orange-500", icon: Package };
    return { label: t('products.inStock'), color: "bg-green-600", icon: Package };
  };

  const handleToggleFavorite = (
    product: Product,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast.success(t('products.removedFromFavorites').replace('{name}', product.name));
    } else {
      addToFavorites(product.id);
      toast.success(t('products.addedToFavorites').replace('{name}', product.name));
    }
  };

  const handleEditProduct = (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // localizedProductsではなく、元のproductsから商品を取得
    const originalProduct = products.find(p => p.id === product.id);
    setEditProduct(originalProduct || product);
    setAddModalOpen(true);
  };

  const handleDeleteClick = (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      toast.success(`${productToDelete.name} deleted`);
      setProductToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleAddModalClose = (open: boolean) => {
    if (!open) {
      setEditProduct(null);
    }
    setAddModalOpen(open);
  };

  return (
    <section id="products" aria-label={t('products.ariaLabel')} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      {/* 商品一覧の構造化データ */}
      <AllProductsSchema products={products} />
      
      <div className="container mx-auto px-4">
        {/* セクションヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="text-sm">{t('hero.award')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ふぉーしーずんの野菜たち
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('products.description')}
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto mt-6"></div>
        </div>

        {/* 商品追加ボタン */}
        <div className="flex justify-center mb-12">
          <Button
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
            size="lg"
            onClick={() => {
              setEditProduct(null);
              setAddModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('products.addProduct')}
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {localizedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-square group cursor-pointer">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* バッジエリア（右上） */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  {product.badge && (
                    <Badge className="bg-green-600">
                      {product.badge}
                    </Badge>
                  )}
                  {(() => {
                    const stockStatus = getStockStatus(product.stock);
                    if (stockStatus) {
                      const Icon = stockStatus.icon;
                      return (
                        <Badge className={`${stockStatus.color} flex items-center gap-1`}>
                          <Icon className="w-3 h-3" />
                          {stockStatus.label}
                        </Badge>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* お気に入りボタン */}
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute top-3 left-3 bg-white/90 backdrop-blur-sm hover:bg-white ${
                    isFavorite(product.id)
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                  onClick={(e) => handleToggleFavorite(product, e)}
                  aria-label={isFavorite(product.id) ? t('products.removeFavoriteAria').replace('{name}', product.name) : t('products.addFavoriteAria').replace('{name}', product.name)}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite(product.id) ? "fill-current" : ""}`}
                  />
                </Button>
                
                {/* 受賞バッジ */}
                {product.award && (
                  <div className="absolute bottom-3 left-3">
                    <AwardBadge size="sm" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-gray-100"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t('products.viewDetails')}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white hover:bg-gray-100"
                    onClick={(e) => handleEditProduct(product, e)}
                    aria-label={t('products.editAria').replace('{name}', product.name)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white hover:bg-red-50 text-red-600"
                    onClick={(e) => handleDeleteClick(product, e)}
                    aria-label={t('products.deleteAria').replace('{name}', product.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl text-green-600">{product.price}</span>
                    <span className="text-gray-500 text-sm ml-1">/ {product.unit}</span>
                  </div>
                </div>
                
                {/* SNSシェアボタン */}
                <div className="mb-4 pb-4 border-b">
                  <ShareButtons 
                    title={product.name}
                    description={product.description}
                    size="sm"
                  />
                </div>
                
                {/* 在庫状況に応じたボタン表示 */}
                {product.stock === 0 ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-500 cursor-not-allowed"
                      disabled
                    >
                      {t('products.soldOut')}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50"
                      onClick={(e) => handleNotificationClick(product, e)}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {t('products.notifyMe')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleAddToCart(product)}
                  >
                    {t('products.addToCart')}
                  </Button>
                )}
                
                {/* 残りわずか警告 */}
                {product.stock !== undefined && product.stock > 0 && product.stock <= 3 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{t('products.popularLowStock')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
      <AddProductModal
        open={addModalOpen}
        onOpenChange={handleAddModalClose}
        editProduct={editProduct}
      />
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('products.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete?.name}{t('products.deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('modal.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('modal.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <StockNotificationModal
        productName={notificationProduct?.name || ""}
        open={notificationModalOpen}
        onOpenChange={setNotificationModalOpen}
      />
    </section>
  );
}
