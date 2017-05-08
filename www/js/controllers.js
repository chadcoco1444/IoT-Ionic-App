angular.module('starter.controllers', ['ngMap'])

.controller('AppCtrl', function($scope,$ionicModal, $timeout, $stateParams, $ionicSideMenuDelegate) {

  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $timeout(function() {
      $scope.closeLogin();
    }, 500);
  };

  var transitionIn = function(ratio) {
    return Math.abs(ratio);
  }
  var transitionOut = function(ratio) {
    return (1- Math.abs(ratio));
  }
  var transitionFromTo = function(ratio, from, to) {
    return from - (Math.abs(ratio) * (from - to));
  }
  $scope.fadeIn = function(element, ratio) {
    element.style.transform = element.style.webkitTransform = 'scale(' + transitionIn(ratio) + ')';
    element.style.opacity = transitionIn(ratio);
  }
  $scope.slideUp = function(element, ratio) {
    element.style.transform = element.style.webkitTransform = 'translateY(' + transitionFromTo(ratio, 100, 0) + '%' + ')';
  }
})
.controller('HomeCtrl', function($scope,$http,$ionicPopup,$ionicLoading) {
  $scope.resultHome = ""; //initialize
  $scope.sub_title = "";
  //$scope.show = false;
  var checkConnection =function (){
    var networkState = navigator.connection.type;

          if( $scope.show == true && $scope.ip == "10.87.87.1" ){
            $scope.internet_flag = 1;
            $ionicLoading.hide();
            // determine the show toggle and connect Wi-Fi Ip

            if( $scope.items.content != null ){

              $scope.sub_title = "Data from local service";
              if( $scope.items.content[5] == 1 ){
                //assign the ON/OFF
                  $scope.items.content[5] = "ON";
                  //alert($scope.items.content[5]);

              }
              if($scope.items.content[5] == 0 ){
                  $scope.items.content[5] = "OFF";
                  //alert($scope.items.content[5]);
              }

              if( $scope.items.content[7] == 1 ){
                  $scope.items.content[7] = "ON";

              }
              if( $scope.items.content[7] == 0 ){
                  $scope.items.content[7] = "OFF";
              }
              //pass the device Info directly
              //alert($scope.items.content[5]);
              $scope.resultHome = {
                          'deviceID'     :5487,
                          'sensorValue1' :Math.round($scope.items.content[0]*100)/100,
                          'sensorValue2' :Math.round($scope.items.content[1]*100)/100,
                          'sensorValue5' :Math.round($scope.items.content[4]*100)/100,
                          'sensorValue6' :$scope.items.content[5],
                          'sensorValue7' :Math.round($scope.items.content[6]*100)/100,
                          'sensorValue8' :$scope.items.content[7],
                          'timestamp'    :"\uD83D\uDE99 Abujoe Network"
                          };

            }//content != null
            else {

              console.log("Receive Content is NULL");
            }
          }//show,ip end
          else if( networkState == Connection.NONE ){
            //determine connect to the Wi-Fi , 3G , 4G or other
            if ($scope.internet_flag === 1) {
                $scope.internet_flag = 0;

                      $ionicLoading.show({
                        template: '<ion-spinner class="spinner-light" icon="lines"></ion-spinner><br><center>Waiting for network connection...</center>'
                      });

            }
            
          }
          else
          {
                $scope.internet_flag = 1;
                $ionicLoading.hide();
                if ($scope.alertPopup != undefined) {$scope.alertPopup.close()};
                $scope.sub_title = "Data from cloud";
                $http.get('http://52.202.43.213:8181/getlatest/5487', {timeout: 3000})
                .success(function(data, status, headers,config){

                data.sensorValue5 = Math.round(data.sensorValue5*100)/100

                if( data.sensorValue6 == 1){
                    data.sensorValue6 = "ON";

                }else{
                    data.sensorValue6 = "OFF"
                }


                if( data.sensorValue8 == 1 ){
                    data.sensorValue8 = "ON";
                }else {
                    data.sensorValue8 = "OFF";
                }

                data.timestamp = "\u2601 " + data.timestamp;
                $scope.resultHome = data;

                })
                .error(function(data, status, headers,config){
                  console.log('Http(Get) data error');
                })
                .then(function(result){
                })

          }

  }
  $ionicLoading.hide();
  $scope.internet_flag = 1;
  var t = setInterval(checkConnection,1000);
})
//if( networkState == Connection.CELL_4G || networkState == Connection.CELL_3G || networkState == Connection.WIFI){


 .controller('MapCtrl', function($scope,$http) {
  
     var DegToDMS = function (deg) {
      var d = Math.floor (deg);
      var minfloat = (deg-d)*60.0000;
      var m = Math.floor(minfloat);
      //var secfloat = (minfloat-m)*60.0;
      //var s = Math.round(secfloat);
      var s = ((minfloat-m)*60.0000).toFixed(2);
      // After rounding, the seconds might become 60. These two
      // if-tests are not necessary if no rounding is done.
      if (s>60.0000) {
        m++;
        s=0.0000;
    } else {

    }
      if (m==60.0000) {
        d++;
        m=0.0000;
      }
      return ("" + d + "°" + m + "'" + s + "\"");
   }
  function mapGPS (){
    $scope.resultGPS = "";
    if( $scope.show == true && $scope.ip == "10.87.87.1" ){
      if($scope.items.content != null){
        $scope.sub_title = "Data from local service";

          //$scope.itemd.content[3] = 121.43254342;
          //$scope.itemd.content[2] = 24.4325;
          //alert(typeof($scope.items.content[3]));
              $scope.resultGPSs = {
                  'sensorValue3': $scope.items.content[2],
                  'sensorValue4': $scope.items.content[3],
                  'sensorValue3_DMS': DegToDMS($scope.items.content[2]) + ($scope.items.content[2] > 0.0 ? "E" : "W"),
                  'sensorValue4_DMS': DegToDMS($scope.items.content[3]) + ($scope.items.content[3] > 0.0 ? "N" : "S")
              };
              //alert($scope.resultGPSs.sensorValue3,scope.resultGPSs.sensorValue4);

      }
      else {
        console.log("Receive Content is NULL");
      }
    }
    else {

      $scope.sub_title = "Data from cloud";
        var httpGet = function(){

          $http.get('http://52.202.43.213:8181/getlatest/5487', {timeout: 3000})
          .success(function(data, status, headers,config){
              $scope.resultGPSs = 0;
              $scope.resultGPSs  = {
                  'sensorValue3': data.sensorValue3,
                  'sensorValue4': data.sensorValue4,
                  'sensorValue3_DMS': DegToDMS(data.sensorValue3) + (data.sensorValue3 > 0.0 ? "E" : "W"),
                  'sensorValue4_DMS': DegToDMS(data.sensorValue4) + (data.sensorValue4 > 0.0 ? "N" : "S")
                }
              //alert($scope.resultGPSs.sensorValue3,$scope.resultGPSs.sensorValue4);
          })
          .error(function(data, status, headers,config){
            console.log('data error');
          })
          .then(function(result){
          })
        };

        httpGet();
    }
  }
    var t = setInterval(mapGPS,1000);
})


  .controller('SetCtrl', function($scope,$http,$window, $ionicPlatform,$timeout,$rootScope,$ionicPopup) {
    $scope.set_flag = 0;

    $scope.pushNotification = { checked: false };
    $scope.ledNotification = { checked: false };


        //alert(ip);
        //function pushNotificationChange($event)  {
        $scope.pushNotificationChange = function($event) {
            getrouteripaddress.getRouterIPAddress( function( ip ) { //console.log( 'Router IP Address is: ' + ip );
                  //$scope.pushNotificationChange(ip);
                  $rootScope.ip = ip;
                  $scope.tryToConnectLocalService();
            });
        };
        $scope.tryToConnectLocalService = function() {
        //app.onDeviceReady();
        //alert($scope.ip);
        //alert($scope.pushNotification.checked);

        $rootScope.led = "OFF";
        $scope.data2 = { 'volume' : '0' };
        //$scope.show = false;
        if($scope.pushNotification.checked == true ){
            if( $scope.ip == "10.87.87.1" ){
              $http.get('http://10.87.87.1:9487/' ,{timeout: 2000})
                  .success(function (test) {

                      var alertPopup = $ionicPopup.alert({
                          title: 'Connection Success',
                          template: '<center>'+test.content[1]+'</center>'
                      });

                      alertPopup.then(function(res) {
                        console.log(test.content[1]);
                      });
                      //alert(test.content);
                });

                $scope.$watch('data2.volume', function(val) {
                    $scope.data2 = {'volume' : val};
                    $scope.set_flag = 1;
                    $rootScope.fan = $scope.data2.volume;
                    //alert($scope.fan);
                });

                $scope.ledNotificationChange = function(){
                    if($scope.ledNotification.checked == true){
                        $scope.data1 = {'volume' : "ON"};
                        $scope.set_flag = 1;
                        $rootScope.led = $scope.data1.volume;
                        //alert($scope.led);
                    }
                    if($scope.ledNotification.checked == false){
                        $scope.data1 = {'volume' : "OFF"};
                        $scope.set_flag = 1;
                        $rootScope.led = $scope.data1.volume;
                        //alert($scope.led);
                    }
                };

                $scope.show = !$scope.show;

                $rootScope.show = $scope.show;
                //showWiFi();
                //alert($scope.show);

            }
            else {
              //alert("Please connect correct Wi-Fi!");
              var alertPopup = $ionicPopup.alert({
                          title: 'Connection Failed',
                          template: '<center>Please connect to Abujoe network.</center>'
                      });

                      alertPopup.then(function(res) {
                        console.log('Connection Failed');
                      });
              $scope.pushNotification = { checked: false };
            }
          }
          else {
            if($scope.show == true){

                $scope.pushNotification = { checked: false };
                $scope.show = false;
            }
            //$scope.pushNotification = { checked: false };
            $rootScope.ip = undefined;
          }

         showWiFi();



         // Open in app browser

        };
        $scope.openInAppBrowser = function()
        {
           // Open in app browser
          if($scope.ip == "10.87.87.1"){
              window.open('http://10.87.87.1','_blank');
           }
          else {
            var alertPopup = $ionicPopup.alert({
                          title: 'Connection Failed',
                          template: '<center>Please connect to Abujoe network.</center>'
                      });

                      alertPopup.then(function(res) {
                        console.log('Connection Failed');
                      });
          }

        };



  function postToDevice(){
    if( $scope.show == true ){
        if($scope.ip == "10.87.87.1"){
      var publishPostPath = 'http://10.87.87.1:9487/';
            var postData = {
                    get_sensors : [true,true,true,true,true,true,true,true]
                };
                          $http.post(publishPostPath, postData, {timeout: 2000}).success(function(dataP) {
                              if(dataP) {
                                  $rootScope.items = dataP;
                                  //alert(dataP.content);
                              } else {
                                  console.log(dataP);
                              }

                          })
                          .error(function(error) {
                              console.log(error);
                            });
          if($scope.set_flag == 0) {
            return;
          }
          if($scope.set_flag == 1 || $scope.fan){
                var ledSwitch = 0;
                if($scope.data1.volume == "ON"){
                    ledSwitch = 1;
                }
                else {
                    ledSwitch = 0;
                }

              var val = parseInt($scope.fan);

              var publishPostPath = 'http://10.87.87.1:9487/';
              var postData = {
                      set_slaves : [val,ledSwitch]
                    };

                              $http.get('http://10.87.87.1:9487/', {timeout: 2000})
                              .success(function (test) {

                                  $http.post(publishPostPath, postData).success(function(data) {
                                      if(data) {
                                          //alert(data.content);
                                          $scope.set_flag = 0;
                                      } else {
                                          console.log(data);
                                      }

                                  })
                                  .error(function(error) {
                                     console.log(error);
                                  });


                            });
            }
      } else {
              //pushNotificationChange();
              $scope.show = false;
      }
  } else {
      $scope.show = false;
    }

  }
  function showWiFi(){

        if($scope.show == true){
          $scope.localtimer = setInterval(postToDevice,1000);
        }
        else {
          clearInterval($scope.localtimer);
        }
    }


})
.directive('animateRatio', function($timeout, $ionicSideMenuDelegate) {

  return {
    restrict: 'A',
    scope: {
      animateRatio: '=',
    },
    link: function (scope, element, attr) {

      $timeout(function () {
        scope.$watch(function () {
          return $ionicSideMenuDelegate.getOpenRatio();
        },
        function (ratio) {
          scope.animateRatio(element[0], ratio);
        });
      });
    }
  }
});


