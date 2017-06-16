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

            $scope.stateArray = ['', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.getProjects = function () {
                if (localStorageService.get('isLogged')) {
                    RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                        .then(
                            function (data) {
                                $scope.simpleProjects = data;
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

            $scope.getCreationProject = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.goToProject = function (projectId) {
                localStorageService.set('currentProjectId', projectId);
                $state.go('app.project.subproject_detail');
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
        }
    }]);
