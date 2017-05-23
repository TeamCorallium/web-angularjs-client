'use strict';

app.factory('WebSocketService', ["$websocket", "localStorageService", "$rootScope",
    function($websocket, localStorageService, $rootScope) {

    console.log('WebSocketService....');

    var ws = '';
    var wsBinding = function() {
        ws = $websocket('ws://10.8.25.241:9090/CoralliumRestAPI/ws?userId='+localStorageService.get('currentUserId'));

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
    }

    if(localStorageService.get('currentUserId')) {
        console.log('WebSocketService: OPEN***');
        wsBinding();
    }

    return {
        status: function() {
            return ws.readyState;
        },
        open: function() {
            // ws = $websocket('ws://127.0.0.1:9090/CoralliumRestAPI/ws?userId='+localStorageService.get('currentUserId'));
            wsBinding();
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
