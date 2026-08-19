// src/data/categoryRegistry.js
//
// Single source of truth for all product categories.
// To add a new category later:
//   1. Add product images to src/assets/products/<CategoryKey>/
//   2. Create src/data/products/<categoryKey>.js exporting `products`
//   3. Add one entry below.
// No changes needed in TopNavbar.jsx, MainLayout.jsx, or any page component.

import { products as shrinkWrapFilm } from "./products/shrinkWrapFilm";
import { products as roll } from "./products/roll";
import { products as liners } from "./products/liners";
import { products as packagingSupplies } from "./products/packagingSupplies";
import { products as others } from "./products/others";

export const categories = {
  ShrinkWrapFilm: {
    label: "Shrink Wrap Film",
    products: shrinkWrapFilm,
  },
  Roll: {
    label: "Shrink Wrap Rolls",
    products: roll,
  },
  Liners: {
    label: "Liners",
    products: liners,
  },
  PackagingSupplies: {
    label: "Packaging Supplies",
    products: packagingSupplies,
  },
  Others: {
    label: "Others",
    products: others,
  },
};

// Ordered list of category keys (object key order is preserved in JS,
// but this is exported explicitly so render order is never ambiguous).
export const categoryKeys = Object.keys(categories);