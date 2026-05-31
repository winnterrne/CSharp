export default function PlayerBar() {
  return (
    <div className="h-[90px] bg-black border-t border-[#2a2a2a] flex items-center justify-between px-6">
      {" "}
      <div className="flex items-center gap-4">
        {" "}
        <div className="w-[60px] h-[60px] bg-gray-700 rounded-lg"></div>{" "}
        <div>
          {" "}
          <h3 className="font-semibold"> Blinding Lights </h3>{" "}
          <p className="text-sm text-gray-400"> The Weeknd </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex flex-col items-center gap-2">
        {" "}
        <div className="flex items-center gap-5">
          {" "}
          <button className="text-xl">⏮</button>{" "}
          <button className="text-3xl">▶</button>{" "}
          <button className="text-xl">⏭</button>{" "}
        </div>{" "}
        <input type="range" className="w-[300px]" />{" "}
      </div>{" "}
      <div className="w-[180px] flex items-center gap-3">
        {" "}
        <span>🔊</span> <input type="range" className="w-full" />{" "}
      </div>{" "}
    </div>
  );
}
