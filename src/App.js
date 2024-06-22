// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getTokenFromUrl, loginUrl } from "./utils/auth";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import "./App.css";
import Test from "./components/test";
function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    let _token = hash.access_token;

    if (_token) {
      setToken(_token);
      localStorage.setItem("spotifyToken", _token);
    }

    const storedToken = localStorage.getItem("spotifyToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {!token ? (
          <a href={loginUrl}>Login to Spotify</a>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard token={token} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
