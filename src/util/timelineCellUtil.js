import makeTwoDigits from "../util/arrangeNumber";

export default class timelineCellUtil {
  static convertIntoCellIndexFrom(time /* ex: 08:15 */) {
    let start_time_split = time.split(":");
    let hour = parseInt(start_time_split[0]);

    hour *= 4; // since the hour is divided into 4. cell represents 15 min time slot

    switch (start_time_split[1]) {
      case "15":
        hour += 1;
        break;

      case "30":
        hour += 2;
        break;

      case "45":
        hour += 3;
        break;

      case "00":
      default:
    }

    return hour;
  }

  static calculateTimeString(cellIndex) {
    let startHour = cellIndex / 4;
    let startMin = cellIndex % 4;

    let minString = '';
    switch (startMin) {
      case 1:
        minString = '15';
        break;
      case 2:
        minString = '30';
        break;
      case 3:
        minString = '45';
        break;
      default:
        minString = '00';
    }

    return makeTwoDigits(startHour) + ':' + minString;
  }


}
