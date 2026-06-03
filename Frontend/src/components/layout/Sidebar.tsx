const menus = [
  "🏠 Home",
  "🔍 Search",
];

export default function Sidebar() {
  return (
    <aside
      className="
        w-[320px]
        bg-[#121212]
        rounded-2xl
        p-4
        hidden
        lg:flex
        flex-col
        gap-4
      "
    >
      <div className="bg-black rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-8">
          TuneVault
        </h1>

        <div className="flex flex-col gap-4">
          {menus.map((item) => (
            <button
              key={item}
              className="
                text-left
                text-gray-300
                hover:text-white
                font-semibold
                transition
              "
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1b1b1b] rounded-2xl p-5">
        <h2 className="font-bold text-lg">
          Create your first playlist
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          It's easy, we'll help you.
        </p>

        <button
          className="
            mt-5
            bg-white
            text-black
            px-5
            py-3
            rounded-full
            font-semibold
            hover:scale-105
            transition
          "
        >
          Create playlist
        </button>
      </div>
    </aside>
  );
}