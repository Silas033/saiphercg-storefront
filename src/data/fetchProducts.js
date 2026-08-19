// src/data/fetchProducts.js
import { supabase } from "../lib/supabaseClient";

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("key, label")
    .order("sort_order");

  if (error) {
    console.error("fetchCategories error:", error.message);
    return [];
  }

  return data;
}

function shapeProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category_key,
    hidePrice: p.hide_price,
    video: p.video || null,
    description: p.description,
    saleUnit: p.sale_unit,
    variantLabel: p.variant_label || "Select Variant",
    variants: [...p.product_variants]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((v) => ({ id: v.id, label: v.label, price: v.price })),
    images: [...p.product_images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url || i.filename),
  };
}

const PRODUCT_SELECT = `
  id,
  name,
  category_key,
  hide_price,
  video,
  description,
  sale_unit,
  variant_label,
  product_variants ( id, label, price, sort_order ),
  product_images ( filename, url, sort_order )
`;

export async function fetchProductsByCategory(categoryKey) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_key", categoryKey)
    .order("sort_order");

  if (error) {
    console.error("fetchProductsByCategory error:", error.message);
    return [];
  }

  return data.map(shapeProduct);
}

export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("sort_order");

  if (error) {
    console.error("fetchAllProducts error:", error.message);
    return [];
  }

  return data.map(shapeProduct);
}