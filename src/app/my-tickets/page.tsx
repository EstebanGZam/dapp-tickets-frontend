'use client';

import { useState, useEffect, useRef } from 'react';
import { getSigner, getEventManagerReadContract, getTicketContract, getTicketContractWithSigner } from '@/lib/contracts';
import Ticket from '@/components/Ticket';
import { Log } from 'ethers';

interface OwnedTicket {
  contractAddress: string;
  tokenId: string;
  eventName: string;
  owner: string;
}

export default function MyTicketsPage() {
  const [signerAddress, setSignerAddress] = useState<string | null>(null);
  const [ownedTickets, setOwnedTickets] = useState<OwnedTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [transferState, setTransferState] = useState<{ [key: string]: { to: string; isTransferring: boolean; error?: string; success?: string } }>({});
  
  const fetchInitiated = useRef(false);

  useEffect(() => {
    if (fetchInitiated.current) {
        return; 
    }
    fetchInitiated.current = true;

    const fetchOwnedTickets = async () => {
      try {
        const signer = await getSigner();
        const userAddress = await signer.getAddress();
        setSignerAddress(userAddress);

        const eventManager = getEventManagerReadContract();
        const eventAddresses: string[] = await eventManager.getAllEvents();
        
        const ticketsFound: OwnedTicket[] = [];

        for (const address of eventAddresses) {
          const ticketContract = getTicketContract(address);
          const eventName = await ticketContract.name();
          
          const filter = ticketContract.filters.Transfer(null, userAddress);
          const transferEvents = await ticketContract.queryFilter(filter, 0, 'latest');

          for (const event of transferEvents) {
            if (event && 'args' in event && event.args) {
              const tokenId = event.args.tokenId;
              const currentOwner = await ticketContract.ownerOf(tokenId);

              if (currentOwner.toLowerCase() === userAddress.toLowerCase()) {
                ticketsFound.push({
                  contractAddress: address,
                  tokenId: tokenId.toString(),
                  eventName,
                  owner: userAddress,
                });
              }
            }
          }
        }
        
        setOwnedTickets(ticketsFound);
      } catch (err: any) {
        console.error("Error fetching tickets:", err);
        setError("No se pudieron cargar tus boletos. Intenta refrescar la página.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwnedTickets();
  }, []);

  const handleTransfer = async (contractAddress: string, tokenId: string) => {
    const toAddress = transferState[`${contractAddress}-${tokenId}`]?.to;
    if (!toAddress || !signerAddress) {
        setTransferState(prev => ({ ...prev, [`${contractAddress}-${tokenId}`]: { ...prev[`${contractAddress}-${tokenId}`], error: 'Por favor, introduce una dirección válida.' } }));
        return;
    }
    setTransferState(prev => ({ ...prev, [`${contractAddress}-${tokenId}`]: { to: toAddress, isTransferring: true } }));
    try {
        const signer = await getSigner();
        const ticketContract = getTicketContractWithSigner(contractAddress, signer);
        const tx = await ticketContract.safeTransferFrom(signerAddress, toAddress, tokenId);
        await tx.wait();
        setTransferState(prev => ({ ...prev, [`${contractAddress}-${tokenId}`]: { to: toAddress, isTransferring: false, success: `¡Transferido con éxito a ${toAddress.substring(0,6)}...!` } }));
        setOwnedTickets(prevTickets => prevTickets.filter(t => !(t.contractAddress === contractAddress && t.tokenId === tokenId)));
    } catch (err: any) {
        console.error("Transfer error:", err);
        setTransferState(prev => ({ ...prev, [`${contractAddress}-${tokenId}`]: { to: toAddress, isTransferring: false, error: err.reason || 'La transferencia falló.' } }));
    }
  };

  const handleRecipientChange = (contractAddress: string, tokenId: string, value: string) => {
    setTransferState(prev => ({ ...prev, [`${contractAddress}-${tokenId}`]: { ...prev[`${contractAddress}-${tokenId}`], to: value } }));
  };
  
  if (isLoading) return <p className="text-center mt-10">Buscando tus boletos en la blockchain...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Mis Boletos NFT</h1>
          <p className="text-gray-500 mt-2">
            {signerAddress ? `Boletos para: ${signerAddress.substring(0, 6)}...${signerAddress.substring(signerAddress.length - 4)}` : 'Conecta tu billetera'}
          </p>
        </div>
        {ownedTickets.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow-md">
            <p className="text-gray-500">No posees ningún boleto en este momento.</p>
            <a href="/" className="mt-4 inline-block bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Ver Eventos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {ownedTickets.map(ticket => {
                const transferInfo = transferState[`${ticket.contractAddress}-${ticket.tokenId}`] || { to: '', isTransferring: false };
                const qrData = JSON.stringify({
                    contractAddress: ticket.contractAddress,
                    tokenId: ticket.tokenId,
                    owner: ticket.owner
                });
                return (
                  <div key={`${ticket.contractAddress}-${ticket.tokenId}`} className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
                      <Ticket
                          ticketId={ticket.tokenId}
                          eventTitle={ticket.eventName}
                          eventDate="Fecha del Evento"
                          eventVenue="Lugar del Evento"
                          nftId={`#${ticket.tokenId}`}
                          owner={ticket.owner}
                          isValid={true}
                          qrCodeData={qrData}
                          contractAddress={ticket.contractAddress}
                      />
                      <div className="mt-4 p-4 border-t border-gray-200">
                          <h3 className="font-semibold text-gray-700">Transferir Boleto</h3>
                          <input 
                              type="text" 
                              placeholder="Dirección 0x..." 
                              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                              value={transferInfo.to}
                              onChange={(e) => handleRecipientChange(ticket.contractAddress, ticket.tokenId, e.target.value)}
                          />
                          <button 
                              className="w-full mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                              onClick={() => handleTransfer(ticket.contractAddress, ticket.tokenId)}
                              disabled={transferInfo.isTransferring}
                          >
                              {transferInfo.isTransferring ? 'Transfiriendo...' : 'Transferir'}
                          </button>
                          {transferInfo.error && <p className="text-red-500 text-xs mt-2">{transferInfo.error}</p>}
                          {transferInfo.success && <p className="text-green-500 text-xs mt-2">{transferInfo.success}</p>}
                      </div>
                  </div>
                )
            })}
          </div>
        )}
      </div>
    </main>
  );
}