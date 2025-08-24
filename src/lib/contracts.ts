import { ethers, BrowserProvider, Contract, Signer, Network } from "ethers";
import EventManagerABI from "@/abis/EventManager.json";
import EventTicketABI from "@/abis/EventTicket.json";

const eventManagerAddress = "0x9FfDCbe41a99846adfd9251E5C21860F36eB3751"; // Address del eventmanager

// --- Define our local Ganache network to prevent ENS errors ---
const ganacheNetwork = new Network("ganache", 1337);

/**
 * Gets a Signer from the browser wallet (MetaMask) to send transactions.
 */
export const getSigner = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No wallet detected. Please install MetaMask.");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
};

/**
 * Returns an instance of the EventManager contract connected to a Signer.
 */
export const getEventManagerContract = (signer: Signer): Contract => {
  return new ethers.Contract(eventManagerAddress, EventManagerABI.abi, signer);
};

/**
 * Returns an instance of EventTicket connected to a Signer.
 */
export const getTicketContractWithSigner = (
  address: string,
  signer: Signer
): Contract => {
  return new ethers.Contract(address, EventTicketABI.abi, signer);
};

/**
 * Returns a READ-ONLY instance of an EventTicket contract to fetch its data.
 */
export const getTicketContract = (address: string): Contract => {
  // Use the standard JsonRpcProvider but pass our custom network definition
  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:7545",
    ganacheNetwork // <-- This tells ethers the network doesn't have ENS
  );
  return new ethers.Contract(address, EventTicketABI.abi, provider);
};