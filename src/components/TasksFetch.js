import TaskService from "../util/TaskService";
import '../stylesheets/flex.scss'
import '../stylesheets/list.scss'
import '../stylesheets/margin.scss'
import '../stylesheets/padding.scss'
import '../stylesheets/font.scss'

let React = require('react');
let PropTypes = require('prop-types');

let TaskList= (props) => {
  return (
    <ul className={'task-list list-parent padding-s'}>
      {props.tasks.map((task) => {
        return (
          <li className={'list-item margin-s padding-s'} key={task.id}>
            <p className={'font-bold font-large'}>{task.title}</p>

            <div className={'flex'}>
              <p>Time necessary:
                <span className={'margin-l-s'}>{task.time}</span>
              </p>
              <div className={'margin-rl-s'}>Status:
                <span className={'font-red margin-l-s'}>{task.status}</span>
              </div>

              <div className={'margin-rl-s'}>Importance:
                <span className={'font-red margin-l-s'}>{task.importance}</span>
              </div>

              <div className={'margin-rl-s'}>Urgency:
                <span className={'font-red margin-l-s'}>{task.urgency}</span>
              </div>
            </div>
          </li>
        )})}
    </ul>
  )
}

TaskList.protoTypes = {
  tasks: PropTypes.array.isRequired
}

class TasksFetch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    }
    this.service = new TaskService();
  }

  componentDidMount() {
    this.service.fetchAll()
      .then((data) => {
        this.setState({
          tasks: data
        })
      })
      .catch((msg) => {
        console.log(msg);
        alert(msg);
      })
  }

  render() {
    return (
      <div>
        <h1>Task List</h1>
        <TaskList tasks={this.state.tasks}/>
      </div>
    )
  }
}

export default TasksFetch;
