var dataEtu;
var xmlDoc;
var photos = new Array();

$(document).ready(
    function () {
        d3.csv("../php/lecteurFlux.php?url=cdnl1516data", function (data){xmlDoc=data;});
        $.ajax({
            type: "GET",
            url: "../php/lecteurFlux.php?url=cdnl1516photo",
            dataType: "xml",
            success: function (xml) {
                return xml;
            }
        }).done(function(data){
            var i = 0;
            $(data).find('enclosure').each(
                function () {
                    photos[i] = new Array();
                    photos[i]['img']=this.attributes[1].nodeValue;
                    i++;
                }
            );
            getDatas();
        });

        console.log(photos);

    }
);


var displaydata = function(){
    photos.forEach(function(i){
        var info = "<img src='"+photos[i]['img']+"'/>";
        $('main').html().append(info);
    });
};

var getDatas = function(){
    d3.csv("../php/lecteurFlux.php?url=cdnl1516data",
           function (data){
        xmlDoc.forEach(
            function(d){
                photos[d.idPhotos]['data']=d;
            });

    });

}
