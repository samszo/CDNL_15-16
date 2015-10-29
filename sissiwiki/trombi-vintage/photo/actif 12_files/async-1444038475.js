/********************************************************/
/******************* Gestion js async *******************/
/********************************************************/
var Async = function(id, callback) {
    this.id = id;
    this.callback = callback;
    this.init = false;
    
    /* Fonction vérifiant si l'id et la callback sont ok */
    this.ready = function() {
        if (typeof(this.callback) != "undefined" && document.getElementById(this.id)) {
            return (true);
        } 

        return (false);
    }
}

var inits = new Array(
    new Async('actionnaire', init_actfil),
    new Async('actif', init_actif),
    new Async('fullfiche', init_full),
    new Async('cartographie', init_carto),
    new Async('cartoshop', init_cartoshop),
    new Async('chiffre', init_chiffreclef),
    new Async('compteresultat', init_compteresultat),
    new Async('etat-financier', init_etatfinancier),
    new Async('passif', init_passif),
    new Async('qrcodemobile', init_qrcode),
    new Async('synthese', init_synthese),
    new Async('searchplus', init_recherche),
    new Async('rensjur', init_rensjur),
    new Async('identite', init_resume),
    new Async('identite', init_resume_onglets),
    new Async('identite-etablissement', init_resume_etablissement),
    new Async('identite-etablissement', init_resume_onglets),
    new Async('actubloc', init_edition),
    new Async('infos', init_minifiche),
    new Async('bilansociaux', init_sociaux),
    new Async('recbasketcontent', init_panierajout),
    new Async('container', init_addbasket),
    new Async('ie8warning', init_versionwarning),
    new Async('coldroiteie', init_ie),
    new Async('client_informations', init_client_informations),
    new Async('mandatdir', init_mandatdir)
);

/* Permet d'ajouter à la voler si besoin des fonctions asynchrone */
function add_async(id, callback) {
    var async = new Async(id, callback);
    inits.push(async);
}
/* Completeload prend vrai si le document est complete */
var completeload = false;

/* On checke quand le document est prêt */
add_event(document, "readystatechange", function(){
    if (document.readyState == "complete") { 
        completeload = true; 
    }
});

/* Fonction permettant l'initialisation si ok */
function async_init() {
    for (var i = 0; i < inits.length; i++) {
        if (!inits[i].init && inits[i].ready()) {
            inits[i].callback();
            inits[i].init = true;
        }
    }
}

/* Permettant ou non de rappeler l'init */
function async_loop() {
    async_init(); 
    
    if (!completeload) {
        setTimeout(async_loop, 20);
    } else {
        /* On fait un dernier check au cas où il y aura un init qui
         * ne soit pas encore passé */
        init_addbasket();
        async_init();
        manageokc();
        init_pubs();
        adnext_cssmove();
    } 
}

async_loop();


function init_coldroiteie() {
    if (!document.addEventListener) {
        move_block(document.getElementById('recbasket'), document.getElementById('coldroiteie'));
       move_block(document.getElementById('news'), document.getElementById('coldroiteie'));
       move_block(document.getElementById('coldroitemove'), document.getElementById('coldroiteie'));

        var list = get_elementsbyclassname(document, 'newsdroite');
        for (i = 0; i < list.length; i++) {
            move_block(list[i], document.getElementById('coldroiteie'));
        }
        move_block(document.getElementById('pubcarre'), document.getElementById('coldroiteie'));
        move_block(document.getElementById('pubcarre2'), document.getElementById('coldroiteie'));
    }
}

function init_versionwarning () {
    if (isltIE9()) {
        display('ie8warning');
    }
}

function init_ie() {
    if (isltIE9()) {
        init_coldroiteie();
    }
}

/********************************************************/
/******************** EDITIONS **************************/
/********************************************************/
function init_edition() {
    init_actu();
    add_event(window, "resize", function(){resize_edition();});
}

function init_actu() {
    var pos_desktop = document.getElementById('actucarreafter');
    var pos_mobile = document.getElementById('actucarre');
    var actu = document.getElementById('actubloc');

    if (is_desktop_device()) {
        move_block(actu, pos_desktop);
    } else {
        move_block(actu, pos_mobile);
    }
}

function resize_edition() {
    init_actu(); 
}

/* La vue chiffre clef */
function init_chiffreclef() {
    var chiffre = document.getElementById('chiffrecle');
    var tableau = document.getElementById('chiffre');

    display_num(chiffre);
    init_chiffre(tableau); 
    
    if (chiffre) {
        build_table_chiffre(chiffre);
        display_num(chiffre);
    }

    add_event(window, "resize", function() {build_table_chiffre(chiffre); display_num(chiffre);});
}
function init_chiffre(tab) {
    var reg = new RegExp("[0-9]")

        if (!tab) {
            return;
        }

    var cells = tab.getElementsByTagName("td");

    for (var i = 0; i < cells.length; i++) {
        /* Tableau à 4 colonnes, on ne veut pas
         * que les cases des 3dernières colonnes ne passent pas
         * sur plusieurs lignes */
        if (i % 4 != 0) {
            if (reg.test(cells[i].innerHTML)) { 
                add_class(cells[i], "nowrap"); 
            } 
        }
    }
}

/* vue synthese */
function init_synthese() {
    var synthese = document.getElementById('synthese');
    if (synthese != null) {
        var numbers = synthese.getElementsByTagName("span");

        for (var e in numbers) {
            if (numbers[e].className != undefined && numbers[e].className.search("synthesenumber") != -1) {
                numbers[e].innerHTML = number_presenter(numbers[e].innerHTML);
            }
        }
    }
}

/* La vue qrcode */
function init_qrcode() {
    var help_qrcode = document.getElementById('activeqrcode');
    hide('helpqrcode');
    add_event(help_qrcode, "click", function(){display_or_hide('helpqrcode');});

    resize_qrcode();
    add_event(window, "resize", resize_qrcode);

//    display('qrcode');
}

function resize_qrcode() {
    var qrcode = document.getElementById('qrcode');
    var qrcodemobile = document.getElementById('qrcodemobile');
    var qrcodedesktop = document.getElementById('qrcodedesktop');

    if (is_phone_device()) {
        move_block(qrcode, qrcodemobile);
    } else {
        move_block(qrcode, qrcodedesktop); 
    }

}

/* La vue actfil */
function init_actfil() {
    var act = document.getElementById('actfil');
    display_num(act);
}

/* La vue actif */
function init_actif() {
    var actif = document.getElementById('actif');
    var tableresume = document.getElementById('tableresume');
    display_num(actif);
    display_num(tableresume);
    init_chiffre(actif);

    if (actif) {
        build_table_chiffre(actif);
        display_num(actif);
    }

    add_event(window, "resize", function() {build_table_chiffre(actif); display_num(actif);});
}


/* La vue compte */
function init_compteresultat() {
    var compteres = document.getElementById('compteresultat');
    display_num(compteres);
    init_chiffre(compteres);
    
    if (compteres) {
        build_table_chiffre(compteres);
        display_num(compteres);
    }

    add_event(window, "resize", function() {build_table_chiffre(compteres); display_num(compteres);});
}

function init_etatfinancier() {
    var etatfinancier = document.getElementById('etat-financier');

    display_num(etatfinancier);
    
    if (etatfinancier) {
        build_table_chiffre(etatfinancier);
        display_num(etatfinancier);
    }

    add_event(window, "resize", function() {build_table_chiffre(etatfinancier); display_num(etatfinancier);});
}

/* La vue passif */
function init_passif() {
    var passif = document.getElementById('passif');
    display_num(passif);
    init_chiffre(passif);
    
    if (passif) {
        build_table_chiffre(passif);
        display_num(passif);
    }

    add_event(window, "resize", function() {build_table_chiffre(passif); display_num(passif);});
}

/* La vue rensjur */
function init_rensjur() {
    var rensjur = document.getElementById('rensjur');
    var rensjurcomplete = document.getElementById('rensjurcomplete');
    display_num(rensjur);
    display_num(rensjurcomplete);
}

/********************************************************/
/******************** VIEW_CARTO ************************/
/********************************************************/
var infos = document.getElementById('infos');
var infost;

function infoshow(delaysec) {
    if (infos) {
        infos.style.visibility = 'visible';
        clearTimeout(infost);
        if (delaysec) {
            infost = setTimeout("javascript:infos.style.visibility='hidden';", delaysec * 1000);
        }
    }
}

function infohide() {
    if (infos) {
        infos.style.visibility = 'hidden';
        clearTimeout(infost);
    }
}

/* Fonction permettant de gérer l'affichage de la carto */
var ratio_phone = 3/2;
var ratio_tablet = 4/3;
var ratio_desktop = 7/5;

function ratio_device() {
    if (is_phone_device()) {
        return (ratio_phone);
    } else if (is_tablet_device()) {
        return (ratio_tablet);
    }

    return (ratio_desktop);
}

function link_carto(param, xsize, ysize, ext) {
    if (!param) {
        return "";
    } 
   
    var link = "/cgi-bin/cartoc?param=" + param + "&format=";
    /* Cas ie8 - */
    if (document.all && !document.addEventListener) {
        link += "vml"; 
    } else {
        link += "svg";
    }

    link += "&xsize=" + xsize + "&ysize=" + ysize;

    return (link);
}

function xsize_carto(ext) {
    var xsize = 0;

    if (!ext) {
        var obj = document.getElementById('identite');
        if (!obj) {
            obj = document.getElementById('identitedir');
        }

        xsize = get_width(obj);
    } else {
        xsize = get_width(document.getElementById('headercartoext'));
    }

    /* Cas ie8 - */   
    if (isNaN(xsize) || (document.all && !document.addEventListener)) {
        xsize = 998;
    }

    if (is_desktop_device()) {
        xsize -= 350;
    } else {
        xsize -= 50;
    }

    xsize = Math.round(xsize);

    return (xsize);
}

function ysize_carto(xsize) {
    var ysize = Math.round(xsize * ratio_device());

    return (ysize);
}

function build_carto(param, ext) {
    if (!param) {
        return ("");
    }
   
    var xsize = xsize_carto(ext);
    var ysize = ysize_carto(xsize); 
    var link = link_carto(param, xsize, ysize, ext);
    
    if (document.all && !document.addEventListener) {
        var carto = "<iframe src='" + link + "' ";
        carto += "frameborder='0'";
        carto += "id='theframe' ";
        carto += "type='text/html' ";
        carto += "width='" + xsize + "' ";
        carto += "height='" + ysize + "' ";
        carto += "></iframe>"; 

        return (carto);
    } else {
        var carto = "<object data='" + link + "' ";
        carto += "type='image/svg+xml' ";
        carto += "id='theframe' ";
        carto += "width='" + xsize + "' ";
        carto += "height='" + ysize + "' ";
        carto += "></object>";

        return (carto);
    }

}

function add_carto(param) {
    if (param) {
       var carto = build_carto(param, 0);
        document.getElementById('cartosvgnoext').innerHTML = carto;
    }

    if (document.addEventListener) { /* ie 8+ */
        add_event(window, "resize", function(){resize_carto(param, 0);});
    }
}

function resize_carto(param, ext) {
    var frame = document.getElementById("theframe");

    if (frame && param) {
        var xsize = xsize_carto(ext);
        var ysize = ysize_carto(xsize);
        var link = link_carto(param, xsize, ysize);

        /* on teste si ie8- */
//            frame.setAttribute("src", link);
//        } else {
            frame.setAttribute("data", link);
//        }

        frame.width = xsize;
        frame.height = ysize;
    }
}

function add_carto_ext(param) {
    if (param) {
        var carto = build_carto(param, 1);
        document.getElementById('cartosvgext').innerHTML = carto;

        if (document.addEventListener) { /* ie 8+ */
            add_event(window, "resize", function(){resize_carto(param, 1);});
        }
    }
}

