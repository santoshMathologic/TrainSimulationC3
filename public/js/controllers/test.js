var app = angular.module('mathoApp', []);
app.controller('testCtrl', function ($scope, $http, $timeout, $q, TimeCal) {
    var api = {
        protocol: 'http',
        server: 'localhost',
        port: 4000,
        baseUrl: '/api/v1',
    };
    var apiUrl = api.protocol + '://' + api.server + ':' + api.port + api.baseUrl;
    $scope.trainStationsList = [];
    $scope.trainStnsList = [];
    $scope.Days = Days;

    function getTrainStationList() {
        $scope.query = {
            order: 'trainNo',
            limit: 200,
            page: 1,
            // trainNo: {$in:[11014,11013 ]}
            trainNo: 1101 // if remove one digit from trainNo its takes as $In query
            // where all the trainNo start from 1101 will be displayed    

        };
        var deferred = $q.defer();
        $http.get(apiUrl + "/trainStation", { params: $scope.query })
            .then(function (response) {
                deferred.resolve(response.data.results);
            });

        return deferred.promise;
    }

    getTrainStationList().then(function (response) {
        $scope.trainStations = response;
        var timeSeries = [];
        var timeSerieMinutes = [];
        var stationdistance = [];
        var stationCode = {};
        var distance = [];

        Array.prototype.insert = function (index, item) {  // This prototype is used for Placing X values at the desired Position
            this.splice(index, 0, item);
        };

        $scope.trainStationTwo = [];
        var updistance = [];
        var downdistance = [];
        if ($scope.trainStations) {
            for (var i = 0; i < $scope.trainStations.length; i++) {
                if ($scope.trainStations[i].trainNo == 11014 || $scope.trainStations[i].trainNo == 11013) {
                    $scope.trainStationTwo.push($scope.trainStations[i]);

                }

            }
            for (var k = 0; k < $scope.trainStationTwo.length; k++) {
                if ($scope.trainStationTwo[k].arrivalTime === "0:00") {
                    timeSerieMinutes.push($scope.trainStationTwo[k].departureMinutes);
                } else {
                    timeSerieMinutes.push($scope.trainStationTwo[k].arrivalMinutes);
                }
            }

            for (var k = 0; k < timeSerieMinutes.length; k++) {
                var days = 0;
                if (days = Math.ceil(timeSerieMinutes[k] / 1440)) {
                    if ($scope.trainStationTwo[k].arrivalTime === "0:00") {
                        timeSeries.push("2012-1-" + days + " " + $scope.trainStationTwo[k].departureTime);
                        stationCode[$scope.trainStationTwo[k].distance] = $scope.trainStationTwo[k].stationCode;
                        distance.push($scope.trainStationTwo[k].distance);
                    }
                    else {
                        timeSeries.push("2012-1-" + days + " " + $scope.trainStationTwo[k].arrivalTime);
                        stationCode[$scope.trainStationTwo[k].distance] = $scope.trainStationTwo[k].stationCode;
                        distance.push($scope.trainStationTwo[k].distance);
                    }
                }
            }

            for (var j = 0; j < $scope.trainStationTwo.length; j++) {
                if ($scope.trainStationTwo[j].trainNo == 11014) {
                    if ($scope.trainStationTwo[j].arrivalTime === "0:00") {
                        updistance.push($scope.trainStationTwo[j].distance);
                    } else {
                        updistance.push($scope.trainStationTwo[j].distance);
                    }

                } else {
                    if ($scope.trainStationTwo[j].arrivalTime === "0:00") {
                        downdistance.push($scope.trainStationTwo[j].distance);
                    } else {
                        downdistance.push($scope.trainStationTwo[j].distance);
                    }
                }
            }
        }


        timeSeries.insert(0, 'x');
        var colDistance = JSON.parse(JSON.stringify(distance));
        colDistance.splice(0, 0, "distance");

        // var colDistance1 = JSON.parse(JSON.stringify(distance));
        // colDistance1.splice(0, 0, "distance1");

        var udistance = JSON.parse(JSON.stringify(updistance));
        udistance.splice(0, 0, "UpDistance");
        
        var ddistance = JSON.parse(JSON.stringify(downdistance));
        ddistance.splice(0, 0, "downDistance");
        

        var chart = c3.generate({
            bindto: document.getElementById('mathoChart'),
            data: {
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M', // 'xFormat' can be used as custom format of 'x'
                columns: [
                    timeSeries,
                    ///colDistance,
                    udistance,
                    ddistance
                    

                ]
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        fit: false,
                        format: '%H:%M',
                        rotate: 0,
                    },

                },

                y: {
                    tick: {
                        values: distance,
                        format: function (d) { return stationCode[d]; }
                    },

                }
            },
            size: {
                height: 700
            },
            tooltip: {
                format: {
                    value: function (colDistance) {
                        return colDistance;
                    }

                }


            },
            zoom: {
                enabled: true,
                rescale: true
            },
            subchart: {
                show: true,
                size: {
                    height: 20
                }
            }




        });

    });
});