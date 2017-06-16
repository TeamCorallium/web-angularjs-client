'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreUserProfileViewCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {
        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.currentExploreUserId = '';

            $scope.getUserData = function () {
                RestService.fetchUser(localStorageService.get('viewUserProfileId'))
                    .then(
                        function (data) {
                            $scope.currentExploreUserId = data[0];
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getUserData();
        }
    }]);
