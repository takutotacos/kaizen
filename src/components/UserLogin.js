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

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.isEmailEmpty() || this.isPasswordEmpty()) {
      this.alertNecessaryFields();
      return;
    }

    this.service.login(this.state.email, this.state.password)
      .then(data => {
        const {from} = this.props.location.state || {from: {pathname: '/'}}
        this.props.history.push(from);
      })
      .catch(error => {
        alert('login failed');
      })
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
              <input type={'text'} value={this.state.email} name='email' onChange={this.handleChange}
                     className={'form-control'}/>
            </label>
          </div>
          <div className={'margin-tb-s'}>
            <label>
              Password: {this.state.should_alert_password_empty ? 'Necessary' : ''}
              <input type={'password'} value={this.state.password} name='password' onChange={this.handleChange}
                     className={'form-control'}/>
            </label>
          </div>
          <div className={'margin-tb-s'}>
            <input type={'submit'} value={'Login'} className={'btn btn-primary'}/>
          </div>
        </form>
      </div>
    );
  }
}

export default UserLogin;