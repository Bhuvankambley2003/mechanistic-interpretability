import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What Does a 49-Parameter Neural Network Actually Learn? | Mechanistic Interpretability",
  description:
    "A ground-up mechanistic interpretability study of a tiny neural network trained on y = x² + 0.01. Every weight, bias, and gradient tracked across 8,000 epochs — built from scratch in NumPy with no autograd.",
  keywords: [
    "mechanistic interpretability",
    "neural network",
    "deep learning",
    "backpropagation",
    "gradient descent",
    "ReLU",
    "NumPy",
    "AI safety",
    "weight analysis",
    "bias drift",
    "equifinality",
    "interactive machine learning",
    "Bhuvan Kambley",
  ],
  authors: [{ name: "Bhuvan Kambley", url: "https://bhu1.vercel.app" }],
  creator: "Bhuvan Kambley",
  metadataBase: new URL("https://bhu1.vercel.app"),
  openGraph: {
    type: "article",
    title: "What Does a 49-Parameter Neural Network Actually Learn?",
    description:
      "An interactive mechanistic interpretability study. Every weight, bias, and gradient tracked across 8,000 epochs — built from scratch in NumPy.",
    url: "https://bhu1.vercel.app",
    siteName: "Mechanistic Interpretability · Bhuvan Kambley",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Does a 49-Parameter Neural Network Actually Learn?",
    description:
      "An interactive mechanistic interpretability study — every weight, bias, and gradient tracked across 8,000 epochs. Built from scratch in NumPy.",
    creator: "@bhuvankambley",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
