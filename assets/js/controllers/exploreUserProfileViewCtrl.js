'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreUserProfileViewCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster", "SweetAlert",
    function ($scope, localStorageService, RestService, $state, toaster, SweetAlert) {

        $scope.currentExploreUserId = '';

        $scope.getUserData = function () {
            RestService.fetchUser(localStorageService.get('viewUserProfileId'))
                .then(
                    function(data) {
                        $scope.currentExploreUserId = data[0];
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getUserData();
    }]);
