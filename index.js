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
let testResult = [];

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

function test() {
  console.log(document.getElementById('taskDate').value);
  console.log(document.getElementById('taskStart').value);
  console.log(document.getElementById('taskEnd').value);

  let date = document.getElementById('taskDate').value;
  let sTime = document.getElementById('taskStart').value.split('');
  let eTime = document.getElementById('taskEnd').value.split('');

  let sTime2 = document.getElementById('taskStart').value.split(':');
  let sTime3 = document.getElementById('taskStart').value.split(" ");

  console.log(date);
  console.log(parseInt(sTime2[0]));
  console.log(sTime3);
  console.log(parseInt(sTime3[0].split(':')[1]));

  console.log(sTime);
  console.log(eTime);
  console.log(sTime[sTime.length - 2]);
  console.log(eTime[eTime.length - 2]);

  if ((sTime[sTime.length - 2] && eTime[eTime.length - 2]) === 'A') {
    let totalTime = 0;
  }
  console.log(testResult);
}

function test2() {
  console.log(times2);
  console.log(times2[0]);
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
      testResult.push(JSON.stringify(result.value));
      swal({
        title: 'All done!',
        html:
        'Your answers: <pre>' +
        JSON.stringify(result.value) +
        '</pre>',
        confirmButtonText: 'Garenz Bo Barenz!'
      })
    }
  })
}

function processData() {
  if (confirmRequiredData() === 2) {
    dateTime.push(document.getElementById('taskDate').value);
    dateTime.push(parseInt(document.getElementById('taskStart').value.split(':')[0]))
    console.log(dateTime);
    taskConfirm();
  } else {
    swal(
        'An error occured',
        'Please fill out all required fields!',
        'error'
    )
  }
}