"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaRegWindowClose } from "react-icons/fa";
import CreateRoom from "@/components/Modals/CreateRoom";
import JoinRoom from "@/components/Modals/JoinRoom";
import PlayRoom from "@/components/Modals/PlayRoom";

export default function HomePage() {
  const [modalType, setModalType] = useState(null); // Use null to indicate no modal is open

  const openModal = (type) => setModalType(type); // type: 'create' or 'join'
  const closeModal = () => setModalType(null);

  return (
    <div className="max-w-3xl mx-auto mt-32 mb-12 md:my-20 sm:px-5">
      <section className="px-5 md:border border-gray-200 rounded-md md:shadow-sm">
        <h1 className="text-5xl md:text-6xl text-center sm:py-10 md:pt-10 font-bold text-gray-800">CrossNoughts</h1>
        <div className="md:px-10">
          <Image
            src="/images/CrossNoughts.jpg"
            alt="CrossNoughts Image"
            height={1200}
            width={1200}
            className="object-cover mx-auto"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-3 text-sm md:text-md lg:text-lg text-gray-100 mx-2 md:mx-12 mb-10 mt-10 md:mt-0">
          <button
            onClick={() => openModal("create")}
            className="col-span-1 bg-gray-800 hover:bg-gray-600 py-3 rounded-md"
          >
            Create Room
          </button>
          <button
            onClick={() => openModal("join")}
            className="col-span-1 bg-gray-800 hover:bg-gray-600 py-3 rounded-md"
          >
            Join a Room
          </button>
          <button
            onClick={() => openModal("play")}
            className="col-span-2 bg-gray-800 hover:bg-gray-600 py-3 rounded-md"
          >
            Play with Computer
          </button>
        </div>
      </section>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 max-w-lg w-full relative mx-3">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-3xl text-gray-700 hover:text-gray-600"
            >
            <FaRegWindowClose />
            </button>
            {modalType === "create" && <CreateRoom />}
            {modalType === "join" && <JoinRoom />}
            {modalType === "play" && <PlayRoom />}
          </div>
        </div>
      )}
    </div>
  );
}
