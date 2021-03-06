<!--API Google SPEED-->

// Specify your actual API key here:
var API_KEY = 'AIzaSyCFnpwFqfxNtWZC1_R2DT24ly4kliFU-1U';

// Specify the URL you want PageSpeed results for here:
//    var URL_TO_GET_RESULTS_FOR = ['https://www.yandex.com/', 'http://php.net'];

var API_URL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
var CHART_API_URL = 'http://chart.apis.google.com/chart?';

// Object that will hold the callbacks that process results from the
// PageSpeed Insights API.
var callbacks = {};

// Invokes the PageSpeed Insights API. The response will contain
// JavaScript that invokes our callback with the PageSpeed results.
function runPagespeed(URL_TO_GET_RESULTS_FOR) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    var query = [
        'url=' + URL_TO_GET_RESULTS_FOR,
        'callback=runPagespeedCallbacks',
        'key=' + API_KEY
    ].join('&');
    s.src = API_URL + query;
    document.head.insertBefore(s, null);
}

// Our JSONP callback. Checks for errors, then invokes our callback handlers.
function runPagespeedCallbacks(result) {

//        console.log(result.ruleGroups.SPEED);
    if (result.error) {
        console.log('errors');
        var errors = result.error.errors;
        for (var i = 0, len = errors.length; i < len; ++i) {
            if (errors[i].reason == 'badRequest' && API_KEY == 'AIzaSyCFnpwFqfxNtWZC1_R2DT24ly4kliFU-1U') {
                alert('Please specify your Google API key in the API_KEY variable.');
            } else {
                // NOTE: your real production app should use a better
                // mechanism than alert() to communicate the error to the user.
                alert(errors[i].message);
            }
        }
        return;
    }

    // Dispatch to each function on the callbacks object.
    for (var fn in callbacks) {
        var f = callbacks[fn];
        if (typeof f == 'function') {
            callbacks[fn](result);
        }
    }
}

// Invoke the callback that fetches results. Async here so we're sure
// to discover any callbacks registered below, but this can be
// synchronous in your code.


callbacks.displayPageSpeedScore = function (result) {
    var score = result.ruleGroups.SPEED.score;
    var link = result.id; //url  нашей ссылки

//        console.log(result.ruleGroups.SPEED.score);



    // Construct the query to send to the Google Chart Tools.
    var query = [
        'chtt=' + link,
        'chs=480x100',
        'cht=gom',
        'chd=t:' + score,
        'chxt=x,y',
        'chxl=0:|' + score
    ].join('&');
    var i = document.createElement('img');
    i.src = CHART_API_URL + query;
    document.body.insertBefore(i, null);
};
