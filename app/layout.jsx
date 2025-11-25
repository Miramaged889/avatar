import "./globals.css";

export const metadata = {
  title: "Admin Dashboard",
  description:
    "Production-ready Next.js 14 admin dashboard with bilingual support",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
