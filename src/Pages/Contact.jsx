import Navbar from '../Components/Navbar.jsx';

export default function Contact() {
  return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <section className="rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur
            shadow-xl shadow-amber-900/5 dark:bg-slate-900/60 dark:border-slate-700 p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-amber-900 dark:text-amber-300">Contact</h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            Call us at <span className="font-semibold">+91 9585983635</span> or visit our showroom in Kancheepuram.
          </p>
        </section>
      </main>
  );
}