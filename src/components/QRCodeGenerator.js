import React from "react";
import QRCode from "react-qr-code";

const QRCodeGenerator = ({ qrData }) => {
  return (
    <div>
      {qrData && (
        <>
          <h3>Scan this QR Code:</h3>
          <QRCode value={qrData} />
        </>
      )}
    </div>
  );
};

export default QRCodeGenerator;
