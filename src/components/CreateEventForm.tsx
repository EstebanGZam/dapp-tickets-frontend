'use client';

import { useState } from 'react';
import { getSigner, getEventManagerContract } from '@/lib/contracts';

export default function CreateEventForm() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventSymbol, setEventSymbol] = useState('');
  const [maxTickets, setMaxTickets] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      await getSigner();
      setWalletConnected(true);
    } catch (err: any) {
      setError(err.message || "Error al conectar la billetera.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTxHash('');
    setIsSubmitting(true);

    try {
      const signer = await getSigner();
      const eventManager = getEventManagerContract(signer);

      const tx = await eventManager.createEvent(
        eventName,
        eventSymbol,
        parseInt(maxTickets, 10)
      );

      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      setTxHash(tx.hash);
      setEventName('');
      setEventSymbol('');
      setMaxTickets('');
    } catch (err: any) {
      console.error("Error creating event:", err);
      setError(err.reason || err.message || "Ocurrió un error al crear el evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!walletConnected) {
    return (
      <div className="text-center">
        <button
          onClick={connectWallet}
          className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Conectar Billetera para Continuar
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Evento
            </label>
            <input
              id="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ej: Festival Rock 2024"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900"
            />
          </div>

          {/* Event Symbol */}
          <div>
            <label htmlFor="eventSymbol" className="block text-sm font-medium text-gray-700 mb-1">
              Símbolo del Ticket (3-5 letras)
            </label>
            <input
              id="eventSymbol"
              type="text"
              value={eventSymbol}
              onChange={(e) => setEventSymbol(e.target.value)}
              placeholder="Ej: FR24"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900"
            />
          </div>

          {/* Max Tickets */}
          <div>
            <label htmlFor="maxTickets" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad Máxima de Boletos
            </label>
            <input
              id="maxTickets"
              type="number"
              value={maxTickets}
              onChange={(e) => setMaxTickets(e.target.value)}
              placeholder="Ej: 500"
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Creando Evento...' : 'Crear Evento'}
          </button>
        </div>
      </form>

      {/* Mensajes de resultado */}
      {txHash && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm break-words">
          <p>¡Éxito! Evento creado.</p>
          <p>Hash de la transacción: {txHash}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm break-words">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}