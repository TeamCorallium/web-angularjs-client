'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumCtrl', ["$scope", "$state", "toaster", "$websocket", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, $websocket, localStorageService, RestService, $rootScope) {

        console.log('controller....');

        var dataStream = $websocket('ws://127.0.0.1:9090/CoralliumRestAPI/ws?userId='+localStorageService.get('currentUserId'));

        dataStream.onMessage(function(message) {
            console.log(message.data);
            if(message.data == 'NOTIFICATION') {
                $rootScope.$broadcast('newNotification');
                console.log("newNotification");
            }
        });

        dataStream.onOpen(function() {
            console.log('onOpen');
            // dataStream.send("hola mundo");
        });

        $scope.newComment = '';
        $scope.sendMessageTest = function() {
            console.log($scope.newComment);
            dataStream.send($scope.newComment);
            $scope.newComment = '';
        }

        $scope.proposalTitle = '';
        $scope.proposalContent = '';
        $scope.itemSubject = '';

        $scope.proposalsProject = [];
        $scope.currentProposal = {
            name: '',
            proposalContent: '',
            itemSubject: '',
            projectId: '',
        };

        $scope.createProposal = function () {
            $scope.currentProposal.name = $scope.proposalTitle;
            $scope.currentProposal.proposalContent = $scope.proposalContent;
            $scope.currentProposal.itemSubject = $scope.itemSubject;
            $scope.currentProposal.projectId = localStorageService.get('currentProjectId');
            dataStream.send($scope.currentProposal);
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
    }]);
