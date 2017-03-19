/**
 * app config file.
 */
'use strict';
var app = angular.module('upstox', [
        'ui.router',
        'ui.bootstrap',
        'nvd3',
        'btford.socket-io'
    ])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/views/home.html',
                controller: 'mainController'
            });
    });