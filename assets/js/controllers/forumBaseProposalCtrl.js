'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseProposalCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        $scope.getProjectById = function(){
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentForumActive =  data[0];
                        console.log($scope.currentForumActive.projectName + " currentForumActive");
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();

        $scope.proposalTitle = '';
        $scope.proposalContent = '';
        $scope.itemSubject = '';
        $scope.currentForumActive = '';

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
    }]);