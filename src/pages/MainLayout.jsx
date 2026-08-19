// src/pages/MainLayout.jsx
import React, { useCallback, useEffect, useState } from "react";
import "./PageStyles.css";
import TopNavbar from "../components/TopNavbar";
import Products from "./Products";
import ContactUs from "./ContactUs";
import Company from "./Company";
import CartSidebar, { useCartState } from "../components/CartSideBar";
import { fetchCategories } from "../data/fetchProducts";
import { fetchCompanyPages } from "../data/fetchCompanyPages";
import { supabase } from "../lib/supabaseClient";

function MainLayout() {
  useEffect(() => {
    document.body.classList.add("home-bg");
    return () => document.body.classList.remove("home-bg");
  }, []);

  const [mainTab, setMainTab] = useState("company");
  const [showCart, setShowCart] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);

  const [companyPages, setCompanyPages] = useState([]);
  const [selectedCompanyPageId, setSelectedCompanyPageId] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((categories) => {
      setCategoryList(categories);
      if (categories.length > 0) setSelectedTab(categories[0].key);
    });
  }, []);

  const loadCompanyPages = useCallback(async () => {
    setCompanyLoading(true);
    const pages = await fetchCompanyPages();
    setCompanyPages(pages);
    setSelectedCompanyPageId((current) =>
      pages.some((page) => page.id === current) ? current : pages[0]?.id || null
    );
    setCompanyLoading(false);
  }, []);

  useEffect(() => {
    loadCompanyPages();

    const channel = supabase
      .channel("storefront-company-pages-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "company_pages" },
        loadCompanyPages
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "company_page_blocks" },
        loadCompanyPages
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "company_page_block_products",
        },
        loadCompanyPages
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCompanyPages]);

  const {
    cart,
    addToCart,
    handleQuantityChange,
    setItemQuantity,
    handleRemove,
    computeSubtotal,
  } = useCartState();

  const handleSelectCategory = (key) => {
    setSelectedTab(key);
    setMainTab("products");
  };

  const handleSelectCompanyPage = (pageId) => {
    setSelectedCompanyPageId(pageId);
    setMainTab("company");
  };

  const selectedCompanyPage =
    companyPages.find((page) => page.id === selectedCompanyPageId) ||
    companyPages[0] ||
    null;

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <TopNavbar
        onViewCart={() => setShowCart((previous) => !previous)}
        selectedMainTab={mainTab}
        setSelectedMainTab={setMainTab}
        cart={cart}
        categoryList={categoryList}
        selectedCategory={selectedTab}
        defaultCategoryKey={categoryList[0]?.key}
        onSelectCategory={handleSelectCategory}
        companyPageList={companyPages}
        selectedCompanyPageId={selectedCompanyPage?.id || null}
        onSelectCompanyPage={handleSelectCompanyPage}
      />

      {mainTab === "products" && (
        <Products
          addToCart={addToCart}
          categoryList={categoryList}
          selectedTab={selectedTab}
        />
      )}

      {mainTab === "contactUs" && <ContactUs />}

      {mainTab === "company" && (
        <Company
          page={selectedCompanyPage}
          loading={companyLoading}
          addToCart={addToCart}
        />
      )}

      {showCart && (
        <CartSidebar
          isOpen={showCart}
          cart={cart}
          onQtyChange={handleQuantityChange}
          onQtySet={setItemQuantity}
          onRemove={handleRemove}
          computeSubtotal={computeSubtotal}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
}

export default MainLayout;