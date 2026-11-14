// src/data/fetchProducts.js
import { supabase } from "../lib/supabaseClient";
import { shapeVariants } from "./variantGroups";

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
    // variantGroups = every variation set, variants = first set, combinations = whole-ID rows
    ...shapeVariants(p.product_variants, p.variant_label || "Select Variant"),
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
  product_variants ( id, label, price, sort_order, group_no, group_label, is_combination ),
  product_images ( filename, url, sort_order )
`;

// Used only if the new variation columns have not been added in Supabase yet,
// so the storefront keeps working until the SQL is run.
const LEGACY_PRODUCT_SELECT = `
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

async function selectProducts(build) {
  let result = await build(PRODUCT_SELECT);
  if (result.error && /group_no|group_label|is_combination/i.test(result.error.message || "")) {
    result = await build(LEGACY_PRODUCT_SELECT);
  }
  return result;
}

export async function fetchProductsByCategory(categoryKey) {
  const { data, error } = await selectProducts((columns) =>
    supabase
      .from("products")
      .select(columns)
      .eq("category_key", categoryKey)
      .order("sort_order")
  );

  if (error) {
    console.error("fetchProductsByCategory error:", error.message);
    return [];
  }

  return data.map(shapeProduct);
}

export async function fetchAllProducts() {
  const { data, error } = await selectProducts((columns) =>
    supabase
      .from("products")
      .select(columns)
      .order("sort_order")
  );

  if (error) {
    console.error("fetchAllProducts error:", error.message);
    return [];
  }

  return data.map(shapeProduct);
}