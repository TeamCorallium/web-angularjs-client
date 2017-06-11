'use strict';
/**
 * controller for User Profile Example
 */
app.controller('TopNavBarCtrl', ["$scope", "$state", "flowFactory", "RestService", "toaster", "localStorageService", "$rootScope", "WebSocketService",
    function ($scope, $state, flowFactory, RestService, toaster, localStorageService, $rootScope, WebSocketService) {

        $scope.email = '';

        $scope.logout = function () {
            if(localStorageService.get('isLogged')) {
                localStorageService.set('isLogged', false);
                localStorageService.remove('currentUserId');
                localStorageService.remove('currentProjectId');

                WebSocketService.close();
                $rootScope.$broadcast('sessionChanged');
                $state.go('app.default');
            } else {
                toaster.pop('error', 'Error', 'Not logged in.');
            }
        };
    }]);