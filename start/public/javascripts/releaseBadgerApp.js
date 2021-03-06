
var app = angular.module('releaseBadgerApp', ['ngRoute', 'ngResource', 'ui.bootstrap']).run(function($http, $rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';

    $rootScope.signout = function() {
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };

});

// setup routing
app.config(function($routeProvider)
{
    $routeProvider

        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })

        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })

        .when('/register', {
            templateUrl: 'register.html',
            controller: 'authController'
        });
});

// handler for auth responses
app.controller('authController', function($scope, $http, $rootScope, $location) {
    $scope.user = { username: '', password: ''};
    $scope.error_message = '';

    $scope.login = function(){
        $http.post('/auth/login', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
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
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };

});

app.factory('stepService', function($resource) {
    var data = $resource('/api/steps/:id', {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
    return data;
});

// setup controllers
app.controller('mainController', function(stepService, $scope, $rootScope){
    $scope.release_number = '2.1.2';
    $scope.isopen = false;

    $scope.steps = stepService.query();
    $scope.newStep = { number: '', process: '', done: '', time_completed: '' };

    // initialise steps collection
    // stepService.getAll().success(function(data) {
    //    $scope.steps = data;
    // });

    // add a new step
    $scope.addStep = function() {
        $scope.newStep.created_at = Date.now();
        $scope.push($scope.newStep);
        $scope.newStep = { number: '', process: '', done: '', time_completed: '' };
    };

    $scope.setComplete = function(step) {
        $scope.step = step;
        $scope.step.done = true;
        stepService.update({id: $scope.step.number}, $scope.step, function() {
            $scope.steps = stepService.query();
        });
    };

});
