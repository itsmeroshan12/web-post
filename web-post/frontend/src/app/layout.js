import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'; 

export const metadata = {
  title: 'Web Post Builder',
  description: 'Multi-client site editor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Navbar - client side */}
        <Navbar />

        {/* Main content */}
        <div className="container mb-2">{children}</div>
      </body>
    </html>
  );
}
