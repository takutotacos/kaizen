import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import momentTimezone from 'moment-timezone';
import styles from '../stylesheets/TimeSlot.css';
import positionInDay from '../util/positionInDay';

export const HOUR_IN_PIXELS = 50;
export const MINUTE_IN_PIXELS = HOUR_IN_PIXELS / 60;
const BOTTOM_GAP = MINUTE_IN_PIXELS * 10;

export default class TimeSlot extends PureComponent {
  constructor() {
    super();
    this.handleResizerMouseDown = this.handleResizerMouseDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.preventMove = e => e.stopPropagation();
  }

  componentDidMount() {
    this.creationTime = new Date().getTime();
  }

  handleDelete(event) {
    if (new Date().getTime() - this.creationTime < 500) {
      // Just created. Ignore this event, as it's likely coming from the same
      // click event that created it.
      return;
    }

    event.stopPropagation();
    const {onDelete, end, start} = this.props;
    onDelete({end, start}, event);
  }

  handleResizerMouseDown(event) {
    event.stopPropagation();
    const {onSizeChangeStart, end, start} = this.props;
    onSizeChangeStart({end, start}, event);
  }

  handleMouseDown(event) {
    const {onMoveStart, end, start} = this.props;
    onMoveStart({end, start}, event);
  }

  formatTime(date) {
    const {timeConvention, timeZone, frozen} = this.props;
    const m = momentTimezone.tz(date, timeZone);
    if (timeConvention === '12h') {
      if (frozen && m.minute() === 0) {
        return m.format('ha');
      }
      return m.format('h:mma');
    }

    if (frozen && m.minute() === 0) {
      return m.format('H');
    }

    return m.format('H:mm');
  }

  timespan() {
    const {start, end} = this.props;
    return [this.formatTime(start), '-', this.formatTime(end)].join('');
  }

  render() {
    const {
      date,
      start,
      end,
      frozen,
      width,
      offset,
      timeZone,
      title,
      touchToDelete
    } = this.props;

    const top = positionInDay(date, start, timeZone);
    const bottom = positionInDay(date, end, timeZone);

    const height = Math.max(
      bottom - top - (frozen ? BOTTOM_GAP : 0),
      1,
    );
    const classes = [styles.component];
    if (frozen) {
      classes.push(styles.push);
    } else {
      classes.push(styles.active);
    }

    const style = { top, height }
    if (typeof width !== 'undefined' && typeof offset !== 'undefined') {
      style.width = `calc(${width * 100}% - 5px)`;
      style.left = `${offset * 100}%`;
    }

    return (
      <div
        className={classes.join(' ')}
        onMouseDown={frozen || touchToDelete ? undefined : this.handleMouseDown}
        onClick={frozen || !touchToDelete ? undefined : this.handleDelete}
      >
        <div
          className={styles.title}
          style={{
            lineHeight: `${(MINUTE_IN_PIXELS * 30) - (BOTTOM_GAP / 2)}px`
          }}
        >
          {title && (
            <span>
              {title}
              <br/>
            </span>
          )}
          {this.timespan()}
        </div>
        {!frozen && !touchToDelete && (
          <div>
            <div
              className={styles.handle}
              onMouseDown={this.handleResizerMouseDown}
            >
              ...
            </div>
            <button
              className={styles.delete}
              onClick={this.handleDelete}
              onMouseDown={this.preventMove}
            >
              x
            </button>
          </div>
        )}
      </div>
    );
  }
}

TimeSlot.propTypes = {
  touchToDelete: PropTypes.bool,
  timeConvention: PropTypes.oneOf(['12', '24']),
  timeZone: PropTypes.string.isRequired,

  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string,
  frozen: PropTypes.bool,

  onSizeChangeStart: PropTypes.func,
  onMoveStart: PropTypes.func,
  onDelete: PropTypes.func,

  // Props used to signal overlap
  width: PropTypes.number,
  offset: PropTypes.number
};

TimeSlot.defaultProps = {
  touchToDelete: false,
};
