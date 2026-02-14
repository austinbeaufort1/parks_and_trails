import { useState } from "react";
import { updates } from "../devlog/updates";

const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UpdatesPage() {
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleUpdates = updates.slice(0, visibleCount);
  const hasMore = visibleCount < updates.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f9f6",
        padding: "60px 20px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 36,
            marginBottom: 8,
            color: "#1f3d2b",
          }}
        >
          TrailDepth Updates
        </h1>

        <p
          style={{
            color: "#5a6b60",
            marginBottom: 40,
          }}
        >
          Ongoing improvements, new trails, and feature updates.
        </p>

        {visibleUpdates.map((update, index) => (
          <div
            key={index}
            style={{
              background: "white",
              border: "1px solid #e3e8e1",
              borderRadius: 12,
              padding: 24,
              marginBottom: 28,
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <h2
              style={{
                marginBottom: 8,
                color: "#3a6b4f",
              }}
            >
              {formatDate(update.date)}
            </h2>

            {update.title && (
              <p
                style={{
                  fontWeight: 600,
                  marginBottom: 16,
                  color: "#1f3d2b",
                }}
              >
                {update.title}
              </p>
            )}

            <ul style={{ paddingLeft: 20, color: "#2f3a33" }}>
              {update.items.map((item, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {hasMore && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: "#3a6b4f",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
