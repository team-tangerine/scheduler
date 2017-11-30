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

let times = [];
let times2 = [];
let testResult = [];

function writeUserData() {
  if (confirmData() === 6) {
    client.get('https://ka-leo.firebaseio.com/ka-leo.json?shallow=true', function (response) {
      firebase.database().ref('ka-leo/' + (Math.floor(response.length / 9) + 1)).set({
        name: document.getElementById('eventName').value,
        location: document.getElementById('eventLocation').value,
        date: document.getElementById('eventDate').value,
        social: document.getElementById('eventSocial').value,
        website: document.getElementById('eventWebsite').value,
        desc: document.getElementById('eventDescription').value,
        timeStart: document.getElementById('eventStart').value,
        timeEnd: document.getElementById('eventEnd').value,
      });
    });
    alert('Event added to the database!')
  } else {
    alert('Please fill in the required fields');
  }
}

function confirmData() {
  let req = document.getElementsByClassName('requiredInput');
  let retVal = 0;
  for (let i = 0; i < req.length; ++i) {
    if (req[i].value && (req[i].value.split('')[0] != ' ')) {
      ++retVal;
    }
  }
  return retVal;
}

function setDisabledTimes(context) {
  times2.push(context.select/60);
}

function getDisabledTimes() {
  let retDisabled = [];
  for (let i = 0; i < times2.length; i++) {
    retDisabled.push([times2[i],0]);
  }
  console.log(retDisabled);
}

function test() {
  console.log(document.getElementById('eventDate').value);
  console.log(document.getElementById('eventStart').value);
  console.log(document.getElementById('eventEnd').value);

  let sTime = document.getElementById('eventStart').value.split('');
  let eTime = document.getElementById('eventEnd').value.split('');

  let sTime2 = document.getElementById('eventStart').value.split(':');
  let sTime3 = document.getElementById('eventStart').value.split(" ");

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

function pushTime(context) {
  times.push(context);
}

function confirmTime() {
  let retVal = 0;
  let selectedTime = document.getElementById('eventStart').value.split(':');
  for (let i = 0; i < times2.length; i++) {
    if (parseInt(selectedTime[0]) === times2[i]) {
      retVal++;
    }
  }
  return retVal - 1;
}

function taskConfirm() {
  if (confirmTime() === 0) {
    swal({
      title: 'Confirming Time Availability',
      onOpen: () => {
        swal.showLoading()
      }, //do this then load the queue instead with the result
      timer: 3000
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
      timer: 3000
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
    //input: 'text',
    confirmButtonText: 'Next &rarr;',
    //showCancelButton: true,
    progressSteps: ['1', '2', '3']
  })

  swal.queue([
    {
      title: 'Task Name',
      text: 'Enter the name of your task',
      input: 'text'
    },
    {
      title: 'Task Name 2',
      text: 'Enter the name of your task'
    },
    {
      title: 'Task Name 3',
      text: 'Enter the name of your task'
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
        confirmButtonText: 'Lovely!'
      })
    }
  })
}