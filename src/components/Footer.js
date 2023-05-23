import React from "react";
import { RiFacebookCircleFill } from "react-icons/ri";
import { RiInstagramFill } from "react-icons/ri";
import { AiFillTwitterCircle } from 'react-icons/ai';
import { RiTelegramFill } from 'react-icons/ri';
import "../styles/footer.css"

export default function Footer() {
    return (
        <div className="footer-dark" style={{marginTop:"50px",}}>
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 item text">
                            <h3>About Our App</h3>
                            <p>Our Restaurant Location App helps you find the nearest Restaurant in your area quickly and easily.</p>
                            <p>With detailed information on each Restaurant, including hours of operation, contact information, and services offered, our app makes it easy to find the right Restaurant for your needs.</p>
                        </div>

                        <div className="col-sm-6 col-md-3 item">
                            <h3>About Us</h3>
                            <ul>
                                <li><h5 >Company</h5></li>
                                <li><h5>Team</h5></li>
                                <li><h5 >Careers</h5></li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-md-3 item">
                            <h3>Contact Us</h3>
                            <ul>
                                <li><h6 >Phone: 555-123-4567</h6></li>
                                <li><h6 >Email: info@restaurantlocationapp.com</h6></li>
                                <li><h6 >Address: 123 Main St, Morocco</h6></li>
                            </ul>
                        </div>
                        <div className="col item social">
                            <a href="https://web.telegram.org/z/"><RiTelegramFill/></a>
                            <a href="https://web.telegram.org/z/"><RiFacebookCircleFill/></a>
                            <a href="https://web.telegram.org/z/"><AiFillTwitterCircle/></a>
                            <a href="https://web.telegram.org/z/"><RiInstagramFill/></a></div>
                    </div>
                    <p className="copyright">Team Restaurant © 2023</p>
                </div>
            </footer>
        </div>
    );
}
