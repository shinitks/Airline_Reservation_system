import React, { useEffect, useState } from "react";
import TicketContainer from "../components/ETicket/TicketContainer";
import { BACKENDURL } from "../Config/Config";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoShareSocialSharp } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";

const Ticket = () => {
  let { ticketId } = useParams();
  const [ticketData, setTicketData] = useState({});

  useEffect(() => {
    // Updated endpoint URL using lowercase "getticket"
    const fetchTicketURL = `${BACKENDURL}/api/tickets/getTicket/`;

    try {
      fetch(fetchTicketURL + ticketId, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Ticket response:", data); // Log the full response
          // Assuming response returns an array and we need the first element
          setTicketData(data[0]);
        })
        .catch((error) => {
          console.error("Error fetching ticket:", error);
          toast.error(error.message);
        });
    } catch (error) {
      console.error("Error in try/catch:", error);
      toast.error(error.message);
    }
  }, [ticketId]);

  const shareTicket = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Ticket URL",
          text: "Check out this ticket",
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link has been copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share ticket.");
    }
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-[100vh] bg-blue-300 mt-5 flex justify-center items-center bg-[url(https://images.unsplash.com/photo-1542349314-587b18ea1c2a)] bg-cover bg-center bg-no-repeat">
      <div className="w-full min-h-[500px] mx-auto px-5 max-w-[1200px]">
        <div>
          <p className="text-white font-bold text-[30px] text-center mt-[100px]">
            {ticketData && <h1>Your E-Tickets are ready!</h1>}
          </p>
          <div className="mb-10">
            {ticketData && ticketData.bookings && ticketData.bookings.length > 0 ? (
              ticketData.bookings.map((booking) => (
                <TicketContainer
                  key={booking._id}
                  ticketData={ticketData}
                  bookingsData={booking}
                />
              ))
            ) : (
              <div>
                <p className="text-white text-center text-xl">No tickets found.</p>
                <p className="text-white text-center">
                  You can book some tickets{" "}
                  <span className="font-bold">
                    <Link to={"/search"}>Click here</Link>
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          {ticketData && (
            <div className="flex justify-center gap-5">
              <button
                className="flex gap-2 justify-center items-center w-fit px-5 py-3 border-[2px] bg-black/30 border-white text-white rounded-full hover:bg-white hover:text-blue-500 duration-200"
                onClick={shareTicket}
              >
                <IoShareSocialSharp /> Share
              </button>
              <button
                className="flex gap-2 justify-center items-center w-fit px-5 py-3 border-[2px] bg-black/30 border-white text-white rounded-full hover:bg-white hover:text-blue-500 duration-200"
                onClick={printTicket}
              >
                <IoMdDownload /> Print Tickets
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
