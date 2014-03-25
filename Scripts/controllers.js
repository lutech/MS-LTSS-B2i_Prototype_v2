'use strict';

/* Controllers */
angular.module("myApp.controllers", []).
    controller('MainController', ['$scope','ReferralStatus', 'QuestionnaireStatus','$route' , function($scope, ReferralStatus, QuestionnaireStatus, $route) {
        $scope.referralStatus = ReferralStatus.getReferralStatus();
        $scope.questionnaireStatus = QuestionnaireStatus.getQuestionnaireStatus();

        //Initial Referral
        $scope.saveReferral = function() {
            ReferralStatus.setReferralStatus('inProgress')
            window.location.assign("#/initialreferral/details")
        };
        $scope.submitReferral = function(){
            ReferralStatus.setReferralStatus('submitted')
            $route.reload();
        };

        //Questionnaire
        $scope.saveQuestionnaire = function() {
            QuestionnaireStatus.setQuestionnaireStatus('inProgress')
            window.location.assign("#/questionnaire/details")
        };

        $scope.submitQuestionnaire = function() {
            QuestionnaireStatus.setQuestionnaireStatus('submitted')
            $route.reload();
        };

    }]);