import React from 'react';
import { Routes, Route } from "react-router-dom"
import Home from '../components/HomePage';
import Ville from '../components/Ville';
import Restaurant from '../components/Restaurant';
import Zone from '../components/Zone';
import Serie from '../components/Serie';
import Specilite from '../components/Specialite';
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
const AdminRoute = () => {
    return (
        <>
            {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                <Header />
                )}
            {accountService.isLogged && accountService.getRole() === 'USER' && (
                <ClientHeader/>
                )}
        <Routes>
            <Route>
            <Route index element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>

                {accountService.isLogged && accountService.getRole() === 'ADMIN' && (
                <Route path="/ville" element={<Ville/>}/>
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
                <Route path="/restaurants" element={<CltRest/>}/>
                <Route path="/home/restaurants" element={<CltRest/>}/>
                <Route path="/orders" element={<ClientOrders/>}/>
                <Route path="/reservation" element={<Reservation/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route exact path="/restaurants/restaurants/:id" element={<RestaurantDetails/>}/>
            </Route>
        </Routes>
            <Footer/>
            </>
    );
};

export default AdminRoute;