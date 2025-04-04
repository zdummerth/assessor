import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
import Navbar from "@/components/ui/navbar";
import { Analytics } from "@vercel/analytics/next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Assessor",
  description: "Website to display property data",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <Navbar />
            <div className="flex-1 w-full flex flex-col gap-2 items-center">
              <div className="flex flex-col gap-20 w-full p-5">{children}</div>
            </div>
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
