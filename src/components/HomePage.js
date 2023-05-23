import React from 'react';
import "../styles/homepage.css"
import {Toast} from "primereact/toast";
import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useEffect, useState} from "react";
import axios from "../service/callerService";



export default function HomePage(){
    const [products, setProducts] = useState([]);
    const [productsno, setProductsno] = useState([]);


    useEffect(() => {
        axios.get("/api/controller/produits/promotion").then((response) => {
            setProducts(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get("/api/controller/produits/nopromotion").then((response) => {
            setProductsno(response.data);
        });
    }, []);


    return (
        <div>
            <>
                <main>
                    <section id="home">

                        <h1>PLANET FOOD</h1>
                        <strong className="text-white">We have what you need</strong>

                        <div className="mt-5">
                            <Button  label="Make A Reservation" severity="help" raised  className="mx-1"/>
                            <Button  label="Discover Our Restaurants" severity="warning" raised  className="mx-1"/>
                            <Button  label="More About Us" severity="success" raised  className="mx-1"/>
                        </div>
                    </section>
                </main>
            </>
            <>
                <div className="mt-2">
                    <h2 className="promotion-title">PROMOTION</h2>
                    <div className="container mt-5">
                        <div className="row row-cols-2 row-cols-md-2 row-cols-lg-4 g-4">
                            {products.map((product) => (
                                <div key={product.id} className="col mb-4">
                                    <div className="card h-100">

                                            <div className="sale-logo">
                                                <span>Sale</span>
                                            </div>

                                        <Link to={`restaurants`}>
                                            <img
                                                src={product.photo}
                                                className="card-img-top"
                                                alt="Pharmacy"
                                                style={{ objectFit: "cover", height: "auto" }}
                                            />
                                        </Link>
                                        <div className="card-body">
                                            <h5 className="card-title">{product.nom}</h5>
                                            <p className="card-text">Price: {product.prix}</p>
                                            <p className="card-text">In Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>

            <>
                <div className="mt-2">
                    <h2 className="promotion-title">OUR BEST PLANS</h2>
                    <div className="container mt-5">
                        <div className="row row-cols-2 row-cols-md-2 row-cols-lg-4 g-4">
                            {productsno.map((product) => (
                                <div key={product.id} className="col mb-4">
                                    <div className="card h-100">

                                        <div className="sale-logo2">
                                            <span>Top</span>
                                        </div>

                                        <Link to={`restaurants`}>
                                            <img
                                                src={product.photo}
                                                className="card-img-top"
                                                alt="Pharmacy"
                                                style={{ objectFit: "cover", height: "auto" }}
                                            />
                                        </Link>
                                        <div className="card-body">
                                            <h5 className="card-title">{product.nom}</h5>
                                            <p className="card-text">Price: {product.prix}</p>
                                            <p className="card-text">In Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}