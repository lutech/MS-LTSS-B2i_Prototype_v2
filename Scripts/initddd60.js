$(function () {
    if (!initddd60()) {
        setTimeout(initddd60, 0); // re-try if dotdotdot library has not been loaded yet
    }
 
    function initddd60() {
        if (typeof (initDotDotDot) === "function") {
            initDotDotDot('div.long-description', 60);
            return true;
        }
        console.log("initDotDotDot function not found");
        return false;
    }
});