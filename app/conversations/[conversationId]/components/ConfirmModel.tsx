"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";
import { DialogTitle } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModelProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModel: React.FC<ConfirmModelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [loading, setLoading] = useState(false);

  const onDelete = useCallback(() => {
    setLoading(true);
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => toast.error("Failed to delete conversation"));
  }, [conversationId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div
          className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full
        bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
        >
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="text-center sm:text-left sm:ml-4 sm:mt-0 mt-3">
          <DialogTitle
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Delete Conversation
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this conversation. This action
              cannot be undone
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={loading} danger onclick={onDelete}>
          Delete
        </Button>
        <Button disabled={loading} secondary onclick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModel;
