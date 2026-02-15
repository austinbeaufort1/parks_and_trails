import React from "react";

const Contact: React.FC = () => {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌲 Suggest a Trail</h1>

        <p style={styles.text}>
          Have a trail you'd like to see added to the app?
        </p>

        <p style={styles.text}>Send your submission to:</p>

        <a href="mailto:traildepth@gmail.com" style={styles.email}>
          traildepth@gmail.com
        </a>

        <div style={styles.section}>
          <h3 style={styles.subheading}>What to Include:</h3>
          <ul style={styles.list}>
            <li>📍 Trail name + location</li>
            <li>📁 GPX file attachment</li>
            <li>🎥 YouTube video link (if available)</li>
            <li>📝 Short description of the trail</li>
          </ul>
        </div>

        <p style={styles.footer}>
          We review all submissions and appreciate your help growing the hiking
          community.
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    maxWidth: "700px",
    width: "100%",
    boxShadow: "0 10px 30px rgba(34, 49, 34, 0.15)",
    border: "1px solid #d7e7d9",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#1b5e20",
  },
  text: {
    fontSize: "1.1rem",
    marginBottom: "12px",
    color: "#2e4d2f",
  },
  email: {
    display: "inline-block",
    margin: "20px 0",
    fontSize: "1.3rem",
    fontWeight: 600,
    color: "#2e7d32",
    textDecoration: "none",
    padding: "10px 18px",
    backgroundColor: "#e8f5e9",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },
  section: {
    marginTop: "30px",
    textAlign: "left",
  },
  subheading: {
    color: "#1b5e20",
    marginBottom: "10px",
  },
  list: {
    lineHeight: "1.9",
    color: "#2e4d2f",
    paddingLeft: "20px",
  },
  footer: {
    marginTop: "30px",
    fontStyle: "italic",
    color: "#3e6b3f",
  },
};

export default Contact;
