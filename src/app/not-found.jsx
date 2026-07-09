import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Home } from "lucide-react";

export const metadata = {
  title: "Page Not Found | Gourav Takk",
  description: "The requested page could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b0f] px-4 py-16 text-[#f8fafc] sm:px-6">
      <span className="absolute left-[8%] top-[12%] size-48 rounded-full bg-orange-500/10 blur-3xl" />
      <span className="absolute bottom-[8%] right-[6%] size-64 rounded-full bg-orange-600/10 blur-3xl" />

      <section className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <Link href="/" className="mb-10 inline-flex items-center gap-3 text-lg font-bold">
          <Image
            src="/gourav-logo.png"
            alt="Gourav Takk logo"
            width={44}
            height={44}
            priority
            className="size-11 rounded-xl object-cover"
          />
          <span>Gourav <span className="text-orange-500">Takk</span></span>
        </Link>

        <div className="relative mx-auto mb-8 flex h-52 max-w-lg items-center justify-center rounded-[2rem] border border-orange-500/25 bg-[#0d131a] shadow-2xl shadow-orange-950/20 sm:h-64">
          <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          <span className="select-none text-[8rem] font-black leading-none tracking-[-0.09em] text-orange-500 sm:text-[11rem]">
            404
          </span>
          <span className="absolute -bottom-3 rounded-full border border-[#29313b] bg-[#070b0f] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Route not found
          </span>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
          Lost in the code?
        </p>
        <h1 className="text-3xl font-bold sm:text-5xl">This page doesn&apos;t exist.</h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
          The link may be broken or the page may have moved. Let&apos;s get you back to the portfolio.
        </p>

        <nav className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-orange-600"
          >
            <Home className="size-4" /> Back to Home
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#29313b] bg-[#0d131a] px-6 py-3 font-semibold transition-all hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-500"
          >
            View Projects <ExternalLink className="size-4" />
          </Link>
        </nav>

        <Link href="/#contact" className="mt-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-orange-500">
          <ArrowLeft className="size-4" /> Report a broken link
        </Link>
      </section>
    </main>
  );
}
