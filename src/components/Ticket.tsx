import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface TicketProps {
  ticketId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  nftId?: string;
  owner?: string;
  isValid?: boolean;
  qrCodeData?: string;
  contractAddress?: string;
}

const Ticket: React.FC<TicketProps> = ({
  ticketId,
  eventTitle,
  eventDate,
  eventVenue,
  nftId,
  owner,
  isValid = true,
  qrCodeData,
  contractAddress
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-white hover:text-purple-200 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <h1 className="text-white text-lg font-medium">Ticket #{ticketId}</h1>
          <button className="text-white hover:text-purple-200 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Event Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {eventTitle}
            </h2>
            <p className="text-gray-600 text-base mb-1">{eventDate}</p>
            <p className="text-gray-600 text-base">{eventVenue}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-100">
              {qrCodeData ? (
                <QRCodeSVG value={qrCodeData} size={160} />
              ) : (
                <p className="text-gray-500 text-sm">Cargando QR...</p>
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Ticket ID:</span>
              <span className="text-gray-900 font-medium text-sm">{ticketId}</span>
            </div>

            {nftId && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">NFT:</span>
                <span className="text-gray-900 font-medium text-sm">{nftId}</span>
              </div>
            )}

            {contractAddress && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">Contrato:</span>
                <span className="text-gray-900 font-medium text-sm truncate ml-2">{contractAddress}</span>
              </div>
            )}

            {owner && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">Propietario:</span>
                <span className="text-gray-900 font-medium text-sm truncate ml-2">
                  {owner}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Estado:</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isValid ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isValid ? 'VÁLIDO' : 'INVÁLIDO'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
