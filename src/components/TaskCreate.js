import React from 'react';
import Select from 'react-select';
import TaskService from '../util/TaskService';
let Redirect = require('react-router-dom').Redirect;

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
      id: '',
      title: '',
      description: '',
      time: '',
      status: '',
      importance: '',
      urgency: '',
      existing: false,
      created: false
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

  componentDidMount() {
    let inheritedState = this.props.location.state;
    if (!inheritedState) return;

    this.setState({
      id: inheritedState.id,
      title: inheritedState.title,
      description: inheritedState.description,
      time: inheritedState.time,
      status: inheritedState.status,
      importance: inheritedState.importance,
      urgency: inheritedState.urgency,
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
    let id = this.state.existing ? '' : this.state.id;

    this.service.updateOrCreate(
      id,
      this.state.title,
      this.state.description,
      this.state.time,
      this.state.status['value'],
      this.state.importance['value'],
      this.state.urgency['value'],
    ).then(res => {
      // todo some feedback
      this.setState({
        created: true
      });
    }).catch(error => {
      alert(error);
    })
  }

  render() {
    if (this.state.created) {
      return <Redirect to={'/tasks'}/>
    }

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
              <textarea value={this.state.description} onChange={this.handleChangeDisc}
                     className={'form-control'}/>
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Time Needed(Hour):</label>
              <input type={'number'} value={this.state.time} onChange={this.handleChangeTime}
                     className={'form-control'}/>
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Status:</label>
              <Select value={this.state.status}
                      onChange={this.handleChangeStatus}
                      options={statusOptions}/>
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Importance:</label>
              <Select value={this.state.importance}
                      onChange={this.handleChangeImportance}
                      options={importanceOptions}/>
          </div>

          <div className={'margin-tb-s col-md-8 col-md-offset-2'}>
            <label>Urgency:</label>
              <Select value={this.state.urgency}
                      onChange={this.handleChangeUrgency}
                      options={urgencyOptions}/>
          </div>
          <div>
            <input type={'submit'} value={'Create'} className={'btn btn-primary col-md-4 col-md-offset-4'}/>
          </div>
        </form>
      </div>
    );
  }
}

export default TaskCreate;