import React from "react";
import {useEffect, useState, useRef} from "react";
import axios from "../service/callerService";
import {Link} from "react-router-dom";
import {Tag} from "primereact/tag";
import {Rating} from "@mui/material";
import {Dropdown} from "primereact/dropdown";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Button} from "primereact/button";
import {accountService} from "../service/accountService";
import {Toast} from "primereact/toast";
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import DataviewSkeleton from "../skeleton/DataviewSkeleton"
import Typography from "@mui/material/Typography";
import shoppingCartIcon from "../images/shopping-cardIcon.gif"
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function AllProduct() {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
    const [productInCart, setProductInCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);




    const sortOptions = [
        {label: 'Price High to Low', value: '!prix'},
        {label: 'Price Low to High', value: 'prix'}
    ];





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


    const getAverageRating = (product) => {
        const ratings = product.avisList.map((avis) => avis.rating);
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return totalRating / ratings.length;
        } else {
            return 0;
        }
    };

    const getReviews = (product) => {
        const ratings = product.avisList.map((avis) => avis.rating);
        const reviewCount = product.avisList.length;

        if (ratings.length > 0) {
            return reviewCount;
        } else {
            return 0;
        }
    };

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

    useEffect(() => {
        axios.get("/api/controller/produits/").then((response) => {
            setProducts(response.data);
            setLoading(false);
        });
    }, []);

    const handleAddToCart = (product) => {
        setIsLoading(true);
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
            .then(() => {
                setIsLoading(false);
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


    if (loading || products.length === 0) {
        return (
            <>
                <DataviewSkeleton/>
            </>
        );
    }


    const listItem = (product) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-3 gap-4">
                    <Link to={`product/${product.id}`}>
                    <div style={{position: 'relative'}}>
                        <img
                            className="w-10 sm:w-10rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                            src={product.photo}
                            alt={product.nom}
                            style={{
                                width: '400px',
                                height: '200px',
                                borderRadius: '18px'
                            }}
                        />
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
                        className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-2">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.nom}</div>
                            <div className="flex align-items-center gap-3">
                                {product.promotion === true && (
                                    <Tag value="On Sale" severity="danger" icon="pi pi-tag"/>
                                )}
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.stock} Pcs</span>
                                </span>
                            </div>
                            <div>
                                <Typography variant="body2" className="ml-1"
                                            color="text.secondary">{product.description}</Typography>
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Rating value={getAverageRating(product)} readOnly  precision={0.5}></Rating>
                            <Typography
                                className="font-monospace align-items-center">({getReviews(product)})review{getReviews(product) !== 1 ? 's' : ''}</Typography>
                            <Tag
                                style={{background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}}
                                icon={<RestaurantMenuRoundedIcon
                                    style={{fontSize: '16px'}}/>}> {product.restaurant.nom} --{product.restaurant.zone.ville.nom}
                            </Tag>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold text-left">{product.prix} Dh</span>
                            {productInCart[product.id] ? (
                                <Link to="/ifoulki_meals/cart" style={{textDecoration: "none", color: "white"}}>
                                    <Button
                                        icon={<ShoppingCartCheckoutIcon style={{fontSize:"28px"}}  />}
                                        label={"View" }
                                        className="p-button-rounded p-button-raised gap-1 border-teal-400  p-button-text text-teal-600   mt-2 p-2   "
                                        disabled={product.stock <= 0}
                                    />
                                </Link>
                            ) : (
                                <div>
                                    <Button
                                        style={{backgroundColor:"rgb(1,169,164)"}}
                                        icon={<img src={shoppingCartIcon} alt="Shopping Cart"  width="30px" />}
                                        label={"Add"}
                                        className="p-button-rounded p-button-raised gap-2 border-teal-400  p-button-text text-white   mt-2 p-2   "
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock <= 0 || productInCart[product.id] || isLoading}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            {product.promotion === true ? (
                                <Tag value="On Sale" severity="danger" icon="pi pi-tag"/>
                            ):(
                                <Tag value="New" severity="success" icon="pi pi-tag"/>

                            )}
                        </div>
                        <Tag value={product.restaurant && product.restaurant.specialite.nom} style={{backgroundColor:"rgb(23,113,122)"}}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-1 py-1 -mx-2">
                        <Link to={`product/${product.id}`}>
                        <div style={{position: 'relative'}}>
                            <img className=" w-20 sm:w-20rem xl:w-20rem  shadow-2 block xl:block mx-auto border-round"
                                 src={product.photo}
                                 alt={product.nom}
                                 style={{
                                     width: '400px',
                                     height: '200px',
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
                                        right: '5px',
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
                                        right: '5px',
                                    }}
                                />
                            )}
                        </div>
                        </Link>
                        <div className="text-2xl font-bold">{product.nom}</div>
                        <Typography variant="body2" className="ml-1" color="text.secondary">
                            {product.description}
                        </Typography>
                    </div>

                    <div className="content-info">
                        <div className="flex align-items-center justify-content-between py-2 px-3 gap-2">
                            <div className="flex align-items-center gap-2">
                                <Rating value={getAverageRating(product)} readOnly  precision={0.5} style={{fontSize:"16px"}}></Rating>
                            </div>
                            <div className="flex align-items-center gap-2">
                                <Typography
                                    className="font-monospace ">({getReviews(product)})review{getReviews(product) !== 1 ? 's' : ''}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-between py-2 px-1 ">
                            {product.prix >= 100 ?(
                                <div
                                    className="flex align-items-center justify-content-center   surface-border ">
                                    <Tag value={"Free Shipping"} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black"}} icon={<DeliveryDiningIcon style={{fontSize:"20px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>
                                </div>
                            ):(
                                <div
                                    className="flex align-items-center justify-content-center   surface-border ">
                                    <Tag value={"Shipping fee : 30 DH"} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black"}} icon={<DeliveryDiningIcon style={{fontSize:"20px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>

                                </div>
                            )}
                            <div
                                className="flex align-items-center gap-1 justify-content-center   surface-border px-1">
                                <Tag value={product.restaurant && product.restaurant.nom} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black"}} icon={<RestaurantIcon style={{fontSize:"17px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>
                            </div>
                            {/*<div className="flex align-items-center gap-1 justify-content-center gap-1 pl-2">*/}
                            {/*    <i className="pi pi-book"></i>*/}
                            {/*    <span className="font-small text-gray-900 white-space-nowrap">Library</span>*/}
                            {/*</div>*/}
                        </div>
                    </div>


                    <div className="flex align-items-center justify-content-between py-2  gap-1">
                        <span className="text-2xl font-semibold ">{product.prix} Dh</span>
                        {productInCart[product.id] ? (
                            <Link to="/ifoulki_meals/cart" style={{textDecoration: "none", color: "white"}}>
                                <Button
                                    // style={{borderRadius: "50px",background:'linear-gradient(360deg, rgba(0,30,24,0.9759709547881653) 0%, rgba(9,121,84,1) 25%, rgba(0,255,200,1) 100%)'}}
                                    icon={<ShoppingCartCheckoutIcon style={{fontSize:"28px"}}  />}
                                    label={"View" }
                                    className="p-button-rounded p-button-raised gap-1 border-teal-400  p-button-text text-teal-600   mt-2 p-2   "
                                    disabled={product.stock <= 0}
                                />
                            </Link>
                        ) : (
                            <div>
                            <Button
                                style={{backgroundColor:"rgb(1,169,164)"}}
                                icon={<img src={shoppingCartIcon} alt="Shopping Cart"  width="30px" />}
                                label={"Add"}
                                className="p-button-rounded p-button-raised gap-2 border-teal-400  p-button-text text-white   mt-2 p-2   "
                                // className="p-button-rounded p-button-raised mt-2 p-2  gap-2 border-teal-400  shadow-1 hover:bg-teal-400 transition-duration-200  "
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock <= 0 || productInCart[product.id] || isLoading}
                            />
                            </div>
                        )}
                    </div>
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

    return (
        <div>
            <Toast ref={toast}/>

            <div className="card mx-2 mt-5">
                {layout === 'list' && (
                    <div>
                        <DataView value={products} itemTemplate={listItem} layout={layout} header={header()}
                                  sortField={sortField} sortOrder={sortOrder} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={6}/>
                    </div>
                )}

                {layout === 'grid' && (
                    <div>
                        <DataView value={products} itemTemplate={gridItem} layout={layout} sortOrder={sortOrder}
                                  header={header()} sortField={sortField} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={12}/>
                    </div>
                )}
            </div>



        </div>
    );
}