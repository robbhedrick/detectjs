/* **********************************************************
 * File:   detect.js
 * Desc:   super simple client side detection utiles
 * ********************************************************* */

/* 
 * Type:    Custom 
 * Desc:    Custom message goes here.
 */
  var Devices = { BreakPoints: /* list of supported screen breakpoints */
                    [
                        { name:'watch', min:0, max:50 },
                        { name:'phone', min:50, max:768 },
                        { name:'tablet', min:769, max:1198 },
                        { name:'desktop', min:1199, max:9999 }
                    ],
                    Browsers: /* list of supported browsers */
                    [
                        { name:'ie', min:8, ua:'Trident' },
                        { name:'safari', min:5, ua:'Version' },
                        { name:'chrome', min:7, ua:'Chrome'},
                        { name:'firefox', min:5, ua:'Firefox' },
                        { name:'webkit', min:5, ua:'AppleWebKit' }
                    ],
                    OS: /* list of supported operating systems */
                    [
                        { name:'iOS', min:5 },
                        { name:'Android', min:5 },
                        { name:'Macintosh', min:5 },
                        { name:'Windows NT', min:5 }
                    ]
                }


/* Type:    Main Class [Detect]
 * Desc:    New user agent and screen detection class.
 * ********************************************************* */
var Detect = {Screen:{Tests:{}}, Device:{Tests:{}}, Browser:{Tests:{}}};
    
    /* Detect.Screen   * 
     * **************  */    

    // ViewPort function to get current document width
    Detect.Screen.getWidth = function getWidth() {
         return document.documentElement.clientWidth;
    };

    // ViewPort function to get current document width
    Detect.Screen.getHeight = function getHeight() {
         return document.documentElement.clientHeight;
    };

    // ViewPort function to get current document width
    Detect.Screen.getDPR = function getDPR(){
        return window.devicePixelRatio;
    };

    // test if pixel ratio is greater than 1
    Detect.Screen.isRetina = function isRetina(){
        return window.devicePixelRatio > 1;
    };

    // test if doc element width is greather that height
    Detect.Screen.isLandscape = function isLandscape() {
        return Detect.Screen.getWidth() > Detect.Screen.getHeight();
    };

    // get name of device based on list of devices in screen breakpoints
    Detect.Screen.getDevice = function getDevice() {
        var res = "undefined";
        for(var i in Detect.Screen.Tests){
            var test = Detect.Screen.Tests[i];
            if(test()){
                res = i.substring(2).toLowerCase();
            }
        }
        return 
    };

    // get a quick snapshot of screen properties
    Detect.Screen.getSnapShot = function getSnapShot() {
        return ({width:Detect.Screen.getWidth(), height:Detect.Screen.getHeight(), device: Detect.Screen.getDevice(),landscape:Detect.Screen.isLandscape(), retina: Detect.Screen.isRetina()});
    };


    /* Detect.Browser  * 
     * **************  */    

    // If the user agent is WebKit, returns true. Otherwise, returns false.
    Detect.Browser.getType = function getType() {
        return false;
    };

    // If the user agent is WebKit, returns true. Otherwise, returns false.
    Detect.Browser.getVersion = function getVersion() {
        var matches = (navigator.userAgent).match("Firefox\/([\d]+\.[\w]?\.?[\w]+)");
        return matches;
    };

    // If the user agent is WebKit, returns true. Otherwise, returns false.
    Detect.Browser.isSupported = function isSupported() {
        return false;
    };


    /* Detect.Device   * 
     * **************  */    

    // If the user agent is WebKit, returns true. Otherwise, returns false.
    Detect.Device.isMac = function isMac() {
        return RegExp("Macintosh").test(navigator.userAgent);
    };

    // If the user agent is WebKit, returns true. Otherwise, returns false.
    Detect.Device.isWin = function isWin() {
        return RegExp("Windows NT").test(navigator.userAgent);
    };

    // If the user agent is 
    Detect.Device.getDevice = function mobileDevice() {

        var fields = RegExp("(Mozilla/5.0 \\()([^;]+)").exec(navigator.userAgent);
        if (!fields || fields.length < 3)
            return null;
        return fields[2];
    };


    // If the user agent is 
    Detect.Device.mobileDevice = function mobileDevice() {
        if (!Detect.Device.isMobile())
            return null;
            
        return Detect.Device.getDevice()
    };

    // If the user agent is 
    Detect.Device.mobileOS = function mobileOS() {
        
        var ua = navigator.userAgent;
        var uaindex;
        
        var os = undefined;
         if ( ua.match(/iPad/i) || ua.match(/iPhone/i) || ua.match(/iPod/i) ) {
            os = 'iOS';
         } else if ( ua.match(/Android/i) ) {
            os = 'Android'
        } else {
            os = undefined;
        }
        
        return os;
    };

    // If the user agent is 
    Detect.Device.OSVersion = function getOSVersion() {
        
        var ua = navigator.userAgent;
        var os = Detect.Device.mobileOS();
        var osversion = undefined;
        if (os == undefined) return undefined;
        
        if (os == 'iOS') {
            var uaindex  = ua.indexOf('OS ');
            if (uaindex > -1) {
                osversion = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
            }
            
        } else if (os == 'Android') {
            var uaindex = ua.indexOf( 'Android ' );
            if (uaindex > -1) {
                osversion = ua.substr( uaindex + 8, 3 );
            }
        }

        return osversion;
    };

     // If the user agent is WebKit and has Mobile, returns true. Otherwise, returns false.
    Detect.Device.isMobile = function isMobile() {
        return Detect.Browser.isWebKit() && RegExp(" Mobile/").test(navigator.userAgent);
    };

    // If the user agent is WebKit and has Mobile, returns true. Otherwise, returns false.
    Detect.Device.isAndroid = function isAndroid() {
        return Detect.Device.isMobile() && Detect.Device.mobileOS() === "Android";
    };

    // If the user agent is WebKit and has Mobile, returns true. Otherwise, returns false.
    Detect.Device.isiOS = function isiOS() {
        return Detect.Device.isMobile() && Detect.Device.mobileOS() === "iOS";
    };


    /* Add Custom      * 
     * **************  */   

    // create new script element
    var script = document.createElement('script'); 
        script.type = 'text/javascript';
    
    // var to build custom device tests
    var tests = '/* Tests */';

    // loop through all breakpoints defined in devices and build custom tests
    for (var i in Devices.BreakPoints) {

        var d = Devices.BreakPoints[i]; // get device
        var dfn = "is" + d.name.charAt(0).toUpperCase() + d.name.slice(1); // build device function name

        tests += 'Detect.Screen.Tests.'+dfn+' = function '+dfn+' (){ '
              + 'return Detect.Screen.getWidth() > '+Devices.BreakPoints[i].min+' && Detect.Screen.getWidth() <= '+Devices.BreakPoints[i].max+'; }; ';
    };

    // loop through all browsers defined in devices and build custom tests
    for (var i in Devices.Browsers) {

        var d = Devices.Browsers[i]; // get device
        var dfn = "is" + d.name.charAt(0).toUpperCase() + d.name.slice(1); // build device function name

        tests += 'Detect.Browser.Tests.'+dfn+' = function '+dfn+' (){ '
              + 'return RegExp(" '+d.ua+'/").test(navigator.userAgent); };';
    };

    // 
    script.text = (tests);

    // Add script before closing body tag
    if(document.body != null){ document.body.appendChild(script);}