/*
function checkConnection() {
      var networkState = navigator.connection.type;

      var states = {};
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.CELL]     = 'Cell generic connection';
      states[Connection.NONE]     = 'No network connection';

      alert('Connection type: ' + states[networkState]);
  }
*/

/*
.controller('SensorDataCtrl', function($scope,$http) {
  $scope.resultSensor = "";

  if( $scope.show == true && $scope.ip == "10.87.87.1" ){
    if( $scope.items.content != null ){
              $scope.title = "Data from device";
              if( $scope.items.content[5] == 1 ){
                //assign the ON/OFF
                  $scope.items.content[5] = "ON";
                  //alert($scope.items.content[5]);

              }
              if($scope.items.content[5] == 0 ){
                  $scope.items.content[5] = "OFF";
                  //alert($scope.items.content[5]);
              }

              if( $scope.items.content[7] == 1 ){
                  $scope.items.content[7] = "ON";

              }
              if( $scope.items.content[7] == 0 ){
                  $scope.items.content[7] = "OFF";
              }
              //pass the device Info directly
              //alert($scope.items.content[5]);
              $scope.resultSensor = {
                          'deviceID'     :5487,
                          'sensorValue1' :Math.round($scope.items.content[0]*100)/100,
                          'sensorValue2' :Math.round($scope.items.content[1]*100)/100,
                          'sensorValue3' :parseFloat(Math.round($scope.items.content[3]*1000000) / 1000000).toFixed(6),
                          'sensorValue4' :parseFloat(Math.round($scope.items.content[2]*1000000) / 1000000).toFixed(6),
                          'sensorValue5' :Math.round($scope.items.content[4]*100)/100,
                          'sensorValue6' :$scope.items.content[5],
                          'sensorValue7' :Math.round($scope.items.content[6]*100)/100,
                          'sensorValue8' :$scope.items.content[7]
                          };

    }
    else{
      console.log("Receive Content is NULL");
    }
  }
  else {
      $scope.title = "Data from cloud";
      var httpGet = function(){
        $http.get('http://52.202.43.213:8181/getlatest/5487')
        .success(function(data, status, headers,config){
            if( data.sensorValue6 == 1){
                data.sensorValue6 = "ON";

            }else{
                data.sensorValue6 = "OFF"
            }


            if( data.sensorValue8 == 1 ){
                data.sensorValue8 = "ON";
            }else {
                data.sensorValue8 = "OFF";
            }

                $scope.resultSensor = data;
          //alert(JSON.stringify(data, null, "\t")) //$scope.result = JSON.stringify(data, null, "\t"); document.body.innerHTML(JSON.stringify(data, null, "\t"));
        })
        .error(function(data, status, headers,config){
          console.log('data error');
        })
        .then(function(result){

        })
      };
  }
  var t = setInterval(httpGet,1000);

})*/
