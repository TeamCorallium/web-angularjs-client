'use strict';
/**
 * controller for User Projects
 */
app.controller('ModifiedTaskCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.currentProjectActive = '';
        $scope.currentTaskActive = {
            name: '',
            description: '',
            cost: '',
            outcome: '',
            startDate: '',
            duration: '',
            state: ''
        };

        $scope.getProjectById = function () {
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentProjectActive =  data[0];
                    },
                    function(errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();

        $scope.getTaskByTaskId = function () {
            RestService.fetchTaskByTaskId(localStorageService.get('currentTaskId'))
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
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getTaskByTaskId();

        $scope.getValueIndex = function () {
            return $scope.currentTaskActive.state;
        };

        //Date Picker
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
            $scope.currentTaskActive.startDate = new Date(year, month, day);
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
            $scope.endOptions.minDate = $scope.currentTaskActive.startDate;
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

        $scope.updateTask = function () {
            RestService.updateTask($scope.currentTaskActive)
                .then(
                    function(data) {
                        $state.go('app.project.task_detail');
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

    }]);
