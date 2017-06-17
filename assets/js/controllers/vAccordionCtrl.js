'use strict';
/** 
  * controller for v-accordion
  * AngularJS multi-level accordion component.
*/
(function (angular) {
    app.controller('vAccordionCtrl', ["$scope", function ($scope) {
        $scope.firstAccordionControl = {
            onExpand: function (expandedPaneIndex) {
                console.log('expanded:', expandedPaneIndex);
            },
            onCollapse: function (collapsedPaneIndex) {
                console.log('collapsed:', collapsedPaneIndex);
            }
        };
        $scope.panes = [{
            header: 'System objetives',
            content:   `<div class="list-group">
                            <a class="list-group-item list-group-item-warning" href="#">To create a communication space for bringing together potential Financers and Projects Owners or entrepreneurs looking for capital.</a>
                            <a class="list-group-item list-group-item-warning" href="#">To facilitate the preparation of Projects to entrepreneurs.</a>
                            <a class="list-group-item list-group-item-warning" href="#">To create an environment for the creation and management of Project Teams.</a>
                            <a class="list-group-item list-group-item-warning" href="#">To manage the Capital invested by Financers to the execution of projects.</a>
                        </div>`
        }, {
            header: 'System actors',
            content: `<div class="list-group">
                            <a class="list-group-item list-group-item-warning" href="#">Owner: owner of the main assets, property or product who will present a Project, owner of a business idea, person, organization or community who has assets they can increase its production or results with some Capital Investment or financial help.</a>
                            <a class="list-group-item list-group-item-warning" href="#">Financier: person or organization capable of giving a Capital Investment or financial help to certain owners.</a>
                        </div>`
        }, 
        // {
        //     header: 'Pane 3',
        //     content: 'Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.',

        //     subpanes: [{
        //         header: 'Subpane 1',
        //         content: 'Lorem ipsum dolor sit amet enim.'
        //     }, {
        //         header: 'Subpane 2',
        //         content: 'Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.'
        //     }]
        // }
        ];
    }]);
})(angular);