import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "@/store/auth-reducer";
// DeleteAccountModal.js


const DeleteAccountModal = ({ showModal, setShowModal, onDelete }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Account Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete your account? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Custom hook for delete account functionality
export const useDeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDeleteAccount = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;

    if (!token) {
      router.push("/");
      toast.error("Please Login");
      return;
    }

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
        setShowModal(false); // Close modal after successful deletion
        router.refresh();
        router.push("/login");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete account");
      });
  };

  return {
    showModal,
    setShowModal,
    handleDeleteAccount,
  };
};

export default DeleteAccountModal;