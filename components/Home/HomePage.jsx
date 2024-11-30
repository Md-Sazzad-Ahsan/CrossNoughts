"use client";
import Image from "next/image";
import React, { useState } from "react";
import CreateRoom from "@/components/Modals/CreateRoom";
import JoinRoom from "@/components/Modals/JoinRoom";
import PlayRoom from "@/components/Modals/PlayRoom";

export default function HomePage() {
  const [modalType, setModalType] = useState(null); // Use null to indicate no modal is open

  const openModal = (type) => setModalType(type); // type: 'create' or 'join'
  const closeModal = () => setModalType(null);

  return (
    <div className="max-w-3xl mx-auto my-20 px-5">
      <section className="px-5 border border-gray-300 rounded-md">
        <h1 className="text-5xl text-center py-10 font-bold">CrossNoughts</h1>
        <div className="px-5 md:px-10">
          <Image
            src="/images/CrossNoughts.jpg"
            alt="CrossNoughts Image"
            height={500}
            width={500}
            className="object-cover mx-auto"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm md:text-md text-gray-100 mx-5 md:mx-20 mb-10">
          <button
            onClick={() => openModal("create")}
            className="col-span-1 bg-gray-800 hover:bg-gray-600 py-2 md:py-3"
          >
            Create Room
          </button>
          <button
            onClick={() => openModal("join")}
            className="col-span-1 bg-gray-800 hover:bg-gray-600 py-2 md:py-3"
          >
            Join a Room
          </button>
          <button
            onClick={() => openModal("play")}
            className="col-span-2 bg-gray-800 hover:bg-gray-600 py-2 md:py-3"
          >
            Play with Computer
          </button>
        </div>
      </section>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 max-w-lg w-full relative mx-5">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              &#10005; {/* Close icon */}
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
