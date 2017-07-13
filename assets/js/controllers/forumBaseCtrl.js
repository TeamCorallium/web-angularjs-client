'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseCtrl', ["$scope", "$rootScope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $rootScope, $state, toaster, WebSocketService, localStorageService, RestService) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.currentForumActive = '';
            $scope.userNameCommentActive = '';
            $scope.comment = {
                userId: '',
                fullName: '',
                projectId: '',
                value: '',
                creationDate: '',
                avatar: ''
            };
            $scope.proposalsProject = [];
            $scope.proposalsAvatarProject = [];
            $scope.proposalProjectTasks = [];
            $scope.comments = [];

            $scope.getUserName = function () {
                RestService.fetchUser(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.userNameCommentActive = data[0].fullName;
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getUserName();

            $scope.getProjectById = function () {
                RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.currentForumActive = data[0];

                            if (!$scope.currentForumActive.inverted &&
                                ($scope.currentForumActive.userId != localStorageService.get('currentUserId') &&
                                $scope.currentForumActive.ownerInvestedCapital <= 0)) {
                                $state.go('app.forum.allforum');
                            }
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProjectById();

            $scope.getProposalByProjectId = function () {
                RestService.fetchProposalByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.proposalsProject = data;
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProposalByProjectId();

            $scope.getTasksByProjectId = function () {
                RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.proposalProjectTasks = data;
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getTasksByProjectId();

            $scope.goToProposalById = function (proposalId) {
                localStorageService.set('currentProposalId', proposalId);

                for (var i=0; i<$scope.proposalsProject.length; i++) {
                    if ($scope.proposalsProject[i].id == proposalId) {
                        $scope.getVoteByProposalId(proposalId);
                    }
                }
            };

            $scope.getVoteByProposalId = function () {
                RestService.fetchAllVoteByProposalId(localStorageService.get('currentProposalId'))
                    .then(
                        function (data) {
                            $scope.allVotes = data;

                            var flag = false;

                            for (var i = 0; i < $scope.allVotes.length; i++) {
                                if ($scope.allVotes[i].userId == localStorageService.get('currentUserId')) {
                                    flag = true;
                                    break;
                                }
                            }

                            if (flag) {
                                $state.go('app.forum.viewvotation');
                            } else {
                                $state.go('app.forum.proposalview');
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getAllComments = function () {
                RestService.fetchAllCommentsById(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.comments = data;

                            for (var i = 0; i < $scope.comments.length; i++) {
                                $scope.getUserName($scope.comments[i].userId);
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getAllComments();

            $scope.createComment = function () {
                if($scope.comment.value != '' && $scope.comment.value != null) {
                    $scope.comment.userId = localStorageService.get('currentUserId');
                    $scope.comment.fullName = $scope.userNameCommentActive;
                    $scope.comment.projectId = localStorageService.get('currentProjectId');
                    $scope.comment.creationDate = new Date();
                    $scope.comment.avatar = $rootScope.user.avatar;

                    var obj = {
                        type: 'COMMENT',
                        value: $scope.comment
                    };

                    WebSocketService.send(obj);

                    $scope.comment.value = '';

                    $scope.getAllComments();
                } else {
                    toaster.pop('error', 'Error', 'Please write something before commenting.');
                }
            };

            $scope.stateArray = ['Under Construction', 'In Preparation', 'Active', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getDateMinutes = function (date) {
                var dateTemp = new Date(date);
                var dateTime = '';

                if (dateTemp.getMinutes() < 10) {
                    dateTime = "0" + dateTemp.getMinutes();
                } else {
                    dateTime = dateTemp.getMinutes();
                }

                return dateTime;
            };

            $scope.getDateHours = function (date) {
                var dateTemp = new Date(date);
                var dateTime = '';

                if (dateTemp.getHours() < 10) {
                    dateTime = "0" + dateTemp.getHours();
                } else if (dateTemp.getHours() > 12) {
                    dateTime = "0" + dateTemp.getHours() - 12;
                } else {
                    dateTime = dateTemp.getHours();
                }

                return dateTime;
            };

            $scope.getDateTime = function (date) {
                var dateTemp = new Date(date);
                var dateTime = '';
                if (dateTemp.getHours() == 0) {
                    dateTime = "12:" + $scope.getDateMinutes(date) + " am";
                } else if (dateTemp.getHours() < 12) {
                    dateTime = $scope.getDateHours(date) + ":" + $scope.getDateMinutes(date) + " am";
                } else if (dateTemp.getHours() == 12) {
                    dateTime = "12:" + $scope.getDateMinutes(date) + " pm";
                } else {
                    dateTime = $scope.getDateHours((date)) + ":" + $scope.getDateMinutes(date) + " pm";
                }

                return dateTime;
            };

            $scope.getProjectDate = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear() + " at " + $scope.getDateTime(date);
            };

            $scope.getDeathLine = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.getProposalTaskName = function (taskId) {
                var name = '';

                for (var i = 0; i < $scope.proposalProjectTasks.length; i++) {
                    if ($scope.proposalProjectTasks[i].id == taskId) {
                        name = $scope.proposalProjectTasks[i].name;
                        break;
                    }
                }

                return name;
            };

            $scope.goToProfileView = function (userId) {
                localStorageService.set('viewUserProfileId', userId);
                if (localStorageService.get('currentUserId') == userId) {
                    $state.go('app.pages.user');
                } else {
                    $state.go('app.pages.exploreuser');
                }
            };
        }
    }]);