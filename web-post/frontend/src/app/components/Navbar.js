'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AppNavbar() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('main-navbar');
      if (window.scrollY > 50) navbar.classList.add('shadow-lg');
      else navbar.classList.remove('shadow-lg');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar
        id="main-navbar"
        expand="lg"
        bg="light"
        variant="light"
        sticky="top"
        className="py-3 transition"
      >
        <Container>
          <Navbar.Brand as={Link} href="/" className="fw-bold fs-4 text-dark">
            Web Post Builder
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto text-center">
              {/* Use passHref and wrap Link inside Nav.Link */}
              <Nav.Link as="div">
                <Link href="/" className="custom-hover d-block py-2">
                  Home
                </Link>
              </Nav.Link>
              <Nav.Link as="div">
                <Link href="/login" className="custom-hover d-block py-2">
                  Login
                </Link>
              </Nav.Link>
              <Nav.Link as="div">
                <Link href="/register" className="custom-hover d-block py-2">
                  Register
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <style jsx>{`
        .custom-hover {
          transition: color 0.3s ease, background-color 0.3s ease;
        }
        .custom-hover:hover {
          color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.1);
          border-radius: 5px;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}
