/**
 * Created by Ale on 5/17/2017.
 */

app.controller('NotificationCtrl', ["$scope", "$rootScope", "localStorageService", "RestService",
    function($scope, $rootScope, localStorageService, RestService) {

        $scope.scopeVariable = 0;

        $rootScope.$on('newNotification', function() {
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

    }]);