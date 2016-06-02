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
            limit: 204,
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
                if ($scope.trainStations[i].trainNo != 11010) {
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

            var depMins = [];
            var tno = [];
            for (var j = 0; j < $scope.trainStationTwo.length; j++) {
                if ($scope.trainStationTwo[j].trainNo == 11011) {
                    if ($scope.trainStationTwo[j].arrivalTime === "0:00") {
                        updistance.push($scope.trainStationTwo[j].distance);
                        depMins.push($scope.trainStationTwo[j].departureMinutes)
                    } else {
                        updistance.push($scope.trainStationTwo[j].distance);
                        depMins.push($scope.trainStationTwo[j].departureMinutes)
                    }

                } else if ($scope.trainStationTwo[j].trainNo == 11012) {
                    if ($scope.trainStationTwo[j].arrivalTime === "0:00") {
                        downdistance.push($scope.trainStationTwo[j].distance);
                        depMins.push($scope.trainStationTwo[j].departureMinutes)
                    } else {
                        downdistance.push($scope.trainStationTwo[j].distance);
                        depMins.push($scope.trainStationTwo[j].departureMinutes)
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

        var depMinutes = JSON.parse(JSON.stringify(depMins));
        depMinutes.splice(0, 0, "departureTime");

        function generatetooltip(tooltip, d) {
            if(d!=null){
            console.log("updistance", d[0].name);
            console.log("updistance", d[0].value);
            console.log("downdistance", d[1].name);
            console.log("downdistance", d[1].value);
            console.log("depmin",d[2].name);
            console.log("depmin",d[2].value);
            console.log("data4", tooltip);
    
            }
            
        }

        var chart = c3.generate({
            bindto: document.getElementById('mathoChart'),
            data: {
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M', // 'xFormat' can be used as custom format of 'x'

                xs: {
                    'UpDistance':udistance,
                    'downDistance': ddistance
                   // 'departureTime': depMinutes,
                },

                columns: [
                    timeSeries,
                    udistance,
                    ddistance
                   
                   // depMinutes

                    ///colDistance,



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
                height: 550
            },
            color: {
                pattern: ['#1f77b4', '#004c00','#FF4500']
            },
            tooltip: {

                contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                  //  generatetooltip(this.tooltip,d);
                    return "<div style='padding: 12px;margin: 2px;color :blue;height:200px;width:200px;display:block;box-shadow: 0px 0px 20px rgba(94, 80, 80, 0.99);background-color: white;position: absolute;'>"

                        + "Train No  :" + "<br>"
                        + "distance  :" + d[0].value + "<br>"
                        + "distance  :" + d[1].value + "<br>"+
                      //  + "departure :" + d[2].value + "<br>"+

                        "</div>";

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