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
                                    projectId: $scope.notifications[i].projectId,
                                    from: $scope.notifications[i].from,
                                    fromId: $scope.notifications[i].fromId,
                                    date: $scope.notifications[i].date,
                                    subject: $scope.notifications[i].subject,
                                    proposalId: $scope.notifications[i].proposalId,
                                    read: '',
                                    content: $scope.notifications[i].content,
                                    avatar: $scope.notifications[i].fromAvatar,
                                    type: $scope.notifications[i].type
                                };

                                 if (currentNotification.avatar == '') {
                                     currentNotification.avatar = 'assets/images/default-user.png';
                                 }
                                $scope.notificationsAbstract.push(currentNotification);

                                if (currentNotification.type == 'PROPOSAL APPROVED'){
                                    $scope.notificationsAbstract[$scope.notificationsAbstract.length-1].avatar = 'assets/images/proposal_aproved.png';
                                } else if (currentNotification.type == 'NEW INVERTION') {
                                    $scope.notificationsAbstract[$scope.notificationsAbstract.length-1].avatar = 'assets/images/proposal_invertion.png';
                                }
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

        $scope.goToViewVotation = function (projectId, proposalId) {
            localStorageService.set('currentProjectId', projectId);
            localStorageService.set('currentProposalId', proposalId);
            $state.go('app.forum.viewvotation');
        };

        $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            var today = new Date();

            var ml = today.getTime() - dateTemp.getTime();
            var value = 0;

            if (ml < 60000) {
                value = parseInt(ml/1000);
                return 'a few seconds ago';
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

        $scope.goToProfileView = function (userId) {
            localStorageService.set('viewUserProfileId', userId);
            if (localStorageService.get('currentUserId') == userId) {
                $state.go('app.pages.user');
            } else {
                $state.go('app.pages.exploreuser');
            }
        };
    }]);