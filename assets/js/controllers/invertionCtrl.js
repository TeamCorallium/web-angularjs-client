/**
 * Created by Ale on 5/26/2017.
 */
'use strict';
/**
 * controller for User Projects
 */
app.controller('InvertionCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.invertion = {
            userId:'',
            projectId:'',
            amount:'',
            id:''
        };

        if(localStorageService.get('currentAmountInvestment')) {
            $scope.invertion.amount = localStorageService.get('currentAmountInvestment');
        }


        $scope.transferInvertion = function () {
            $scope.invertion.userId = localStorageService.get('currentUserId');
            $scope.invertion.projectId = localStorageService.get('currentProjectId');
            $scope.invertion.amount = localStorageService.get('currentAmountInvestment');
;
            $scope.invertion.id = '';

            RestService.createInvertion($scope.invertion)
                .then(
                    function(data) {
                        $scope.invertion.id = data;
                        localStorageService.set('currentInvertionId',data);
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getInvertionUserName = function () {
            RestService.fetchUser(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.invertionUserName = data[0].fullName;
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getInvertionUserName();
}]);
