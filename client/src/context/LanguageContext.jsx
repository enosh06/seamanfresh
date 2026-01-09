import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    // Simple dictionary for demo
    const translations = {
        en: {
            welcome: "Fresh Seafood Delivered Worldwide",
            order: "Order Now",
            explore: "Explore Products",
            rec: "Recommended for You"
        },
        es: {
            welcome: "Mariscos Frescos a Nivel Mundial",
            order: "Ordenar Ahora",
            explore: "Explorar Productos",
            rec: "Recomendado para Ti"
        },
        fr: {
            welcome: "Fruits de Mer Frais Livrés dans le Monde",
            order: "Commander",
            explore: "Explorer les Produits",
            rec: "Recommandé pour Vous"
        }
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