/* Découpe /minicarto/356000000/x/y */
function extract_carto_x(url) {
    var tab;
    var x = 0;

    if (url) {
        tab = url.split('/');

        if (tab.length < 5) {
            return (0);
        }

        x = parseInt(tab[tab.length - 2]);
    }

    return (x);
}

function extract_carto_y(url) {
    var tab;
    var y;

    if (url) {
        tab = url.split('/');

        if (tab.length < 5) {
            return (0);
        }

        y = parseInt(tab[tab.length - 1]);
    }

    return (y);
}


/********************************************************/
/********************** SOCIAUX *************************/
/********************************************************/
function init_sociaux() {
    var select = document.getElementById('selectsociaux');
    if (select) { 
        add_event(select, 'change', function(){window.location.href = select[select.selectedIndex].value;}); 
    }
}

/********************************************************/
/*************** VIEW MINIFICHE SCROLLING ***************/
/********************************************************/

function init_minifiche_view() {
    var id = document.getElementById('minifichecarto');
    if (!id) {
        setTimeout(init_minifiche_view, 20);
    } else {
        init_minifiche_resume();
        init_minifiche_bilan();
        setTimeout(init_minifiche_view, 20);
    }
}

/* La vue minifiche-resume */
function init_minifiche_resume() {
    var resume = document.getElementById('minifiche_resume');
    display_num(resume);
}

/* La vue minifiche-resume */
function init_minifiche_bilan() {
    var bilan = document.getElementById('minifiche_bilan');
    display_num(bilan);
}

function set_minificheinit() {
    var coldroite = document.getElementById('coldroite');
    var off = 0;
    var offbis = 0;

    off = get_offset_top('infosref');
    offbis = get_offset_top('coldroite');

    if ((offbis + 50) > off) {


        /* On corrige le bug d'offset dû au table-cell */
        for (var i = 0; i < nb_child(coldroite); i++) {
            if (coldroite.children[i].id == 'infosref') {
                break;
            }       

            off += get_height(coldroite.children[i]);       
        }
    }
    
    minifiche_posinit = parseInt(off);
}

function init_minifiche() {
    var id = document.getElementById('infoscontent');
    if (id) {
        set_minificheinit();
        if (id) {
            id.style.top = minifiche_posinit + "px";
            if (document.addEventListener) { /* ie 8+ */
                add_event(window, "scroll", function() {scroll_minifiche(id);});
                scroll_minifiche(id);
            }
        }

        init_minifiche_view();
    }
}

function scroll_minifiche(id) {
    var minifiche = document.getElementById('infos');
    var footer = document.getElementById('boxmenufooter');
     if (typeof(footer) == "undefined") {
        return;
    }

    set_minificheinit();
    var scrollY = getY();
    var height = get_height(minifiche);

    if ((scrollY) >= (minifiche_posinit) && is_desktop_device()) {
        if (((scrollY + height + 16) > footer.offsetTop)) {
            id.style.top = footer.offsetTop - (scrollY + height) - 8 +  "px";
        } else {
            id.style.top = 0.2 + "em";
        }

        add_class(id, "floatable");
    } else {
        remove_class(id, "floatable");
    }   
}

/********************************************************/
/*************** VIEW DIR (DISPLAY / HIDE) **************/
/********************************************************/
function display_dir() {
//    var tabledir = document.getElementById('tabledir');
    var elt = document.getElementById('tabledir');
    
    if (elt) {
        for (var i = 0; i < nb_child(elt); i++) {
            display_obj_block(elt.children[i]);
        }

        hide_obj(document.getElementById('displaydir'));
    }     
    /*
    if (tabledir) {
        for (var i = 0; i < nb_child(tabledir); i++) {
            display_obj_block(tabledir.children[i]);
        }

        var elts = tabledir.getElementsByClassName("divdir");
        if (elts) {
            for (var j = 0; j < elts.length; j++) {
                var elt = elts[j]; 
                for (var i = 0; i < nb_child(elt); i++) {
                    display_obj_block(elt.children[i]);
                }
                display_obj_block(elts[j]);
            }

            hide_obj(document.getElementById('displaydir'));
        }     
    }
    */
}

/********************************************************/
/*************** VIEW ETAB (DISPLAY / HIDE) *************/
/********************************************************/
/* La vue etab */
function display_butt_tab(id_tab, id_button) {
    var btn = document.getElementById(id_button);
    var tab = document.getElementById(id_tab);

    if (tab && btn) {
        display_or_hide_table(id_tab);

        if (is_display(tab)) {
            btn.innerHTML = '<i class="icon-minus-1"></i>Masquer';
        } else {
            btn.innerHTML = '<i class="icon-plus-2"></i>En savoir plus';
        }
    } 
}

function display_all_etab() {
    var elt = document.getElementById('etabs');
    var butt = document.getElementById('displayetabfiche');

    if (elt) {
        for (var i = 0; i < nb_child(elt); i++) {
            display_obj_block(elt.children[i]);
        }

        if (butt) {
            hide_obj(butt);
        }
    }
}

/********************************************************/
/************************ VIEW EVENT ********************/
/********************************************************/
function display_event() {
    var tab = document.getElementById('eventtable');
    var index = 0;
    
    if (tab) {
        var list = tab.getElementsByTagName('tr');

        for (var i = 0; i < list.length; i++) {
            if (list[i].id == 'eventall') {
                index = i;
            } else {
                remove_class(list[i], "displaynone");
            }
        }
    } 
    tab.deleteRow(index);
    panrefresh();
}

function display_bodacc() {
    var tab = document.getElementById('bodacctable');
    var index = 0;
    
    if (tab) {
        var list = tab.getElementsByTagName('tr');

        for (var i = 0; i < list.length; i++) {
            if (list[i].id == 'bodaccall') {
                index = i;
            } else {
                remove_class(list[i], "displaynone");
            }
        }
    } 
    tab.deleteRow(index);
    panrefresh();
}


/********************************************************/
/************************ VIEW CARTO ********************/
/********************************************************/
/* On est obligé à cause du paramètre à envoyer */
function init_carto() {
    event_input('pident', "mot de p");
}



function display_all_compteshop() {
    var compte = document.getElementById('compteshoptable');
    var index = 0;

    if (compte) {
        var tab = compte.getElementsByTagName("tr");
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].id == "compteshopplus") {
                index = i;
            }
            remove_class(tab[i], "displaynone");
        }

        compte.deleteRow(index);
        panrefresh();
    }
}



function display_all_eventshop() {
    var eventshop = document.getElementById('eventshoptable');
    var index = 0;

    if (eventshop) {
        var tab = eventshop.getElementsByTagName("tr");
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].id == "eventshopplus") {
                index = i;
            }
            remove_class(tab[i], "displaynone");
        }

        eventshop.deleteRow(index);
        panrefresh();
    }
}



function display_all_bilanshop() {
    var bilan = document.getElementById('bilanshoptable');
    var index = 0;

    if (bilan) {
        var tab = bilan.getElementsByTagName("tr");
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].id == "bilanshopplus") {
                index = i;
            }
            remove_class(tab[i], "displaynone");
        }

        bilan.deleteRow(index);
        panrefresh();
    }
}

/********************************************************/
/***************** VIEW CARTOSHOP VITRINE ***************/
/********************************************************/
/* Initialisation cartoshop */
function init_cartoshop() {
    init_videocarto();
    add_event(window, "resize", function(){init_videocarto()});
}

function init_videocarto() {
    var link = document.getElementById('cartoshoplink');
    var video = document.getElementById('cartoshopvideo');

    if (is_phone_device()) {
        if (link) {
            link.style.display="block";
        }

        if (video) {
            video.style.display="none";
        }
    } else {
        if (link) {
            link.style.display="none";
        }

        if (video) {
            video.style.display="block";
        }
    }
}

/********************************************************/
/******************** SCROLL PANIER  ********************/
/********************************************************/
/* Initialisation panier (gestion du scroll) */
function set_panierinit() {
    var coldroite = document.getElementById('coldroite');
    var off = 0;
    var offbis = 0;

    off = get_offset_top('recbasketref');

    offbis = get_offset_top('coldroite');

    /* On corrige le bug d'offset dû au table-cell */

    if ((offbis + 50) > off) {
        for (var i = 0; i < nb_child(coldroite); i++) {
            if (coldroite.children[i].id == 'recbasketref') {
                break;
            }       

            off += get_height(coldroite.children[i]);       
        } 
    }

    panier_posinit = parseInt(off) + 8;
}

function init_panierajout() {
    var id = document.getElementById('recbasketcontent');
    if (id) {
        set_panierinit();
        if (id) {
            id.style.top = panier_posinit + "px";
            if (document.addEventListener) { /* ie 8+ */
                add_event(window, "scroll", function() {scroll_panier(id);});
                scroll_panier(id);
            }
        }
    }
}



function scroll_panier(id) {
    var pub = document.getElementById('pubcarre2');
    var panier = document.getElementById('panierajout');
    var footer = document.getElementById('boxmenufooter');
    

    if (!footer) {
        return;
    }

    set_panierinit();
    var scrollY = getY();
    var height = get_height(panier);

    if (!height) {
        return;
    }

    if ((scrollY + 16) >= (panier_posinit) && is_desktop_device()) {
        if (((scrollY + height + 32) > footer.offsetTop)) {
            id.style.top = footer.offsetTop - (scrollY + height) - 16 +  "px";
            if (pub) {
                pub.style.top = footer.offsetTop - (scrollY)  + "px";
            }
        } else {
            id.style.top = 1 + "em";
            if (pub) {
                pub.style.top = height + 32 + "px";
            }
        }

        add_class(id, "floatable");
        add_class(pub, "floatable");
    } else {
        remove_class(id, "floatable");
        remove_class(pub, "floatable");
    }   
    
/*
    if ((scrollY + 24) >= (panier_posinit) && is_desktop_device()) {
        if (((scrollY + height + 32) > footer.offsetTop)) {
            //id.style.top = parseInt(footer.offsetTop - height - 16) + "px";
            id.style.top = parseInt(scrollY + 16) + "px";
        } else {
            id.style.top = parseInt(scrollY + 16) + "px";
        }   
    } else {
        id.style.top = panier_posinit + "px";
    }
    */
}

/********************************************************/
/********************* PAGE CONTACT *********************/
/********************************************************/

/********************************************************/
/************************ LISTE *************************/
/********************************************************/
function display_liste() {
    var list = document.getElementById('listehide');
    var butt = document.getElementById('buttliste');

    if (list) {
        list.style.display = "block";
    }

    if (butt) {
        butt.style.display = "none";
    }
}



/********************************************************/
/************************ AIDE SOCIETE ******************/
/********************************************************/
function resize_aidesociete() {
    var helptablet = document.getElementById('aidesocietetablet');
    var helpphone = document.getElementById('aidesocietemobile');
    
    if (is_phone_device()) {
        display_obj_table(helpphone);
        hide_obj(helptablet);
    } else {
        display_obj_table(helptablet);
        hide_obj(helpphone);
    }
}

function display_aidesociete() {
    var buttsearch = document.getElementById('buttsearch');
    var input = document.getElementById('input_search');
    var helptablet = document.getElementById('aidesocietetablet');
    var helpphone = document.getElementById('aidesocietemobile');

    if (is_phone_device()) {
        display_obj_table(helpphone);
        hide_obj(helptablet);
    } else {
        display_obj_table(helptablet);
        hide_obj(helpphone);
    }

    add_class(input, "borderoninput");
    add_class(buttsearch, "borderonbut"); 
    add_focus('input_search');

    add_event(window, "resize", function(){resize_aidesociete();});
}


/********************************************************/
/*********************** FULL FICHE *********************/
/********************************************************/

function init_full() {
    var fullfiche = document.getElementById('fullfiche'); 
    display_num(fullfiche);
}



