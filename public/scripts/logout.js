import { wsClient } from './socket.js';

const query = `
    subscription {
        loginSubscription {
            id,
            name,
            token,
        }
    }
`;

wsClient.request({ query }).subscribe({
    next(data) {
        console.log("data", data)
        let arg = data.data.loginSubscription

        if (arg.name = localStorage.getItem('name')){
            localStorage.removeItem('token')
            localStorage.removeItem('name')
            window.location.href = "login.html"
        }
    },
    error(err) {
        console.error("Error con WS: ", err);
    }
});
