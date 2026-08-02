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
        const extraImages =
          product.images
            ?.slice(1)
            .map(
              (img) =>
                `<g:additional_image_link>${img}</g:additional_image_link>`,
            )
            .join("\n") || "";

        const price = Number(product.price || 0).toFixed(2);
        const oldPrice = Number(product.oldPrice || 0).toFixed(2);

        const availability = product.stock > 0 ? "in stock" : "out of stock";

        xml += `
  <item>

  <g:id>${doc.id}</g:id>

  <g:title><![CDATA[${title}]]></g:title>

  <g:description><![CDATA[${description}]]></g:description>

  <g:link>https://oshbahstore.com/product/${slug}</g:link>

  <g:image_link>${image}</g:image_link>

  ${extraImages}

  <g:availability>${availability}</g:availability>

  <g:condition>new</g:condition>

  <g:price>${price} SAR</g:price>

  ${
    product.oldPrice && product.oldPrice > product.price
      ? `<g:sale_price>${price} SAR</g:sale_price>
  <g:price>${oldPrice} SAR</g:price>`
      : ""
  }

  <g:brand>Oshbah</g:brand>

  <g:identifier_exists>false</g:identifier_exists>

  <g:product_type><![CDATA[${
          product.category || "Health & Beauty"
        }]]></g:product_type>

  <g:google_product_category>
  Health &amp; Beauty &gt; Health Care
  </g:google_product_category>

  <g:item_group_id>${doc.id}</g:item_group_id>

  <g:shipping>
  <g:country>SA</g:country>
  <g:service>Standard</g:service>
  <g:price>0 SAR</g:price>
  </g:shipping>

  <g:adult>no</g:adult>

  <g:age_group>adult</g:age_group>

  <g:gender>unisex</g:gender>

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
