import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

import {HOUR_IN_PIXELS, MINUTE_IN_PIXELS} from "./TimeSlot";
import TimeSlot from './TimeSlot';
import positionInDay from '../util/positionInDay';
import styles from '../stylesheets/Day.css';
import '../stylesheets/common/day.scss';
import toDate from '../util/toDate';
import hasOverlap from "../util/hasOverlap";
import makeTwoDigits from "../util/arrangeNumber";

const ROUND_TO_NEAREST_MINS = 15;

export default class Day extends PureComponent {
  constructor({initialSelections}) {
    super();
    this.state = {
      index: undefined,
      selections: initialSelections,
    };

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleSizeChangeStart = this.handleItemModification.bind(this, 'end');
    this.handleMoveStart = this.handleItemModification.bind(this, 'both');
    this.handleDelete = this.handleDelete.bind(this);
    this.handleMouseTargetRef = element => (this.mouseTargetRef = element);
  }

  findSelectionAt(date) {
    // todo the argument date is not necessary because there is only one date possible
    // date is here since i took this code from sample code and modified only a little bit
    const {selections} = this.state;
    console.log('the selections are ');
    console.log(selections);
    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i];
      if (selection.start.getTime() <= date.getTime()
        && date.getTime() < selection.end.getTime()) {
        console.log('start is ' + selection.start);
        return true;
      }
    }
    return false;
  }

  relativeY(pageY, rounding = ROUND_TO_NEAREST_MINS) {
    const {top} = this.mouseTargetRef.getBoundingClientRect();
    let realY = pageY - top - document.body.scrollTop;
    realY += this.props.hourLimits.top; // offset top blocker
    const snapTo = (rounding / 60) * HOUR_IN_PIXELS;
    return Math.floor(realY / snapTo) * snapTo;
  }

  handleDelete({start, end}) {
    this.setState(({selections}) => {
      for (let i = 0; i < selections.length; i++) {
        if (selections[i].start === start && selections[i].end === end) {
          selections.splice(i, 1);
          return {selections: selections.slice(0)};
        }
      }

      return {};
    })
  }

  handleItemModification(edge, {start, end}, {pageY, currentTarget}) {
    const position = this.relativeY(pageY);
    this.setState(({selections}) => {
      for (let i = 0; i < selections.length; i++) {
        if (selections[i].start === start && selections[i].end === end) {
          return {
            edge,
            index: i,
            lastKnownPosition: position,
            minLengthInMinutes: 30,
            target: currentTarget,
          };
        }
      }

      return {};
    })
  }

  handleTouchStart(e) {
    this.touch = {
      startY: e.touches[0].pageY,
      startX: e.touches[0].pageX
    }
  }

  handleTouchMove(e) {
    this.touch.currentY = e.touches[0].pageY;
    this.touch.currentX = e.touches[0].pageX;
  }

  handleTouchEnd() {
    const {startY, currentY, startX, currentX} = this.touch;
    if (Math.abs(startX - (currentX || startX)) < 20
      && Math.abs(startY - (currentY || startY)) < 20) {
      this.handleMouseDown({pageY: startY});
      setTimeout(() => {
        this.handleMouseUp();
      });
    }
    this.touch = undefined;
  }

  handleMouseDown(e) {
    const {timeZone} = this.props;
    const position = this.relativeY(e.pageY, 60);
    const dateAtPosition = toDate(this.props.date, position, timeZone);

    if (this.findSelectionAt(dateAtPosition)) {
      return;
    }

    let end = toDate(this.props.date, position + HOUR_IN_PIXELS, timeZone);
    end = hasOverlap(this.state.selections, dateAtPosition, end) || end;

    if (end - dateAtPosition < 1800000) {
      // slot is less than 30 mins
      return;
    }

    this.setState(({selections}) => ({
      edge: 'end',
      index: selections.length,
      lastKnownPosition: position,
      minLengthInMinutes: 60,
      selections: selections.concat([{
        start: dateAtPosition,
        end,
      }]),
    }));
  }

  hasReachedTop({offsetTop}) {
    const {hourLimits} = this.props;
    return offsetTop <= hourLimits.top;
  }

  hasReachedBottom({offsetTop, offsetHeight}) {
    const {hourLimits} = this.props;
    return (offsetTop + offsetHeight) >= hourLimits.bottom;
  }

  handleMouseMove({pageY}) {
    if (typeof this.state.index === 'undefined') {
      return;
    }

    const {date, timeZone} = this.props;
    const position = this.relativeY(pageY);
    this.setState(({minLengthInMinutes, selections, edge, index, lastKnownPosition, target}) => {
      const selection = selections[index];
      let newMinLength = minLengthInMinutes;
      if (edge === 'both') {
        // move element
        const diff = toDate(date, position, timeZone).getTime() -
          toDate(date, lastKnownPosition, timeZone).getTime();
        let newStart = new Date(selection.start.getTime() + diff);
        let newEnd = new Date(selection.end.getTime() + diff);

        if (hasOverlap(selection, newStart, newEnd, index)) {
          return {};
        }

        if (this.hasReachedTop(target) && diff < 0) {
          // if has reached top blocker and it is going upwards, fix the newStart.
          newStart = selection.start;
        }

        if (this.hasReachedBottom(target) && diff > 0) {
          // if has reached bottom blocker and it is going downwards, fix.
          newEnd = selection.end;
        }

        selection.start = newStart;
        selection.end = newEnd;
      } else {
        // stretch element
        const startPos = positionInDay(date, selection.start, timeZone);
        const minPos = startPos + (minLengthInMinutes * MINUTE_IN_PIXELS);

        if (minPos < position) {
          // we've exceeded 60 mins now, allow smaller
          newMinLength = 60;
        }
        const newEnd = toDate(date, Math.max(minPos, position), timeZone);
        if (hasOverlap(selections, selection.start, newEnd, index)) {
          // Collision! let
          return {};
        }
        selection.end = newEnd;
      }
      return {
        lastKnownPosition: position,
        minLengthInMinutes: newMinLength,
        selections,
      };
    });
  }

  handleMouseUp() {
    if (typeof this.state.index === 'undefined') {
      return;
    }

    this.setState({
      edge: undefined,
      index: undefined,
      lastKnownPosition: undefined,
      minLengthInMinutes: undefined,
    });
  }

  render() {
    const {
      timeConvention,
      timeZone,
      touchToDeleteSelection,
      hourLimits,
    } = this.props;

    const {selections, index} = this.state;
    const classes = [styles.component];

    let timeCells = [];
    for (let i = 0; i < 24; i++) {
      timeCells.push(i + 1);
    }

    return (
      <div
        style={{
          height: HOUR_IN_PIXELS * 24,
        }}
      >
        {timeCells.map((i) => (
          <div className={'flex align-center'}>
            <div className={'timeline_side_column'}/>
            <div className={'flex timeline_main_column '}>
              <div className={'time_letter'}>{makeTwoDigits(i)}</div>
              <div className={'time_cell'}/>
            </div>
            <div className={'timeline_side_column'}/>
          </div>
        ))}

        <div className={'flex align-center'} style={{zIndex: -1}}>
          <div className={'timeline_side_column'}/>
          <div
            className={'timeline_main_column'}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseMove={this.handleMouseMove}
            onMouseOut={this.handleMouseUp}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            ref={this.handleMouseTargetRef}
            style={{
              position: 'absolute',
              zIndex: 1,
              height: HOUR_IN_PIXELS * 24,
            }}
          >
          </div>
          <div className={'timeline_side_column'}/>
        </div>

        {selections.map(({start, end}, i) => (
          <TimeSlot
            key={i}
            timeConvention={timeConvention}
            timeZone={timeZone}
            start={start}
            end={end}
            onSizeChangeStart={this.handleSizeChangeStart}
            onMoveStart={this.handleMoveStart}
            onDelete={this.handleDelete}
            touchToDelete={touchToDeleteSelection}
          />
        ))}
      </div>
    );
  }
}

Day.propTypes = {
  hourLimits: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    bottomHeight: PropTypes.number,
    difference: PropTypes.number,
  }).isRequired,
  timeConvention: PropTypes.oneOf(['12h', '24h']),
  timeZone: PropTypes.string.isRequired,

  date: PropTypes.instanceOf(Date).isRequired,
  index: PropTypes.number.isRequired,
  initialSelections: PropTypes.arrayOf(PropTypes.shape({ // the tasks
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date)
  })),
  touchToDeleteSelection: PropTypes.bool,
}

Day.defaultProps = {
  touchToDeleteSelection: 'ontouchstart' in window,
}
