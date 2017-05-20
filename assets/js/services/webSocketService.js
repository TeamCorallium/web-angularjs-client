'use strict';

app.factory('WebSocketService', ["$websocket", "localStorageService", "$rootScope", 
    function($websocket, localStorageService, $rootScope) {

    console.log('WebSocketService....');

    var ws = '';

    ws.onMessage(function(message) {
        console.log("WebSocketService:onMessage: " + message.data);

        if(message.data == 'NOTIFICATION') {
            $rootScope.$broadcast('newNotification');
            console.log("WebSocketService:newNotification");
        }
    });

    ws.onOpen(function() {
        console.log('WebSocketService:onOpen');
    });

    return {
        status: function() {
            return ws.readyState;
        },
        open: function() {
            ws = $websocket('ws://localhost:9090/CoralliumRestAPI/ws?userId='+localStorageService.get('currentUserId'));
        },
        send: function(message) {
            ws.send(message);
            console.log('WebSocketService:send: ' + message);
            // if (angular.isString(message)) {
            //     ws.send(message);
            // }
            // else if (angular.isObject(message)) {
            //     ws.send(JSON.stringify(message));
            // }
        }
    };
}]);
