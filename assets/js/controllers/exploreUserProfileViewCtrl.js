'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreUserProfileViewCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.noImage = false;

        $scope.userInfo = {
            fullName: '',
            email: '',
            phone: '',
            gender: '',
            zipCode: '',
            city: '',
            avatar: '',
            twitter: '',
            github: '',
            facebook: '',
            linkedin: '',
            google: '',
            skype: '',
            password: '',
            projectsFollow: [],
            id: ''
        };

        $scope.getUserData = function () {
            RestService.fetchUser(localStorageService.get('viewUserProfileId'))
                .then(
                    function(data) {
                        $scope.userInfo.fullName = data[0].fullName;
                        $scope.userInfo.email = data[0].email;
                        $scope.userInfo.phone = data[0].phone;
                        $scope.userInfo.gender = data[0].gender;
                        $scope.userInfo.zipCode = data[0].zipCode;
                        $scope.userInfo.city = data[0].city;
                        $scope.userInfo.avatar = data[0].avatar;
                        $scope.userInfo.twitter = data[0].twitter;
                        $scope.userInfo.github = data[0].github;
                        $scope.userInfo.facebook = data[0].facebook;
                        $scope.userInfo.linkedin = data[0].linkedin;
                        $scope.userInfo.google = data[0].google;
                        $scope.userInfo.skype = data[0].skype;
                        $scope.userInfo.password = data[0].password;
                        $scope.userInfo.projectsFollow = data[0].projectsFollow;
                        $scope.userInfo.id = data[0].id;

                        if ($scope.userInfo.avatar == '') {
                            $scope.noImage = true;
                        }
                        else {
                            $scope.noImage = false;
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getUserData();

        if ($scope.userInfo.avatar == '') {
            $scope.noImage = true;
        }


        $scope.obj = new Flow();

        $scope.allActivities = '';
        $scope.comments = [];

        $scope.getAllActivities = function () {
            RestService.fetchAllActivities(localStorageService.get('viewUserProfileId'))
                .then(
                    function(data) {
                        $scope.allActivities =  data;
                    },
                    function(errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllActivities();

        $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            var today = new Date();

            if(dateTemp.getMonth() == today.getMonth() && dateTemp.getDate() == today.getDate() && dateTemp.getFullYear() == today.getFullYear()){
                if(today.getHours() == dateTemp.getHours()) {
                    if(today.getMinutes() == dateTemp.getMinutes()) {
                        return 'a few seconds ago';
                    } else {
                        return today.getMinutes()-dateTemp.getMinutes() + " minutes ago";
                    }
                } else {
                    if (today.getHours()-dateTemp.getHours() > 1) {
                        return today.getHours()-dateTemp.getHours() + " hours ago";
                    } else  {
                        return today.getHours()-dateTemp.getHours() + " hour ago";
                    }
                }
            } else {
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
            }
        };

        $scope.getAllComments = function () {
            RestService.fetchAllCommentsByUserId(localStorageService.get('viewUserProfileId'))
                .then(
                    function(data) {
                        $scope.comments =  data;
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllComments();
    }]);
