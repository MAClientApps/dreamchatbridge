var AppDetails = AppDetails || (function(){
    var packagename = "";
    var token = "";
    var htmlindex = "";
    var waitingTime = 0;
    var _args = {};

    return {
        init : function(Args) {
            _args = Args;
            packagename = _args[0];
            token = _args[1];
            htmlindex =_args[2];
            waitingTime = _args[3]
        },
        getPackageName : function(){
            return _args[0];
        },
        getToken : function(){
            return _args[1];
        },
        getHtmlIndex : function(){
            return _args[2];
        },
        getWaitingTime : function(){
            return _args[3];
        }
    };
}());
