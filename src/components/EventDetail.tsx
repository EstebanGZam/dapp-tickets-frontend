'use client';

import { useEffect, useState } from 'react';
import { getSigner, getTicketContract, getTicketContractWithSigner } from '@/lib/contracts';

type EventInfo = {
  name: string;
  symbol: string;
  maxSupply: number;
  ticketsMinted: number;
};

export default function EventDetail({ contractAddress }: { contractAddress: string }) {
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setError('');
        const contract = getTicketContract(contractAddress);
        
        const [name, symbol, maxSupply, nextTokenId] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.maxSupply(),
          contract.nextTokenId()
        ]);

        setEventInfo({
          name,
          symbol,
          maxSupply: Number(maxSupply),
          ticketsMinted: Number(nextTokenId) - 1,
        });

      } catch (err) {
        console.error("Error fetching event data:", err);
        setError("No se pudo cargar la información del evento. Verifica la dirección del contrato.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [contractAddress]);

  const handleMint = async () => {
    try {
      setError('');
      setSuccessMessage('');
      setIsMinting(true);

      const signer = await getSigner();
      const contract = getTicketContractWithSigner(contractAddress, signer);

      const tx = await contract.mintTicket();
      await tx.wait();

      setSuccessMessage(`¡Boleto acuñado con éxito! Hash: ${tx.hash}`);
      const nextTokenId = await contract.nextTokenId();
      setEventInfo(prev => prev ? { ...prev, ticketsMinted: Number(nextTokenId) - 1 } : null);

    } catch (err: any) {
      console.error("Error minting ticket:", err);
      setError(err.reason || err.message || "Ocurrió un error al acuñar el boleto.");
    } finally {
      setIsMinting(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Cargando evento...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 aspect-video rounded-xl flex items-center justify-center">
              <span className="text-white text-4xl">🎟️</span>
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900">{eventInfo?.name}</h1>
              <p className="text-gray-500 mt-1">Símbolo del Ticket: {eventInfo?.symbol}</p>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Comprar Ticket NFT</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponibles:</span>
                  <span className="font-medium text-gray-900">
                    {eventInfo ? (eventInfo.maxSupply - eventInfo.ticketsMinted) : '...'} / {eventInfo?.maxSupply}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-medium text-gray-900">Gratis (solo pagas el gas)</span>
                </div>
              </div>
              
              <button
                onClick={handleMint}
                disabled={isMinting || !!(eventInfo && eventInfo.ticketsMinted >= eventInfo.maxSupply)}
                className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
              >
                {isMinting ? 'Procesando...' : 'Obtener mi Boleto'}
              </button>

              {successMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm break-words">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm break-words">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}