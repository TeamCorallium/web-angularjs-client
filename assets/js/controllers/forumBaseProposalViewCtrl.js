'use strict';
/**
 * created by Ale
 */
app.controller('ForumBaseProposalViewCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.currentForumActive = '';
            $scope.currentTaskProposalView = [];
            $scope.viewVoteResults = false;
            $scope.allVotes = [];
            $scope.percent = 0;
            $scope.investmentUserProject = 0;
            $scope.investmentProject = 0;

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

                            if (localStorageService.get('currentUserId') == $scope.currentForumActive.userId && $scope.currentForumActive.ownerInvestedCapital <= 0) {
                                $state.go('app.forum.viewvotation');
                            }
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
                                if ($scope.allVotes[i].userId == localStorageService.get('currentUserId')) {
                                    $state.go('app.forum.viewvotation');
                                }
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
                deathLine: ''
            };

            $scope.getProposalById = function () {
                RestService.fetchProposalById(localStorageService.get('currentProposalId'))
                    .then(
                        function (data) {
                            $scope.currentProposalView = data[0];

                            for (var i=0; i<$scope.currentProposalView.proposalList.length; i++) {

                                if ($scope.currentProposalView.proposalList[i].type != 'Start Project') {
                                    $scope.getTaskByTaskId($scope.currentProposalView.proposalList[i].itemSubject);
                                } else {
                                    $scope.currentTaskProposalView.push('');
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
                            $scope.currentTaskProposalView.push(data[0]);
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.invertionByProjectId = function () {
                RestService.fetchInvertionByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.invertions = data;

                            if ($scope.currentForumActive.userId == localStorageService.get('currentUserId')) {
                                $scope.investmentUserProject += parseFloat($scope.currentForumActive.ownerInvestedCapital);
                            }

                            $scope.investmentProject += parseFloat($scope.currentForumActive.ownerInvestedCapital);

                            for (var i = 0; i < $scope.invertions.length; i++) {
                                if ($scope.invertions[i].userId == localStorageService.get('currentUserId')) {
                                    $scope.investmentUserProject = parseFloat($scope.invertions[i].amount);
                                }
                                $scope.investmentProject += parseFloat($scope.invertions[i].amount);
                            }

                            $scope.percent = parseFloat($scope.investmentUserProject) / parseFloat($scope.investmentProject) * 100.0;
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.invertionByProjectId();

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

            $scope.currentVote = {
                userId: '',
                projectId: '',
                proposalId: '',
                value: '',
                percent: ''
            };

            $scope.voteUser = 'yes';

            $scope.setVote = function () {
                $scope.currentVote.userId = localStorageService.get('currentUserId');
                $scope.currentVote.projectId = localStorageService.get('currentProjectId');
                $scope.currentVote.proposalId = localStorageService.get('currentProposalId');
                $scope.currentVote.percent = $scope.percent;

                $scope.currentVote.value = $scope.voteUser;

                var obj = {
                    type: 'VOTE',
                    value: $scope.currentVote
                };
                WebSocketService.send(obj);

                $state.go('app.forum.viewvotation');
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
        }
    }]);