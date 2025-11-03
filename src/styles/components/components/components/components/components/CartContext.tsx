import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { trackAddToCart, trackAddToWishlist } from "./ConversionTracker";
import { getLocalizedProduct, formatPrice } from "../translations/products";
import { useLanguage } from "./LanguageContext";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNumber: number;
  unit: string;
  image: string;
  badge?: string;
  stock?: number; // 在庫数（undefinedは無制限）
  award?: boolean; // 受賞商品かどうか
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getShippingFee: () => number;
  getFinalTotal: () => number;
  favorites: string[];
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  products: Product[];
  localizedProducts: Product[]; // 言語に応じた商品データ
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 初期商品データ
const initialProducts: Product[] = [
  {
    id: "premium-mini-tomato",
    name: "高糖度ミニトマト",
    description: "糖度10度以上！フルーツのような甘さとジューシーさが特徴の特選ミニトマト。一粒一粒に農家のこだわりが詰まっています。",
    price: "¥900",
    priceNumber: 900,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1624720114008-d94d0ec5f9ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNoZXJyeSUyMHRvbWF0b2VzJTIwdmluZXxlbnwxfHx8fDE3NjE3Mjg2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "プレミアム",
    stock: 8,
    award: false,
  },
  {
    id: "mini-tomato",
    name: "ミニトマト",
    description: "野菜ソムリエサミット銀賞受賞！甘みと旨味が凝縮された極上のミニトマト。",
    price: "¥700",
    priceNumber: 700,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1588306457968-d862c58419ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0b21hdG9lcyUyMGJhc2tldCUyMG9yZ2FuaWN8ZW58MXx8fHwxNzYxNzI4NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "銀賞受賞",
    stock: 10,
    award: true,
  },
  {
    id: "tomato",
    name: "完熟トマト",
    description: "太陽の光をたっぷり浴びた甘みたっぷりのトマトです。",
    price: "¥800",
    priceNumber: 800,
    unit: "1kg",
    image: "https://images.unsplash.com/photo-1649629174655-a6510a8066e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG9lcyUyMGhhcnZlc3R8ZW58MXx8fHwxNzYwNjg0MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "人気",
    stock: 5, // 残りわずか
  },
  {
    id: "leafy-greens",
    name: "新鮮葉物野菜",
    description: "シャキシャキ食感の採れたてレタスやほうれん草の詰め合わせ。",
    price: "¥600",
    priceNumber: 600,
    unit: "300g",
    image: "https://images.unsplash.com/photo-1741515042603-70545daeb0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFmeSUyMGdyZWVucyUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzYwNjExNDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "おすすめ",
    stock: 15, // 在庫あり
  },
  {
    id: "carrots",
    name: "有機人参",
    description: "甘みと栄養がぎゅっと詰まった、土の香り豊かな人参。",
    price: "¥500",
    priceNumber: 500,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1603462903957-566630607cc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJyb3RzJTIwZnJlc2h8ZW58MXx8fHwxNzYwNjE4OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stock: 0, // 売り切れ
  },
  {
    id: "seasonal-set",
    name: "季節の野菜セット",
    description: "旬の野菜を農家が厳選してお届けする特別セット。",
    price: "¥2,500",
    priceNumber: 2500,
    unit: "約3kg",
    image: "https://images.unsplash.com/photo-1668434484147-2545d8cdafe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBtYXJrZXQlMjBwcm9kdWNlfGVufDF8fHx8MTc2MDcwNzcyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "お得",
    stock: 20, // 在庫あり
  },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { language } = useLanguage();
  
  // 言語に応じた商品データ
  const localizedProducts = products.map(product => 
    getLocalizedProduct(product.id, language, product)
  );

  // ローカルストレージから商品を読み込む
  useEffect(() => {
    const savedProducts = localStorage.getItem("vegifarm-products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to load products", e);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  }, []);

  // 商品をローカルストレージに保存
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("vegifarm-products", JSON.stringify(products));
    }
  }, [products]);

  // ローカルストレージからお気に入りを読み込む
  useEffect(() => {
    const savedFavorites = localStorage.getItem("vegifarm-favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    }
  }, []);

  // お気に入りをローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("vegifarm-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const quantity = existingItem ? existingItem.quantity + 1 : 1;
      
      // コンバージョン追跡
      trackAddToCart({
        id: product.id,
        name: product.name,
        category: product.badge || '野菜',
        price: product.priceNumber,
        quantity: 1,
      });
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.priceNumber * item.quantity,
      0
    );
  };

  const getShippingFee = () => {
    // 配送料は注文後、サイズに応じて確定
    return 0;
  };

  const getFinalTotal = () => {
    // 配送料は注文後に加算されます
    return getTotalPrice();
  };

  const addToFavorites = (productId: string) => {
    setFavorites((prev) => {
      if (!prev.includes(productId)) {
        // コンバージョン追跡
        const product = products.find(p => p.id === productId);
        if (product) {
          trackAddToWishlist({
            id: product.id,
            name: product.name,
            category: product.badge || '野菜',
            price: product.priceNumber,
          });
        }
        
        return [...prev, productId];
      }
      return prev;
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Omit<Product, 'id'>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...productData, id: product.id } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    // 商品削除時にカートとお気に入りからも削除
    removeFromCart(id);
    removeFromFavorites(id);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getShippingFee,
        getFinalTotal,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        products,
        localizedProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
