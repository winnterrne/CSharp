export default function Header() {
  return (
    <header
      className="
        h-[72px]
        bg-black
        flex
        items-center
        justify-between
        px-8
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
            w-12
            h-12
            rounded-full
            bg-[#1f1f1f]
            flex
            items-center
            justify-center
            text-2xl
          "
        >
          🏠
        </div>

        <input
          type="text"
          placeholder="Bạn muốn phát nội dung gì?"
          className="
            w-[450px]
            bg-[#1f1f1f]
            rounded-full
            px-6
            py-4
            outline-none
            text-white
          "
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-300 hover:text-white">Premium</button>

        <button className="text-gray-300 hover:text-white">Support</button>

        <button
          className="
            bg-white
            text-black
            px-6
            py-3
            rounded-full
            font-bold
          "
        >
          Login
        </button>
      </div>
    </header>
  );
}
