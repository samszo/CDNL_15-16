(function () {
  var product = "";
  var r = /(^|,)(D2_[2345])|(D10_2)($|,)/gi;
  var n = r.exec(ngg_content);
  if (n)
    product += "ngg_sg1015";
    
  if (product)
    new Image().src="//adnext.fr/track.adv?ap=102848&expi=3&ts="+(new Date).getTime()+"&product="+product;
})();