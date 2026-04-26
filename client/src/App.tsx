function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Klemps
        </p>

        <h1 className="mb-4 text-5xl font-bold">
          Irish Poker Card Game
        </h1>

        <p className="max-w-xl text-lg text-slate-300">
          A local browser-based party card game. Choose players, select difficulty,
          guess cards, and give or take drinks.
        </p>

        <button className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          Start Game
        </button>
      </section>
    </main>
  );
}

export default App;