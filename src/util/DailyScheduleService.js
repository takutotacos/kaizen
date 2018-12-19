import axios from 'axios';
import {authHeader} from "./AuthHeader";

let domain = require('./Common').domain;

export default class DailyScheduleService {
  fetchSchedules(year, month, day) {
    return axios.get(domain + `daily_task/${year}/${month}/${day}`, {headers: authHeader()})
      .then((res) => res.data)
      .catch((error) => error);
  }

  registerSchedule(year, month, day, start_date, end_date, ticket_id, ticket_title) {
    let start = this.convertTimeFromString(year, month, day, start_date);
    let end = this.convertTimeFromString(year, month, day, end_date);

    let params = {
      start_date: start,
      end_date: end,
      ticket_id: ticket_id,
      ticket_title: ticket_title // todo remove this after figuring out how to retrieve from the joined table in the get method
    };

    return axios.post(domain + `daily_task/${year}/${month}/${day}`, params, {headers: authHeader()})
      .then((res) => res.data)
      .catch((error) => error);
  }

  updateSchedule(year, month, day, schedule_id, taskId, start_date, end_date) {
    let start = this.convertTimeFromString(year, month - 1, day, start_date);
    let end = this.convertTimeFromString(year, month - 1, day, end_date);

    let params = {
      start_date: start,
      end_date: end,
      ticket_id: taskId,
      schedule_id: schedule_id
    }

    return axios.patch(domain + `daily_task/${year}/${month}/${day}`, params, {headers: authHeader()})
      .then((res) => res.data)
      .catch((error) => error);
  }

  deleteSchedule(year, month, day, schedule_id) {
    return axios.delete(domain + `daily_task/${year}/${month}/${day}/${schedule_id}`, {headers: authHeader()})
      .then((res) => res.data)
      .catch((error) => error);
  }

  convertTimeFromString(year, month, day, time_string) {
    let split_time = time_string.split(":");
    let date = new Date(year, month, day);

    date.setHours(split_time[0]);
    date.setMinutes(split_time[1]);

    return date;
  }
}
