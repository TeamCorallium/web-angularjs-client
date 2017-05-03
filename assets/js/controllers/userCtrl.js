'use strict';
/** 
  * controller for User Profile Example
*/
app.controller('UserCtrl', ["$scope", "flowFactory", "RestService",function ($scope, flowFactory, RestService) {
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

    $scope.signup = function() {
        console.log('signup');
        console.log('signup' + $scope.user.user + ' ' + $scope.user.password);

        // RestService.fetchUser('1');
        RestService.createUser($scope.user)
            .then(
                function(data) {
                    $scope.user = data;
                    console.log('ok ok ok ok');
                },
                function(errResponse){
                    console.log('Error while fetching Currencies');
                }
        );
    }; 
}]);