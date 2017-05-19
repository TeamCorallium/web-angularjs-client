/**
 * Created by Ale on 5/17/2017.
 */

app.controller('NotificationCtrl', ["$scope", "$rootScope", "localStorageService",
    function($scope, $rootScope, localStorageService) {

        $scope.scopeVariable = 0;

        // var dataStream = $websocket('ws://10.8.25.241:9090/CoralliumRestAPI/ws?userId='+localStorageService.get('currentUserId'));

        // dataStream.onMessage(function(message) {
        //     console.log(message.data);
        //     if(message.data == "NOTIFICATION") {
        //         $scope.scopeVariable++;
        //     }
        // });

        $rootScope.$on('newNotification', function() {
            $scope.scopeVariable++;
        });
        
        $scope.notifications = [];
        $scope.currentNotification = {
            "from" : '',
            "date" : '',
            "subject" : '',
            "read" : '',
            "content" : '',
            "avatar" : 'assets/images/default-user.png',
            "type": ''
        };

    }]);