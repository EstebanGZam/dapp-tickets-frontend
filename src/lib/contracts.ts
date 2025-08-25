import {
  ethers,
  BrowserProvider,
  Contract,
  Signer,
  Network,
  JsonRpcSigner,
} from "ethers";
import EventManagerABI from "@/abis/EventManager.json";
import EventTicketABI from "@/abis/EventTicket.json";

// 🎯 Configuración desde variables de entorno
const eventManagerAddress =
  process.env.NEXT_PUBLIC_EVENT_MANAGER_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const networkName = process.env.NEXT_PUBLIC_NETWORK_NAME || "localhost";
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337");
const infuraProjectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

// 🌐 Configuración dinámica de RPC URL según la red
const getRpcUrl = (): string => {
  switch (networkName.toLowerCase()) {
    case "sepolia":
      if (!infuraProjectId) {
        throw new Error(
          "NEXT_PUBLIC_INFURA_PROJECT_ID is required for Sepolia network"
        );
      }
      return `https://sepolia.infura.io/v3/${infuraProjectId}`;

    case "mumbai":
    case "polygon-mumbai":
      return "https://rpc-mumbai.maticvigil.com/";

    case "localhost":
    case "hardhat":
    case "ganache":
      // Para lab: usar NEXT_PUBLIC_LAB_GANACHE_URL si existe
      return process.env.NEXT_PUBLIC_LAB_GANACHE_URL || "http://127.0.0.1:7545";

    default:
      // URL personalizada directa
      return process.env.NEXT_PUBLIC_CUSTOM_RPC_URL || "http://127.0.0.1:7545";
  }
};

// 🔧 Configurar red dinámica
const rpcUrl = getRpcUrl();
const network = new Network(networkName, chainId);

console.log(`🌐 Network Config:`, {
  name: networkName,
  chainId,
  rpcUrl,
  contractAddress: eventManagerAddress,
});

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
  // 🎯 Conecta dinámicamente según configuración de entorno
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Contract(
    eventManagerAddress,
    EventManagerABI.abi,
    provider
  );
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
  // 🎯 Conecta dinámicamente con la red configurada
  const provider = new ethers.JsonRpcProvider(rpcUrl, network);
  return new ethers.Contract(address, EventTicketABI.abi, provider);
};

// 🔍 Función helper para debugging
export const getNetworkInfo = () => {
  return {
    networkName,
    chainId,
    rpcUrl,
    eventManagerAddress,
  };
};
