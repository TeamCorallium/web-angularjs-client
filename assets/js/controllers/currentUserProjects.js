'use strict';
/**
 * controller for User Projects
 */
app.controller('CurrentUserProjects', ["$scope", "localStorageService", "RestService", "$state", "toaster", "SweetAlert",
    function ($scope, localStorageService, RestService, $state, toaster, SweetAlert) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.simpleProjects = [];
            $scope.invertions = [];
            $scope.allProjects = [];
            $scope.owner = '';

            $scope.creationProjectDate = '';
            $scope.deathLineProject = '';

            $scope.listUserOwners = [];
            $scope.listAllUser = [];

            $scope.getProjectById = function (projectId) {
                RestService.fetchProjectById(projectId)
                    .then(
                        function (data) {
                            $scope.currentProjectActive = data[0];
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            if (localStorageService.get('currentProjectId') != null) {
                $scope.getProjectById(localStorageService.get('currentProjectId'));
            }

            $scope.getProjects = function () {

                if (localStorageService.get('isLogged')) {

                    RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                        .then(
                            function (data) {
                                $scope.simpleProjects = data;
                            },
                            function (errResponse) {
                                console.log(errResponse);
                            }
                        );
                }
            };

            $scope.getProjects();

            $scope.getAllProjects = function () {
                RestService.fetchAllProject(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.allProjects = data;

                            for (var i = 0; i < $scope.allProjects.length; i++) {
                                $scope.getUserName($scope.allProjects[i].userId);
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getAllProjects();

            $scope.getOwnerData = function () {
                RestService.fetchUser(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.owner = data[0];
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getOwnerData();

            $scope.getUserName = function (userId) {
                RestService.fetchUser(userId)
                    .then(
                        function (data) {
                            $scope.listUserOwners.push(data[0].fullName);
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.stateArray = ['Under Construction', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getCreationProject = function (DateProject) {
                var dateTemp = new Date(DateProject);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDay() + ", " + dateTemp.getFullYear();
            };

            $scope.getDeathLineProject = function (DeathLine) {
                var dateTemp = new Date(DeathLine);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDay() + ", " + dateTemp.getFullYear();
            };

            $scope.goToProject = function (projectId) {
                localStorageService.set('currentProjectId', projectId);
                $scope.getProjectById(projectId);
                $state.go('app.project.subproject_detail');
            };

            $scope.goToExploreProject = function (projectId) {
                localStorageService.set('currentProjectId', projectId);
                $scope.getProjectById(projectId);
                $state.go('app.project.explore_subproject');
            };

            $scope.goToOpportunities = function (projectId) {
                localStorageService.set('currentProjectId', projectId);
                $scope.getProjectById(projectId);
                $state.go('app.project.opportunities_detail');
            };

            $scope.deleteProject = function (projectId) {
                SweetAlert.swal({
                    title: "Are you sure?",
                    text: "Your will not be able to recover this imaginary file!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        RestService.deleteProject(projectId)
                            .then(
                                function (data) {
                                    // toaster.pop('success', 'Good!!!', 'Project deleted correctly.');
                                    $scope.getProjects();
                                    SweetAlert.swal({
                                        title: "Deleted!",
                                        text: "Your project has been deleted.",
                                        type: "success",
                                        confirmButtonColor: "#007AFF"
                                    });
                                },
                                function (errResponse) {
                                    console.log(errResponse);
                                }
                            );
                    } else {
                        SweetAlert.swal({
                            title: "Cancelled",
                            text: "Your project is safe :)",
                            type: "error",
                            confirmButtonColor: "#007AFF"
                        });
                    }
                });
            };

            $scope.isFollowProject = function (projectId) {
                var followFlag = false;

                if (localStorageService.get('isLogged')) {

                    if ($scope.owner.projectsFollow) {
                        for (var i = 0; i < $scope.owner.projectsFollow.length; i++) {
                            if (projectId == $scope.owner.projectsFollow[i]) {
                                followFlag = true;
                                break;
                            }
                        }
                    }
                }

                return followFlag;
            };

            $scope.updateUser = function () {
                RestService.updateUser($scope.owner)
                    .then(
                        function (data) {
                            toaster.pop('success', 'Good!!!', 'User updated correctly.');
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.follow = function (projectId) {

                if (localStorageService.get('isLogged')) {

                    if (!$scope.owner.projectsFollow) {
                        $scope.owner.projectsFollow = [];
                    }
                    $scope.owner.projectsFollow.push(projectId);

                    $scope.updateUser();
                }
                else {
                    toaster.pop('error', 'Error!!!', 'Must be login first.');
                }
            };

            $scope.unfollow = function (projectId) {
                for (var i = 0; i < $scope.owner.projectsFollow.length; i++) {
                    if (projectId == $scope.owner.projectsFollow[i]) {
                        $scope.owner.projectsFollow.splice(i, 1);
                        break;
                    }
                }
                $scope.updateUser();
            };

            $scope.getAllUsers = function () {
                RestService.fetchAllUsers(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.listAllUser = data;
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getAllUsers(localStorageService.get('currentUserId'));

            $scope.possibleInvestmentArray = [];

            $scope.getPossibleInvestment = function () {
                $scope.possibleInvestmentArray.push("100");
                $scope.possibleInvestmentArray.push("200");
                $scope.possibleInvestmentArray.push("300");
                $scope.possibleInvestmentArray.push("400");
                $scope.amount = $scope.possibleInvestmentArray[$scope.possibleInvestmentArray.length - 1];
            };

            $scope.getPossibleInvestment();

            $scope.setInvestmentValue = function () {
                localStorageService.set('currentAmountInvestment', $scope.amount);
            };

            $scope.projectRole = function (userId) {
                if (localStorageService.get('currentUserId') == userId) {
                    return 'Owner';
                }
                else {
                    return 'Financier';
                }
            };

            $scope.investmentCapitalProject = 0;

            $scope.invertionByProjectId = function () {
                RestService.fetchInvertionByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.invertions = data;

                            for (var i = 0; i < $scope.invertions.length; i++) {
                                $scope.investmentCapitalProject += parseInt($scope.invertions[i].amount);
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.invertionByProjectId();
        }
    }]);
