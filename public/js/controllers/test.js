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


    function getTrainStationList() {
        $scope.query = {
            order: 'stopNo',
            limit: 9000,
            page: 1,
            stopNo: "",
            trainNo: 11014
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

        for (var i = 0; i < $scope.trainStations.length; i++) {
            if ($scope.trainStations[i].arrivalTime === "0:00") {
                timeSerieMinutes.push($scope.trainStations[i].departureMinutes)
            } else {
                timeSerieMinutes.push($scope.trainStations[i].arrivalMinutes)
            }
        }


        for (var k = 0; k < $scope.trainStations.length; k++) {
            var days = 0;
            if (days = Math.ceil(timeSerieMinutes[k] / 1440)) {
                if ($scope.trainStations[k].arrivalTime === "0:00") {
                    timeSeries.insert(0, 'x');
                    timeSeries.push("2012-1-" + days + " " + $scope.trainStations[k].departureTime);
                    //distance.insert(0, 'distance');
                    stationCode[$scope.trainStations[k].distance] = $scope.trainStations[k].stationCode;
                    distance.push($scope.trainStations[k].distance);
                }
                else {
                    timeSeries.push("2012-1-" + days + " " + $scope.trainStations[k].arrivalTime);
                    stationCode[$scope.trainStations[k].distance] = $scope.trainStations[k].stationCode;
                    distance.push($scope.trainStations[k].distance);


                }

            }

        }
        var colDistance = JSON.parse(JSON.stringify(distance));
        colDistance.splice(0, 0, "distance");
        var chart = c3.generate({
            bindto: document.getElementById('mathoChart'),
            data: {
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M', // 'xFormat' can be used as custom format of 'x'
                columns: [
                    timeSeries,
                    colDistance,


                ]
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        fit:false,
                        format: '%H:%M'
                    },
                    
                },

                y: {
                    tick: {
                        values: distance,
                        format: function (d) { return stationCode[d]; }

                    },
                  //  extent:stationCode,
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
               /* onzoomend: function (colDistance) {
                    return colDistance;
                }
                */
                enabled:true,
                rescale: true
            },
            subchart: {
                show: true,
                size: {
                    height:20
                  }
            }





        });

    });
});