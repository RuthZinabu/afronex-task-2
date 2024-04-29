import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState('DireDawa');
    const [thisLocation, setLocation] = useState('');

    // Fetch weather data
    const fetchWeather = async () => {
        // Check if the input is a valid zip code (5-digit numerical value)
        const isZipCode = /^\d{5}$/.test(place);
        let params;
    
        // If the input is a zip code, use 'postalCode' parameter in the API request
        if (isZipCode) {
            params = {
                aggregateHours: '24',
                postalCode: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            };
        } else {
            // If the input is a city name, use 'location' parameter in the API request
            params = {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            };
        }
    
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params,
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
            }
        };
    
        try {
            const response = await axios.request(options);
            console.log(response.data);
            const thisData = Object.values(response.data.locations)[0];
            setLocation(thisData.address);
            setValues(thisData.values);
            setWeather(thisData.values[0]);
        } catch (error) {
            console.error(error);
            // Handle error
            alert('This place does not exist');
        }
    };
    

    useEffect(() => {
        fetchWeather();
    }, [place]);

    useEffect(() => {
        console.log(values);
    }, [values]);

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
