import PropTypes from 'prop-types';
import React from 'react';

import '../stylesheets/common/day.scss';

class TimeCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOccupied: props.isOccupied,
      startIndex: 0,
    }
  }

  handleOnClick() {
    if (!this.state.isOccupied) {
      return;
    }

    this.props.onClick(this.state);
  }

  render() {
    let {isOccupied, startIndex, index} = this.props;

    let backgroundColor = isOccupied ? 'beige' : 'blue';
    let isStartCell = startIndex === index;
    let borderLine = index % 4 === 3 ? '1px black solid' : '';

    return (
      <div
        onClick={this.handleOnClick}
        style={{
          backgroundColor: backgroundColor,
          height: '15px',
          borderBottom: borderLine
        }}
      >
        <div
          style={{
            color: 'white'
          }}
        >
          {isStartCell && 'test'}
        </div>
      </div>
    );
  }
}

TimeCell.propTypes = {
  index: PropTypes.number.isRequired,
  isOccupied: PropTypes.bool.isRequired,
  startIndex: PropTypes.number, // index of the start cell

  onClick: PropTypes.func.isRequired,
};

export default class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: props.tasks,
      cells: new Array(24 * 4).fill(0), // cells containing task ids associated with each cell
    }

    this.initialSchedule = this.initialSchedule.bind(this);
    this.scheduleTask = this.scheduleTask.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentWillReceiveProps(props) {
    let oldLength = this.props.tasks.length;
    let diff = props.tasks.slice(oldLength);

    let updatedCells = this.initialSchedule(diff);

    this.setState({
      tasks: props.tasks,
      cells: updatedCells
    })
  }

  initialSchedule(tasks) {
    let temp = this.state.cells.slice();

    tasks.forEach(({id}) => {

      for (let i = 0; i < temp.length; i++) {
        if (temp[i] !== 0) continue; // the cell is assigned

        for (let j = 0; j < 4; j++) {
          temp[i + j] = id
        }
        break;
      }
    })

    return temp;
  }

  scheduleTask(task, start /* ex: 08:15 */, length = 4 /* 15min slot * 4 = 1hour */) {
    if (start === undefined || start.length === 0) return;

    let start_time_split = start.split(":");
    let hour = parseInt(start_time_split[0]);

    hour *= 4; // since the hour is divided into 4. cell represents 15 min time slot

    switch (start_time_split[1]) {
      case "15":
        hour += 1;
        break;

      case "30":
        hour += 2;
        break;

      case "45":
        hour += 3;
        break;

      case "00":
      default:
    }

    if (this.state.cells[hour] !== undefined) {
      return; // the start time is already taken
    }


    let cellClone = this.state.cells.slice();

    for (let i = 0; i < length; i++) {
      cellClone[hour + i] = task.id;
    }

    this.setState({
      cells: cellClone
    })
  }

  handleOnClick({startIndex}) {
    // get the task from the tasks by using the startIndex
    let taskId = this.state.cells[startIndex];
    let {tasks} = this.state;
    let task = undefined;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) {
        task = tasks[i];
        break;
      }
    }
    if (task === undefined) return; // the task not found

    // show the dialog

    // callback for update is schedule task

  }

  render() {
    let {cells} = this.state;
    let startValue = 0;
    let startIndex = 0;

    let startIndexes = cells.map((value, i) => {
      if (startValue === 0) {
        if (value !== 0) {
          startIndex = i;
          startValue = value;
        }
      } else {
        // if the value changes without any unassigned slots in between
        if (startValue !== value) {
          startValue = value;
          startIndex = i;
        }
      }

      return startIndex === 0 ? undefined : startIndex;
    });

    return (
      <div>
        {cells.map((value, i) => (

          <TimeCell
            index={i}
            isOccupied={value !== 0}
            startIndex={startIndexes[i]}
            onClick={this.handleOnClick}
          />

        ))}
      </div>
    )
  }
}

TimeLine.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
}

