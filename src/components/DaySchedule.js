import React from 'react';
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/font.scss'
import '../stylesheets/common/margin.scss'
import '../stylesheets/common/list.scss'
import TasksFetch from "./TasksFetch";
import Day from './Day';
import {HOUR_IN_PIXELS} from "./TimeSlot";
import {MINUTE_IN_PIXELS} from "../util/positionInDay";


function flatten(selection) {
  const result = [];
  selection.forEach((selectionsInDay) => {
    result.push(...selectionsInDay);
  });
  return result;
}

class DaySchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      target_day: '',
      target_month: '',
      target_year: ''
    }
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

  handleDayChange(dayIndex, selections) {
    this.setState(({daySelections}) => {
      const {onChange} = this.props;
      if (!onChange) {
        return undefined;
      }

      daySelections[dayIndex] = selections;
      const flattened = flatten(daySelections);
      onChange(this.props.week, flattened);
      return {daySelections}
    })

  }

  generateHourLimits() {
    const {availableHourRange} = {availableHourRange: {start: 0, end: 24}};
    return {
      top: availableHourRange.start * HOUR_IN_PIXELS, // top blocker
      bottom: availableHourRange.end * HOUR_IN_PIXELS,
      bottomHeight: (24 - availableHourRange.end) * HOUR_IN_PIXELS,
      difference: ((availableHourRange.end - availableHourRange.start) * HOUR_IN_PIXELS)
        + (MINUTE_IN_PIXELS * 14)
    };
  }

  render() {
    console.log(this.generateHourLimits());

    return (
      <div className={'flex'}>


        <div className={'expanded'}>
          <Day
            timeConvention={'24h'}
            timeZone={'Asia/Tokyo'}
            index={1}
            date={this.state.target_day}
            initialSelections={[]}
            onChange={this.handleDayChange}
            hourLimits={this.generateHourLimits()}
          />
        </div>

        <div className={'expanded'}>
          <div style={{margin: '16px'}}>
            <TasksFetch/>
          </div>
        </div>
      </div>
    )
  }
}

export default DaySchedule;
