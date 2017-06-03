'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseProposalViewCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        $scope.currentForumActive = '';

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

        //Actual proposal for proposal view
        $scope.currentProposalView = {
            id: '',
            name: '',
            proposalContent: '',
            itemSubject: '',
            projectId: '',
            proposalOwnerId: '',
            state: '',
            deathLine: ''
        };

        $scope.getProposalById= function(){
            RestService.fetchProposalById(localStorageService.get('currentProposalId'))
                .then(
                    function(data) {
                        $scope.currentProposalView =  data[0];
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProposalById();

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getDateMinutes = function (date) {
            var dateTemp = new Date(date);
            var dateTime = '';
            if(dateTemp.getMinutes()<10) {
                dateTime = "0"+dateTemp.getMinutes();
            } else {
                dateTime = dateTemp.getMinutes();
            }

            return dateTime;
        };

        $scope.getDateTime = function (date) {
            var dateTemp = new Date(date);
            var dateTime = '';
            if(dateTemp.getHours() < 12) {
                dateTime = "0"+dateTemp.getHours()+":"+$scope.getDateMinutes(date)+" am";
            } else if (dateTemp.getHours() == 12){
                dateTime = "12:"+$scope.getDateMinutes(date)+" pm";
            } else {
                dateTime = "0"+(dateTemp.getHours()-12)+":"+$scope.getDateMinutes(date)+" pm";
            }

            return dateTime;
        };

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear()+" at "+$scope.getDateTime(date);
        };
    }]);