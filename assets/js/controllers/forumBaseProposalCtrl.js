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

            if ($scope.currentProposal.type == 'Modified Task State') {
                $scope.currentProposal.itemSubject = $scope.selectedTask.id;
                $scope.currentProposal.proposalContent = $scope.proposalContent;
            } else if ($scope.currentProposal.type == 'Start Project'){
                $scope.currentProposal.proposalContent = $scope.proposalContent;
                $scope.currentProposal.itemSubject = ''
            }

            var obj = {
                type: 'PROPOSAL',
                value: $scope.currentProposal
            };
            WebSocketService.send(obj);

            $state.go('app.forum.base');
        };

        //Date picker
        $scope.today = function() {
            $scope.deathLine = new Date();
        };
        $scope.today();
        // $scope.start = $scope.minDate;
        $scope.start = $scope.deathLine;
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
            $scope.deathLine = new Date(year, month, day);
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

        $scope.visibleModifiedTaskState = false;
        $scope.visibleStartProject = false;

        $scope.changeVisibilityItems = function () {
            if ($scope.proposalType == 'Modified Task State') {
                $scope.getTaskByProjectsId();
                $scope.visibleModifiedTaskState = true;
                $scope.visibleStartProject = false;
            } else if ($scope.proposalType == 'Start Project') {
                $scope.visibleStartProject = true;
                $scope.visibleModifiedTaskState = false;
            } else {
                $scope.visibleStartProject = false;
                $scope.visibleModifiedTaskState = false;
            }
        };

        $scope.taskChange =  function () {
            if($scope.selectedTask != '') {
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
                            $scope.taskState = data[0].state;
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