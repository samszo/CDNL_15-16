var dataEtu;
var xmlDoc;
var photos = [];
var nav = "";

$(document).ready(
    function () {

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
            d3.csv("../php/lecteurFlux.php?url=cdnl1516data", function (data) {
                xmlDoc = data;
                getDatas();
            });

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

    xmlDoc.forEach(
        function (d) {
            if (d.idPhoto != "") {
                photos[d.idPhoto] = {
                    img: photos[d.idPhoto]['img'],
                    data: d
                };
            }
        });


    for (var e in photos) {
        photos[e] = datatreatment(photos[e]);
    }


    if (typeof localStorage !== "undefined") {
        localStorage.setItem("data", JSON.stringify(photos));
    }
    displayStudents();


}

var getGeneralSection = function (text) {
    var last = "";
    var strg = "";
    if (text.search(/\[/i) >= 0) {
        last = text.search(/ \[/i);
        strg = text.substr(0, last);
    }

    return strg;
}

var getSmallSection = function (text) {
    var first = "";
    var last = "";
    var strg = "";
    if (text.search(/\[/i) >= 0) {
        first = text.search(/\[/i) + 1;
        last = text.search(/\]/i) - first;
        strg = text.substr(first, last);
    }
    return strg;
}

var datatreatment = function (data) {

    var student = {
        img: data['img'],
        data: {}
    };

    for (var index in data['data']) {
        if (index != "") {

            if (getGeneralSection(index)) {

                var majorIndex = getGeneralSection(index);
                var minorIndex = getSmallSection(index);
                if (typeof student['data'][majorIndex] === "undefined") {
                    student['data'][majorIndex] = {};

                    if (typeof student['data'][majorIndex][minorIndex] === "undefined") {
                        student['data'][majorIndex][minorIndex] = {};
                    }

                }

                switch (data['data'][index]) {
                case 'expert':
                    student['data'][majorIndex][minorIndex] = 100;
                    break;
                case "trop bon":
                    student['data'][majorIndex][minorIndex] = 75;
                    break;
                case 'bon':
                    student['data'][majorIndex][minorIndex] = 50;
                    break;
                case "moins nul":
                    student['data'][majorIndex][minorIndex] = 25;
                    break;
                case "nul":
                    student['data'][majorIndex][minorIndex] = 0;
                    break;
                }


            } else {
                student['data'][index] = data['data'][index];
            }
        }
    }

    var somG = 0;
    var somD = 0;

    for (var outil in student['data']["Outils graphiques"]) {
        somG += parseInt(student['data']["Outils graphiques"][outil]);
    }

    var avgG = somG / Object.keys(student['data']["Outils graphiques"]).length;
    student['data']["Graphiste"] = avgG;

    for (var langage in student['data']["Langages informatiques"]) {
        somD += parseInt(student['data']["Langages informatiques"][langage]);
    }

    var avgD = somD / Object.keys(student['data']["Langages informatiques"]).length;
    student['data']["Developpeur"] = avgD;

    return student;
}

var setArticle = function (arr) {
    var item;
    item = "<article>";
    item += "    <figure>";
    item += "        <div id='" + arr['data']['idPhoto'] + "' style=\"background-image :url('" + arr['img'] + "')\" ></div>";
    item += "        <figcaption id='" + arr['data']['idPhoto'] + "'>" + arr['data']['Nom'] + " " + arr['data']['Prénom'] + "</figcaption>";
    /*    item += "        <p><a href='https://github.com/" + arr['data']['login Github'] + "' target='_blank'>Profil Github</a>";
        item += "        <a href='https://www.diigo.com/user/" + arr['data']['login Diigo'] + "' target='_blank'>Profil Diigo</a></p>";*/
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

var displayStudents = function (kind) {
    kind = (typeof kind === 'undefined') ? 'all' : kind;
    var content = "";
    var aside = "";
    var photos = JSON.parse(localStorage.getItem('data'));


    switch (kind) {
    case "all":
        photos.forEach(
            function (e) {
                if (e['img'] && e['data']) {
                    content += setArticle(e);
                    aside += setAside(e);
                }
            }
        );
        break;
    case "dev":
        {
            photos.forEach(
                function (e) {
                    if (e['img'] && e['data'] && (e['data']['Developpeur'] + 5) > e['data']['Graphiste']) {
                        content += setArticle(e);
                        aside += setAside(e);
                    }
                }
            );
        }
        break;
    case "gra":
        {
            photos.forEach(
                function (e) {
                    if (e['img'] && e['data'] && e['data']['Developpeur'] < (e['data']['Graphiste'] + 5)) {
                        content += setArticle(e);
                        aside += setAside(e);
                    }
                }
            );
        }
        break;
    case "mix":
        {
            photos.forEach(
                function (e) {
                    var dev = e['data']['Developpeur'];
                    var gra = e['data']['Graphiste'];
                    var min = 15;
                    var int = dev - gra;
                    if (e['img'] && e['data'] && int < 5 && int > -5 && dev > min && gra > min) {
                        content += setArticle(e);
                        aside += setAside(e);
                    }
                }
            );
        }
        break;


    }

    $('#content').html(content);
    $('#head').html("étudiants");
    $('aside > ul').html(aside);
    $("aside li, figure figcaption, figure div").click(function () {
        detailStudent($(this));
    });
}


var detailStudent = function (item) {
    var idStudent = item[0].id;
    var data = JSON.parse(localStorage.getItem('data'));
    var student = data[idStudent];
    var name = student['data']["Prénom"] + " " + student['data']['Nom'];

    $('#head').html(name);



}
