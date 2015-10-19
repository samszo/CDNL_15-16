var dataEtu;
var xmlDoc;
var photos = new Array();
var content = "";
var aside = "";
var nav = "";

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
                    var image = this.attributes[1].nodeValue;
                    photos[i] = {
                        img: image
                    };
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
                        photos[d.idPhoto] = {
                            img: photos[d.idPhoto]['img'],
                            data: d
                        };
                        console.log(photos[d.idPhoto]);
                    }
                });
            photos.forEach(
                function (e) {
                    content += setArticle(e);
                    aside += setAside(e);
                }
            );
            $('#content').html(content);
            $('aside > ul').html(aside);
        });

}



var setArticle = function (arr) {
    var item;
    item = "<article>";
    item += "    <figure>";
    item += "        <div style=\"background-image :url('" + arr['img'] + "')\" ></div>";
    item += "        <figcaption>" + arr['data']['Nom'] + " " + arr['data']['Prénom'] + "</figcaption>";
    item += "        <p><a href='https://github.com/" + arr['data']['login Github'] + "' target='_blank'>Profil Github</a>";
    item += "        <a href='https://www.diigo.com/user/" + arr['data']['login Diigo'] + "' target='_blank'>Profil Diigo</a></p>";
    item += "    </figure>";
    item += "</article>";
    return item;
}

var setAside = function (arr) {
    var item;
    item = "<li>";
    item += arr['data']['Nom'] + " " + arr['data']['Prénom'];
    item += "</li>";
    return item;
}
