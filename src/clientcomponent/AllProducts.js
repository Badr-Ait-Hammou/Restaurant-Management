import React from "react";
import {useEffect, useState, useRef} from "react";
import axios from "../service/callerService";
import {Link} from "react-router-dom";
import {Tag} from "primereact/tag";
import {Rating} from "@mui/material";
import {Dropdown} from "primereact/dropdown";
import {Skeleton} from "primereact/skeleton";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Button} from "primereact/button";
import {accountService} from "../service/accountService";
import {Toast} from "primereact/toast";
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import DataviewSkeleton from "../skeleton/DataviewSkeleton"


export default function AllProduct() {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
    const [productInCart, setProductInCart] = useState({});
    const [loading, setLoading] = useState(true); // Track loading state


    const sortOptions = [
        {label: 'Price High to Low', value: '!prix'},
        {label: 'Price Low to High', value: 'prix'}
    ];


    useEffect(() => {
        axios.get("/api/controller/produits/").then((response) => {
            setProducts(response.data);
            setLoading(false);
        });
    }, []);


    useEffect(() => {
        const fetchUserData = async () => {
            const tokenInfo = accountService.getTokenInfo();
            if (tokenInfo) {
                try {
                    const user = await accountService.getUserByEmail(tokenInfo.sub);
                    setUserId(user.id);
                    console.log('user', user.id);
                } catch (error) {
                    console.log('Error retrieving user:', error);
                }
            }
        };
        fetchUserData();
    }, []);

    const loadProductsUser = () => {
        const checkProductInCart = (productId) => {
            if (userId) {
                axios.get(`/api/controller/carts/incart/${userId}/${productId}`)
                    .then(response => {
                        setProductInCart(prevProductInCart => ({
                            ...prevProductInCart,
                            [productId]: response.data,
                        }));
                    })
                    .catch(error => {
                        console.error('Error checking product in cart:', error);
                    });
            }
        };

        products.forEach((product) => {
            checkProductInCart(product.id);
        });
    };

    useEffect(() => {
        loadProductsUser();
    }, [userId, products]);


    const handleAddToCart = (product) => {
        const cartItem = {
            quantity: 1,
            totalprice: product.prix,
            user: {
                id: userId,
            },
            produit: {
                id: product.id,
            }
        };

        axios.post('/api/controller/carts/', cartItem)
            .then(response => {
                console.log('Product added to cart successfully!');
                showSuccess();
                loadProductsUser();
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
            });
    };

    const showSuccess = () => {
        toast.current.show({severity: 'success', summary: 'Success', detail: 'item added to cart', life: 1000});
    }



    if (loading) {
        return (
            <>
                <DataviewSkeleton/>
            </>
        );
    }

    const listItem = (product) => {
        return (
            <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                <div key={product.id} className="col mb-4 card h-100">
                    <div className="row  row-cols-1  row-cols-sm-4 row-cols-md-4 row-cols-lg-4 g-4 ">
                        <div style={{position: 'relative'}}>
                            <img
                                className="card-img-top mx-auto p-2 "
                                src={product.photo}
                                alt={product.nom}
                                style={{
                                    width: '180px',
                                    height: '140px',
                                    borderRadius: '18px'
                                }}/>
                            {product.stock <= 0 ? (
                                <Tag
                                    severity="warning"
                                    value="Out of Stock"
                                    style={{
                                        fontSize: "10px",
                                        position: 'absolute',
                                        top: '3px',
                                        right: '11px',
                                    }}
                                />
                            ) : (
                                <Tag
                                    severity="success"
                                    value="In Stock"
                                    style={{
                                        fontSize: "10px",
                                        position: 'absolute',
                                        top: '3px',
                                        right: '11px',
                                    }}
                                />
                            )}
                        </div>

                        <div className="card-body">
                            <span className="text-2xl font-semibold  mx-2">{product.nom}</span>
                            <div className="mt-1">
                                <strong
                                    className="card-text ">Description: </strong><small>{product.description}</small>
                            </div>

                            <div className=" align-items-center gap-3 mt-2">
                                {product.promotion === true && (
                                    <Tag value="On Sale" severity="danger" icon="pi pi-tag"/>
                                )}
                                <span className=" align-items-center mx-2">
                                    <span className="font-semibold">{product.stock} Pcs</span>
                                </span>
                            </div>
                            <div className="mt-2">
                                <Tag
                                    style={{background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}}
                                    icon={<RestaurantMenuRoundedIcon
                                        style={{fontSize: '16px'}}/>}> {product.restaurant.nom} --{product.restaurant.zone.ville.nom}</Tag>
                            </div>
                            <div className="d-flex  justify-between align-items-center">
                                <Tag style={{
                                    backgroundColor: "rgba(141,136,136,0.13)",
                                    color: "black",
                                    fontSize: "large"
                                }}>{product.prix} Dh</Tag>

                                {productInCart[product.id] ? (
                                    <Link to="/admin/cart">
                                        <Button
                                            style={{background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}}
                                            icon="pi pi-external-link"
                                            className="p-button-rounded mt-2"
                                            disabled={product.stock <= 0}
                                        />
                                    </Link>
                                ) : (
                                    <Button
                                        icon="pi pi-shopping-cart"
                                        className="p-button-rounded mt-2"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock <= 0 || productInCart[product.id]}
                                    />
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const gridItem = (product) => {
        return (
            <div key={product.id} className={`col mb-4 ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
                <div className="card h-100">
                    <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                        <Link to={`products/${product.id}`}>
                            <div style={{position: 'relative'}}>
                                <img className="w-90 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                     src={product.photo}
                                     alt={product.nom}
                                     style={{
                                         width: '180px',
                                         height: '140px',
                                         borderRadius: '8px'
                                     }}/>
                                {product.stock <= 0 ? (
                                    <Tag
                                        severity="warning"
                                        value="Out of Stock"
                                        style={{
                                            fontSize: "10px",
                                            position: 'absolute',
                                            top: '3px',
                                            right: '11px',
                                        }}
                                    />
                                ) : (
                                    <Tag
                                        severity="success"
                                        value="In Stock"
                                        style={{
                                            fontSize: "10px",
                                            position: 'absolute',
                                            top: '3px',
                                            right: '11px',
                                        }}
                                    />
                                )}
                            </div>
                        </Link>
                        <div
                            className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                <div className="text-2xl font-bold text-900">{product.nom}</div>
                                <Rating value={product.id} readOnly cancel={false}></Rating>
                                <div className="flex align-items-center gap-3">
                                    {product.promotion === true && (
                                        <Tag value="On Sale" severity="danger" icon="pi pi-tag"/>
                                    )}
                                    <span className="flex align-items-center gap-2">
                                    <span className="font-semibold">{product.stock} Pcs</span>
                                </span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-lg-between gap-3 align-items-center mt-3">
                                <span className="text-2xl font-semibold">{product.prix} Dh</span>

                                {productInCart[product.id] ? (
                                    <Link to="/admin/cart">
                                        <Button
                                            style={{background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}}
                                            icon="pi pi-external-link"
                                            className="p-button-rounded mt-2"
                                            disabled={product.stock <= 0}
                                        />
                                    </Link>
                                ) : (
                                    <Button
                                        icon="pi pi-shopping-cart"
                                        className="p-button-rounded mt-2"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock <= 0 || productInCart[product.id]}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const itemTemplate = (group) => {
        if (!group || group.length === 0) {
            return <Skeleton/>;
        }

        return (
            <div className="container mt-2">
                <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {group.map((product) => gridItem(product))}
                </div>
            </div>
        );
    };


    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };


    const header = () => {
        return (
            <div className="flex justify-between items-center">
                <div>
                    <Dropdown
                        options={sortOptions}
                        value={sortKey}
                        optionLabel="label"
                        placeholder="Sort By Price"
                        onChange={onSortChange}
                        className="w-full sm:w-14rem"
                    />
                </div>
                <div>
                    <DataViewLayoutOptions
                        layout={layout}
                        onChange={(e) => setLayout(e.value)}
                    />
                </div>
            </div>
        );
    };
    const header2 = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions
                    layout={layout}
                    onChange={(e) => setLayout(e.value)}
                />
            </div>
        );
    };


    const groupedRestaurants = [];
    for (let i = 0; i < products.length; i += 4) {
        groupedRestaurants.push(products.slice(i, i + 4));
    }


    return (
        <div>
            <Toast ref={toast}/>

            <div className="card mx-2 mt-5">
                {layout === 'list' && (
                    <div>
                        <DataView value={products} itemTemplate={listItem} layout={layout} header={header()}
                                  sortField={sortField} sortOrder={sortOrder}/>
                    </div>
                )}

                {layout === 'grid' && (
                    <div>
                        <DataView value={groupedRestaurants} itemTemplate={itemTemplate} layout={layout}
                                  header={header2()} sortField={sortField}/>
                    </div>
                )}
            </div>


        </div>
    );
}