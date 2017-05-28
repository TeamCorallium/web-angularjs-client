'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

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

        $scope.newComment = '';
        $scope.sendMessageTest = function() {
            console.log($scope.newComment);
            // dataStream.send($scope.newComment);
            $scope.newComment = '';
        };

        //Array for all proposal of one project
        $scope.proposalsProject = [];

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

        $scope.goToProposalById = function (proposalId) {
            localStorageService.set('currentProposalId', proposalId);
            $state.go('app.forum.proposalview');
        };
    }]);