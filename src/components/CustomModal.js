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

export default CustomModal;