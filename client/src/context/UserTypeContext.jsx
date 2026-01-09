import React, { createContext, useContext, useState, useEffect } from 'react';

const UserTypeContext = createContext();

export const useUserType = () => useContext(UserTypeContext);

export const UserTypeProvider = ({ children }) => {
    const [userType, setUserType] = useState(() => {
        return localStorage.getItem('userType') || null;
    });

    useEffect(() => {
        if (userType) {
            localStorage.setItem('userType', userType);
        }
    }, [userType]);

    // Wholesale gets 20% discount
    const getPriceMultiplier = () => {
        return userType === 'wholesale' ? 0.80 : 1;
    };

    const formatPrice = (basePrice) => {
        return (basePrice * getPriceMultiplier()).toFixed(2);
    };

    return (
        <UserTypeContext.Provider value={{
            userType,
            setUserType,
            getPriceMultiplier,
            formatPrice,
            isWholesale: userType === 'wholesale',
            isRetail: userType === 'retail'
        }}>
            {children}
        </UserTypeContext.Provider>
    );
};