/********************************************************/
/******************** RECHERCHE AVANCEE *****************/
/********************************************************/

/* Fonction permettant la gestion de fonctionnalité de 
 * la recherche avancée */
function init_recherche() {
    var apeavance = document.getElementById('avanceape');
    var apeentrep = document.getElementById('entrepape');
    var ville = document.getElementById('avanceville'); 

    if (apeavance) {
        add_event(apeavance, "keyup", function() {ape_keyup(apeavance);});
    }

    if (apeentrep) {
        add_event(apeentrep, "keyup", function() {ape_keyup(apeentrep);});
    }

    if (ville) {
        add_event(ville, "keyup", function() {ville_keyup(ville);});
    } 

    /* On gère les focus / blur */
    event_input('avanceadr', "N'indiquez pas rue, avenue, ...");
    event_input('avanceville', "Par exemple Lyon, Paris 16, ...");
}

function submit_recherche() {
    var adr = document.getElementById('avanceadr');
    var ville = document.getElementById('avanceville');

    if (adr.value == "N'indiquez pas rue, avenue, ...") {
        adr.value = "";
    }

    if (ville.value == "Par exemple Lyon, Paris 16, ...") {
        ville.value = "";  
    } 

    submit('recherche_avance');
    return (true);
}

/* Fonction gérant la saisie ape */
function ape_keyup(itemobj) {
    if (!itemobj) {
        return;
    }

    if (itemobj.value.replace(/ /g, "").length > 1) {
        sendrequest_act(itemobj);
    } else {
        cleanup_act();
    }
} 

/* On supprime tout (résultat ape) + on cache les 
 * blocs (div) pour la saisie ape */
function cleanup_act() {
    var res = document.getElementById('actresult');
    var div = document.getElementById('actbloc'); 
    var rec = document.getElementById('actrecherche');
    var auc = document.getElementById('actaucunes');

    hide_obj(div);
    hide_obj(res);
    hide_obj(rec);
    hide_obj(auc);

    for (var i = nb_child(res) - 1; i >= 0; i--) {
        if (res.children[i].id.indexOf("div_act_") != -1) {
            res.removeChild(res.children[i]);
        }
    }

}

/* Envoi de la requête vers /cgi-bin/recape */
function sendrequest_act(itemobj) {
    var req = null;


    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
        if (req.overrideMimeType) {
            req.overrideMimeType("text/xml");
        }      
    } else {
        if (window.ActiveXObject) {
            try {
                req = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                try {
                    req = new ActiveXObject("Microsoft.XMLHTTP");
                } catch(e) {
                    window.alert("Votre browser ne supporte pas AJAX");
                }
            }   
        }
    }
    if (req && req.readyState != 0){
        req.abort();
    }

    req.onreadystatechange = function() {getresponse_act(req, itemobj);};
    req.open("POST", "/cgi-bin/recape", true);
    req.setRequestHeader("Content-type", "application/x-www-from-urlencode;");
    req.send("q=" + escape(itemobj.value)); 
}

/* Recupération du résultat de recape */
function getresponse_act(req, itemobj) {
    if (req.readyState != 4) {
        return;
    }

    if (req.status != 200) {
        cleanup_act();
        return;
    }

    var div = document.getElementById('actbloc'); 
    var res = document.getElementById('actresult');
    var rec = document.getElementById('actrecherche');
    var auc = document.getElementById('actaucunes');

    var sres = req.responseText;
    if (sres == "") {
        cleanup_act();
        display_obj_block(div);
        display_obj_block(auc);
    } else if (sres != "" && sres.indexOf("Internal Server Error") == -1) {
        var lines = sres.split("\n");

        cleanup_act();
        display_obj_block(div);
        display_obj_block(res);

        for (var i = 0; i < lines.length; i++) {
            if (lines[i] != '') {
                var infos = lines[i].split("\t");
                var template = document.getElementById('actresult_item').cloneNode(true);
                var id = "act_" + i
                    var divid = "div_" + id;
                template.id = divid;

                var disp = template.getElementsByTagName('p')[0];
                disp.id = "act_content_" + i; 
                disp.setAttribute("naf", infos[0]);
                disp.setAttribute("text", infos[1]);

                if (i % 2 == 0) {
                    disp.style.backgroundColor = "#f1f1f1";
                }

                var code = disp.getElementsByTagName('span')[0];
                var text = disp.getElementsByTagName('span')[1];

                code.innerHTML = infos[0];
                text.innerHTML = infos[1];

                add_event(disp, "click", function(){onclick_act(this, itemobj);});

                res.appendChild(template);
                display_obj_block(template); 
            }
        }
    }
}

/* Fonction permettant de setter le code naf dans le champ */
function onclick_act(elem, itemobj) {
    itemobj.value = elem.getAttribute("naf");
    cleanup_act();
}

/* Fonction gérant la saisie commune */
function ville_keyup(itemobj) {
    if (!itemobj) {
        return;
    }

    if (itemobj.value.replace(/ /g, "").length > 1) {
        sendrequest_ville(itemobj);
    } else {
        cleanup_ville();
    }
} 

/* Permet de tout clean (resultat) + cacher les zones pour ville */
function cleanup_ville() {
    var div = document.getElementById('villebloc');
    var res = document.getElementById('villeresult');
    var rec = document.getElementById('villerecherche');
    var auc = document.getElementById('villeaucunes');

    hide_obj(div);
    hide_obj(res);
    hide_obj(rec);
    hide_obj(auc);

    for (var i = nb_child(res) - 1; i >= 0; i--) {
        if (res.children[i].id.indexOf("div_ville_") != -1) {
            res.removeChild(res.children[i]);
        }
    }

}

/* Envoi de la requête vers /cgi-bin/villes */
function sendrequest_ville(itemobj) {
    var req = null;


    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
        if (req.overrideMimeType) {
            req.overrideMimeType("text/xml");
        }      
    } else {
        if (window.ActiveXObject) {
            try {
                req = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                try {
                    req = new ActiveXObject("Microsoft.XMLHTTP");
                } catch(e) {
                    window.alert("Votre browser ne supporte pas AJAX");
                }
            }   
        }
    }
    if (req && req.readyState != 0){
        req.abort();
    }

    req.onreadystatechange = function() {getresponse_ville(req, itemobj);};
    req.open("POST", "/cgi-bin/villes", true);
    req.setRequestHeader("Content-type", "application/x-www-from-urlencode;");
    req.send("q=" + escape(itemobj.value)); 
}

/* Retour de la requête + construction de l'affichage */
function getresponse_ville(req, itemobj) {
    if (req.readyState != 4) {
        return;
    }

    if (req.status != 200) {
        cleanup_ville();
        return;
    }

    var div = document.getElementById('villebloc');
    var res = document.getElementById('villeresult');
    var rec = document.getElementById('villerecherche');
    var auc = document.getElementById('villeaucunes');

    var sres = req.responseText;
    if (sres == "") {
        cleanup_ville();
        display_obj_block(div);
        display_obj_block(auc);
    } else if (sres != "" && sres.indexOf("Internal Server Error") == -1) {
        var lines = sres.split("\n");

        cleanup_ville();
        display_obj_block(div);
        display_obj_block(res);

        for (var i = 0; i < lines.length; i++) {
            if (lines[i] != '') {
                var infos = lines[i].split("\t");
                var template = document.getElementById('villeresult_item').cloneNode(true);

                var id = "ville_" + i
                    var divid = "div_" + id;
                template.id = divid;

                var disp = template.getElementsByTagName('p')[0];
                disp.id = "ville_content_" + i; 
                disp.setAttribute("text", infos[0]);
                disp.setAttribute("cp", infos[1]);

                if (i % 2 == 0) {
                    disp.style.backgroundColor = "#f1f1f1";
                }

                var code = disp.getElementsByTagName('span')[0];
                var text = disp.getElementsByTagName('span')[1];
                code.innerHTML = infos[1];
                text.innerHTML = infos[0];

                add_event(disp, "click", function(){onclick_ville(this, itemobj);});

                res.appendChild(template);
                display_obj_block(template); 
            }
        }
    }
}

/* On sette lors d'un clic sur un résultat la réponse dans le champ */
function onclick_ville(elem, itemobj) {
    itemobj.value = elem.getAttribute("text");
    cleanup_ville();
}


/********************************************************/
/******************** Gestion du panier *****************/
/********************************************************/
var addbasketr = '';

function init_addbasket() {
    if (document.getElementById('recbasket')) {
        window.onfocus = panrefresh;
        panrefresh();
    }
}

/* Gestion de l'event click pour un ajout / suppression panier */
function pc(elem) {
    var i = 0;
    var j = 0;
    var p = 0;

    var prodcat = elem.getAttribute("prodcat");
    var zone = elem.getAttribute("prodzone");
    var prodprice = elem.getAttribute("prodprice");

    if (elem) {
        var check = document.getElementById("check" + elem.id);
        if (check) {
            if (check.getAttribute("state") == "1") {
                if (document.getElementById(prod[elem.id])) {
                    if (prodcat != null && zone != null && prodprice != null) {
                        ga('send', 'event', zone, 'Retrait', prodcat, parseInt(prodprice));
                    }
                    rembasket(prod[elem.id]);
                    addbasketr = '';
                } else {
                    alert("Ce produit est déjà inclu dans un Pack Essentiel");
                }
            } else {
                var nbprod = parseInt(document.getElementById('nbprod').innerHTML);
                if ((nbprod) < MAX_BASKET) {
                    if (prodcat != null && zone != null && prodprice != null) {
                        ga('send', 'event', zone, 'Ajout', prodcat, parseInt(prodprice));
                    }
                    addbasket(prod[elem.id]);
                } else {
                    alert("Impossible de rajouter un produit. Nombre maximum atteint.");
                    return;
                }
            } 
        }
    }
}


/* Gestion de l'event click pour un ajout / suppression panier + redirect vers vitrine */
function pcr(elem, redir) {

    addbasketr = redir;
    pc(elem);

    return (true);
}



/* Suppresion d'un element */
function rembasket(post) {
    sendrequestbasket("/cgi-bin/addbasket-new", "delp=" + post);
}

/* Ajout d'un element */
function addbasket(post) {
    sendrequestbasket("/cgi-bin/addbasket-new", "prod=" + post);
}

function rmbask(elem, rm) {
    if (elem) {
        var prodcat = elem.getAttribute("prodcat");
        var zone = elem.getAttribute("prodzone");
        var prodprice = elem.getAttribute("prodprice");

        if (prodcat && zone && prodprice) {
            ga('send', 'event', zone, 'Retrait', prodcat, parseInt(prodprice));
        }
    }
    
    if (rm == true) {
        rembasket(elem.id);
    }
}

/* Fonction supprimant tous les paniers */
function delbasketall() {
    if (confirm('Supprimer tous les produits du panier ?')) {
        delbasket('all');
    }
}

/* Function appelé lors d'un clic sur la croix */
function delbasketitem(itemobj) {
    rmbask(itemobj.parentNode, true);
}

/* Suppression panier */
function delbasket(post) {
    var produits = null;

    if (document.getElementsByClassName) {
        produits = document.getElementsByClassName("produittag");
    } else {
        produits = getElementsByClass("produittag", document.getElementById('recbasket'), "TR");
    }

    if (produits) {
        for (var index = 0; index < produits.length; index++) {
            rmbask(produits[index], false);
        }
    }

    sendrequestbasket("/cgi-bin/addbasket-new", "tdel=" + post);
}

