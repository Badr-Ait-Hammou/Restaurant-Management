import React, {useState} from "react"
import Zones from "../components/Zones";
import Cities from "../components/Cities";
import {Grid} from "@mui/material";
import Box from "@mui/material/Box";
export default function ZoneCity(){
    const [selectedCity, setSelectedCity] = useState(null);

    const handleCityChange = (city) => {
        setSelectedCity(city);
    };
    return(
        <div className="card mt-5 mx-2">
            <Box sx={{mx:1,mt:3}}>
                <Grid item container spacing={1} columns={12}>
                    <Grid item xs={12} md={6}>
                        {/* Pass selectedCity and handleCityChange as props */}
                        <Cities selectedCity={selectedCity} onCityChange={handleCityChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {/* Pass selectedCity as a prop */}
                        <Zones selectedCity={selectedCity} />
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}