import PropTypes from 'prop-types';
import React from 'react';

import '../stylesheets/common/day.scss';
import '../stylesheets/common/flex.scss';
import '../stylesheets/common/font.scss';

export default class TimeCell extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnDeleteClick = this.handleOnDeleteClick.bind(this);
    this.handleOnEditClick = this.handleOnEditClick.bind(this);
  }

  handleOnEditClick() {
    if (!this.props.isOccupied) {
      return;
    }

    this.props.onEditClick(this.props);
  }

  handleOnDeleteClick() {
    if (!this.props.isOccupied) {
      return;
    }

    this.props.onDeleteClick(this.props);
  }

  render() {
    let {isOccupied, startIndex, isEnd, index, title} = this.props;

    let oneHourChunk = index % 4 === 3;
    let borderLine = oneHourChunk ? '1px black solid' : '';
    let backgroundColor = isOccupied ? 'beige' : 'blue';
    let isStartCell = startIndex === index;

    // when occupied, only the end cell needs border line
    borderLine = isOccupied && !isEnd ? '' : borderLine;
    return (
      <div
        className={'flex'}
        style={{
          padding: '0px 12px',
          backgroundColor: backgroundColor,
          height: '15px',
          borderBottom: borderLine
        }}
      >
        {oneHourChunk &&
        (<div
          style={{
            color: 'black',
            fontWeight: 'bold'
          }}
        >
          {parseInt(index / 4) + 1}:00
        </div>)
        }
        {isStartCell &&
        (<div className={'expanded font-middle'}>
          {title}
        </div>)
        }

        {isStartCell &&
        (<div
          onClick={this.handleOnEditClick}
          className={'btn btn-sm'}>
          edit
        </div>)
        }

        {isStartCell &&
        (<div
          onClick={this.handleOnDeleteClick}
          className={'btn btn-sm'}>
          x
        </div>)
        }
      </div>
    );
  }
}

TimeCell.propTypes = {
  index: PropTypes.number.isRequired,
  isOccupied: PropTypes.bool.isRequired,
  startIndex: PropTypes.number, // index of the start cell
  isEnd: PropTypes.bool, // index of the start cell
  title: PropTypes.string.isRequired,

  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

