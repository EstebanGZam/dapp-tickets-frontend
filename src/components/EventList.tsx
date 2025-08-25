// src/components/EventList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getEventManagerReadContract, getSigner } from "@/lib/contracts";
import { EventData } from "@/app/page";

type EventListProps = {
  initialEvents: EventData[];
};

export default function EventList({ initialEvents }: EventListProps) {
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);

  // Revisa el estado de la billetera y la whitelist
  const checkWalletStatus = async () => {
    setIsLoadingWallet(true);
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const eventManager = getEventManagerReadContract();
      const whitelisted = await eventManager.isWhitelisted(address);
      setIsWhitelisted(whitelisted);
    } catch (error) {
      console.log("Billetera no conectada o el usuario rechazó la conexión.");
      setIsWhitelisted(false);
      setWalletAddress(null);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  // Efecto para revisar la billetera al cargar la página
  useEffect(() => {
    const checkAccounts = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts && accounts.length > 0) {
          checkWalletStatus();
        } else {
          setIsLoadingWallet(false);
        }
      } else {
        setIsLoadingWallet(false);
      }
    };
    checkAccounts();
  }, []);

  // Renderiza los botones de acción basados en el estado de la billetera
  const renderActionButtons = () => {
    if (isLoadingWallet) {
      return (
        <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
      );
    }

    if (!walletAddress) {
      return (
        <button
          onClick={checkWalletStatus}
          className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 shadow-sm"
        >
          Conectar Billetera
        </button>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Botón Mis Boletos (siempre visible si la billetera está conectada) */}
        <Link href="/my-tickets">
          <span className="inline-block bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-purple-50 transition-colors border border-purple-200 shadow-sm">
            Mis Boletos
          </span>
        </Link>

        {/* Botones para usuarios en la whitelist */}
        {isWhitelisted && (
          <>
            {/* Botón para Escanear QR */}
            <Link href="/scan">
              <span className="inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-md">
                Escanear QR
              </span>
            </Link>

            {/* Botón Crear Evento */}
            <Link href="/create-event">
              <span className="inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                Crear Evento
              </span>
            </Link>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Eventos Disponibles
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Explora los próximos eventos y asegura tu boleto como un NFT único.
          </p>
        </div>

        <div className="mt-6 sm:mt-0">{renderActionButtons()}</div>
      </header>

      {/* (El resto del código de la lista de eventos permanece igual) */}
      {initialEvents.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-xl shadow-sm">
          <span className="text-5xl mb-4 inline-block">🎟️</span>
          <h2 className="text-2xl font-semibold text-gray-700">
            No hay eventos por ahora
          </h2>
          <p className="mt-2 text-gray-500">
            Por favor, vuelve a consultar más tarde.{" "}
            {isWhitelisted && "O crea un nuevo evento."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {initialEvents.map((event) => (
            <Link
              href={`/events/${event.address}`}
              key={event.address}
              className="group block"
            >
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 h-40 flex items-center justify-center">
                  <span className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                    {event.image}
                  </span>
                </div>

                <div className="p-5">
                  <h2
                    className="text-xl font-bold text-gray-900 truncate"
                    title={event.name}
                  >
                    {event.name}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-gray-600">
                    <p className="flex items-center gap-3">
                      <span className="text-purple-600">📅</span> {event.date}
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-purple-600">📍</span>{" "}
                      {event.location}
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-purple-600">🎟️</span>
                      {event.maxSupply - event.ticketsMinted} /{" "}
                      {event.maxSupply} disponibles
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-lg font-bold text-indigo-600">
                      {event.price}
                    </p>
                    <span className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm group-hover:bg-indigo-700 transition-colors">
                      Ver Detalles
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
