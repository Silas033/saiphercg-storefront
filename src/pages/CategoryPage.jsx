// src/pages/CategoryPage.jsx
//
// Generic product-grid page. Replaces ShrinkWrapFilm.jsx, Roll.jsx,
// Liners.jsx, Others.jsx, and PackagingSupplies.jsx, which were all
// duplicates of this same component with different hardcoded data.
//
// Usage:
//   <CategoryPage products={categories.Roll.products} addToCart={addToCart} searchQuery={searchQuery} />
//   <CategoryPage products={someFilteredArray} overrideData addToCart={addToCart} />

import React, { useState } from "react";
import ProductModalWithPieces from "../components/ProductModalv2";
import "./ProductGrid.css";

// Products no longer carry a flat `price` field — real prices live on each
// variant. This shows the lowest variant price as a "starting at" figure.
//
// Two separate reasons a price can be hidden, kept distinct on purpose:
//  1. `product.hidePrice === true`  -> client's deliberate choice to not show price,
//     regardless of what the variant data says.
//  2. Every variant price is 0      -> no real prices have been entered yet
//     (placeholder/unfinished data).
// A single real variant priced at 0 (e.g. a free sample) is NOT treated as
// "unset" -- it shows "Starting at ₱0" because that's true information.
function startingPrice(product) {
  if (product.hidePrice) return "";
  if (!product.variants || product.variants.length === 0) return "";
  const prices = product.variants.map((v) => v.price);
  const allUnset = prices.every((p) => p === 0);
  if (allUnset) return "";
  const lowest = Math.min(...prices);
  return `Starting at ₱${lowest}`;
}

function CategoryPage({ products, addToCart, searchQuery = "", overrideData }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  // overrideData (e.g. pre-filtered search results) takes priority;
  // otherwise use the category's full product list.
  const itemsToShow = overrideData || products;

  // Only apply the local search filter when overrideData wasn't already filtered.
  const filteredItems = overrideData
    ? itemsToShow
    : itemsToShow.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}></h2>
      <div className="product-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={product.images[0]}
                alt={product.name}
                onClick={() => handleProductClick(product)}
                className="product-image"
              />
              <p className="product-name">{product.name}</p>
              <p className="product-price">{startingPrice(product)}</p>
              <button
                onClick={() => handleProductClick(product)}
                className="product-button"
              >
                View Product
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No products match your search.</p>
        )}
      </div>

      <ProductModalWithPieces
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        product={selectedProduct}
        addToCart={addToCart}
      />
    </div>
  );
}

export default CategoryPage;