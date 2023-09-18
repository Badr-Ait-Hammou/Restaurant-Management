import React from 'react';
import { Routes, Route } from "react-router-dom"
import Home from '../components/HomePage';
import Ville from '../components/Cities';
import Restaurant from '../components/Restaurant';
import Zone from '../components/Zone';
import Serie from '../components/Series';
import Specilite from '../components/Specialities';
import User from '../components/UserTable';
import Produit from '../components/Produit';
import Header from '../components/Header';
import CltRest from '../clientcomponent/ClientRestaurants';
import RestaurantDetails from '../clientcomponent/RestaurantDetails';
import { accountService } from '../service/accountService';
import Footer from "../components/Footer";
import ClientHeader from "../clientcomponent/ClientHeader"
import Profile from "../clientcomponent/ClientProfile"
import Orders from "../components/Orders"
import Reservation from "../clientcomponent/ClientReservation"
import Reservations from "../components/Reservations"
import ClientOrders from "../clientcomponent/ClientOrders"
import Cart from "../clientcomponent/Cart"
import AllProducts from "../clientcomponent/AllProducts"
import RestaurantBySpeciality from "../clientcomponent/RestaurantSpeciality";
import RestaurantProductDetail from "../clientcomponent/RestaurantProductDetails";
import AdminDash from "../components/Dashboard";
import OwnerDash from "../OwnersComponent/Dashboard";
import OwnerHeader from "../OwnersComponent/Header"
const userRoutes = (
    <>
        <Route index element={<Home/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/restaurants" element={<CltRest/>}/>
        <Route path="/home/restaurants" element={<CltRest/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/orders" element={<ClientOrders/>}/>
        <Route path="/reservation" element={<Reservation/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/all_products" element={<AllProducts/>}/>
        <Route exact path="/restaurants/:id" element={<RestaurantDetails/>}/>
        <Route exact path="/restaurants_speciality/:id" element={<RestaurantBySpeciality/>}/>
        <Route exact path="/restaurants_speciality/:id/:id" element={<RestaurantDetails/>}/>
        <Route exact path="/restaurants/:id" element={<RestaurantDetails/>}/>
        <Route exact path="/product/:id" element={<RestaurantProductDetail/>}/>
        <Route exact path="/restaurants/:id/product/:id" element={<RestaurantProductDetail/>}/>
        <Route exact path="/all_products/product/:id" element={<RestaurantProductDetail/>}/>
    </>
);
const employeRoutes = (
    <>
        <Route index element={<OwnerDash/>}/>
        <Route path="/" element={<OwnerDash/>}/>
        <Route path="/restaurants" element={<CltRest/>}/>
        <Route path="/home/restaurants" element={<CltRest/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/orders" element={<ClientOrders/>}/>
        <Route path="/reservation" element={<Reservation/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/all_products" element={<AllProducts/>}/>
        <Route exact path="/restaurants/:id" element={<RestaurantDetails/>}/>
        <Route exact path="/home/restaurants_speciality/:id" element={<RestaurantBySpeciality/>}/>
        <Route exact path="/home/restaurants/:id" element={<RestaurantDetails/>}/>
        <Route exact path="/home/product/:id" element={<RestaurantProductDetail/>}/>
        <Route exact path="/home/restaurants/:id/product/:id" element={<RestaurantProductDetail/>}/>
        <Route exact path="/all_products/product/:id" element={<RestaurantProductDetail/>}/>
    </>
);
const AdminRoute = () => {

    return (
        <>
            {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                <Header />
                )}
            {accountService.isLogged && accountService.getRole() === 'USER' && (
                <ClientHeader/>
                )}
            {accountService.isLogged && accountService.getRole() === 'EMPLOYEE' && (
                <OwnerHeader/>
                )}
        <Routes>
            <Route>
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (

                    <Route index element={<AdminDash/>}/>

                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (

                    <Route path="/" element={<AdminDash/>}/>

                    )}

                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                <Route path="/city" element={<Ville/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route path="/restaurant" element={<Restaurant/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route path="/zone" element={<Zone/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route path="/serie" element={<Serie/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route path="/specialite" element={<Specilite/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route path="/user" element={<User/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route path="/produit" element={<Produit/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route path="/reservations" element={<Reservations/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route path="/orders" element={<Orders/>}/>
                    )}
                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                    <Route exact path="/restaurants_speciality/:id" element={<RestaurantBySpeciality/>}/>
                    )}


                {accountService.isLogged && accountService.getRole() === 'USER' && (
                    userRoutes
                )}
                {accountService.isLogged && accountService.getRole() === 'EMPLOYEE' && (
                    employeRoutes
                )}
            </Route>
        </Routes>
            <Footer/>
            </>
    );
};

export default AdminRoute;