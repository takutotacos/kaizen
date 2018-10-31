import TaskService from "../util/TaskService";
import '../stylesheets/flex.scss'
import '../stylesheets/list.scss'
import '../stylesheets/margin.scss'
import '../stylesheets/padding.scss'
import '../stylesheets/font.scss'

let React = require('react');
let PropTypes = require('prop-types');
let Link = require('react-router-dom').Link;

let TaskList= (props) => {
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

            <div className={'flex direction-column align-center'}>
              <Link className={'btn btn-primary btn-sm'}
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
                Edit
              </Link>
            </div>
          </li>
        )})}
    </ul>
  )
}

TaskList.protoTypes = {
  tasks: PropTypes.array.isRequired,
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
