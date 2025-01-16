import React, { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Contract } from "ethers"; // Updated import
import QRCodeGenerator from "./components/QRCodeGenerator";
import DeliveryForm from "./components/DeliveryForm";
import Notifications from "./components/Notifications";
import ProofOfDeliveryABI from "./contracts/ProofOfDelivery.json";
import "./styles.css";

const CONTRACT_ADDRESS = "0x5EF1180364854041B1a843cAa2530634cdBFa154";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [qrData, setQrData] = useState("");

  const getContract = useCallback(async () => {
    const provider = new BrowserProvider(window.ethereum); // Updated to BrowserProvider
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, ProofOfDeliveryABI.abi, signer);
  }, []);

  useEffect(() => {
    const listenToEvents = async () => {
      const contract = await getContract();
      contract.on("DeliveryCreated", (deliveryId) => {
        setNotifications((prev) => [...prev, `New Delivery Created: ${deliveryId}`]);
      });
      contract.on("StatusUpdated", (deliveryId, status) => {
        setNotifications((prev) => [
          ...prev,
          `Status Updated for ID ${deliveryId}: ${status}`,
        ]);
      });
      contract.on("DeliveryConfirmed", (deliveryId) => {
        setNotifications((prev) => [
          ...prev,
          `Delivery Confirmed for ID ${deliveryId}`,
        ]);
      });
    };

    listenToEvents();

    return () => {
      getContract().then((contract) => contract.removeAllListeners());
    };
  }, [getContract]);

  return (
    <div className="app-container">
      <h1>Proof of Delivery</h1>
      <DeliveryForm setQrData={setQrData} getContract={getContract} />
      <QRCodeGenerator qrData={qrData} />
      <Notifications notifications={notifications} />
    </div>
  );
}

export default App;
