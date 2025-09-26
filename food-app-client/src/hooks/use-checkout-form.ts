import {useCallback, useState} from 'react';

const initialErrors = {street: '', city: ''};

export const useCheckoutForm = (address: { street: string; city: string; }) => {
    const [errors, setErrors] = useState(initialErrors);

    const validateForm = useCallback(() => {
        const newErrors = {street: '', city: ''};
        let isValid = true;
        if (address.street.trim().length < 3) {
            newErrors.street = "Street and number are required.";
            isValid = false;
        }
        if (address.city.trim().length < 2) {
            newErrors.city = "The city is required.";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    }, [address]);

    return {errors, validateForm};
};