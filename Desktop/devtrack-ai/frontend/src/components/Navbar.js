import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import {
  Menu,
  Search,
  Bell,
  LogOut
} from "lucide-react";

const Navbar = ({ onMenuClick, title }) => {

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (

    <div className="topbar">

      {/* LEFT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20
        }}
      >

        <button
          onClick={onMenuClick}
          className="icon-btn d-md-none"
        >
          <Menu size={22}/>
        </button>

        <div className="page-heading">

          <h2>{title}</h2>

          <span>
            Welcome back,
            {" "}
            <strong>{user?.name}</strong>
          </span>

        </div>

      </div>

      {/* RIGHT */}

      <div className="topbar-right">

        {/* SEARCH */}

        <div className="search d-none d-lg-block">

          <Search size={18}/>

          <input
            type="text"
            placeholder="Search projects, tasks..."
          />

        </div>

        {/* NOTIFICATION */}

        <button className="icon-btn">

          <Bell size={20}/>

        </button>

        {/* USER */}

        <div className="user-chip">

          <div className="user-avatar">

            {user?.name?.charAt(0).toUpperCase()}

          </div>

          <div
            className="d-none d-lg-block"
          >

            <div
              style={{
                fontWeight:600,
                color:"white",
                fontSize:14
              }}
            >
              {user?.name}
            </div>

            <div
              style={{
                color:"#9CA3AF",
                fontSize:12
              }}
            >
              Developer
            </div>

          </div>

        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="btn-gradient-blue"
          style={{
            display:"flex",
            alignItems:"center",
            gap:8
          }}
        >

          <LogOut size={18}/>

          Logout

        </button>

      </div>

    </div>

  );

};

export default Navbar;