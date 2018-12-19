import PropTypes from 'prop-types';
import React from 'react';

import '../stylesheets/common/day.scss';
import '../stylesheets/common/flex.scss';
import '../stylesheets/common/font.scss';
import TimeScheduleModal from "./TimelineScheduleModal";
import TimeCell from './TimeCell';
import DailyScheduleService from '../util/DailyScheduleService';
import TimelineCellUtil from '../util/timelineCellUtil';
import makeTwoDigits from "../util/arrangeNumber";

export default class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: undefined,
      month: undefined,
      day: undefined,
      tasks: props.tasks,
      cells: new Array(24 * 4).fill(0), // cells containing task ids associated with each cell
      schedules: new Map(),

      // the below state params are for modifying schedule,
      // so it has only one target task start/end/title/id
      isModalOpen: false,
      targetScheduleId: '',
      targetTaskTitle: '',
      targetTaskStart: 0,
      targetTaskEnd: 0,
    }
    this.service = new DailyScheduleService();

    this.initialSchedule = this.initialSchedule.bind(this);
    this.scheduleTask = this.scheduleTask.bind(this);
    this.handleOnEditClick = this.handleOnEditClick.bind(this);
    this.handleOnDeleteClick = this.handleOnDeleteClick.bind(this);
    this.handleOnCloseDialog = this.handleOnCloseDialog.bind(this);
    this.taskTitle = this.taskTitle.bind(this);
    this.taskId = this.taskId.bind(this);
    this.isStartIndex = this.isStartIndex.bind(this);
    this.isEndIndex = this.isEndIndex.bind(this);
    this.startIndex = this.startIndex.bind(this);
  }

  componentWillReceiveProps(props) {
    // todo this is not recommended maybe
    // https://reactjs.org/docs/react-component.html#shouldcomponentupdate
    if (this.state.year === undefined) {
      this.initialScheduleFetch(props.year, props.month, props.day);

      this.setState({
        year: props.year,
        month: props.month,
        day: props.day,
      });
      return;
    }

    let oldLength = this.props.tasks.length;
    let diff = props.tasks.slice(oldLength);

    this.initialSchedule(diff, props);
  }

  initialScheduleFetch(year, month, day) {
    this.service
      .fetchSchedules(year, month, day)
      .then((res) => {
        let {schedules} = this.state;

        for (let i = 0; i < res.length; i++) {
          let response = res[i];
          let updatedSchedule = this.scheduleFromResponse(response, response.ticket_title);

          schedules.set(updatedSchedule.id, updatedSchedule);
        }
        // for schedules
        let cellsTemp = this.state.cells.slice();
        schedules.forEach((value, key) => {
          let {start_cell, end_cell} = value;

          for (let i = start_cell; i < end_cell; i++) {
            cellsTemp[i] = key;
          }
        });

        this.setState({
          schedules: schedules,
          cells: cellsTemp
        })
      })
  }

  // assign one hour worth cells as long as consecutive four block is available
  initialSchedule(tasksToAdd, props) {
    let scheduleResult = new Map();
    let temp = this.state.cells.slice();
    let {year, month, day} = this.props;

    // todo might not need this outer loop
    // because the task will be added to a schedule one by one
    for (let i = 0; i < tasksToAdd.length; i++) {
      let start = 0;
      let end = 0;
      for ( ; start < temp.length; start++) {
        if (temp[start] !== 0) continue; // the cell is assigned

        while (end < 4 && temp[start + end] === 0) {
          end++;
        }
        break;
      }

      let startString = TimelineCellUtil.calculateTimeString(start);
      let endString = TimelineCellUtil.calculateTimeString(start + end);
      let title = tasksToAdd[i].title;
      let id = tasksToAdd[i].id;
      this.service.registerSchedule(year, month, day, startString, endString, id, title)
        .then((res) => {
          let updatedSchedule = this.scheduleFromResponse(res, title);
          let {id, start_cell, end_cell} = updatedSchedule;
          scheduleResult.set(id, updatedSchedule);

          let schedulesTemp = this.copySchedules(this.state.schedules);
          scheduleResult
            .forEach((value, key) => schedulesTemp.set(key, value));

          // update the cells according to the schedules
          let cellsTemp = this.state.cells.slice();
          for (let i = start_cell; i < end_cell; i++) {
            cellsTemp[i] = id;
          }

          this.setState({
            tasks: props.tasks,
            schedules: schedulesTemp,
            cells: cellsTemp
          })
        })
        .catch(error => console.log(error));
    }
  }

  scheduleTask({start /* ex: 08:15 */, end}) {
    if (start === undefined || start.length === 0) return;
    if (end === undefined || end.length === 0) return;

    let {cells, targetScheduleId, targetTaskStart, targetTaskEnd, targetTaskTitle} = this.state;
    let startCell = TimelineCellUtil.convertIntoCellIndexFrom(start);

    if (cells[startCell] !==  0 && cells[startCell] !== targetScheduleId) {
      // the start time is already taken
      return;
    }

    let {year, month, day} = this.props;
    let targetTaskId = this.state.schedules.get(targetScheduleId).task_id;
    this.service
      .updateSchedule(year, month, day, targetScheduleId, targetTaskId, start, end)
      .then((res) => {
        let cellClone = cells.slice();

        // undo the previous time cell
        let prevTaskStart = TimelineCellUtil.convertIntoCellIndexFrom(targetTaskStart);
        let prevTaskEnd = TimelineCellUtil.convertIntoCellIndexFrom(targetTaskEnd);
        for (let i = prevTaskStart; i < prevTaskEnd; i++) {
          cellClone[i] = 0;
        }

        let updatedSchedule = this.scheduleFromResponse(res, targetTaskTitle);
        let {id, start_cell, end_cell} = updatedSchedule;

        let schedulesTemp = this.copySchedules(this.state.schedules);
        schedulesTemp.set(id, updatedSchedule);

        // update the time cell
        for (let i = start_cell; i < end_cell; i++) {
          cellClone[i] = id;
        }

        this.setState({
          cells: cellClone,
          schedules: schedulesTemp,
          isModalOpen: false,
          targetScheduleId: '',
          targetTaskTitle: '',
          targetTaskStart: 0,
          targetTaskEnd: 0,
        })
      })
      .catch((err) => console.log(err));
  }

  copySchedules(schedules) {
    let schedulesTemp = new Map();
    schedules.forEach((v, k) => {
      schedulesTemp.set(k, JSON.parse(JSON.stringify(v)));
    });

    return schedulesTemp;
  }

  scheduleFromResponse(res, taskTitle) {
    let startString = this.timeStringify(res.start_date);
    let endString = this.timeStringify(res.end_date);

    let startCell = TimelineCellUtil.convertIntoCellIndexFrom(startString);
    let endCell = TimelineCellUtil.convertIntoCellIndexFrom(endString);

    return {
      id: res._id,
      start_cell: startCell,
      end_cell: endCell,
      start_time: startString,
      end_time: endString,
      task_id: res.ticket,
      task_title: taskTitle,
   };
  }

  timeStringify(dateString) {
    let date = new Date(dateString);
    let string = date.toLocaleTimeString();
    let string_split = string.split(":");

    let hour = makeTwoDigits(string_split[0]);
    let min = string_split[1];

    return hour + ":" + min;
  }

  handleOnDeleteClick({startIndex}) {
    // get the task from the tasks by using the startIndex
    let {cells, year, month, day, schedules} = this.state;
    let scheduleId = cells[startIndex];

    this.service
      .deleteSchedule(year, month, day, scheduleId)
      .then((res) => {
        let scheduleRemoved = schedules.get(scheduleId);
        let {start_cell, end_cell} = scheduleRemoved;
        let cellTemp = cells.slice();

        // delete from cell
        for (let i = start_cell; i < end_cell; i++) {
          cellTemp[i] = 0;
        }

        // delete from schedules
        let schedulesTemp = this.copySchedules(this.state.schedules);
        schedulesTemp.delete(scheduleId);

        this.setState({
          schedules: schedulesTemp,
          cells: cellTemp
        });
        this.props.onDeleteClick({taskId: scheduleId})
      })
      .catch((err) => console.log(err));

  }

  handleOnEditClick({startIndex}) {
    // get the task from the tasks by using the startIndex
    let {cells, schedules} = this.state;
    let scheduleId = cells[startIndex];
    let schedule = schedules.get(scheduleId);

    let startTime = TimelineCellUtil.calculateTimeString(schedule.start_cell);
    let endTime = TimelineCellUtil.calculateTimeString(schedule.end_cell);

    // show the dialog
    this.setState({
      isModalOpen: true,
      targetScheduleId: scheduleId,
      targetTaskTitle: schedule.task_title,
      targetTaskStart: startTime,
      targetTaskEnd: endTime,
    })
  }

  handleOnCloseDialog() {
    this.setState({
      isModalOpen: false,
    })
  }

  taskTitle(taskId) {
    let {schedules} = this.state;

    let schedule = schedules.get(taskId);
    return schedule === undefined ? undefined : schedule.task_title;
  }

  taskId(scheduleId) {
    let {schedules} = this.state;

    let schedule = schedules.get(scheduleId);
    return schedule === undefined ? undefined : schedule.task_id;
  }

  isEndIndex(scheduleId, cellIndex) {
    let {schedules} = this.state;

    let schedule = schedules.get(scheduleId);
    return schedule === undefined ? false : schedule.end_cell === cellIndex;
  }

  isStartIndex(scheduleId, cellIndex) {
    let {schedules} = this.state;

    let schedule = schedules.get(scheduleId);
    return schedule === undefined ? false : schedule.start_cell === cellIndex;
  }

  startIndex(scheduleId) {
    let {schedules} = this.state;

    let schedule = schedules.get(scheduleId);
    return schedule === undefined ? undefined : schedule.start_cell;
  }

  render() {
    console.log("rendering");
    console.log(this.state.cells);
    return (
      <div className={'margin-m'}>
        <div className={'flex align-center-vertical'}>
          <h1>Timeline</h1>
        </div>

        {this.state.cells.map((value, i) => (

          <TimeCell
            index={i}
            isOccupied={value !== 0}
            startIndex={this.startIndex(value)}
            isEnd={this.isEndIndex(value, i)}
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
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,

  onDeleteClick: PropTypes.func.isRequired
}

