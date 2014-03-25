angular.module('myApp.services',
    [
        'ngResource',
        'ngCookies'
    ]).
    factory('ReferralStatus',function ($resource, $cookieStore) {
        var referralStatus = {isSubmitted: $cookieStore.get('referralStatus')};
        return{
            getReferralStatus: function () {
                return referralStatus.isSubmitted;
            },
            setReferralStatus: function (value) {
                $cookieStore.put('referralStatus', value)
                referralStatus.isSubmitted = $cookieStore.get('referralStatus');
            }
        }
    }).
    factory('QuestionnaireStatus', function ($resource, $cookieStore) {
        var questionnaireStatus = {isSubmitted: $cookieStore.get('questionnaireStatus')};
        return{
            getQuestionnaireStatus: function () {
                return questionnaireStatus.isSubmitted;
            },
            setQuestionnaireStatus: function (value) {
                $cookieStore.put('questionnaireStatus', value)
                questionnaireStatus.isSubmitted = $cookieStore.get('questionnaireStatus');
            }
        }
    });
