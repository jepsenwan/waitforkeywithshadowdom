function waitForKeyElements (
selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
 actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
 bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
 iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;
 
    if (typeof iframeSelector == "undefined") {
        targetNodes = document.querySelector("spt-header-root ").shadowRoot.querySelector("spt-header-menu-opener > div > div");
    }
    else {
        targetNodes = document.querySelectorAll(iframeSelector).contents()
            .find(selectorTxt);
    }
 
    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.forEach ( (tNode) => {
            console.log("node", tNode);
            var alreadyFound = tNode.alreadyFound || false;
 
            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction (tNode);
                if (cancelFound) {
                    btargetsFound = false;
                }
                else {
                    tNode.alreadyFound = true;
                }
            }
        } );
    }
    else {
        btargetsFound = false;
    }
 
    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];
 
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements ( selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },
                                       300
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}
 
// wait until page loaded
waitForKeyElements ("video", addControlsToVideo);
 
function addControlsToVideo (player) {
    // var player = jNode.querySelector("video");
    player.setAttribute("controls", "");
    player.setAttribute("z-index", 1000);
    player.style.zIndex = 1000;
    if (playerVolume != -1) {
        player.volume = playerVolume;
    }
}
 
 
