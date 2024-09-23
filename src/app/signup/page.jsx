import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

const signup = () => {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col
          xs={12}
          md={5}
          className="d-flex justify-content-md-end mb-3 mb-md-0"
        >
          <Link href="/signup/user" passHref>
            <Button variant="primary" className="py-2 px-4">
              Sign up as user
            </Button>
          </Link>
        </Col>
        <Col xs={12} md={5} className="d-flex justify-content-md-start">
          <Link href="/signup/business" passHref>
            <Button variant="primary" className="py-2 px-4">
              Sign up as business
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default signup;
