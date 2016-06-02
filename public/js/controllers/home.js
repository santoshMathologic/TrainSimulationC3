var app = angular.module('mathoApp', []);
app.controller('homeCtrl', function ($scope, $http, $timeout, $q, TimeCal) {

    console.log("Inside home ctrl");
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
            limit: 10,
            page: 1,
            trainup: 11014,
            traindown: 11013

        };
        var deferred = $q.defer();
        $http.get(apiUrl + "/trainStations", { params: $scope.query })
            .then(function (response) {
                deferred.resolve(response.data.results);
            });

        return deferred.promise;
    }
    getTrainStationList().then(function (response) {
        $scope.trainStations = response;

        console.log($scope.trainStations);

    });







});

