"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
}

export  function ConfirmDeleteModal({ open, onClose, onConfirm, isLoading, title }: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={open}
      onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>{title}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={onConfirm} isLoading={isLoading}>
              Confirm
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
