'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
        'ngRoute',
        'ngResource',
        'myApp.controllers',
        'ngCookies',
        'myApp.services'
    ]).
    config(['$routeProvider', function ($routeProvider) {
        //Client Profile
        $routeProvider.when('/client/profile/details',
            {
                templateUrl: 'areas/client/profile/details.html',
                controller: 'MainController'
            });

        //History
        $routeProvider.when('/b2i/history/list',
            {
                templateUrl: 'areas/b2i/history/list.html',
                controller: 'MainController'
            });

        //Initial Referral
        $routeProvider.when('/initialreferral/list',
            {
                templateUrl: 'areas/b2i/initialreferral/list.html',
                controller: 'MainController'
            });
        $routeProvider.when('/initialreferral/create',
            {
                templateUrl: 'areas/b2i/initialreferral/create.html',
                controller: 'MainController'
            });
        $routeProvider.when('/initialreferral/details',
            {
                templateUrl: 'areas/b2i/initialreferral/details.html',
                controller: 'MainController'
            });
        $routeProvider.when('/initialreferral/edit',
            {
                templateUrl: 'areas/b2i/initialreferral/edit.html',
                controller: 'MainController'
            });
        $routeProvider.when('/initialreferral/editrepresentatives',
            {
                templateUrl: 'areas/b2i/initialreferral/editrepresentatives.html',
                controller: 'MainController'
            });
        $routeProvider.when('/initialreferral/editfacility',
            {
                templateUrl: 'areas/b2i/initialreferral/editfacility.html',
                controller: 'MainController'
            });
        $routeProvider.when('/initialreferral/editreferral',
            {
                templateUrl: 'areas/b2i/initialreferral/editreferral.html',
                controller: 'MainController'
            });
        $routeProvider.when('/initialreferral/editlivingarrangement',
            {
                templateUrl: 'areas/b2i/initialreferral/editlivingarrangement.html',
                controller: 'MainController'
            });
        $routeProvider.when('/initialreferral/editwaiver',
            {
                templateUrl: 'areas/b2i/initialreferral/editwaiver.html',
                controller: 'MainController'
            });

        //B2i Questionnaire
        $routeProvider.when('/questionnaire/list',
            {
                templateUrl: 'areas/b2i/questionnaire/list.html',
                controller: 'MainController'
            });
        $routeProvider.when('/questionnaire/create',
            {
                templateUrl: 'areas/b2i/questionnaire/create.html',
                controller: 'MainController'
            });
        $routeProvider.when('/questionnaire/details',
            {
                templateUrl: 'areas/b2i/questionnaire/details.html',
                link: function(scope) {
                        scope.$apply();
                    },
                controller: 'MainController'
            });
        $routeProvider.when('/questionnaire/edit',
            {
                templateUrl: 'areas/b2i/questionnaire/edit.html',
                controller: 'MainController'
            });

        // Provider Assignment
        $routeProvider.when('/providerassignment/list',
            {
                templateUrl: 'areas/b2i/providerassignment/list.html',
                controller: 'MainController'
            });

        //Freedom of Choice
        $routeProvider.when('/freedomofchoice/list',
            {
                templateUrl: 'areas/b2i/freedomofchoice/list.html',
                controller: 'MainController'
            });

        //Consent to Participate
        $routeProvider.when('/consenttoparticipate/list',
            {
                templateUrl: 'areas/b2i/consenttoparticipate/list.html',
                controller: 'MainController'
            });

        //Quality of Life
        $routeProvider.when('/qualityoflife/list',
            {
                templateUrl: 'areas/b2i/qualityoflife/list.html',
                controller: 'MainController'
            });

        //Application Assistance
        $routeProvider.when('/applicationassistance/list',
            {
                templateUrl: 'areas/b2i/applicationassistance/list.html',
                controller: 'MainController'
            });

        //Discahrge Form
        $routeProvider.when('/dischargeform/list',
            {
                templateUrl: 'areas/b2i/dischargeform/list.html',
                controller: 'MainController'
            });
        //Default View
        $routeProvider.otherwise({redirectTo: '/client/profile/details'});
    }]).
    run(function ($rootScope, ReferralStatus) {
        $rootScope.resetAll = function() {
            ReferralStatus.setReferralStatus(false)
            window.location.assign("#/client/profile/details")
        };
    $rootScope.$on('$viewContentLoaded', function () {
        //on page load, do something.
    });
});;
