import React, { useState } from "react";
import { parseEther, isAddress } from "ethers"; // Updated utility import

const DeliveryForm = ({ setQrData, getContract }) => {
  const [deliveryId, setDeliveryId] = useState("");
  const [status, setStatus] = useState("0");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [courierAddress, setCourierAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const createDelivery = async () => {
    if (!isAddress(recipientAddress) || !isAddress(courierAddress)) {
      setError("Invalid Ethereum addresses for recipient or courier.");
      return;
    }

    const contract = await getContract();
    setIsLoading(true);
    setError("");

    try {
      const tx = await contract.createDelivery(recipientAddress, courierAddress, {
        value: parseEther("0.1"),
      });
      await tx.wait();
      const count = await contract.deliveryCount();
      setQrData(`DeliveryId:${count}`);
    } catch (error) {
      setError(`Error creating delivery: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!deliveryId) {
      setError("Delivery ID cannot be empty.");
      return;
    }

    const contract = await getContract();
    setIsLoading(true);
    setError("");

    try {
      const tx = await contract.updateStatus(deliveryId, status);
      await tx.wait();
    } catch (error) {
      setError(`Error updating status: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Create Delivery</h3>
      <input
        placeholder="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <input
        placeholder="Courier Address"
        value={courierAddress}
        onChange={(e) => setCourierAddress(e.target.value)}
      />
      <button onClick={createDelivery} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Delivery"}
      </button>

      <h3>Update Delivery Status</h3>
      <input
        placeholder="Delivery ID"
        value={deliveryId}
        onChange={(e) => setDeliveryId(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="0">Pending</option>
        <option value="1">In Transit</option>
        <option value="2">Delivered</option>
      </select>
      <button onClick={updateStatus} disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
};

export default DeliveryForm;
