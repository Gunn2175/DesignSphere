import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box ,useMediaQuery} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import BrushIcon from "@mui/icons-material/Brush";
import CollectionsIcon from "@mui/icons-material/Collections";
import { message } from "antd";

const Header = () => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)"); 
  const [loginUser, setLoginUser] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  // Extract teamCode from URL if it exists
  const teamCode = location.pathname.includes("/design/team/")
    ? location.pathname.split("/design/team/")[1]
    : null;

  const logoutHandler = () => {
    localStorage.removeItem("user");
    message.success("Logout successful");
    navigate("/login");
  };

  const handleTemplatesNavigation = () => {
    if (teamCode) {
      navigate("/templates", { state: { teamCode } });
    } else {
      navigate("/templates");
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#a1c2d2", padding: "10px" ,color: 'black'}}>
      <Toolbar>
      <Typography
  variant={isSmallScreen ? "h6" : "h4"}
  sx={{
    flexGrow: 1,
    fontWeight: "bold",
    fontFamily: "'Chewy', cursive",  // Change to any of the above fonts
    letterSpacing: "2px",
    color: "#FF6F61",  // Stylish reddish-orange color
    textShadow: "2px 2px 5px rgba(0,0,0,0.3)", // Cool shadow effect
  }}
>
  <Link
    to="/home"
    style={{
      textDecoration: "none",
      color: "inherit",
      display: "flex",
      alignItems: "center",
    }}
  >
    <BrushIcon sx={{ marginRight: 0.2 }} />  {!isSmallScreen && "DesignSphere"} 
  </Link>
</Typography>



        {/* Middle Section: Navigation Links */}
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button color="inherit" startIcon={<HomeIcon />} component={Link} to="/home">
          {!isSmallScreen && "Home"} 
          </Button>
          <Button color="inherit" startIcon={<BrushIcon />} component={Link} to="/design">
          {!isSmallScreen && "Design"}
          </Button>
          <Button color="inherit" startIcon={<CollectionsIcon />} onClick={handleTemplatesNavigation}>
          {!isSmallScreen && "Templates"}
          </Button>
        </Box>

        {/* Right Section: User Info and Logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px", marginLeft: "20px" }}>
          {loginUser && !isVerySmallScreen && (
            <Box
              sx={{
                backgroundColor: "#FF6F61",
                padding:isSmallScreen ? "5px 10px" : "8px 15px", 
                borderRadius: "10px",
                color: "white",
                fontWeight: "bold",
                fontFamily: "Poppins",
                fontSize:  isSmallScreen ? "12px" :"14px",
                border: "1px solid #3A3A4A",
                boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
              }}
            >
              {loginUser.name}
            </Box>
          )}
          <IconButton color="inherit" onClick={logoutHandler}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
