let weekString = (week) => {
  let weekNo = '';
  switch (week) {
    case 1:
      weekNo = '1st';
      break;
    case 2:
      weekNo = '2nd';
      break;
    case 3:
      weekNo = '3rd';
      break;
    default:
      weekNo = `${week}th`;
  }
  return `${weekNo} week`;
};

exports.weekString = weekString;
