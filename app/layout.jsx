import "./globals.css";
import StoreProvider from "../lib/StoreProvider";

export const metadata = {
  title: "Admin Dashboard",
  description:
    "Production-ready Next.js 14 admin dashboard with bilingual support",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
