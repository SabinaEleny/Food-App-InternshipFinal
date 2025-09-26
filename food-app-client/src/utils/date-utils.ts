export const formatDate = (date: Date | string) => {
    const dateObject = new Date(date);

    if (isNaN(dateObject.getTime())) {
        console.error("Invalid date value provided to formatDate:", date);
        return "Invalid Date";
    }

    return new Intl.DateTimeFormat('ro-RO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(dateObject);
};