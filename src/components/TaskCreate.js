import React from 'react';
import Select from 'react-select';
import TaskService from '../util/TaskService';

const statusOptions = [
  {value: 'wip', label: 'Work In Progress'},
  {value: 'done', label: 'Completed'},
  {value: 'waiting', label: 'Waiting'},
]

const importanceOptions = [
  {value: 'low', label: 'Low'},
  {value: 'medium', label: 'Medium'},
  {value: 'high', label: 'High'},
]

const urgencyOptions = [
  {value: 'low', label: 'Low'},
  {value: 'medium', label: 'Medium'},
  {value: 'high', label: 'High'},
]

class TaskCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      time: '',
      status: '',
      importance: '',
      urgency: '',
      existing: false
    }
    this.service = new TaskService();

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDisc = this.handleChangeDisc.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeImportance = this.handleChangeImportance.bind(this);
    this.handleChangeUrgency = this.handleChangeUrgency.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChangeStatus(selectedOption) {
    this.setState({
      status: selectedOption
    })
  }

  handleChangeImportance(selectedOption) {
    this.setState({
      importance: selectedOption,
    })
  }

  handleChangeUrgency(selectedOption) {
    this.setState({
      urgency: selectedOption
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.service.create(
      this.state.title,
      this.state.description,
      this.state.time,
      this.state.status['value'],
      this.state.importance['value'],
      this.state.urgency['value'],
      this.handleSuccess,
      this.handleError
    );
  }

  handleSuccess() {
    alert("success!");
  }

  handleError(err) {
    alert("error");
    console.log(err);
  }

  render() {
    return (
      <div className={'container'}>
        <form onSubmit={this.handleSubmit}>
          <div className={'margin-tb-s'}>
            <label>Title:
              <input type={'text'} value={this.state.title} onChange={this.handleChangeTitle}
                     className={'form-control'}/>
            </label>
          </div>

          <div className={'margin-tb-s'}>
            <label>Description:
              <textarea value={this.state.description} onChange={this.handleChangeDisc}
                     className={'form-control'}/>
            </label>
          </div>

          <div className={'margin-tb-s'}>
            <label>Time Needed(Hour):
              <input type={'number'} value={this.state.time} onChange={this.handleChangeTime}
                     className={'form-control'}/>
            </label>
          </div>

          <div className={'margin-tb-s'}>
            <label>Status:
              <Select value={this.state.status}
                      onChange={this.handleChangeStatus}
                      options={statusOptions}/>
            </label>
          </div>

          <div className={'margin-tb-s'}>
            <label>Importance:
              <Select value={this.state.importance}
                      onChange={this.handleChangeImportance}
                      options={importanceOptions}/>
            </label>
          </div>

          <div className={'margin-tb-s'}>
            <label>Urgency:
              <Select value={this.state.urgency}
                      onChange={this.handleChangeUrgency}
                      options={urgencyOptions}/>
            </label>
          </div>
          <div>
            <input type={'submit'} value={'Create'} className={'btn btn-primary'}/>
          </div>
        </form>
      </div>
    );
}
}

export default TaskCreate;