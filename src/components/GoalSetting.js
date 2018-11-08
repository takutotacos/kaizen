import React from 'react';

/* /calendar/goal/y/:year */
/* /calendar/goal/q/:year/:quarter */
/* /calendar/goal/m/:year/:month */
/* /calendar/goal/w/:year/:month/:week */

class GoalSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      span: '',
      spanValue: ''
    }
  }

  componentDidMount() {
    let path = window.location.pathname.split('/');
    let item = path[path.length - 2];
    let value = path[path.length - 1].split('_');

    switch (item) {
      case 'y':
        item = 'year';
        value = value[0];
        break;
      case 'q':
        item = 'quarter';
        value = value.join('/');
        break;
      case 'm':
        item = 'month';
        value = value.join('/');
        break;
      default:
        item = 'week';
        value = value.join('/');
    }

    console.log('item value ' + item + ' ' + value);
    this.setState({
      span: item,
      spanValue: value,
    })
  }

  makeSpanTitle = () => {
    return this.state.span + ' ' + this.state.spanValue;
  };

  render() {
    return (
      <div>
        What is your goal for {this.state.span == null ? '' : this.makeSpanTitle()}
      </div>
    )
  }
}

export default GoalSetting;