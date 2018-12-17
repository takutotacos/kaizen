import PropTypes from 'prop-types';
import React from 'react';

import './TimelineScheduleModal';
import '../stylesheets/common/day.scss';
import '../stylesheets/common/flex.scss';
import '../stylesheets/common/font.scss';
import TimeScheduleModal from "./TimelineScheduleModal";
import makeTwoDigits from "../util/arrangeNumber";

class TimeCell extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnDeleteClick = this.handleOnDeleteClick.bind(this);
    this.handleOnEditClick = this.handleOnEditClick.bind(this);
  }

  handleOnEditClick() {
    if (!this.props.isOccupied) {
      return;
    }

    this.props.onEditClick(this.props);
  }

  handleOnDeleteClick() {
    if (!this.props.isOccupied) {
      return;
    }

    this.props.onDeleteClick(this.props);
  }

  render() {
    let {isOccupied, startIndex, isEnd, index, title} = this.props;

    let oneHourChunk = index % 4 === 3;
    let borderLine = oneHourChunk ? '1px black solid' : '';
    let backgroundColor = isOccupied ? 'beige' : 'blue';
    let isStartCell = startIndex === index;

    // when occupied, only the end cell needs border line
    borderLine = isOccupied && !isEnd ? '' : borderLine;
    return (
      <div
        className={'flex'}
        style={{
          padding: '0px 12px',
          backgroundColor: backgroundColor,
          height: '15px',
          borderBottom: borderLine
        }}
      >
        {oneHourChunk &&
          (<div
            style={{
              color: 'black',
              fontWeight: 'bold'
            }}
           >
              {parseInt(index / 4) + 1}:00
          </div>)
        }
        {isStartCell &&
          (<div className={'expanded font-middle'}>
            {title}
          </div>)
        }

        {isStartCell &&
          (<div
            onClick={this.handleOnEditClick}
            className={'btn btn-sm'}>
            edit
          </div>)
        }

        {isStartCell &&
          (<div
            onClick={this.handleOnDeleteClick}
            className={'btn btn-sm'}>
            x
          </div>)
        }
      </div>
    );
  }
}

