import React from "react";
import { Button } from "./ui/button";

interface ModalProps {
  open: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<ModalProps> = ({ onCancel, onDelete, open }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 
  ${open ? "visible bg-black/50 opacity-100" : "invisible opacity-0"}`}
    >
      <div
        className="bg-white p-6 sm:p-10 w-[90%] sm:w-[75%] max-w-md rounded-md shadow-lg
               flex flex-col justify-center mx-auto transition-all duration-300 "
      >
        <h1 className="font-medium text-[#324152] text-2xl mb-4">
          Delete comment
        </h1>
        <p className="block mb-4 text-[#67727e]">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={onCancel}
            className="bg-[#67727e] uppercase px-8 py-5 cursor-pointer hover:opacity-80"
          >
            No, Cancel
          </Button>
          <Button
            onClick={onDelete}
            className="bg-[#ed6468] uppercase px-8 py-5 cursor-pointer hover:opacity-80"
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
