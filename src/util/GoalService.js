import axios from 'axios';

let domain = require('./Common').domain;

class GoalService {
  getWeeklyForMonth(year, month) {
    return axios.get(domain + `goal_weekly/${year}/${month}`)
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
      user_id: '5bd119149f3310161e95f907'
    };

    return axios.post(domain + 'goal_weekly', params)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      })
  }

  patchGoalWeekly(goal_id, content, is_completed) {
    let params = {
      is_completed: is_completed
    };
    return axios.patch(domain + `goal_weekly/${goal_id}`, params)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      })
  }
}

export default GoalService;