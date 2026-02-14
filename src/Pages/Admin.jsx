import Navbar from '../Components/Navbar.jsx';

export default function Admin() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
    <section className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur
        shadow-xl shadow-amber-900/5 dark:bg-slate-900/60 dark:border-slate-700 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-amber-900 dark:text-amber-300">Admin Dashboard</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
        Reserved for store administrators. (Add inventory, orders, approvals here later.)
        </p>
    </section>
    </main>
  );
}