import { useCurrency } from '../context/CurrencyContext';
import { useUserType } from '../context/UserTypeContext';

/**
 * A unified hook to handle pricing logic across the application.
 * It combines currency conversion and user-type (wholesale) discounts.
 */
export const usePrice = () => {
    const { currency, setCurrency, formatPrice: formatCurrency } = useCurrency();
    const { isWholesale } = useUserType();

    /**
     * Returns the raw numeric price after user discounts (for logic, not display)
     */
    const getRawDiscountedPrice = (itemOrPrice, quantity = 1) => {
        // Handle both object and primitive inputs
        const item = typeof itemOrPrice === 'object' ? itemOrPrice : { price: itemOrPrice };
        let price = parseFloat(item.price);

        if (isNaN(price)) return 0;

        if (isWholesale) {
            // Apply wholesale pricing if MOQ is met (default to 0 if not specified)
            const moq = item.wholesale_moq || 0;
            if (quantity >= moq) {
                if (item.wholesale_price) {
                    price = parseFloat(item.wholesale_price);
                } else {
                    price = price * 0.8; // Fallback to 20% discount if wholesale_price not set
                }
            }
        } else {
            // Retail Discount
            if (item.discount_percent && item.discount_percent > 0) {
                price = price * (1 - item.discount_percent / 100);
            }
        }

        return price * quantity;
    };

    /**
     * Calculates and formats the final price.
     * @param {Object|number} itemOrPrice - The product item or base price
     * @param {number} quantity - The quantity (kg)
     * @returns {string} - Formatted price
     */
    const getFinalPrice = (itemOrPrice, quantity = 1) => {
        const rawPrice = getRawDiscountedPrice(itemOrPrice, quantity);
        return formatCurrency(rawPrice / (quantity || 1));
    };

    /**
     * Formats the total price (price * quantity)
     */
    const formatTotal = (itemOrPrice, quantity = 1) => {
        const rawPrice = getRawDiscountedPrice(itemOrPrice, quantity);
        return formatCurrency(rawPrice);
    };

    return {
        currency,
        setCurrency,
        getFinalPrice,
        getRawDiscountedPrice,
        formatTotal,
        formatPrice: formatCurrency,
        isWholesale
    };
};

export default usePrice;
