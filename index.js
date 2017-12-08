var HttpClient = function () {
  this.get = function (aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
    }
    anHttpRequest.open("GET", aUrl, true);
    anHttpRequest.send(null);
  }
}

var client = new HttpClient();

let dateTime = [];
let userData = [];

/*
 * Writes data to the firebase backend
 * @param {string Array} resultValue - Results passed in from the SWAL popup
 * @return none
 */

function writeUserData(resultValue) {
  if (confirmRequiredData() === 2) {
    client.get('https://scheduler-b7ece.firebaseio.com/scheduler.json?shallow=true', function (response) {
      firebase.database().ref('scheduler/' + (Math.floor(response.length / 9) + 1)).set({
        date: document.getElementById('taskDate').value,
        timeStart: document.getElementById('taskStart').value,
        timeEnd: document.getElementById('taskEnd').value,
        taskName: resultValue[0][0],
        taskDesc: resultValue[0][1],
        taskLink: resultValue[0][2]
      });
    });
    swal(
        'Success',
        'Event added to the database!',
        'success'
    )
  } else {
    swal(
        'An error occured',
        'Please fill out all required fields!',
        'error'
    )
  }
}

/*
 * Reads in all data from the backend and displays then in the application
 * @param none
 * @return none
 */

function readUserData() {
  firebase.database().ref('scheduler/').once('value').then(function (snapshot) {

    let calculation = snapshot.val().length - 1;
    let devDays = getDevDays();

    let div = document.getElementById('showPaths');
    div.append('CRITICAL PATHS CALCULATION: YOU HAVE ' + calculation + ' TASK REMAINING.');
    div.appendChild(document.createElement('br'));
    div.append('You have ' + devDays + ' developer days remaining...');
    div.appendChild(document.createElement('br'));
      

    for (let i = 1; i <= snapshot.val().length - 1; i++) {
      let taskDateFB = document.createTextNode(snapshot.val()[i].date);
      let taskDesc = document.createTextNode(snapshot.val()[i].taskDesc);
      let taskLink = document.createTextNode(snapshot.val()[i].taskLink);
      let taskName = document.createTextNode(snapshot.val()[i].taskName);
      let timeEndFB = document.createTextNode(snapshot.val()[i].timeEnd);
      let timeStartFB = document.createTextNode(snapshot.val()[i].timeStart);

      createAndAppendDiv(i, taskDateFB, taskDesc, taskLink, taskName, timeEndFB, timeStartFB);
    }
  })
}

/*
 * Calculates the days before the year ends to help developers figure out how many days they have left to complete their tasks (does not include Holidays)
 * Future operations include reading the end date from a config file since different development companies have different end dates.
 * @param none
 * @return none
 */

function getDevDays(){
    let today = new Date();
    let cmas = new Date(today.getFullYear(), 12, 31);
    if (today.getMonth()==11 && today.getDate() > 25) 
    {
      cmas.setFullYear(cmas.getFullYear()+1); 
    }  
    let one_day = 1000 * 60 * 60 * 24;
    let result = Math.ceil((cmas.getTime()-today.getTime())/(one_day));
    return result;
}

/*
 * Grabs dates and times from the backend to make sure there is no overlap in the dates and times from a previous instance
 * @param none
 * @return none
 */

function getDateTime() {
  firebase.database().ref('scheduler/').once('value').then(function (snapshot) {
    for (let i = 1; i <= snapshot.val().length - 1; i++) {
      dateTime.push(snapshot.val()[i].date);
      dateTime.push(parseInt(snapshot.val()[i].timeStart.split(':')[0]));
    }
  })

    let sel = document.getElementById('selecty');
    firebase.database().ref('scheduler/').once('value').then(function (snapshot) {
    for (let i = 1; i <= snapshot.val().length - 1; i++) {
     
      var opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = snapshot.val()[i].taskName;
      sel.appendChild(opt);
    }
  })
}


function getTotalTasks() {
  firebase.database().ref('scheduler/').once('value').then(function (snapshot) {
    let calculation = snapshot.val().length - 1;
    return calculation;
  })
}


/*
 * Creates the text nodes and appends them to the div to display them
 * @param {int} taskNo - Task Number
 * @param {string} taskDisplayDate - Date of the indexed task
 * @param {string} taskDesc - Description of the indexed task
 * @param {string} taskLink - Link of the indexed task
 * @param {string} taskName - Name of the indexed task
 * @param {string} taskDisplayEnd - End time of the indexed task
 * @param {string} taskDisplayStart - Start time of the indexed task
 * @return none
 */

