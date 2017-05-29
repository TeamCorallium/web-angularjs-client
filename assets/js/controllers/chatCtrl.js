'use strict';
/**
 * controller for Messages
 */
app.controller('ChatCtrl', ["$scope", "$rootScope", "RestService", "localStorageService", "WebSocketService", "$timeout",
    function ($scope, $rootScope, RestService, localStorageService, WebSocketService, $timeout) {

    $scope.selfIdUser = localStorageService.get('currentUserId');;
    $scope.otherIdUser;

    $scope.setOtherId = function (value) {
        $scope.otherIdUser = value;
        var id = localStorageService.get('currentUserId');
        $scope.getChatMessages(id);
    };

    var exampleDate = new Date().setTime(new Date().getTime() - 240000 * 60);

    $scope.connectedUsers = [];

    $scope.chat = [
    // {
    //     "user": "Peter Clark",
    //     "avatar": "assets/images/avatar-1.jpg",
    //     "to": "Nicole Bell",
    //     "date": exampleDate,
    //     "content": "Hi, Nicole",
    //     "idUser": 1,
    //     "idOther": 2
    // }, {
    //     "user": "Peter Clark",
    //     "avatar": "assets/images/avatar-1.jpg",
    //     "to": "Nicole Bell",
    //     "date": new Date(exampleDate).setTime(new Date(exampleDate).getTime() + 1000 * 60),
    //     "content": "How are you?",
    //     "idUser": 50223456,
    //     "idOther": 50223457
    // }
    ];

    $scope.getConnectedUsers = function (userId) {
        $scope.selfIdUser = localStorageService.get('currentUserId');
        RestService.fetchConnectedUsers(userId)
            .then(
                function(data) {
                    $scope.connectedUsers = data;
                    console.log(data[0]);
                },
                function(errResponse) {
                    console.log(errResponse);
                }
            );
    };

    $scope.getChatMessages = function (userId) {
        $scope.selfIdUser = localStorageService.get('currentUserId');
        RestService.fetchChatMessages(userId)
            .then(
                function(data) {
                    $scope.chat = data;
                    console.log(data);
                },
                function(errResponse) {
                    console.log(errResponse);
                }
            );
    };    

    $rootScope.$on('new-user-connected', function() {
        console.log("chat........new user..." + localStorageService.get('isLogged'));
        if (localStorageService.get('isLogged')) {
            var userId = localStorageService.get('currentUserId');
            $scope.getConnectedUsers(userId);
        }
    });

    $rootScope.$on('new-chat-message', function() {
        console.log("chat........new message..." + localStorageService.get('isLogged'));
        if (localStorageService.get('isLogged')) {
            var userId = localStorageService.get('currentUserId');
            $scope.getChatMessages(userId);
        }
    });

    $scope.sendMessage = function () {
        console.log('self:'+$scope.selfIdUser + ' other:'+ $scope.otherIdUser)
        var newMessage = {
            "user": $rootScope.user.name,
            "avatar": "assets/images/default-user.png",
            "date": new Date(),
            "content": $scope.chatMessage,
            "idUser": $scope.selfIdUser,
            "idOther": $scope.otherIdUser
        };
        // $scope.chat.push(newMessage);
        $scope.chatMessage = '';

        var obj = {
            type: 'CHAT',
            value: newMessage
        };
        WebSocketService.send(obj);
    };

    $scope.intervalFunction = function(){
        $timeout(function() {

            if (localStorageService.get('isLogged')) {
                var userId = localStorageService.get('currentUserId');
                $scope.getConnectedUsers(userId);
            }

            $scope.intervalFunction();
        }, 60000)
    };

    // Kick off the interval
    $scope.intervalFunction();    
}]);
