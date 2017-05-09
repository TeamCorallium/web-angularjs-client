'use strict';
/**
 * controller for Wizard Form example
 */
app.controller('WizardCtrl', ["$scope", "toaster", "localStorageService", "RestService", "$state",
    function ($scope, toaster, localStorageService, RestService, $state) {
        $scope.currentStep = 1;
        $scope.simpleProject = {
            creationDate: '',
            id: '',
            userId: localStorageService.get('currentUserId'),
            projectName: '',
            description: '',
            totalCost: '',
            minimalCost: '',
            estimateDuration: '',
            state: '',
            deathLine: '',
            revenueOwner: '',
            maxNumInves: '',
            minCapInves: ''
        };

        $scope.risks = [
            // {
            //     name: '',
            //     description: ''
            // }
        ];

        $scope.tasks = [
            // {
            //     name: '',
            //     description: '',
            //     cost: '',
            //     outcome: '',
            //     startDate: '',
            //     duration: '',
            //     state: ''
            // }
        ];

        $scope.createSimpleProject = function () {
            $scope.simpleProject.creationDate = new Date();
            RestService.createSimpleProject($scope.simpleProject)
                .then(
                    function(data) {
                        if(data == -1) {
                            toaster.pop('error', 'Error', 'Invalid project info.');
                        } else {
                            $scope.simpleProject.id = data;
                            $scope.addtasktoServer($scope.simpleProject.id);
                            toaster.pop('success', 'Good!!!', 'Project created correctly.');
                            $state.go('app.project.user_project');
                        }
                    },
                    function(errResponse) {
                        toaster.pop('error', 'Error', 'Database connection error.');
                    }
                );
        };

        $scope.addtasktoServer = function(projectId) {
            var comArr = eval( $scope.tasks );
            for (var i = 0; i<comArr.length; i++) {
                comArr[i].projectId = projectId;
                RestService.createTask(comArr[i])
                    .then(
                        function(data) {
                            console.log(data + "Tasks");
                        },
                        function(errResponse) {
                            console.log("error");
                        }
                    );
            }
        };

        $scope.addTask = function() {
            $scope.tasks.push({ 'name':$scope.task.name, 'description': $scope.task.description,
                'cost':$scope.task.cost, 'outcome':$scope.task.outcome, 'startDate':$scope.start,
                'duration':$scope.task.duration, 'state':$scope.task.state });
            $scope.task.name = '';
            $scope.task.description = '';
            $scope.task.cost = '';
            $scope.task.outcome = '';
            $scope.start = '';
            $scope.task.duration = '';
            $scope.task.state = '';
        };

        $scope.removeTask = function(name){
            var index = -1;
            var comArr = eval( $scope.tasks );
            for( var i = 0; i < comArr.length; i++ ) {
                if( comArr[i].name === name ) {
                    index = i;
                    break;
                }
            }
            if( index === -1 ) {
                alert( "Something gone wrong" );
            }
            $scope.tasks.splice( index, 1 );
        };

        // Initial Value
        $scope.form = {

            next: function (form) {

                $scope.toTheTop();

                if (form.$valid) {
                    form.$setPristine();
                    nextStep();
                } else {
                    var field = null, firstError = null;
                    for (field in form) {
                        if (field[0] != '$') {
                            if (firstError === null && !form[field].$valid) {
                                firstError = form[field].$name;
                            }

                            if (form[field].$pristine) {
                                form[field].$dirty = true;
                            }
                        }
                    }

                    angular.element('.ng-invalid[name=' + firstError + ']').focus();
                    errorMessage();
                }
            },
            prev: function (form) {
                $scope.toTheTop();
                prevStep();
            },
            goTo: function (form, i) {
                if (parseInt($scope.currentStep) > parseInt(i)) {
                    $scope.toTheTop();
                    goToStep(i);

                } else {
                    if (form.$valid) {
                        $scope.toTheTop();
                        goToStep(i);

                    } else
                        errorMessage();
                }
            },
            submit: function () {

            },
            reset: function () {

            }
        };

        var nextStep = function () {
            $scope.currentStep++;
        };
        var prevStep = function () {
            $scope.currentStep--;
        };
        var goToStep = function (i) {
            $scope.currentStep = i;
        };
        var errorMessage = function (i) {
            toaster.pop('error', 'Error', 'Please complete the form in this step before proceeding');
        };

        //Date picker
        $scope.today = function() {
            $scope.simpleProject.deathLine = new Date();
        };
        $scope.today();
        $scope.start = $scope.minDate;
        $scope.end = $scope.maxDate;
        $scope.clear = function() {
            $scope.dt = null;
        };
        $scope.datepickerOptions = {
            showWeeks : false,
            startingDay : 1
        };
        $scope.dateDisabledOptions = {
            dateDisabled : disabled,
            showWeeks : false,
            startingDay : 1
        };
        $scope.startOptions = {
            showWeeks : false,
            startingDay : 1,
            minDate: $scope.minDate,
            maxDate: $scope.maxDate
        };
        $scope.endOptions = {
            showWeeks : false,
            startingDay : 1,
            minDate: $scope.minDate,
            maxDate: $scope.maxDate
        };
        // Disable weekend selection
        function disabled(data) {
            var date = data.date, mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }
        $scope.setDate = function(year, month, day) {
            $scope.simpleProject.deathLine = new Date(year, month, day);
        };
        $scope.toggleMin = function() {
            $scope.datepickerOptions.minDate = $scope.datepickerOptions.minDate ? null : new Date();
            $scope.dateDisabledOptions.minDate = $scope.dateDisabledOptions.minDate ? null : new Date();
        };
        $scope.maxDate = new Date(2020, 5, 22);
        $scope.minDate = new Date(1970, 12, 31);
        $scope.open = function() {
            $scope.opened = !$scope.opened;
        };
        $scope.endOpen = function() {
            $scope.endOptions.minDate = $scope.start;
            $scope.startOpened = false;
            $scope.endOpened = !$scope.endOpened;
        };
        $scope.startOpen = function() {
            $scope.startOptions.maxDate = $scope.end;
            $scope.endOpened = false;
            $scope.startOpened = !$scope.startOpened;
        };
        $scope.dateOptions = {
            formatYear : 'yy',
            startingDay : 1
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.hstep = 1;
        $scope.mstep = 15;

        // Time Picker
        $scope.options = {
            hstep : [1, 2, 3],
            mstep : [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = !$scope.ismeridian;
        };
        $scope.update = function() {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.dt = d;
        };
        $scope.changed = function() {
            $log.log('Time changed to: ' + $scope.simpleProject.deathLine);
        };
        $scope.clear = function() {
            $scope.simpleProject.deathLine = null;
        };

        // $scope.ganttStart = function () {
        //     var tasks = {
        //         data:[
        //             {id:1, text:"Project #1",start_date:"01-04-2013", duration:100,
        //             progress: 0.6, open: true},
        //             {id:2, text:"Task #1",   start_date:"03-04-2013", duration:5, 
        //             progress: 1,   open: true, parent:1},
        //             {id:3, text:"Task #2",   start_date:"02-04-2013", duration:7, 
        //             progress: 0.5, open: true, parent:1},
        //             {id:4, text:"Task #2.1", start_date:"03-04-2013", duration:2, 
        //             progress: 1,   open: true, parent:3},
        //             {id:5, text:"Task #2.2", start_date:"04-04-2013", duration:3, 
        //             progress: 0.8, open: true, parent:3},
        //             {id:6, text:"Task #2.3", start_date:"05-04-2013", duration:4, 
        //             progress: 0.2, open: true, parent:3}
        //         ],
        //         links:[
        //             {id:1, source:1, target:2, type:"1"},
        //             {id:2, source:1, target:3, type:"1"},
        //             {id:3, source:3, target:4, type:"1"},
        //             {id:4, source:4, target:5, type:"0"},
        //             {id:5, source:5, target:6, type:"0"}
        //         ]
        //     };
        //     gantt.config.columns =  [
        //         {name:"text",       label:"Task name", tree:true },
        //         {name:"duration",   label:"Duration"},
        //         {name:"add",        label:""}
        //     ];

        //     gantt.config.keyboard_navigation_cells = true;
        //     gantt.config.touch = true;
        //     gantt.init("gantt_here"); 
        //     gantt.parse (tasks);
        // }
        // $scope.ganttStart();
    }]);
