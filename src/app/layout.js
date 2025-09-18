import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Sistema de Mapeo de Embarazadas",
  description: "Proyecto de gestión de embarazadas con Next.js + Node.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