/* Envoi de la requete addbasket */
function sendrequestbasket(url, post) {
    var i = 0;
    
    var unix = Math.round(+new Date());
    post += "&unix=" + unix;

    for (i = 0; i < ri; i++) {
        if (!reqbasket[i] || reqbasket[i].readyState <= 0) {
            reqbasket[i] = null;
            break;
        }
    }

    if (i == ri) {
        ri++;
    }

    if (ri > maxri) {
        if (reqbasket[0]) {
            reqbasket[0].abort();
        }
        reqbasket[0] = null;
    }

    if (window.XMLHttpRequest) {
        reqbasket[i] = new XMLHttpRequest();
        if (reqbasket[i].overrideMimeType) {
            reqbasket[i].overrideMimeType("text/html; charset=ISO-8859-1;");
        }
    } else {
        if (window.ActiveXObject) {
            try {
                reqbasket[i] = new ActiveXObject("Msxml2.XMLHTTP"); 
            } catch(e) {
                try {
                    reqbasket[i] = new ActiveXObject("Microsoft.XMLHTTP");
                } catch(e) {
                    alert("Votre browser est incompatible avec AJAX");
                    return;
                }
            }
        }
    }

    reqpost[i] = post;
    reqbasket[i].onreadystatechange = getresponsebasket;
    reqbasket[i].open("POST", url, true);
    reqbasket[i].setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
    reqbasket[i].setRequestHeader("Cache-Control", "max-age=0");
    reqbasket[i].send(post);
}

/* Fonction de la reponse */
function getresponsebasket() {
    var sres = 0;
    var i = 0;
    var res = 0;

    for (i = 0; i < ri; i++) {
        sres = getresponse(reqbasket[i]);
        if (sres != null) {
            break;
        }
    }

    if (i >= ri) {
        return;
    }

    rec = document.getElementById('recbasket');
    if (rec) {
        rec.innerHTML = sres;
        var nbtot = document.getElementById('nbprod');
        var pub = document.getElementById('pubcarre2');
        var pubmobile = document.getElementById('pubmobile_media');
        var index = document.location.href.indexOf("societe.com/actualites/");
        var basketbutton = document.getElementById('basket_content');

        if (nbtot && parseInt(nbtot.innerHTML) > 0) {
            if (basketbutton) {
                basketbutton.innerHTML = parseInt(nbtot.innerHTML) + " Art.";
            }
        } else {
            if (basketbutton) {
                basketbutton.innerHTML = "Panier";
            }
        }

        if (pub) {
            if ((nbtot && parseInt(nbtot.innerHTML) > 0) || !is_desktop_device()) {
                pub.style.visibility = "hidden";
                if (pubmobile) {
                    pubmobile.style.visibility = "hidden";
                }
                
                if (index != -1) {
                    remove_class(document.getElementById('recbasket'), "displaynone"); 
                }
                
            }  else {
                pub.style.visibility = "visible";
                if (pubmobile) {
                    pubmobile.style.visibility = "visible";
                }
                
                if (index != -1) {
                    add_class(document.getElementById('recbasket'), "displaynone"); 
                }

                var deno = document.getElementById('identite_deno');
                var siren = document.getElementById('identite-siren');

                var obj = document.getElementById('addbasketcommander');
                add_class(obj, "displaynone");                    

                obj = document.getElementById('addbasketcommanderempty');
                remove_class(obj, "displaynone");

                if (siren && deno) {
                    obj = document.getElementById('addbasketsiren');
                    var link = document.createElement("a");
                    var text = document.createTextNode("Voir tous les Documents Officiels disponibles sur l'entreprise " + deno.innerHTML.replace("&amp;", "&"));
                    link.appendChild(text);
                    link.setAttribute("href", "http://www.societe.com/cgi-bin/vitrine?rncs=" + siren.innerHTML);
                    link.setAttribute("class", "lien");
                    obj.appendChild(link);
                    remove_class(obj, "displaynone");

                    link = document.getElementById('addbasketcommanderemptylink');
                    link.setAttribute("href", "http://www.societe.com/cgi-bin/vitrine?rncs=" + siren.innerHTML);
                } else {
                    obj = document.getElementById('addbasketnosiren');
                    remove_class(obj, "displaynone");
                 }
            }
        }
        adnext_cssmove();
    }

    reqbasket[i] = null;
    if (i == (ri - 1)) {
        ri--;
    }

    syncpan();
    
    if (addbasketr.length != 0) {
        window.location = addbasketr;
        return (true);
    }
    //scroll_panier(rec);
}

/* Verifie l'état de la réponse */
function getresponse(req) {
    if (req && req.readyState == 4) {
        return (req.responseText);
    }
    return (null);
}

/* Rafraichit le panier. Appelée en fin de cgi */
function panrefresh() {
    sendrequestbasket("/cgi-bin/addbasket-new", "disp=pan");
}

