import http from "k6/http";

export const options = {
    duration: "10s",
    vus: 10,
    summaryTrendStats: ["med", "p(99)"],
};

export default function () {
    const data = {
        text: randomString(30),
        userUuid: randomString(36)
    };

    http.post(
        `http://localhost:7800/api/courses/1/questions`,
        JSON.stringify(data)
    );
}

const randomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}