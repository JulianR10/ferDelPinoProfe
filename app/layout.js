import { Barlow_Condensed } from 'next/font/google';
import './globals.css';

const display = Barlow_Condensed({ weight: '800', style: 'italic', subsets: ['latin'], display: 'swap' }); // títulos y botones
const text = Barlow_Condensed({ weight: '600', style: 'normal', subsets: ['latin'], display: 'swap', variable: '--font-text' }); // notas en minúscula

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
      <body className={`${display.className} ${text.variable}`}>{children}</body>
    </html>
  );
}
