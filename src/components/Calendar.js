import React from 'react';
import dateFns from 'date-fns';
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/font.scss'
import '../stylesheets/common/margin.scss'
import '../stylesheets/common/list.scss'
import GoalService from '../util/GoalService';
import CustomModal from './CustomModal';
import Checkbox from "./Checkbox";

let weekString = require('../util/DateUtil').weekString;

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      month: dateFns.format(new Date(), 'MM'),
      year: dateFns.format(new Date(), 'YYYY'),
      isModalOpen: false,
      content_goal_week: '',
      weekly_goals: {}
    };

    this.service = new GoalService()
  }

  componentDidMount() {
    this.service.getWeeklyForMonth(this.state.year, this.state.month)
      .then((res) => {
        this.setState({
          weekly_goals: res
        })
      })
      .catch((err) => {
        console.log('error occurred');
      })
  }

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className={'header row flex-middle'}>
          <div className={'col col-start'} onClick={this.prevMonth}>
          <div className={'icon'}>
            chevron_left
          </div>
        </div>

        <div className={'col col-center'}>
          <span>
            {dateFns.format(this.state.currentMonth, dateFormat)}
          </span>
        </div>

        <div className={'col col-end'} onClick={this.nextMonth}>
          <div className={'icon'}>
            chevron_right
          </div>
        </div>
      </div>
    )
  }

  renderDays() {
    const dateFormat = 'dddd';
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={'col col-center'} key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    days.push(
      <div className={'col col-center col-goal'} key={7}>
        Goal
      </div>
    );

    return <div className={'days row'}>{days}</div>;
  }

  renderCells() {
    const {currentMonth, selectedDate, weekly_goals} = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(currentMonth);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = 'D';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';
    let week = 1;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? 'disabled'
                : dateFns.isSameDay(day, selectedDate)
                ? 'selected' : ''}`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className={'number'}>{formattedDate}</span>
            <span className={'bg'}>{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      const weekClone = week;

      let goals = [];
      if (weekly_goals[week] !== undefined &&
        weekly_goals[week].length !== 0) {
        weekly_goals[week].forEach((g) => {
          let classForSpan = 'margin-l-s font-small font-bold';
          classForSpan += g.completed ? ' text-strike-through' : '';

          goals.push(
            <div key={g._id} className={'margin-b-s'}>
              <Checkbox checked={g.completed} name={g._id} onChange={(event) => this.onGoalItemClick(g, event)}/>
              <span className={classForSpan}>{g.content}</span>
            </div>
          );
        });
      }

      days.push(
        <div className={'col goal cell scroll-vertical'}
             key={`week_${week}`}
        >
          <span className={'number'}>{`week ${week}`}</span>
          {goals}
          <a className={'font-small font-bold'} href={'#'} onClick={() => this.onGoalClick(weekClone)}>Add goal</a>
        </div>
      );

      rows.push(
        <div className={'row'} key={day}>
          {days}
        </div>
      );

      days = [];
      week++;
    }

    return <div className={'body'}>{rows}</div>
  }

  onDateClick = (date) => {
    let year = dateFns.format(date, 'YYYY');
    let month = dateFns.format(date, 'MM');
    let day = dateFns.format(date, 'DD');
    this.props.history.push(`/schedule/${year}/${month}/${day}`);
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  onGoalClick = (w) => {
    this.setState({
      isModalOpen: true,
      content_goal_week: w
    })
  };

  onRequestClose = () => {
    this.setState({
      isModalOpen: false
    })
  }

  onGoalSubmit = (goal) => {
    this.service
      .postGoalWeekly(this.state.year, this.state.month, this.state.content_goal_week, goal )
      .then((res) => {
        let modified_goals = this.state.weekly_goals;
        modified_goals[res.data.week].push(res.data);

        this.setState({
          isModalOpen: false,
          weekly_goals: modified_goals,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onGoalItemClick = (goal, e) => {
    this.service.patchGoalWeekly(goal._id, goal.content, !goal.completed)
      .then((res) => {
        let goals = this.state.weekly_goals;
        let updatedGoal = res.data;

        for (let i = 0; i < goals[updatedGoal.week].length; i++) {
          if (goals[updatedGoal.week][i]._id === updatedGoal._id) {
            goals[updatedGoal.week][i] = updatedGoal;
          }
        }

        this.setState({
          weekly_goals: goals
        })
      })
      .catch((e) => {
        console.log('failed patching');
      })
  };

  render() {
    return (
      <div className={'calendar'}>
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        <CustomModal
          modalIsOpen={this.state.isModalOpen}
          onRequestClose={this.onRequestClose}
          title={dateFns.format(this.state.currentMonth, 'MMMM') + ' ' + weekString(this.state.content_goal_week)}
          onSubmitGoal={(v) => this.onGoalSubmit(v)}
        />
      </div>
    );
  }
}

export default Calendar;