'use strict';
 
app.factory('RestService', ['$http', '$q', function($http, $q) {

 	var serverUrl = 'http://10.8.25.241:9090/CoralliumRestAPI/';

    return {
         
    fetchUser: function(email) {
            return $http.get(serverUrl + 'user/' + email)
            .then(
                    function(response){
                        return response.data;
                    }, 
                    function(errResponse){
                        console.error('Error while fetching user');
                        return $q.reject(errResponse);
                    }
            );
        },
     
    createUser: function(user){
            return $http.post(serverUrl +'user/', user)
            .then(
                    function(response){
                        return response.data;
                    }, 
                    function(errResponse){
                        console.error('Error while creating user');
                        return $q.reject(errResponse);
                    }
            );
        },
     
    updateUser: function(user, id){
            return $http.put(serverUrl + 'user/' + id, user)
            .then(
                    function(response){
                        return response.data;
                    }, 
                    function(errResponse){
                        console.error('Error while updating user');
                        return $q.reject(errResponse);
                    }
            );
        },
     
   deleteUser: function(id){
            return $http.delete(serverUrl + 'user/' + id)
            .then(
                    function(response){
                        return response.data;
                    }, 
                    function(errResponse){
                        console.error('Error while deleting user');
                        return $q.reject(errResponse);
                    }
            );
        }
         
    };
 
}]);
