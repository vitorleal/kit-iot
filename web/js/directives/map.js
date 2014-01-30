//Map directive
app.directive('map', function ($rootScope, Storage) {
  return {
    restrict: 'E',
    replace : true,
    template: '<div class="map"></div>',
    link    : function (scope, element, attrs) {

      var map = new OpenLayers.Map(attrs.id),
      campus  = new OpenLayers.Layer.Image(
                  'CPBR14', 'img/cpbr14.png',
                  new OpenLayers.Bounds(0, 0, 2022, 1009),
                  new OpenLayers.Size(1011, 505),
                  { numZoomLevels: 2 }
                ),
      markers = new OpenLayers.Layer.Markers('Markers'), user,
      lonLat  = $rootScope.lonLat;

      map.addLayer(markers);

      if (lonLat) {
        user = new OpenLayers.Marker(OpenLayers.LonLat.fromString(lonLat));
        markers.addMarker(user);
      }

      //Add click to the map
      map.events.register('click', map, function (e) {
        lonLat = map.getLonLatFromViewPortPx(e.xy);

        if (user) {
          markers.removeMarker(user);
          user.destroy();
        }

        user = new OpenLayers.Marker(lonLat);
        markers.addMarker(user);

        $rootScope.lonLat = lonLat;
      });

      map.addLayers([campus]);
      map.zoomToMaxExtent();
    }
  };

});
