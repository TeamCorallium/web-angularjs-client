'use strict';
/**
 * controller for Wizard Form example
 */
app.controller('WizardCtrl', ["$scope", "$rootScope", "toaster", "localStorageService", "RestService", "$state",
    function ($scope, $rootScope, toaster, localStorageService, RestService, $state) {
        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {

            // $scope.$on("$destroy", function handler() {
            //     gantt.detachAllEvents();
            //     console.log("WizardCtrl destroy");
            // }); 

            $scope.currentStep = 1;
            $scope.simpleProject = {
                creationDate: '',
                id: '',
                userId: localStorageService.get('currentUserId'),
                projectName: '',
                description: '',
                totalCost: '',
                minimalCost: '0',
                estimateDuration: '', //calculable from tasks
                state: '', //0->Under Construction 1->In Preparation 2->On time 3->Best than Expected 4-Delayed 5->Finished
                deathLine: '',
                totalRevenue: '0',
                revenueOwner: '',
                minNumInves: '',
                maxNumInves: '',
                minCapInves: '',
                outcomes: [],
                retributions: [],
                mainLayout: 'assets/images/portfolio/image06.jpg',
                category: '',
                sector: '',
                background: '',
                beneficiaries: '',
                competitiveAdvantage: '',
                ownerInvestedCapital: 0,
                objetives: [],
                references: [],
                risks: [],
                inverted : false,
            };

            $scope.risk = {
                name: '',
                description: '',
                probability: '',
                mitigate: ''
            };

            $scope.tasks = [];

            $scope.task = {
                name: '',
                description: '',
                cost: '',
                outcome: '',
                startDate: '',
                duration: '',
                state: ''
            };

            $scope.reference = {
                name: '',
                description: '',
                file: ''
            };

            $scope.getProjectById = function () {
                if(localStorageService.get('currentProjectId') != '') {
                    RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                        .then(
                            function (data) {
                                $scope.simpleProject = data[0];
                                $scope.simpleProject.deathLine = new Date($scope.simpleProject.deathLine);

                                for (var i = 0; i < $scope.simpleProject.outcomes.length; i++) {
                                    var name = $scope.simpleProject.outcomes[i].name;
                                    var description = $scope.simpleProject.outcomes[i].description;
                                    for (var j = 0; j < $scope.outcomes.length; j++) {
                                        if(name == $scope.outcomes[j].name) {
                                            $scope.outcomes[j].description = description;
                                            $scope.simpleProject.outcomes[i] = $scope.outcomes[j];
                                            break;
                                        }
                                    }
                                }
                                for (var i = 0; i < $scope.simpleProject.retributions.length; i++) {
                                    var name = $scope.simpleProject.retributions[i].name;
                                    var description = $scope.simpleProject.retributions[i].description;
                                    for (var j = 0; j < $scope.retributions.length; j++) {
                                        if(name == $scope.retributions[j].name) {
                                            $scope.retributions[j].description = description;
                                            $scope.simpleProject.retributions[i] = $scope.retributions[j];
                                            break;
                                        }
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
            $scope.getProjectById();

            $scope.getTaskByProjectsId = function () {
                if(localStorageService.get('currentProjectId') != '') {
                    RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                        .then(
                            function (data) {
                                $scope.tasks = data;

                                var tasks = {data: $scope.tasks.slice()};

                                //begin gantt
                                for (var i = 0; i < $scope.tasks.length; i++) {
                                    tasks.data[i].text = tasks.data[i].name;
                                    tasks.data[i].start_date = new Date(tasks.data[i].startDate);
                                    tasks.data[i].end_date = '';

                                    $scope.tasks[i].startDate = new Date(tasks.data[i].startDate);
                                    $scope.tasks[i].end_date = '';
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
                }
            };           
            $scope.getTaskByProjectsId();

            // outcomes
            $scope.outcomes = [{name: 'Producction', description: ''}, {
                name: 'Income',
                description: ''
            }, {name: 'New business', description: ''}];

            // retributions
            $scope.retributions = [{name: 'Pay Back, shared profits', description: ''}, {
                name: 'Product Delivery',
                description: ''
            }, {name: 'By Products', description: ''}, {name: 'Stocks in the New Business', description: ''}];

            // toggle selection for a given outomes by name
            $scope.toggleOutcomeSelection = function (name) {
                var idx = $scope.simpleProject.outcomes.indexOf(name);
                // is currently selected
                if (idx > -1) {
                    $scope.simpleProject.outcomes.splice(idx, 1);
                }
                // is newly selected
                else {
                    $scope.simpleProject.outcomes.push(name);
                }
                console.log($scope.simpleProject.outcomes);
            };
            // toggle selection for a given retribution by name
            $scope.toggleRetributionSelection = function (name) {
                var idx = $scope.simpleProject.retributions.indexOf(name);
                // is currently selected
                if (idx > -1) {
                    $scope.simpleProject.retributions.splice(idx, 1);
                }
                // is newly selected
                else {
                    $scope.simpleProject.retributions.push(name);
                }
                console.log($scope.simpleProject.retributions);
            };

            $scope.noImage = false;

            $scope.removeImage = function () {
                $scope.noImage = true;
                $rootScope.$broadcast('imageRemoved');
                console.log("removeImage");
            };

            $rootScope.$on('mainLayoutChanged', function (event, opt) {
                console.log('mainLayoutChanged ' + opt.layout);
                $scope.simpleProject.mainLayout = RestService.uploads + opt.layout;
            });

            $rootScope.$on('referenceFileLoaded', function (event, opt) {
                console.log('referenceFileLoaded ' + opt.reference);
                $scope.reference.file = RestService.uploads + opt.reference;
            });

            $scope.createSimpleProject = function (action) {
                $scope.simpleProject.creationDate = new Date();
                $scope.simpleProject.state = '1';

                if (action == 'save') {
                    $scope.simpleProject.state = '0';
                }

                //begin estimateDuration calculation. this must be on the server side
                $scope.simpleProject.estimateDuration = 0;
                if($scope.tasks.length != 0) {
                    $scope.tasks.sort(function(a,b){a.startDate - b.startDate});
                    var length = $scope.tasks.length;
                    var timeDiff = Math.abs($scope.tasks[length-1].startDate - $scope.tasks[0].startDate);
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                    var duration = diffDays + parseInt($scope.tasks[length-1].duration);
                    console.log(duration);
                    $scope.simpleProject.estimateDuration = duration;
                }
                //end estimateDuration calculation

                RestService.createSimpleProject($scope.simpleProject)
                    .then(
                        function (data) {
                            if (data == -1) {
                                toaster.pop('error', 'Error', 'Invalid project info.');
                            } else {
                                $scope.simpleProject.id = data;
                                $scope.addtasktoServer($scope.simpleProject.id);
                                
                                if (action == 'publish') {
                                    toaster.pop('success', 'Success', 'Project was created and publish correctly.');
                                }
                                else {
                                    toaster.pop('success', 'Success', 'Project was saved correctly.');
                                }
                            }
                            $state.go('app.project.user_project');
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Database connection error.');
                        }
                    );
            };

            $scope.addtasktoServer = function (projectId) {
                var comArr = eval($scope.tasks);
                for (var i = 0; i < comArr.length; i++) {
                    comArr[i].projectId = projectId;
                    RestService.createTask(comArr[i])
                        .then(
                            function (data) {
                                console.log(data + "Tasks");
                            },
                            function (errResponse) {
                                console.log("error");
                            }
                        );
                }
            };

            $scope.addObjetive = function () {
                if ($scope.objetive == '') {
                    toaster.pop('warning', 'Error', 'Please, enter an objetive description.');
                    return false;
                }
                $scope.simpleProject.objetives.push($scope.objetive);
                $scope.objetive = '';
            };

            $scope.removeObjetive = function (name) {
                var index = -1;
                var comArr = eval($scope.simpleProject.objetives);
                for (var i = 0; i < comArr.length; i++) {
                    if (comArr[i] === name) {
                        index = i;
                        break;
                    }
                }
                if (index === -1) {
                    alert("Something gone wrong");
                }
                $scope.simpleProject.objetives.splice(index, 1);
            };

            $scope.addReference = function () {
                if ($scope.reference.name == '') {
                    toaster.pop('warning', 'Error', 'Please, enter an reference name.');
                    return false;
                }
                if ($scope.reference.description == '') {
                    toaster.pop('warning', 'Error', 'Please, enter an reference description.');
                    return false;
                }
                $scope.simpleProject.references.push({
                    'name': $scope.reference.name, 'description': $scope.reference.description,
                    'file': $scope.reference.file
                });

                $scope.reference.name = '';
                $scope.reference.description = '';
                $scope.reference.file = '';
                $rootScope.$broadcast('referenceAdded');
            };

            $scope.removeReference = function (name) {
                var index = -1;
                var comArr = eval($scope.simpleProject.references);
                for (var i = 0; i < comArr.length; i++) {
                    if (comArr[i].name === name) {
                        index = i;
                        break;
                    }
                }
                if (index === -1) {
                    alert("Something gone wrong");
                }
                $scope.simpleProject.references.splice(index, 1);
            };

            $scope.addRisk = function () {
                if ($scope.risk.name == '') {
                    toaster.pop('warning', 'Error', 'Please, enter a risk name.');
                    return false;
                }
                if ($scope.risk.description == '') {
                    toaster.pop('warning', 'Error', 'Please, enter a risk description.');
                    return false;
                }
                $scope.simpleProject.risks.push({
                    'name': $scope.risk.name, 'description': $scope.risk.description,
                    'probability': $scope.risk.probability, 'mitigate': $scope.risk.mitigate
                });

                $scope.risk.name = '';
                $scope.risk.description = '';
                $scope.risk.probability = '';
                $scope.risk.mitigate = '';
            };

            $scope.removeRisk = function (name) {
                var index = -1;
                var comArr = eval($scope.simpleProject.risks);
                for (var i = 0; i < comArr.length; i++) {
                    if (comArr[i].name === name) {
                        index = i;
                        break;
                    }
                }
                if (index === -1) {
                    alert("Something gone wrong");
                }
                $scope.simpleProject.risks.splice(index, 1);
            };

            $scope.addTask = function () {

                if ($scope.task.name == '') {
                    toaster.pop('warning', 'Error', 'Please, define a task name.');
                    return false;
                }
                if ($scope.task.cost == '') {
                    toaster.pop('warning', 'Error', 'Please, define a task cost.');
                    return false;
                }
                if ($scope.task.cost > $scope.getTaskPossibleCost()) {
                    toaster.pop('warning', 'Error', 'Please, define a permited task cost. The maximun possible cost is: $'+$scope.getTaskPossibleCost() + ". Maybe you should change the project total cost.");
                    return false;                    
                }
                if ($scope.task.description == '') {
                    toaster.pop('warning', 'Error', 'Please, define a task description.');
                    return false;
                }
                if ($scope.task.duration == '') {
                    toaster.pop('warning', 'Error', 'Please, define a task duration.');
                    return false;
                }
                if ($scope.task.start == '') {
                    toaster.pop('warning', 'Error', 'Please, define a task start date.');
                    return false;
                }
                if ($scope.task.outcome == '') {
                    toaster.pop('warning', 'Error', 'Please, define a task outcome.');
                    return false;
                }

                $scope.tasks.push({
                    'name': $scope.task.name, 'description': $scope.task.description,
                    'cost': $scope.task.cost, 'outcome': $scope.task.outcome, 'startDate': $scope.start,
                    'duration': $scope.task.duration, 'state': '1',
                    'text': $scope.task.name, 'start_date': $scope.start, 'progress': 0
                });

                $scope.task.name = '';
                $scope.task.description = '';
                $scope.task.cost = '';
                $scope.task.outcome = '';
                // $scope.start = '';
                $scope.task.duration = '';
                $scope.task.state = '1';

                var tasks = {data: $scope.tasks.slice()};

                $scope.ganttStart("gantt_here");
                gantt.clearAll();
                gantt.parse(tasks);
                gantt.refreshData();
                gantt.render();
            };

            $scope.removeTask = function (name) {
                var index = -1;
                var taskId = '';
                var comArr = eval($scope.tasks);
                for (var i = 0; i < comArr.length; i++) {
                    if (comArr[i].name === name) {
                        index = i;
                        taskId = comArr[i].id;
                        break;
                    }
                }
                if (index === -1) {
                    alert("Something gone wrong");
                }
                $scope.tasks.splice(index, 1);
                if (taskId != '') {
                    RestService.deleteTask(taskId)
                        .then(
                            function (data) {
                                // $scope.getTaskByProjectsId();
                            },
                            function (errResponse) {
                                toaster.pop('error', 'Error', 'Server not available.');
                                console.log(errResponse);
                            }
                        );                  
                }

                var tasks = {data: $scope.tasks.slice()};

                if ($scope.tasks.length == 0) {
                    $scope.ganttStart("gantt_hide");
                }
                else {
                    $scope.ganttStart("gantt_here");
                }
                gantt.clearAll();
                gantt.parse(tasks);
                gantt.render();
            };

            $scope.getTaskPossibleCost = function() {
                var currentCost = 0;
                for (var i = 0; i < $scope.tasks.length; i++) {
                    currentCost += parseInt($scope.tasks[i].cost);
                }
                console.log('getTaskPossibleCost');
                console.log(parseInt($scope.simpleProject.totalCost) - currentCost);

                return parseInt($scope.simpleProject.totalCost) - currentCost;
            }

            $scope.getDate = function (date) {
                var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return monthArray[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            }

            // Initial Value
            $scope.form = {

                next: function (form) {

                    $scope.toTheTop();

                    if (validateSteps($scope.currentStep, 'next') == false) {
                        return;
                    }

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

                    if (validateSteps(i, 'goto') == false) {
                        return;
                    }

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

            var validateSteps = function (step, op) {
                if (step == '1') {
                    if (parseInt($scope.simpleProject.ownerInvestedCapital) > parseInt($scope.simpleProject.totalCost)) {
                        toaster.pop('warning', 'Error', 'Total cost must be greater than owner invested capital.');
                        return false;
                    }
                    if (parseInt($scope.simpleProject.minimalCost) > parseInt($scope.simpleProject.totalCost)) {
                        toaster.pop('warning', 'Error', 'Total cost must be greater than minimal cost.');
                        return false;
                    }
                    if (parseInt($scope.simpleProject.minNumInves) > parseInt($scope.simpleProject.maxNumInves)) {
                        toaster.pop('warning', 'Error', 'Max Number of Investors must be greater than minimal.');
                        return false;
                    }                    
                    if (parseInt($scope.simpleProject.minCapInves) > parseInt($scope.simpleProject.totalCost)) {
                        toaster.pop('warning', 'Error', 'Total cost must be greater than minimal capital investment.');
                        return false;
                    }
                    if ($scope.simpleProject.outcomes.length == 0) {
                        toaster.pop('warning', 'Error', 'The project must have at least one outcome.');
                        return false;
                    }
                    if ($scope.simpleProject.retributions.length == 0) {
                        toaster.pop('warning', 'Error', 'The project must have at least one retribution way.');
                        return false;
                    }
                }

                console.log(parseInt(step));
                var s = parseInt(step);
                if (op == 'next') {
                    s += 1;
                }
                if (s > 3) {
                    if ($scope.tasks.length == 0) {
                        toaster.pop('warning', 'Error', 'The project must have at least one task.');
                        return false;
                    }
                }
                return true;
            };

            //Date picker
            $scope.today = function () {
                $scope.simpleProject.deathLine = new Date();
            };
            $scope.today();
            // $scope.start = $scope.minDate;
            $scope.start = $scope.simpleProject.deathLine;
            $scope.end = $scope.maxDate;
            $scope.clear = function () {
                $scope.dt = null;
            };
            $scope.datepickerOptions = {
                showWeeks: false,
                startingDay: 1
            };
            $scope.dateDisabledOptions = {
                dateDisabled: disabled,
                showWeeks: false,
                startingDay: 1
            };
            $scope.startOptions = {
                showWeeks: false,
                startingDay: 1,
                minDate: $scope.minDate,
                maxDate: $scope.maxDate
            };
            $scope.endOptions = {
                showWeeks: false,
                startingDay: 1,
                minDate: $scope.minDate,
                maxDate: $scope.maxDate
            };
            // Disable weekend selection
            function disabled(data) {
                var date = data.date, mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            $scope.setDate = function (year, month, day) {
                $scope.simpleProject.deathLine = new Date(year, month, day);
            };
            $scope.toggleMin = function () {
                $scope.datepickerOptions.minDate = $scope.datepickerOptions.minDate ? null : new Date();
                $scope.dateDisabledOptions.minDate = $scope.dateDisabledOptions.minDate ? null : new Date();
            };
            $scope.maxDate = new Date(2020, 5, 22);
            $scope.minDate = new Date(1970, 12, 31);
            $scope.open = function () {
                $scope.opened = !$scope.opened;
            };
            $scope.endOpen = function () {
                $scope.endOptions.minDate = $scope.start;
                $scope.startOpened = false;
                $scope.endOpened = !$scope.endOpened;
            };
            $scope.startOpen = function () {
                $scope.startOptions.maxDate = $scope.end;
                $scope.endOpened = false;
                $scope.startOpened = !$scope.startOpened;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            $scope.hstep = 1;
            $scope.mstep = 15;

            // Time Picker
            $scope.options = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
            };

            $scope.ismeridian = true;
            $scope.toggleMode = function () {
                $scope.ismeridian = !$scope.ismeridian;
            };
            $scope.update = function () {
                var d = new Date();
                d.setHours(14);
                d.setMinutes(0);
                $scope.dt = d;
            };
            $scope.changed = function () {
                $log.log('Time changed to: ' + $scope.simpleProject.deathLine);
            };
            $scope.clear = function () {
                $scope.simpleProject.deathLine = null;
            };

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

                gantt.config.drag_move = false;
                gantt.config.drag_links = false;
                gantt.config.drag_resize = false;
                gantt.config.drag_progress = false;
                gantt.config.autosize = "y";
                gantt.config.keyboard_navigation_cells = true;
                gantt.config.touch = true;
                gantt.init(containerName);

                gantt.clearAll();
                tasks.data = $scope.tasks.slice();
                gantt.parse(tasks);
                // gantt.parse($scope.tasks);

                gantt.attachEvent("onTaskClick", function (id, e) {
                    // alert("You've just clicked an item with id="+id);
                    return false;
                });
                gantt.attachEvent("onTaskDblClick", function (id, e) {
                    // alert("You've just double clicked an item with id="+id);
                    return false;
                });
            }
            $scope.ganttStart("gantt_hide");

            $scope.toggleMode = function (toggle) {
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
        }       
}]);
