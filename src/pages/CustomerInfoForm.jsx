import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useCartState } from "../components/CartSideBar";
import { supabase } from "../lib/supabaseClient";
import TopNavbar from "../components/TopNavbar";
import "./CustomerinfoForm.css";

const EMPTY_FORM = {
  name: "",
  email: "",
  contact: "",
  address: "",
  note: "",
};

function CustomerInfoForm() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartState();

  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const recaptchaSiteKey =
    import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    document.body.classList.add("contact-bg");

    return () => {
      document.body.classList.remove("contact-bg");
    };
  }, []);

  const changeField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    if (status?.type === "error") {
      setStatus(null);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token || "");

    setErrors((current) => ({
      ...current,
      recaptcha: "",
    }));

    if (status?.type === "error") {
      setStatus(null);
    }
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken("");

    setErrors((current) => ({
      ...current,
      recaptcha:
        "The robot verification expired. Please verify again.",
    }));
  };

  const handleRecaptchaError = () => {
    setRecaptchaToken("");

    setErrors((current) => ({
      ...current,
      recaptcha:
        "The robot verification could not load. Please refresh the page.",
    }));
  };

  const validate = () => {
    const next = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      next.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      next.email = "Email address is required.";
    } else if (!emailPattern.test(formData.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!formData.contact.trim()) {
      next.contact = "Contact number is required.";
    }

    if (!formData.address.trim()) {
      next.address = "Delivery address is required.";
    }

    if (cart.length === 0) {
      next.cart = "Your cart is empty.";
    }

    if (!recaptchaSiteKey) {
      next.recaptcha =
        "The reCAPTCHA site key is not configured.";
    } else if (!recaptchaToken) {
      next.recaptcha =
        "Please confirm that you are not a robot.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const submitOrder = async () => {
    if (
      isSubmitting ||
      status?.type === "success" ||
      !validate()
    ) {
      return;
    }

    if (!isAgreed) {
      setStatus({
        type: "error",
        message:
          "Please agree to the Data Privacy Statement first.",
      });

      return;
    }

    const items = cart.map((item) => ({
      product_id: item.id,
      variant_id: item.selectedVariantId,
      quantity: Number(item.quantity),

      selected_pieces:
        item.selectedPieces === undefined ||
        item.selectedPieces === null
          ? null
          : String(item.selectedPieces),

      item_note: item.note
        ? String(item.note)
        : null,
    }));

    setIsSubmitting(true);

    setStatus({
      type: "loading",
      message: "Submitting your order...",
    });

    try {
      const { data, error } = await supabase.rpc(
        "submit_storefront_transaction",
        {
          p_customer_name: formData.name.trim(),
          p_email: formData.email.trim().toLowerCase(),
          p_contact_number: formData.contact.trim(),
          p_shipping_address: formData.address.trim(),
          p_note: formData.note.trim() || null,
          p_items: items,
        }
      );

      if (error) {
        throw error;
      }

      const result = Array.isArray(data)
        ? data[0]
        : data;

      if (!result?.order_number) {
        throw new Error(
          "No order number was returned by Supabase."
        );
      }

      setStatus({
        type: "success",
        orderNumber: result.order_number,
      });

      clearCart();

      recaptchaRef.current?.reset();
      setRecaptchaToken("");
    } catch (error) {
      console.error(
        "Transaction submission failed:",
        error
      );

      setStatus({
        type: "error",
        message:
          error?.message ||
          "Unable to submit your order.",
      });

      recaptchaRef.current?.reset();
      setRecaptchaToken("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopNavbar minimal />

      <main className="customer-info-page">
        <section className="customer-info-card">
          <h1>Customer Information</h1>

          {errors.cart && (
            <div className="form-message error">
              {errors.cart}
            </div>
          )}

          <div className="customer-form">
            <Field
              id="customer-name"
              label="Full Name"
              icon={<FaUser />}
              value={formData.name}
              onChange={changeField("name")}
              placeholder=""
              autoComplete="name"
              error={errors.name}
            />

            <div className="customer-form-row">
              <Field
                id="customer-email"
                label="Email Address"
                icon={<FaEnvelope />}
                type="email"
                value={formData.email}
                onChange={changeField("email")}
                placeholder="youremail@example.com"
                autoComplete="email"
                error={errors.email}
              />

              <Field
                id="customer-contact"
                label="Contact Number"
                icon={<FaPhoneAlt />}
                type="tel"
                value={formData.contact}
                onChange={changeField("contact")}
                placeholder=""
                autoComplete="tel"
                error={errors.contact}
              />
            </div>

            <Field
              id="customer-address"
              label="Delivery Address"
              icon={<FaMapMarkerAlt />}
              value={formData.address}
              onChange={changeField("address")}
              placeholder="House number, street, barangay, city, and province"
              autoComplete="street-address"
              error={errors.address}
            />

            <div className="customer-field">
              <div className="note-heading">
                <label htmlFor="customer-note">
                  Note <span>(Optional)</span>
                </label>

                <small>
                  {formData.note.length}/250
                </small>
              </div>

              <textarea
                id="customer-note"
                value={formData.note}
                onChange={changeField("note")}
                placeholder="Add any additional notes here..."
                maxLength={250}
                rows={4}
              />
            </div>

            <div className="recaptcha-section">
              <div className="recaptcha-label">
                   <b></b>
              </div>

              {recaptchaSiteKey ? (
                <div className="recaptcha-widget-wrapper">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    theme="dark"
                    onChange={handleRecaptchaChange}
                    onExpired={handleRecaptchaExpired}
                    onErrored={handleRecaptchaError}
                  />
                </div>
              ) : (
                <div className="recaptcha-config-error">
                  Add VITE_RECAPTCHA_SITE_KEY to your
                  storefront .env file.
                </div>
              )}

              {errors.recaptcha && (
                <small className="field-error">
                  {errors.recaptcha}
                </small>
              )}
            </div>

            <div className="privacy-row">
              <input
                id="privacyAgree"
                type="checkbox"
                checked={isAgreed}
                onChange={(event) => {
                  setIsAgreed(event.target.checked);

                  if (status?.type === "error") {
                    setStatus(null);
                  }
                }}
              />

              <label htmlFor="privacyAgree">
                By placing an order, I confirm I have
                read and agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                >
                  Data Privacy Statement
                </button>
                .
              </label>
            </div>

            {status && (
              <div
                className={`form-message ${status.type}`}
                role="status"
              >
                {status.type === "success" ? (
                  <>
                    Order{" "}
                    <strong>
                      {status.orderNumber}
                    </strong>{" "}
                    was submitted successfully. Please
                    wait for our response.
                  </>
                ) : (
                  status.message
                )}
              </div>
            )}

            <div className="customer-form-actions">
              <button
                type="button"
                className="back-button"
                onClick={() => navigate("/")}
              >
                <FaArrowLeft />
                Back to Cart
              </button>

              <button
                type="button"
                className="submit-button"
                onClick={submitOrder}
                disabled={
                  isSubmitting ||
                  !isAgreed ||
                  !recaptchaToken ||
                  !recaptchaSiteKey ||
                  cart.length === 0 ||
                  status?.type === "success"
                }
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Order"}

                {!isSubmitting && <FaArrowRight />}
              </button>
            </div>
          </div>
        </section>
      </main>

      {showPrivacy && (
        <div
          className="privacy-overlay"
          onMouseDown={() =>
            setShowPrivacy(false)
          }
        >
          <section
            className="privacy-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="privacy-modal-header">
              <h2 id="privacy-title">
                Data Privacy Statement
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowPrivacy(false)
                }
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="privacy-modal-content">
              <p>
                By providing your personal
                information, you consent to its
                collection, use, and processing in
                accordance with the Data Privacy Act
                of 2012 (RA 10173).
              </p>

              <p>
                Your information will be used only to
                process your order, maintain customer
                records, and provide order-related
                updates.
              </p>

              <p>
                We will keep your information
                confidential and protect it from
                unauthorized access, disclosure, or
                misuse.
              </p>
            </div>

            <button
              type="button"
              className="privacy-close-button"
              onClick={() =>
                setShowPrivacy(false)
              }
            >
              Close
            </button>
          </section>
        </div>
      )}
    </>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  type = "text",
  ...props
}) {
  return (
    <div className="customer-field">
      <label htmlFor={id}>
        {label} <b>*</b>
      </label>

      <div
        className={`input-shell ${
          error ? "has-error" : ""
        }`}
      >
        <span>{icon}</span>

        <input
          id={id}
          type={type}
          {...props}
        />
      </div>

      {error && (
        <small className="field-error">
          {error}
        </small>
      )}
    </div>
  );
}

export default CustomerInfoForm;