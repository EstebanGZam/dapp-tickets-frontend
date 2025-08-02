import Ticket from '@/components/Ticket';

export default function Home() {
  return (
    <Ticket
      ticketId="1024"
      eventTitle="Festival Rock 2024"
      eventDate="15 Diciembre 2024 - Estadio Nacional"
      eventVenue="Estadio Nacional"
      nftId="NFT-001"
      owner="0x1234...5678"
      isValid={true}
    />
  );
}