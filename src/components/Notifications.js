import React from "react";

const Notifications = ({ notifications }) => {
  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
