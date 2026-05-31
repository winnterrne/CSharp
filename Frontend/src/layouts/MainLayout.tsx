import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PlayerBar from "../components/layout/PlayerBar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({
  children,
}: Props) {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        <Sidebar />

        <main
          className="
            flex-1
            overflow-y-auto
            rounded-2xl
            bg-gradient-to-b
            from-[#1f1f1f]
            to-[#121212]
            p-8
          "
        >
          {children}
        </main>
      </div>

      <PlayerBar />
    </div>
  );
}