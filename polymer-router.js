(function () {
    var hashstate = 'hashchange';
    var load = 'load';
    var polymerRoute = 'polymer-route';

    Polymer({
        routes: [],
        routeElements: [],
        defaultRouteElement: null,
        onHashChange: function () {
            this.go(location.hash);
        },
        go: function (hash, options) {
            var route = this.findRoute(hash);
            if (route) {
              history.pushState(null, null, hash);
              this.activateRoute(route, options);
            }
        },
        findRoute: function (hash) {
            var foundRoute = null;
            [].forEach.call(this.routeElements, function (routeElement) {
                routeElement.hide();
                if (routeElement.default || foundRoute) {
                      return;
                }

                var matcher = routeMatcher(routeElement.path);
                var routeMatch = matcher.parse(hash);
                if (routeMatch) {
                  foundRoute = routeElement;
                  routeElement.params = routeMatch;
                }
            });

            return foundRoute || this.findRoute(this.defaultRouteElement.redirect);
        },
        activateRoute: function (route, options) {
            route.activate(options);
        },
        initRoutes: function () {
            this.routeElements = this.shadowRoot.getElementsByTagName(polymerRoute);
            this.defaultRouteElement = _.find(this.routeElements, function (route) {
              return !!route.default;
            });
        },
        attached: function () {
            this.onHashChange = this.onHashChange.bind(this);
            window.addEventListener(hashstate, this.onHashChange);

            var loadHandler = function loadHandler () {
                this.initRoutes();
                this.go(location.hash);
                window.removeEventListener(load, loadHandler);
            }.bind(this);

            window.addEventListener(load, loadHandler);
        },
        detached: function () {
            window.removeEventListener(hashstate, this.onHashChange);
        }
    });
}());
