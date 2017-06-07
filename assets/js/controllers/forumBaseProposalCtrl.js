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
            $scope.currentProposal.proposalContent = $scope.proposalContent;
            $scope.currentProposal.projectId = localStorageService.get('currentProjectId');
            $scope.currentProposal.proposalOwnerId = localStorageService.get('currentUserId');
            $scope.currentProposal.state = 'publish';
            $scope.currentProposal.type = $scope.proposalType;
            $scope.currentProposal.deathLine = $scope.deathLine;
            $scope.currentProposal.date = new Date();

            if ($scope.currentProposal.type == 'Modified Task') {
                $scope.currentProposal.itemSubject = $scope.selectedTask.id;
            } else {
                $scope.currentProposal.itemSubject = '';
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

        $scope.visibleModifiedTask = false;

        $scope.changeVisibilityItems = function () {

            if ($scope.proposalType == 'Modified Task') {
                $scope.getTaskByProjectsId();
                $scope.visibleModifiedTask = true;
            } else {
                $scope.visibleModifiedTask = false;
            }
        };
    }]);