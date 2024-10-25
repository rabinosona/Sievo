export function NumberToOrdinal(number) {
    const ordinalSuffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
    const lastDigit = number % 10;
    const tensDigit = Math.floor((number % 100) / 10);
    let ordinalString;
  
    if (tensDigit === 1) {
      ordinalString = number + 'th';
    } else if (lastDigit === 1) {
      ordinalString = number + 'st';
    } else if (lastDigit === 2) {
      ordinalString = number + 'nd';
    } else if (lastDigit === 3) {
      ordinalString = number + 'rd';
    } else {
      ordinalString = number + 'th';
    }
  
    return ordinalString;
  }