import Modal from "react-modal";
import React from "react";
import PropTypes from 'prop-types';
import '../stylesheets/calendar.scss';

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
export default class TimeScheduleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: props.start,
      end: props.end,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      start: props.start,
      end: props.end,
    })
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({[name]: value});
  }

  onSubmit = () => {
    this.props.onChangeSchedule(this.state);
  }

  render() {
    let {modalIsOpen, onRequestClose, title} = this.props;
    let {start, end} = this.state;

    return (
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={onRequestClose}
          style={customStyles}
          contentLabel={"Example Modal"}>

          <div className={'flex align-center-vertical'}>
            <div className={'font-middle font-bold'}>{title}</div>
            <a className={'margin-l-s'} href={'#'} onClick={onRequestClose}>close</a>
          </div>
          <form>
            <div>
              <label> Start</label>
              <input
                type={'time'}
                name={'start'}
                step={900}
                value={start}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <label> End</label>
              <input
                type={'time'}
                name={'end'}
                step={900}
                value={end}
                onChange={this.handleChange}/>
            </div>
            <div className={'margin-l-s btn btn-primary btn-sm'} onClick={this.onSubmit}>submit</div>
          </form>
        </Modal>
      </div>
    )
  }
}

TimeScheduleModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,

  onRequestClose: PropTypes.func.isRequired,
  onChangeSchedule: PropTypes.func.isRequired
};
