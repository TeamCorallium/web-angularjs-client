'use strict';
/**
 * controller for User Projects
 */
app.controller('ProjectCreateCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.warningConstruction = function () {
            toaster.pop('warning', 'Under Construction', 'Yo can not create that kind of project.');
        };

    }]);
