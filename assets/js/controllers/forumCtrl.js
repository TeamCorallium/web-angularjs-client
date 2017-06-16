'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.newComment = '';
            $scope.sendMessageTest = function () {
                console.log($scope.newComment);
                // dataStream.send($scope.newComment);
                $scope.newComment = '';
            };

            $scope.proposalTitle = '';
            $scope.proposalContent = '';
            $scope.itemSubject = '';
            $scope.currentForumActive = '';

            //Array for all proposal of one project
            $scope.proposalsProject = [];

            //Actual proposal of the current project
            $scope.currentProposal = {
                id: '',
                name: '',
                proposalContent: '',
                itemSubject: '',
                projectId: '',
                proposalOwnerId: '',
                state: '',
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
            };

            $scope.createProposal = function () {
                $scope.currentProposal.name = $scope.proposalTitle;
                $scope.currentProposal.proposalContent = $scope.proposalContent;
                $scope.currentProposal.itemSubject = $scope.itemSubject;
                $scope.currentProposal.projectId = localStorageService.get('currentProjectId');
                $scope.currentProposal.proposalOwnerId = localStorageService.get('currentUserId');
                $scope.currentProposal.state = 'publish';

                var obj = {
                    type: 'PROPOSAL',
                    value: $scope.currentProposal
                };
                WebSocketService.send(obj);
                // WebSocketService.send($scope.currentProposal);

                $state.go('app.forum.base');
            };

            $scope.getProposalByProjectId = function () {
                RestService.fetchProposalByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.proposalsProject = data;
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProposalByProjectId();

            $scope.getProposalById = function (proposalId) {
                RestService.fetchProposalById(proposalId)
                    .then(
                        function (data) {
                            $scope.currentProposalView = data[0];
                            localStorageService.set('currentProposalId', $scope.currentProposalView.id);
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            if (localStorageService.get('currentProposalId') != null) {
                $scope.getProposalById(localStorageService.get('currentProposalId'));
            }

            $scope.goToProposalById = function (proposalId) {
                localStorageService.set('currentProposalId', proposalId);
                $scope.getProposalById(proposalId);
                $state.go('app.forum.proposalview');
            };

            $scope.goToTaskByTaskId = function (proposal) {
                $scope.currentProposal = proposal;
                $state.go('app.forum.proposalview');
            };

            $scope.getProjectById = function (projectId) {
                RestService.fetchProjectById(projectId)
                    .then(
                        function (data) {
                            $scope.currentForumActive = data[0];
                            console.log($scope.currentForumActive.projectName + " currentForumActive");
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            if (localStorageService.get('currentProjectId') != null) {
                $scope.getProjectById(localStorageService.get('currentProjectId'));
            }
        }
    }]);