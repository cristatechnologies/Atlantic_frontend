import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

const AskOption = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: 'url("/img/atlantic-bg-image.png")', // Replace with your actual image path
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          // backgroundRepeat: "repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <Row className="w-100 justify-content-center">
            <Col
              xs={12}
              md={5}
              className="d-flex justify-content-md-center mb-3 mb-md-0"
            >
              <Link href="/signup/user" passHref>
                <Button variant="primary" className="py-2 px-4">
                  Sign up as user
                </Button>
              </Link>
            </Col>
            <Col xs={12} md={5} className="d-flex justify-content-md-start">
              <Link href="/login?redirectedFrom=add-business" >
                <Button variant="primary" className="py-2 px-4">
               Sign In
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AskOption;
