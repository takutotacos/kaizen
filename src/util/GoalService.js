import axios from 'axios';
import {authHeader} from "./AuthHeader";

let domain = require('./Common').domain;

class GoalService {
  getWeeklyForMonth(year, month) {
    return axios.get(domain + `goal_weekly/${year}/${month}`, {headers: authHeader()})
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log('fetch failure');
      })
  }

  postGoalWeekly(year, month, week, content) {
    let params = {
      year: year,
      month: month,
      week: week,
      content: content,
    };

    return axios.post(domain + 'goal_weekly', params, {headers: authHeader()})
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      })
  }

  patchGoalWeekly(goal_id, content, is_completed) {
    let params = {
      completed: is_completed,
    };
    return axios.patch(domain + `goal_weekly/${goal_id}`, params, {headers: authHeader()})
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      })
  }
}

export default GoalService;