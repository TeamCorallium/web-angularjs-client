/**
 * Created by Ale on 5/17/2017.
 */

app.controller('NotificationCtrl', ["$scope", "$rootScope", "localStorageService", "RestService", "$state", "toaster",
    function($scope, $rootScope, localStorageService, RestService, $state, toaster) {

        $scope.scopeVariable = 0;

        $rootScope.$on('new-notification', function() {
            $scope.scopeVariable++;
            $scope.getNotificationsByUserId();
        });

        $scope.notifications = [];
        $scope.currentNotification = {
            userId: '',
            from: '',
            date: '',
            subject: '',
            read: '',
            content: '',
            avatar: 'assets/images/default-user.png',
            type: ''
        };

        $scope.getNotificationsByUserId = function () {
            if(localStorageService.get('currentUserId')!=null) {
                RestService.fetchAllNotifications(localStorageService.get('currentUserId'))
                    .then(
                        function(data) {
                            $scope.notifications = data;
                        },
                        function(errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            }
        };

        $scope.getNotificationsByUserId();

        $scope.goToNotificationPage = function () {
            $scope.scopeVariable = 0;
            $state.go('app.notification');
        };

        $scope.goToProposal = function (projectId, proposalId) {
            localStorageService.set('currentProjectId',projectId);
            localStorageService.set('currentProposalId',proposalId);
            $state.go('app.forum.proposalview');
        };

        $scope.goToProject = function (projectId) {
            localStorageService.set('currentProjectId', projectId);
            $state.go('app.project.subproject_detail');
        };

        $scope.goToTask = function (projectId, taskId) {
            localStorageService.set('currentProjectId', projectId);
            localStorageService.set('currentTaskId', taskId);
            $state.go('app.project.task_detail');
        };

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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
    }]);