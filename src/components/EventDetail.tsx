// src/components/EventDetail.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getSigner,
  getTicketContract,
  getTicketContractWithSigner,
} from "@/lib/contracts";

type EventInfo = {
  name: string;
  symbol: string;
  maxSupply: number;
  ticketsMinted: number;
};

export default function EventDetail({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setError("");
        const contract = getTicketContract(contractAddress);

        const [name, symbol, maxSupply, nextTokenId] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.maxSupply(),
          contract.nextTokenId(),
        ]);

        setEventInfo({
          name,
          symbol,
          maxSupply: Number(maxSupply),
          ticketsMinted: Number(nextTokenId) - 1,
        });
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError(
          "No se pudo cargar la información del evento. Verifica la dirección del contrato."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [contractAddress]);

  const handleMint = async () => {
    try {
      setError("");
      setSuccessMessage("");
      setIsMinting(true);

      const signer = await getSigner();
      const contract = getTicketContractWithSigner(contractAddress, signer);

      const tx = await contract.mintTicket();
      await tx.wait();

      setSuccessMessage(`¡Boleto acuñado con éxito! Hash: ${tx.hash}`);
      const nextTokenId = await contract.nextTokenId();
      setEventInfo((prev) =>
        prev ? { ...prev, ticketsMinted: Number(nextTokenId) - 1 } : null
      );
    } catch (err: any) {
      console.error("Error minting ticket:", err);
      setError(
        err.reason || err.message || "Ocurrió un error al acuñar el boleto."
      );
    } finally {
      setIsMinting(false);
    }
  };

  // Componente de UI para el estado de carga
  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="bg-gray-200 aspect-video rounded-xl"></div>
            <div className="mt-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-12 bg-gray-300 rounded-lg w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-purple-600 hover:underline"
        >
          Volver a la lista de eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Botón para volver */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
        >
          <svg
            className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Volver a Eventos
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div className="md:flex md:space-x-8">
          {/* Columna Izquierda: Imagen y Título */}
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 aspect-video rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-white text-6xl">🎟️</span>
            </div>
            <div className="mt-6">
              <h1 className="text-4xl font-bold text-gray-900">
                {eventInfo?.name}
              </h1>
              <p className="text-gray-500 mt-2">
                Símbolo del Ticket: <strong>{eventInfo?.symbol}</strong>
              </p>
            </div>
          </div>

          {/* Columna Derecha: Panel de Compra */}
          <div className="md:w-1/2">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-5 text-gray-800">
                  Comprar Ticket NFT
                </h2>
                <div className="space-y-4 mb-6 text-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Disponibles:</span>
                    <span className="font-medium text-gray-900">
                      {eventInfo
                        ? eventInfo.maxSupply - eventInfo.ticketsMinted
                        : "..."}{" "}
                      / {eventInfo?.maxSupply}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Precio:</span>
                    <span className="font-medium text-indigo-600">
                      Gratis + Gas
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={handleMint}
                  disabled={
                    isMinting ||
                    !!(
                      eventInfo &&
                      eventInfo.ticketsMinted >= eventInfo.maxSupply
                    )
                  }
                  className="w-full bg-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-700 transition-transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
                >
                  {isMinting ? "Procesando..." : "Obtener mi Boleto"}
                </button>

                {successMessage && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm break-words">
                    {successMessage}
                  </div>
                )}
                {error && !successMessage && (
                  <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm break-words">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