function createAndAppendDiv(taskNo, taskDisplayDate, taskDesc, taskLink, taskName, taskDisplayEnd, taskDisplayStart) {
 firebase.database().ref('scheduler/').once('value').then(function (snapshot) {
  let total = snapshot.val().length - 1;
  let days = getDevDays();
    
  let div = document.getElementById('showData');
  div.appendChild(document.createElement('br'));
  div.append('Task Number : ' + taskNo);
  div.appendChild(document.createElement('br'));
  div.append('Task Name : ');
  div.appendChild(taskName);
  div.appendChild(document.createElement('br'));
  div.append('Task Date : ');
  div.appendChild(taskDisplayDate);
  div.appendChild(document.createElement('br'));
  div.append('Task Start : ');
  div.appendChild(taskDisplayStart);
  div.appendChild(document.createElement('br'));
  div.append('Task End : ');
  div.appendChild(taskDisplayEnd);
  div.appendChild(document.createElement('br'));
  div.append('Task Description : ');
  div.appendChild(taskDesc);
  div.appendChild(document.createElement('br'));
  div.append('Task Link : ');
  div.appendChild(taskLink);
  div.appendChild(document.createElement('br'));
  
  // ( Developer Days / Total Tasks - TaskNo).floor 
  div.append('Days to Complete: ');
  let taskCalc = (days / (total - taskNo));
  div.append(Math.floor(taskCalc));
  div.appendChild(document.createElement('br'));
  })
}

/*
 * Confirms that the required fields are not blank
 * @param none
 * @return {int} retVal - Number of required fields left blank
 */

function confirmRequiredData() {
  let req = document.getElementsByClassName('requiredInput');
  let retVal = 0;
  for (let i = 0; i < req.length; ++i) {
    if (req[i].value && (req[i].value.split('')[0] != ' ')) {
      ++retVal;
    }
  }
  return retVal;
}

/*
 * Checks if there are overlapping times of dates and requested times
 * @param none
 * @return {int} retVal - Number of overlapping times
 */

function confirmDateTime() {
  let retVal = 0;
  let selectedDate = document.getElementById('taskDate').value;
  let selectedTime = document.getElementById('taskStart').value.split(':')[0];
  for (let i = 0; i < dateTime.length; i = i+2) {
    if ((selectedDate === dateTime[i]) && (parseInt(selectedTime) === dateTime[i+1])) {
      ++retVal;
    }
  }
  return retVal - 1;
}


/*
 * Confirms time availability of requested time
 * @param none
 * @return none
 */

function taskConfirm() {
  if (confirmDateTime() === 0) {
    swal({
      title: 'Confirming Time Availability',
      onOpen: () => {
        swal.showLoading()
      },
      timer: 1500
    }).then((result) => {
      if (result.dismiss === 'timer') {
        swal({
          title: 'Time is Available!',
          text: 'Please enter your task information.',
          type: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.value) {
            collectUserData();
          }
        })
      }
    })
  } else {
    swal({
      title: 'Confirming Time Availability',
      onOpen: () => {
        swal.showLoading()
      }, //do this then load the queue instead with the result
      timer: 1500
    }).then((result) => {
      if (result.dismiss === 'timer') {
        swal(
            'Time is not Available!',
            'Please choose a different time.',
            'error'
        )
      }
    })
  }
}

/*
 * Collects user input using sweetalert
 * @param none
 * @return none
 */

function collectUserData() {
  swal.setDefaults({
    confirmButtonText: 'Next &rarr;',
    progressSteps: ['1', '2', '3']
  })

  swal.queue([
    {
      title: 'Task Name',
      text: 'Enter the name of your task',
      input: 'text'
    },
    {
      title: 'Task Description',
      text: 'Enter the description of your task',
      input: 'textarea'
    },
    {
      title: 'Task Link',
      text: 'Enter a link to a website or any social link (if any is available)',
      input: 'text'
    },
  ]).then((result) => {
    swal.resetDefaults()

    if (result.value) {
      if (userData[0]) {
        userData.pop();
      }
      userData.push(result.value);
      swal({
        title: 'All done!',
        type: 'success',
        confirmButtonText: 'Garenz Bo Barenz!'
      }).then((result) => {
        writeUserData(userData);
      }
    )
    }
  })
}

/*
 * Processing the required fields or fails if required fields are not filled
 * @param none
 * @return none
 */

function processData() {
  if (confirmRequiredData() === 2) {
    dateTime.push(document.getElementById('taskDate').value);
    dateTime.push(parseInt(document.getElementById('taskStart').value.split(':')[0]))
    taskConfirm();
  } else {
    swal(
        'An error occured',
        'Please fill out all required fields!',
        'error'
    )
  }
}