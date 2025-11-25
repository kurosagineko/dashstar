import React, { useState } from "react";
import "./CSS/profile.css";

function Profile() {
  // === STATE ===
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [theme, setTheme] = useState("");
  const [role, setRole] = useState("User"); // default

  // Generate avatar initials from full name
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"; // fallback

  return (
    <div className="profile-container">

      {/* Top Header */}
      <div className="profile-header">
        <div className="profile-header-left">

          <div className="profile-avatar">{initials}</div>

          <div className="profile-header-text">
            <h2>{fullName || "Your Name"}</h2>
            <p>{role}</p>

            <div className="profile-header-levels">
              <span className="profile-pill">Level 12</span>
              <span className="profile-pill">2,450 XP</span>
            </div>
          </div>
        </div>

        <div className="profile-header-right">
          <button className="header-btn">Edit Profile</button>
          <button className="header-btn">Change Password</button>
        </div>
      </div>

      {/* Page Title */}
      <h1>User Profile</h1>

      {/* ==== PERSONAL DETAILS CARD ==== */}
      <div className="profile-section profile-personal">
        <h2>Personal Details</h2>

        <form className="profile-form">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <label>Timezone</label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />

          <label>Theme</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />

          <button type="button" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>

      {/* === ACHIEVEMENTS === */}
      <div className="profile-section profile-achievements">
        <h2>Achievements</h2>

        <p>Completed Tasks: 0</p>
        <p>Total XP: 0</p>
        <p>Current Level: 0</p>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      {/* === TEAM DETAILS === */}
      <div className="profile-section profile-team">
        <h2>Team Details</h2>

        <p>Team: </p>
        <p>Role: {role}</p>
        <p>Manager: </p>
        <p>Team Members: </p>
      </div>
    </div>
  );
}

export default Profile;
