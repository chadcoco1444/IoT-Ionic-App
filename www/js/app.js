angular.module('starter', ['ionic', 'starter.controllers','ngMap'])

.constant('ApiEndpoint', {
  url: 'http://cors.api.com/api'
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.gpsmap', {
    url: '/gpsmap',
    views: {
      'menuContent': {
        templateUrl: 'templates/gpsmap.html',
        controller:'MapCtrl'
      }
    }
  })

  .state('app.setting', {
      url: '/setting',
      views: {
        'menuContent': {
          templateUrl: 'templates/setting.html',
          controller:'SetCtrl'

        }
      }
    })


  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/home');
});


  /*.state('app.sensorData', {
      url: '/sensorData',
      views: {
        'menuContent': {
          templateUrl: 'templates/sensorData.html',
          controller:'SensorDataCtrl'
        }
      }
    })*/
