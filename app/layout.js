import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  manifest: "/manifest.json",
  title: "CrossNoughts",
  description:
    "An advance puzzle game similar of Tic Tac Toe with more feature such as play with friend online and play with computer etc.",
  openGraph: {
    title: "CrossNoughts",
    description:
      "An advance puzzle game similar of Tic Tac Toe with more feature such as play with friend online and play with computer etc.",
    type: "website",
    locale: "en_US",
    url: "https://crossnoughts.vercel.app",
    images: [
      {
        url: "https://crossnoughts.vercel.app/images/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CrossNoughts Open Graph Image",
      },
    ],
    siteName: "CrossNoughts Puzzle Game",
  },
  twitter: {
    title: "CrossNoughts",
    description:
    "An advance puzzle game similar of Tic Tac Toe with more feature such as play with friend online and play with computer etc.",
    card: "summary_large_image",
  },
  metadataBase: new URL("https://crossnoughts.vercel.app"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
