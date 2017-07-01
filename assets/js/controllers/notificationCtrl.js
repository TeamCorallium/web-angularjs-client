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
        $scope.notificationsAbstract = [];

        $scope.getNotificationsByUserId = function () {
            if (localStorageService.get('currentUserId') != null) {
                RestService.fetchAllNotifications(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.notifications = data;

                            for (var i=0; i<$scope.notifications.length; i++) {
                                 var currentNotification = {
                                    userId: $scope.notifications[i].userId,
                                    from: $scope.notifications[i].from,
                                    date: $scope.notifications[i].date,
                                    subject: $scope.notifications[i].subject,
                                    read: '',
                                    content: $scope.notifications[i].content,
                                    avatar: '',
                                    type: $scope.notifications[i].type
                                };

                                $scope.notificationsAbstract.push(currentNotification);

                                if (currentNotification.type == 'PROPOSAL APPROVED'){
                                    $scope.notificationsAbstract[$scope.notificationsAbstract.length-1].avatar = 'assets/images/portfolio/image08.jpg';
                                } else if (currentNotification.type == 'NEW INVERTION') {
                                    $scope.notificationsAbstract[$scope.notificationsAbstract.length-1].avatar = 'assets/images/portfolio/image07.jpg';
                                }
                            }

                            if ($scope.notificationsAbstract.length > 0) {
                                $scope.getAvatar($scope.notificationsAbstract[0].userId);
                            }
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
                return value +' seconds';
            } else if (ml >= 60000 && ml < 3600000) {
                value = parseInt(ml/60000);
                if (value == 1 ) {
                    return value +' minute';
                } else {
                    return value + ' minutes';
                }
            } else if (ml >= 3600000 && ml < 86400000) {
                value = parseInt(ml/3600000);
                if (value == 1 ) {
                    return value +' hour';
                } else {
                    return value + ' hours';
                }
            } else if (ml >= 86400000 && ml < 2592000000) {
                value = parseInt(ml/86400000);
                if (value == 1 ) {
                    return value +' day';
                } else {
                    return value + ' days';
                }
            } else if (ml >= 2592000000){
                value = parseInt(ml/2592000000);
                if (value == 1 ) {
                    return value +' month';
                } else {
                    return value + ' months';
                }
            }
        };

        $scope.getAvatar = function (userId) {
            RestService.fetchUser(userId)
                .then(
                    function(data) {
                        var avatar = data[0].avatar;

                        for (var i=0; i<$scope.notificationsAbstract.length; i++) {
                            if ($scope.notificationsAbstract[i].type == 'NEW PROPOSAL') {
                                $scope.notificationsAbstract[i].avatar = avatar;
                            }
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };
    }]);