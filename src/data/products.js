const products = [
  {
    id: 1,
    slug: "argan-oil",
    name: "زيت الأرغان الطبيعي",
    price: 85,
    oldPrice: 110,
    discount: 23,
    stock: 15,
    rating: 4.9,
    reviews: 128,
    category: "الزيوت الطبيعية",
    description:
      "زيت الأرغان الطبيعي غني بفيتامين E والأحماض الدهنية، يساعد على ترطيب البشرة وتقوية الشعر.",
    ingredients: ["زيت أرغان طبيعي 100%"],
    usage: "ضع كمية مناسبة على الشعر أو البشرة مع التدليك.",
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
    ],
  },

  {
    id: 2,
    slug: "sidr-honey",
    name: "عسل السدر اليمني",
    price: 120,
    oldPrice: 150,
    discount: 20,
    stock: 22,
    rating: 4.8,
    reviews: 91,
    category: "العسل الطبيعي",
    description: "عسل سدر يمني طبيعي فاخر، غني بالطاقة والعناصر الغذائية.",
    ingredients: ["عسل سدر طبيعي 100%"],
    usage: "ملعقة صباحًا على الريق أو حسب الحاجة.",
    images: [
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800",
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800",
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800",
    ],
  },

  {
    id: 3,
    slug: "herbal-tea",
    name: "شاي الأعشاب",
    price: 45,
    oldPrice: 60,
    discount: 25,
    stock: 35,
    rating: 4.7,
    reviews: 64,
    category: "الأعشاب",
    description: "شاي أعشاب طبيعي يساعد على الاسترخاء وتحسين الهضم.",
    ingredients: ["بابونج", "نعناع", "زنجبيل"],
    usage: "ضع الكيس في ماء ساخن لمدة 5 دقائق.",
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800",
    ],
  },

  {
    id: 4,
    slug: "lavender-oil",
    name: "زيت اللافندر",
    price: 70,
    oldPrice: 95,
    discount: 26,
    stock: 18,
    rating: 4.9,
    reviews: 109,
    category: "الزيوت العطرية",
    description:
      "زيت لافندر طبيعي يمنح الاسترخاء ويستخدم للعناية بالبشرة والشعر.",
    ingredients: ["زيت لافندر طبيعي"],
    usage: "ضع بضع قطرات على البشرة أو الشعر.",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
    ],
  },
];

export default products;
