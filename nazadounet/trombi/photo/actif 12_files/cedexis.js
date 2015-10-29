if ( typeof(cedexis_loaded) == "undefined")
{
	(function(w, d) { var a = function() { var a = d.createElement('script'); a.type = 'text/javascript'; a.async = 'async'; a.src = '//' + ((w.location.protocol === 'https:') ? 's3.amazonaws.com/cdx-radar/' : 'radar.cedexis.com/') + '01-11074-radar10.min.js'; d.body.appendChild(a); }; if (w.addEventListener) { w.addEventListener('load', a, false); } else if (w.attachEvent) { w.attachEvent('onload', a); } }(window, document));
}
var cedexis_loaded = true;