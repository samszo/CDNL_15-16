/* Copyright 2010 Cedexis Inc. */

(function() {
    var s = new Date();
    if ('object' === typeof window.radar) {
        window.radar.stoppedAt = s;
    }
})();
