import axios from 'axios';
import {authHeader} from "./AuthHeader";

let domain = require('./Common').domain;

class DailyScheduleService {
  registerSchedule(year, month, day, start_date, end_date, ticket_id) {

    let start_split_time = start_date.split(":");
    let end_split_time = start_date.split(":");
    let start = new Date(year, month, day);
    let end = new Date(year, month, day);

    start.setHours(start_split_time[0]);
    start.setMinutes(start_split_time[1]);

    end.setHours(end_split_time[0]);
    end.setMinutes(end_split_time[1]);

    let params = {
      start_date: start,
      end_date: end,
      ticket: ticket_id,
    };

    return axios.post(domain + `${year}/${month}/${day}`, params, {headers: authHeader()})
      .then((res) => res)
      .catch((error) => error);
  }
}
