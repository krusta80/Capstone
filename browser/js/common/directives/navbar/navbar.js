app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, $location) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {
            scope.sideBarPosition = 'expanded';
            scope.items = [
                { label: 'Home', state: 'home' , icon: "md md-home"},
                //{ label: 'Iframe', state: 'iframe' , icon: ""},
                { label: 'Projects', state: 'control.projects' , icon: "md md-list"},
                // { label: 'Job Manager', state: 'job' , icon: "md md-assignment-turned-in"},
                //{ label: 'Documentation', state: 'docs' },
                // { label: 'Members Only', state: 'membersOnly', auth: true , icon: ""},
                //{ label: 'Chart', state: 'chart', icon: "md md-insert-chart"},
                { label: 'Dashboard', state: 'dashboard', auth: true , icon: "md md-dashboard"}
            ];
            scope.currentBaseRoute = $location.$$url.split('/')[0];
            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            scope.toggleSideBar = function(action) {
                if (scope.sideBarPosition === 'collapsed') {
                    console.log('sideBar is expanded');
                    scope.sideBarPosition = 'expanded';
                    angular.element('.navbar-fixed-top').removeClass('collapsed').addClass('expanded');
                    angular.element('main').removeClass('collapsed').addClass('expanded');
                } else {
                    console.log('sideBar is collapsed');
                    scope.sideBarPosition = 'collapsed';
                    angular.element('.navbar-fixed-top').addClass('collapsed').removeClass('expanded');
                    angular.element('main').addClass('collapsed').removeClass('expanded');
                }
            };

            $rootScope.$on('sideBarClose', function(ev, action) {
                scope.sideBarPosition = 'collapsed';
                angular.element('.navbar-fixed-top').addClass('collapsed').removeClass('expanded');
                angular.element('main').addClass('collapsed').removeClass('expanded');
            });

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
