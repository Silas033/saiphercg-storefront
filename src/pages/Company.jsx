// src/pages/Company.jsx
import React, { useEffect, useMemo, useState } from "react";
import CategoryPage from "./CategoryPage";
import "./PageStyles.css";

function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function sanitizeCompanyHtml(html) {
  if (!html || typeof document === "undefined") return "";

  const template = document.createElement("template");
  template.innerHTML = html;

  const allowedTags = new Set([
    "P",
    "DIV",
    "SPAN",
    "BR",
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "FONT",
    "H1",
    "H2",
    "H3",
    "H4",
    "UL",
    "OL",
    "LI",
  ]);

  const allowedStyleProperties = new Set([
    "color",
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "text-decoration",
    "text-align",
  ]);

  const elements = [...template.content.querySelectorAll("*")];

  elements.forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (name !== "style" && name !== "color" && name !== "face" && name !== "size") {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.hasAttribute("style")) {
      const safeRules = element
        .getAttribute("style")
        .split(";")
        .map((rule) => rule.trim())
        .filter(Boolean)
        .filter((rule) => {
          const property = rule.split(":")[0]?.trim().toLowerCase();
          return allowedStyleProperties.has(property);
        });

      if (safeRules.length) {
        element.setAttribute("style", safeRules.join("; "));
      } else {
        element.removeAttribute("style");
      }
    }
  });

  return template.innerHTML;
}

export default function Company({ page, loading, addToCart }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    document.body.classList.add("company-bg");
    return () => document.body.classList.remove("company-bg");
  }, []);

  useEffect(() => {
    setLightboxImage(null);
  }, [page?.id]);

  if (loading) {
    return (
      <div className="page-content-container dynamic-company-page company-page-state">
        Loading Company page…
      </div>
    );
  }

  if (!page) {
    return (
      <div className="page-content-container dynamic-company-page company-page-state">
        <h1>Company</h1>
        <p>No Company page has been published yet.</p>
      </div>
    );
  }

  return (
    <div className="page-content-container dynamic-company-page">
      <header className="dynamic-company-header">
        <span>Saipher CG</span>
        <h1>{page.title}</h1>
      </header>

      <div className="dynamic-company-blocks">
        {(page.blocks || []).map((block) => (
          <CompanyBlock
            key={block.id}
            block={block}
            addToCart={addToCart}
            onOpenImage={setLightboxImage}
          />
        ))}
      </div>

      {lightboxImage && (
        <div
          className="company-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt || "Company image"}
          onMouseDown={() => setLightboxImage(null)}
        >
          <button
            type="button"
            className="company-lightbox-close"
            onClick={() => setLightboxImage(null)}
            aria-label="Close image"
          >
            ×
          </button>
          <figure onMouseDown={(event) => event.stopPropagation()}>
            <img src={lightboxImage.url} alt={lightboxImage.alt || "Company"} />
            {lightboxImage.caption && <figcaption>{lightboxImage.caption}</figcaption>}
          </figure>
        </div>
      )}
    </div>
  );
}

function CompanyBlock({ block, addToCart, onOpenImage }) {
  if (block.block_type === "text") {
    return <CompanyTextBlock html={block.content?.html || ""} />;
  }

  if (block.block_type === "gallery") {
    const images = block.content?.images || [];
    if (!images.length) return null;

    const columns = Math.max(1, Math.min(Number(block.content?.columns || 3), 4));

    return (
      <section
        className="dynamic-company-gallery"
        style={{ "--company-gallery-columns": columns }}
      >
        {images.map((image) => (
          <figure key={image.id || image.url}>
            <button type="button" onClick={() => onOpenImage(image)}>
              <img src={image.url} alt={image.alt || "Company"} />
            </button>
            {image.caption && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
      </section>
    );
  }

  if (block.block_type === "youtube") {
    const videoId = getYouTubeId(block.content?.url || "");
    if (!videoId) return null;

    return (
      <figure className="dynamic-company-video">
        <div>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={block.content?.caption || "Company video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {block.content?.caption && <figcaption>{block.content.caption}</figcaption>}
      </figure>
    );
  }

  if (block.block_type === "products") {
    if (!block.products?.length) return null;

    return (
      <section className="dynamic-company-products">
        <h2>{block.content?.heading || "Featured Products"}</h2>
        <CategoryPage
          products={block.products}
          overrideData={block.products}
          addToCart={addToCart}
        />
      </section>
    );
  }

  return null;
}

function CompanyTextBlock({ html }) {
  const safeHtml = useMemo(() => sanitizeCompanyHtml(html), [html]);

  return (
    <section
      className="dynamic-company-rich-text"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}