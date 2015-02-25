(function () {
    var hashstate = 'hashchange';
    var load = 'load';
    var polymerRoute = 'polymer-route';

    Polymer({
        routes: [],
        routeElements: [],
        onHashChange: function () {
            this.go(location.hash);
        },
        go: function (hash, options) {
            history.pushState(null, null, hash);
            var route = this.findRoute(hash);
            if (route) {
                this.activateRoute(route, options);
            }
        },
        findRoute: function (hash) {
            var foundRoute = null;
            for (var i = 0; i < this.routeElements.length; i++) {
                var routeElement = this.routeElements[i];
                var routeMatch = routeElement._matcher.parse(hash);
                if (routeMatch) {
                    foundRoute = routeElement;
                    routeElement.params = routeMatch;
                }

                routeElement.hide();
            }

            return foundRoute;
        },
        activateRoute: function (route, options) {
            route.activate(options);
        },
        initRoutes: function () {
            this.routeElements = this.shadowRoot.getElementsByTagName(polymerRoute);
            [].forEach.call(this.routeElements, function (routeElement) {
                routeElement._matcher = routeMatcher(routeElement.path);
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
