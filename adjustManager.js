var package = AppDetails.getPackageName();
var htmlindex = AppDetails.getHtmlIndex();
var token = AppDetails.getToken();

var adjustId = '';
var googleAdvertisingId = '';
var click_id = '';
var naming = '';
var deeplink = '';
var attributionReceived = false;
var deeplinkReceived = false;

var adjustConfig = new AdjustConfig(token, AdjustConfig.EnvironmentProduction);
adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
adjustConfig.setAttributionCallback(attributionCallback);
adjustConfig.setDeferredDeeplinkCallback(deferredDeeplinkCallback);
adjustConfig.setDelayStart(1.5);
click_id = getClickId();
Adjust.addSessionCallbackParameter('user_uuid', click_id);
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


    navigateTo(naming, deeplink, package, adjustId, googleAdvertisingId, click_id);
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


function getClickId() {
    // Check for existing user ID in cookies
    var click_id = localStorage.getItem('click_id');
    console.log("localstorage value: "+ click_id);
    // If not found, generate a new user ID
    if (!click_id) {
        console.log("click id is empty");
        click_id = generateUserId();
        console.log("generated click id: "+click_id);
        localStorage.setItem('click_id', click_id);
    }
    return click_id;
}

function generateUserId() {
    // Here, you can implement your own ID generation logic
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
           (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
       );
}
