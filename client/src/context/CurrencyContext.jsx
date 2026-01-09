import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');

    const rates = {
        USD: 1,
        EUR: 0.92,
        INR: 83.5
    };

    const symbols = {
        USD: '$',
        EUR: '€',
        INR: '₹'
    };

    const formatPrice = (amount) => {
        const rate = rates[currency];
        const value = (amount * rate).toFixed(2);
        return `${symbols[currency]}${value}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};
