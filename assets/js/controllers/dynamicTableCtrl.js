'use strict';
/**
 * controllers for dynamic table
 * Remove/delete a table row dynamically 
 */

app.controller("dynamicTableCtrl", ['$scope', '$http', function($scope, $http) {
	$scope.companies = [];
	
	$scope.addRow = function(){		
		$scope.companies.push({ 'name':$scope.name, 'rdescription': $scope.rdescription });		
		$scope.name='';
		$scope.rdescription='';
	};
	
	$scope.addRowAsyncAsNV = function(){		
		$scope.companies.push({ 'name':$scope.name, 'employees': $scope.employees, 'headoffice':$scope.headoffice });
		// Writing it to the server
		//		
		var data = 'name=' + $scope.name + '&employees=' + $scope.employees + '&headoffice=' + $scope.headoffice;								
		$http.post('/savecompany', data )
		.success(function(data, status, headers, config) {
			$scope.message = data;
		})
		.error(function(data, status, headers, config) {
			alert( "failure message: " + JSON.stringify({data: data}));
		});
		// Making the fields empty
		//
		$scope.name='';
		$scope.employees='';
		$scope.headoffice='';
	};		
	
	$scope.removeRow = function(name){				
		var index = -1;		
		var comArr = eval( $scope.companies );
		for( var i = 0; i < comArr.length; i++ ) {
			if( comArr[i].name === name ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
		}
		$scope.companies.splice( index, 1 );		
	};
	
	
}]);