import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BACKENDURL } from "../Config/Config";
import { useNavigate, Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary";
import { authContext } from "../context/authContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { dispatch } = useContext(authContext);
  const [userData, setUserData] = useState({});
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [tickets, setTickets] = useState([]); // ✅ Store tickets separately
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${BACKENDURL}/api/user/getUser`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("User data response:", response.data);
        const user = response.data?.user;
        if (user) {
          setUserData(user);
          setUserName(user.username || "");
        }

        // ✅ Store tickets separately
        if (response.data?.tickets) {
          setTickets(response.data.tickets);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageData = await uploadImageToCloudinary(file);
        console.log("Uploaded image data:", imageData);
        setProfilePic(imageData.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let updatedData = { username: userName };
      if (profilePic) {
        updatedData.profilePic = profilePic;
      }

      const response = await axios.put(
        `${BACKENDURL}/api/v1/auth/updateUser`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile updated successfully");
      console.log("Profile updated successfully:", response.data);
      setUserData(response.data.user);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="px-[30px] md:px-[30px]">
      <div className="max-w-[800px] mx-auto">
        <h1 className="mt-5 text-2xl">Profile</h1>
        <div className="my-5 w-[100px] h-[100px] rounded-full overflow-hidden relative">
          <div className="w-full h-full object-cover absolute flex justify-center items-center bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
            <label htmlFor="profile-pic-upload">
              <TbEdit className="text-white text-[40px] cursor-pointer" />
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>
          {profilePic || userData?.profilePic ? (
            <img
              src={profilePic || userData.profilePic}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <img
            src="https://i.pinimg.com/736x/7f/ff/68/7fff6829e61d1924c44d8cb5a0cfbdff.jpg"
              alt="Default Profile"
              className="object-cover w-full h-full"
            />
          )}
        </div>

        <div>
          <div className="flex gap-2 justify-start items-center">
            <p>User Name: </p>
            <input
              type="text"
              value={userName}
              className="outline-none"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <p className="mt-2">User Email: {userData?.email || "Not Available"}</p>
        </div>

        <div className="flex gap-2 justify-start items-center">
          
          <button
            className="bg-red-300 text-black mt-3 px-8 py-3 rounded-xl hover:bg-red-400 transition duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* ✅ Display Tickets Properly */}
        {tickets.length > 0 ? (
          <table className="table-auto w-full mt-5">
            <thead>
              <tr>
                <th className="border px-4 py-2">Booking ID</th>
                <th className="border px-4 py-2">Ticket UID</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket?.ticketId}>
                  <td className="border px-4 py-2 text-center">{ticket?.bookingId}</td>
                  <td className="border px-4 py-2 text-center">{ticket?.uid}</td>
                  <td className="border px-4 py-2 text-center">
                    <Link
                      to={`/ticket/${ticket?.ticketId}`}
                      className="text-blue-500 underline"
                    >
                      View Ticket
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-5">No tickets found</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
