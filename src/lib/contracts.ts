import { ethers, BrowserProvider, Contract, Signer, Network } from "ethers";
import EventManagerABI from "@/abis/EventManager.json";
import EventTicketABI from "@/abis/EventTicket.json";

const eventManagerAddress = "0x9d1Bd3B6d234B09707c4Afbbc2bfADA88F792b2d"; // Address del eventmanager

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

/**
 * Returns a READ-ONLY instance of the EventManager contract.
 * This is optimal for fetching public data like the list of all events
 * without requiring the user to connect their wallet.
 */
export const getEventManagerReadContract = (): Contract => {
  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:7545",
    ganacheNetwork
  );
  return new ethers.Contract(
    eventManagerAddress,
    EventManagerABI.abi,
    provider
  );
};
