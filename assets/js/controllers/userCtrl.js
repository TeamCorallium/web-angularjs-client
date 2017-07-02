'use strict';
/**
 * controller for User Profile Example
 */
app.controller('UserCtrl', ["$scope", "$state", "flowFactory", "RestService", "toaster", "localStorageService", "$rootScope", "$window",
    function ($scope, $state, flowFactory, RestService, toaster, localStorageService, $rootScope, $window) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {

            $scope.noImage = false;
            $scope.obj = new Flow();

            $scope.allActivities = '';
            $scope.comments = [];

            $scope.removeImage = function () {
                $scope.noImage = true;
                $rootScope.$broadcast('imageRemoved');
                console.log("removeImage");
            };

            $rootScope.$on('profilePictureChanged', function (event, opt) {
                $scope.userInfo.avatar = RestService.uploads + opt.layout;
                $scope.noImage = false;
            });

            $scope.getAllActivities = function () {
                RestService.fetchAllActivities(localStorageService.get('currentUserId'))
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

            $scope.getBirthday = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

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
                id: '',
                birthday: '',
                identityCard: '',
                industries: [],
                skills: [],
                experiencies: [],
                previusWorks: []
            };

            $scope.getUserData = function () {
                RestService.fetchUser(localStorageService.get('currentUserId'))
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
                            if (data[0].birthday == '') {
                                $scope.userInfo.birthday = new Date();
                            } else {
                                $scope.userInfo.birthday = new Date(data[0].birthday);
                            }
                            $scope.userInfo.identityCard = data[0].identityCard;
                            $scope.userInfo.industries = data[0].industries;
                            $scope.userInfo.skills = data[0].skills;
                            $scope.userInfo.experiencies = data[0].experiencies;
                            $scope.userInfo.previusWorks = data[0].previusWorks;
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

            $scope.getAllComments = function () {
                RestService.fetchAllCommentsByUserId(localStorageService.get('currentUserId'))
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

            if ($scope.userInfo.avatar == '') {
                $scope.noImage = true;
            }

            $scope.saveUserAcount = function () {
                RestService.updateUser($scope.userInfo)
                    .then(
                        function(data) {
                            $rootScope.user.avatar = $scope.userInfo.avatar;
                            $rootScope.user.name =  $scope.userInfo.email.split("@")[0];
                            toaster.pop('success', 'Success', 'User updated correctly.');
                        },
                        function(errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            //Date picker
            $scope.today = function () {
                $scope.userInfo.birthday = new Date();
            };

            $scope.today();

            $scope.start = $scope.userInfo.birthday;
            $scope.end = $scope.maxDate;

            $scope.clear = function () {
                $scope.dt = null;
            };

            $scope.datepickerOptions = {
                showWeeks: false,
                startingDay: 1
            };

            $scope.dateDisabledOptions = {
                dateDisabled: disabled,
                showWeeks: false,
                startingDay: 1
            };

            $scope.startOptions = {
                showWeeks: false,
                startingDay: 1,
                minDate: $scope.minDate,
                maxDate: $scope.maxDate
            };

            $scope.endOptions = {
                showWeeks: false,
                startingDay: 1,
                minDate: $scope.minDate,
                maxDate: $scope.maxDate
            };
            // Disable weekend selection
            function disabled(data) {
                var date = data.date, mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            $scope.setDate = function (year, month, day) {
                $scope.userInfo.birthday = new Date(year, month, day);
            };

            $scope.toggleMin = function () {
                $scope.datepickerOptions.minDate = $scope.datepickerOptions.minDate ? null : new Date();
                $scope.dateDisabledOptions.minDate = $scope.dateDisabledOptions.minDate ? null : new Date();
            };

            $scope.maxDate = new Date(2020, 5, 22);
            $scope.minDate = new Date(1970, 12, 31);

            $scope.open = function () {
                $scope.opened = !$scope.opened;
            };

            $scope.openDatePickers = [];

            $scope.openTest = function ($event, datePickerIndex) {
                $event.preventDefault();
                $event.stopPropagation();
                if ($scope.openDatePickers[datePickerIndex] === true) {
                    $scope.openDatePickers.length = 0;
                } else {
                    $scope.openDatePickers.length = 0;
                    $scope.openDatePickers[datePickerIndex] = true;
                }
            };

            $scope.endOpen = function () {
                $scope.endOptions.minDate = $scope.start;
                $scope.startOpened = false;
                $scope.endOpened = !$scope.endOpened;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            $scope.hstep = 1;
            $scope.mstep = 15;

            $scope.goToLink = function (link) {
                $window.location.href = link;
            };

            $scope.passwordStruct = {
                oldPassword: '',
                newPassword: '',
                newPasswordAgain: ''
            };

            $scope.changePassword = function () {


                if ($scope.passwordStruct.oldPassword != '') {if ( $scope.passwordStruct.newPassword != '') {
                    if ($scope.passwordStruct.newPasswordAgain != '') {
                        if ($scope.passwordStruct.oldPassword == $scope.userInfo.password) {
                            if ($scope.passwordStruct.newPassword == $scope.passwordStruct.newPasswordAgain) {
                                $scope.userInfo.password = $scope.passwordStruct.newPassword;
                                $scope.saveUserAcount();
                                $scope.passwordStruct.newPassword = '';
                                $scope.passwordStruct.oldPassword = '';
                                $scope.passwordStruct.newPasswordAgain = '';
                            } else {
                                toaster.pop('error', 'Error', 'Password not match');
                            }
                        } else {
                            toaster.pop('error', 'Error', 'The current password is wrong');
                        }
                    } else {
                        toaster.pop('error', 'Error', 'Please introduce the new password again');
                    }
                } else {
                    toaster.pop('error', 'Error', 'Please introduce the new password');
                }

                } else {
                    toaster.pop('error', 'Error', 'Please introduce the current password');
                }
            };
        }
    }]);