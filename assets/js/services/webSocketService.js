'use strict';

app.factory('WebSocketService', ["$websocket", "localStorageService", "$rootScope", "$timeout",
    function($websocket, localStorageService, $rootScope, $timeout) {

        console.log('WebSocketService....');
        
        var intervalFunction = function() {
            $timeout(function() {
                if (localStorageService.get('isLogged')) {
                    var userId = localStorageService.get('currentUserId');
                    
                    if (angular.isObject(ws)) {
                        if (ws.readyState > 2) {
                            wsBinding();
                        }
                    }
                }
                intervalFunction();
            }, 20000)
        };
        intervalFunction();

        var ws = '';
        var wsBinding = function() {

            ws = $websocket('ws://10.8.25.241:9090/CoralliumRestAPI/ws?userId='+localStorageService.get('currentUserId'));

            // ws = $websocket('ws://127.0.0.1:9090/CoralliumRestAPI/ws?userId='+localStorageService.get('currentUserId'));

            ws.onMessage(function(message) {
                console.log("WebSocketService:onMessage: " + message.data);

                if(message.data == 'NOTIFICATION') {
                    $rootScope.$broadcast('new-notification');
                    console.log("WebSocketService:new-notification");
                }
                if (message.data == 'NEW-USER-CONNECTED') {
                    $rootScope.$broadcast('new-user-connected');
                    console.log("WebSocketService:new-user-connected");
                }
                if (message.data == 'NEW-CHAT-MESSAGE') {
                    $rootScope.$broadcast('new-chat-message');
                    console.log("WebSocketService:new-chat-message");
                }
            });

            ws.onOpen(function() {
                console.log('WebSocketService:onOpen');
            });

            ws.onClose(function() {
                console.log('WebSocketService:onClose');
            });

            ws.onError(function() {
                console.log('WebSocketService:onError');
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
                wsBinding();
            },
            close: function() {
                ws.close();
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
