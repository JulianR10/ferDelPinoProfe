import { Barlow_Condensed } from 'next/font/google';
import './globals.css';

const font = Barlow_Condensed({ weight: ['600', '800'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Fernando Del Pino · Profe de tenis · Laguna Larga',
  description: 'Soy Fernando, profe de tenis. Doy clases para todas las edades en la cancha de Sportivo, Laguna Larga. Martes y jueves, mañana, tarde y noche.',
  openGraph: {
    title: 'Fernando Del Pino · Profe de tenis · Laguna Larga',
    description: 'Doy clases de tenis a todas las edades. Martes y jueves, mañana, tarde y noche.',
    locale: 'es_AR',
    type: 'website',
  },
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={font.className}>{children}</body>
    </html>
  );
}
