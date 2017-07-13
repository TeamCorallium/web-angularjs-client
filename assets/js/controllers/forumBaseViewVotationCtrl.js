'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseViewVotationCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.currentForumActive = '';
            $scope.viewVoteResults = false;
            $scope.userVote = false;
            $scope.allVotes = [];
            $scope.allVoteAbstract = [];

            $scope.countVotes = {
                yes: 0,
                no: 0,
                abs: 0
            };

            $scope.stateArray = ['Under Construction', 'In Preparation', 'Active', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.getProjectById = function () {
                RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.currentForumActive = data[0];
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProjectById();

            $scope.getVoteByProposalId = function () {
                RestService.fetchAllVoteByProposalId(localStorageService.get('currentProposalId'))
                    .then(
                        function (data) {
                            $scope.allVotes = data;

                            $scope.calculateVotes();

                            for (var i = 0; i < $scope.allVotes.length; i++) {
                                var voteAbstract = {
                                    userId: $scope.allVotes[i].userId,
                                    name: '',
                                    value: $scope.allVotes[i].value,
                                    percent: $scope.allVotes[i].percent
                                };

                                $scope.allVoteAbstract.push(voteAbstract);
                                $scope.getUserName($scope.allVotes[i].userId);
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getVoteByProposalId();

            //Actual proposal for proposal view
            $scope.currentProposalView = {
                id: '',
                name: '',
                proposalContent: '',
                itemSubject: '',
                projectId: '',
                proposalOwnerId: '',
                state: '',
                deathLine: '',
                proposalList: ''
            };

            $scope.proposalAbstractView = [];

            $scope.getProposalById = function () {
                RestService.fetchProposalById(localStorageService.get('currentProposalId'))
                    .then(
                        function (data) {
                            $scope.currentProposalView = data[0];

                            for (var i=0; i<$scope.currentProposalView.proposalList.length; i++) {

                                var currentProposalViewAbstract = {
                                    id: $scope.proposalAbstractView.length+1,
                                    name: '',
                                    type: $scope.currentProposalView.proposalList[i].type,
                                    currentContent: $scope.currentProposalView.proposalList[i].currentContent,
                                    itemSubject: $scope.currentProposalView.proposalList[i].itemSubject,
                                    itemContent: $scope.currentProposalView.proposalList[i].itemContent
                                };

                                $scope.proposalAbstractView.push(currentProposalViewAbstract);

                                if ($scope.currentProposalView.proposalList[i].type != 'Start Project') {
                                    $scope.getTaskByTaskId($scope.currentProposalView.proposalList[i].itemSubject);
                                }
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProposalById();

            $scope.getTaskByTaskId = function (taskId) {
                RestService.fetchTaskByTaskId(taskId)
                    .then(
                        function (data) {

                            for (var i=0; i<$scope.proposalAbstractView.length; i++) {
                                if ($scope.proposalAbstractView[i].itemSubject == taskId) {
                                    $scope.proposalAbstractView[i].name = data[0].name;
                                }
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getUserName = function (userId) {
                RestService.fetchUser(userId)
                    .then(
                        function (data) {
                            var name = data[0].fullName;

                            for (var i=0; i<$scope.allVoteAbstract.length; i++) {
                                if ($scope.allVoteAbstract[i].userId == userId) {
                                    $scope.allVoteAbstract[i].name = name;
                                    break;
                                }
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.calculateVotes = function () {
                for (var i = 0; i < $scope.allVotes.length; i++) {
                    if ($scope.allVotes[i].value == 'yes') {
                        $scope.countVotes.yes += $scope.allVotes[i].percent;
                    } else if ($scope.allVotes[i].value == 'no') {
                        $scope.countVotes.no += $scope.allVotes[i].percent;
                    } else {
                        $scope.countVotes.abs += $scope.allVotes[i].percent;
                    }
                }
            };

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getProjectDate = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.showVotesResult = function () {

                if ($scope.viewVoteResults) {
                    $scope.viewVoteResults = false;
                } else {
                    $scope.viewVoteResults = true;
                }
            };

            $scope.showVoteValue = function (vote) {
                var value = '';
                if (vote == 'yes') {
                    value = 'YES';
                } else if (vote == 'no') {
                    value = 'NO';
                } else {
                    value = 'ABS';
                }
                return value;
            };
        }
    }]);