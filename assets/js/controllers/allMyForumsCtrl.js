'use strict';
/**
 * controller for User Projects
 */
app.controller('AllMyForumsCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        $scope.allMyForums = [];

        $scope.getAllMyForums = function () {
            RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
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

        $scope.goToForum = function (projectId) {
            localStorageService.set('currentProjectId',projectId);
            $state.go('app.forum.base');
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
    }]);