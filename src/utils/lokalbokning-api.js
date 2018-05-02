import axios from 'axios';

import { getCookie } from '../utils/cookies';

const BASE_URL = 'https://apps.lib.kth.se/webservices/lokalbokning/api/v1';

function getEventsData(fromDate, toDate) {
    //läs cookie med JWT-token
    var kthb_jwt = getCookie("kthb_jwt");
    const url = `${BASE_URL}/events?token=${kthb_jwt}&fromDate=${fromDate}&toDate=${toDate}&limit=5000`;
    return axios.get(url);
}

function checkJWT() {
    //läs cookie med JWT-token
    var kthb_jwt = getCookie("kthb_jwt");
    const url = `${BASE_URL}/checkJWT?token=${kthb_jwt}`;
    return axios.get(url);
}

export {getEventsData, checkJWT};