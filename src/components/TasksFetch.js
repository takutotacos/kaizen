import TaskService from "../util/TaskService";
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/list.scss'
import '../stylesheets/common/margin.scss'
import '../stylesheets/common/padding.scss'
import '../stylesheets/common/font.scss'
import logoEdit from '../images/baseline_edit_black_18dp.png';
import logoDelete from '../images/baseline_delete_forever_black_18dp.png';
import logoDone from '../images/baseline_done_black_18dp.png';

let React = require('react');
let PropTypes = require('prop-types');
let Link = require('react-router-dom').Link;

let TaskList = (props) => {
  return (
    <ul className={'task-list list-parent padding-xs'}>
      {props.tasks.map((task) => {
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

            <button
              className={'center-item margin-l-s'}
              style={{
                width: '20px',
                height: '20px',
                background: 'none',
                border: 'none',
              }}
            >
              <img
                src={logoDone}
                style={{
                  width: '20px',
                  height: '20px'
                }}
              />
            </button>

            <button
              className={'center-item margin-l-s'}
              onClick={() => props.handleOnDelete(task.id)}
              style={{
                width: '20px',
                height: '20px',
                background: 'none',
                border: 'none',
              }}
            >
              <img
                src={logoDelete}
                style={{
                  width: '20px',
                  height: '20px'
                }}
              />
            </button>
            <Link className={'center-item margin-l-s'}
                  to={{
                    pathname: "/task/" + task.id,
                    state: {
                      id: task.id,
                      title: task.title,
                      description: task.description,
                      time: task.time,
                      status: task.status,
                      importance: task.importance,
                      urgency: task.urgency,
                      label_ids: task.label_ids
                    }
                  }}>
              <button
                style={{
                  width: '20px',
                  height: '20px',
                  background: 'none',
                  border: 'none',
                }}
              >
                <img
                  src={logoEdit}
                  style={{
                    width: '20px',
                    height: '20px'
                  }}
                />
              </button>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

TaskList.protoTypes = {
  tasks: PropTypes.array.isRequired,
  handleOnDelete: PropTypes.func.isRequired,
  handleOnCompleted: PropTypes.func.isRequired,
};

class TasksFetch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    }
    this.service = new TaskService();
    this.handleDelete = this.handleDelete.bind(this);
    this.fetchAllTasks = this.fetchAllTasks.bind(this);
  }

  componentDidMount() {
    this.fetchAllTasks();
  }

  handleDelete(id) {
    this.service.delete(id)
      .then(() => this.fetchAllTasks())
      .catch((msg) => alert(msg));
  }

  fetchAllTasks() {
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

  render() {
    return (
      <div>
        <h1>Task List</h1>
        <TaskList
          tasks={this.state.tasks}
          handleOnDelete={this.handleDelete}
        />
      </div>
    )
  }
}

export default TasksFetch;
