var package = AppDetails.getPackageName();
var htmlindex = AppDetails.getHtmlIndex();
var token = AppDetails.getToken();

var adjustId = '';
var googleAdvertisingId = '';
var naming = '';
var deeplink = '';
var attributionReceived = false;
var deeplinkReceived = false;

var adjustConfig = new AdjustConfig(token, AdjustConfig.EnvironmentProduction);
adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
adjustConfig.setAttributionCallback(attributionCallback);
adjustConfig.setDeferredDeeplinkCallback(deferredDeeplinkCallback);
adjustConfig.setDelayStart(1.5);
Adjust.onCreate(adjustConfig);

window.onload = function () {
    adjustId = Adjust.getAdid(); 
    console.log("AdId 1: "+adjustId);
    
    Adjust.getGoogleAdId(function (gpsAdid) {
        googleAdvertisingId = gpsAdid;
        console.log('Google Play Ad Id:\n' + gpsAdid);
    });
    
    // Wait for up to 5 seconds for the attribution callback
    setTimeout(function () {
        if (!attributionReceived) {
            console.log('Call Url after timeout');
            callUrl(); // call the function if 5 seconds have passed without receiving the attribution
        }
    }, 5000);
}

// Define the callUrl function
function callUrl() {
    // Hide the loader
    // wait until adjust is initialized
    adjustId = Adjust.getAdid();
    console.log("AdId callUrl: "+adjustId);

    if(adjustId == 'undefined' || adjustId == 'null'){
        adjustId = '';
    }
    naming = replaceNullWithEmpty(naming);
    deeplink = replaceNullWithEmpty(deeplink);
    adjustId = replaceNullWithEmpty(adjustId);
    googleAdvertisingId = replaceNullWithEmpty(googleAdvertisingId);
    navigateTo(naming, deeplink, package, adjustId,googleAdvertisingId);
}

function attributionCallback(attribution) {
    attributionReceived = true;
    console.log('Tracker token = ' + attribution.trackerToken + '\n' +
            'Tracker name = ' + attribution.trackerName + '\n' +
            'Network = ' + attribution.network + '\n' +
            'Campaign = ' + attribution.campaign + '\n' +
            'Adgroup = ' + attribution.adgroup + '\n' +
            'Creative = ' + attribution.creative + '\n' +
            'fbInstallReferrer = ' + attribution.fbInstallReferrer + '\n' +
            'Click label = ' + attribution.clickLabel);
    console.log('Call Url from attributionCallback');
    naming = attribution.campaign;
    callUrl(); // call the function if attribution is received
}

function deferredDeeplinkCallback(deferredDeeplink) {
    deeplinkReceived = true;
    var encodedDeeplink = encodeURIComponent(deferredDeeplink);
    adjustId = Adjust.getAdid();
    console.log("AdId deeplink: "+adjustId);
    deeplink = encodedDeeplink;
    console.log('deferredDeeplinkCallback deff: '+deeplink);
}

window.onerror = function (error) {
    console.log('onerror - err: '+error);
}

function replaceNullWithEmpty(value) {
    if (value == null || value === undefined || value === "null") {
        return "";
    }
    return value;
}