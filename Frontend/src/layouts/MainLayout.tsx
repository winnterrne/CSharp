import Header from "../components/layout/Header";
import LeftPanel from "../components/layout/LeftPanel";
import RightPanel from "../components/layout/RightPanel";
import PlayerBar from "../components/layout/PlayerBar";
import type { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
         background: "linear-gradient(180deg, #121212 100%, #121212 100%)",
        overflow: "hidden",
        fontFamily: "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <Header />
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          gap: "8px",
          padding: "0 8px",
        }}
      >
        <div style={{ borderRadius: "8px", overflow: "hidden", background: "#121212", flexShrink: 0, display: "flex", flexDirection: "column", height: "100%" }}>
          <LeftPanel />
        </div>

        {/* ← children thay cho MainContent hardcode */}
        <div style={{  borderRadius: "8px", overflow: "hidden", background: "#121212", minWidth: 0, height: "100%" , display:"flex" }}>
          {children}
        </div>

        <div style={{ borderRadius: "8px", overflow: "hidden", background: "#121212", flexShrink: 0, display: "flex", flexDirection: "column", height: "100%" }}>
          <RightPanel />
        </div>
      </div>

      <PlayerBar />
    </div>
  );
};

export default MainLayout;