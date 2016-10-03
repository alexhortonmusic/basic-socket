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
      .when('/chat', {
        controller: 'ChatCtrl',
        templateUrl: 'partials/chat.html'
      })

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
  .controller('ChatCtrl', function ($scope, $http) {
    $scope.sendMsg = () => {
      const msg = {
        user: $scope.user,
        body: $scope.body
      }

      $scope.user = ''
      $scope.body = ''

      socket.emit('postMsg', msg)
    }
    // get title
    $http
      .get('/api/title')
      .then( ({ data: { title }}) => $scope.title = title)

    // populate initial msgs
    $http
      .get('/api/msgs')
      .then(({ data: { msgs }}) =>
        $scope.msgs = msgs
    )

    // retrieve new msgs
    socket.on('newMsg', msg => {
      $scope.msgs.push(msg)
      $scope.$apply()
    })
  })
