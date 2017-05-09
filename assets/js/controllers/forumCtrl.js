'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumCtrl', ["$scope", "$state", "toaster", "$websocket",
    function ($scope, $state, toaster, $websocket) {

        console.log('controller....');

        var dataStream = $websocket('ws://10.8.25.241:9090/CoralliumRestAPI/ws/');

        dataStream.onMessage(function(message) {
            console.log(message.data);
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
}]);
