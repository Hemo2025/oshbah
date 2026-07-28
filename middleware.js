// ضع هذا الملف في جذر المشروع (بجانب package.json مباشرة، مو داخل src)
// Vercel يكتشفه تلقائياً كـ Edge Middleware

export const config = {
  matcher: ["/product/:slug*", "/products"],
};

// User-Agents لأشهر بوتات محركات البحث وأدوات فحص جوجل ومواقع مشاركة الروابط
const BOT_UA_REGEX =
  /googlebot|google-inspectiontool|storebot-google|bingbot|yandex|baiduspider|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|applebot/i;

// ضع Project ID تبع Firebase هنا كمتغير بيئة في Vercel (Settings > Environment Variables)
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID; // eslint-disable-line no-undef

function parseFirestoreValue(v) {
  if (!v) return null;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.arrayValue !== undefined) {
    return (v.arrayValue.values || []).map(parseFirestoreValue);
  }
  return null;
}

function docToProduct(doc) {
  const fields = doc.fields || {};
  const product = {};
  for (const key in fields) {
    product[key] = parseFirestoreValue(fields[key]);
  }
  product.id = doc.name?.split("/").pop();
  return product;
}

async function getProductBySlug(slug) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;

  // نبحث أولاً بـ seoSlug ثم بـ slug العادي
  const tryQuery = async (field) => {
    const body = {
      structuredQuery: {
        from: [{ collectionId: "products" }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op: "EQUAL",
            value: { stringValue: slug },
          },
        },
        limit: 1,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const doc = data?.[0]?.document;
    if (!doc) return null;

    return docToProduct(doc);
  };

  return (await tryQuery("seoSlug")) || (await tryQuery("slug"));
}

async function getAllProducts(limit = 300) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products?pageSize=${limit}`;

  const res = await fetch(url);
  const data = await res.json();
  const docs = data.documents || [];

  return docs.map(docToProduct);
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- صفحة منتج مفرد ----------

function renderProductHtml(product, slug) {
  const title = product.seoTitle || `${product.name} | عُشبة ستور`;

  const rawDescription =
    product.seoDescription ||
    (product.description || "").replace(/<[^>]*>/g, "").slice(0, 300) ||
    `اشتري ${product.name} من متجر عُشبة ستور`;

  const finalSlug = product.seoSlug || product.slug || slug;
  const url = `https://oshbahstore.com/product/${finalSlug}`;
  const image =
    (Array.isArray(product.images) && product.images[0]) ||
    "https://oshbahstore.com/logo.png";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    image: Array.isArray(product.images) ? product.images : [image],
    description: rawDescription,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: "عُشبة ستور" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "SAR",
      price: Number(product.price || 0).toFixed(2),
      availability:
        Number(product.stock) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "عُشبة ستور" },
    },
  };

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(rawDescription)}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${url}" />

<meta property="og:type" content="product" />
<meta property="og:site_name" content="عُشبة ستور" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(rawDescription)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${escapeHtml(image)}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(rawDescription)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />

<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <h1>${escapeHtml(product.name)}</h1>
  <p>${escapeHtml(rawDescription)}</p>
  <img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" />
  <p>السعر: ${escapeHtml(String(product.price))} ر.س</p>
  <a href="${url}">عرض المنتج في المتجر</a>
</body>
</html>`;
}

// ---------- صفحة قائمة المنتجات /products ----------

function renderProductsListHtml(products, category) {
  const title = category
    ? `منتجات ${category} | عُشبة ستور`
    : "جميع المنتجات | عُشبة ستور";

  const description = category
    ? `تسوق أفضل منتجات ${category} الطبيعية من متجر عُشبة ستور بأسعار مميزة وشحن سريع.`
    : "تصفح كل المنتجات الطبيعية والأعشاب والعسل في متجر عُشبة ستور. جودة مضمونة وشحن سريع.";

  const canonicalUrl = category
    ? `https://oshbahstore.com/products?category=${encodeURIComponent(category)}`
    : "https://oshbahstore.com/products";

  const listItems = products
    .map((p) => {
      const finalSlug = p.seoSlug || p.slug;
      const productUrl = `https://oshbahstore.com/product/${finalSlug}`;
      const image =
        (Array.isArray(p.images) && p.images[0]) ||
        "https://oshbahstore.com/logo.png";

      return `
    <li>
      <a href="${productUrl}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)}" />
        <span>${escapeHtml(p.name)}</span>
        <span>${escapeHtml(String(p.price))} ر.س</span>
      </a>
    </li>`;
    })
    .join("\n");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://oshbahstore.com/product/${p.seoSlug || p.slug}`,
      name: p.name,
    })),
  };

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${canonicalUrl}" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="عُشبة ستور" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${canonicalUrl}" />

<script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <ul>
    ${listItems}
  </ul>
</body>
</html>`;
}

export default async function middleware(request) {
  const ua = request.headers.get("user-agent") || "";

  // مستخدم عادي -> كمّل عادي، خلي الـ SPA يشتغل زي ما هو
  if (!BOT_UA_REGEX.test(ua)) {
    return;
  }

  const url = new URL(request.url);

  try {
    // حالة 1: صفحة منتج مفرد /product/slug
    const productMatch = url.pathname.match(/^\/product\/([^/]+)/);
    if (productMatch) {
      const slug = decodeURIComponent(productMatch[1]);
      const product = await getProductBySlug(slug);
      if (!product) return; // ما لقى المنتج -> خليه يكمل عادي

      const html = renderProductHtml(product, slug);
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // حالة 2: صفحة قائمة المنتجات /products (مع أو بدون ?category=)
    if (url.pathname === "/products") {
      const category = url.searchParams.get("category");
      let products = await getAllProducts();

      if (category) {
        products = products.filter((p) => p.category === category);
      }

      if (!products.length) return; // ما فيه منتجات -> خليه يكمل عادي

      const html = renderProductsListHtml(products, category);
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // أي مسار ثاني مو مقصود -> كمّل عادي
    return;
  } catch (err) {
    // أي خطأ غير متوقع -> لا توقف الطلب، خليه يكمل عادي
    console.error("Middleware error:", err);
    return;
  }
}
