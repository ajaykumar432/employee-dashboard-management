import React from "react";

const Notifications = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-semibold">
            🔔
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Notifications
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          This module is currently under development.
        </p>

        <div className="text-xs text-gray-400">
          You’ll be able to manage alerts and updates here soon.
        </div>
      </div>
    </div>
  );
};

export default Notifications;
