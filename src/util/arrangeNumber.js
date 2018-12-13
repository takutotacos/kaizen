export default function makeTwoDigits(num) {
  if (num.toString().length === 1) {
    return '0' + num;
  }

  return num;
}
