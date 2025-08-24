import { ethers, BrowserProvider, Contract, Signer } from "ethers";
import EventManagerABI from "@/abis/EventManager.json";
import EventTicketABI from "@/abis/EventTicket.json";

const eventManagerAddress = "0xB0Be5Dc84a8d4518b0238DFF232ba4150B0272Ff"; // Pegar dirección del event manager (al desplegar el backend)

/**
 * Obtiene el proveedor y el firmante de la billetera del navegador (MetaMask).
 * Un "Signer" es necesario para enviar transacciones que modifican el estado de la blockchain.
 */
export const getSigner = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No wallet detected. Please install MetaMask.");
  }
  
  // Usamos el proveedor inyectado por MetaMask
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
};

/**
 * Retorna una instancia del contrato EventManager con la que se pueden enviar transacciones.
 * @param signer El firmante (billetera) que ejecutará la transacción.
 */
export const getEventManagerContract = (signer: Signer): Contract => {
  return new ethers.Contract(eventManagerAddress, EventManagerABI.abi, signer);
};

/**
 * Retorna una instancia de un contrato EventTicket para leer sus datos.
 * @param address La dirección del contrato del evento específico.
 */
export const getTicketContract = (address: string): Contract => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  return new ethers.Contract(address, EventTicketABI.abi, provider);
};