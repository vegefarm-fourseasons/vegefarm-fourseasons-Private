/**
 * 商品データの多言語対応
 * 
 * 各商品の name, description, badge を言語ごとに定義
 * priceNumber は共通（数値のみ）
 * price の表示形式は言語ごとに調整可能
 */

export interface ProductTranslation {
  name: string;
  description: string;
  badge?: string;
  priceFormat?: (price: number) => string; // オプション：価格の表示形式
}

export interface ProductTranslations {
  [productId: string]: {
    [language: string]: ProductTranslation;
  };
}

export const productTranslations: ProductTranslations = {
  // プレミアムミニトマト
  'premium-mini-tomato': {
    ja: {
      name: '高糖度ミニトマト',
      description: '糖度10度以上！フルーツのような甘さとジューシーさが特徴の特選ミニトマト。一粒一粒に農家のこだわりが詰まっています。',
      badge: 'プレミアム',
    },
    en: {
      name: 'Premium Cherry Tomatoes',
      description: 'Sugar content over 10 degrees! Premium cherry tomatoes with fruit-like sweetness and juiciness. Each tomato is crafted with the farmer\'s dedication.',
      badge: 'Premium',
    },
    zh: {
      name: '高糖度小番茄',
      description: '糖度超过10度！具有水果般的甜度和多汁特征的精选小番茄。每一颗都凝聚着农民的用心。',
      badge: '高级',
    },
    ko: {
      name: '고당도 방울토마토',
      description: '당도 10도 이상! 과일 같은 달콤함과 즙이 특징인 특선 방울토마토. 농부의 정성이 담긴 토마토입니다.',
      badge: '프리미엄',
    },
    vi: {
      name: 'Cà chua bi cao cấp',
      description: 'Độ ngọt trên 10 độ! Cà chua bi cao cấp với vị ngọt như trái cây và mọng nước. Mỗi quả đều chứa đựng tâm huyết của nông dân.',
      badge: 'Cao cấp',
    },
    th: {
      name: 'มะเขือเทศราชินีพรีเมียม',
      description: 'ความหวานสูงกว่า 10 องศา! มะเขือเทศเชอร์รี่หวานเหมือนผลไม้และชุ่มฉ่ำ แต่ละลูกบรรจุความตั้งใจของเกษตรกร',
      badge: 'พรีเมียม',
    },
    tl: {
      name: 'Premium Cherry Tomatoes',
      description: 'Higit 10 degrees ang kalamnan! Premium cherry tomatoes na may tamis na parang prutas at juicy. Bawat isa ay puno ng dedikasyon ng magsasaka.',
      badge: 'Premium',
    },
    pt: {
      name: 'Tomate Cereja Premium',
      description: 'Teor de açúcar acima de 10 graus! Tomates cerejas premium com doçura de frutas e suculência. Cada tomate é feito com a dedicação do agricultor.',
      badge: 'Premium',
    },
    ne: {
      name: 'प्रिमियम चेरी टमाटर',
      description: '10 डिग्री भन्दा बढी चिनी! फल जस्तै मिठास र रसिलोपनका साथ प्रिमियम चेरी टमाटर। प्रत्येक टमाटरमा किसानको समर्पण छ।',
      badge: 'प्रिमियम',
    },
    id: {
      name: 'Tomat Ceri Premium',
      description: 'Kandungan gula lebih dari 10 derajat! Tomat ceri premium dengan rasa manis seperti buah dan berair. Setiap tomat dibuat dengan dedikasi petani.',
      badge: 'Premium',
    },
  },

  // ミニトマト（銀賞受賞）
  'mini-tomato': {
    ja: {
      name: 'ミニトマト',
      description: '野菜ソムリエサミット銀賞受賞！甘みと旨味が凝縮された極上のミニトマト。',
      badge: '銀賞受賞',
    },
    en: {
      name: 'Mini Tomatoes',
      description: 'Vegetable Sommelier Summit Silver Award Winner! Premium mini tomatoes with concentrated sweetness and umami.',
      badge: 'Silver Award',
    },
    zh: {
      name: '小番茄',
      description: '蔬菜品鉴师峰会银奖获得者！浓缩了甜味和鲜味的极品小番茄。',
      badge: '银奖',
    },
    ko: {
      name: '방울토마토',
      description: '채소 소믈리에 서미트 은상 수상! 단맛과 감칠맛이 농축된 극상의 방울토마토.',
      badge: '은상 수상',
    },
    vi: {
      name: 'Cà chua bi',
      description: 'Giải bạc Hội nghị Sommelier Rau! Cà chua bi cao cấp với vị ngọt và umami đậm đà.',
      badge: 'Giải bạc',
    },
    th: {
      name: 'มะเขือเทศราชินี',
      description: 'รางวัลเหรียญเงิน Vegetable Sommelier Summit! มะเขือเทศเชอร์รี่คุณภาพสูงที่เข้มข้นด้วยความหวานและอูมามิ',
      badge: 'รางวัลเหรียญเงิน',
    },
    tl: {
      name: 'Mini Tomatoes',
      description: 'Vegetable Sommelier Summit Silver Award! Premium mini tomatoes na may concentrated na tamis at umami.',
      badge: 'Silver Award',
    },
    pt: {
      name: 'Mini Tomates',
      description: 'Vencedor da Medalha de Prata do Vegetable Sommelier Summit! Mini tomates premium com doçura e umami concentrados.',
      badge: 'Medalha de Prata',
    },
    ne: {
      name: 'मिनी टमाटर',
      description: 'तरकारी सोमेलियर शिखर सम्मेलन रजत पुरस्कार विजेता! मिठास र उमामी संकेन्द्रित प्रिमियम मिनी टमाटर।',
      badge: 'रजत पुरस्कार',
    },
    id: {
      name: 'Tomat Mini',
      description: 'Pemenang Medali Perak Vegetable Sommelier Summit! Tomat mini premium dengan rasa manis dan umami yang pekat.',
      badge: 'Medali Perak',
    },
  },

  // 完熟トマト
  'tomato': {
    ja: {
      name: '完熟トマト',
      description: '太陽の光をたっぷり浴びた甘みたっぷりのトマトです。',
      badge: '人気',
    },
    en: {
      name: 'Ripe Tomatoes',
      description: 'Sweet tomatoes that have soaked up plenty of sunshine.',
      badge: 'Popular',
    },
    zh: {
      name: '完熟番茄',
      description: '充分吸收阳光的甜美番茄。',
      badge: '人气',
    },
    ko: {
      name: '완숙 토마토',
      description: '햇빛을 듬뿍 받아 달콤한 토마토입니다.',
      badge: '인기',
    },
    vi: {
      name: 'Cà chua chín',
      description: 'Cà chua ngọt đã ngâm đầy ánh nắng mặt trời.',
      badge: 'Phổ biến',
    },
    th: {
      name: 'มะเขือเทศสุก',
      description: 'มะเขือเทศหวานที่ได้รับแสงแดดอย่างเต็มที่',
      badge: 'ยอดนิยม',
    },
    tl: {
      name: 'Hinog na Kamatis',
      description: 'Matamis na kamatis na puno ng sikat ng araw.',
      badge: 'Sikat',
    },
    pt: {
      name: 'Tomates Maduros',
      description: 'Tomates doces que absorveram muita luz do sol.',
      badge: 'Popular',
    },
    ne: {
      name: 'पाकेको टमाटर',
      description: 'घामको प्रकाश धेरै लिएको मीठो टमाटर।',
      badge: 'लोकप्रिय',
    },
    id: {
      name: 'Tomat Matang',
      description: 'Tomat manis yang menyerap banyak sinar matahari.',
      badge: 'Populer',
    },
  },

  // 新鮮葉物野菜
  'leafy-greens': {
    ja: {
      name: '新鮮葉物野菜',
      description: 'シャキシャキ食感の採れたてレタスやほうれん草の詰め合わせ。',
      badge: 'おすすめ',
    },
    en: {
      name: 'Fresh Leafy Greens',
      description: 'Assortment of crispy fresh lettuce and spinach.',
      badge: 'Recommended',
    },
    zh: {
      name: '新鲜叶菜',
      description: '脆嫩口感的新鲜生菜和菠菜组合。',
      badge: '推荐',
    },
    ko: {
      name: '신선 잎채소',
      description: '아삭한 식감의 신선한 상추와 시금치 모음.',
      badge: '추천',
    },
    vi: {
      name: 'Rau lá xanh tươi',
      description: 'Hỗn hợp rau diếp và rau bina tươi giòn.',
      badge: 'Đề xuất',
    },
    th: {
      name: 'ผักใบเขียวสด',
      description: 'ชุดผักกาดหอมและผักโขมสดกรอบ',
      badge: 'แนะนำ',
    },
    tl: {
      name: 'Sariwang Dahong Gulay',
      description: 'Halo-halong sariwang lettuce at spinach na crispy.',
      badge: 'Inirerekomenda',
    },
    pt: {
      name: 'Verduras Frescas',
      description: 'Sortimento de alface e espinafre frescos e crocantes.',
      badge: 'Recomendado',
    },
    ne: {
      name: 'ताजा पातेदार तरकारी',
      description: 'कुरकुरा ताजा सलाद र पालुंगो को संग्रह।',
      badge: 'सिफारिस गरिएको',
    },
    id: {
      name: 'Sayuran Hijau Segar',
      description: 'Campuran selada dan bayam segar yang renyah.',
      badge: 'Direkomendasikan',
    },
  },

  // 有機人参
  'carrots': {
    ja: {
      name: '有機人参',
      description: '甘みと栄養がぎゅっと詰まった、土の香り豊かな人参。',
    },
    en: {
      name: 'Organic Carrots',
      description: 'Carrots packed with sweetness and nutrients, rich with earthy aroma.',
    },
    zh: {
      name: '有机胡萝卜',
      description: '甜味和营养满满，富含泥土芳香的胡萝卜。',
    },
    ko: {
      name: '유기농 당근',
      description: '단맛과 영양이 가득한, 흙 향기가 풍부한 당근.',
    },
    vi: {
      name: 'Cà rốt hữu cơ',
      description: 'Cà rốt đầy vị ngọt và dinh dưỡng, giàu hương đất.',
    },
    th: {
      name: 'แครอทอินทรีย์',
      description: 'แครอทเต็มไปด้วยความหวานและสารอาหาร หอมกลิ่นดิน',
    },
    tl: {
      name: 'Organic na Carrots',
      description: 'Carrots na puno ng tamis at nutrients, mayaman sa lupa na amoy.',
    },
    pt: {
      name: 'Cenouras Orgânicas',
      description: 'Cenouras repletas de doçura e nutrientes, ricas em aroma terroso.',
    },
    ne: {
      name: 'जैविक गाजर',
      description: 'मिठास र पोषणले भरिपूर्ण, माटोको सुगन्धले धनी गाजर।',
    },
    id: {
      name: 'Wortel Organik',
      description: 'Wortel yang penuh dengan rasa manis dan nutrisi, kaya aroma tanah.',
    },
  },

  // 季節の野菜セット
  'seasonal-set': {
    ja: {
      name: '季節の野菜セット',
      description: '旬の野菜を農家が厳選してお届けする特別セット。',
      badge: 'お得',
    },
    en: {
      name: 'Seasonal Vegetable Set',
      description: 'Special set of seasonal vegetables carefully selected by our farmers.',
      badge: 'Great Value',
    },
    zh: {
      name: '季节蔬菜套餐',
      description: '农民精心挑选的当季蔬菜特别套餐。',
      badge: '超值',
    },
    ko: {
      name: '제철 야채 세트',
      description: '농가가 엄선한 제철 야채 특별 세트.',
      badge: '실속',
    },
    vi: {
      name: 'Bộ rau theo mùa',
      description: 'Bộ đặc biệt các loại rau theo mùa được nông dân lựa chọn kỹ lưỡng.',
      badge: 'Giá trị tốt',
    },
    th: {
      name: 'ชุดผักตามฤดูกาล',
      description: 'ชุดพิเศษของผักตามฤดูกาลที่เกษตรกรคัดสรรมาอย่างดี',
      badge: 'คุ้มค่า',
    },
    tl: {
      name: 'Seasonal na Set ng Gulay',
      description: 'Special na set ng seasonal na gulay na maingat na pinili ng mga magsasaka.',
      badge: 'Sulit',
    },
    pt: {
      name: 'Conjunto de Vegetais Sazonais',
      description: 'Conjunto especial de vegetais sazonais cuidadosamente selecionados por nossos agricultores.',
      badge: 'Ótimo Valor',
    },
    ne: {
      name: 'मौसमी तरकारी सेट',
      description: 'किसानहरूले सावधानीपूर्वक छानिएका मौसमी तरकारीहरूको विशेष सेट।',
      badge: 'उत्तम मूल्य',
    },
    id: {
      name: 'Set Sayuran Musiman',
      description: 'Set khusus sayuran musiman yang dipilih dengan hati-hati oleh petani kami.',
      badge: 'Nilai Bagus',
    },
  },
};

