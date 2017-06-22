'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        if (localStorageService.get('isLogged') == null || localStorageService.get('isLogged') == 'false') {
            $scope.logged = false;
        } else {
            $scope.logged = true;
        }

        $scope.allProjects = [];
        $scope.listAllUserAbstracts = [];
        $scope.allProjectsAbstracts = [];
        $scope.listAllUser = [];
        $scope.owner = '';
        $scope.filter = '';
        $scope.selectedTabProjects = true;

        $scope.getAllProjects = function () {
            RestService.fetchAllProject(localStorageService.get('currentUserId'), $scope.filter)
                .then(
                    function (data) {
                        $scope.allProjects = data;

                        for (var i = 0; i < $scope.allProjects.length; i++) {
                            var projectAbstract = {
                                id: $scope.allProjects[i].id,
                                mainLayout: $scope.allProjects[i].mainLayout,
                                name: $scope.allProjects[i].projectName,
                                creationDate: $scope.allProjects[i].creationDate,
                                description: $scope.allProjects[i].description,
                                totalCost: $scope.allProjects[i].totalCost,
                                totalRevenue: $scope.allProjects[i].totalRevenue,
                                state: $scope.allProjects[i].state,
                                deathLine: $scope.allProjects[i].deathLine,
                                ownerId: $scope.allProjects[i].userId,
                                ownerName: '',
                                ownerRaiting: ''
                            };
                            $scope.allProjectsAbstracts.push(projectAbstract);
                            $scope.getUserName($scope.allProjects[i].userId);
                        }
                    },
                    function (errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
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
                        var name = data[0].fullName;

                        for (var i=0 ; i<$scope.allProjectsAbstracts.length; i++) {
                            if ($scope.allProjectsAbstracts[i].ownerId == userId) {
                                $scope.allProjectsAbstracts[i].ownerName = name;
                            }
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.stateArray = ['', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

        $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
        };

        $scope.goToExploreProject = function (projectId) {
            localStorageService.set('currentProjectId', projectId);
            $state.go('app.project.explore_subproject');
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

                        for (var i = 0; i < $scope.listAllUser.length; i++) {
                            var usersAbstract = {
                                id: $scope.listAllUser[i].id,
                                name: $scope.listAllUser[i].fullName,
                                email: $scope.listAllUser[i].email,
                                countProjects: ''
                            };
                            $scope.listAllUserAbstracts.push(usersAbstract);
                            $scope.getProjectByUserId($scope.listAllUser[i].id);
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectByUserId = function (userId) {
            RestService.fetchSimpleProjects(userId)
                .then(
                    function (data) {
                        var count = data.length;

                        for (var i=0; i <$scope.listAllUserAbstracts.length; i++) {
                            if ($scope.listAllUserAbstracts[i].id == userId) {
                                $scope.listAllUserAbstracts[i].countProjects = count;
                            }
                        }

                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllUsers(localStorageService.get('currentUserId'));

        $scope.viewProfile = function (userId) {
            localStorageService.set('viewUserProfileId', userId);
            $state.go('app.pages.exploreuser');
        };

        $scope.tabSelectedUser = function () {
            $scope.selectedTabProjects = false;
        };

        $scope.tabSelectedProjects = function () {
            $scope.selectedTabProjects = true;
        };
    }]);
