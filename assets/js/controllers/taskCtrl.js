/**
 * Created by Ale on 4/28/2017.
 */

app.controller('taskCtrl', ["$scope", function ($scope) {

    $scope.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus nibh sed elimttis " +
        "adipiscing. Fusce in hendrerit purus. Suspendisse potenti. Proin quis eros odio, dapibus dictum mauris. " +
        "Donec nisi libero, adipiscing id pretium eget, consectetur sit amet leo. Nam at eros quis mi egestas " +
        "fringilla non nec purus. Test Description";
    $scope.totalCost = 5000;
    $scope.duration = 2;
    $scope.stage = "In preparation";

    $scope.items = [$scope.description, $scope.totalCost , $scope.duration , $scope.stage];

}]);