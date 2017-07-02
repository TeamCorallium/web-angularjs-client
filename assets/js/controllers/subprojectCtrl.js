'use strict';
/**
 * controller for User Projects
 */
app.controller('SubprojectCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster", "SweetAlert", "$window",
    function ($scope, localStorageService, RestService, $state, toaster, SweetAlert, $window) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {

            // $scope.$on("$destroy", function handler() {
            //     gantt.detachAllEvents();
            //     console.log("SubprojectCtrl destroy");
            // }); 

            $scope.currentProjectActive = [];
            $scope.myInvestedCapital = 0;
            $scope.coveredCapitalPercent = 0;
            $scope.investmentCapitalProject = 0;
            $scope.estimateRevenueF = 0;
            $scope.amount = 0;

            $scope.getProjectById = function () {
                RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.currentProjectActive = data[0];
                            $scope.invertionByProjectId();
                            $scope.getOwnerData();
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProjectById();

            $scope.stateArray = ['Under Construction', 'In Preparation', 'Active', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.categoryArray = ['','Commodities Production', 'Creating a New Business', 'Diversification', 'Property developments', 'Other'];

            $scope.sectorArray = ['', 'Agriculture', 'Industry', 'Technology', 'Engineering','Real State', 'Academic', 'Food industry', 'Other'];

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getDateProject = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.tasksProject = [];

            $scope.getTaskByProjectsId = function () {
                RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.tasksProject = data;

                            var tasks = {data: $scope.tasksProject.slice()};

                            //begin gantt
                            for (var i = 0; i < $scope.tasksProject.length; i++) {
                                tasks.data[i].text = tasks.data[i].name;
                                tasks.data[i].start_date = new Date(tasks.data[i].startDate);
                                tasks.data[i].end_date = '';
                            }

                            $scope.ganttStart("gantt_here");
                            gantt.clearAll();
                            gantt.parse(tasks);
                            gantt.refreshData();
                            gantt.render();
                            //end gantt
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getTaskByProjectsId();

            $scope.getOwnerData = function () {
                RestService.fetchUser($scope.currentProjectActive.userId)
                    .then(
                        function (data) {
                            $scope.owner = data[0];
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.projectRole = function (userId) {
                if (localStorageService.get('currentUserId') == userId) {
                    return 'Owner';
                }
                else {
                    return 'Financier';
                }
            };

            $scope.invertionByProjectId = function () {
                RestService.fetchInvertionByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.invertions = data;
                            for (var i = 0; i < $scope.invertions.length; i++) {
                                $scope.investmentCapitalProject += parseFloat($scope.invertions[i].amount);
                                if ($scope.invertions[i].userId == localStorageService.get('currentUserId')) {
                                    $scope.myInvestedCapital = $scope.invertions[i].amount;
                                }
                            }


                            $scope.investmentCapitalProject += parseFloat($scope.currentProjectActive.ownerInvestedCapital);

                            $scope.coveredCapital();
                            $scope.getPossibleInvestment();
                            $scope.getFinancierEsimateRevenueFinancier();
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getFinancierEsimateRevenue = function (myInvested) {
                var porcientoF = (parseFloat(myInvested) / parseFloat($scope.currentProjectActive.totalCost) * 100.0);
                var estimateRevenueO = (parseFloat($scope.currentProjectActive.revenueOwner) / 100.0) * parseFloat($scope.currentProjectActive.totalRevenue);
                $scope.estimateRevenueF = (porcientoF / 100.0) * (parseFloat($scope.currentProjectActive.totalRevenue) - estimateRevenueO);
            };

            $scope.getFinancierEsimateRevenueFinancier = function () {
                var porcientoF = (parseFloat($scope.myInvestedCapital) / parseFloat($scope.currentProjectActive.totalCost) * 100.0);
                var estimateRevenueO = (parseFloat($scope.currentProjectActive.revenueOwner) / 100.0) * parseFloat($scope.currentProjectActive.totalRevenue);
                $scope.estimateRevenueFinancier = (porcientoF / 100.0) * (parseFloat($scope.currentProjectActive.totalRevenue) - estimateRevenueO);
            };

            $scope.goToTask = function (taskId) {
                localStorageService.set('currentTaskId', taskId);
                $state.go('app.project.task_detail');
            };

            $scope.goToUpdateTask = function (taskId) {
                localStorageService.set('currentTaskId', taskId);
                $state.go('app.project.modified_task');
            };

            $scope.goToExploreUserProfile = function (userId) {
                localStorageService.set('viewUserProfileId', userId);
                $state.go('app.pages.exploreuser');
            };

            //begin Gantt
            $scope.ganttStart = function (containerName) {
                var tasks = {
                    data: [],
                    // links:[
                    //     {id:1, source:1, target:2, type:"1"},
                    //     {id:2, source:1, target:3, type:"1"},
                    //     {id:3, source:3, target:4, type:"1"},
                    //     {id:4, source:4, target:5, type:"0"},
                    //     {id:5, source:5, target:6, type:"0"}
                    // ]
                };
                gantt.config.columns = [
                    // {name:"text",       label:"Task name", tree:true },
                    // {name:"duration",   label:"Duration"},
                    // {name:"add",        label:""}
                ];

                //translate here......
                gantt.locale = {
                    date:{
                        month_full:["January", "February", "March", "April", "May", "June", "July",
                        "August", "September", "October", "November", "December"],
                        month_short:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                        "Oct", "Nov", "Dec"],
                        day_full:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
                        "Saturday"],
                        day_short:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                    },
                    labels:{
                        new_task:"New task",
                        icon_save:"Save",
                        icon_cancel:"Cancel",
                        icon_details:"Details",
                        icon_edit:"Edit",
                        icon_delete:"Delete",
                        confirm_closing:"",//Your changes will be lost, are you sure ?
                        confirm_deleting:"Task will be deleted permanently, are you sure?",
                 
                        section_description:"Description",
                        section_time:"Time period",
                 
                        /* link confirmation */
                 
                        confirm_link_deleting:"Dependency will be deleted permanently, are you sure?",
                        link_from: "From",
                        link_to: "To",
                        link_start: "Start",
                        link_end: "End",
                 
                        minutes: "Minutes",
                        hours: "Hours",
                        days: "Days",
                        weeks: "Week",
                        months: "Months",
                        years: "Years"
                    }
                };
                gantt.config.drag_move = false;
                gantt.config.drag_links = false;
                gantt.config.drag_resize = false;
                gantt.config.drag_progress = false;
                gantt.config.autosize = "y";
                gantt.config.keyboard_navigation_cells = true;
                gantt.config.touch = true;
                gantt.init(containerName);

                // gantt.clearAll();
                // tasks.data = $scope.tasksProject;
                // gantt.parse (tasks);
                // gantt.parse($scope.tasks);
                gantt.attachEvent("onTaskClick", function (id, e) {
                    // alert("You've just clicked an item with id="+id);
                    return false;
                });
                gantt.attachEvent("onTaskDblClick", function (id, e) {
                    // alert("You've just double clicked an item with id="+id);
                    return false;
                });
            };
            $scope.ganttStart("gantt_hide");

            $scope.toggleMode = function (toggle) {
                toggle.enabled = !toggle.enabled;
                if (toggle.enabled) {
                    toggle.innerHTML = "Set default Scale";
                    console.log(toggle.innerHTML);
                    //Saving previous scale state for future restore
                    saveConfig();
                    zoomToFit();
                } else {
                    toggle.innerHTML = "Zoom to Fit";
                    console.log(toggle.innerHTML);
                    //Restore previous scale state
                    restoreConfig();
                    gantt.render();
                }
            };
            var cachedSettings = {};

            function saveConfig() {
                var config = gantt.config;
                cachedSettings = {};
                cachedSettings.scale_unit = config.scale_unit;
                cachedSettings.date_scale = config.date_scale;
                cachedSettings.step = config.step;
                cachedSettings.subscales = config.subscales;
                cachedSettings.template = gantt.templates.date_scale;
                cachedSettings.start_date = config.start_date;
                cachedSettings.end_date = config.end_date;
            };

            function restoreConfig() {
                applyConfig(cachedSettings);
            };

            function applyConfig(config, dates) {
                gantt.config.scale_unit = config.scale_unit;
                if (config.date_scale) {
                    gantt.config.date_scale = config.date_scale;
                    gantt.templates.date_scale = null;
                }
                else {
                    gantt.templates.date_scale = config.template;
                }

                gantt.config.step = config.step;
                gantt.config.subscales = config.subscales;

                if (dates) {
                    gantt.config.start_date = gantt.date.add(dates.start_date, -1, config.unit);
                    gantt.config.end_date = gantt.date.add(gantt.date[config.unit + "_start"](dates.end_date), 2, config.unit);
                } else {
                    gantt.config.start_date = gantt.config.end_date = null;
                }
            };

            function zoomToFit() {
                var project = gantt.getSubtaskDates(),
                    areaWidth = gantt.$task.offsetWidth;

                for (var i = 0; i < scaleConfigs.length; i++) {
                    var columnCount = getUnitsBetween(project.start_date, project.end_date, scaleConfigs[i].unit, scaleConfigs[i].step);
                    if ((columnCount + 2) * gantt.config.min_column_width <= areaWidth) {
                        break;
                    }
                }

                if (i == scaleConfigs.length) {
                    i--;
                }

                applyConfig(scaleConfigs[i], project);
                gantt.render();
            };

            // get number of columns in timeline
            function getUnitsBetween(from, to, unit, step) {
                var start = new Date(from),
                    end = new Date(to);
                var units = 0;
                while (start.valueOf() < end.valueOf()) {
                    units++;
                    start = gantt.date.add(start, step, unit);
                }
                return units;
            };

            //Setting available scales
            var scaleConfigs = [
                // minutes
                {
                    unit: "minute", step: 1, scale_unit: "hour", date_scale: "%H", subscales: [
                    {unit: "minute", step: 1, date: "%H:%i"}
                ]
                },
                // hours
                {
                    unit: "hour", step: 1, scale_unit: "day", date_scale: "%j %M",
                    subscales: [
                        {unit: "hour", step: 1, date: "%H:%i"}
                    ]
                },
                // days
                {
                    unit: "day", step: 1, scale_unit: "month", date_scale: "%F",
                    subscales: [
                        {unit: "day", step: 1, date: "%j"}
                    ]
                },
                // weeks
                {
                    unit: "week", step: 1, scale_unit: "month", date_scale: "%F",
                    subscales: [
                        {
                            unit: "week", step: 1, template: function (date) {
                            var dateToStr = gantt.date.date_to_str("%d %M");
                            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                        }
                    ]
                },
                // months
                {
                    unit: "month", step: 1, scale_unit: "year", date_scale: "%Y",
                    subscales: [
                        {unit: "month", step: 1, date: "%M"}
                    ]
                },
                // quarters
                {
                    unit: "month", step: 3, scale_unit: "year", date_scale: "%Y",
                    subscales: [
                        {
                            unit: "month", step: 3, template: function (date) {
                            var dateToStr = gantt.date.date_to_str("%M");
                            var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                        }
                    ]
                },
                // years
                {
                    unit: "year", step: 1, scale_unit: "year", date_scale: "%Y",
                    subscales: [
                        {
                            unit: "year", step: 5, template: function (date) {
                            var dateToStr = gantt.date.date_to_str("%Y");
                            var endDate = gantt.date.add(gantt.date.add(date, 5, "year"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                        }
                    ]
                },
                // decades
                {
                    unit: "year", step: 10, scale_unit: "year", template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%Y");
                    var endDate = gantt.date.add(gantt.date.add(date, 10, "year"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                },
                    subscales: [
                        {
                            unit: "year", step: 100, template: function (date) {
                            var dateToStr = gantt.date.date_to_str("%Y");
                            var endDate = gantt.date.add(gantt.date.add(date, 100, "year"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                        }
                    ]
                }
            ];

//end Gantt

            $scope.deleteTask = function (taskId) {
                SweetAlert.swal({
                    title: "Are you sure?",
                    text: "Your will not be able to recover this task!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        RestService.deleteTask(taskId)
                            .then(
                                function (data) {
                                    $scope.getTaskByProjectsId();
                                    SweetAlert.swal({
                                        title: "Deleted!",
                                        text: "Your task has been deleted.",
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
                            text: "Your task is safe :)",
                            type: "error",
                            confirmButtonColor: "#007AFF"
                        });
                    }
                });
            };

            $scope.getDuration =  function () {
                var weeks = parseInt($scope.currentProjectActive.estimateDuration / 7);
                var days = parseInt($scope.currentProjectActive.estimateDuration % 7);

                var text = '';

                if (weeks > 0) {
                    if (weeks == 1) {
                        text = weeks + " week";
                    } else {
                        text = weeks + " weeks";
                    }

                    if (days!=0) {
                        text+= " and ";
                        if (days == 1) {
                            text+= days + " day"
                        } else {
                            text+= days + " days"
                        }
                    }
                } else {
                    if (days == 1) {
                        text = days + " day"
                    } else {
                        text = days + " days"
                    }
                }

                return text;
            };

            $scope.seeReference = function (file) {
                $window.location.href = file;
            };

            $scope.coveredCapital = function () {
                $scope.coveredCapitalPercent = ($scope.investmentCapitalProject / parseFloat($scope.currentProjectActive.totalCost)) * 100;
            };

            $scope.possibleInvestmentArray = [];

            //Upgrade While(true)
            $scope.getPossibleInvestment = function () {
                if ($scope.coveredCapitalPercent != 100) {
                    var minimalInvertion = parseInt(($scope.currentProjectActive.totalCost-$scope.currentProjectActive.ownerInvestedCapital)/$scope.currentProjectActive.maxNumInves);

                    var remainingInvertion = parseInt($scope.currentProjectActive.totalCost - $scope.investmentCapitalProject);

                    var remainingNumMinInvestors = parseInt($scope.currentProjectActive.minNumInves) - $scope.invertions.length;

                    var myInvertion = 0;

                    for (var i=0; i<$scope.invertions.length;  i++) {
                        if ($scope.invertions[i].userId == localStorageService.get('currentUserId')) {
                            myInvertion = parseInt($scope.invertions[i].amount);
                        }
                    }

                    if (myInvertion == 0) {
                        var n = 0;

                        while (true) {
                            var a = remainingInvertion - n * minimalInvertion;
                            if ((a >= minimalInvertion)) {
                                if ((remainingNumMinInvestors > 0) && (a > (remainingInvertion - (minimalInvertion * (remainingNumMinInvestors - 1))))) {
                                    n += 1;
                                    continue;
                                }
                                $scope.possibleInvestmentArray.push(a);
                            } else {
                                break;
                            }

                            n += 1;
                        }
                    } else {
                        if (($scope.investmentCapitalProject < ($scope.currentProjectActive.totalCost - (minimalInvertion * (remainingNumMinInvestors))))){

                            var n = 0;

                            while (true) {
                                var a = remainingInvertion - n * minimalInvertion;
                                if ((a >= minimalInvertion)) {
                                    if ((remainingNumMinInvestors > 0) && (a >= (remainingInvertion - (minimalInvertion * (remainingNumMinInvestors - 1))))) {
                                        n += 1;
                                        continue;
                                    }
                                    $scope.possibleInvestmentArray.push(a);
                                } else {
                                    break;
                                }

                                n += 1;
                            }
                        }
                    }
                }
            };

            $scope.setInvestmentValue = function () {
                if ($scope.amount !=  '' && $scope.amount != null) {
                    localStorageService.set('currentAmountInvestment', $scope.amount);
                    $state.go('app.inversion');
                } else {
                    toaster.pop('error', 'Error', 'Please select the amount to invest.');
                }
            };

            $scope.forumView = function () {
                if ($scope.currentProjectActive.userId != localStorageService.get('currentUserId') &&
                $scope.currentProjectActive.ownerInvestedCapital <= 0) {
                    return true;
                } else {
                    return false;
                }
            };

        }
    }]);
