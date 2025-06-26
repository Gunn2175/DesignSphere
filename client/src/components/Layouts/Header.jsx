import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box, useMediaQuery, Menu, MenuItem } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import BrushIcon from "@mui/icons-material/Brush";
import CollectionsIcon from "@mui/icons-material/Collections";
import MenuIcon from "@mui/icons-material/Menu"; // Icon for dropdown menu
import { message } from "antd";
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Header = ({ user }) => {
  const isSmallScreen = useMediaQuery("(max-width: 700px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
  const [loginUser, setLoginUser] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("user prop", user);
    
    if (user) {
      setLoginUser(user);
    }
  }, [user]); // Ensure this effect runs whenever the user prop changes

  const teamCode = location.pathname.includes("/design/team/")
    ? location.pathname.split("/design/team/")[1]
    : null;

  const logoutHandler = async () => {
    try {

      await axios.post(`${BASE_URL}/users/logout`, {}, { withCredentials: true });
      localStorage.removeItem('user');

      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Logout failed. Please try again.");
    }
  };

  const handleTemplatesNavigation = () => {
    if (teamCode) {
      navigate("/templates", { state: { teamCode } });
    } else {
      navigate("/templates");
    }
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: "#f5c5b3",
        padding: "10px",
        color: "black" 
      }}
    >
      <Toolbar>
        {/* Title with Logo */}
        <Typography
          variant={isSmallScreen ? "h6" : "h4"}
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            fontFamily: "'Chewy', cursive",
            letterSpacing: "2px",
            color: "#593125",
            textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
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
            <BrushIcon sx={{ marginRight: 0.2 }} /> {!isSmallScreen && "DesignSphere"}
          </Link>
        </Typography>

        {/* Dropdown for Very Small Screens */}
        {isVerySmallScreen ? (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
              <MenuItem onClick={() => navigate("/home")}>
                <HomeIcon sx={{ marginRight: 1 }} /> Home
              </MenuItem>
              <MenuItem onClick={() => navigate("/design")}>
                <BrushIcon sx={{ marginRight: 1 }} /> Design
              </MenuItem>
              <MenuItem onClick={handleTemplatesNavigation}>
                <CollectionsIcon sx={{ marginRight: 1 }} /> Templates
              </MenuItem>
              {loginUser && (
                <MenuItem>
                  <Box
                    sx={{
                      backgroundColor: "#e46064",
                      padding: "5px 10px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      border: "1px solid #3A3A4A",
                      boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Baloo', sans-serif",
                        letterSpacing: "2px",
                        color: "white",
                        textShadow: "2px 2px 5px rgba(0,0,0,0.5)",
                      }}
                    >
                      {loginUser.name}
                    </Typography>
                  </Box>
                </MenuItem>
              )}
              <MenuItem onClick={logoutHandler}>
                <LogoutIcon sx={{ marginRight: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button 
                color="inherit" 
                startIcon={<HomeIcon />} 
                component={Link} 
                to="/home"
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {!isSmallScreen && "Home"}
              </Button>
              <Button 
                color="inherit" 
                startIcon={<BrushIcon />} 
                component={Link} 
                to="/design"
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {!isSmallScreen && "Design"}
              </Button>
              <Button 
                color="inherit" 
                startIcon={<CollectionsIcon />} 
                onClick={handleTemplatesNavigation}
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {!isSmallScreen && "Templates"}
              </Button>
            </Box>

            {/* Right Section: User Info and Logout */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "15px", marginLeft: "20px" }}>
              {loginUser && (
                <Box
                  sx={{
                    backgroundColor: "#e46064",
                    padding: "5px 10px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    border: "1px solid #3A3A4A",
                    boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      letterSpacing: "2px",
                      color: "white",
                      textShadow: "2px 2px 5px rgba(0,0,0,0.5)",
                    }}
                  >
                    {loginUser.name}
                  </Typography>
                </Box>
              )}
              <IconButton color="inherit" onClick={logoutHandler}>
                <LogoutIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

