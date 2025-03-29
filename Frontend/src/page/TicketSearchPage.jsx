import React, { useEffect, useState } from "react";
import BookTicketBox from "../components/BookTicketBox";
import SearchedFlightCards from "../components/Card/SearchedFlightCards";
import { toast } from "react-toastify";
import { BACKENDURL } from "../Config/Config";
import { Link, useLocation } from "react-router-dom";

const TicketSearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [formData, setFormData] = useState({
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    departDate: searchParams.get("departDate") || "",
  });

  const [searchedFlights, setSearchedFlights] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFlightSearch = async (e) => {
    e.preventDefault();

    if (!formData.from || !formData.to) {
      setSearchStatus("Enter flight details to search flights");
      return;
    }

    // Convert "YYYY-MM-DD" to "DD-MM-YYYY"
    const formattedDate = formData.departDate
      ? new Date(formData.departDate)
          .toLocaleDateString("en-GB") // "en-GB" formats as DD/MM/YYYY
          .replace(/\//g, "-") // Replace "/" with "-"
      : "";

    // Create a new object excluding flightType
    const filteredFormData = {
      from: formData.from,
      to: formData.to,
      departDate: formattedDate,
    };

    try {
      console.log("Form Data before sending:", filteredFormData); // Log filteredFormData

      const response = await fetch(BACKENDURL + "/api/flights/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredFormData),
      });

      const data = await response.json();

      if (data.status === false) {
        toast.error(data.message);
        setSearchedFlights([]);
        setSearchStatus("No flights found for the selected route");
      } else {
        setSearchedFlights(data);
        setSearchStatus(
          <>
            <b>{data.length}</b> flights found from <b>{formData.from}</b> to{" "}
            <b>{formData.to}</b>
          </>
        );
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  return (
    <div className="px-[30px] md:px-[30px] max-w-[1400px] mx-auto">
      <BookTicketBox
        formData={formData}
        handleFormDataChange={handleFormDataChange}
        handleFlightSearch={handleFlightSearch}
      />
      <p className="py-5">
        <p>{searchStatus}</p>
      </p>
      {searchedFlights.length > 0 ? (
        <div className="flex justify-center items-center gap-5 flex-wrap w-full">
          {searchedFlights.map((flight, index) => {
  console.log("Flight object:", flight); // Debugging

  return flight ? (
    <Link to={`/book/${flight.id}`} key={index} className="lg:w-full w-fit">
      <SearchedFlightCards flight={flight} />
    </Link>
  ) : null;
})}

        </div>
      ) : null}
    </div>
  );
};

export default TicketSearchPage;