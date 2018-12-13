import TaskService from '../util/TaskService';
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/list.scss'
import '../stylesheets/common/margin.scss'
import '../stylesheets/common/padding.scss'
import '../stylesheets/common/font.scss'

let React = require('react');
let PropTypes = require('prop-types');

class TaskItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task,
    }

    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  handleOnSelect = () => {
    let {task} = this.state;
    let {id, title} = task;

    this.props.handleOnSelect(id, title);
  };

  render() {
    let {task} = this.state;

    return (
      <li className={'list-item margin-s padding-s flex'} key={task.id}>
        <div className={'flex direction-column expanded'}>
          <p className={'font-bold font-large'}>{task.title}</p>

          <div className={'flex'}>
            <div>Time necessary:
              <span className={'margin-l-s'}>{task.time}</span>
            </div>

            <div className={'margin-rl-s'}>Status:
              <span className={'font-red margin-l-s'}>{task.status['label']}</span>
            </div>

            <div className={'margin-rl-s'}>Importance:
              <span className={'font-red margin-l-s'}>{task.importance['label']}</span>
            </div>

            <div className={'margin-rl-s'}>Urgency:
              <span className={'font-red margin-l-s'}>{task.urgency['label']}</span>
            </div>
          </div>
        </div>

        <div className={'flex direction-column align-center'}>
          <button
            className={'btn btn-primary btn-sm'}
            onClick={this.handleOnSelect}
          >
            Schedule
          </button>
        </div>
      </li>
    )
  }
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  handleOnSelect: PropTypes.func.isRequired,
}

export default class DailyScheduleTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    }
    this.service = new TaskService();
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  componentDidMount() {
    this.service.fetchAll()
      .then((data) => {
        this.setState({
          tasks: data
        })
      })
      .catch((msg) => {
        alert(msg);
      })
  }

  handleOnSelect = (id, title) => {
    this.props.handleTaskScheduled({id, title})
    // let the day schedule.js know the choice
  }

  render() {
    return (
      <div>
        <h1>Task List</h1>

        <ul className={'task-list list-parent padding-xs'}>
          {this.state.tasks.map((task) =>
            <TaskItem task={task} handleOnSelect={this.handleOnSelect}/>
          )}
        </ul>

      </div>
    )
  }
};

DailyScheduleTasks.propTypes = {
  handleTaskScheduled: PropTypes.func.isRequired,
}
