import React, {Component} from 'react';
import UserService from '../util/UserService';

class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      should_alert_email_empty: false,
      should_alert_password_empty: false,
    }
    this.service = new UserService();

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.isEmailEmpty() || this.isPasswordEmpty()) {
      this.alertNecessaryFields();
      return;
    }

    this.service.login(this.state.email,
      this.state.password,
      this.handleSuccess,
      this.handleFailure)
  }

  handleSuccess() {
    alert('login successful');
  }

  handleFailure() {
    alert('login failed');
  }

  isEmailEmpty() {
    return this.state.email.trim().length === 0;
  }

  isPasswordEmpty() {
    return this.state.password.trim().length === 0;
  }

  alertNecessaryFields() {
    this.setState({
      should_alert_email_empty: this.isEmailEmpty(),
      should_alert_password_empty: this.isPasswordEmpty(),
    })
  }

  render() {
    return (
      <div className={'container'}>
        <p>Welcome back!</p>
        <form onSubmit={this.handleSubmit}>
          <div className={'margin-tb-s'}>
            <label>
              Email: {this.state.should_alert_email_empty ? 'Necessary' : ''}
              <input type={'text'} value={this.state.email} onChange={this.handleEmailChange}
                     className={'form-control'}/>
            </label>
          </div>
          <div className={'margin-tb-s'}>
            <label>
              Password: {this.state.should_alert_password_empty ? 'Necessary' : ''}
              <input type={'password'} value={this.state.password}
                     onChange={this.handlePasswordChange}
                     className={'form-control'}/>
            </label>
          </div>
          <div className={'margin-tb-s'}>
            <input type={'submit'} value={'Sign Up'} className={'btn btn-primary'}/>
          </div>
        </form>
      </div>
    );
  }
}

export default UserLogin;