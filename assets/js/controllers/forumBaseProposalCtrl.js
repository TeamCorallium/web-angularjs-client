'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseProposalCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        $scope.tasks = [];
        $scope.selectedTask = '';

        $scope.getProjectById = function(){
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentForumActive =  data[0];

                        $scope.getTaskByProjectsId();
                    },
                    function(errResponse){
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();

        $scope.proposalTitle = '';
        $scope.proposalContent = '';
        $scope.itemSubject = '';
        $scope.currentForumActive = '';
        $scope.proposalType = '';
        $scope.currentTaskActive = '';
        $scope.taskState = '';
        $scope.taskName = '';
        $scope.taskDescription = '';
        $scope.taskCost = '';
        $scope.outcome = '';
        $scope.startDate = '';
        $scope.duration = '';

        //Actual proposal of the current project
        $scope.currentProposal = {
            id: '',
            name: '',
            proposalContent: '',
            itemSubject: '',
            projectId: '',
            proposalOwnerId: '',
            state: '',
            type: '',
            deathLine: '',
            date: ''
        };

        $scope.getTaskByProjectsId = function(){
            RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.tasks =  data;
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.createProposal = function () {
            $scope.currentProposal.name = $scope.proposalTitle;
            $scope.currentProposal.projectId = localStorageService.get('currentProjectId');
            $scope.currentProposal.proposalOwnerId = localStorageService.get('currentUserId');
            $scope.currentProposal.state = 'publish';
            $scope.currentProposal.type = $scope.proposalType;
            $scope.currentProposal.deathLine = $scope.deathLine;
            $scope.currentProposal.date = new Date();

            if($scope.proposalTitle != '' && $scope.proposalTitle != null){

                if ($scope.currentProposal.type != '') {

                    if ($scope.currentProposal.type == 'Start Project') {

                        if ($scope.proposalContent != '' && $scope.proposalContent != null) {
                            $scope.currentProposal.itemSubject = '';
                            $scope.currentProposal.proposalContent = $scope.proposalContent;

                            var obj = {
                                type: 'PROPOSAL',
                                value: $scope.currentProposal
                            };
                            WebSocketService.send(obj);

                            $state.go('app.forum.base');
                        } else {
                            toaster.pop('error', 'Error', 'Please introdeuce the content of the task to create the proposal.');
                        }

                    } else {
                        if ($scope.selectedTask != '' && $scope.selectedTask != null) {

                            var flag = true;
                            var flagState =  true;

                            if ($scope.currentProposal.type == 'Modified Task State') {
                                if ($scope.taskState != $scope.taskStateOld && $scope.taskState != '') {
                                    $scope.currentProposal.itemSubject = $scope.selectedTask.id;
                                    $scope.currentProposal.proposalContent = $scope.taskState;
                                    flag = true;
                                } else {
                                    flag = false;
                                    flagState = false;
                                }
                            } else if ($scope.currentProposal.type == 'Modified Task Name') {
                                if ($scope.taskState != $scope.taskStateOld) {
                                    $scope.currentProposal.itemSubject = $scope.selectedTask.id;
                                    $scope.currentProposal.proposalContent = $scope.taskName;
                                    flag = true;
                                } else {
                                    flag = false;
                                }
                            } else if ($scope.currentProposal.type == 'Modified Task Description') {
                                if ($scope.taskDescription != $scope.taskDescriptionOld) {
                                    $scope.currentProposal.itemSubject = $scope.selectedTask.id;
                                    $scope.currentProposal.proposalContent = $scope.taskDescription;
                                    flag = true;
                                } else {
                                    flag = false;
                                }
                            } else if ($scope.currentProposal.type == 'Modified Task Cost') {
                                if ($scope.taskCost != $scope.taskCostOld) {
                                    $scope.currentProposal.itemSubject = $scope.selectedTask.id;
                                    $scope.currentProposal.proposalContent = $scope.taskCost;
                                    flag = true;
                                } else {
                                    flag = false;
                                }
                            } else if ($scope.currentProposal.type == 'Modified Task Outcome') {
                                if ($scope.tasks.outcome != $scope.task.outcomeOld) {
                                    $scope.currentProposal.itemSubject = $scope.selectedTask.id;
                                    $scope.currentProposal.proposalContent = $scope.outcome;
                                    flag = true;
                                } else {
                                    flag = false;
                                }
                            } else if ($scope.currentProposal.type == 'Modified Task Start Date') {
                                var date = new Date($scope.startDate);
                                var dateold = new Date($scope.startDateOld);

                                if (date != dateold) {
                                    $scope.currentProposal.itemSubject = $scope.selectedTask.id;
                                    $scope.currentProposal.proposalContent = $scope.startDate;
                                    flag = true;
                                } else {
                                    flag = false;
                                }
                            } else if ($scope.currentProposal.type == 'Modified Task Duration') {
                                if ($scope.task.duration != $scope.task.durationOld) {
                                    $scope.currentProposal.itemSubject = $scope.selectedTask.id;
                                    $scope.currentProposal.proposalContent = $scope.duration;
                                    flag = true;
                                } else {
                                    flag = false;
                                }
                            }

                            if (flag){
                                if (flagState){
                                    var obj = {
                                        type: 'PROPOSAL',
                                        value: $scope.currentProposal
                                    };
                                    WebSocketService.send(obj);

                                    $state.go('app.forum.base');
                                } else {
                                    toaster.pop('error', 'Error', 'Please change the status of the task to create the proposal.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'Please change the content of the task to create the proposal.');
                            }

                        } else {
                            toaster.pop('error', 'Error', 'Please select any task.');
                        }
                    }
                } else {
                    toaster.pop('error', 'Error', 'Please select proposal type.');
                }
            } else {
                toaster.pop('error', 'Error', 'Please introduce proposal title.');
            }
        };

        //Date picker
        $scope.today = function() {
            $scope.deathLine = new Date();
        };
        $scope.today();

        $scope.start = $scope.startDate;
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

        $scope.openDatePickers = [];

        $scope.openTest = function($event, datePickerIndex) {
            $event.preventDefault();
            $event.stopPropagation();
            if ($scope.openDatePickers[datePickerIndex] === true) {
                $scope.openDatePickers.length = 0;
            } else {
                $scope.openDatePickers.length = 0;
                $scope.openDatePickers[datePickerIndex] = true;
            }
        };

        $scope.endOpen = function() {
            $scope.endOptions.minDate = $scope.start;
            $scope.startOpened = false;
            $scope.endOpened = !$scope.endOpened;
        };

        $scope.dateOptions = {
            formatYear : 'yy',
            startingDay : 1
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.visibleModifiedTaskState = false;
        $scope.visibleStartProject = false;
        $scope.visibleModifiedTaskName = false;

        $scope.changeVisibilityItems = function () {

            if ($scope.proposalType == 'Modified Task State') {
                // $scope.getTaskByProjectsId();
                $scope.visibleModifiedTaskState = true;
                $scope.visibleModifiedTaskOutcome = false;
                $scope.visibleStartProject = false;
                $scope.visibleModifiedTaskName = false;
                $scope.visibleModifiedTaskCost = false;
                $scope.visibleModifiedTaskDescription = false;
                $scope.visibleModifiedTaskDuration = false;
                $scope.visibleModifiedTaskStartDate = false;
            } else if ($scope.proposalType == 'Start Project') {
                $scope.visibleStartProject = true;
                $scope.visibleModifiedTaskState = false;
                $scope.visibleModifiedTaskOutcome = false;
                $scope.visibleModifiedTaskCost = false;
                $scope.visibleModifiedTaskName = false;
                $scope.visibleModifiedTaskDescription = false;
                $scope.visibleModifiedTaskDuration = false;
                $scope.visibleModifiedTaskStartDate = false;
            } else if ($scope.proposalType == 'Modified Task Name'){
                // $scope.getTaskByProjectsId();
                $scope.visibleModifiedTaskName = true;
                $scope.visibleModifiedTaskOutcome = false;
                $scope.visibleModifiedTaskCost = false;
                $scope.visibleStartProject = false;
                $scope.visibleModifiedTaskState = false;
                $scope.visibleModifiedTaskDescription = false;
                $scope.visibleModifiedTaskDuration = false;
                $scope.visibleModifiedTaskStartDate = false;
            } else if ($scope.proposalType == 'Modified Task Description') {
                // $scope.getTaskByProjectsId();
                $scope.visibleModifiedTaskDescription = true;
                $scope.visibleModifiedTaskOutcome = false;
                $scope.visibleModifiedTaskCost = false;
                $scope.visibleModifiedTaskName = false;
                $scope.visibleStartProject = false;
                $scope.visibleModifiedTaskState = false;
                $scope.visibleModifiedTaskDuration = false;
                $scope.visibleModifiedTaskStartDate = false;
            } else if ($scope.proposalType == 'Modified Task Cost') {
                // $scope.getTaskByProjectsId();
                $scope.visibleModifiedTaskCost = true;
                $scope.visibleModifiedTaskOutcome = false;
                $scope.visibleModifiedTaskDescription = false;
                $scope.visibleModifiedTaskName = false;
                $scope.visibleStartProject = false;
                $scope.visibleModifiedTaskState = false;
                $scope.visibleModifiedTaskDuration = false;
                $scope.visibleModifiedTaskStartDate = false;
            } else if ($scope.proposalType == 'Modified Task Outcome') {
                // $scope.getTaskByProjectsId();
                $scope.visibleModifiedTaskOutcome = true;
                $scope.visibleModifiedTaskCost = false;
                $scope.visibleModifiedTaskDescription = false;
                $scope.visibleModifiedTaskName = false;
                $scope.visibleStartProject = false;
                $scope.visibleModifiedTaskState = false;
                $scope.visibleModifiedTaskDuration = false;
                $scope.visibleModifiedTaskStartDate = false;
            } else if ($scope.proposalType == 'Modified Task Duration') {
                // $scope.getTaskByProjectsId();
                $scope.visibleModifiedTaskDuration = true;
                $scope.visibleModifiedTaskOutcome = false;
                $scope.visibleModifiedTaskCost = false;
                $scope.visibleModifiedTaskDescription = false;
                $scope.visibleModifiedTaskName = false;
                $scope.visibleStartProject = false;
                $scope.visibleModifiedTaskState = false;
                $scope.visibleModifiedTaskStartDate = false;
            } else if ($scope.proposalType == 'Modified Task Start Date') {
                // $scope.getTaskByProjectsId();
                $scope.visibleModifiedTaskStartDate = true;
                $scope.visibleModifiedTaskDuration = false;
                $scope.visibleModifiedTaskOutcome = false;
                $scope.visibleModifiedTaskCost = false;
                $scope.visibleModifiedTaskDescription = false;
                $scope.visibleModifiedTaskName = false;
                $scope.visibleStartProject = false;
                $scope.visibleModifiedTaskState = false;
            }
        };

        $scope.taskChange =  function () {

            if($scope.selectedTask != '' && $scope.selectedTask!= null) {
                RestService.fetchTaskByTaskId($scope.selectedTask.id)
                    .then(
                        function(data) {
                            $scope.currentTaskActive =  data[0];

                            $scope.currentTaskActive.name = data[0].name;
                            $scope.currentTaskActive.description = data[0].description;
                            $scope.currentTaskActive.cost = data[0].cost;
                            $scope.currentTaskActive.outcome = data[0].outcome;
                            $scope.currentTaskActive.startDate = new Date(data[0].startDate);
                            $scope.currentTaskActive.duration = data[0].duration;
                            $scope.currentTaskActive.state = data[0].state;

                            $scope.taskName = data[0].name;
                            $scope.taskDescription = data[0].description;
                            $scope.taskCost = data[0].cost;
                            $scope.outcome = data[0].outcome;
                            $scope.duration = data[0].duration;
                            $scope.startDate = new Date(data[0].startDate);

                            $scope.taskNameOld = data[0].name;
                            $scope.taskStateOld = data[0].state;
                            $scope.taskDescriptionOld = data[0].description;
                            $scope.taskCostOld = data[0].cost;
                            $scope.outcomeOld = data[0].outcome;
                            $scope.durationOld = data[0].duration;
                            $scope.startDateOld = new Date(data[0].startDate);
                        },
                        function(errResponse) {
                            console.log(errResponse);
                        }
                    );
            }
        };

        $scope.getValueIndex = function () {
            return $scope.currentTaskActive.state;
        };
    }]);