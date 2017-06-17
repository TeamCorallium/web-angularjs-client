'use strict';
/**
 * controller for User Profile Example
 */
app.controller('SignUpCtrl', ["$scope", "$state", "flowFactory", "RestService", "toaster", "localStorageService", "$rootScope", "WebSocketService",
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
            dayBirth: '',
            identityCard: '',
            industries: '',
            skills: '',
            experiencies: '',
            previusWorks: ''
        };

        $scope.password_again = '';
        $scope.term_check = '';

        $scope.updateSessionInfo = function () {
            localStorageService.set('isLogged', $scope.user.id != '');
            localStorageService.set('currentUserId', $scope.user.id);
            $rootScope.$broadcast('sessionChanged');
        };

        $scope.signup = function() {
            if($scope.user.fullName != '' && $scope.user.email != '' &&
                $scope.user.gender != '' && $scope.user.password != '') {
                if($scope.user.password == $scope.password_again) {
                    if($scope.term_check == true) {
                        RestService.createUser($scope.user)
                            .then(
                                function(data) {
                                    if(data == -1) {
                                        toaster.pop('error', 'Error', 'Email in use. Please use another email to sign up.');
                                    } else {
                                        $scope.user.id = data;
                                        $scope.userFirstName($scope.user.email);
                                        $scope.updateSessionInfo();
                                        $state.go('app.default');

                                        //open websocket
                                        WebSocketService.open();
                                    }
                                },
                                function(errResponse) {
                                    toaster.pop('error', 'Error', 'Server not available.');
                                    console.log(errResponse);
                                }
                            );
                    } else {
                        toaster.pop('error', 'Error', 'Please accept the terms and conditions in this step before proceeding.');
                    }
                } else {
                    toaster.pop('error', 'Error', 'Passwords not match.');
                }
            } else {
                toaster.pop('error', 'Error', 'Please complete the form in this step before proceeding.');
            }
        };

        $scope.userFirstName = function (email) {
            $rootScope.user.name =  email.split("@")[0];
            $rootScope.user.avatar = 'assets/images/default-user.png';
        }
    }]);