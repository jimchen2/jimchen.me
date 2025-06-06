import React, { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children, colors, dark }) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: dark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
    display: isOpen ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: colors.color_white,
    borderRadius: "12px",
    padding: "1.5rem",
    maxWidth: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    width: "400px",
  };

  return (
    <div style={modalStyle}>
      <div ref={modalRef} style={modalContentStyle}>
        {children}
      </div>
    </div>
  );
};

export default Modal;