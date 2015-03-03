(function () {
  var hashstate = 'hashchange';
  var load = 'load';
  var polymerRoute = 'polymer-route';
  var hashSign = '#';

  Polymer({
    publish: {
      routes: [],
      defaultRouteElement: null,
      currentRoute: null,
      loaded: false,
      queuedHash: ''
    },
    routesChanged: function () {
      this.routes.forEach(function (route) {
      })
    },
    onHashChange: function () {
      this.go(location.hash);
    },
    go: function (hash, options) {
      if (!this.loaded) {
        return this.queuedHash = hash;
      }

      hash = this.normalizeHash(hash);
      var route = this.findRoute(hash);
      if (route) {
        history.pushState(null, null, hash);
        this.activateRoute(route, options);
      }
    },
    normalizeHash: function (hash) {
      //TODO: support nested routes

      if (hash.charAt(0) !== hashSign) {
        return hashSign + hash;
      }

      return hash;
    },
    findRoute: function (hash) {
      var foundRoute = null;
      [].forEach.call(this.getRouteElements(), function (routeElement) {
        routeElement.hide();
        if (routeElement.default || foundRoute) {
          return;
        }

        var normalizedPath = this.normalizeHash(routeElement.path);
        var matcher = routeMatcher(normalizedPath);
        var routeMatch = matcher.parse(hash);
        if (routeMatch) {
          foundRoute = routeElement;
          routeElement.params = routeMatch;
        }
      }.bind(this));

      return foundRoute || this.findRoute(this.normalizeHash(this.getDefaultRouteElement().redirect));
    },
    getRouteElements: function () {
      return this.shadowRoot ? this.shadowRoot.querySelectorAll(polymerRoute) : [];
    },
    getDefaultRouteElement: function () {
      return _.find(this.getRouteElements(), function (route) {
        return !!route.default;
      }.bind(this));
    },
    activateRoute: function (route, options) {
      this.currentRoute && this.currentRoute.detachView();
      route.activate(options);
      route.metadata = _.find(this.routes, {path: route.path});
      this.currentRoute = route;
      this.fire('route-changed', {
        route: route,
        options: options
      });
    },
    attached: function () {
      this.onHashChange = this.onHashChange.bind(this);
      window.addEventListener(hashstate, this.onHashChange);

      var loadHandler = function loadHandler () {
        this.loaded = true;
        if (this.queuedHash) {
          this.go(this.queuedHash);
        }

        window.removeEventListener(load, loadHandler);
      }.bind(this);

      window.addEventListener(load, loadHandler);
    },
    detached: function () {
      window.removeEventListener(hashstate, this.onHashChange);
    }
  });
}());
