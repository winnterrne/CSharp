export default function RightPanel() {
  return (
    <aside className="w-[320px] bg-[#121212] border-l border-[#2a2a2a] p-5 hidden lg:block">
      {" "}
      <h2 className="text-2xl font-bold mb-5"> Now Playing </h2>{" "}
      <div className="bg-[#181818] rounded-2xl p-4">
        {" "}
        <div className="w-full h-[260px] rounded-xl bg-gray-700 mb-5"></div>{" "}
        <h3 className="text-xl font-bold"> Blinding Lights </h3>{" "}
        <p className="text-gray-400 mt-2"> The Weeknd </p>{" "}
        <div className="mt-6 flex gap-3">
          {" "}
          <button className="bg-green-500 text-black px-5 py-2 rounded-full font-semibold hover:scale-105 transition">
            {" "}
            Play{" "}
          </button>{" "}
          <button className="bg-[#282828] px-5 py-2 rounded-full hover:bg-[#3a3a3a] transition">
            {" "}
            Share{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </aside>
  );
}
