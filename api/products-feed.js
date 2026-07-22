import { adminDb } from "./firebaseAdmin";

export default async function handler(req, res) {
  try {
    const snapshot = await adminDb.collection("products").get();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Oshbah Store Products</title>
<link>https://oshbahstore.com</link>
<description>Products Feed</description>
`;

    snapshot.forEach((doc) => {
      const product = doc.data();

      xml += `
<item>
<g:id>${doc.id}</g:id>
<g:title><![CDATA[${product.name || ""}]]></g:title>
<g:description><![CDATA[${product.description || ""}]]></g:description>
<g:link>https://oshbahstore.com/product/${product.slug}</g:link>
<g:image_link>${product.images?.[0] || ""}</g:image_link>
<g:price>${product.price || 0} SAR</g:price>
<g:availability>${product.stock > 0 ? "in stock" : "out of stock"}</g:availability>
</item>
`;
    });

    xml += `
</channel>
</rss>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Feed Error");
  }
}
