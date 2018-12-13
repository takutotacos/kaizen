import React from 'react';
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/font.scss'
import '../stylesheets/common/margin.scss'
import '../stylesheets/common/list.scss'
import TimeLine from './TimeLine';
import DailyScheduleTasks from "./DailyScheduleTasks";

class DaySchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      target_day: '',
      target_month: '',
      target_year: '',
      selectedTasks: [],
    }

    this.handleTaskScheduled = this.handleTaskScheduled.bind(this);
  }

  componentDidMount() {
    let slash_separated_value = this.props.location.pathname.split('/');
    let num = slash_separated_value.length;

    let day = slash_separated_value[num - 1];
    let month = slash_separated_value[num - 2];
    let year = slash_separated_value[num - 3];

    if (!this.validateDate(year, month, day)) {
      console.log('the date is invalid');
    }

    this.setState({
      target_day: day,
      target_month: month,
      target_year: year
    })
  }

  validateDate = (year, month, day) => {
    // todo validation
    // if (year < 2000 || 2101 < year) {
    // }
    // if (month < 1 || 12 < month) {
    // }
    // if (day < 1 || 31 < day) {
    // }

    return true;
  };

  handleTaskScheduled(task) {
    let updatedTasks = this.state.selectedTasks.concat(task);

    this.setState({
      selectedTasks: updatedTasks
    })
  }

  render() {
    let {target_day, target_month, target_year, selectedTasks} = this.state;
    let date = new Date(target_year, target_month - 1, target_day, 0, 0, 0);

    return (
      <div className={'flex'}>
        <div className={'expanded parent_timeline_column'}>
          <TimeLine
            tasks={selectedTasks}
          />
        </div>

        <div className={'expanded'}>
          <div style={{margin: '16px'}}>
            <DailyScheduleTasks handleTaskScheduled={this.handleTaskScheduled}/>
          </div>
        </div>
      </div>
    )
  }
}

export default DaySchedule;
