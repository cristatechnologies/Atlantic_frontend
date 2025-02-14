"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "@/store/auth-reducer";


const DeleteAccount = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;
console.log(token)
    if (!token) {
     
        router.push("/");
        toast.error("Please Login ");
      } else {
        setShowModal(true);
      }
    
  }, [router]);

  const handleDelete = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;

    if (token) {
      axios
        .delete(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/remove-account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("Account deleted successfully");
          localStorage.removeItem("auth");
          localStorage.setItem("redirectedFromDelete", "true");
          router.refresh()
       

            router.push("/login");

         
          


        
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to delete account");
        });
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered // This property centers the modal vertically and horizontally
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false) }>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{height:"100vh"}}>

      </div>
    </>
  );
};

export default DeleteAccount;
