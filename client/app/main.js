'use strict';

const socket = io()
socket.on('connect', () => console.log(`Socket connected: ${socket.id}`))
socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`))

angular
  .module('socket-chat', ['ngRoute'])
  .config(($routeProvider, $locationProvider) => {
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'partials/main.html'
      })
      // .when('/chat', {
      //   controller: 'ChatCtrl',
      //   templateUrl: 'partials/chat.html'
      // })

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })
  })
  .controller('MainCtrl', function ($scope, $http) {
    $http
      .get('/api/title')
      .then( ({ data: { title }}) => $scope.title = title)
  })
