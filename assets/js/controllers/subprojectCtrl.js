'use strict';
/**
 * controller for User Projects
 */
app.controller('SubprojectCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.currentProjectActive = [];

        $scope.getProjectById = function () {
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentProjectActive =  data[0];
                        $scope.invertionByProjectId();
                    },
                    function(errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.categoryArray = ['Commodities Production','Creating a New Business','Diversification','Property developments','Other'];

        $scope.getDateProject = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.tasksProject = [];
        // $scope.tasksFiltre = [];

        $scope.getTaskByProjectsId = function () {
            RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.tasksProject = data;
                        // $scope.getTaskByStateStartedOrFinished();

                        var tasks = {data: $scope.tasksProject.slice()};

                        //begin gantt
                        for (var i = 0; i< $scope.tasksProject.length; i++) {
                            tasks.data[i].start_date = new Date(tasks.data[i].start_date);
                            tasks.data[i].end_date = new Date(tasks.data[i].end_date);
                            console.log(tasks.data[i].start_date);
                            console.log(tasks.data[i].end_date);
                        }

                        console.log($scope.tasksProject);

                        $scope.ganttStart("gantt_here");
                        gantt.clearAll();
                        gantt.parse (tasks);
                        gantt.refreshData();
                        gantt.render();
                        //end gantt                        
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getTaskByProjectsId();

        // $scope.getTaskByStateStartedOrFinished = function () {
        //     for (var i=0; i < $scope.tasksProject.length; i++) {
        //         if ($scope.tasksProject[i].state == 2 || $scope.tasksProject[i].state == 3 ||
        //             $scope.tasksProject[i].state == 4 || $scope.tasksProject[i].state == 5) {
        //             $scope.tasksFiltre.push($scope.tasksProject[i]);
        //         }
        //     }
        // };

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
                    function(data) {
                        $scope.invertions = data;
                        for (var i = 0; i<$scope.invertions.length; i++) {
                            if ($scope.invertions[i].userId == localStorageService.get('currentUserId')) {
                                $scope.amount = $scope.invertions[i].amount;
                            }
                        }
                        $scope.getFinancierEsimateRevenue();
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.estimateRevenueF = 0;

        $scope.getFinancierEsimateRevenue = function () {
            var porcientoF= (parseFloat($scope.amount)/parseFloat($scope.currentProjectActive.totalCost)*100.0);
            var estimateRevenueO = (parseFloat($scope.currentProjectActive.revenueOwner)/100.0)* parseFloat($scope.currentProjectActive.totalRevenue);
            $scope.estimateRevenueF = (porcientoF/100.0)* (parseFloat($scope.currentProjectActive.totalRevenue) - estimateRevenueO);
        };

        $scope.goToTask = function (taskId) {
            localStorageService.set('currentTaskId',taskId);
            $state.go('app.project.task_detail');
        };


//begin Gantt

        $scope.ganttStart = function (containerName) {
            var tasks = {
                data:[
                ],
                // links:[
                //     {id:1, source:1, target:2, type:"1"},
                //     {id:2, source:1, target:3, type:"1"},
                //     {id:3, source:3, target:4, type:"1"},
                //     {id:4, source:4, target:5, type:"0"},
                //     {id:5, source:5, target:6, type:"0"}
                // ]
            };
            gantt.config.columns =  [
                // {name:"text",       label:"Task name", tree:true },
                // {name:"duration",   label:"Duration"},
                // {name:"add",        label:""}
            ];

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

            gantt.attachEvent("onTaskClick", function(id, e) {
                // alert("You've just clicked an item with id="+id);
                return false;
            });
            gantt.attachEvent("onTaskDblClick", function(id, e) {
                // alert("You've just double clicked an item with id="+id);
                return false;
            });
        }
        // $scope.ganttStart();

    $scope.toggleMode = function(toggle) {
        toggle.enabled = !toggle.enabled;
        if (toggle.enabled) {
            toggle.innerHTML = "Set default Scale";
            //Saving previous scale state for future restore
            saveConfig();
            zoomToFit();
        } else {
            toggle.innerHTML = "Zoom to Fit";
            //Restore previous scale state
            restoreConfig();
            gantt.render();
        }
    }
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
    }
    function restoreConfig() {
        applyConfig(cachedSettings);
    }
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
    }
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
    }
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
    }
    //Setting available scales
    var scaleConfigs = [
        // minutes
        { unit: "minute", step: 1, scale_unit: "hour", date_scale: "%H", subscales: [
            {unit: "minute", step: 1, date: "%H:%i"}
        ]
        },
        // hours
        { unit: "hour", step: 1, scale_unit: "day", date_scale: "%j %M",
            subscales: [
                {unit: "hour", step: 1, date: "%H:%i"}
            ]
        },
        // days
        { unit: "day", step: 1, scale_unit: "month", date_scale: "%F",
            subscales: [
                {unit: "day", step: 1, date: "%j"}
            ]
        },
        // weeks
        {unit: "week", step: 1, scale_unit: "month", date_scale: "%F",
            subscales: [
                {unit: "week", step: 1, template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%d %M");
                    var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }}
            ]},
        // months
        { unit: "month", step: 1, scale_unit: "year", date_scale: "%Y",
            subscales: [
                {unit: "month", step: 1, date: "%M"}
            ]},
        // quarters
        { unit: "month", step: 3, scale_unit: "year", date_scale: "%Y",
            subscales: [
                {unit: "month", step: 3, template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%M");
                    var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }}
            ]},
        // years
        {unit: "year", step: 1, scale_unit: "year", date_scale: "%Y",
            subscales: [
                {unit: "year", step: 5, template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%Y");
                    var endDate = gantt.date.add(gantt.date.add(date, 5, "year"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }}
            ]},
        // decades
        {unit: "year", step: 10, scale_unit: "year", template: function (date) {
            var dateToStr = gantt.date.date_to_str("%Y");
            var endDate = gantt.date.add(gantt.date.add(date, 10, "year"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
        },
            subscales: [
                {unit: "year", step: 100, template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%Y");
                    var endDate = gantt.date.add(gantt.date.add(date, 100, "year"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }}
            ]}
    ];

//end Gantt
    }]);
