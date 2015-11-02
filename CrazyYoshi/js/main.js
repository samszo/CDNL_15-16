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
    student['data']['skills'] = {
        "name": "Compétences",
        "children": []
    };

    for (var index in data['data']) {
        if (index != "") {

            if (getGeneralSection(index)) {
                var niveau = {
                    'nul': 0,
                    'moins nul': 20,
                    'bon': 40,
                    'trop bon': 60,
                    'expert': 100
                };
                var majorIndex = getGeneralSection(index);
                var minorIndex = getSmallSection(index);

                var majorSection = {
                    "name": majorIndex,
                    "children": []
                };

                if (niveau[data['data'][index]] > 0) {

                    var childSection = {
                        "name": minorIndex,
                        "size": niveau[data['data'][index]]
                    }

                    var filtered = student['data']['skills']['children'].filter(function (item) {
                        return item.name === majorIndex;
                    });


                    if (typeof filtered[0] !== "undefined" && filtered[0].name === majorIndex) {
                        majorSection = filtered[0];
                        majorSection['children'].push(childSection);
                        removeCsvEntry(student['data']['skills']['children'], 'name', majorIndex);

                    } else {
                        majorSection['children'].push(childSection);
                    }
                    student['data']['skills']['children'].push(majorSection);
                }


            } else {
                student['data'][index] = data['data'][index];
            }
        }
    }

    var somG = 0;
    var somD = 0;
    var niveau = {
        0: 0,
        20: 25,
        40: 50,
        60: 75,
        100: 100
    };

    var graphisme = student['data']['skills']['children'].filter(function (item) {
        return item.name === "Outils graphiques";
    });
    var developpement = student['data']['skills']['children'].filter(function (item) {
        return item.name === "Langages informatiques";
    });
    for (var outil in graphisme[0]['children']) {
        somG += niveau[parseInt(graphisme[0]['children'][outil]['size'])];
    }

    var avgG = somG / 15;
    student['data']["Graphiste"] = avgG;

    for (var langage in developpement[0]['children']) {
        somD += niveau[parseInt(developpement[0]['children'][langage]['size'])];
    }

    var avgD = somD / 24;
    student['data']["Developpeur"] = avgD;


    return student;
}

var setArticle = function (arr) {
    var item;
    item = "<article>";
    item += "    <figure>";
    item += "        <div id='" + arr['data']['idPhoto'] + "' style=\"background-image :url('" + arr['img'] + "')\" ></div>";
    item += "        <figcaption id='" + arr['data']['idPhoto'] + "'>" + arr['data']['Nom'] + " " + arr['data']['Prénom'] + "</figcaption>";
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
    var aside = "<div id=\"head\">étudiants</div>";
    aside += "<ul>";
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

    aside += "</ul>";
    aside += "<p class='bottom' id='8'>Trombinoscope développé par Maamar Miloud.</p>";

    $('#content').html(content);
    $('aside').html(aside);
    $("aside li, figure figcaption, figure div, .bottom").click(function () {
        detailStudent($(this));
    });
}

var detailStudent = function (item) {
    var idStudent = item[0].id;
    var data = JSON.parse(localStorage.getItem('data'));
    var student = data[idStudent];
    var name = student['data']["Prénom"] + " " + student['data']['Nom'];

    $('#head').html(name);

    var aside = "";
    aside += '<div id="head">' + name + '</div>';
    aside += '<div class="img" style="background-image:url(\'' + student['img'] + '\')"></div>';
    aside += '<ul>';
    aside += '<li class="mail">' + student['data']['mail'] + '</li>';
    aside += "<li><a href='https://github.com/" + student['data']['login Github'] + "' target='_blank'>Profil Github</a></li>";
    aside += "<li><a href='https://www.diigo.com/user/" + student['data']['login Diigo'] + "' target='_blank'>Profil Diigo</a></li>";
    if (student['data']['login twitter'] != "") {
        aside += "<li><a href='https://twitter.com/search?q=" + student['data']['login twitter'] + "&src=typd&lang=fr' target='_blank'>Twitter</a></li>";
    }

    if (student['data']['compte viadéo'] != "") {
        aside += "<li><a href='http://www.viadeo.com/fr/search/#/?q=" + student['data']['compte viadéo'] + "' target='_blank'>Viadéo</a></li>";
    }

    if (student['data']['page linkedIn'] != "") {
        aside += "<li><a href='" + student['data']['page linkedIn'] + "' target='_blank'>LinkedIn</a></li>";
    }


    aside += "</ul>";
    aside += "<p class='bottom' id='8'>Trombinoscope développé par Maamar Miloud.</p>";
    $('aside').html(aside);

    var skills = student['data']['skills'];

    bubbleChart("#content", skills);

}

var bubbleChart = function (container, root) {

    /*http: //bl.ocks.org/mbostock/4063269*/

    var diameter = 850,
        format = d3.format(",d"),
        color = d3.scale.category10();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    $(container).html('');
    var svg = d3.select(container).append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(root))
            .filter(function (d) {
                return !d.children;
            }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("title")
        .text(function (d) {
            return d.className + ": " + format(d.value);
        });

    node.append("circle")
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d) {
            return color(d.packageName);
        });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.className.substring(0, d.r / 3);
        });

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) {
                recurse(node.name, child);
            });
            else classes.push({
                packageName: name,
                className: node.name,
                value: node.size
            });
        }

        recurse(null, root);
        return {
            children: classes
        };
    }
    d3.select(self.frameElement).style("height", diameter + "px");
}

function removeCsvEntry(object, key, value) {

    /*http: //jsfiddle.net/J2KuY/1/*/
    $.each(object, function (index) {
        $.each(this, function (k, v) {
            if (k == key && v == value) {
                object.splice(index, 1);
            }
        });
    });
}
