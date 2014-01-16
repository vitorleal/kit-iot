//Map controller
app.controller('mapCtrl', function ($scope, $location, Storage, $http) {
  var map     = new OpenLayers.Map('map'),
      campus  = new OpenLayers.Layer.Image('CPBR14', 'img/cpbr14.png',
                new OpenLayers.Bounds(0, 0, 2022, 1009),
                new OpenLayers.Size(1011, 504),
                { numZoomLevels: 2 }),
      markers = new OpenLayers.Layer.Markers( "Markers" ),
      me, lonLat = Storage.get('lonLat');

  map.addLayer(markers);

  if (lonLat) {
    me = new OpenLayers.Marker(OpenLayers.LonLat.fromString(lonLat));
    markers.addMarker(me);
  }

  //Add marker on click
  map.events.register('click', map, function (e) {
    lonLat = map.getLonLatFromViewPortPx(e.xy);

    if (!me) {
      me = new OpenLayers.Marker(lonLat);
      markers.addMarker(me);

    } else {
      markers.removeMarker(me);
      me.destroy();
      me = new OpenLayers.Marker(lonLat);
      markers.addMarker(me);
    }
  });

  map.addLayers([campus]);
  map.zoomToMaxExtent();

  $scope.dashboard = function () {
    if (lonLat) {
      var lonLatShort = lonLat.toShortString();
      Storage.put('lonLat', lonLatShort);

      $http.post('/lonLat', { userProps: Storage.getUserProps() })
        .success(function (data, status) {
          $location.path('/dashboard');
        });
    }
  };
});
