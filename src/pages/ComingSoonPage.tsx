// src/components/ComingSoon.jsx
import React from "react";
import { Link } from "react-router-dom"; // if using react-router

const ComingSoon = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px 20px",
        background: "#f5f5f5",
        color: "#333",
        minHeight: "100vh",
      }}
    >
      <div style={{ fontSize: "5rem" }}>🎬</div>
      <h1 style={{ fontSize: "3rem", margin: "20px 0" }}>Video Coming Soon!</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "40px" }}>
        The video isn’t ready yet. Check back soon!
      </p>
      <Link
        to="/trails"
        style={{
          textDecoration: "none",
          color: "#fff",
          background: "#007bff",
          padding: "12px 24px",
          borderRadius: "6px",
        }}
      >
        Back to Trails
      </Link>
    </div>
  );
};

export default ComingSoon;
