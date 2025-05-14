"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  currentModalId: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [currentModalId, setCurrentModalId] = useState<string | null>(null);
  const openModal = (id: string) => setCurrentModalId(id);
  const closeModal = () => setCurrentModalId(null);

  return (
    <ModalContext.Provider value={{ currentModalId, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
