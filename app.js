// Create AngularJS module and inject Firebase
angular.module('scheduleApp', ['firebase'])

// Create main controller and get access to Firebase
.controller('mainController', function ($scope, $firebaseObject) {

    // Connect to Firebase
    var ref = new Firebase("https://scheduler-ae770.firebaseio.com/days");

    // Sync as object. Original tutorial uses $firebase and $asObject(). 
    var syncObject = $firebaseObject(ref);

    // Three-way data binding
    syncObject.$bindTo($scope, 'days');

    // Function to set default data
    $scope.reset = function () {

        ref.set({
            day1: {
                name: 'Monday',
                slots: {
                    num1: {
                        time: '9 a.m.',
                        booked: false
                    },
                    num2: {
                        time: '11 a.m.',
                        booked: false
                    },
                    num3: {
                        time: '1 p.m.',
                        booked: false
                    }
                }
            },
            day2: {
                name: 'Tuesday',
                slots: {
                    num1: {
                        time: '9 a.m.',
                        booked: false
                    },
                    num2: {
                        time: '11 a.m.',
                        booked: false
                    },
                    num3: {
                        time: '1 p.m.',
                        booked: false
                    }
                }
            },
            day3: {
                name: 'Wednesday',
                slots: {
                    num1: {
                        time: '9 a.m.',
                        booked: false
                    },
                    num2: {
                        time: '11 a.m.',
                        booked: false
                    },
                    num3: {
                        time: '1 p.m.',
                        booked: false
                    }
                }
            },
            day4: {
                name: 'Thursday',
                slots: {
                    num1: {
                        time: '9 a.m.',
                        booked: false
                    },
                    num2: {
                        time: '11 a.m.',
                        booked: false
                    },
                    num3: {
                        time: '1 p.m.',
                        booked: false
                    }
                }
            },
            day5: {
                name: 'Friday',
                slots: {
                    num1: {
                        time: '9 a.m.',
                        booked: false
                    },
                    num2: {
                        time: '11 a.m.',
                        booked: false
                    },
                    num3: {
                        time: '1 p.m.',
                        booked: false
                    }
                }
            }

        });

    };

});