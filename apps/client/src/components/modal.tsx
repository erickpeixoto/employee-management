"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  isLoading: boolean;
}

export default function ModalComponent({ open, onClose, title, children, onSave, isLoading }: ModalComponentProps) {
  return (
    <Modal
      isOpen={open}
      onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody>
            {children}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onSave} isLoading={isLoading}>
              Save
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
