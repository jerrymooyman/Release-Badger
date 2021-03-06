
var app = angular.module('releaseBadgerApp', ['ngRoute'].run(function($rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';

    $rootScope.logout = function() {
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };

}));

// handler for auth responses
app.controller('authController', function($scope, $http, $rootScope, $location) {
    $scope.user = { username: '', password: ''};
    $scope.error_message = '';

    $scope.login = function(){
        $http.post('/auth/login', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticate = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };

    $scope.register = function() {
        $http.post('/auth/signup', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticate = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };

});

// setup routing
app.config(function($routeProvider)
{
    $routeProvider
        .when('./', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })

        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })

        .when('/register', {
            templateUrl: 'login.html',
            controller: 'authController'
        });
});

// setup controllers
app.controller('mainController', function($scope){
    $scope.steps = [];
    $scope.newStep = {
        number: '',
        process: '',
        done: '',
        time_completed: ''
    };
});
