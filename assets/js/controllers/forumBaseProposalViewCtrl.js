'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseProposalViewCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        $scope.currentForumActive = '';
        $scope.currentTaskProposalView = '';
        $scope.viewVoteResults = false;
        $scope.userVote = false;
        $scope.allVotes = [];

        $scope.countVotes = {
            yes: 0,
            no: 0,
            abs: 0
        };

        $scope.getVoteByProposalId = function () {
            RestService.fetchAllVoteByProposalId(localStorageService.get('currentProposalId'))
                .then(
                    function(data) {
                        $scope.allVotes =  data;

                        $scope.calculateVotes();

                        for (var  i=0; i<$scope.allVotes.length; i++) {
                            if ($scope.allVotes[i].userId == localStorageService.get('currentUserId')) {
                                $scope.userVote = true;
                                break;
                            }
                        }
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getVoteByProposalId();

        $scope.calculateVotes = function () {
            for (var i=0; i<$scope.allVotes.length; i++) {
                if ($scope.allVotes[i].value == 'yes') {
                    $scope.countVotes.yes += 1;
                } else if ($scope.allVotes[i].value == 'no') {
                    $scope.countVotes.no += 1;
                } else {
                    $scope.countVotes.abs += 1;
                }
            }
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

        $scope.currentVote = {
            userId: '',
            projectId: '',
            proposalId: '',
            value: ''
        };

        $scope.voteUserA = 'yes';
        $scope.voteUser = 'yes';

        $scope.setVote = function () {
            $scope.currentVote.userId = localStorageService.get('currentUserId');
            $scope.currentVote.projectId = localStorageService.get('currentProjectId');
            $scope.currentVote.proposalId = localStorageService.get('currentProposalId');

            if($scope.viewVoteResults) {
                $scope.currentVote.value = $scope.voteUserA;
            } else {
                $scope.currentVote.value = $scope.voteUser;
            }

            var obj = {
                type: 'VOTE',
                value: $scope.currentVote
            };
            WebSocketService.send(obj);

            $state.go('app.forum.base');
        };
    }]);