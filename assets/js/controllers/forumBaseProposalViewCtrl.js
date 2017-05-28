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
    }]);