/* On synchronise le panier entre les packs et les items */
function syncpan() {  
    var fullpack = 0;

    for (var i = 0; i < prod.length; i++) {
        if (prod[i]) {
            var produit = document.getElementById(i);
            if (produit) {
                hl(produit, '');
            }
            if (document.getElementById(prod[i])) {
                updateprodnumdisp(i, 0);
            } else {
                updateprodnumdisp(i, 1);
            }
        }
    }

    /* Constituer des packs automatiquement en fonction des produits selectionnés */
    for (var i = 0; i < pack.length; i++) {
        if (pack[i]) {
            for (var j = 0; j < pack[i].length; j++) {
                if (!document.getElementById(prod[i])) {
                    fullpack = 1;
                    for (var k =  0; k < pack[i].length; k++) {
                        if (document.getElementById("check" + pack[i][k]).getAttribute("state") == "0") {
                            fullpack = 0;
                            break;
                        }
                    }

                    if (fullpack) {
                        addbasket(prod[i]);
                    }
                }
            }
        }
    }   

    /* Enlever les produits selectionnées qui sont déjà dans un pack selectionnés */
    for (var i = 0; i < prod.length; i++) {
        /* Produit dans panier */
        if (prod[i] && document.getElementById(prod[i])) {
            /* Produit dans pack */
            if (pack[i]) {
                for (var j = 0; j < pack[i].length; j++) {
                    p = prod[pack[i][j]];
                    if (p) {
                        for (var k = 0; k < prod.length; k++) {
                            if (prod[k] == p) {
                                if (document.getElementById(prod[k])) {
                                    rembasket(prod[k]);
                                } else {
                                    updateprodnumdisp(k, 0);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /* Passe-t-on d'un panier vide à un panier plein ou vice-versa */
    if (oldnbprod != nbprod && (oldnbprod == 0 || nbprod == 0)) {
        imgpanier = document.getElementById("imgpanier");
        if (imgpanier) {
            imgpanier.src = "/cgi-bin/dispbask?dummy=" + nbprod;
        }
    }
    orldnbprod = nbprod;
    if (nbprod > 15) {
        buttonrepeat = document.getElementById("buttonrepeat");
        if (buttonrepeat) {
            buttonrepeat.style.display = "inline";
        }
    }
    
    init_panier_prod(); 
}

function hl(t, c) {
    var cn = null;
    var pn = null;
    var pcn = null;
    var i = 0;

    if (t.tagName == "TD") {
        cn = t.parentNode.childNodes;    
    } else {
        cn = t.childNodes;
    }

    for (i = 0; i < cn.length - 2; i++) {
        if (cn[i].tagName == "TD" && cn[i].rowSpan < 2 && cn[i].className != "nohl") {
            cn[i].style.backgroundColor = c;
        }
    }

    if (prod[t.id]) {
        pn = document.getElementById(prod[t.id]);
        if (pn) {
            pcn = pn.childNodes;
            for (i = 0; i < pcn.lenght - 2; i++) {
                if (pcn[i].tagName == "TD") {
                    pcn[i].style.backgroundColor = c;
                }
            }
        }
    }
}

function updateproddisp(post, trig) {
    var prodnum = prod.indexOf(post);
    updateprodnumdisp(prodnum, trig);    
}

function updateprodnumdisp(prodnum, trig) {
    /* trig : 0 si produit dans panier */
    /* trig : 1 si produit pas dans panier */
    /* trig : -1 pour se fier au 'checkbox' du produit et le passer à son état opposé */

    var produit = document.getElementById("check" + prodnum);
    if (!produit) {
        return;
    }

    var mcheck = true;
    if (trig == 1) {
        mcheck = true;
    } else if (trig == 0) {
        mcheck = false;
    } else {
        if (produit.getAttribute("state") == "0") {
            mcheck = false;
        } else {
            mcheck = true;
        }
    }

    var image = null;
    if (mcheck == false) {
        produit.setAttribute("state", "1");
        image = document.getElementById("pn" + prodnum).parentNode;
        image.style.backgroundColor = "#4FC90E";
    } else {
        produit.setAttribute("state", "0");
        image = document.getElementById("pn" + prodnum).parentNode;

        var tab = document.getElementById(prodnum.toString()).parentNode;
        var lines = tab.getElementsByTagName("tr");
        for (var j = 0; j < lines.length; j++) {
            if (lines[j].id == prodnum.toString()) {
                if (is_phone_device() && lines[j].parentNode.className == "no-more-tables") {
                    if (j != 0) {
                        image.style.backgroundColor = "#fff";
                    }
                } else {
                    if (j % 2 == 0) {
                        image.style.backgroundColor = "#f1f1f1";
                    } else {
                        image.style.backgroundColor = "#fff";
                    }
                }
            }
        } 
    }
}   


/********************************************************/
/******************** VIEW_PUBLICATION ******************/
/********************************************************/
function retract_animation() {
    var summary = document.getElementById('summary');
    if (!summary) {
        return;
    }

    var offset = get_height(summary);
    if (offset > 0) {
        offset -= 20;

        if (offset < 0) {
            hide_obj(summary);
            offset = 0;
        }

        summary.style.height = offset + "px";
        setTimeout(function(){retract_animation()}, 5);
    }
}  

function display_iframe() {
    var input = document.getElementById('partner_form_input');
    var sep = document.getElementById('partner_form_sep');
    var iframe = document.getElementById('partner_form_iframe');

    hide_obj(input);
    hide_obj(sep);
    display_obj_block(iframe);
    
    /* Gestion de l'animation */
    setTimeout(function(){retract_animation();}, 5);
}




/* ======================================= Liste liens resume ==================================== */

function parentHasId(node, idlist) {
    if (!node) {
        return(null);
    }

    if (node.id) {
        for (var i = 0 ; i < idlist.length; i++) {
            if (node.id == idlist[i]) {
                return(node.id);
            }
        }
    } else {
        return parentHasId(node.parentNode, idlist);
    }
}


function Onglet (bar, id, open, close) {
    var self = this;
    this.bar = bar;
    this.userOpen = open;
    this.userClose = close;
    this.open = persoOpen;

    this.close = persoClose;
    this.closed = true;

    add_event(document.getElementById(id), "click", function(event) { 
        var e = event || window.event; 
        var target = e.target || e.srcElement; 
        self.bar.manageclick(parentHasId(target, ['buttsurveiller', 'contactAnnuaire', 'identitetel'])); 
    });

    function persoOpen() {
        this.closed = false;
        this.userOpen();
    }

    function persoClose() {
        this.closed = true;
        this.userClose();
    }
}


function OngletBar() {
    this.onglets = {};

    this.addOnglet = addOnglet;
    this.manageclick = manageclick;

    function addOnglet (id, open, close) {
        var onglet = new Onglet(this, id, open, close);
        this.onglets[id] = onglet;
    }

//    function manageclick(event) {
    function manageclick(id) {
//        var id = event.currentTarget.id || event.srcElement.id;
        if (id == null) {
            return;
        }

        var ouverture = this.onglets[id].closed;

        for (var e in this.onglets) {
            var onglet = this.onglets[e];
            if (e == id) {
                if (ouverture == true) {
                    onglet.open();
                } else {
                    onglet.close();
                }
            } else {
                if (ouverture == true) {
                    onglet.close();
                }
            }
        }
    }
}

var bar =  bar || new OngletBar();

function init_resume_onglets() {
    bar = bar || new OngletBar();

    bar.addOnglet('buttsurveiller', openSurveillance, closeSurveillance);
    bar.addOnglet('contactAnnuaire', displayContactAnnuaire, asyncCloseContactCompany);
    bar.addOnglet('identitetel', openAboutementOnglet, closeAboutementOnglet);
}


//var globAboutementTelOpen = 0;



function getXhr()
{
    if(window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if(window.ActiveXObject) {
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
        catch(e) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
        catch(e) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP"); }
        catch(e) {}
        try { return new ActiveXObject("Microsoft.XMLHTTP"); }
        catch(e) {}
    }
    return null;
}


function getXhrCors() {
    var ret = null;
    var xhr = new XMLHttpRequest();


    if ("withCredentials" in xhr) {
        ret = xhr;
    }

    return ret;
}


/* ======================================= Gestion compte + surveillance  ======================== */

function redirectSurveillance () {
    var siren = document.getElementById('identite-siren').innerHTML;
    if (typeof(siren) == "string") {
        window.location = "https://paiement.societe.com/cgi-bin/veille-new?act=insert&type=0&param=" + siren;
    }
}


opcXhr = getXhrCors();

function SocOpenConnectWrapper() {
    this.xhr = opcXhr;

    this.onload = function() {
        infos_resume.unlock();
        if (this.responseText == 1) {
            infos_resume.logged();
        } else {
            infos_resume.get_login();
        }
    }

    this.onerror = function() {
        redirectSurveillance();
    }

    this.send = function() {
        if (this.xhr == null) {
            this.onerror();
        }

        infos_resume.lock();
        this.xhr.open("POST", "https://paiement.societe.com/cgi-bin/isxed", true);
        this.xhr.socXhrWrapper = this;
        this.xhr.withCredentials = true; 
        this.xhr.onload = this.onload;
        this.xhr.onerror = this.onerror;
        this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
        this.xhr.send();

        return "Request processing...";
    }
}

cliXhr = getXhrCors();

function SocConnectWrapper() {
    this.xhr = cliXhr;

    this.onload = function() {
        infos_resume.unlock();
        
        try {
            var response = JSON.parse(this.responseText);
        } catch (e) {
            redirectSurveillance();
        }

        if (typeof(response.Exists) != "undefined") {
            if (response.Exists == true) {
                infos_resume.get_pass();
            } else {
                infos_resume.create();
            }
        } else if (typeof(response.Connected) != "undefined") {
            if (response.Connected == true) {
                infos_resume.logged();
            } else {
                if (response.Confirm == true) {
                    infos_resume.pass_resend();
                } else {
                    infos_resume.inactiv();
                }
            }
        }
    }

    this.onerror = function() {
        redirectSurveillance();
    }

    this.send = function(email, pass) {
        if (this.xhr == null) {
            this.onerror();
        }

        infos_resume.lock();
        this.xhr.open("POST", "https://paiement.societe.com/cgi-bin/authenticate", true);
        this.xhr.socXhrWrapper = this;
        this.xhr.withCredentials = true; 
        this.xhr.onload = this.onload;
        this.xhr.onerror = this.onerror;
        this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
        if (pass == "") {
            this.xhr.send("email=" + email);
        } else {
            this.xhr.send("email=" + email + "&pass=" + pass);
        }
        return "Request processing...";
    }
}



survXhr = getXhrCors();

function SocSurvWrapper() {
    this.xhr = survXhr;

    this.onload = function() {
    } 

    this.onerror = function() {
    }

    this.send = function(siren) {
        if (this.xhr == null) {
            redirectSurveillance();
        }

        this.xhr.open("GET", "https://paiement.societe.com/cgi-bin/veille-new?act=insert&type=0&param=" + siren, true);
        this.xhr.socXhrWrapper = this;
        this.xhr.onerror = this.onerror;
        this.xhr.onload = this.onload;
        this.xhr.withCredentials = true;
        this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
        this.xhr.send();
        return "Request processing...";
    }
}


function Client() {
    this.setEmail = setEmail;
    this.xhrOpenConnectWrapper = new SocOpenConnectWrapper();
    this.xhrConnectWrapper = new SocConnectWrapper();
    this.xhrSurvWrapper = new SocSurvWrapper();
    this.email = undefined;
    this.cors = (this.xhrConnectWrapper.xhr != null) ? true : false;


    function setEmail(email) {
        this.email = email;
        var client_informations = document.getElementById('client_informations');

        var list = get_elementsbyclassname(client_informations, 'client_infos_email');
//        for (var e in list) {
        for (var i = 0; i < list.length; i++) {
            list[i].innerHTML = email;
        }
    }
}

client = new Client();

/**/
//var _client_close = 0;
//var _client_open = 1;
var _client_get_login = 2;
var _client_login_invalid = 3;
var _client_login_valid = 4;
var _client_get_pass = 5;
var _client_create = 6;
var _client_pass_resend = 7;
var _client_inactiv = 8;
var _client_logged = 9;


function show_list(list) {
    if (typeof(list) != typeof({})) {
        return;
    }

    for(var i in list) {
        remove_class(list[i], "displaynone");
    }

    adnext_cssmove();
}


function hide_list(list) {
    if (typeof(list) != typeof({})) {
        return;
    }

    for(var i in list) {
        add_class(list[i], "displaynone");
    }

    adnext_cssmove();
}

function InfosClient() {
    this.state = _client_get_login;
    this.closed = true;
    this.setup = setup;

    this.open = open;
    this.close = close;

    this.get_login = get_login;
    this.login_invalid = login_invalid;
    this.login_valid = login_valid;
    this.get_pass = get_pass;
    this.create = create;
    this.pass_resend = pass_resend;
    this.inactiv = inactiv;
    this.logged = logged;

    this.update = update;
    this.updatestate = updatestate;

    this.lock = lock;
    this.unlock = unlock;

    this.id = undefined;
    this.inputemail = undefined;
    this.inputpass = undefined;

    this.elements = {};
    this.elements.blocpass = undefined;
    this.elements.bloccomplete = undefined;
    this.elements.bloclogin = undefined;
    this.elements.blocsentmail = undefined;
    this.elements.blocinactifmail = undefined;
    this.elements.blocvoirveille = undefined;
    this.elements.blocfreshlog = undefined;
    this.elements.emailinvalid = undefined;

    this.show_get_login = {};
    this.show_login_invalid = {};
    this.show_login_valid = {};
    this.show_get_pass = {};
    this.show_create = {};
    this.show_pass_resend = {};
    this.show_inactiv = {};
    this.show_logged = {};


    function setup (id) {
        this.id = id;
        
        this.inputemail = document.getElementById('auth-email');
        this.inputpass = document.getElementById('auth-pass');
        this.buttonvalid = document.getElementById('identite_valid_mail');

        this.gifrequest = document.getElementById('request-progress');

        this.elements.blocpass = document.getElementById('client_infos_password');
        this.elements.bloccomplete_m = document.getElementById('client_complete');
        this.elements.bloccomplete_nm = document.getElementById('client_complete_no_mail');
        this.elements.bloccomplete = document.getElementById((client.email != undefined) ? 'client_complete' : 'client_complete_no_mail');
        this.elements.bloclogin = document.getElementById('client_infos_login');
        this.elements.blocsentmail = document.getElementById('client_infos_sentmail');
        this.elements.blocinactifmail = document.getElementById('client_infos_inactifmail');
        this.elements.blocvoirveille = document.getElementById('client_infos_voirveille');
        this.elements.blocfreshlog = document.getElementById('client_infos_freshlog');
        this.elements.emailinvalid = document.getElementById('email_invalid');

        this.show_get_login.bloclogin = this.elements.bloclogin;

        this.show_login_invalid.bloclogin = this.elements.bloclogin;
        this.show_login_invalid.emailinvalid = this.elements.emailinvalid;

        this.show_login_valid.bloclogin = this.elements.bloclogin;

        this.show_get_pass.bloclogin = this.elements.bloclogin;
        this.show_get_pass.blocpass = this.elements.blocpass;

        this.show_pass_resend.bloclogin = this.elements.bloclogin;
        this.show_pass_resend.blocpass = this.elements.blocpass;
        this.show_pass_resend.blocsentmail = this.elements.blocsentmail;

        this.show_create.blocfreshlog = this.elements.blocfreshlog;
        this.show_create.blocvoirveille = this.elements.blocvoirveille;

        this.show_logged.bloccomplete = this.elements.bloccomplete;
        this.show_logged.blocvoirveille = this.elements.blocvoirveille;

        this.show_inactiv.bloclogin = this.elements.bloclogin;
        this.show_inactiv.blocpass = this.elements.blocpass;
        this.show_inactiv.blocinactifmail = this.elements.blocinactifmail;
    }


    function open() {
        if (this.id == undefined) {
            return;
        }
        
        hide_list(this.elements);
        remove_class(this.id, "displaynone");
        this.closed = false;
        client.xhrOpenConnectWrapper.send();
    }

    function close() {
        if (this.id == undefined) {
            return;
        }

        add_class(this.id, "displaynone");
        this.closed = true;
    }

    function get_login() {
        if (this.id == undefined) {
            return;
        }
        
        this.inputpass.value = "";

        hide_list(this.elements);
        show_list(this.show_get_login);

        this.state = _client_get_login;
    }

    function login_invalid () {
        if (this.id == undefined) {
            return;
        }

        hide_list(this.elements);
        show_list(this.show_login_invalid);

        this.state = _client_login_invalid;
    }
 
    function login_valid () {
        if (this.id == undefined) {
            return;
        }
        var email = this.inputemail.value;
        var pass = this.inputpass.value;

        hide_list(this.elements);
        show_list(this.show_login_valid);

        client.setEmail(email);
        client.xhrConnectWrapper.send(email, pass);

        this.state = _client_login_valid;
    }

    function get_pass() {
        if (this.id == undefined) {
            return;
        }

        hide_list(this.elements);
        show_list(this.show_get_pass);

        this.inputpass.focus();

        this.state = _client_get_pass;
    }

    function create() {
        if (this.id == undefined) {
            return;
        }

        var siren = document.getElementById('identite-siren').innerHTML.trim();
        
        hide_list(this.elements);
        show_list(this.show_create);

        client.xhrSurvWrapper.send(siren);

        this.state = _client_create;
    }

    function inactiv() {
        if (this.id == undefined) {
            return;
        }

        hide_list(this.elements);
        show_list(this.show_inactiv);

        this.inputemail.value = "";
        this.inputpass.value = "";
        
        this.state = _client_inactiv;
    }

    function pass_resend() {
        if (this.id == undefined) {
            return;
        }

        hide_list(this.elements);
        show_list(this.show_pass_resend);
        
        this.state = _client_pass_resend;
    }

    function logged() {
        if (this.id == undefined) {
            return;
        }

        var siren = document.getElementById('identite-siren').innerHTML.trim();

        hide_list(this.elements);
        show_list(this.show_logged);

        client.xhrSurvWrapper.send(siren);
        
        this.state = _client_logged;
    }

    function updatestate() {
        if (client.isConnected() == true && this.state != _client_logged) {
            update(_client_logged);
        } else {
            if (this.state == _client_logged) {
                update(_client_get_login);
            }
        }
    }

    function update(state) {
        if (this.id == undefined) {
            return;
        }

        switch (state) {
            case _client_get_login: this.getlogin(); break;
            case _client_get_pass: this.getpass(); break;
            case _client_create: this.create(); break;
            case _client_pass_resend: this.pass_resend(); break;
            case _client_inactiv: this.inactiv(); break;
            default: break;
        }
    }

    function lock() {
        if (this.id == undefined) {
            return;
        }

        remove_class(this.gifrequest, "displaynone");
        remove_event(this.buttonvalid, "click", click_valid_infos);
        remove_event(this.inputemail, "keyup", press_valid_infos);
        remove_event(this.inputpass, "keyup", press_valid_infos);
    }
    
    function unlock() {
        if (this.id == undefined) {
            return;
        }
        add_class(this.gifrequest, "displaynone");
        add_event(this.buttonvalid, "click", click_valid_infos);
        add_event(this.inputemail, "keyup", press_valid_infos);
        add_event(this.inputpass, "keyup", press_valid_infos);
    }
}

function press_valid_infos (event) {
    get_enter_char(event, click_valid_infos);
}

infos_resume = new InfosClient();
/**/


function valid_email(email) {
    var valid = false;
    var regex = "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+\\b";


    if (typeof(email) != "string" || email == '') {
        return(false);
    }

    regex = new RegExp(regex, '');
    
    valid = regex.test(email);

    return valid;
}



function click_valid_infos () {
    var email = document.getElementById('auth-email').value;

    if (valid_email(email) == true) {
        infos_resume.login_valid();
    } else {
        infos_resume.login_invalid();
    }
}


function get_enter_char(ev, fct) {
    if (ev.keyCode == 13) {
        fct();
    }
}



function click_lost_pass() {
    var email = document.getElementById('auth-email').value;
    var champPass = document.getElementById('auth-pass');

    champPass.value = '';
    client.xhrConnectWrapper.send(email, '!');
}


function closeSurveillance() {
    infos_resume.close();
}

function openSurveillance() {
    if (client.cors == true) {
        infos_resume.setup(client_informations);
        infos_resume.open();
    } else {
        redirectSurveillance();
    }
}

function init_client_informations() {
    var client_informations = document.getElementById('client_informations');
    var deno = document.getElementById('identite_deno').innerHTML.trim();
    var validMail = document.getElementById('identite_valid_mail');
    var champMail = document.getElementById('auth-email');
    var champPass = document.getElementById('auth-pass');
    var lostPass = document.getElementById('lost-pass');
    var clickclose = document.getElementById('client_infos_close');

    var list = get_elementsbyclassname(client_informations, 'client_infos_deno');
    for (var i = 0; i < list.length; i++) {
        list[i].innerHTML = deno;
    }


    add_event(lostPass, "click", click_lost_pass);
    add_event(clickclose, "click", function () {bar.manageclick('buttsurveiller');});
    add_event(validMail, "click", click_valid_infos);
    add_event(champMail, "keyup", press_valid_infos);
    add_event(champPass, "keyup", press_valid_infos);
}


/* ======================================= Aboutementu tel + tva ================================= */

function asyncOpenAboutementTel() {
    var id = document.getElementById('identitetel');
    var idinfos = document.getElementById('aboutement');

    add_class(id, "identitebuttinactive");
    remove_class(id, "identitebutt");
    remove_class(idinfos, "displaynone");
}

function asyncCloseAboutementTel() {
    var idlink = document.getElementById('identitetel');
    var idinfos = document.getElementById('aboutement');

    remove_class(idlink, "identitebuttinactive");
    add_class(idlink, "identitebutt");
    add_class(idinfos, "displaynone");
}


/**
 * function getXhr()
 *
 * Retourne un objet pour l'envoi et la reception de donnees de façon asynchrone.
 */


function desactive_number(obj) {
    var telab = document.getElementById('telab');
    var price_details  = document.getElementById('price_details');

    if (obj && obj.timeout != undefined) {
        clearTimeout(obj.timeout);
        obj.timeout = undefined;
    }

    if (telab) {
        add_class(telab, "displaynone");
        add_class(price_details, "displaynone");
    }

    asyncCloseAboutementTel();

}

function desactive_number_rensjur(obj) {
    var telab = document.getElementById('telab-rensjur');
    var price_details  = document.getElementById('price_details-rensjur');
    var aboutement = document.getElementById('aboutement-rensjur');
    var link = document.getElementById('identiteatel-rensjur');

    if (obj && obj.timeout != undefined) {
        clearTimeout(obj.timeout);
        obj.timeout = undefined;
    }

    if (telab) {
        add_class(telab, "displaynone");
        add_class(price_details, "displaynone");
    }

    add_class(aboutement, "displaynone");
    remove_class(link, "displaynone");


//    asyncCloseAboutementTel();

}

//function desactive_tva_number() {
function hideNumberTVA() {

    var tvainfos = document.getElementById('aboutement-tva-informations');
    var tvaclick = document.getElementById('aboutement-tva-click');
    var tvatexte = document.getElementById('aboutement-tva-texte');
    var tvanumeroinfo = document.getElementById('aboutement-tva-numero-info');
    var tvanumero = document.getElementById('aboutement-tva-numero');
    var tvatarif = document.getElementById('aboutement-tva-tarif');
    var tvacontact = document.getElementById('aboutement-tva-contact');
    var tvaerreur = document.getElementById('aboutement-tva-erreur');

    add_class(tvaerreur, "displaynone");
    remove_class(tvaclick, "displaynone");
    add_class(tvatexte, "displaynone");
    add_class(tvanumeroinfo, "displaynone");
    add_class(tvanumero, "displaynone");
//    add_class(tvatarif, "displaynone");
    tvatarif.style.display = "none";
    add_class(tvacontact, "displaynone");
    add_class(tvainfos, "displaynone");

    ga('send', 'event', 'Aboutement TVA', 'non dispo / err');
}


tvaXhr = getXhr();


function tvaWrapper() {
    this.xhr = tvaXhr;

    this.onload = function() {
        var tvainfos = document.getElementById('aboutement-tva-informations');
        var tvaclick = document.getElementById('aboutement-tva-click');
        var tvatexte = document.getElementById('aboutement-tva-texte');
        var tvanumeroinfo = document.getElementById('aboutement-tva-numero-info');
        var tvanumero = document.getElementById('aboutement-tva-numero');
        var tvatarif = document.getElementById('aboutement-tva-tarif');
        var tvacontact = document.getElementById('aboutement-tva-contact');
        var tvaerreur = document.getElementById('aboutement-tva-erreur');

        add_class(tvanumeroinfo, "aboutement-ctr");
        add_class(tvanumeroinfo, "aboutement-majore");
        remove_class(tvanumeroinfo, "aboutement-no");

        try {
            var response = JSON.parse(this.responseText);
        } catch (e) {
            this.onerror();
            return;
        }

        if (typeof(response.numtel) != "undefined") {
            var phone = [
                response.numtel.slice(0,2), " ",
                response.numtel.slice(2,4), " ",
                response.numtel.slice(4,6), " ",
                response.numtel.slice(6,8), " ",
                response.numtel.slice(8,10)
                ].join(''); 
//            remove_class(tvatarif, "displaynone");
            tvatarif.style.display = "block";
            remove_class(tvatexte, "displaynone");
            remove_class(tvacontact, "displaynone");
            tvanumero.innerHTML = phone;
            ga('send', 'event', 'Aboutement TVA', 'payant : ' + response.numtel);
        } else if (typeof(response.numtva) != "undefined") {
//            add_class(tvatarif, "displaynone");
            tvatarif.style.display = "none";
            add_class(tvatexte, "displaynone");
            add_class(tvacontact, "displaynone");
            remove_class(tvanumeroinfo, "aboutement-ctr");
            remove_class(tvanumeroinfo, "aboutement-majore");
            add_class(tvanumeroinfo, "aboutement-no");
            tvanumero.innerHTML = response.numtva;
            ga('send', 'event', 'Aboutement TVA', 'gratuit');
        } else {
            this.onerror();
            return;
        }

        add_class(tvaerreur, "displaynone");
        remove_class(tvanumeroinfo, "displaynone");
        remove_class(tvanumero, "displaynone");
        remove_class(tvainfos, "displaynone");
        add_class(tvaclick, "displaynone");
    }

    this.onerror = function() {
        var tvainfos = document.getElementById('aboutement-tva-informations');
        var tvaclick = document.getElementById('aboutement-tva-click');
        var tvatexte = document.getElementById('aboutement-tva-texte');
        var tvanumeroinfo = document.getElementById('aboutement-tva-numero-info');
        var tvanumero = document.getElementById('aboutement-tva-numero');
        var tvatarif = document.getElementById('aboutement-tva-tarif');
        var tvacontact = document.getElementById('aboutement-tva-contact');
        var tvaerreur = document.getElementById('aboutement-tva-erreur');

        remove_class(tvanumeroinfo, "aboutement-ctr");
        remove_class(tvanumeroinfo, "aboutement-majore");
        add_class(tvanumeroinfo, "aboutement-no");
        remove_class(tvaerreur, "displaynone");
        add_class(tvatexte, "displaynone");
        add_class(tvanumeroinfo, "displaynone");
        add_class(tvanumero, "displaynone");
//        add_class(tvatarif, "displaynone");
        tvatarif.style.display = "none";
        add_class(tvacontact, "displaynone");
        remove_class(tvainfos, "displaynone");
        add_class(tvaclick, "displaynone");
    }

    this.send = function(siren) {
        if (this.xhr == null) {
            this.onerror();
        }
        this.xhr.open("GET", "/cgi-bin/aboutement-tva?siren=" + siren, true);
        this.xhr.socXhrWrapper = this;
        this.xhr.onload = this.onload;
        this.xhr.onerror = this.onerror;
        this.xhr.setRequestHeader("Cache-Control", "max-age=0, no-store, no-cache, must-revalidate");
        this.xhr.setRequestHeader("Pragma", "no-cache");
        this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
        this.xhr.send();
        return "Request processing...";
    }
}

abttvaXhrWrapper = new tvaWrapper();

function clickAboutementTVA(siren) {
    abttvaXhrWrapper.send(siren);
}

abttXhr = getXhr();

function SocXhrWrapper() {
    this.xhr = abttXhr;
    this.timeout = undefined;
    this.test = 1;

    this.responseHandler = function(e) {
        if(this.readyState != 4 || typeof(this.responseXML) == "string") {
            return;
        }

        var tmp;
        try { 
            tmp = eval('('+this.responseText+')'); 
        } catch(e) { 
            return; 
        } // Case CGI is unavailable : responseText is HTML and evaluating it will throw an exception

//        var telazurdetails = document.getElementById('priceazurdetails');
        var pricedetails = document.getElementById("price_details");
        var pricenodetails = document.getElementById("pricenodetails");
        var telab = document.getElementById("telab");
        var telabnum = document.getElementById("telab-num");
        var telabinfo = document.getElementById("telab-info");


        remove_class(telab, "aboutement-banalise");
        add_class(telab, "aboutement-majore");
        add_class(telab, "aboutement-ctr");
        remove_class(telabnum, "textorange");
        add_class(telabinfo, "displaynone");
        add_class(pricenodetails, "displaynone");
        remove_class(telab, "displaynone");

        asyncOpenAboutementTel();

        if((typeof(tmp.err) != 'boolean') || (tmp.err == true) || (typeof(tmp.telephone) != 'string') || (tmp.telephone.length < 10) || (tmp.telephone.length > 15) || (typeof(tmp.payant) != 'boolean')) {
 //           add_class(telazurdetails, "displaynone");
            add_class(pricedetails, "displaynone");
            telab.innerHTML = "Pas de num&eacute;ro disponible";
            if ((typeof(tmp.err) == 'boolean') && (tmp.err == true)) {
                ga('send', 'event', 'Aboutement annuaire', 'non dispo / err');
            }
            return;
        }

        telabnum.innerHTML = "" + tmp.telephone;
        if(tmp.payant == false) {
            ga('send', 'event', 'Aboutement annuaire', 'gratuit');
            ga('send', 'event', 'Aboutement annuaire', 'dispo');
            if((typeof(tmp.free) == 'boolean') && (tmp.free == true)) {
//                remove_class(telazurdetails, "displaynone");
                add_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
            } else {
                remove_class(pricenodetails, "displaynone");
                add_class(telabinfo, "displaynone");
                remove_class(telab, "aboutement-ctr");
                remove_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
                add_class(telabnum, "textorange");
            }
            add_class(pricedetails, "displaynone");
        } else {
            ga('send', 'event', 'Aboutement annuaire', 'payant : ' + tmp.telephone);
            ga('send', 'event', 'Aboutement annuaire', 'dispo');
            if((typeof(tmp.free) == 'boolean') && (tmp.free == true)) {
//                remove_class(telazurdetails, "displaynone");
                add_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
                add_class(pricedetails, "displaynone");
            } else {
//                add_class(telazurdetails, "displaynone");
                remove_class(pricedetails, "displaynone");
            }
        }

        if (is_phone_device() == true) {
            window.location = 'tel:' + tmp.telephone;
        }
        adnext_cssmove();
    } 

    this.url = 0;
    
    this.setUrl = function(urlToCgi) {
        if(typeof(urlToCgi) != "string") {
            return;
        }

        this.url = urlToCgi;
    }

    this.send = function(siret, nrlead) {
        if((this.xhr.readyState == this.xhr.OPENED) // 1
            || (this.xhr.readyState == this.xhr.HEADERS_RECEIVED) // 2
            || (this.xhr.readyState == this.xhr.LOADING)) { // 3
            return("XHR already in use");
        }

        if(typeof(this.url) != "string") {
            return "URL not set";
        }

        if(typeof(siret) != "string") {
            return "Argument siren is required and must be a string of caracters";
        } 

        if (this.timeout != undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
//        this.timeout = setTimeout( 'desactive_number();', 100000);
        this.timeout = setTimeout( 'bar.manageclick("identitetel");', 100000);

        if (nrlead) {
            this.xhr.open("GET", this.url + "?siret=" + siret + "&nrlead=" + nrlead, true);
        } else {
            this.xhr.open("GET", this.url+"?siret=" + siret, true);
        }
        this.xhr.socXhrWrapper = this;
        this.xhr.onreadystatechange = this.responseHandler;
        this.xhr.setRequestHeader("Cache-Control", "max-age=0, no-store, no-cache, must- revalidate");
        this.xhr.setRequestHeader("Pragma", "no-cache");
        this.xhr.send();
        return "Request processing...";
    }
}


function SocXhrWrapperRensjur() {
    this.xhr = abttXhr;
    this.timeout = undefined;
    this.test = 1;

    this.responseHandler = function(e) {
        if(this.readyState != 4 || typeof(this.responseXML) == "string") {
            return;
        }

        var tmp;
        try { 
            tmp = eval('('+this.responseText+')'); 
        } catch(e) { 
            return; 
        } // Case CGI is unavailable : responseText is HTML and evaluating it will throw an exception

//        var telazurdetails = document.getElementById('priceazurdetails-rensjur');
        var pricedetails = document.getElementById("price_details-rensjur");
        var pricenodetails = document.getElementById("pricenodetails-rensjur");
        var telab = document.getElementById("telab-rensjur");
        var telabnum = document.getElementById("telab-rensjur-num");
        var telabinfo = document.getElementById("telab-rensjur-info");
        var aboutement = document.getElementById('aboutement-rensjur');
        var link = document.getElementById('identiteatel-rensjur');


        remove_class(telab, "aboutement-banalise");
        add_class(telab, "aboutement-majore");
        add_class(telab, "aboutement-ctr");
        remove_class(telabnum, "textorange");
        add_class(telabinfo, "displaynone");
        add_class(pricenodetails, "displaynone");
        remove_class(telab, "displaynone");
        remove_class(aboutement, "displaynone");


        add_class(link, "displaynone");
//        asyncOpenAboutementTel();

        if((typeof(tmp.err) != 'boolean') || (tmp.err == true) || (typeof(tmp.telephone) != 'string') || (tmp.telephone.length < 10) || (tmp.telephone.length > 15) || (typeof(tmp.payant) != 'boolean')) {
//            add_class(telazurdetails, "displaynone");
            add_class(pricedetails, "displaynone");
            telab.innerHTML = "Pas de num&eacute;ro disponible";
            if ((typeof(tmp.err) == 'boolean') && (tmp.err == true)) {
                ga('send', 'event', 'Aboutement annuaire', 'non dispo / err');
            }
            return;
        }

        telabnum.innerHTML = "" + tmp.telephone;
        if(tmp.payant == false) {
            ga('send', 'event', 'Aboutement annuaire', 'gratuit');
            ga('send', 'event', 'Aboutement annuaire', 'dispo');
            if((typeof(tmp.free) == 'boolean') && (tmp.free == true)) {
//                remove_class(telazurdetails, "displaynone");
                add_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
            } else {
                remove_class(pricenodetails, "displaynone");
                add_class(telabinfo, "displaynone");
                remove_class(telab, "aboutement-ctr");
                remove_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
                add_class(telabnum, "textorange");
            }
            add_class(pricedetails, "displaynone");
        } else {
            ga('send', 'event', 'Aboutement annuaire', 'payant : ' + tmp.telephone);
            ga('send', 'event', 'Aboutement annuaire', 'dispo');
            if((typeof(tmp.free) == 'boolean') && (tmp.free == true)) {
//                remove_class(telazurdetails, "displaynone");
                add_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
                add_class(pricedetails, "displaynone");
            } else {
//                add_class(telazurdetails, "displaynone");
                remove_class(pricedetails, "displaynone");
            }
        }

        if (is_phone_device() == true) {
            window.location = 'tel:' + tmp.telephone;
        }
    } 

    this.url = 0;
    
    this.setUrl = function(urlToCgi) {
        if(typeof(urlToCgi) != "string") {
            return;
        }

        this.url = urlToCgi;
    }

    this.send = function(siret, nrlead) {
        if((this.xhr.readyState == this.xhr.OPENED) // 1
            || (this.xhr.readyState == this.xhr.HEADERS_RECEIVED) // 2
            || (this.xhr.readyState == this.xhr.LOADING)) { // 3
            return("XHR already in use");
        }

        if(typeof(this.url) != "string") {
            return "URL not set";
        }

        if(typeof(siret) != "string") {
            return "Argument siret is required and must be a string of caracters";
        }
        
        if(typeof(nrlead) != "string") {
            return "Argument siret is required and must be a string of caracters";
        }

        if (this.timeout != undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.timeout = setTimeout( 'desactive_number_rensjur();', 100000);

        this.xhr.open("GET", this.url + "?siret=" + siret + "&nrlead=" + nrlead, true);
        this.xhr.socXhrWrapper = this;
        this.xhr.onreadystatechange = this.responseHandler;
        this.xhr.setRequestHeader("Cache-Control", "max-age=0, no-store, no-cache, must- revalidate");
        this.xhr.setRequestHeader("Pragma", "no-cache");
        this.xhr.send();
        return "Request processing...";
    }
}

abttXhrWrapper = new SocXhrWrapper();
abttXhrWrapperRensjur = new SocXhrWrapperRensjur();


function closeAboutementOnglet() {
    desactive_number(abttXhrWrapper);
}


function openAboutementOnglet() {
    abttXhrWrapper.setUrl('/cgi-bin/aboutement-tel');
    abttXhrWrapper.send(siretabt, nrleadabt);
}


function clickAboutementTel(siret, nrlead) {
    abttXhrWrapperRensjur.setUrl('/cgi-bin/aboutement-tel');
    abttXhrWrapperRensjur.send(siret, nrlead);
}

/* ======================================= Contact Annuaire ================================ */

var toload = 0;
var loaded = 0;

function asyncOpenContactCompany() {
    var id = document.getElementById('contactAnnuaire');
    var ca = document.getElementById('contactannuaire');
    if (typeof(openContactCompany) == "function") {
        add_class(ca, "displaynone");
        remove_class(ca, "displaynone");

        openContactCompany(adnext_cssmove)

        remove_class(id, "identitebutt");
        add_class(id, "identitebuttinactive");
    }
}

function asyncCloseLinkContactCompany() {
    var id = document.getElementById('contactAnnuaire');
    var ca = document.getElementById('contactannuaire');

    remove_class(id, "identitebuttinactive");
    add_class(id, "identitebutt");

    remove_class(ca, "displaynone");
    add_class(ca, "displaynone");
}

function asyncCloseContactCompany() {
    var panel = document.getElementById('contact-company-panel-v2');
    
    if (typeof(closePopup) == "function") {
        if (panel) {
            closePopup("contact-company-panel-v2", asyncCloseLinkContactCompany);
        } else {
            asyncCloseLinkContactCompany();
        }
    }
}

function asyncContactCompany() {
    sendContactCompany(bar.manageclick('contactAnnuaire'));
}

var cpt = 0;

var scriptlist = scriptlist || [];

function fullLoad(e) {
    if (scriptlist && scriptlist.length == 4) {
        loaded++;
        if ((typeof(scriptlist[0].readyState) != "undefined" 
                && ((scriptlist[0].readyState == "loaded"
                        && scriptlist[1].readyState == "loaded"
                        && scriptlist[2].readyState == "loaded"
                        && scriptlist[3].readyState == "loaded")
                    || (scriptlist[0].readyState == "complete"
                        && scriptlist[1].readyState == "complete"
                        && scriptlist[2].readyState == "complete"
                        && scriptlist[3].readyState == "complete")
                    )
                ) /* IE 8 et 9 */
                || (typeof(scriptlist[0].readyState) == "undefined" && loaded == toload) /* Les autres navigateurs*/
           ) {
               if (typeof(mbPopSelect) != "undefined" && typeof(mbPopSelect.init) == "function") {
//                   $('#pQuestion').txtLimit(500, '#q_chrMax');
                    if ($('#pQuestion').maxlength) {
                        $('#pQuestion').maxlength  = 500;
                    }
                    mbPopSelect.init($('#aboutementPopups'));

                    if (typeof(asyncOpenContactCompany) == "function") {
                        asyncOpenContactCompany();
                    }
                }
           }
    }
}

function loadScript(src) {
    scriptlist = scriptlist || [];
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.body.parentNode.appendChild(script);
    scriptlist.push(script);

    toload++;
    if (("load" in script) || ("onload" in script)) {
        add_event(script, "load", fullLoad);
    } 

    if (("readystatechange" in script) || ("onreadystatechange" in script)) {
        add_event(script, "readystatechange", fullLoad);
    }

    return(script);
}


function displayContactAnnuaire() {

    if (typeof(openContactCompany) != "function") {
        loadScript('/scripts/jquery-1.4.4.min.js');
        loadScript('/scripts/mbpopup.js?1');
        loadScript('/scripts/annubox.js?1');
        loadScript('/scripts/jquery.txtLimiter.js');
    } else {
        asyncOpenContactCompany();
    }
}


/********************************************************/
/******************** Gestion cookie okc ****************/
/********************************************************/
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        if (days > 393) { /* never more than 13 months (in fact 365 days + 28 days) */
            days = 393;
        }
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/; domain=.societe.com";

}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function navigationCookieMobile(){
    var res = readCookie("mobileNavigation");
    if( res != null) {
        eraseCookie("mobileNavigation");
        createCookie( "mobileNavigation","1", 1); 
    } else {
        createCookie( "mobileNavigation", "1", 1);
    }
}

function navigationCookieDesktop(){
    var res = readCookie("mobileNavigation");
    if( res != null) {
        eraseCookie("mobileNavigation");
        createCookie( "mobileNavigation","0", 1); 

    } else {
        createCookie( "mobileNavigation", "0", 1);
    }
}

/* Gestion acceptation de cookies */
function setokc() {
    var d = new Date();
    d.setTime(d.getTime()+(393*24*60*60*1000));
    var expires = "expires="+d.toGMTString();

    var domain = ".societe.com";
    if (document.domain.match(/fichier.com/g) == "fichier.com") {
        domain = ".fichier.com";
    }
    document.cookie = "okc=1; path=/; " + expires + "; domain=" + domain + ";";
}

function autorisecookies() {
    var cookiebox = document.getElementById("cookie");
    
    if (cookiebox == undefined) {
        return;
    }
    setokc();
    cookiebox.style.display = "none";
}

function manageokc() {
    var cookiebox = document.getElementById("cookie");
    
    if (cookiebox == undefined) {
        return;
    }

    var cookie = readCookie("okc");

    if (cookie == null) {
        move_block(cookiebox, document.getElementById('cookiedest'));
        cookiebox.style.display = "block";
    } else {
        cookiebox.style.display = "none";
    }
}


/********************************************************/
/******************** DIRIGEANT *************************/
/********************************************************/
/* VIEW_MANDATDIR */
function init_mandatdir() {
    var mandatdir = document.getElementById('mandatdir');

    display_num(mandatdir);
}



function display_all_mandats() {
    var mandat = document.getElementById('mandatdir');
    var mandatplus = document.getElementById('mandatplus');

    if (mandat) {
        var tab = get_elementsbyclassname(mandat, 'mandatdirtext');
        for (var i = 0; i < tab.length; i++) {
            remove_class(tab[i], "displaynone");
        }

        hide_obj(mandatplus);
    }
}



function display_all_comandats() {
    var comandat = document.getElementById('comandatdir');
    var comandatplus = document.getElementById('comandatplus');

    if (comandat) {
        var tab = get_elementsbyclassname(comandat, 'comandat');
        for (var i = 0; i < tab.length; i++) {
            remove_class(tab[i], "displaynone");
        }

        hide_obj(comandatplus);
    }
}


function close_all_dir() {
    close_all_tel_dir("stel");
    close_all_tel_dir("tel");
}   



function close_all_tel_dir(prefix) {
    var abtt = document.getElementById(prefix + 'aboutement');
    var abt = get_elementsbyclassname(abtt, 'aboutementdir');

    if (abt && prefix) {
        for (var i = 0; i < abt.length; i++) {
            if (abt[i].id && abt[i].id.indexOf(prefix + "aboutementbloc_") == 0) {
                var mandatid = abt[i].id.substring(abt[i].id.lastIndexOf("_") + 1);

                var telazurdetails = document.getElementById(prefix + 'priceazurdetails_' + mandatid);
                var pricedetails = document.getElementById(prefix + "price_details_" + mandatid);
                var telab = document.getElementById(prefix + "telab_" + mandatid);
                var aboutement = document.getElementById(prefix + 'aboutement_' + mandatid);
                var link = document.getElementById(prefix + 'link_' + mandatid);
                var bloc = document.getElementById(prefix + 'aboutementbloc_' + mandatid);

                add_class(telab, "displaynone");
                add_class(aboutement, "displaynone");
                remove_class(link, "displaynone");
            }
        }
    } 

/*
    if (abtt && prefix) {
        for (i = 0; i < abtt.childElementCount; i++) {
            var mandatid = abtt.children[i].id.substring(abtt.children[i].id.lastIndexOf("_") + 1);

            var telazurdetails = document.getElementById(prefix + 'priceazurdetails_' + mandatid);
            var pricedetails = document.getElementById(prefix + "price_details_" + mandatid);
            var telab = document.getElementById(prefix + "telab_" + mandatid);
            var aboutement = document.getElementById(prefix + 'aboutement_' + mandatid);
            var link = document.getElementById(prefix + 'link_' + mandatid);
            var bloc = document.getElementById(prefix + 'aboutementbloc_' + mandatid);
        
            add_class(telab, "displaynone");
            add_class(aboutement, "displaynone");
            remove_class(link, "displaynone");
        }
    } 
    */
}


function SocXhrWrapperDir() {
    this.xhr = abttXhr;
    this.timeout = undefined;
    this.test = 1;

    this.responseHandler = function(e) {
        if(this.readyState != 4 || typeof(this.responseXML) == "string") {
            return;
        }

        var tmp;
        try { 
            tmp = eval('('+this.responseText+')'); 
        } catch(e) { 
            return; 
        } // Case CGI is unavailable : responseText is HTML and evaluating it will throw an exception

        var prefix = this.socXhrWrapper.prefix;
        var mandatid = this.socXhrWrapper.mandatid;

//        var telazurdetails = document.getElementById(prefix + 'priceazurdetails_' + mandatid);
        var pricedetails = document.getElementById(prefix + "price_details_" + mandatid);
        var pricenodetails = document.getElementById(prefix + "pricenodetails_" + mandatid);
        var telab = document.getElementById(prefix + "telab_" + mandatid);
        var telabnum = document.getElementById(prefix + "telab-num_" + mandatid);
        var telabinfo = document.getElementById(prefix + "telab-info_" + mandatid);
        var aboutement = document.getElementById(prefix + 'aboutement_' + mandatid);
        var link = document.getElementById(prefix + 'link_' + mandatid);


        remove_class(telab, "aboutement-banalise");
        add_class(telab, "aboutement-majore");
        add_class(telab, "aboutement-ctr");
        remove_class(telabnum, "textorange");
        add_class(telabinfo, "displaynone");
        add_class(pricenodetails, "displaynone");
        remove_class(telab, "displaynone");
        remove_class(aboutement, "displaynone");
        add_class(link, "displaynone");

        if((typeof(tmp.err) != 'boolean') || (tmp.err == true) || (typeof(tmp.telephone) != 'string') || (tmp.telephone.length < 10) || (tmp.telephone.length > 15) || (typeof(tmp.payant) != 'boolean')) {
//            add_class(telazurdetails, "displaynone");
            add_class(pricedetails, "displaynone");
            telab.innerHTML = "Pas de num&eacute;ro disponible";
            if ((typeof(tmp.err) == 'boolean') && (tmp.err == true)) {
                ga('send', 'event', 'Aboutement annuaire', 'non dispo / err');
            }
            return;
        }

        telabnum.innerHTML = "" + tmp.telephone;
        if(tmp.payant == false) {
            ga('send', 'event', 'Aboutement annuaire', 'gratuit');
            ga('send', 'event', 'Aboutement annuaire', 'dispo');
            if((typeof(tmp.free) == 'boolean') && (tmp.free == true)) {
//                remove_class(telazurdetails, "displaynone");
                add_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
            } else {
                remove_class(pricenodetails, "displaynone");
                add_class(telabinfo, "displaynone");
                remove_class(telab, "aboutement-ctr");
                remove_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
                add_class(telabnum, "textorange");
            }
            add_class(pricedetails, "displaynone");
        } else {
            ga('send', 'event', 'Aboutement annuaire', 'payant : ' + tmp.telephone);
            ga('send', 'event', 'Aboutement annuaire', 'dispo');
            if((typeof(tmp.free) == 'boolean') && (tmp.free == true)) {
//                remove_class(telazurdetails, "displaynone");
                add_class(telab, "aboutement-banalise");
                remove_class(telab, "aboutement-majore");
                add_class(pricedetails, "displaynone");
            } else {
//                add_class(telazurdetails, "displaynone");
                remove_class(pricedetails, "displaynone");
            }
        }

        if (is_phone_device() == true) {
            window.location = 'tel:' + tmp.telephone;
        }
    } 

    this.url = 0;
    
    this.setUrl = function(urlToCgi) {
        if(typeof(urlToCgi) != "string") {
            return;
        }

        this.url = urlToCgi;
    }

    this.send = function(siret, nrlead, id, prefix) {
        if((this.xhr.readyState == this.xhr.OPENED) // 1
            || (this.xhr.readyState == this.xhr.HEADERS_RECEIVED) // 2
            || (this.xhr.readyState == this.xhr.LOADING)) { // 3
            return("XHR already in use");
        }

        if(typeof(this.url) != "string") {
            return "URL not set";
        }

        if(typeof(siret) != "string") {
            return "Argument siret is required and must be a string of caracters";
        } 
        
        if(typeof(nrlead) != "string") {
            return "Argument nrlead is required and must be a string of caracters";
        } 

        if (this.timeout != undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }

        /* 5min */
        this.timeout = setTimeout("close_all_dir();", 5 * 1000 * 60);

        close_all_dir();
        this.xhr.socXhrWrapper = this;
        this.mandatid = id;
        this.prefix = prefix;
        this.xhr.open("GET", this.url+"?siret="+ siret + "&nrlead=" + nrlead, true);
        this.xhr.onreadystatechange = this.responseHandler;
        this.xhr.setRequestHeader("Cache-Control", "max-age=0, no-store, no-cache, must- revalidate");
        this.xhr.setRequestHeader("Pragma", "no-cache");
        this.xhr.send();
        return "Request processing...";
    }
}



abttXhrWrapperDir = new SocXhrWrapperDir();
 
function click_aboutement_dir(siret, nrlead, mandatid, prefix) {
    abttXhrWrapperDir.setUrl('/cgi-bin/aboutement-tel');
    abttXhrWrapperDir.send(siret, nrlead, mandatid, prefix);

}



function display_or_hide_aboutementdir() {
    var aboutement = document.getElementById('stelaboutement');

    if (aboutement) {
        display_or_hide('stelaboutement');         
        if (is_display(aboutement)) {
            var link = get_elementsbyclassname(aboutement, "lien");
            for (var i = 0; i < link.length; i++) {
                if (link[i].onclick) {
                    link[i].onclick();
                    break;        
                }
            }
        }
    }
}


/* Gestion reload des pages home + fiche */

function reload_page() {
    location.reload();
}


function ReloadAuto(loaded) {
    var _this = this;
    this.timeout = null;
    this.time = 1200000; /* 20 * 60 * 1000 */

    this.auth_pathnames = [ "^/societe/", "^(/)*$" ];
    this.auth_page = false;

    this.init = init;
    this.setup = setup;
    this.refresh = refresh;
    this.keymanage = keymanage;
    this.kill = kill;

    function init(isloaded) {
        if (this.timeout != null) {
            return;
        }

        if (this.auth_page == false) {
            var re = new RegExp(this.auth_pathnames.join('|'), "i");
            if (window.location.pathname.match(re) != null) {
                this.auth_page = true;
            }
        }

        if (typeof(isloaded) == "boolean" && isloaded == true) {
            this.setup();
        } else {
            add_event(document, "readystatechange", _this.setup);
        }
    }

    function setup() {
        if (_this.auth_page == false || _this.timeout != null) {
            return;
        }

        _this.refresh();
        add_event(window, "mousemove", _this.refresh);
        add_event(window, "touchmove", _this.refresh);
        add_event(window, "keyup", _this.keymanage);
        add_event(document.getElementById("buttsurveiller"),  "click", _this.kill);
        add_event(document.getElementById("contactAnnuaire"), "click", _this.kill);
        add_event(document.getElementById("input_search"), "focus", _this.kill);
    }

    function refresh() {
        if (_this.auth_page == false || _this.timeout != null) {
            clearTimeout(_this.timeout);
        }
        _this.timeout = setTimeout(reload_page, _this.time);
    }

    function kill() {
        clearTimeout(_this.timeout);
        _this.timeout = null;

        clearTimeout(_this.timetest);
        _this.timetest = null;

        remove_event(window, "mousemove", _this.refresh);
        remove_event(window, "touchmove", _this.refresh);
        remove_event(window, "keyup", _this.keymanage);
        remove_event(document.getElementById("buttsurveiller"),  "click", _this.kill);
        remove_event(document.getElementById("contactAnnuaire"), "click", _this.kill);
        remove_event(document.getElementById("input_search"), "focus", _this.kill);
    }

    function keymanage(event) {
        _this.refresh();
    }

    this.init(loaded);

    return this;
}

var reloader = new ReloadAuto(completeload);

