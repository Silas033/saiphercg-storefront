import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import "./TopNavbar.css";

function TopNavbar({
  onViewCart,
  selectedMainTab,
  setSelectedMainTab,
  cart,
  minimal = false,
  categoryList = [],
  selectedCategory,
  onSelectCategory,
  defaultCategoryKey,
  companyPageList = [],
  selectedCompanyPageId,
  onSelectCompanyPage,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  const productsDropdownRef = useRef(null);
  const companyDropdownRef = useRef(null);
  const productsCloseTimerRef = useRef(null);
  const companyCloseTimerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(event.target)
      ) {
        setShowProductsMenu(false);
      }

      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target)
      ) {
        setShowCompanyMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(
    () => () => {
      if (productsCloseTimerRef.current) {
        clearTimeout(productsCloseTimerRef.current);
      }
      if (companyCloseTimerRef.current) {
        clearTimeout(companyCloseTimerRef.current);
      }
    },
    []
  );

  const clearTimer = (timerRef) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const openOnHover = (setOpen, timerRef) => {
    if (!isMobile) {
      clearTimer(timerRef);
      setOpen(true);
    }
  };

  const closeOnLeave = (setOpen, timerRef) => {
    if (!isMobile) {
      clearTimer(timerRef);
      timerRef.current = setTimeout(() => setOpen(false), 50);
    }
  };

  const handleProductsClick = (event) => {
    event.preventDefault();
    if (defaultCategoryKey) {
      onSelectCategory?.(defaultCategoryKey);
    } else {
      setSelectedMainTab("products");
    }
    setShowProductsMenu(false);
    setShowCompanyMenu(false);
  };

  const handleCompanyClick = (event) => {
    event.preventDefault();
    const firstPageId = companyPageList[0]?.id;
    if (firstPageId) {
      onSelectCompanyPage?.(firstPageId);
    } else {
      setSelectedMainTab("company");
    }
    setShowCompanyMenu(false);
    setShowProductsMenu(false);
  };

  const handleCategorySelect = (key) => {
    onSelectCategory?.(key);
    setShowProductsMenu(false);
  };

  const handleCompanyPageSelect = (pageId) => {
    onSelectCompanyPage?.(pageId);
    setShowCompanyMenu(false);
  };

  return (
    <nav className="top-navbar">
      {!minimal && (
        <div className="top-navbar-links">
          <div
            className="top-navbar-dropdown"
            ref={companyDropdownRef}
            onMouseEnter={() =>
              openOnHover(setShowCompanyMenu, companyCloseTimerRef)
            }
            onMouseLeave={() =>
              closeOnLeave(setShowCompanyMenu, companyCloseTimerRef)
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") setShowCompanyMenu(false);
            }}
          >
            <div className="top-navbar-dropdown-trigger-group">
              <button
                type="button"
                onClick={handleCompanyClick}
                onFocus={() => setShowCompanyMenu(true)}
                className={`top-navbar-link top-navbar-dropdown-trigger ${
                  selectedMainTab === "company" ? "active" : ""
                }`}
                aria-haspopup="menu"
                aria-expanded={showCompanyMenu}
              >
                Company
              </button>
              <button
                type="button"
                className="dropdown-toggle-button"
                aria-label="Show Company pages"
                aria-expanded={showCompanyMenu}
                onClick={(event) => {
                  event.preventDefault();
                  setShowCompanyMenu((current) => !current);
                  setShowProductsMenu(false);
                }}
              >
                <span className={`dropdown-arrow ${showCompanyMenu ? "open" : ""}`}>
                  &#9662;
                </span>
              </button>
            </div>

            {showCompanyMenu && (
              <div
                className="top-navbar-dropdown-menu company-dropdown-menu"
                role="menu"
                onMouseEnter={() =>
                  openOnHover(setShowCompanyMenu, companyCloseTimerRef)
                }
                onMouseLeave={() =>
                  closeOnLeave(setShowCompanyMenu, companyCloseTimerRef)
                }
              >
                <div className="top-navbar-dropdown-list">
                  {companyPageList.length === 0 ? (
                    <span className="dropdown-empty">No Company pages published.</span>
                  ) : (
                    companyPageList.slice(0, 5).map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        className={`dropdown-item ${
                          selectedCompanyPageId === page.id ? "selected" : ""
                        }`}
                        onClick={() => handleCompanyPageSelect(page.id)}
                        onFocus={() => setShowCompanyMenu(true)}
                        role="menuitem"
                      >
                        {page.nav_label}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="top-navbar-dropdown"
            ref={productsDropdownRef}
            onMouseEnter={() =>
              openOnHover(setShowProductsMenu, productsCloseTimerRef)
            }
            onMouseLeave={() =>
              closeOnLeave(setShowProductsMenu, productsCloseTimerRef)
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") setShowProductsMenu(false);
            }}
          >
            <div className="top-navbar-dropdown-trigger-group">
              <button
                type="button"
                onClick={handleProductsClick}
                onFocus={() => setShowProductsMenu(true)}
                className={`top-navbar-link top-navbar-dropdown-trigger ${
                  selectedMainTab === "products" ? "active" : ""
                }`}
                aria-haspopup="menu"
                aria-expanded={showProductsMenu}
              >
                Products
              </button>
              <button
                type="button"
                className="dropdown-toggle-button"
                aria-label="Show product categories"
                aria-expanded={showProductsMenu}
                onClick={(event) => {
                  event.preventDefault();
                  setShowProductsMenu((current) => !current);
                  setShowCompanyMenu(false);
                }}
              >
                <span className={`dropdown-arrow ${showProductsMenu ? "open" : ""}`}>
                  &#9662;
                </span>
              </button>
            </div>

            {showProductsMenu && (
              <div
                className="top-navbar-dropdown-menu"
                role="menu"
                onMouseEnter={() =>
                  openOnHover(setShowProductsMenu, productsCloseTimerRef)
                }
                onMouseLeave={() =>
                  closeOnLeave(setShowProductsMenu, productsCloseTimerRef)
                }
              >
                <div className="top-navbar-dropdown-list">
                  {categoryList.length === 0 ? (
                    <span className="dropdown-empty">Loading categories...</span>
                  ) : (
                    categoryList.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        className={`dropdown-item ${
                          selectedCategory === key ? "selected" : ""
                        }`}
                        onClick={() => handleCategorySelect(key)}
                        onFocus={() => setShowProductsMenu(true)}
                        role="menuitem"
                      >
                        {label}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedMainTab("contactUs");
              setShowProductsMenu(false);
              setShowCompanyMenu(false);
            }}
            className={`top-navbar-link top-navbar-plain-button ${
              selectedMainTab === "contactUs" ? "active" : ""
            }`}
          >
            Contact Us
          </button>
        </div>
      )}

      <div className="top-navbar-logo">
        <img src={logo} alt="Logo" className="logo-img" />
        <span className="logo-text">Saipher CG</span>
      </div>

      {!minimal && (
        <div className="top-navbar-cart">
          <button type="button" onClick={onViewCart} className="cart-button">
            View Cart
            {cart?.length > 0 && <span className="cart-indicator" />}
          </button>
        </div>
      )}
    </nav>
  );
}

export default TopNavbar;