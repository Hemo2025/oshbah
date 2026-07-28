import { Helmet } from "react-helmet-async";

export default function SEO({ product }) {
  if (!product) return null;

  const title = product.seoTitle || `${product.name} | عُشبة ستور`;

  const description =
    product.seoDescription ||
    product.description?.replace(/<[^>]*>/g, "").slice(0, 300) ||
    `اشتري ${product.name} من متجر عُشبة ستور`;

  const slug = product.seoSlug || product.slug;

  const url = `https://oshbahstore.com/product/${slug}`;

  const image = product.images?.[0] || "https://oshbahstore.com/logo.png";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://oshbahstore.com/#organization",
        name: "عُشبة ستور",
        url: "https://oshbahstore.com",
        logo: {
          "@type": "ImageObject",
          url: "https://oshbahstore.com/logo.png",
        },
      },

      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: "https://oshbahstore.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "المنتجات",
            item: "https://oshbahstore.com/products",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.category || "منتجات",
            item: `https://oshbahstore.com/products?category=${encodeURIComponent(
              product.category || "",
            )}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: product.name,
            item: url,
          },
        ],
      },

      {
        "@type": "Product",
        "@id": url,

        name: title,

        image: product.images?.length > 0 ? product.images : [image],

        description,

        sku: product.id,

        category: product.category,

        brand: {
          "@type": "Brand",
          name: "عُشبة ستور",
        },

        offers: {
          "@type": "Offer",

          url,

          priceCurrency: "SAR",

          price: Number(product.price).toFixed(2),
          priceValidUntil: "2027-12-31",

          availability:
            Number(product.stock) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",

          itemCondition: "https://schema.org/NewCondition",

          seller: {
            "@type": "Organization",
            name: "عُشبة ستور",
          },
        },
      },
    ],
  };

  if (product.oldPrice && Number(product.oldPrice) > Number(product.price)) {
    schema["@graph"][2].offers.price = Number(product.price).toFixed(2);

    schema["@graph"][2].offers.priceSpecification = {
      "@type": "PriceSpecification",
      price: Number(product.price).toFixed(2),
      priceCurrency: "SAR",
    };
  }

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      <link rel="canonical" href={url} />

      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="عُشبة ستور" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Helmet>
  );
}
