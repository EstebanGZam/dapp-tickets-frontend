// src/app/tickets/[contract].tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Ticket from '@/components/Ticket';
import { getTicketContract } from '@/lib/contracts';

export default function TicketPage() {
  const { contract } = useParams<{ contract: string }>();
  const [ticketData, setTicketData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const contractAddress = contract as string;
        const ticketContract = getTicketContract(contractAddress);

        const owner = await ticketContract.ownerOf(1); // 🟢 ID 1 por defecto
        const eventName = await ticketContract.name(); // Nombre del NFT
        const eventDate = "15 Diciembre 2024"; // Puedes cambiar esto si lo quieres dinámico
        const eventVenue = "Estadio Nacional"; // Puedes cambiar esto también
        const qrData = `ticket:${owner}:1`;

        setTicketData({
          ticketId: "1",
          eventTitle: eventName,
          eventDate,
          eventVenue,
          nftId: "NFT-001",
          owner,
          isValid: true,
          qrCodeData: qrData,
          contractAddress,
        });
      } catch (err) {
        console.error("Error loading ticket:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (contract) {
      fetchTicketData();
    }
  }, [contract]);

  if (isLoading) return <p className="text-white text-center mt-8">Cargando ticket...</p>;
  if (!ticketData) return <p className="text-white text-center mt-8">No se pudo cargar el ticket.</p>;

  return <Ticket {...ticketData} />;
}
