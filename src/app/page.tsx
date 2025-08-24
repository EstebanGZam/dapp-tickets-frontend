// src/app/page.tsx
import Link from "next/link";
import {
  getEventManagerReadContract,
  getTicketContract,
} from "@/lib/contracts";
import { Contract } from "ethers";
import EventList from "@/components/EventList"; // We'll create this new component

// Define a type for our event data for better type-safety.
export type EventData = {
  address: string;
  name: string;
  ticketsMinted: number;
  maxSupply: number;
  // --- Mock Data ---
  // These fields are not on the smart contract, but are added to match the UI design.
  date: string;
  location: string;
  price: string;
  image: string;
};

/**
 * Fetches the details for a single event contract.
 * @param address The address of the EventTicket contract.
 * @returns An object with the event's details.
 */
async function getEventDetails(address: string): Promise<EventData> {
  try {
    const contract: Contract = getTicketContract(address);

    // Fetch contract data in parallel for better performance.
    const [name, maxSupply, nextTokenId] = await Promise.all([
      contract.name(),
      contract.maxSupply(),
      contract.nextTokenId(),
    ]);

    // NOTE: The date, location, price, and image are mock data to match the design.
    // The current EventTicket contract does not store this information.
    return {
      address: address,
      name: name,
      ticketsMinted: Number(nextTokenId) - 1,
      maxSupply: Number(maxSupply),
      date: "15 Diciembre 2024 - 8:00 PM", // Placeholder
      location: "Estadio Nacional, Bogotá", // Placeholder
      price: "Free + Gas", // The contract has a free mint function.
      image: "🎸", // Placeholder icon
    };
  } catch (error) {
    console.error(`Error fetching details for event at ${address}:`, error);
    return {
      address: address,
      name: "Evento Desconocido",
      ticketsMinted: 0,
      maxSupply: 0,
      date: "Fecha no disponible",
      location: "Lugar no disponible",
      price: "N/A",
      image: "❓",
    };
  }
}

// This is a React Server Component, which is ideal for fetching data on the server.
export default async function HomePage() {
  let events: EventData[] = [];

  try {
    const eventManager = getEventManagerReadContract();
    const eventAddresses: string[] = await eventManager.getAllEvents();
    events = await Promise.all(
      eventAddresses.map((address) => getEventDetails(address))
    );
  } catch (error) {
    console.error("Could not fetch events from the blockchain:", error);
    // The page will render a friendly error message if the contract call fails.
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventList initialEvents={events} />
      </div>
    </main>
  );
}
