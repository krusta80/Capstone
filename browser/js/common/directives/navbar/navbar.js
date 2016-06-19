app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Home', state: 'home' , icon: "md md-home"},
                //{ label: 'Iframe', state: 'iframe' , icon: ""},
                { label: 'Projects', state: 'projects' , icon: "md md-list"},
                // { label: 'Job Manager', state: 'job' , icon: "md md-assignment-turned-in"},
                //{ label: 'Documentation', state: 'docs' },
                // { label: 'Members Only', state: 'membersOnly', auth: true , icon: ""},
                { label: 'Chart', state: 'chart', icon: "md md-insert-chart"},
                { label: 'Dashboard', state: 'dashboard', auth: true , icon: "md md-dashboard"}
            ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

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
