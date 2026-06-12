import type { ReactNode } from "react";

const AuthCard = ({ children }: { children: ReactNode }) => {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1a1a2e 0%, #121212 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#181818",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {children}
      </section>
    </main>
  );
};

export default AuthCard;