'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import API from '@/utils/axios';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Card, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6 && /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      toast.warn('Please enter a valid email address');
      return;
    }

    if (!validatePassword(form.password)) {
      toast.warn('Password must be at least 6 characters and include a number');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      toast.success(res.data.message);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="p-4 shadow-lg" style={{ borderRadius: '12px' }}>
            <Card.Body>
              <h3 className="text-center mb-4 fw-bold">Register</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading && <span className="spinner-border spinner-border-sm me-2" />}
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Form>

              <p className="text-center">
                Already registered?{' '}
                <a href="/login" className="text-decoration-underline text-primary">
                  Login here
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
    </Container>
  );
}
