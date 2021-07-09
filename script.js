class TimeTable {
    constructor(hour, todo) {
      this.hour = hour;
      this.todo = todo;
    }
  }
  
  window.onload = function() {
    const timeblox = getCurrentTimeblocks();
    const presentTime = moment();
  
    displayCurrentDate(presentTime);
    displayTimeblockRows(presentTime);
  
    document.querySelector('.container')
      .addEventListener('click', function(event) {
        containerClicked(event, timeblox);
      });
    setTimeblockText(timeblox);
  };
  
  function getCurrentTimeblocks() {
    const timeblox = localStorage.getItem('timeblockObjects');
    return timeblox ? JSON.parse(timeblox) : [];
  }
  
  function displayCurrentDate(presentTime) {
    document.getElementById('currentDay')
      .textContent = presentTime.format('dddd, MMMM Do');
  }
  
  function displayTimeblockRows(presentTime) {
    const presentHour = presentTime.hour();
    for (let i = 9; i <= 17; i ++) {
      const timeBlock = createTimeblockRow(i);
      const hourDiv = createCol(createHourDiv(i), 1);
      const textArea = createCol(createTextArea(i, presentHour), 10);
      const saveButton = createCol(createSaveBtn(i), 1);
      appendTimeblockColumns(timeBlock, hourDiv, textArea, saveButton);
      document.querySelector('.container').appendChild(timeBlock);
    }
  }
  
  function createTimeblockRow(hourId) {
    const timeBlock = document.createElement('div');
    timeBlock.classList.add('row');
    timeBlock.id = `timeblock-${hourId}`;
    return timeBlock;
  }
  
  function createCol(element, colSize) {
    const range = document.createElement('div');
    range.classList.add(`col-${colSize}`,'p-0');
    range.appendChild(element);
    return range;
  }
  
  function createHourDiv(hour) {
    const hourDiv = document.createElement('div');
    hourDiv.classList.add('hour');
    hourDiv.textContent = formatHour(hour);
    return hourDiv;
  }
  
  function formatHour(hour) {
    const hourdepic = String(hour);
    return moment(hourdepic, 'h').format('hA');
  }
  
  function createTextArea(hour, presentHour) {
    const textArea = document.createElement('textarea');
    textArea.classList.add(getTextAreaBackgroundClass(hour, presentHour));
    return textArea;
  }
  
  function getTextAreaBackgroundClass(hour, presentHour) {
    return hour < presentHour ? 'past' 
      : hour === presentHour ? 'present' 
      : 'future';
  }
  
  function createSaveBtn(hour) {
    const saveButton = document.createElement('button');
    saveButton.classList.add('saveBtn');
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    saveButton.setAttribute('data-hour', hour);
    return saveButton;
  }
  
  function appendTimeblockColumns(timeblockRow, hourDiv, textAreaCol, saveBtnCol) {
    const innerCols = [hourDiv, textAreaCol, saveBtnCol];
    for (let col of innerCols) {
      timeblockRow.appendChild(col);
    }
  }
  
  function containerClicked(event, timeblockList) {
    if (isSaveButton(event)) {
      const timeblockHour = getTimeblockHour(event);
      const textAreaValue = getTextAreaValue(timeblockHour);
      placeTimeblockInList(new TimeTable(timeblockHour, textAreaValue), timeblockList);
      saveTimeblockList(timeblockList);
    }
  }
  
  function isSaveButton(event) {
    return event.target.matches('button') || event.target.matches('.fa-save');
  }
  
  function getTimeblockHour(event) {
    return event.target.matches('.fa-save') ? event.target.parentElement.dataset.hour : event.target.dataset.hour;
  }
  
  function getTextAreaValue(timeblockHour) {
    return document.querySelector(`#timeblock-${timeblockHour} textarea`).value;
  }
  
  function placeTimeblockInList(newTimeObj, timeblockList) {
    if (timeblockList.length > 0) {
      for (let savedTimeblock of timeblockList) {
        if (savedTimeblock.hour === newTimeObj.hour) {
          savedTimeblock.todo = newTimeObj.todo;
          return;
        }
      }
    } 
    timeblockList.push(newTimeObj);
    return;
  }
  
  function saveTimeblockList(timeblockList) {
    localStorage.setItem('timeblockObjects', JSON.stringify(timeblockList));
  }
  
  function setTimeblockText(timeblockList) {
    if (timeblockList.length === 0 ) {
      return;
    } else {
      for (let timeblock of timeblockList) {
        document.querySelector(`#timeblock-${timeblock.hour} textarea`)
          .value = timeblock.todo;
      }
    }
  }
  