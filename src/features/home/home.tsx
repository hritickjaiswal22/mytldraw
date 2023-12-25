function Home() {
  return (
    <article className="min-h-screen bg-[#fffbf0] flex justify-center items-center">
      <main className="px-6 py-8 bg-[#fff0c9] rounded-3xl max-w-[480px] w-11/12 flex flex-col gap-2 justify-center items-center">
        <h2 className="text-xl font-bold">Join via code!</h2>

        <input type="text" className="w-full p-2" />

        <div className="relative flex h-7 items-center justify-center gap-2">
          <div className="w-6 border-t border-yellow-darker border-black"></div>
          <span className="flex-shrink font-primary text-sm text-yellow-darker dark:text-[#B9B9C6]">
            or
          </span>
          <div className="w-6 border-t border-yellow-darker border-black"></div>
        </div>

        <button
          type="button"
          className="px-2 py-3 bg-white active:scale-[.98] flex justify-center items-center border-2 border-black  rounded-lg cursor-pointer"
        >
          New room
        </button>
      </main>
    </article>
  );
}

export default Home;
