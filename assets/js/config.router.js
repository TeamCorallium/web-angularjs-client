'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        // LAZY MODULES

        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        // APPLICATION ROUTES
        // -----------------------------------
        // For any unmatched url, redirect to /app/dashboard
        // $urlRouterProvider.otherwise("/app/dashboard");

        $urlRouterProvider.otherwise("/app/default");
        //
        // Set up the states
        $stateProvider.state('app', {
            url: "/app",
            templateUrl: "assets/views/app.html",
            resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'toaster',
                'ngAside', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'chatCtrl',
                'truncate', 'htmlToPlaintext', 'angular-notification-icons','flow','userCtrl'),
            abstract: true
        }).state('app.default', {
            url: '/default',
            templateUrl: "assets/views/default.html",
            ncyBreadcrumb: {
                label: 'Home'
            },
            resolve: loadSequence('vAccordionCtrl')
        }).state('app.home', {
            url: '/home',
            templateUrl: "assets/views/home.html",
            ncyBreadcrumb: {
                label: 'Home'
            }
        }).state('app.statistics', {
            url: "/statistics",
            templateUrl: "assets/views/dashboard.html",
            resolve: loadSequence('jquery-sparkline', 'dashboardCtrl'),
            title: 'Statistics',
            ncyBreadcrumb: {
                label: 'Statistics'
            }
        }).state('app.explore', {
            url: '/explore',
            templateUrl: "assets/views/explore.html",
            title: 'Explore',
            ncyBreadcrumb: {
                label: 'Explore'
            },
            resolve: loadSequence('exploreCtrl')
        }).state('app.finance', {
            url: '/finance',
            templateUrl: "assets/views/finance.html",
            title: 'Finance',
            ncyBreadcrumb: {
                label: 'Finance'
            },
            resolve: loadSequence('financeCtrl')
        }).state('app.allfinance', {
            url: '/allfinance',
            templateUrl: "assets/views/allMyFinanciersProjects.html",
            title: 'Finance',
            ncyBreadcrumb: {
                label: 'Finance'
            },
            resolve: loadSequence('allMyFinancierProjectsCtrl')
        }).state('app.news', {
            url: '/news',
            templateUrl: "assets/views/news.html",
            title: 'News',
            ncyBreadcrumb: {
                label: 'News'
            }
        }).state('app.notification', {
            url: '/notification',
            templateUrl: "assets/views/notification.html",
            title: 'Notification',
            ncyBreadcrumb: {
                label: 'Notification'
            },
            resolve: loadSequence('notificationCtrl')
        }).state('app.opportunities-list-task', {
            url: '/opportunitieslisttask',
            templateUrl: "assets/views/opportunities-list-task.html",
            title: 'Opportunities List Task',
            ncyBreadcrumb: {
                label: 'Opportunities List Task'
            },
            resolve: loadSequence('currentUserProjects', 'opportunitiesListTaskCtrl')
        }).state('app.project', {
            url: '/project',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Project',
            ncyBreadcrumb: {
                label: 'Project'
            }
        }).state('app.project.create', {
            url: '/create',
            templateUrl: "assets/views/project_create.html",
            title: 'Create Project',
            ncyBreadcrumb: {
                label: 'Create Project'
            }
        }).state('app.project.create_complex', {
            url: '/createcomplex',
            templateUrl: "assets/views/project_create_complex.html",
            title: 'Create Complex Project',
            ncyBreadcrumb: {
                label: 'Create Complex Project'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker')
        }).state('app.project.owner_evaluation', {
            url: 'evaluation',
            templateUrl: "assets/views/owner_evaluation.html",
            title: 'Owner Evaluation',
            ncyBreadcrumb: {
                label: 'Owner Evaluation'
            },
            resolve: loadSequence('currentUserProjects')
        }).state('app.project.finish_proyect_summary', {
            url: 'finishproyects',
            templateUrl: "assets/views/finish_proyect_sumary.html",
            title: 'Finish Proyects',
            ncyBreadcrumb: {
                label: 'Finish Proyects Summary'
            },
            resolve: loadSequence('currentUserProjects')
        }).state('app.project.proposal_sharing', {
            url: 'proposalsharing',
            templateUrl: "assets/views/proposal_sharing.html",
            title: 'Proposal Sharing',
            ncyBreadcrumb: {
                label: 'Proposal Sharing'
            },
            resolve: loadSequence('currentUserProjects','xeditable', 'checklist-model', 'xeditableCtrl')
        }).state('app.project.multiproposal_sharing', {
            url: 'multiproposalsharing',
            templateUrl: "assets/views/proposal_sharing.html",
            title: 'Multiproposal Sharing',
            ncyBreadcrumb: {
                label: 'Multiproposal Sharing'
            },
            resolve: loadSequence('currentUserProjects','xeditable', 'checklist-model', 'xeditableCtrl')
        }).state('app.project.subproject_detail', {
            url: '/subpoject',
            templateUrl: "assets/views/subproject.html",
            title: 'Project',
            ncyBreadcrumb: {
                label: 'Subproject'
            },
            resolve: loadSequence('wizardCtrl', 'ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl','vAccordionCtrl', 'subprojectCtrl', 'taskCtrl')
        }).state('app.project.explore_subproject', {
            url: '/exploresubpoject',
            templateUrl: "assets/views/explore_subproject.html",
            title: 'Explore Project',
            ncyBreadcrumb: {
                label: 'Explore Subproject'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl','vAccordionCtrl', 'exploreSubprojectCtrl','taskCtrl')
        }).state('app.project.opportunities_detail', {
            url: '/opportunitiesdetail',
            templateUrl: "assets/views/opportunities-detail.html",
            title: 'Opportunities',
            ncyBreadcrumb: {
                label: 'Opportunities detail'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl','vAccordionCtrl', 'opportunitiesDetailCtrl')
        }).state('app.project.subproject_list_task', {
            url: '/listtask',
            templateUrl: "assets/views/subproject_list_task.html",
            title: 'Project',
            ncyBreadcrumb: {
                label: 'List Tasks'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl', 'subprojectListTaskCtrl')
        }).state('app.project.explore_subproject_list_task', {
            url: '/explorelisttask',
            templateUrl: "assets/views/explore_subproject_list_task.html",
            title: 'Project',
            ncyBreadcrumb: {
                label: 'Project List Tasks'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl', 'exploreSubprojectListTaskCtrl')
        }).state('app.project.task_detail', {
            url: '/task',
            templateUrl: "assets/views/task_detail.html",
            title: 'Project',
            ncyBreadcrumb: {
                label: 'Task'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl','vAccordionCtrl', 'subprojectTaskDetailCtrl')
        }).state('app.project.opportunities_task_detail', {
            url: '/opportunitytask',
            templateUrl: "assets/views/opportunities_task_detail.html",
            title: 'Task',
            ncyBreadcrumb: {
                label: 'Opportunity Task'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl','vAccordionCtrl', 'opportunitiesTaskDetailCtrl')
        }).state('app.project.explore_task_detail', {
            url: '/exploretask',
            templateUrl: "assets/views/explore_task_detail.html",
            title: 'Task',
            ncyBreadcrumb: {
                label: 'Explore Task'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl','vAccordionCtrl', 'exploreTaskDetailCtrl')
        }).state('app.project.user_project', {
            url: '/userprojects ',
            templateUrl: "assets/views/project_user.html",
            title: 'User Projects',
            ncyBreadcrumb: {
                label: 'User Projects'
            },
            resolve: loadSequence('projectUserCtrl', 'xeditable', 'checklist-model','sweetAlertCtrl')
        }).state('app.project.opportunities', {
            url: '/opportunities ',
            templateUrl: "assets/views/opportunities.html",
            title: 'Opportunities',
            ncyBreadcrumb: {
                label: 'Opportunities'
            },
            resolve: loadSequence('opportunitiesCtrl', 'xeditable', 'checklist-model')
        }).state('app.project.wizard', {
            url: '/wizard',
            templateUrl: "assets/views/project_wizard.html",
            title: 'Wizard',
            ncyBreadcrumb: {
                label: 'Wizard'
            },
            resolve: loadSequence('wizardCtrl', 'ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker', 'angularFileUpload', 'uploadCtrl', 'dynamicTableCtrl')
        }).state('app.login', {
            url: '/login',
            template: '<div ui-view class="fade-in-right-big smooth"></div>',
            abstract: true
        }).state('app.login.signin', {
            url: '/signin',
            templateUrl: "assets/views/sing_in.html",
            resolve: loadSequence('flow', 'userCtrl')
        }).state('app.login.password_forgot', {
            url: '/forgot',
            templateUrl: "assets/views/password_forgot.html"
        }).state('app.login.forgot', {
            url: '/forgot',
            templateUrl: "assets/views/login_forgot.html"
        }).state('app.login.registration', {
            url: '/registration',
            templateUrl: "assets/views/sing_up.html",
            resolve: loadSequence('flow', 'userCtrl')
        }).state('app.ui', {
            url: '/ui',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'UI Elements',
            ncyBreadcrumb: {
                label: 'UI Elements'
            }
        }).state('app.ui.elements', {
            url: '/elements',
            templateUrl: "assets/views/ui_elements.html",
            title: 'Elements',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: 'Elements'
            }
        }).state('app.ui.buttons', {
            url: '/buttons',
            templateUrl: "assets/views/ui_buttons.html",
            title: 'Buttons',
            resolve: loadSequence('spin', 'ladda', 'angular-ladda', 'laddaCtrl'),
            ncyBreadcrumb: {
                label: 'Buttons'
            }
        }).state('app.ui.links', {
            url: '/links',
            templateUrl: "assets/views/ui_links.html",
            title: 'Link Effects',
            ncyBreadcrumb: {
                label: 'Link Effects'
            }
        }).state('app.ui.icons', {
            url: '/icons',
            templateUrl: "assets/views/ui_icons.html",
            title: 'Font Awesome Icons',
            ncyBreadcrumb: {
                label: 'Font Awesome Icons'
            },
            resolve: loadSequence('iconsCtrl')
        }).state('app.ui.lineicons', {
            url: '/line-icons',
            templateUrl: "assets/views/ui_line_icons.html",
            title: 'Linear Icons',
            ncyBreadcrumb: {
                label: 'Linear Icons'
            },
            resolve: loadSequence('iconsCtrl')
        }).state('app.ui.modals', {
            url: '/modals',
            templateUrl: "assets/views/ui_modals.html",
            title: 'Modals',
            ncyBreadcrumb: {
                label: 'Modals'
            },
            resolve: loadSequence('asideCtrl')
        }).state('app.ui.toggle', {
            url: '/toggle',
            templateUrl: "assets/views/ui_toggle.html",
            title: 'Toggle',
            ncyBreadcrumb: {
                label: 'Toggle'
            }
        }).state('app.ui.tabs_accordions', {
            url: '/accordions',
            templateUrl: "assets/views/ui_tabs_accordions.html",
            title: "Tabs & Accordions",
            ncyBreadcrumb: {
                label: 'Tabs & Accordions'
            },
            resolve: loadSequence('vAccordionCtrl')
        }).state('app.ui.panels', {
            url: '/panels',
            templateUrl: "assets/views/ui_panels.html",
            title: 'Panels',
            ncyBreadcrumb: {
                label: 'Panels'
            }
        }).state('app.ui.notifications', {
            url: '/notifications',
            templateUrl: "assets/views/ui_notifications.html",
            title: 'Notifications',
            ncyBreadcrumb: {
                label: 'Notifications'
            },
            resolve: loadSequence('toasterCtrl', 'sweetAlertCtrl', 'NotificationIconsCtrl')
        }).state('app.ui.treeview', {
            url: '/treeview',
            templateUrl: "assets/views/ui_tree.html",
            title: 'TreeView',
            ncyBreadcrumb: {
                label: 'Treeview'
            },
            resolve: loadSequence('angularBootstrapNavTree', 'treeCtrl')
        }).state('app.ui.media', {
            url: '/media',
            templateUrl: "assets/views/ui_media.html",
            title: 'Media',
            ncyBreadcrumb: {
                label: 'Media'
            }
        }).state('app.ui.nestable', {
            url: '/nestable2',
            templateUrl: "assets/views/ui_nestable.html",
            title: 'Nestable List',
            ncyBreadcrumb: {
                label: 'Nestable List'
            },
            resolve: loadSequence('jquery-nestable-plugin', 'ng-nestable', 'nestableCtrl')
        }).state('app.ui.typography', {
            url: '/typography',
            templateUrl: "assets/views/ui_typography.html",
            title: 'Typography',
            ncyBreadcrumb: {
                label: 'Typography'
            }
        }).state('app.table', {
            url: '/table',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Tables',
            ncyBreadcrumb: {
                label: 'Tables'
            }
        }).state('app.table.basic', {
            url: '/basic',
            templateUrl: "assets/views/table_basic.html",
            title: 'Basic Tables',
            ncyBreadcrumb: {
                label: 'Basic'
            }
        }).state('app.table.responsive', {
            url: '/responsive',
            templateUrl: "assets/views/table_responsive.html",
            title: 'Responsive Tables',
            ncyBreadcrumb: {
                label: 'Responsive'
            }
        }).state('app.table.dynamic', {
            url: '/dynamic',
            templateUrl: "assets/views/table_dynamic.html",
            title: 'Dynamic Tables',
            ncyBreadcrumb: {
                label: 'Dynamic'
            },
            resolve: loadSequence('dynamicTableCtrl')
        }).state('app.table.data', {
            url: '/data',
            templateUrl: "assets/views/table_data.html",
            title: 'ngTable',
            ncyBreadcrumb: {
                label: 'ngTable'
            },
            resolve: loadSequence('ngTable', 'ngTableCtrl')
        }).state('app.table.export', {
            url: '/export',
            templateUrl: "assets/views/table_export.html",
            title: 'Table'
        }).state('app.form', {
            url: '/form',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Forms',
            ncyBreadcrumb: {
                label: 'Forms'
            }
        }).state('app.form.elements', {
            url: '/elements',
            templateUrl: "assets/views/form_elements.html",
            title: 'Forms Elements',
            ncyBreadcrumb: {
                label: 'Elements'
            },
            resolve: loadSequence('ui.select', 'monospaced.elastic', 'ui.mask', 'touchspin-plugin', 'selectCtrl', 'spectrum-plugin', 'angularSpectrumColorpicker')
        }).state('app.form.xeditable', {
            url: '/xeditable',
            templateUrl: "assets/views/form_xeditable.html",
            title: 'Angular X-Editable',
            ncyBreadcrumb: {
                label: 'X-Editable'
            },
            resolve: loadSequence('xeditable', 'checklist-model', 'xeditableCtrl')
        }).state('app.form.texteditor', {
            url: '/editor',
            templateUrl: "assets/views/form_text_editor.html",
            title: 'Text Editor',
            ncyBreadcrumb: {
                label: 'Text Editor'
            },
            resolve: loadSequence('ckeditor-plugin', 'ckeditor', 'ckeditorCtrl')
        }).state('app.form.wizard', {
            url: '/wizard',
            templateUrl: "assets/views/form_wizard.html",
            title: 'Form Wizard',
            ncyBreadcrumb: {
                label: 'Wizard'
            },
            resolve: loadSequence('wizardCtrl')
        }).state('app.form.validation', {
            url: '/validation',
            templateUrl: "assets/views/form_validation.html",
            title: 'Form Validation',
            ncyBreadcrumb: {
                label: 'Validation'
            },
            resolve: loadSequence('validationCtrl')
        }).state('app.form.cropping', {
            url: '/image-cropping',
            templateUrl: "assets/views/form_image_cropping.html",
            title: 'Image Cropping',
            ncyBreadcrumb: {
                label: 'Image Cropping'
            },
            resolve: loadSequence('ngImgCrop', 'cropCtrl')
        }).state('app.form.upload', {
            url: '/file-upload',
            templateUrl: "assets/views/form_file_upload.html",
            title: 'Multiple File Upload',
            ncyBreadcrumb: {
                label: 'File Upload'
            },
            resolve: loadSequence('angularFileUpload', 'uploadCtrl')
        }).state('app.pages', {
            url: '/pages',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Pages',
            ncyBreadcrumb: {
                label: 'Pages'
            }
        }).state('app.pages.user', {
            url: '/user',
            templateUrl: "assets/views/pages_user_profile.html",
            title: 'User Profile',
            ncyBreadcrumb: {
                label: 'User Profile'
            },
            resolve: loadSequence('flow', 'userCtrl')
        }).state('app.pages.exploreuser', {
            url: '/exploreuser',
            templateUrl: "assets/views/exploreUserProfileView.html",
            title: 'Explore User Profile',
            ncyBreadcrumb: {
                label: 'Explore User Profile'
            },
            resolve: loadSequence('flow', 'exploreUserProfileViewCtrl')
        }).state('app.pages.invoice', {
            url: '/invoice',
            templateUrl: "assets/views/pages_invoice.html",
            title: 'Invoice',
            ncyBreadcrumb: {
                label: 'Invoice'
            }
        }).state('app.pages.timeline', {
            url: '/timeline',
            templateUrl: "assets/views/pages_timeline.html",
            title: 'Timeline',
            ncyBreadcrumb: {
                label: 'Timeline'
            },
            resolve: loadSequence('ngMap')
        }).state('app.pages.calendar', {
            url: '/calendar',
            templateUrl: "assets/views/pages_calendar.html",
            title: 'Calendar',
            ncyBreadcrumb: {
                label: 'Calendar'
            },
            resolve: loadSequence('moment', 'mwl.calendar', 'calendarCtrl')
        }).state('app.pages.messages', {
            url: '/messages',
            templateUrl: "assets/views/pages_messages.html",
            resolve: loadSequence('truncate', 'htmlToPlaintext', 'inboxCtrl')
        }).state('app.pages.messages.inbox', {
            url: '/inbox/:inboxID',
            templateUrl: "assets/views/pages_inbox.html",
            controller: 'ViewMessageCrtl'
        }).state('app.pages.blank', {
            url: '/blank',
            templateUrl: "assets/views/pages_blank_page.html",
            ncyBreadcrumb: {
                label: 'Starter Page'
            }
        }).state('app.utilities', {
            url: '/utilities',
            template: '<div ui-view class="fade-in-up"></div>',
            title: 'Utilities',
            ncyBreadcrumb: {
                label: 'Utilities'
            }
        }).state('app.utilities.search', {
            url: '/search',
            templateUrl: "assets/views/utility_search_result.html",
            title: 'Search Results',
            ncyBreadcrumb: {
                label: 'Search Results'
            }
        }).state('app.utilities.pricing', {
            url: '/pricing',
            templateUrl: "assets/views/utility_pricing_table.html",
            title: 'Pricing Table',
            ncyBreadcrumb: {
                label: 'Pricing Table'
            }
        }).state('app.maps', {
            url: "/maps",
            templateUrl: "assets/views/maps.html",
            resolve: loadSequence('ngMap', 'mapsCtrl'),
            title: "Maps",
            ncyBreadcrumb: {
                label: 'Maps'
            }
        }).state('app.charts', {
            url: "/charts",
            templateUrl: "assets/views/charts.html",
            resolve: loadSequence('chartjs', 'tc.chartjs', 'chartsCtrl'),
            title: "Charts",
            ncyBreadcrumb: {
                label: 'Charts'
            }
        }).state('app.documentation', {
            url: "/documentation",
            templateUrl: "assets/views/documentation.html",
            title: "Documentation",
            ncyBreadcrumb: {
                label: 'Documentation'
            }
        }).state('error', {
            url: '/error',
            template: '<div ui-view class="fade-in-up"></div>'
        }).state('error.404', {
            url: '/404',
            templateUrl: "assets/views/utility_404.html",
        }).state('error.500', {
            url: '/500',
            templateUrl: "assets/views/utility_500.html",
        })

        // Login routes
            .state('login', {
                url: '/login',
                template: '<div ui-view class="fade-in-right-big smooth"></div>',
                abstract: true
            }).state('login.signin', {
            url: '/signin',
            // templateUrl: "assets/views/login_login.html"
            templateUrl: "assets/views/sing_in.html"
        }).state('login.forgot', {
            url: '/forgot',
            templateUrl: "assets/views/login_forgot.html"
        }).state('login.registration', {
            url: '/registration',
            // templateUrl: "assets/views/login_registration.html"
            templateUrl: "assets/views/sing_up.html"
        }).state('login.lockscreen', {
            url: '/lock',
            templateUrl: "assets/views/login_lock_screen.html"
        })

        // Forum routes
            .state('app.forum', {
                url: '/forum',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Project Forum',
                ncyBreadcrumb: {
                    label: 'Project Forum'
                }
            }).state('app.forum.base', {
            url: '/base',
            templateUrl: "assets/views/forum_base.html",
            title: 'Base',
            ncyBreadcrumb: {
                label: 'Base'
            },
            resolve: loadSequence('forumBaseCtrl')
        }).state('app.forum.allforum', {
            url: '/allforums',
            templateUrl: "assets/views/allMyForums.html",
            title: 'All My Forums',
            ncyBreadcrumb: {
                label: 'All My Forums'
            },
            resolve: loadSequence('allMyForumsCtrl')
        }).state('app.forum.proposal', {
            url: '/createproposal',
            templateUrl: "assets/views/forum_base_proposal.html",
            title: 'Create Proposal',
            ncyBreadcrumb: {
                label: 'Create Proposal'
            },
            resolve: loadSequence('forumBaseProposalCtrl')
        }).state('app.forum.proposalview', {
            url: '/proposalview',
            templateUrl: "assets/views/forum_base_proposal_view.html",
            title: 'Proposal View',
            ncyBreadcrumb: {
                label: 'Proposal View'
            },
            resolve: loadSequence('forumBaseProposalViewCtrl')
        }).state('app.forum.viewvotation', {
            url: '/viewvotation',
            templateUrl: "assets/views/forum_base_view_votation.html",
            title: 'View Votation',
            ncyBreadcrumb: {
                label: 'View Votation'
            },
            resolve: loadSequence('forumBaseViewVotationCtrl')
        }).state('app.inversion', {
            url: '/inversion',
            templateUrl: "assets/views/inversion.html",
            title: 'Inversion',
            ncyBreadcrumb: {
                label: 'Inversion'
            },
            resolve: loadSequence('invertionCtrl')
        }).state('app.inversion_finished', {
            url: '/inversionfinished',
            templateUrl: "assets/views/inversion_finished.html",
            title: 'Inversion',
            ncyBreadcrumb: {
                label: 'Inversion'
            },
            resolve: loadSequence('invertionCtrl')
        });


        // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }]
            };
        }
    }]);