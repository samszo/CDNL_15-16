if ( typeof(nugg_loaded) == "undefined")
{
	if ( typeof(nuggsid) == "undefined")
		nuggsid = 846370158;
	function L(u){e=document.createElement("script");e.language="JavaScript";e.type="text/javascript";e.src=u;p=((document.body)?document.getElementsByTagName("head")[0]:document.body);p.insertBefore(e,p.firstChild);}
	var ngg_content ="";
	var nuggrid= encodeURIComponent(top.location.href);
	if ( window.location.protocol != 'https:' )
	  L("http://adverline.nuggad.net/rc?nuggn=1427996861&nuggsid="+nuggsid+"&nuggrid="+nuggrid);
	else
	  L("https://adverline-s.nuggad.net/rc?nuggn=1427996861&nuggsid="+nuggsid+"&nuggrid="+nuggrid);
}
var nugg_loaded = true;
L("//ads.adverline.com/tools/nugg_i36.js");
