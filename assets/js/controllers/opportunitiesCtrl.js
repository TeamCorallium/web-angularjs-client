'use strict';
/**
 * controller for Opportunities
 */
app.controller('OpportunitiesCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {
        $scope.allProjects = [];
        $scope.listUserOwners = [];
        $scope.creationProjectDate = '';
        $scope.deathLineProject = '';

        $scope.getUserName = function (userId) {
            RestService.fetchUser(userId)
                .then(
                    function(data) {
                        $scope.listUserOwners.push(data[0].fullName);
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllProjects = function () {
            RestService.fetchAllOpportunities(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.allProjects = data;

                        for(var i = 0 ; i < $scope.allProjects.length; i++) {
                            $scope.getUserName($scope.allProjects[i].userId);
                        }
                    },
                    function(errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllProjects();

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.goToOpportunities = function (projectId) {
            localStorageService.set('currentProjectId',projectId);
            $state.go('app.project.opportunities_detail');
        };

        $scope.isFollowProject = function (projectId) {
            var followFlag = false;

            if(localStorageService.get('isLogged')) {

                if($scope.owner.projectsFollow) {
                    for (var i = 0; i<$scope.owner.projectsFollow.length; i++) {
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
                    function(data) {
                        toaster.pop('success', 'Good!!!', 'User updated correctly.');
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.follow = function (projectId) {

            if(localStorageService.get('isLogged')) {

                if(!$scope.owner.projectsFollow) {
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
            for (var i = 0; i<$scope.owner.projectsFollow.length; i++) {
                if (projectId == $scope.owner.projectsFollow[i]) {
                    $scope.owner.projectsFollow.splice( i , 1 );
                    break;
                }
            }
            $scope.updateUser();
        };
    }]);
