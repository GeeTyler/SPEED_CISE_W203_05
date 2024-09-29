
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Navbar from "./ui/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 min-h-screen text-white `}>
        <div className="flex flex-col min-h-screen max-w-1280 m-auto">
          <Navbar />
        {children}
        </div>
      </body>
    </html>
  );
}
