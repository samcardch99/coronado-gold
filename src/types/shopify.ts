// src/types/shopify.ts
export interface ShopifyProduct {
    id: string;
    handle: string; // Para el enlace <a href>
    title: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    // Imagen principal por defecto
    featuredImage: {
        url: string;
        altText: string;
    };
    // Nuestra imagen de metafield
    hoverImage?: {
        reference: {
            image: {
                url: string;
                altText: string;
            };
        };
    };
}