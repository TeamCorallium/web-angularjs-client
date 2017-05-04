'use strict';
/**
 * controller for Wizard Form example
 */
app.controller('WizardCtrl', ["$scope", "toaster", "localStorageService", "RestService", "$state",
    function ($scope, toaster, localStorageService, RestService, $state) {
        $scope.currentStep = 1;
        $scope.simpleProject = {
            id: '',
            userId: localStorageService.get('currentUserId'),
            projectName: '',
            description: '',
            totalCost: '',
            minimalCost: '',
            estimateDuration: '',
            state: '',
            deathLine: '',
            revenueOwner: '',
            maxNumInves: '',
            minCapInves: ''
        };

        $scope.risks = [{
            name: '',
            description: ''
        }];

        $scope.task = [{
            name: '',
            description: ''
        }];

        $scope.createSimpleProject = function () {
            RestService.createSimpleProject($scope.simpleProject)
                .then(
                    function(data) {
                        if(data == -1) {
                            toaster.pop('error', 'Error', 'Invalid project info.');
                        } else {
                            $scope.simpleProject.id = data;
                            $state.go('app.project.user_project');
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        // Initial Value
        $scope.form = {

            next: function (form) {

                $scope.toTheTop();

                if (form.$valid) {
                    form.$setPristine();
                    nextStep();
                } else {
                    var field = null, firstError = null;
                    for (field in form) {
                        if (field[0] != '$') {
                            if (firstError === null && !form[field].$valid) {
                                firstError = form[field].$name;
                            }

                            if (form[field].$pristine) {
                                form[field].$dirty = true;
                            }
                        }
                    }

                    angular.element('.ng-invalid[name=' + firstError + ']').focus();
                    errorMessage();
                }
            },
            prev: function (form) {
                $scope.toTheTop();
                prevStep();
            },
            goTo: function (form, i) {
                if (parseInt($scope.currentStep) > parseInt(i)) {
                    $scope.toTheTop();
                    goToStep(i);

                } else {
                    if (form.$valid) {
                        $scope.toTheTop();
                        goToStep(i);

                    } else
                        errorMessage();
                }
            },
            submit: function () {

            },
            reset: function () {

            }
        };

        var nextStep = function () {
            $scope.currentStep++;
        };
        var prevStep = function () {
            $scope.currentStep--;
        };
        var goToStep = function (i) {
            $scope.currentStep = i;
        };
        var errorMessage = function (i) {
            toaster.pop('error', 'Error', 'please complete the form in this step before proceeding');
        };
    }]);
