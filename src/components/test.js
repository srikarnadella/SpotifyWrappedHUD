import React, { useState, useEffect } from "react";
import axios from "axios";

const Test = ({ accessToken }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.display_name}</h1>
      <p>Email: {userData.email}</p>
      {/* Display other user data as needed */}
    </div>
  );
};

export default Test;
