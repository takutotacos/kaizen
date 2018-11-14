import axios from 'axios';

let domain = require('./Common').domain;

class UserService {
  signUp(name, email, password, funcSuccess, funcFailure) {
    axios.post(domain + 'users', {
      name: name,
      email: email,
      password: password
    })
      .then((res) => {
        console.log('the user signup was successful');
        // todo pass user name to display
        funcSuccess();
      })
      .catch((error) => {
        console.log('the error occured during user signup');
        funcFailure();
      });
  }

  login(email, password, funcSuccess, funcFailure) {
    axios.post(domain + 'users/login', {
      email: email,
      password: password
    })
      .then((res) => {
        console.log('the user signup was successful');
        funcSuccess();
      })
      .catch((error) => {
        console.log('the error occured during user login');
        funcFailure();
      });
  }
}

export default UserService;