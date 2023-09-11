import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {accountService} from "../service/accountService";
import {Grid} from "@mui/material";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Ifoulkilogo from "../images/IFOULKIlogo2.svg";

const pages = ['city', 'zone', 'serie', 'specialite', 'restaurant', 'produit', 'user', 'orders', 'reservations'];

export default function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        accountService.logout();
        navigate('/', {replace: true});
        handleCloseUserMenu();
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <AppBar position="static" style={{backgroundColor: 'rgb(23,113,122)'}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Avatar src={Ifoulkilogo} variant="square" sx={{display: {xs: "none", md: "flex"}, mr: 1}}/>
                        <Link to="/admin/home" style={{textDecoration: 'none', color: 'inherit'}}>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    mr: 1,
                                    display: {xs: "none", md: "flex"},
                                    fontFamily: "monospace",
                                    fontWeight: 800,
                                    letterSpacing: ".0rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                Ifoulki_Meals
                            </Typography>
                        </Link>

                        <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: "block", md: "none"},
                                }}
                            >
                                {pages.map((page, index) => (
                                    <MenuItem key={index} className="font-serif text-black">
                                        <Link
                                            style={{textDecoration: "none", color: "inherit"}}
                                            to={`${page}`}
                                            onClick={handleCloseNavMenu} // Close the mobile menu on click


                                        >
                                            {page}
                                        </Link>
                                    </MenuItem>
                                ))}

                            </Menu>
                        </Box>
                        <Avatar src={Ifoulkilogo} variant="square"
                                sx={{display: {xs: "flex", md: "none"}, mr: 1, width: 34, height: 34}}/>

                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: {xs: "flex", md: "none"},
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".1rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            <Link to="/admin/home" style={{textDecoration: 'none', color: 'inherit'}}>

                                Ifoulki_Meals
                            </Link>
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                            {pages.map((page, index) => (
                                <Link
                                    key={index}
                                    style={{textDecoration: "none", color: "white"}}
                                    to={`${page}`}
                                >
                                    <Button
                                        key={page}
                                        //onClick={handleCloseNavMenu}
                                        sx={{my: 2, color: "white", display: "block"}}
                                    >
                                        {page}
                                    </Button>
                                </Link>
                            ))}
                        </Box>

                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/logo.png"/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: "45px"}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >

                                <Button onClick={handleLogout} sx={{color: "black"}}>
                                    <Typography textAlign="center">Logout</Typography>
                                </Button>
                            </Menu>
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>
            <Grid container spacing={1} style={{backgroundColor: 'rgb(13,77,84)'}} justifyContent="center">
                <Box style={{display: 'flex', alignItems: 'center', fontSize: "9px"}}>
                    <span style={{color: 'white'}}>
                        <LocalShippingRoundedIcon/>
                    </span>
                    <span className="mx-2 text-amber-300">Free Shipping on Orders Over 100 Dh</span>
                    <span className=" text-white"> *  Estimated Delivery: 10-30 Minutes </span>
                </Box>

            </Grid>
        </>
    );
}
