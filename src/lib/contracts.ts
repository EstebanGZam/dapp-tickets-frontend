import { ethers } from "ethers";
import EventTicketABI from "@/abis/EventTicket.json";

// Conexión a blockchain local (Ganache)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

export const getTicketContract = (address: string) => {
  return new ethers.Contract(address, EventTicketABI.abi, provider);
};
