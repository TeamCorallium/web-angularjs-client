'use strict';
/**
 * controller for User Projects
 */
app.controller('ProjectUserCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster", "SweetAlert",
    function ($scope, localStorageService, RestService, $state, toaster, SweetAlert) {
        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.simpleProjects = [];
            $scope.allProjectsAbstracts = [];
            $scope.invertions = [];

            $scope.stateArray = ['Under Construction', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.getProjects = function () {
                if (localStorageService.get('isLogged')) {
                    RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                        .then(
                            function (data) {
                                $scope.simpleProjects = data;

                                $scope.allProjectsAbstracts = [];

                                for (var i = 0; i < $scope.simpleProjects.length; i++) {
                                    var projectAbstract = {
                                        id: $scope.simpleProjects[i].id,
                                        mainLayout: $scope.simpleProjects[i].mainLayout,
                                        name: $scope.simpleProjects[i].projectName,
                                        creationDate: $scope.simpleProjects[i].creationDate,
                                        description: $scope.simpleProjects[i].description,
                                        totalCost: $scope.simpleProjects[i].totalCost,
                                        totalRevenue: $scope.simpleProjects[i].totalRevenue,
                                        state: $scope.simpleProjects[i].state,
                                        deathLine: $scope.simpleProjects[i].deathLine,
                                        ownerId: $scope.simpleProjects[i].userId,
                                        sector: $scope.simpleProjects[i].sector,
                                        category: $scope.simpleProjects[i].category,
                                        minNumInves: $scope.simpleProjects[i].minNumInves,
                                        maxNumInves: $scope.simpleProjects[i].maxNumInves,
                                        ownerName: '',
                                        ownerRaiting: '',
                                        coveredCapital: '',
                                        inverted: $scope.simpleProjects[i].inverted
                                    };
                                    $scope.allProjectsAbstracts.push(projectAbstract);
                                    $scope.getUserName($scope.simpleProjects[i].userId);
                                    $scope.invertionByProjectId($scope.simpleProjects[i].id);
                                }
                            },
                            function (errResponse) {
                                toaster.pop('error', 'Error', 'Server not available.');
                                console.log(errResponse);
                            }
                        );
                }
            };

            $scope.getProjects();

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.categoryArray = ['','Commodities Production', 'Creating a New Business', 'Diversification', 'Property Developments', 'Other'];

            $scope.sectorArray = ['','Agriculture', 'Industry', 'Technology', 'Engineering', 'Real State', 'Academic', 'Food Industry', 'Other'];

            $scope.getCreationProject = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.goToProject = function (projectId) {
                localStorageService.set('currentProjectId', projectId);
                $state.go('app.project.subproject_detail');
            };

            $scope.updateProject = function(projectId) {
                localStorageService.set('currentProjectId', projectId);
                $state.go('app.project.wizard');              
            };

            $scope.deleteProject = function (projectId) {
                SweetAlert.swal({
                    title: "Are you sure?",
                    text: "Your will not be able to recover this project!",
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
                                    toaster.pop('error', 'Error', 'Server not available.');
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

            $scope.projectRole = function (userId) {
                if (localStorageService.get('currentUserId') == userId) {
                    return 'Owner';
                }
                else {
                    return 'Financier';
                }
            };

            $scope.invertionByProjectId = function (projectId) {
                RestService.fetchInvertionByProjectId(projectId)
                    .then(
                        function (data) {
                            $scope.invertions = data;

                            var investmentCapitalProject = 0;

                            for (var i = 0; i < $scope.invertions.length; i++) {
                                investmentCapitalProject += parseFloat($scope.invertions[i].amount);
                            }

                            var coveredCapitalPercent = 0;

                            for (var i=0; i<$scope.allProjectsAbstracts.length; i++) {
                                if ($scope.allProjectsAbstracts[i].id == projectId) {
                                    coveredCapitalPercent = (investmentCapitalProject / parseFloat($scope.allProjectsAbstracts[i].totalCost)) * 100;
                                    $scope.allProjectsAbstracts[i].coveredCapital = coveredCapitalPercent;
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

            $scope.viewProfile = function (userId) {
                localStorageService.set('viewUserProfileId', userId);
                $state.go('app.pages.exploreuser');
            };
        }
    }]);
