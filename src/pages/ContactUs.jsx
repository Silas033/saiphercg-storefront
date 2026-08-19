import React, { useEffect } from "react";
import {
  FaFacebook,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookMessenger,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SiViber } from "react-icons/si";
import "./PageStyles.css";

// ✅ Import images properly
import WhatsAppQR from "../assets/WA.jpg";
import ViberQR from "../assets/Viber.jpg";

const ContactUs = () => {
  useEffect(() => {
    document.body.classList.add("aboutus-bg");
    return () => {
      document.body.classList.remove("aboutus-bg");
    };
  }, []);

  // ✅ Gmail Compose URL
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    "saiphercg@gmail.com"
  )}&su=${encodeURIComponent(
    "Inquiry to Saipher CG"
  )}&body=${encodeURIComponent(`Hello Saipher CG,

I would like to inquire about...

Thank you.`)}`;

  return (
    <div className="page-content-container">
      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "orange",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Contact Us
        </div>

        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            fontSize: "1rem",
            marginLeft: "auto",
            color: "#ddd",
            lineHeight: "1.8",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div>
            <FaEnvelope style={{ marginRight: "10px", color: "#ffa94d" }} />
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ccc", textDecoration: "none" }}
            >
              saiphercg@gmail.com
            </a>
          </div>

          <div>
            <FaFacebook style={{ marginRight: "10px", color: "#ffa94d" }} />
            <a
              href="https://www.facebook.com/saiphercg"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ccc", textDecoration: "none" }}
            >
              facebook.com/saiphercg
            </a>
          </div>

          <div>
            <FaFacebookMessenger
              style={{ marginRight: "10px", color: "#ffa94d" }}
            />
            <a
              href="https://m.me/888183514664781?source=qr_link_share"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ccc", textDecoration: "none" }}
            >
              FacebookMessenger.com/saiphercg/
            </a>
          </div>

          <div>
            <FaPhoneAlt style={{ marginRight: "10px", color: "#ffa94d" }} />
            0998 531 9773
            <div style={{ marginTop: "8px", fontSize: "0.95rem" }}>
              <FaMapMarkerAlt
                style={{ marginRight: "8px", color: "#ffa94d" }}
              />
              <a
                href="https://www.google.com/maps/place/Saipher+CG+-+Supplies+%26+Wrap+Solution/@14.6762432,121.0466814,17z/data=!4m16!1m9!4m8!1m0!1m6!1m2!1s0x3397b75d03c19587:0x65de538882103443!2sSaipher+CG+-+Supplies+%26+Wrap+Solution,+68B+Urbano+Street,+Philand+Dr,+Quezon+City,+1107+Metro+Manila!2m2!1d121.0515523!2d14.6762433!3m5!1s0x3397b75d03c195443!8m2!3d14.6762433!4d121.0515523!16s%2Fg%2F11x_vsnh60?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ccc", textDecoration: "none" }}
              >
                68B Urbano Street, Philand Dr, Quezon City, 1107 Metro Manila
              </a>
            </div>
          </div>

          {/* ✅ WhatsApp + Viber side by side */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            {/* WhatsApp */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <FaWhatsapp style={{ color: "#ffa94d", fontSize: "1.3rem" }} />
                <span style={{ fontWeight: "bold", color: "#ffa94d" }}>
                  WhatsApp
                </span>
              </div>
              <img
                src={WhatsAppQR}
                alt="WhatsApp QR"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "8px",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </div>

            {/* Viber */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <SiViber style={{ color: "#ffa94d", fontSize: "1.3rem" }} />
                <span style={{ fontWeight: "bold", color: "#ffa94d" }}>
                  Viber
                </span>
              </div>
              <img
                src={ViberQR}
                alt="Viber QR"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "8px",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          paddingTop: "20px",
          fontSize: "0.9rem",
          color: "#aaa",
          borderTop: "1px solid #333",
        }}
      >
        &copy; {new Date().getFullYear()} Saipher CG. All rights reserved.
      </div>
    </div>
  );
};

export default ContactUs;