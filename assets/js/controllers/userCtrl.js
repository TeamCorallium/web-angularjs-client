'use strict';
/**
 * controller for User Profile Example
 */
app.controller('UserCtrl', ["$scope", "$state","flowFactory", "RestService", "toaster" ,function ($scope, $state, flowFactory, RestService, toaster) {
    $scope.removeImage = function () {
        $scope.noImage = true;
    };
    $scope.obj = new Flow();

    $scope.userInfo = {
        firstName: 'Peter',
        lastName: 'Clark',
        url: 'www.example.com',
        email: 'peter@example.com',
        phone: '(641)-734-4763',
        gender: 'male',
        zipCode: '12345',
        city: 'London (UK)',
        avatar: 'assets/images/avatar-1-xl.jpg',
        twitter: '',
        github: '',
        facebook: '',
        linkedin: '',
        google: '',
        skype: 'peterclark82'
    };
    if ($scope.userInfo.avatar == '') {
        $scope.noImage = true;
    }

    $scope.user = {
        fullName: '',
        gender: '',
        email: '',
        password: '',
        id: ''
    };

    $scope.password_again = '';
    $scope.term_check = '';

    $scope.signup = function() {

        if($scope.user.fullName != '' && $scope.user.email != '' &&
            $scope.user.gender != '' && $scope.user.password != ''){
            if($scope.user.password == $scope.password_again){
                if($scope.term_check == true){
                    RestService.createUser($scope.user)
                        .then(
                            function(data) {
                                if(data == -1)
                                    toaster.pop('error', 'Error', 'Email in use. Please use another email to sign up.');
                            },
                            function(errResponse){
                                console.log(errResponse);
                            }
                        );
                }else{
                    toaster.pop('error', 'Error', 'Please accept the terms and conditions in this step before proceeding.');
                }
            }
        }
        else {
            toaster.pop('error', 'Error', 'Please complete the form in this step before proceeding.');
        }
    };

    $scope.signin = function () {
        if($scope.user.email != '' && $scope.user.password != ''){
            RestService.fetchUser($scope.user.email)
                .then(
                    function(data) {
                        if(data[0].password == $scope.user.password){
                            $state.go('app.default');
                        }
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        }else{
            toaster.pop('error', 'Error', 'Introduce the username and password.');
        }
    };
}]);