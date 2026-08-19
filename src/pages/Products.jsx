// src/pages/Products.jsx
import React, { useState, useEffect } from "react";
import "./PageStyles.css";
import SearchBar from "../components/SearchBar";
import CategoryPage from "./CategoryPage";
import { fetchProductsByCategory, fetchAllProducts } from "../data/fetchProducts";

function Products({ addToCart, categoryList = [], selectedTab }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Products per category, keyed by category key
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(false);

  // All products for search
  const [allProducts, setAllProducts] = useState([]);

  // Load products for the selected tab (lazy — only fetch when tab is first visited)
  useEffect(() => {
    if (!selectedTab) return;
    if (productsByCategory[selectedTab]) return; // already loaded
    setLoadingCategory(true);
    fetchProductsByCategory(selectedTab).then((products) => {
      setProductsByCategory((prev) => ({ ...prev, [selectedTab]: products }));
      setLoadingCategory(false);
    });
  }, [selectedTab]);

  // Load all products when search query appears
  useEffect(() => {
    if (!searchQuery) return;
    if (allProducts.length > 0) return; // already loaded
    fetchAllProducts().then(setAllProducts);
  }, [searchQuery]);

  const filteredResults = searchQuery
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Category navigation now lives in the TopNavbar's Products dropdown */}

      {filteredResults ? (
        <>
          <h2>Search Results for "{searchQuery}"</h2>
          {filteredResults.length === 0 ? (
            <p>No products found.</p>
          ) : (
            categoryList.map(({ key, label }) => {
              const categoryProducts = filteredResults.filter(
                (p) => p.category === key
              );
              if (categoryProducts.length === 0) return null;
              return (
                <div key={key}>
                  <h3>{label}</h3>
                  <CategoryPage
                    products={[]}
                    addToCart={addToCart}
                    overrideData={categoryProducts}
                  />
                </div>
              );
            })
          )}
        </>
      ) : (
        <>
          {loadingCategory && (
            <p style={{ marginTop: "2rem" }}>Loading products...</p>
          )}
          {!loadingCategory && selectedTab && (
            <CategoryPage
              key={selectedTab}
              products={productsByCategory[selectedTab] || []}
              addToCart={addToCart}
              searchQuery={searchQuery}
            />
          )}
        </>
      )}
    </>
  );
}

export default Products;
