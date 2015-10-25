var dataEtu;
var xmlDoc;
var photos = [];
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
                    }
                });


            displayAll();

            if (typeof localStorage !== "undefined") {
                for (var e in photos) {
                    photos[e] = sortData(photos[e]);
                }
                localStorage.setItem("data", JSON.stringify(photos));
            }

        });

}



var setArticle = function (arr) {
    var item;
    item = "<article>";
    item += "    <figure>";
    item += "        <div id='" + arr['data']['idPhoto'] + "' style=\"background-image :url('" + arr['img'] + "')\" ></div>";
    item += "        <figcaption id='" + arr['data']['idPhoto'] + "'>" + arr['data']['Nom'] + " " + arr['data']['Prénom'] + "</figcaption>";
    item += "        <p><a href='https://github.com/" + arr['data']['login Github'] + "' target='_blank'>Profil Github</a>";
    item += "        <a href='https://www.diigo.com/user/" + arr['data']['login Diigo'] + "' target='_blank'>Profil Diigo</a></p>";
    item += "    </figure>";
    item += "</article>";
    return item;
}

var setAside = function (arr) {
    var item;
    item = "<li id='" + arr['data']['idPhoto'] + "'>";
    item += arr['data']['Nom'] + " " + arr['data']['Prénom'];
    item += "</li>";
    return item;
}

var displayAll = function () {
    var content = "";
    var aside = "";
    photos.forEach(
        function (e) {
            content += setArticle(e);
            aside += setAside(e);
        }
    );
    $('#content').html(content);
    $('aside > ul').html(aside);
    $("aside li, figure figcaption, figure div").click(function () {
        displayCharts($(this));
    });
}

var sortData = function (data) {

    var student = data;

    for (var index in student['data']) {

        getGeneralSection(index);

        switch (student['data'][index]) {
        case 'expert':
            student['data'][index] = 100;
            break;
        case "trop bon":
            student['data'][index] = 75;
            break;
        case 'bon':
            student['data'][index] = 50;
            break;
        case "moins nul":
            student['data'][index] = 25;
            break;
        case "nul":
            student['data'][index] = 0;
            break;
        }
    }
    return student;
}

var displayCharts = function (thisItem) {
    var id = thisItem.attr('id');
    var photo = JSON.parse(localStorage.getItem('data'));
    var student = photo[id];
}


var getGeneralSection = function(text){
    var end = text.search(" \[");
    console.log(end);
}
