import React, { Component } from 'react';
import logo from '../logo.png'
import '../App.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: '',
      actionText: ''
    }
  }
  componentDidMount() {
    if (this.props.location.state) {
      let states = this.props.location.state;

      this.setState({
        action: states.action,
        actionText: states.text
      });

      // reset the history
      this.props.history.push({
        state: {action: '', text: ''}
      })
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.action && <div className={`alert ${this.state.action}`}>
          {this.state.actionText}
        </div>}
        <img src={logo} alt="logo" />
      </div>
    );
  }
}

export default Home;
