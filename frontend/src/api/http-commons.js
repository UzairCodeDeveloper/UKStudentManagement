import axios from "axios";

export default axios.create({

    baseURL: "13.50.151.242/api",


    headers: {
        "Content-Type": "application/json"
    }
})   