/**
 * Created by Ale on 4/28/2017.
 */

app.controller('taskCtrl', ["$scope", "$uibModal", "$log", function ($scope, $uibModal, $log) {

    $scope.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus nibh sed elimttis " +
        "adipiscing. Fusce in hendrerit purus. Suspendisse potenti. Proin quis eros odio, dapibus dictum mauris. " +
        "Donec nisi libero, adipiscing id pretium eget, consectetur sit amet leo. Nam at eros quis mi egestas " +
        "fringilla non nec purus. Test Description";
    $scope.totalCost = 3000;
    $scope.duration = 6;
    // $scope.risks = new [];
    // $scope.outcomes =  new [];
    $scope.stage = "In preparation";

    $scope.items = [$scope.description, $scope.totalCost , $scope.duration , $scope.stage];

    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateTask.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
}]);

app.controller('ModalInstanceCtrl', ["$scope", "$uibModalInstance", "items", function ($scope, $uibModalInstance, items) {

    $scope.items = items;


    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


}]);