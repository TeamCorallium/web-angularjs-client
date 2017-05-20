'use strict';
/**
 * controller for User Projects
 */
app.controller('CurrentUserProjects', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {
        $scope.simpleProjects = [];
        $scope.allProjects = [];
        $scope.owner = '';

        $scope.creationProjectDate = '';
        $scope.deathLineProject = '';

        $scope.getProjectById = function (projectId) {
            RestService.fetchProjectById(projectId)
                .then(
                    function(data) {
                        $scope.currentProjectActive =  data[0];
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        if(localStorageService.get('currentProjectId')!= null){
            $scope.getProjectById(localStorageService.get('currentProjectId'));
        }

        $scope.getProjects = function () {
            RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.simpleProjects = data;
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjects();

        $scope.getAllProjects = function () {
            RestService.fetchAllProject(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.allProjects = data;
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllProjects();

        $scope.getOwnerData = function () {
            RestService.fetchUser(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.owner = data[0];
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getOwnerData();

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getCreationProject = function (DateProject) {
            var dateTemp = new Date(DateProject);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDay() + ", "+ dateTemp.getFullYear();
        };

        $scope.getDeathLineProject = function (DeathLine) {
            var dateTemp = new Date(DeathLine);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDay() + ", "+ dateTemp.getFullYear();
        };

        $scope.goToProject = function (projectId) {
            localStorageService.set('currentProjectId',projectId);
            $scope.getProjectById(projectId);
            $state.go('app.project.subproject_detail');
        };

        $scope.goToOpportunities = function (projectId) {
            localStorageService.set('currentProjectId',projectId);
            $scope.getProjectById(projectId);
            $state.go('app.project.opportunities_detail');
        };

        $scope.deleteProject = function (projectId) {
            RestService.deleteProject(projectId)
                .then(
                    function(data) {
                        toaster.pop('success', 'Good!!!', 'Project deleted correctly.');
                        $scope.getProjects();
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.isFollowProject = function (projectId) {
            var followFlag = false;

            if($scope.owner.projectsFollow) {
                for (var i = 0; i<$scope.owner.projectsFollow.length; i++) {
                    if (projectId == $scope.owner.projectsFollow[i]) {
                        followFlag = true;
                        break;
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
            if(!$scope.owner.projectsFollow) {
                $scope.owner.projectsFollow = [];
            }
            $scope.owner.projectsFollow.push(projectId);

            $scope.updateUser();
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
