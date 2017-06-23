'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreUserProjectsCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        if (localStorageService.get('isLogged') == null || (!localStorageService.get('isLogged'))) {
            $scope.logged = false;
        } else {
            $scope.logged = true;
        }

        $scope.allProjects = [];
        $scope.allProjectsAbstracts = [];
        $scope.owner = '';
        $scope.invertions = [];

        $scope.getAllProjects = function () {
            RestService.fetchSimpleProjects(localStorageService.get('viewUserProfileId'))
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
                                ownerRaiting: '',
                                coveredCapital: '',
                                userFinancier: ''
                            };
                            $scope.allProjectsAbstracts.push(projectAbstract);
                            $scope.invertionByProjectId($scope.allProjects[i].id);
                        }
                    },
                    function (errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllProjects();

        $scope.invertionByProjectId = function (projectId) {
            RestService.fetchInvertionByProjectId(projectId)
                .then(
                    function (data) {
                        $scope.invertions = data;

                        var investmentCapitalProject = 0;
                        var iInverted = false;

                        for (var i = 0; i < $scope.invertions.length; i++) {
                            investmentCapitalProject += parseFloat($scope.invertions[i].amount);
                            if (localStorageService.get('currentUserId') == $scope.invertions[i].userId) {
                                iInverted = true;
                            }
                        }
                        var coveredCapitalPercent = 0;

                        for (var i=0; i<$scope.allProjectsAbstracts.length; i++) {
                            if ($scope.allProjectsAbstracts[i].id == projectId) {
                                coveredCapitalPercent = (investmentCapitalProject / parseFloat($scope.allProjectsAbstracts[i].totalCost)) * 100;
                                $scope.allProjectsAbstracts[i].coveredCapital = coveredCapitalPercent;
                                $scope.allProjectsAbstracts[i].userFinancier = iInverted;
                            }
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };


        $scope.getOwnerData = function () {
            RestService.fetchUser(localStorageService.get('viewUserProfileId'))
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

        $scope.viewProfile = function (userId) {
            localStorageService.set('viewUserProfileId', userId);
            $state.go('app.pages.exploreuser');
        };

        $scope.getRole = function (userId) {
          if (localStorageService.get('currentUserId') == userId) {
                return 'Owner';
          }
          return '';
        };
    }]);
