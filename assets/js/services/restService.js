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

        createUser: function(user) {
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

        updateUser: function(user) {
            return $http.put(serverUrl + 'user/' , user)
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

        deleteUser: function(id) {
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
        },

        fetchSimpleProjects: function(userId) {
            return $http.get(serverUrl + 'simpleProject/' + userId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching simple Projects');
                        return $q.reject(errResponse);
                    }
                );
        },

        createSimpleProject: function(simpleProject) {
            return $http.post(serverUrl +'simpleProject/', simpleProject)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while creating simple project');
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchProjectById: function(projectId) {
            return $http.get(serverUrl + 'simpleProjectById/' + projectId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching simple Projects By Id');
                        return $q.reject(errResponse);
                    }
                );
        },

        //Function for obtain all projects excepts the user's projects
        fetchAllProject: function(userId) {
            return $http.get(serverUrl + 'allProjectsExceptId/' + userId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching All Projects');
                        return $q.reject(errResponse);
                    }
                );
        },

        deleteProject: function(projectId) {
            return $http.get(serverUrl + 'simpleProjectDelete/' + projectId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while deleting simple Projects');
                        return $q.reject(errResponse);
                    }
                );
        },

        createTask: function(task) {
            return $http.post(serverUrl +'task/', task)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while creating task');
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchTaskByProjectId: function(projectId) {
            return $http.get(serverUrl + 'taskByProjectId/' + projectId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching tasks By Id');
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchTaskByTaskId: function(taskId) {
            return $http.get(serverUrl + 'task/' + taskId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching tasks By Task Id');
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchProposalByProjectId: function(projectId) {
            return $http.get(serverUrl + 'proposalByProjectId/' + projectId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching propsal By Project Id');
                        return $q.reject(errResponse);
                    }
                );
        },


        fetchProposalById: function(proposalId) {
            return $http.get(serverUrl + 'proposalById/' + proposalId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching propsal By Proposal aId');
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchAllNotifications: function(userId) {
            return $http.get(serverUrl + 'notifiesByUserId/' + userId)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching notifies By User Id');
                        return $q.reject(errResponse);
                    }
                );
        },
    };
}]);
