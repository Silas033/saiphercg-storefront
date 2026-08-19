import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import "./ProductModal.css";

Modal.setAppElement("#root");

// Detects YouTube URLs and returns the video ID, or null if not YouTube.
// Handles: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function buildSlides(product) {
  if (!product) return [];
  const slides = [];
  const images = product.images || [];
  if (images.length > 0) slides.push({ type: "image", src: images[0] });
  if (product.video) {
    const ytId = getYouTubeId(product.video);
    if (ytId) {
      slides.push({ type: "youtube", src: `https://www.youtube.com/embed/${ytId}` });
    } else {
      slides.push({ type: "video", src: product.video });
    }
  }
  images.slice(1).forEach((src) => slides.push({ type: "image", src }));
  return slides;
}

function ProductModalv2({ isOpen, onRequestClose, product, addToCart }) {
  const [sizeOptions, setSizeOptions] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState(null); // null = closed
  const videoRef = useRef(null);

  const slides = buildSlides(product);

  useEffect(() => {
    if (product && product.variants) {
      setSizeOptions(product.variants);
      setSelectedSize(product.variants[0] || null);
      setQuantity(1);
      setCurrentSlideIndex(0);
      setLightboxSrc(null);
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentSlideIndex]);

  const handlePrev = () =>
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  const calculateTotalPrice = () => {
    if (!selectedSize) return 0;
    return selectedSize.price * quantity;
  };

  const totalPrice = calculateTotalPrice();

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      ...product,
      price: totalPrice,
      selectedSize: selectedSize.label,
      selectedVariantId: selectedSize.id,
      quantity,
      image: product.images?.[0] || "",
    });
    onRequestClose();
  };

  if (!product) return null;

  const currentSlide = slides[currentSlideIndex];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Product Modal"
        className="product-modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="modal-title">{product.name}</h2>
        <div className="modal-scroll-content">

          {/* Carousel */}
          <div className="carousel-wrapper">
            {slides.length > 1 && (
              <button className="carousel-button carousel-prev" onClick={handlePrev}>
                ‹
              </button>
            )}
            <div className="carousel-container">
              {currentSlide?.type === "image" && (
                <img
                  src={currentSlide.src}
                  alt={`${product.name} ${currentSlideIndex + 1}`}
                  className="carousel-image"
                  onClick={() => setLightboxSrc(currentSlide.src)}
                  title="Click to enlarge"
                />
              )}
              {currentSlide?.type === "video" && (
                <video
                  ref={videoRef}
                  src={currentSlide.src}
                  className="carousel-video"
                  controls
                  playsInline
                />
              )}
              {currentSlide?.type === "youtube" && (
                <iframe
                  src={currentSlide.src}
                  className="carousel-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Product video"
                  frameBorder="0"
                />
              )}
            </div>
            {slides.length > 1 && (
              <button className="carousel-button carousel-next" onClick={handleNext}>
                ›
              </button>
            )}
          </div>

          <div className="modal-body-scrollable">
            {/* Variant selector */}
            <div className="size-section">
              <div className="size-label">
                {product.variantLabel || "Select Variant"} :
              </div>
              <div className="size-options">
                {sizeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedSize(option)}
                    className={`size-button ${
                      selectedSize?.id === option.id ? "selected" : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <div className="quantity-label">Quantity:</div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
                <div className="quantity-control">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                {product.saleUnit && (
                  <div className="quantity-note">({product.saleUnit})</div>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="description-box">{product.description}</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="cancel-button" onClick={onRequestClose}>
            Cancel
          </button>
          <p className="total-price">Total: ₱{totalPrice.toFixed(2)}</p>
          <button className="add-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </Modal>

      {/* Lightbox — rendered outside the modal so it sits above it */}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button
            className="lightbox-close"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close enlarged image"
          >
            ✕
          </button>
          <img
            src={lightboxSrc}
            alt="Enlarged product"
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()} // clicking image itself doesn't close
          />
        </div>
      )}
    </>
  );
}

export default ProductModalv2;