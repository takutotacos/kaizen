import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import momentTimezone from 'moment-timezone';
import positionInDay from '../util/positionInDay';
import '../stylesheets/time_slot.scss'
import '../stylesheets/common/flex.scss'
import '../stylesheets/common/font.scss'

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
    console.log('handle resizer mouse down');
    event.stopPropagation();
    const {onSizeChangeStart, end, start} = this.props;
    onSizeChangeStart({end, start}, event);
  }

  handleMouseDown(event) {
    console.log('handle mouse down');
    const {onMoveStart, end, start} = this.props;
    onMoveStart({end, start}, event);
  }

  formatTime(date) {
    const { timeZone } = this.props;
    const m = momentTimezone.tz(date, timeZone);

    if (m.minute() === 0) {
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
      start,
      end,
      timeZone,
      title,
    } = this.props;

    let top = positionInDay(start, timeZone);
    let bottom = positionInDay(end, timeZone);
    let height = (bottom - top);

    let bodyTop = document.body.getBoundingClientRect().top;
    let timeline_top = document.getElementsByClassName('timeline_top')[0].getBoundingClientRect().top;
    let top_with_offset = top + Math.abs(timeline_top - bodyTop);

    let {right, left} = document.getElementsByClassName('time_cell')[0].getBoundingClientRect();
    let width = right - left;
    let bodyWidth = document.body.getBoundingClientRect().width;

    return (
      <div
        className={'time_slot flex direction-column'}
        onMouseDown={this.handleMouseDown}
        style={{
          width: `${(width / bodyWidth) * 100}%`,
          marginLeft: '6%',
          position: 'absolute',
          top: top_with_offset,
          height: height,
          zIndex: 2
        }}
      >
        <div
          className={'flex'}
          style={{
            lineHeight: `${(MINUTE_IN_PIXELS * 30) - (BOTTOM_GAP / 2)}px`
          }}
        >
          <div className={'expanded font-bold font-middle'}>
            {title && (
              <span>
                {title}
                <br/>
              </span>
            )}
            {this.timespan()}
          </div>

          <button
            onClick={this.handleDelete}
            onMouseDown={this.preventMove}
          >
            x
          </button>
        </div>
        <div
          className={'center-item font-bold font-middle'}
          onMouseDown={this.handleResizerMouseDown}
        >
          ...
        </div>
      </div>
    );
  }
}

TimeSlot.propTypes = {
  timeZone: PropTypes.string.isRequired,

  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string,

  onSizeChangeStart: PropTypes.func,
  onMoveStart: PropTypes.func,
  onDelete: PropTypes.func,

  // Props used to signal overlap
  width: PropTypes.number,
  offset: PropTypes.number
};
