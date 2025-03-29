import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 rounded-t-3xl mt-10 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold">Airline Reservation System</h2>
        <p className="text-gray-400 mt-2">
          Making your travel seamless and comfortable.
        </p>

        <div className="flex justify-center space-x-4 mt-6">
          <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-300"></div>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          ✈️ Fly with comfort, land with happiness! ✈️
        </p>

        <div className="mt-4 text-gray-600 text-xs">
          © {new Date().getFullYear()} Airline Reservation System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
