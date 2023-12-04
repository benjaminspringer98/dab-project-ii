// show only the first part of the uuid for simplicity
const formatUserUuid = (uuid) => {
    return uuid.split("-")[0];
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    };
    return new Intl.DateTimeFormat("en-US", options)
        .format(date)
        .replace(",", " at");
};

export { formatUserUuid, formatDate }