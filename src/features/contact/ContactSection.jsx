import React, { useState, useRef, useCallback } from "react";
import "./styles/ContactSection.css";

const ContactSection = () => {
  const [expandedGroups, setExpandedGroups] = useState(["contacts"]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef(null);

  const toggleGroup = (id) => {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  // Fix textarea focus issue by using useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const jsonPreview = JSON.stringify(formData, null, 2);

  return (
    <div className="contact-section">
      <div className="contact-sidebar">
        <div className="contact-sidebar-title">_contact-me</div>
        <div className="contact-folder">
          <div
            onClick={() => toggleGroup("contacts")}
            className="contact-folder-header"
          >
            <span
              className="contact-folder-arrow"
              style={{
                transform: expandedGroups.includes("contacts")
                  ? "rotate(90deg)"
                  : "rotate(0)",
              }}
            >
              ▶
            </span>
            <span>📁</span>
            <span>contacts</span>
          </div>
          {expandedGroups.includes("contacts") && (
            <div className="contact-folder-content">
              <div>📧 bahiryasreb@gmail.com</div>
              <div>📱 +992 930 550 664</div>
            </div>
          )}
        </div>
        <div className="contact-folder">
          <div
            onClick={() => toggleGroup("find-me-also-in")}
            className="contact-folder-header"
          >
            <span
              className="contact-folder-arrow"
              style={{
                transform: expandedGroups.includes("find-me-also-in")
                  ? "rotate(90deg)"
                  : "rotate(0)",
              }}
            >
              ▶
            </span>
            <span>📁</span>
            <span>find-me-also-in</span>
          </div>
          {expandedGroups.includes("find-me-also-in") && (
            <div className="contact-folder-content">
              <a
                href="https://github.com/BahirYasrebSeemab"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                🔗 GitHub
              </a>
              <a
                href="https://linkedin.com/in/johndoe"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                🔗 LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="contact-content">
        <div className="contact-form-container">
          <h2 className="contact-form-title">_contact-form</h2>
          {showSuccess ? (
            <div className="contact-success">
              <div className="contact-success-icon">✅</div>
              <h3 className="contact-success-title">Thank you! 🎉</h3>
              <p className="contact-success-message">
                Your message has been sent successfully!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-field">
                <label className="contact-label">_name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="contact-input"
                />
              </div>
              <div className="contact-field">
                <label className="contact-label">_email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="contact-input"
                />
              </div>
              <div className="contact-field">
                <label className="contact-label">_message:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  ref={textareaRef}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="contact-textarea"
                />
              </div>
              <button type="submit" className="contact-submit">
                submit-message
              </button>
            </form>
          )}
        </div>
        <div className="contact-preview">
          <div className="contact-preview-tab">message.json</div>
          <pre className="contact-preview-code">{jsonPreview}</pre>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
