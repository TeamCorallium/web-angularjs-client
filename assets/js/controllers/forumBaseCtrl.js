'use strict';
/**
 * controller for User Projects
 */
app.controller('ForumBaseCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        $scope.currentForumActive = '';
        $scope.userNameCommentActive = '';

        $scope.getUserName = function () {
            RestService.fetchUser(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.userNameCommentActive = data[0].fullName;
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getUserName();

        $scope.getProjectById = function(){
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentForumActive =  data[0];
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();

        //Array for all proposal of one project
        $scope.proposalsProject = [];
        $scope.proposalProjectTasks = [];

        $scope.getProposalByProjectId = function(){
            RestService.fetchProposalByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.proposalsProject =  data;
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProposalByProjectId();

        $scope.getTasksByProjectId = function(){
            RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.proposalProjectTasks =  data;
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getTasksByProjectId();

        $scope.goToProposalById = function (proposalId) {
            localStorageService.set('currentProposalId', proposalId);
            $state.go('app.forum.proposalview');
        };

        $scope.comments = [];

        $scope.getAllComments = function () {
            RestService.fetchAllCommentsById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.comments =  data;

                        for (var i=0; i<$scope.comments.length; i++) {
                            $scope.getUserName($scope.comments[i].userId);
                        }
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllComments();

        $scope.comment = {
            userId: '',
            fullName: '',
            projectId: '',
            value: '',
            creationDate: ''
        };

        $scope.createComment = function () {
            $scope.comment.userId = localStorageService.get('currentUserId');
            $scope.comment.fullName = $scope.userNameCommentActive;
            $scope.comment.projectId = localStorageService.get('currentProjectId');
            $scope.comment.creationDate = new Date();

            var obj = {
                type: 'COMMENT',
                value: $scope.comment
            };

            WebSocketService.send(obj);

            $scope.comment.value = '';

            $scope.getAllComments();
        };

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getDateMinutes = function (date) {
            var dateTemp = new Date(date);
            var dateTime = '';
            if(dateTemp.getMinutes()<10) {
                dateTime = "0"+dateTemp.getMinutes();
            } else {
                dateTime = dateTemp.getMinutes();
            }

            return dateTime;
        };

        $scope.getDateTime = function (date) {
            var dateTemp = new Date(date);
            var dateTime = '';
            if(dateTemp.getHours() < 12) {
                dateTime = "0"+dateTemp.getHours()+":"+$scope.getDateMinutes(date)+" am";
            } else if (dateTemp.getHours() == 12){
                dateTime = "12:"+$scope.getDateMinutes(date)+" pm";
            } else {
                dateTime = "0"+(dateTemp.getHours()-12)+":"+$scope.getDateMinutes(date)+" pm";
            }

            return dateTime;
        };

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear()+" at "+$scope.getDateTime(date);
        };

        $scope.getProposalTaskName = function (taskId) {
            var name = '';

            for (var i=0; i<$scope.proposalProjectTasks.length; i++) {
                if ($scope.proposalProjectTasks[i].id == taskId) {
                    name = $scope.proposalProjectTasks[i].name;
                    break;
                }
            }

            return name;
        };
    }]);