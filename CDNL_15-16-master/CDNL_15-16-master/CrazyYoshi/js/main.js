	var dataEtu;
	$(document).ready(
	    function () {
	        $.ajax({
	            type: "GET",
	            url: "../php/lecteurFlux.php?url=cdnl1516photo",
	            dataType: "xml",
	            success: function (xml) {
	                var i = 0;
	                $(xml).find('enclosure').each(
	                    function () {
	                        //console.log(this.attributes[1].nodeValue);
	                        $('<div class="items" id="link_' + i + '"></div>').html('<img onclick="voirData(' + i + ')" src="' + this.attributes[1].nodeValue + '" />').appendTo('#Div_XML');
	                        i++;
	                    });
	            }
	        });
	        d3.csv("../php/lecteurFlux.php?url=cdnl1516data", function (data) {
	            dataEtu = data;
	            /*
			   data.forEach(function(d,i){
				   console.log(d.idPhoto+" "+d.Nom);
			   })
			   */
	        });
	    }
	);

	function voirData(id) {
	    //chercher les data
	    dataEtu.forEach(function (d) {
	        if (d.idPhoto == id && d.idPhoto != "") {
	            $('<div class="data" id="data_' + id + '"></div>').html(d.Prénom + " " + d.Nom).appendTo('#link_' + id);

	        }
	    })

	}
