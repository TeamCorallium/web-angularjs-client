'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        $scope.newComment = '';
        $scope.sendMessageTest = function() {
            console.log($scope.newComment);
            // dataStream.send($scope.newComment);
            $scope.newComment = '';
        };

        $scope.proposalTitle = '';
        $scope.proposalContent = '';
        $scope.itemSubject = '';

        $scope.proposalsProject = [];
        $scope.currentProposal = {
            id: '',
            name: '',
            proposalContent: '',
            itemSubject: '',
            projectId: '',
            proposalOwnerId: '',
        };

        $scope.createProposal = function () {
            $scope.currentProposal.name = $scope.proposalTitle;
            $scope.currentProposal.proposalContent = $scope.proposalContent;
            $scope.currentProposal.itemSubject = $scope.itemSubject;
            $scope.currentProposal.projectId = localStorageService.get('currentProjectId');
            $scope.currentProposal.proposalOwnerId = localStorageService.get('currentUserId');

            var obj = {
                type: 'PROPOSAL',
                value: $scope.currentProposal
            };
            WebSocketService.send(obj);
            // WebSocketService.send($scope.currentProposal);
        };

        $scope.getProposalByProjectId= function(){
            RestService.fetchProposalByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.proposalsProject =  data;
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProposalByProjectId();

        $scope.goToTaskByTaskId = function (proposal) {
            $scope.currentProposal = proposal;
            $state.go('app.forum.proposalview');
        };

        $scope.allMyForums = [];

        $scope.getAllMyForums = function () {
            RestService.fetchAllForums(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.allMyForums =  data;
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllMyForums();
    }]);
