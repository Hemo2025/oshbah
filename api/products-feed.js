import { adminDb } from "./firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    const snapshot = await adminDb.collection("products").get();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Oshbah Store Products</title>
<link>https://oshbahstore.com</link>
<description>Oshbah Store Product Feed</description>
`;

    snapshot.forEach((doc) => {
      const product = doc.data();

      const title = product.name || "";
      const description = product.description || "";
      const slug = product.slug || doc.id;
      const image = product.images?.[0] || "";
      const price = Number(product.price || 0).toFixed(2);
      const availability = product.stock > 0 ? "in stock" : "out of stock";

      xml += `
<item>
<g:id>${doc.id}</g:id>

<g:title><![CDATA[${title}]]></g:title>

<g:description><![CDATA[${description}]]></g:description>

<g:link>https://oshbahstore.com/product/${slug}</g:link>

<g:image_link>${image}</g:image_link>

<g:availability>${availability}</g:availability>

<g:condition>new</g:condition>

<g:price>${price} SAR</g:price>

<g:brand>Oshbah Store</g:brand>

<g:identifier_exists>false</g:identifier_exists>

<g:product_type><![CDATA[${product.category || "General"}]]></g:product_type>

<g:google_product_category>Health &amp; Beauty</g:google_product_category>
</item>
`;
    });

    xml += `
</channel>
</rss>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Feed Error");
  }
}
