'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseProposalCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.tasks = [];
            $scope.selectedTaskState = '';
            $scope.selectedTaskName = '';
            $scope.selectedTaskDescription = '';
            $scope.selectedTaskStartDate = '';
            $scope.selectedTaskOutcome = '';
            $scope.selectedTaskDuration = '';
            $scope.selectedTaskCost = '';

            $scope.getProjectById = function () {
                RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.currentForumActive = data[0];

                            $scope.getTaskByProjectsId();
                        },
                        function (errResponse) {
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
                proposalList: [],
                projectId: '',
                proposalOwnerId: '',
                state: '',
                deathLine: '',
                date: '',
                avatar: ''
            };

            $scope.getTaskByProjectsId = function () {
                RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.tasks = data;
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.createProposal = function () {
                if ($scope.proposalTitle != '' && $scope.proposalTitle != null) {

                    if ($scope.proposalType.type != '') {
                        $scope.currentProposal.name = $scope.proposalTitle;
                        $scope.currentProposal.deathLine = $scope.deathLine;
                        $scope.currentProposal.date = new Date();
                        $scope.currentProposal.avatar = $rootScope.user.avatar;
                        $scope.currentProposal.state = 'publish';

                        for (var i = 0; i<$scope.listProposal.length; i++) {
                            var proposalTemp = {
                                type: $scope.listProposal[i].type,
                                itemSubject: $scope.listProposal[i].itemSubject,
                                itemContent: $scope.listProposal[i].itemContent,
                                currentContent: $scope.listProposal[i].currentContent
                            };
                            $scope.currentProposal.proposalList.push(proposalTemp);
                        }
                        $scope.currentProposal.projectId = localStorageService.get('currentProjectId');
                        $scope.currentProposal.proposalOwnerId = localStorageService.get('currentUserId');

                        var obj = {
                            type: 'PROPOSAL',
                            value: $scope.currentProposal
                        };
                        WebSocketService.send(obj);

                        $state.go('app.forum.base');
                    } else {
                        toaster.pop('error', 'Error', 'Please select proposal type.');
                    }
                } else {
                    toaster.pop('error', 'Error', 'Please introduce proposal title.');
                }
            };

            //Date picker
            $scope.today = function () {
                $scope.deathLine = new Date();
            };
            $scope.today();

            $scope.start = $scope.startDate;
            $scope.end = $scope.maxDate;

            $scope.clear = function () {
                $scope.dt = null;
            };

            $scope.datepickerOptions = {
                showWeeks: false,
                startingDay: 1
            };

            $scope.dateDisabledOptions = {
                dateDisabled: disabled,
                showWeeks: false,
                startingDay: 1
            };

            $scope.startOptions = {
                showWeeks: false,
                startingDay: 1,
                minDate: $scope.minDate,
                maxDate: $scope.maxDate
            };

            $scope.endOptions = {
                showWeeks: false,
                startingDay: 1,
                minDate: $scope.minDate,
                maxDate: $scope.maxDate
            };
// Disable weekend selection
            function disabled(data) {
                var date = data.date, mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            $scope.setDate = function (year, month, day) {
                $scope.simpleProject.deathLine = new Date(year, month, day);
            };
            $scope.toggleMin = function () {
                $scope.datepickerOptions.minDate = $scope.datepickerOptions.minDate ? null : new Date();
                $scope.dateDisabledOptions.minDate = $scope.dateDisabledOptions.minDate ? null : new Date();
            };
            $scope.maxDate = new Date(2020, 5, 22);
            $scope.minDate = new Date(1970, 12, 31);

            $scope.open = function () {
                $scope.opened = !$scope.opened;
            };

            $scope.openDatePickers = [];

            $scope.openTest = function ($event, datePickerIndex) {
                $event.preventDefault();
                $event.stopPropagation();
                if ($scope.openDatePickers[datePickerIndex] === true) {
                    $scope.openDatePickers.length = 0;
                } else {
                    $scope.openDatePickers.length = 0;
                    $scope.openDatePickers[datePickerIndex] = true;
                }
            };

            $scope.endOpen = function () {
                $scope.endOptions.minDate = $scope.start;
                $scope.startOpened = false;
                $scope.endOpened = !$scope.endOpened;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
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
                } else if ($scope.proposalType == 'Modified Task Name') {
                    $scope.visibleModifiedTaskName = true;
                    $scope.visibleModifiedTaskOutcome = false;
                    $scope.visibleModifiedTaskCost = false;
                    $scope.visibleStartProject = false;
                    $scope.visibleModifiedTaskState = false;
                    $scope.visibleModifiedTaskDescription = false;
                    $scope.visibleModifiedTaskDuration = false;
                    $scope.visibleModifiedTaskStartDate = false;
                } else if ($scope.proposalType == 'Modified Task Description') {
                    $scope.visibleModifiedTaskDescription = true;
                    $scope.visibleModifiedTaskOutcome = false;
                    $scope.visibleModifiedTaskCost = false;
                    $scope.visibleModifiedTaskName = false;
                    $scope.visibleStartProject = false;
                    $scope.visibleModifiedTaskState = false;
                    $scope.visibleModifiedTaskDuration = false;
                    $scope.visibleModifiedTaskStartDate = false;
                } else if ($scope.proposalType == 'Modified Task Cost') {
                    $scope.visibleModifiedTaskCost = true;
                    $scope.visibleModifiedTaskOutcome = false;
                    $scope.visibleModifiedTaskDescription = false;
                    $scope.visibleModifiedTaskName = false;
                    $scope.visibleStartProject = false;
                    $scope.visibleModifiedTaskState = false;
                    $scope.visibleModifiedTaskDuration = false;
                    $scope.visibleModifiedTaskStartDate = false;
                } else if ($scope.proposalType == 'Modified Task Outcome') {
                    $scope.visibleModifiedTaskOutcome = true;
                    $scope.visibleModifiedTaskCost = false;
                    $scope.visibleModifiedTaskDescription = false;
                    $scope.visibleModifiedTaskName = false;
                    $scope.visibleStartProject = false;
                    $scope.visibleModifiedTaskState = false;
                    $scope.visibleModifiedTaskDuration = false;
                    $scope.visibleModifiedTaskStartDate = false;
                } else if ($scope.proposalType == 'Modified Task Duration') {
                    $scope.visibleModifiedTaskDuration = true;
                    $scope.visibleModifiedTaskOutcome = false;
                    $scope.visibleModifiedTaskCost = false;
                    $scope.visibleModifiedTaskDescription = false;
                    $scope.visibleModifiedTaskName = false;
                    $scope.visibleStartProject = false;
                    $scope.visibleModifiedTaskState = false;
                    $scope.visibleModifiedTaskStartDate = false;
                } else if ($scope.proposalType == 'Modified Task Start Date') {
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

            $scope.taskChange = function () {

                if ($scope.selectedTask != '' && $scope.selectedTask != null) {
                    RestService.fetchTaskByTaskId($scope.selectedTask.id)
                        .then(
                            function (data) {
                                $scope.currentTaskActive = data[0];

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
                            function (errResponse) {
                                console.log(errResponse);
                            }
                        );
                }
            };

            $scope.getValueIndex = function () {
                return $scope.currentTaskActive.state;
            };

            $scope.proposal = {
                title: '',
                type: '',
                deathLine: '',
                itemSubject: '',
                itemContent: ''
            };

            $scope.listProposal = [];

            $scope.addProposal = function () {
                if ($scope.proposalTitle != ''){
                    if ($scope.proposalType != '') {
                        var currentProposal = {
                            type: $scope.proposalType,
                            itemSubject: '',
                            itemContent: '',
                            currentContent: ''
                        };

                        if ($scope.proposalType == 'Modified Task State') {
                            if ($scope.selectedTaskState != '') {
                                if($scope.taskState != $scope.taskStateOld || $scope.taskState != '') {
                                    currentProposal.itemSubject = $scope.selectedTaskState.id;
                                    currentProposal.itemContent = $scope.taskState;
                                    currentProposal.currentContent = $scope.selectedTaskState.state;
                                    $scope.listProposal.push(currentProposal);
                                }else {
                                    toaster.pop('error', 'Error', 'Please change the task state.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'Please, select any task.');
                            }
                        } else if ($scope.proposalType == 'Modified Task Name') {
                            if ($scope.selectedTaskName != '') {
                                if($scope.taskName != $scope.taskNameOld || $scope.taskName != '') {
                                    currentProposal.itemSubject = $scope.selectedTaskName.id;
                                    currentProposal.itemContent = $scope.taskName;
                                    currentProposal.currentContent = $scope.selectedTaskName.name;
                                    $scope.listProposal.push(currentProposal);
                                }else {
                                    toaster.pop('error', 'Error', 'Please change the task name.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'Please, select any task.');
                            }
                        } else if ($scope.proposalType == 'Modified Task Description') {
                            if ($scope.selectedTaskDescription != '') {
                                if($scope.taskDescription != $scope.taskDescriptionOld || $scope.taskDescription != '') {
                                    currentProposal.itemSubject = $scope.selectedTaskDescription.id;
                                    currentProposal.itemContent = $scope.taskDescription;
                                    currentProposal.currentContent = $scope.selectedTaskDescription.description;
                                    $scope.listProposal.push(currentProposal);
                                }else {
                                    toaster.pop('error', 'Error', 'Please change the task description.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'Please, select any task.');
                            }
                        } else if ($scope.proposalType == 'Modified Task Cost') {
                            if ($scope.selectedTaskCost != '') {
                                if($scope.taskCost != $scope.taskCostOld || $scope.taskCostOld != '') {
                                    currentProposal.itemSubject = $scope.selectedTaskCost.id;
                                    currentProposal.itemContent = $scope.taskCost;
                                    currentProposal.currentContent = $scope.selectedTaskCost.totalCost;
                                    $scope.listProposal.push(currentProposal);
                                }else {
                                    toaster.pop('error', 'Error', 'Please change the task cost.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'Please, select any task.');
                            }
                        } else if ($scope.proposalType == 'Modified Task Outcome') {
                            if ($scope.selectedTaskOutcome != '') {
                                if($scope.outcome != $scope.outcomeOld || $scope.outcome != '') {
                                    currentProposal.itemSubject = $scope.selectedTaskOutcome.id;
                                    currentProposal.itemContent = $scope.outcome;
                                    currentProposal.currentContent = $scope.selectedTaskOutcome.outcome;
                                    $scope.listProposal.push(currentProposal);
                                }else {
                                    toaster.pop('error', 'Error', 'Please change the task outcome.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'Please, select any task.');
                            }
                        } else if ($scope.proposalType == 'Modified Task Duration') {
                            if ($scope.selectedTaskDuration != '') {
                                if($scope.duration != $scope.durationOld || $scope.duration != '') {
                                    currentProposal.itemSubject = $scope.selectedTaskDuration.id;
                                    currentProposal.itemContent = $scope.duration;
                                    currentProposal.currentContent = $scope.selectedTaskDuration.duration;
                                    $scope.listProposal.push(currentProposal);
                                }else {
                                    toaster.pop('error', 'Error', 'Please change the task duration.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'Please, select any task.');
                            }
                        } else if ($scope.proposalType == 'Modified Task Start Date') {
                            if ($scope.selectedTaskStartDate != '') {
                                if($scope.startDate != $scope.startDate || $scope.startDate != '') {
                                    currentProposal.itemSubject = $scope.selectedTaskStartDate.id;
                                    currentProposal.itemContent = $scope.startDate;
                                    currentProposal.currentContent = $scope.selectedTaskStartDate.startDate;
                                    $scope.listProposal.push(currentProposal);
                                }else {
                                    toaster.pop('error', 'Error', 'Please change the task start date.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'Please, select any task.');
                            }
                        } else if ($scope.proposalType == 'Start Project') {

                            if($scope.proposalContent != '') {
                                currentProposal.itemSubject = '';
                                currentProposal.itemContent = $scope.proposalContent;
                                currentProposal.currentContent = '';
                                $scope.listProposal.push(currentProposal);
                            }else {
                                toaster.pop('error', 'Error', 'Please change the proposal content.');
                            }
                        }
                    } else {
                        toaster.pop('error', 'Error', 'Please select the proposal type.');
                    }
                } else {
                    toaster.pop('error', 'Error', 'Please introduce the proposal title.');
                }
            };

            $scope.stateArray = ['', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];
            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getProjectDate = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.getTaskName = function (taskId) {
                if (taskId != '') {
                    for (var i=0; i<$scope.tasks.length; i++) {
                        if ($scope.tasks[i].id == taskId) {
                            return $scope.tasks[i].name;
                        }
                    }
                }
            };
        }
    }]);