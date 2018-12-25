import React from 'react';
import TaskService from '../util/TaskService';
import CustomRadioButton from "./CustomRadioButton";
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/margin.scss'

let Redirect = require('react-router-dom').Redirect;

const statusOptions = {
  'Work In Progress': 'wip',
  'Completed': 'done',
  'Waiting': 'waiting'
};

const importanceOptions = {
  'Low': 'low',
  'Medium': 'medium',
  'High': 'high',
}

const urgencyOptions = {
  'Low': 'low',
  'Medium': 'medium',
  'High': 'high',
}

class TaskCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      title: '',
      description: '',
      time: '',
      status: '',
      importance: '',
      urgency: '',
      existing: false,
      updated: false
    }
    this.service = new TaskService();

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDisc = this.handleChangeDisc.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeImportance = this.handleChangeImportance.bind(this);
    this.handleChangeUrgency = this.handleChangeUrgency.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    let inheritedState = this.props.location.state;
    if (!inheritedState) return;

    this.setState({
      id: inheritedState.id,
      title: inheritedState.title,
      description: inheritedState.description,
      time: inheritedState.time,
      status: inheritedState.status["label"],
      importance: inheritedState.importance["label"],
      urgency: inheritedState.urgency["label"],
      existing: true,
      label_ids: inheritedState.label_ids
    })
  }

  handleChangeTitle(event) {
    this.setState({
      title: event.target.value
    })
  }

  handleChangeDisc(event) {
    this.setState({
      description: event.target.value
    })
  }

  handleChangeTime(event) {
    this.setState({
      time: event.target.value
    })
  }

  handleChangeStatus(selected) {
    this.setState({status: selected})
  }

  handleChangeImportance(selected) {
    this.setState({importance: selected})
  }

  handleChangeUrgency(selected) {
    console.log(selected);
    this.setState({urgency: selected})
  }

  handleSubmit(event) {
    event.preventDefault();
    let id = this.state.existing ? this.state.id : '';

    this.service.updateOrCreate(
      id,
      this.state.title,
      this.state.description,
      this.state.time,
      statusOptions[this.state.status],
      importanceOptions[this.state.importance],
      urgencyOptions[this.state.urgency]
    ).then(res => {
      // todo some feedback
      this.setState({
        updated: true
      });
    }).catch(error => {
      alert(error);
    })
  }

  handleDelete() {
    this.service.delete(this.state.id)
      .then(res => {
        this.setState({
          updated: true
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.updated) {
      return <Redirect to={'/tasks'}/>
    }

    let {existing} = this.state;
    let submitText = existing ? "Update" : "Create";

    return (
      <div className={'container'}>
        <form onSubmit={this.handleSubmit}>
          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Title:</label>
              <input type={'text'} value={this.state.title} onChange={this.handleChangeTitle}
                     className={'form-control'}/>
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Description:</label>
              <textarea
                value={this.state.description}
                onChange={this.handleChangeDisc}
                className={'form-control'}
                rows={8}
              />
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Time Needed(Hour):</label>
              <input type={'number'} value={this.state.time} onChange={this.handleChangeTime}
                     className={'form-control'}/>
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Status:</label>
            <CustomRadioButton
              choices={Object.keys(statusOptions)}
              choiceColors={['red', 'blue', 'yellow']}
              choiceName={"status"}
              handleOnChanged={this.handleChangeStatus}
              pick={this.state.status}
            />
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Importance:</label>
            <CustomRadioButton
              choices={Object.keys(importanceOptions)}
              choiceColors={['red', 'blue', 'yellow']}
              choiceName={"importance"}
              handleOnChanged={this.handleChangeImportance}
              pick={this.state.importance}
            />
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Urgency:</label>
            <CustomRadioButton
              choices={Object.keys(urgencyOptions)}
              choiceColors={['red', 'blue', 'yellow']}
              choiceName={"urgency"}
              handleOnChanged={this.handleChangeUrgency}
              pick={this.state.urgency}
            />
          </div>
          <div
            className={'flex right col-md-8 col-md-offset-2'}
          >
            {existing && (
              <input
                type={'button'}
                onClick={this.handleDelete}
                className={'btn btn-danger margin-r-m'}
                value={'delete'}
              />
            )}
            <input
              type={'submit'}
              value={submitText}
              className={'btn btn-primary'}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default TaskCreate;
