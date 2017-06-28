'use strict';
/**
 * controller for User Profile Example
 */
app.controller('TopNavBarCtrl', ["$scope", "$state", "flowFactory", "RestService", "toaster", "localStorageService", "$rootScope", "WebSocketService",
    function ($scope, $state, flowFactory, RestService, toaster, localStorageService, $rootScope, WebSocketService) {

        $scope.email = '';

        $scope.clogout = function () {
            if(localStorageService.get('isLogged')) {
                localStorageService.set('isLogged', false);
                localStorageService.remove('currentUserId');
                localStorageService.remove('currentProjectId');

                WebSocketService.close();
                $rootScope.user.avatar = 'assets/images/default-user.png';
                $rootScope.$broadcast('sessionChanged');
                $state.go('app.default');
            } else {
                toaster.pop('error', 'Error', 'Not logged in.');
            }
        };
    }]);