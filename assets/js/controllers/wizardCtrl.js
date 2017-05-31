'use strict';
/**
 * controller for Wizard Form example
 */
app.controller('WizardCtrl', ["$scope", "toaster", "localStorageService", "RestService", "$state",
    function ($scope, toaster, localStorageService, RestService, $state) {
        $scope.currentStep = 1;
        $scope.simpleProject = {
            creationDate: '',
            id: '',
            userId: localStorageService.get('currentUserId'),
            projectName: '',
            description: '',
            totalCost: '',
            minimalCost: '',
            estimateDuration: '',
            state: '', //1->In Preparation 2->On time 3->Best than Expected 4-Delayed 5->Finished
            deathLine: '',
            totalRevenue: '',
            revenueOwner: '',
            maxNumInves: '',
            minCapInves: '',
            outcomes: '',
            retributions: ''
        };

        $scope.risks = [
            // {
            //     name: '',
            //     description: ''
            // }
        ];

        $scope.tasks = [
            // {
            //     name: '',
            //     description: '',
            //     cost: '',
            //     outcome: '',
            //     startDate: '',
            //     duration: '',
            //     state: ''
            // }
        ];

        // outcomes
        $scope.outcomes = ['Producction', 'Income', 'New business'];
        // selected outcomes
        $scope.outcomesSelection = [];

        // retributions
        $scope.retributions = ['Pay Back, shared profits', 'Product Delivery', 'By Products', 'Stocks in the New Business'];
        // selected retributions
        $scope.retributionsSelection = [];        
        
        // toggle selection for a given outomes by name
        $scope.toggleOutcomeSelection = function (name) {
            var idx = $scope.outcomesSelection.indexOf(name);
            // is currently selected
            if (idx > -1) {
                $scope.outcomesSelection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.outcomesSelection.push(name);
            }
            console.log($scope.outcomesSelection);
        };
        // toggle selection for a given retribution by name
        $scope.toggleRetributionSelection = function (name) {
            var idx = $scope.retributionsSelection.indexOf(name);
            // is currently selected
            if (idx > -1) {
                $scope.retributionsSelection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.retributionsSelection.push(name);
            }
            console.log($scope.retributionsSelection);
        };

        $scope.createSimpleProject = function () {
            $scope.simpleProject.creationDate = new Date();
            $scope.simpleProject.state = '1';
            $scope.simpleProject.outcomes = $scope.outcomesSelection;
            $scope.simpleProject.retributions = $scope.retributionsSelection;

            var problems = '';

            if(parseInt($scope.simpleProject.minimalCost) > parseInt($scope.simpleProject.totalCost)) {
                toaster.pop('warning', 'Error', 'Total cost must be greater than minimal cost.');
            } else if(parseInt($scope.simpleProject.minCapInves) > parseInt($scope.simpleProject.totalCost)) {
                toaster.pop('warning', 'Error', 'Total cost must be greater than minimal capital investment.');
            } else if($scope.simpleProject.outcomes.length == 0) {
                toaster.pop('warning', 'Error', 'The project must have at least one outcome.');
            } else if($scope.simpleProject.retributions.length == 0) {
                toaster.pop('warning', 'Error', 'The project must have at least one retribution way.');
            } else if($scope.tasks.length == 0) {
                toaster.pop('warning', 'Error', 'The project must have at least one task.');
            }
            else {
                RestService.createSimpleProject($scope.simpleProject)
                    .then(
                        function(data) {
                            if(data == -1) {
                                toaster.pop('error', 'Error', 'Invalid project info.');
                            } else {
                                $scope.simpleProject.id = data;
                                $scope.addtasktoServer($scope.simpleProject.id);
                                toaster.pop('success', 'Good!!!', 'Project created correctly.');
                                $state.go('app.project.user_project');
                            }
                        },
                        function(errResponse) {
                            toaster.pop('error', 'Error', 'Database connection error.');
                        }
                    );
            }
        };

        $scope.addtasktoServer = function(projectId) {
            var comArr = eval( $scope.tasks );
            for (var i = 0; i<comArr.length; i++) {
                comArr[i].projectId = projectId;
                RestService.createTask(comArr[i])
                    .then(
                        function(data) {
                            console.log(data + "Tasks");
                        },
                        function(errResponse) {
                            console.log("error");
                        }
                    );
            }
        };

        $scope.addTask = function() {
            $scope.tasks.push({ 'name':$scope.task.name, 'description': $scope.task.description,
                'cost':$scope.task.cost, 'outcome':$scope.task.outcome, 'startDate':$scope.start,
                'duration':$scope.task.duration, 'state': '1', 
                'text':$scope.task.name, 'start_date':$scope.start, 'progress': 0});
            $scope.task.name = '';
            $scope.task.description = '';
            $scope.task.cost = '';
            $scope.task.outcome = '';
            $scope.start = '';
            $scope.task.duration = '';
            $scope.task.state = '1';

            var tasks = {data: $scope.tasks};
            gantt.parse (tasks);
        };

        $scope.removeTask = function(name){
            var index = -1;
            var comArr = eval( $scope.tasks );
            for( var i = 0; i < comArr.length; i++ ) {
                if( comArr[i].name === name ) {
                    index = i;
                    break;
                }
            }
            if( index === -1 ) {
                alert( "Something gone wrong" );
            }
            $scope.tasks.splice( index, 1 );
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
            toaster.pop('error', 'Error', 'Please complete the form in this step before proceeding');
        };

        //Date picker
        $scope.today = function() {
            $scope.simpleProject.deathLine = new Date();
        };
        $scope.today();
        $scope.start = $scope.minDate;
        $scope.end = $scope.maxDate;
        $scope.clear = function() {
            $scope.dt = null;
        };
        $scope.datepickerOptions = {
            showWeeks : false,
            startingDay : 1
        };
        $scope.dateDisabledOptions = {
            dateDisabled : disabled,
            showWeeks : false,
            startingDay : 1
        };
        $scope.startOptions = {
            showWeeks : false,
            startingDay : 1,
            minDate: $scope.minDate,
            maxDate: $scope.maxDate
        };
        $scope.endOptions = {
            showWeeks : false,
            startingDay : 1,
            minDate: $scope.minDate,
            maxDate: $scope.maxDate
        };
        // Disable weekend selection
        function disabled(data) {
            var date = data.date, mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }
        $scope.setDate = function(year, month, day) {
            $scope.simpleProject.deathLine = new Date(year, month, day);
        };
        $scope.toggleMin = function() {
            $scope.datepickerOptions.minDate = $scope.datepickerOptions.minDate ? null : new Date();
            $scope.dateDisabledOptions.minDate = $scope.dateDisabledOptions.minDate ? null : new Date();
        };
        $scope.maxDate = new Date(2020, 5, 22);
        $scope.minDate = new Date(1970, 12, 31);
        $scope.open = function() {
            $scope.opened = !$scope.opened;
        };
        $scope.endOpen = function() {
            $scope.endOptions.minDate = $scope.start;
            $scope.startOpened = false;
            $scope.endOpened = !$scope.endOpened;
        };
        $scope.startOpen = function() {
            $scope.startOptions.maxDate = $scope.end;
            $scope.endOpened = false;
            $scope.startOpened = !$scope.startOpened;
        };
        $scope.dateOptions = {
            formatYear : 'yy',
            startingDay : 1
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.hstep = 1;
        $scope.mstep = 15;

        // Time Picker
        $scope.options = {
            hstep : [1, 2, 3],
            mstep : [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = !$scope.ismeridian;
        };
        $scope.update = function() {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.dt = d;
        };
        $scope.changed = function() {
            $log.log('Time changed to: ' + $scope.simpleProject.deathLine);
        };
        $scope.clear = function() {
            $scope.simpleProject.deathLine = null;
        };

        $scope.ganttStart = function () {
            var tasks = {
                data:[
                    {id:11, text:"Project #1",start_date:"01-04-2013", duration:10,
                    progress: 0.6, open: false},
                    {id:12, text:"Task #1",   start_date:"03-04-2013", duration:5, 
                    progress: 1,   open: false},
                    {id:13, text:"Task #2",   start_date:"02-04-2013", duration:7, 
                    progress: 0.5, open: false},
                    {id:14, text:"Task #2.1", start_date:"03-04-2013", duration:2, 
                    progress: 1,   open: false},
                    {id:15, text:"Task #2.2", start_date:"04-04-2013", duration:3, 
                    progress: 0.8, open: false},
                    {id:16, text:"Task #2.3", start_date:"05-04-2013", duration:4, 
                    progress: 0.2, open: false}
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
            gantt.init("gantt_here"); 

            tasks.data = $scope.tasks;
            gantt.parse (tasks);
            // gantt.parse($scope.tasks);

            // gantt.attachEvent("onTaskClick", function(id, e) {
            //     // alert("You've just clicked an item with id="+id);
            //     return false;
            // });
            gantt.attachEvent("onTaskDblClick", function(id, e) {
                // alert("You've just double clicked an item with id="+id);
                return false;
            });

        }
        $scope.ganttStart();

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

}]);
