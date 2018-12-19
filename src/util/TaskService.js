import axios from 'axios';
import {authHeader} from "./AuthHeader";

let domain = require('./Common').domain;

class TaskService {
  fetchAll() {
    console.log("communicating to " + domain);
    return axios.get(domain + 'tickets', {headers: authHeader()})
      .then((res) => {
        return res.data.map((item) => {

          let status = null;
          switch (item.status.toLowerCase()) {
            case 'waiting':
              status = {value: 'waiting', label: 'Waiting'};
              break;
            case 'done':
              status = {value: 'done', label: 'Completed'};
              break;
            default:
              status = {value: 'wip', label: 'Work In Progress'};
          }

          let urgency = null;
          switch (item.urgency.toLowerCase()) {
            case 'low':
              urgency = {value: 'low', label: 'Low'}
              break;
            case 'medium':
              urgency = {value: 'medium', label: 'Medium'}
              break;
            default:
              urgency = {value: 'high', label: 'High'}
          }

          let importance = null;
          switch (item.importance.toLowerCase()) {
            case 'low':
              importance = {value: 'low', label: 'Low'}
              break;
            case 'medium':
              importance = {value: 'medium', label: 'Medium'}
              break;
            default:
              importance = {value: 'high', label: 'High'}
          }

          return {
            id: item._id,
            title: item.title,
            description: item.description,
            time: item.time,
            status: status,
            urgency: urgency,
            importance: importance
          }
        })
      })
      .catch((err) => {
        console.log('fetch failure');
        return err;
      })
  }

  updateOrCreate(id, title, description, time, status, importance, urgency) {
    let params = {
      title: title,
      description: description,
      time: time,
      status: status,
      importance: importance,
      urgency: urgency,
      label_id: ["5bce4f85fedd491adde9979a"] // todo label_ids
    };

    if (id) {
      console.log('id is there');
      params['id'] = id;
    }

    return axios.post(domain + 'tickets', params, {headers: authHeader()})
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    })
  }

  delete(id) {
    return axios.delete(domain + 'tickets/' + id, {headers: authHeader()})
      .then((res) => res)
      .catch((error) => error)
  }
}

export default TaskService
