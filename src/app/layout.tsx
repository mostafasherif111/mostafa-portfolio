import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Mostafa Sherif Mohamed | Graphic Designer & Founder of Vision X",
  description:
    "Award-level portfolio of Mostafa Sherif Fahmy — Graphic Designer, Brand Strategist, and Founder of Vision X. Expert in Visual Identity, Social Media Design, Branding, and Creative Leadership.",
  verification: {
    google: "ERoLF49TbWJ5bVDD_EtnLmUWNoVlXidAu60H46KLADg",
  },
  keywords: [
    "Graphic Designer Egypt",
    "Brand Identity Designer",
    "Visual Identity",
    "Social Media Design",
    "Vision X",
    "Mostafa Sherif",
    "Thumbnail Design",
    "Print Design",
    "Adobe Photoshop",
    "Adobe Illustrator",
  ],
  openGraph: {
    title: "Mostafa Sherif Fahmy | Graphic Designer & Founder of Vision X",
    description:
      "Agency-level creative portfolio. Branding, Social Media, Posters, Thumbnails, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className="antialiased font-sans"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
