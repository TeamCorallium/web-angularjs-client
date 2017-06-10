'use strict';
/**
 * controller for User Profile Example
 */
app.controller('SignInCtrl', ["$scope", "$state", "flowFactory", "RestService", "toaster", "localStorageService", "$rootScope", "WebSocketService",
    function ($scope, $state, flowFactory, RestService, toaster, localStorageService, $rootScope, WebSocketService) {

        $scope.user = {
            fullName: '',
            gender: '',
            email: '',
            password: '',
            id: '',
            projectsFollow: [],
        };

        $scope.password_again = '';
        $scope.term_check = '';

        $scope.updateSessionInfo = function () {
            localStorageService.set('isLogged', $scope.user.id != '');
            localStorageService.set('currentUserId', $scope.user.id);
            $rootScope.$broadcast('sessionChanged');
        };

        $scope.signin = function () {
            if($scope.user.email != '' || $scope.user.password != '') {
                RestService.fetchUser($scope.user.email)
                    .then(
                        function(data) {
                            if(data[0].password == $scope.user.password) {
                                $scope.user.id = data[0].id;
                                $scope.userFirstName(data[0].email);
                                $scope.updateSessionInfo();
                                $state.go('app.default');

                                //open websocket
                                WebSocketService.open();
                            } else {
                                toaster.pop('error', 'Error', 'Wrong password.');
                            }
                        },
                        function(errResponse){
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            } else {
                toaster.pop('error', 'Error', 'Introduce the username and password.');
            }
        };

        $scope.userFirstName = function (email) {
            $rootScope.user.name =  email.split("@")[0];
        }
    }]);