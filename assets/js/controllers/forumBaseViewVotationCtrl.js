'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseViewVotationCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        $scope.currentForumActive = '';
        $scope.currentTaskProposalView = '';
        $scope.viewVoteResults = false;
        $scope.userVote = false;
        $scope.allVotes = [];
        $scope.allUserName = [];
        $scope.allUserRol = [];

        $scope.countVotes = {
            yes: 0,
            no: 0,
            abs: 0
        };

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

        $scope.getVoteByProposalId = function () {
            RestService.fetchAllVoteByProposalId(localStorageService.get('currentProposalId'))
                .then(
                    function(data) {
                        $scope.allVotes =  data;

                        $scope.calculateVotes();

                        for (var i=0; i<$scope.allVotes.length; i++) {
                            $scope.getUserName($scope.allVotes[i].userId);
                        }
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getVoteByProposalId();

        $scope.getUserName = function (userId) {
            RestService.fetchUser(userId)
                .then(
                    function(data) {
                        $scope.allUserName.push(data[0].fullName);
                        if(userId == $scope.currentForumActive.userId) {
                            $scope.allUserRol.push('Owner');
                        } else {
                            $scope.allUserRol.push('Financer');
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };



        $scope.calculateVotes = function () {
            for (var i=0; i<$scope.allVotes.length; i++) {
                if ($scope.allVotes[i].value == 'yes') {
                    $scope.countVotes.yes += $scope.allVotes[i].percent;
                } else if ($scope.allVotes[i].value == 'no') {
                    $scope.countVotes.no += $scope.allVotes[i].percent;
                } else {
                    $scope.countVotes.abs += $scope.allVotes[i].percent;
                }
            }
        };

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

                        if($scope.currentProposalView.type == 'Modified Task') {
                            $scope.getTaskByTaskId($scope.currentProposalView.itemSubject);
                        }
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProposalById();

        $scope.getTaskByTaskId = function (taskId) {
            RestService.fetchTaskByTaskId(taskId)
                .then(
                    function(data) {
                        $scope.currentTaskProposalView =  data[0];
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.showVotesResult = function () {

            if($scope.viewVoteResults) {
                $scope.viewVoteResults = false;
            } else {
                $scope.viewVoteResults = true;
            }
        };

        $scope.showVoteValue = function (vote) {
            var value = '';
            if(vote == 'yes') {
                value = 'YES';
            } else if (vote == 'no') {
                value = 'NO';
            } else {
                value = 'ABS';
            }
            return value;
        }
    }]);