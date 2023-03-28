import axios from "axios";


function requestHeaders() {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");
    myHeaders.append("Accept", "application/json");

    return myHeaders;
}

export const APIRequest = (url, method, data, onSuccess, onError) => {
    let baseUrl = 'http://150.230.49.47:8080/api/v1/'
    axios({
        method: method,
        url: `${baseUrl}${url}`,
        data: data,
        headers: requestHeaders(),
        mode: 'cors',
    }).then((res) => {
            onSuccess(res);
        }
    ).catch((error) => {
        onError(error);
    })
}