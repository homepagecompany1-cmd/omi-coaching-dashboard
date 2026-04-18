export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-brand-navy/10 bg-brand-navy/5">
      <div className="container flex flex-col items-center justify-between gap-2 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} OMIコーチング — あなた専用の自己実現パートナー</p>
        <p className="text-brand-navy/60">月額 8,400円（税込）</p>
      </div>
    </footer>
  );
}
