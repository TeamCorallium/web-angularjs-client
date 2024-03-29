'use strict';
/**
 * controller for User Projects
 */
app.controller('OpportunitiesCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        if (localStorageService.get('isLogged') == null || (!localStorageService.get('isLogged'))) {
            $scope.logged = false;
        } else {
            $scope.logged = true;
        }

        $scope.allProjects = [];
        $scope.invertions = [];
        $scope.allProjectsAbstracts = [];
        $scope.owner = '';
        $scope.filter = '';
        $scope.selectedTabProjects = true;

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

        $scope.getAllProjects = function () {
            RestService.fetchAllOpportunities(localStorageService.get('currentUserId'), $scope.filter)
                .then(
                    function (data) {
                        $scope.allProjects = data;

                        $scope.allProjectsAbstracts = [];

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
                                sector: $scope.allProjects[i].sector,
                                category: $scope.allProjects[i].category,
                                minNumInves: $scope.allProjects[i].minNumInves,
                                maxNumInves: $scope.allProjects[i].maxNumInves,
                                ownerInvestedCapital: parseFloat($scope.allProjects[i].ownerInvestedCapital),
                                ownerName: '',
                                ownerRating: '',
                                coveredCapital: '',
                                iInverted: ''
                            };

                            $scope.allProjectsAbstracts.push(projectAbstract);
                            $scope.getUserName($scope.allProjects[i].userId);
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
                        var invertedFlag = false;

                        for (var i = 0; i < $scope.invertions.length; i++) {
                            investmentCapitalProject += parseFloat($scope.invertions[i].amount);
                            if ($scope.logged){
                                if ($scope.invertions[i].userId == localStorageService.get('currentUserId')) {
                                    invertedFlag = true;
                                }
                            }
                        }
                        var coveredCapitalPercent = 0;

                        for (var i=0; i<$scope.allProjectsAbstracts.length; i++) {
                            if ($scope.allProjectsAbstracts[i].id == projectId) {
                                investmentCapitalProject += parseFloat($scope.allProjectsAbstracts[i].ownerInvestedCapital);
                                coveredCapitalPercent = (investmentCapitalProject / parseFloat($scope.allProjectsAbstracts[i].totalCost)) * 100;
                                $scope.allProjectsAbstracts[i].coveredCapital = coveredCapitalPercent;
                                $scope.allProjectsAbstracts[i].iInverted = invertedFlag;
                            }
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getUserName = function (userId) {
            RestService.fetchUser(userId)
                .then(
                    function (data) {
                        var name = data[0].fullName;
                        var rating = data[0].rating;

                        for (var i=0 ; i<$scope.allProjectsAbstracts.length; i++) {
                            if ($scope.allProjectsAbstracts[i].ownerId == userId) {
                                $scope.allProjectsAbstracts[i].ownerName = name;
                                $scope.allProjectsAbstracts[i].ownerRating = rating;
                            }
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.stateArray = ['Under Construction', 'In Preparation', 'Active', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

        $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        $scope.categoryArray = ['','Commodities Production', 'Creating a New Business', 'Diversification', 'Property Developments', 'Other'];

        $scope.sectorArray = ['','Agriculture', 'Industry', 'Technology', 'Engineering', 'Real State', 'Academic', 'Food Industry', 'Other'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
        };

        $scope.goToOpportunityProject = function (projectId) {
            localStorageService.set('currentProjectId', projectId);
            $state.go('app.project.opportunities_detail');
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

        $scope.updateUser = function (name, flag) {
            RestService.updateUser($scope.owner)
                .then(
                    function (data) {
                        if (flag) {
                            toaster.pop('success', 'Success', 'You are now follow the project '+name);
                        } else {
                            toaster.pop('success', 'Success', 'You are now unfollow the project '+name);
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.follow = function (projectId, name) {
            if (!$scope.owner.projectsFollow) {
                $scope.owner.projectsFollow = [];
            }

            $scope.owner.projectsFollow.push(projectId);

            $scope.updateUser(name,true);
        };

        $scope.unfollow = function (projectId, name) {
            for (var i = 0; i < $scope.owner.projectsFollow.length; i++) {
                if (projectId == $scope.owner.projectsFollow[i]) {
                    $scope.owner.projectsFollow.splice(i, 1);
                    break;
                }
            }
            $scope.updateUser(name,false);
        };

        $scope.goToProfileView = function (userId) {
            localStorageService.set('viewUserProfileId', userId);
            if (localStorageService.get('currentUserId') == userId) {
                $state.go('app.pages.user');
            } else {
                $state.go('app.pages.exploreuser');
            }
        };
    }]);
