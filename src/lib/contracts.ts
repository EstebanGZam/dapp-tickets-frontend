import { ethers, BrowserProvider, Contract, Signer, Network, JsonRpcSigner } from "ethers";
import EventManagerABI from "@/abis/EventManager.json";
import EventTicketABI from "@/abis/EventTicket.json";

const eventManagerAddress = "0x365C9736c56005CB413F62B96C47267fE1D9Da13";

const ganacheNetwork = new Network("ganache", 1337);

/**
 * Gets a Signer from the browser wallet (MetaMask) to send transactions.
 * This version is improved to prevent multiple connection requests.
 */
export const getSigner = async (): Promise<Signer> => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No wallet detected. Please install MetaMask.");
  }
  
  const provider = new BrowserProvider(window.ethereum);
  
  const accounts = await provider.listAccounts();
  
  if (accounts.length === 0) {
    await provider.send("eth_requestAccounts", []);
  }

  const signer = await provider.getSigner();
  return signer;
};

export const getEventManagerReadContract = (): Contract => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  return new ethers.Contract(eventManagerAddress, EventManagerABI.abi, provider);
};

export const getEventManagerContract = (signer: Signer): Contract => {
  return new ethers.Contract(eventManagerAddress, EventManagerABI.abi, signer);
};

export const getTicketContractWithSigner = (
  address: string,
  signer: Signer
): Contract => {
  return new ethers.Contract(address, EventTicketABI.abi, signer);
};

export const getTicketContract = (address: string): Contract => {
  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:7545",
    ganacheNetwork
  );
  return new ethers.Contract(address, EventTicketABI.abi, provider);
};