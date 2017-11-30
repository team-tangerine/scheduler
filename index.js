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

function writeUserData() {
  if (confirmRequiredData() === 2) {
    client.get('https://scheduler-b7ece.firebaseio.com/scheduler.json?shallow=true', function (response) {
      firebase.database().ref('scheduler/' + (Math.floor(response.length / 9) + 1)).set({
        date: document.getElementById('taskDate').value,
        timeStart: document.getElementById('taskStart').value,
        timeEnd: document.getElementById('taskEnd').value,
      });
    });
    alert('Event added to the database!')
  } else {
    alert('Please fill in the required fields');
  }
}

function readUserData() {
  firebase.database().ref('scheduler/').once('value').then(function (snapshot) {
    for (let i = 1; i <= snapshot.val().length - 1; i++) {
      let name = document.createTextNode(snapshot.val()[i].name);
      let location = document.createTextNode(snapshot.val()[i].location);
      let date = document.createTextNode(snapshot.val()[i].date);
      let social = document.createTextNode(snapshot.val()[i].social);
      let website = document.createTextNode(snapshot.val()[i].website);
      let desc = document.createTextNode(snapshot.val()[i].desc);
      let timeStart = document.createTextNode(snapshot.val()[i].timeStart);
      let timeEnd = document.createTextNode(snapshot.val()[i].timeEnd);
      createDiv(name, location, date, social, website, desc, timeStart, timeEnd);
      appendItems(name, location, date, social, website, desc, timeStart, timeEnd);
      storeData(name, location, date, social, website, desc, timeStart, timeEnd);
    }
  })
}

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

function confirmDateTime() {
  let retVal = 0;
  let selectedDate = document.getElementById('taskDate').value;
  let selectedTime = document.getElementById('taskStart').value.split(':')[0];
  for (let i = 0; i < dateTime.length; i = i+2) {
    if ((selectedDate === dateTime[i]) && (parseInt(selectedTime) === dateTime[i+1])) {
      ++retVal;
    }
  }
  console.log(retVal);
  return retVal - 1;
}

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
      userData.push(result.value);
      swal({
        title: 'All done!',
        // html:
        // 'Your answers: <pre>' +
        // JSON.stringify(result.value) +
        // '</pre>',
        confirmButtonText: 'Garenz Bo Barenz!'
      })
    }
  })

  console.log(userData);
}

function test() {
  console.log(userData);
  console.log(userData[0]);
  console.log(userData[0][0]);
}

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