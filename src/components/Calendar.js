import React from 'react';
import dateFns from 'date-fns';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import '../stylesheets/calendar.scss';
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/font.scss'
import '../stylesheets/common/margin.scss'

const customStyles = {
  content: {
    top: '40%',
    left: '40%',
    right: 'auto',
    bottom: 'auto',
    margin: '10%',
    transform: 'translate(-50%, -50%)',
    color: '#111',
    backgroundColor: 'aqua'
  }
};

Modal.setAppElement('#root');
class CustomModal extends React.Component {
  state = {
    goal: ''
  };

  handleChangeGoal = (event) => {
    event.preventDefault();
    this.setState({
      goal: event.target.value
    })
  }

  onSubmit = () => {
    this.props.onSubmitGoal(this.state.goal);
    this.setState({
      goal: ''
    })
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.modalIsOpen}
          onRequestClose={this.props.onRequestClose}
          style={customStyles}
          contentLabel={"Example Modal"}>

          <div className={'flex align-center-vertical'}>
            <div className={'font-middle font-bold'}>{this.props.title}</div>
            <a className={'margin-l-s'} href={'#'} onClick={this.props.onRequestClose}>close</a>
          </div>
          <form>
            <div className={'font-small font-bold'}>What is your goal?</div>
            <input type={'text'} size={50} value={this.state.goal} onChange={this.handleChangeGoal}/>
            <div className={'margin-l-s btn btn-primary btn-sm'} onClick={this.onSubmit}>submit</div>
          </form>
        </Modal>
      </div>
    )
  }
}

CustomModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onSubmitGoal: PropTypes.func.isRequired
};

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    isModalOpen: false,
    goalSpan: ''
  };

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
    const {currentMonth, selectedDate} = this.state;
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
      days.push(
        <div className={'col goal cell'}
             key={`week_${week}`}
             onClick={() => this.onGoalClick(weekClone)}
        >
          {`week ${week}`}
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

  onDateClick = day => {
    this.setState({
      selectedDate: day
    })
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
    console.log('week is ' + w);
    this.setState({
      isModalOpen: true,
      goalSpan: w
    })
  };

  onRequestClose = () => {
    this.setState({
      isModalOpen: false
    })
  }

  onGoalSubmit = (goal) => {
    this.setState({
      isModalOpen: false
    });
    console.log(goal);
  }

  weekString = (week) => {
    let weekNo = '';
    switch (week) {
      case 1:
        weekNo = '1st';
        break;
      case 2:
        weekNo = '2nd';
        break;
      case 3:
        weekNo = '3rd';
        break;
      default:
        weekNo = `${week}th`;
    }
    return `${weekNo} week`;
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
          title={dateFns.format(this.state.currentMonth, 'MMMM') + ' ' + this.weekString(this.state.goalSpan)}
          onSubmitGoal={(v) => this.onGoalSubmit(v)}
        />
      </div>
    );
  }
}


export default Calendar;