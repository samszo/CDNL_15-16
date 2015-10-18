var dataEtu;
var xmlDoc;
var photos = new Array();
var html = "";

$(document).ready(
    function () {
        d3.csv("../php/lecteurFlux.php?url=cdnl1516data", function (data) {
            xmlDoc = data;
        });
        $.ajax({
            type: "GET",
            url: "../php/lecteurFlux.php?url=cdnl1516photo",
            dataType: "xml",
            success: function (xml) {
                return xml;
            }
        }).done(function (data) {
            var i = 0;
            $(data).find('enclosure').each(
                function () {
                    photos[i] = new Array();
                    photos[i]['img'] = this.attributes[1].nodeValue;
                    i++;
                }
            );
            getDatas();
        });
    }
);


var displaydata = function () {
    photos.forEach(function (i) {
        var info = "<img src='" + photos[i]['img'] + "'/>";
        $('#content').html().append(info);
    });
};

var getDatas = function () {
    d3.csv("../php/lecteurFlux.php?url=cdnl1516data",
        function (data) {
            xmlDoc.forEach(
                function (d) {
                    if (d.idPhoto != "") {
                        photos[d.idPhoto]['data'] = d;
                    }
                });
            photos.forEach(
                function (e) {
                    var item = "";
                    item = "<article>";
                    item += "    <figure>";
                    item += "        <div style=\"background-image :url('" + e['img'] + "')\" ></div>";
                    item += "        <figcaption>" + e['data']['Nom'] + " " + e['data']['Prénom'] + "</figcaption>";
                    item += "    </figure>";
                    item += "</article>";
                    html += item;
                }
            );
            $('#content').html(html);
        });

}
