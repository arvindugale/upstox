/**
 * Main Controller of the application.
 */
angular.module('upstox').controller('mainController', function($scope, $http, socket, socketFactory) {
    'use strict';

    var plot = [];

    $http.get("http://kaboom.rksv.net/api/historical?interval=2")
        .success(function(data) {
            for (var i = 0; i < data.length; i++) {
                var temp = data[i].split(',');
                var tempdata = [parseInt(temp[0]), parseInt(temp[4])];
                plot.push(tempdata);
            }
            $scope.data = [{
                "key": "Day Close",
                "values": plot
            }];
        })
        .error(function(data, status, headers, config) {
            console.log(status + " Data: " + data);
        });

    function ConnectSocket() {
        var myIoSocket = io.connect('http://kaboom.rksv.net/watch');
        var mySocket = socketFactory({
            ioSocket: myIoSocket
        });
        var socket = mySocket.ioSocket;
        mySocket.on('data', function(data) {
            console.info(data);
            $scope.currentPrice = '$' + data.split(',')[4];
            mySocket.emit('CLIENT_ACKNOWLEDGEMENT', function(data) {
                var CLIENT_ACKNOWLEDGEMENT = 1;
                console.log(data);
            });

        });

        mySocket.on('connect', function() {
            mySocket.emit('ping', {});
            mySocket.emit('sub', {
                state: true
            });
        });


        mySocket.on('error', function(data) {
            console.error(data);
        });
    }
    ConnectSocket();

    $scope.options = {
        chart: {
            type: 'stackedAreaChart',
            height: 250,
            margin: {
                top: 10,
                right: 20,
                bottom: 40,
                left: 30
            },
            x: function(d) {
                return d[0];
            },
            y: function(d) {
                return d[1];
            },
            useVoronoi: false,
            clipEdge: false,
            duration: 100,
            useInteractiveGuideline: true,
            xAxis: {
                showMaxMin: true,
                tickFormat: function(d) {
                    return d3.time.format('%x')(new Date(d))
                }
            },
            yAxis: {
                tickFormat: function(d) {
                    return d3.format(',0.2')(d);
                }
            },
            zoom: {
                enabled: false,
                scaleExtent: [1, 6],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: false,
                unzoomEventType: 'dblclick.zoom'
            }
        }
    };
});