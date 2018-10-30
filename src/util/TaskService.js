import axios from 'axios';

const domain = 'http://localhost:4200';

class TaskService {
  fetchAll() {
    return axios.get(domain + '/tickets')
      .then((res) => {
        return res.data.map((item) => {
          return {
            id: item._id,
            title: item.title,
            description: item.description,
            time: item.time,
            status: item.status,
            urgency: item.urgency,
            importance: item.importance
          }
        })
      })
      .catch((err) => {
        console.log('fetch failure');
        return err;
      })
  }

  create(title,
         description,
         time,
         status,
         importance,
         urgency,
         funcSuccess,
         funcFailure) {
    axios.post(domain + '/tickets', {
      title: title,
      description: description,
      time: time,
      status: status,
      importance: importance,
      urgency: urgency,
      owner_id: '5bd119149f3310161e95f907', // todo user_id add session
      label_id: ["5bce4f85fedd491adde9979a"] // todo label_ids
    })
    .then((res) => {
      console.log('the task was created');
      funcSuccess();
    })
    .catch((error) => {
      console.log('the task was not created');
      funcFailure(error);
    })
  }
}

export default TaskService