import React, {Component} from 'react';
import UserService from '../util/UserService';

class UserSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      should_alert_name_empty: false,
      should_alert_email_empty: false,
      should_alert_password_empty: false,
      should_alert_password_not_match: false,
    };
    this.service = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.isNameEmpty() || this.isPasswordEmpty() || this.isEmailEmpty() || !this.isPasswordMatch()) {
      this.alertNecessaryFields();
      return;
    }

    this.service.signUp(this.state.name, this.state.email, this.state.password)
      .then(res => {
        this.props.history.push({
          pathname: '/',
          state: {action: 'action-info', text: 'Successfully signed up.'}
        })
      })
      .catch(err => {
        console.log(err);
          alert('something went wrong');
      })
  }

  alertNecessaryFields() {
    this.setState({
      should_alert_name_empty: this.isNameEmpty(),
      should_alert_email_empty: this.isEmailEmpty(),
      should_alert_password_empty: this.isPasswordEmpty(),
      should_alert_password_not_match: !this.isPasswordMatch(),
    })
  }

  isNameEmpty() {
    return this.state.name.trim().length === 0;
  }

  isEmailEmpty() {
    return this.state.email.trim().length === 0;
  }

  isPasswordEmpty() {
    return this.state.password.trim().length === 0;
  }

  isPasswordMatch() {
    return !this.isPasswordEmpty() &&
      this.state.password_confirmation === this.state.password;
  }

  render() {
    return (
      <div className={'container'}>
        <form onSubmit={this.handleSubmit}>

          <div className={'margin-tb-s'}>
            <label>
              Name: {this.state.should_alert_name_empty ? 'Necessary' : ''}
              <input type={'text'} value={this.state.name} name='name' onChange={this.handleChange}
                     className={'form-control'}/>
            </label>
          </div>

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
            <label>
              Password
              Confirmation: {this.state.should_alert_password_not_match && !this.isPasswordMatch() ? 'Should match' : ''}
              <input type={'password'} value={this.state.password_confirmation} name='password_confirmation' onChange={this.handleChange}
                     className={'form-control'}/>
            </label>
          </div>
          <div>
            <input type={'submit'} value={'Sign Up'} className={'btn btn-primary'}/>
          </div>
        </form>
      </div>
    );
  }
}

export default UserSignup;