TimeCell.propTypes = {
  index: PropTypes.number.isRequired,
  isOccupied: PropTypes.bool.isRequired,
  startIndex: PropTypes.number, // index of the start cell
  isEnd: PropTypes.bool, // index of the start cell
  title: PropTypes.string.isRequired,

  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: props.tasks,
      cells: new Array(24 * 4).fill(0), // cells containing task ids associated with each cell

      isModalOpen: false,
      targetTaskId: '',
      targetTaskTitle: '',
      targetTaskStart: 0,
      targetTaskEnd: 0,
    }

    this.initialSchedule = this.initialSchedule.bind(this);
    this.scheduleTask = this.scheduleTask.bind(this);
    this.handleOnEditClick = this.handleOnEditClick.bind(this);
    this.handleOnDeleteClick = this.handleOnDeleteClick.bind(this);
    this.handleOnCloseDialog = this.handleOnCloseDialog.bind(this);
    this.taskTitle = this.taskTitle.bind(this);
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

  scheduleTask({start /* ex: 08:15 */, end}) {
    if (start === undefined || start.length === 0) return;
    if (end === undefined || end.length === 0) return;

    let {cells, targetTaskId, targetTaskStart, targetTaskEnd} = this.state;
    let startCell = this.convertIntoCellIndexFrom(start);
    let endCell = this.convertIntoCellIndexFrom(end);

    if (cells[startCell] !==  0 &&
      cells[startCell] !== targetTaskId) {
      // the start time is already taken
      return;
    }

    let cellClone = cells.slice();
    let prevTaskStart = this.convertIntoCellIndexFrom(targetTaskStart);
    let prevTaskEnd = this.convertIntoCellIndexFrom(targetTaskEnd);

    // undo the previous time cell
    for (let i = prevTaskStart; i < prevTaskEnd; i++) {
      cellClone[i] = 0;
    }

    // update the time cell
    for (let i = startCell;
         i < endCell && (cellClone[i] === 0 || cellClone[i] === targetTaskId);
         i++) {
      cellClone[i] = targetTaskId;
    }

    this.setState({
      cells: cellClone,
      isModalOpen: false,
      targetTaskId: '',
      targetTaskTitle: '',
      targetTaskStart: 0,
      targetTaskEnd: 0,
    })
  }

  convertIntoCellIndexFrom(time /* ex: 08:15 */) {
    let start_time_split = time.split(":");
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

    return hour;
  }

  handleOnDeleteClick({startIndex}) {
    // get the task from the tasks by using the startIndex
    let {cells} = this.state;
    let taskId = cells[startIndex];

    for (let i = startIndex;
         i < cells.length && cells[i] === taskId;
         i++) {
      cells[i] = 0;
    }

    this.props.onDeleteClick({taskId})
  }

  handleOnEditClick({startIndex}) {
    // get the task from the tasks by using the startIndex
    let {tasks, cells} = this.state;
    let taskId = cells[startIndex];
    let task = undefined;

    let cellCount = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) {
        task = tasks[i];
        break;
      }
    }

    for (let i = startIndex; i < cells.length; i++) {
      if (taskId !== cells[i]) break;
      cellCount++;
    }

    if (task === undefined) return; // the task not found

    let startTime = this.calculateTimeString(startIndex);
    let endTime = this.calculateTimeString(startIndex + cellCount);

    // show the dialog
    this.setState({
      isModalOpen: true,
      targetTaskId: task.id,
      targetTaskTitle: task.title,
      targetTaskStart: startTime,
      targetTaskEnd: endTime,
    })
  }

  calculateTimeString(cellIndex) {
    let startHour = cellIndex / 4;
    let startMin = cellIndex % 4;

    let minString = '';
    switch (startMin) {
      case 1:
        minString = '15';
        break;
      case 2:
        minString = '30';
        break;
      case 3:
        minString = '45';
        break;
      default:
        minString = '00';
    }

    return makeTwoDigits(startHour) + ':' + minString;
  }

  handleOnCloseDialog() {
    this.setState({
      isModalOpen: false,
    })
  }

  taskTitle(taskId) {
    let {tasks} = this.state;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) {
        return tasks[i].title;
      }
    }
  }

  render() {
    let {cells} = this.state;
    let startValue = 0;
    let startIndex = 0;

    let startIndexes = new Array(24 * 4);
    let endIndexes = new Array(24 * 4);
    for (let i = 0; i < cells.length; i++) {
      let isNew = false;
      if (startValue === 0) {
        if (cells[i] !== 0) {
          startIndex = i;
          startValue = cells[i];
        }
      } else {
        // if the value changes without any unassigned slots in between
        if (startValue !== cells[i]) {
          startIndex = i;
          startValue = cells[i];
          isNew = true;
        }
      }

      startIndexes[i] = startValue === 0 ? undefined : startIndex;
      if (i !== 0 && isNew) endIndexes[i - 1] = true;
    }

    return (
      <div className={'margin-m'}>
        {cells.map((value, i) => (

          <TimeCell
            index={i}
            isOccupied={value !== 0}
            startIndex={startIndexes[i]}
            isEnd={endIndexes[i]}
            title={this.taskTitle(value)}
            onEditClick={this.handleOnEditClick}
            onDeleteClick={this.handleOnDeleteClick}
          />

        ))}

          <TimeScheduleModal
            modalIsOpen={this.state.isModalOpen}
            onRequestClose={this.handleOnCloseDialog}
            start={this.state.targetTaskStart}
            end={this.state.targetTaskEnd}
            title={this.state.targetTaskTitle}
            onChangeSchedule={this.scheduleTask}/>
      </div>
    )
  }
}

TimeLine.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),

  onDeleteClick: PropTypes.func.isRequired
}

