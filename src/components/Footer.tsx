export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-slate-800 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-2 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Xceed. All rights reserved.
      </div>
    </footer>
  );
}