/**
 * 言語に応じた商品データを取得
 */
export function getLocalizedProduct(
  productId: string,
  language: string,
  baseProduct: any
): any {
  const translations = productTranslations[productId];
  
  if (!translations || !translations[language]) {
    // フォールバック: 日本語 -> 英語 -> 元のデータ
    const fallbackLang = translations?.ja || translations?.en || baseProduct;
    return {
      ...baseProduct,
      ...(translations?.[language] || fallbackLang),
    };
  }

  return {
    ...baseProduct,
    ...translations[language],
  };
}

/**
 * 価格フォーマット（言語ごと）
 */
export function formatPrice(price: number, language: string): string {
  const formatters: { [key: string]: (p: number) => string } = {
    ja: (p) => `¥${p.toLocaleString('ja-JP')}`,
    en: (p) => `¥${p.toLocaleString('en-US')}`,
    zh: (p) => `¥${p.toLocaleString('zh-CN')}`,
    ko: (p) => `¥${p.toLocaleString('ko-KR')}`,
    vi: (p) => `¥${p.toLocaleString('vi-VN')}`,
    th: (p) => `¥${p.toLocaleString('th-TH')}`,
    tl: (p) => `¥${p.toLocaleString('en-PH')}`,
    pt: (p) => `¥${p.toLocaleString('pt-BR')}`,
    ne: (p) => `¥${p.toLocaleString('en-US')}`,
    id: (p) => `¥${p.toLocaleString('id-ID')}`,
  };

  return formatters[language]?.(price) || formatters['ja'](price);
}
