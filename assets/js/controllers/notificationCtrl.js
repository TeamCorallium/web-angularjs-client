/**
 * Created by Ale on 5/17/2017.
 */

app.controller('NotificationCtrl', ["$scope", "$rootScope", "localStorageService", "RestService", "$state",
    function($scope, $rootScope, localStorageService, RestService, $state) {

        $scope.scopeVariable = 0;

        $rootScope.$on('new-notification', function() {
            $scope.scopeVariable++;
        });

        $scope.notifications = [];
        $scope.currentNotification = {
            userId: '',
            from: '',
            date: '',
            subject: '',
            read: '',
            content: '',
            avatar: 'assets/images/default-user.png',
            type: ''
        };

        $scope.getNotificationsByUserId = function () {
            RestService.fetchAllNotifications(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.notifications = data;
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getNotificationsByUserId();

        $scope.goToNotificationPage = function () {
            $scope.scopeVariable = 0;
            $state.go('app.notification');
        };

        $scope.goToProposal = function (projectId, proposalId) {
            localStorageService.set('currentProjectId',projectId);
            localStorageService.set('currentProposalId',proposalId);
            $state.go('app.forum.proposalview');
        };
    }]);