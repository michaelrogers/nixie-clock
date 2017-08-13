document.addEventListener('DOMContentLoaded', () => {
  const base = 10;
  const rangeofDigits = new Set([...Array(base).keys()]);

  //Return children nodes as an array
  const childNodeArray = nodeList => (
    Array.from(nodeList.childNodes) || []
  );

  const normalizeTimeToArray = (timeBlocks) => {
    return timeBlocks.map(value => {
      const splitDigits = (
        value.toString()
          .split('')
          .map(n => parseInt(n))
      );
      //Add a zero to normalize time block value
      if (splitDigits.length < 2) {
        splitDigits.unshift(0);
      }
      return splitDigits;
      //Flatten the matrix
    }).reduce((a, b) => a.concat(b), []);
  };

  //Generate digits based on rangeOfDigits
  const generateDigits = (rangeofDigits) => {
    const fragment = new DocumentFragment;
    rangeofDigits.forEach(n => {
      let span = document.createElement('span');
      span.classList.add('digit');
      span.textContent = n;
      span.id = n;
      fragment.appendChild(span);
    });
    return fragment;
  };
  //Fetch time from the browser
  const fetchTime = () => {
    const currentTime = new Date(Date.now());
    updateTime({
      hours: currentTime.getHours(),
      minutes: currentTime.getMinutes(),
      seconds: currentTime.getSeconds()
    });
  };
  //Iterate through list and remove active class
  function removeActiveStateFactory(
    {hourDigits, minuteDigits, secondDigits} //eslint-disable-line
  ) {
    for (let value in arguments[0]) {
      arguments[0][value]
        .map(digit => {
          childNodeArray(digit)
            .map(digit => digit.classList.remove('active'));
        });
    }
  }

  //Inject the dom digit dependencies
  function updateDOMTime(
    {hourDigits, minuteDigits, secondDigits},
    {hours, minutes, seconds}
  ) {
    removeActiveState();
    //Flatten node lists into an interable array
    const domDigitArr = [
      ...hourDigits,
      ...minuteDigits,
      ...secondDigits
    ];
    const timeValueArray = normalizeTimeToArray([hours, minutes, seconds]);
    domDigitArr.map((digit, i) => {
      childNodeArray(digit)[timeValueArray[i]].classList.add('active');
    });
  }

  const hourDigits =  Array.from(
    document.querySelectorAll('.hour-block .nixie-tube')) || [];
  //Minute digits are very small :)
  const minuteDigits =  Array.from(
    document.querySelectorAll('.minute-block .nixie-tube')) || [];
  const secondDigits =  Array.from(
    document.querySelectorAll('.second-block .nixie-tube')) || [];


  //Bind dependent dom elements to factories
  const updateTime = updateDOMTime.bind(null, {hourDigits, minuteDigits, secondDigits});
  const removeActiveState = removeActiveStateFactory.bind(null, {hourDigits, minuteDigits, secondDigits});

  const digitArray = Array.from(document.querySelectorAll('.nixie-tube'));
  const init = void function() {//eslint-disable-line
    //Generate the digit range
    digitArray.map(digit => digit.appendChild(generateDigits(rangeofDigits)));
    fetchTime();
    setInterval(fetchTime, 1000);
  }();

});