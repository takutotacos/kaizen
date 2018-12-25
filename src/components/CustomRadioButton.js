import React from 'react';
import PropTypes from 'prop-types';
import '../stylesheets/custom_radio_button.scss'
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/margin.scss'

export default class CustomRadioButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      yourPick: ''
    }
  }
  render() {
    let choices = this.props.choices || [];
    let colors = this.props.choiceColors;
    let choiceName = this.props.choiceName;

    const options = choices.map((loan, key) => {
      const isCurrent = this.props.pick === loan;
      return (
        <div
          key={key}
          className={'margin-r-m'}
        >
          <label
            for={`${choiceName}[${loan}]`}
            style={{
              backgroundColor: `${colors[key]}`,
              color: 'white',
              padding: '6px',
              borderRadius: '18px',
              fontSize: '14px'
            }}
            className={isCurrent ? "selected" : ""}
          >
            <input
              type="radio"
              name={choiceName}
              id={`${choiceName}[${loan}]`}
              value={loan}
              style={{
                display: 'none'
              }}
              onClick={() => this.handleRadio(loan)}
            />
            {loan}
          </label>
        </div>
      )
    })
    return (
      <div className="flex">
        {options}
      </div>
    )
  }
  handleRadio = (value) => {
    this.props.handleOnChanged(value);
  }
}

CustomRadioButton.propTypes = {
  choices: PropTypes.array.isRequired,
  choiceColors: PropTypes.arrayOf(String).isRequired,
  choiceName: PropTypes.string.isRequired,
  handleOnChanged: PropTypes.func.isRequired,
  pick: PropTypes.string.isRequired
}
