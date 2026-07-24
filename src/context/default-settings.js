export const DEFAULT_SETTINGS = {
  // بيانات المتجر
  storeName: "عُشبة",
  storeDescription: "منتجات طبيعية عضوية بجودة عالية",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  currency: "ر.س",

  // التواصل
  socialLinks: {
    instagram: "",
    twitter: "",
    snapchat: "",
    tiktok: "",
    telegram: "",
  },

  // الصيانة
  maintenanceMode: false,
  maintenanceMessage: "المتجر تحت الصيانة وسيعود قريباً.",

  // الشريط الإعلاني
  announcementBar: {
    enabled: true,

    interval: 4500,

    backgroundColor: "#15803d",

    textColor: "#ffffff",

    messages: [
      "🚚 الشحن مجاني للطلبات فوق 199 ريال",
      "📍 توصيل مجاني داخل جدة",
      "💳 الدفع عند الاستلام متوفر",
    ],
  },
  // إعدادات السلايدر الرئيسي
  heroSlider: {
    enabled: true,

    autoplay: true,

    autoplayDelay: 5000,

    showArrows: true,

    showDots: true,

    desktopHeight: 420,

    mobileHeight: 220,

    overlay: 0.35,
  },
  // المظهر
  theme: {
    primaryColor: "#16a34a",
    secondaryColor: "#14532d",
    darkMode: false,
    borderRadius: 16,
    fontFamily: "Cairo",
    productCardStyle: "modern",
    enableAnimations: true,
  },

  // الصفحة الرئيسية
  home: {
    showHero: true,
    heroTitle: "مرحباً بكم في متجر عُشبة",
    heroSubtitle: "",
    heroImage: "",

    showCategories: true,
    showBestSellers: true,
    showLatestProducts: true,

    productsPerSection: 8,
  },

  // المنتجات
  products: {
    showReviews: true,
    showStock: true,
    showFavorites: true,
    showRelatedProducts: true,

    hideOutOfStock: false,
    lowStockAlert: 5,

    showDiscountBadge: true,
    showNewBadge: true,
    showBestSellerBadge: true,
  },

  // الطلبات
  orders: {
    minOrderAmount: 0,

    enableCOD: true,
    allowGuestCheckout: true,

    allowCancelOrder: true,
    cancelHours: 12,

    autoConfirmOrders: false,
  },

  // الشحن
  shipping: {
    enabled: true,

    shippingFee: 0,

    freeShippingThreshold: 200,

    methods: [
      {
        id: 1,
        name: "توصيل عادي",
        price: 0,
      },
    ],
  },

  // الكوبونات
  coupons: [],

  // الخصومات
  discounts: {
    flashSaleEnabled: true,
    flashSaleTitle: "",
    flashSaleEndsAt: "",

    freeGiftThreshold: 0,
  },

  // البانرات
  banners: [],

  // النوافذ المنبثقة
  popups: {
    enabled: true,

    welcomePopup: {
      enabled: false,
      title: "",
      description: "",
      image: "",
      buttonText: "",
      buttonLink: "",
    },

    couponPopup: {
      enabled: false,
      title: "",
      couponCode: "",
    },

    exitPopup: {
      enabled: false,
      title: "",
      description: "",
    },
  },

  // SEO
  seo: {
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
  },

  // الإشعارات
  notifications: {
    orderSound: true,
    browserNotifications: false,
    whatsappNotifications: true,
    lowStockNotification: true,
  },

  // الصفحات
  pages: {
    about: "",
    privacyPolicy: "",
    shippingPolicy: "",
    returnPolicy: "",
  },
};
