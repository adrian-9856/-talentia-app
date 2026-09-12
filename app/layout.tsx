import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "./studio.css";

export const metadata: Metadata = {
  title: "TALENTIA · Unidad de Inserción Laboral",
  description: "Recorridos de participantes y una bandeja compartida para convertir respuestas en acompañamiento laboral explicable.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap"/></head><body>{children}</body></html>
  );
}
