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
            zipCode: '',
            city: '',
            avatar: '',
            twitter: '',
            github: '',
            facebook: '',
            linkedin: '',
            google: '',
            skype: '',
            phone: '',
            birthday: '',
            identityCard: '',
            industries: '',
            skills: '',
            experiencies: '',
            previusWorks: ''
        };

        $scope.updateSessionInfo = function () {
            localStorageService.set('isLogged', $scope.user.id != '');
            localStorageService.set('currentUserId', $scope.user.id);
            $rootScope.$broadcast('sessionChanged');
        };

        $scope.signin = function () {
            if($scope.user.email != '' && $scope.user.password != '') {
                RestService.fetchUser($scope.user.email)
                    .then(
                        function(data) {
                            if(data.length > 0){
                                if(data[0].password == $scope.user.password) {
                                    $scope.user.id = data[0].id;
                                    $scope.updateSessionInfo();
                                    $scope.userFirstName(data[0].email, data[0].avatar);

                                    //open websocket
                                    WebSocketService.open();

                                    $state.go('app.default');

                                } else {
                                    toaster.pop('error', 'Error', 'Wrong password.');
                                }
                            } else {
                                toaster.pop('error', 'Error', 'User not exist.');
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

        $scope.userFirstName = function (email, avatar) {
            $rootScope.user.name =  email.split("@")[0];
            $rootScope.user.avatar = avatar;
        }
    }]);