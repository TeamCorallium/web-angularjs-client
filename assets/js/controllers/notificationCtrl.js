/**
 * Created by Ale on 5/17/2017.
 */

app.controller('NotificationCtrl', ["$scope", "$rootScope", "localStorageService", "RestService", "$state", "toaster",
    function($scope, $rootScope, localStorageService, RestService, $state, toaster) {

        $scope.scopeVariable = 0;

        $rootScope.$on('new-notification', function () {
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
            if (localStorageService.get('currentUserId') != null) {
                RestService.fetchAllNotifications(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.notifications = data;
                        },
                        function (errResponse) {
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
            localStorageService.set('currentProjectId', projectId);
            localStorageService.set('currentProposalId', proposalId);
            $state.go('app.forum.proposalview');
        };

        $scope.goToProject = function (projectId) {
            localStorageService.set('currentProjectId', projectId);
            $state.go('app.project.subproject_detail');
        };

        $scope.goToTask = function (taskId) {
            localStorageService.set('currentTaskId', taskId);
            $state.go('app.project.task_detail');
        };

        $scope.goToFinance = function (projectId) {
            localStorageService.set('currentProjectId', projectId);
            $state.go('app.finance');
        };

        $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            var today = new Date();

            var ml = today.getTime() - dateTemp.getTime();
            var value = 0;

            if (ml < 60000) {
                value = parseInt(ml/1000);
                return value +' seconds ago';
            } else if (ml >= 60000 && ml < 3600000) {
                value = parseInt(ml/60000);
                if (value == 1 ) {
                    return value +' minute ago';
                } else {

                    return value + ' minutes ago';
                }
            } else if (ml >= 3600000 && ml < 86400000) {
                value = parseInt(ml/3600000);
                if (value == 1 ) {
                    return value +' hour ago';
                } else {

                    return value + ' hours ago';
                }
            } else if (ml >= 86400000 && ml < 2592000000) {
                value = parseInt(ml/86400000);
                if (value == 1 ) {
                    return value +' day ago';
                } else {

                    return value + ' days ago';
                }
            } else if (ml >= 2592000000){
                value = parseInt(ml/2592000000);
                if (value == 1 ) {
                    return value +' month ago';
                } else {

                    return value + ' months ago';
                }
            }
        };
    }]);