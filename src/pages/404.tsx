import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>404</h1>
      <p style={{ marginTop: 8 }}>Halaman tidak ditemukan.</p>
      <Link href="/">Kembali ke beranda</Link>
    </div>
  );
}
