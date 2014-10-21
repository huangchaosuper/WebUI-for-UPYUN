'use strict';
/*
 * root js 
 * author:huangchaosuper@gmail.com
 * date:May 17, 2014
 */
var upyunApp = angular.module('upyunApp', [
  'appControllers',
  'appServices',
  'ngRoute',
  'ngCookies',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap']).run(['$location', function($location){
    if ($location.path() !== '' && $location.path() !== '/') {
      smoothScroll(document.getElementById($location.path().substring(1)), 500, function(el) {
        location.replace(el.id);
      });
    }
  }
]);

upyunApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'assets/partials/dashboard.html',
      controller: 'MainCtrl'
    }).
    when('/login', {
      templateUrl: 'assets/partials/login.html',
      controller: 'LoginCtrl'
    }).
    otherwise({
      templateUrl: 'assets/partials/coming-soon.html',
    });
  }
]);
