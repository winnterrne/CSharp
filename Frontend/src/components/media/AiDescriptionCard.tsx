// src/components/AiDescriptionCard.tsx
import React from "react";

interface Props {
  status: "idle" | "loading" | "success" | "error";
  description: string | null;
  errorMessage: string | null;
  onFetch: () => void;
  onClose: () => void;
}

export default function AiDescriptionCard({
  status,
  description,
  errorMessage,
  onFetch,
  onClose,
}: Props) {
  // Chưa bấm gì → show nút gọi AI
  if (status === "idle") {
    return (
      <button
        onClick={onFetch}
        className="ai-desc-trigger"
        title="Tóm tắt bài hát bằng AI"
      >
        ✨ Tóm tắt bằng AI
      </button>
    );
  }

  return (
    <div className="ai-desc-card">
      <div className="ai-desc-card__header">
        <span>✨ Mô tả AI</span>
        <button onClick={onClose} className="ai-desc-card__close">✕</button>
      </div>

      {status === "loading" && (
        <div className="ai-desc-card__skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" style={{ width: "85%" }} />
          <div className="skeleton-line" style={{ width: "70%" }} />
        </div>
      )}

      {status === "success" && description && (
        <p className="ai-desc-card__text">{description}</p>
      )}

      {status === "error" && (
        <div className="ai-desc-card__error">
          <span>{errorMessage}</span>
          <button onClick={onFetch}>Thử lại</button>
        </div>
      )}
    </div>
  );
}