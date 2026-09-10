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
    <html lang="es"><body>{children}</body></html>
  );
}
