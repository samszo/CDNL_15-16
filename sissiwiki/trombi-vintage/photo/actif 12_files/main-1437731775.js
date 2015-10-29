/********************************************************/
/******************* Fonctions utiles *******************/
/********************************************************/
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, ''); 
    };
}

function encode_to_hex(str) {
    var r = "";
    var e = str.length;
    var c = 0;
    var h;

    while (c < e) {
        h = str.charCodeAt(c++).toString(16);
        while (h.length < 2) {
            h = "0" + h;
        }
        r += h;
    }

    return (r);
}

function nb_child(itemobj) {
    if (itemobj) {
        return (itemobj.childElementCount || itemobj.children.length);
    }
    
    return (-1);
}

function get_elementsbyclassname(itemobj, classname) {
    if (!itemobj || !classname) {
        return null;
    }

    if (typeof(itemobj.getElementsByClassName) != 'undefined') {
        return (itemobj.getElementsByClassName(classname));
    } else {
        return (itemobj.querySelectorAll('.' + classname));
    }
}


function get_class(itemobj) {
    if (itemobj) {
        if (typeof(itemobj.className) != "undefined") {
            return (itemobj.className);
        } else {
            return (itemobj.getAttribute("class"));
        }
    }

    return (null);
}

function set_class(itemobj, classname) {
    if (itemobj) {
        if (typeof(itemobj.className) != "undefined") {
            itemobj.className = classname;
        } else {
            itemobj.setAttribute("class", classname);
        } 
    }
}


/* Ajoute une classe à itemobj */
function add_class(itemobj, className) {
    var itemclass = get_class(itemobj);
    if (itemclass != null) { 
        if (itemclass.indexOf(className) == -1) {
            var res = itemclass += " " + className;
            set_class(itemobj, res.trim());
        }
    }
} 

/* Supprime une classe à itemobj */
function remove_class(itemobj, className) {
    if (itemobj && className) {
        var reg = new RegExp("(?:^|\s)" + className + "(?!\S)", 'g');
        var itemclass = get_class(itemobj);
        if (itemclass != null) {
            var res = itemclass.replace(className, '');
            set_class(itemobj, res);
        }
    }
}

/* Verifie si className existe dans itemobj */
function is_class_exist(itemobj, className) {
    if (itemobj && className) {
        var reg = new RegExp("(?:^|\s)" + className + "(?!\S)", 'g');
        var itemclass = get_class(itemobj);
        if (itemclass != null && itemclass.match(reg)) {
            return true;
        }
    }

    return false;
}

function getElementsByClass(searchClass, node, tag) {
    var classElements = [];
    var i = 0;
    var j = 0;

    if (!node) {
        node = document;
    }

    if (!tag) {
        tag = "*";
    }

    var els = node.getElementsByTagName(tag);
    var elsLen = els.lenght; 
    var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
    for (i = 0, j = 0; i < elsLen; i++) {
        var eltclass = get_class(els[i]);
        if (pattern.test(eltclass)) {
            classElements[j] = els[i];
            j++;
        }
    }

    return classElements;
}

/* Cacher un élement depuis son id */
function hide(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = "none";
    }
}

/* Afficher un élément depuis sont id */
function display(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = "block";
    }
}

/* Afficher un élément depuis sont id */
function display_inline_block(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = "inline-block";
    }
}

/* Afficher un tableau depuis sont id */
function display_table(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = "table";
    }
}

/* On regarde l'état de l'id et on le modifie 
 * hide => display 
 * display => hide */
function display_or_hide(id) {
    itemobj = document.getElementById(id);
    if (itemobj) {
        if (itemobj.style.display == "none") {
            display(id);
        } else {
            hide(id);
        }
    }
}

function display_or_hide_table(id) {
    itemobj = document.getElementById(id);
    if (itemobj) {
        if (itemobj.style.display == "none") {
            display_table(id);
        } else {
            hide(id);
        }
    }
}

/* Cacher un objet */
function hide_obj(itemobj) {
    if (itemobj) {
        itemobj.style.display = "none";
    }
}

/* Afficher un objet */
function display_obj_block(itemobj) {
    if (itemobj) {
        itemobj.style.display = "block";
    }
}

function display_obj_table(itemobj) {
    if (itemobj) {
        itemobj.style.display = "table";
    }
}

function display_obj_inline(itemobj) {
    if (itemobj) {
        itemobj.style.display = "inline";
    }
}

function display_obj_inline_block(itemobj) {
    if (itemobj) {
        itemobj.style.display = "inline-block";
    }
}

/* Affiche ou cache un objet */
function display_or_hide_obj_block(itemobj) {
    if (itemobj) {
        if (itemobj.style.display == "none") {
            display_obj_block(itemobj);
        } else {
            hide_obj(itemobj);
        }
    }
}

function display_or_hide_obj_inline(itemobj) {
    if (itemobj) {
        if (itemobj.style.display == "none") {
            display_obj_inline(itemobj);
        } else {
            hide_obj(itemobj);
        }
    }
}

function display_or_hide_obj_inline_block(itemobj) {
    if (itemobj) {
        if (itemobj.style.display == "none") {
            display_obj_inline_block(itemobj);
        } else {
            hide_obj(itemobj);
        }
    }
}

/* Fonction vérifiant si un élement est visible ou non */
function is_display(itemobj) {
    if (itemobj && itemobj.style.display != "none") {
        return (true);
    }

    return (false);
}

/* Stopper la propagation d'un event */
function event_handler(evt) {
    if (!evt) {
        evt = window.event;
    }   

    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

/* Ajout d'un evenement à obj du type type_event en 
 * appelant callback */
function add_event(obj, type_event, callback) {
    if (!document.addEventListener && type_event == "resize") {
        return;
    }
    if (obj) {
        if (obj.addEventListener) {
            obj.addEventListener(type_event, callback, false);
        } else if (obj.attachEvent) {
            obj.attachEvent("on" + type_event, callback);
        }   
    }
}

/* Retrait d'un evenement à obj du type type_event en
 * qui appelle callback */
function remove_event(obj, type_event, callback) {
    if (obj) {
        if (obj.removeEventListener) {
            obj.removeEventListener(type_event, callback, false);
        } else if (obj.detachEvent) {
            obj.detachEvent("on" + type_event, callback);
        }
    }
}

/* Fonction permettant de rediriger */
function redirect(url) {
    window.location.href = url;
}

/* Fonction ouvrant un bloc et scroll dessus */
function open_block(id) {
    var itemobj = document.getElementById(id);
    if (itemobj) {
        display_obj_block(itemobj);
        window.location = "#" + id;
    } 
}

/* Fonction donnant le focus à un élément */
function add_focus(id) {
    var itemobj = document.getElementById(id);
    if (itemobj) {
        window.location = "#" + id;
        itemobj.select();
        /* 
        if (itemobj.focus != "undefined") {
            itemobj.focus();
        } else {
            itemobj.select();
        }*/
    }
}

/* Fonction de focus / blur pour les inputs  */
function event_input(id, text) {
    var input = document.getElementById(id);

    if (input) {
        add_event(input, "focus", function(){onfocus_input(input, text);});
        add_event(input, "blur", function(){onblur_input(input, text);});
    }    
}

function onfocus_input(itemobj, text) {
    if (itemobj.value == text) {
        itemobj.value = '';
    }
}

function onblur_input(itemobj, text) {
    if (itemobj.value == '') { 
        itemobj.value = text;
    }
}

/* Enumeration des devices possibles :
 * - mobile : max : 720 
 * - tablette : 720 - 1024 
 * - desktop : min 1024 (et plus) 
 * - ie : ne reconnait pas les media query */

var device_type = {
    PHONE : 0,
    TABLET : 1,
    DESKTOP : 2,
    IE : 3
};

/* Fonction detectant le type de device */
function detect_device() {
    if (window.matchMedia) {
        if (window.matchMedia("(min-width: 62.5em)").matches) {
            return device_type.DESKTOP;
        } else if (window.matchMedia("(min-width: 46em)").matches) {
            return device_type.TABLET;
        } else {
            return device_type.PHONE;
        }
    } else {
//        if (document.all && !document.addEventListener) {
//            return device_type.PHONE;
//        } else {
            return device_type.DESKTOP;
//        }
    }   
}

/* Fonction vérifiant le mode d'affichage */
function is_device_portrait() {
    if (window.matchMedia) {
        if (window.matchMedia("(orientation:portrait)").matches) {
            return true;
        } 
    }

    return false;
}

/* Fonction verifiant si le type de device à 
 * une taille mini de size */
function device_size_max(size) {
    if (window.matchMedia) {
        if (window.matchMedia("(max-width: " + size + "em)").matches) {
    set_actionnumtel();
            return true;
        }
    }

    return false;
}

/* Fonction permettant de vérifier si l'on se trouve dans le cas
 * d'un device de type PHONE */
function is_phone_device() {
    if (detect_device() === device_type.PHONE) {
        return true;
    }

    return false;
}

/* Fonction vérifiant si on se trouve dans le cas d'un
 * device de type TABLET */
function is_tablet_device() {
    if (detect_device() === device_type.TABLET) {
        return true;
    } 
    return false;
}

/* Fonction vérifiant si on se trouve dans le cas d'un
 * device de type DESKTOP */
function is_desktop_device() {
    if (detect_device() === device_type.DESKTOP) {
        return true;
    } 
    return false;
}

/* Fonction détectant si on se trouve sur un device
 * de type PHONE ou TABLET */
function is_phone_or_tablet_device() {
    if (is_tablet_device() || is_phone_device()) {
        return true;
    }
    return false;
}


/* Gère l'offset */
function getZoomFactor() {
    var factor = 1;

    if (document.body.getBoundingClientRect) {
        var rec = document.body.getBoundingClientRect();
        var physicalW = rec.right - rec.left;
        var logicalW = document.body.offsetWidth;

        factor = Math.round((physicalW / logicalW) * 100) /100;
    }
    return(factor);
}
function getY() {
    var scrollTop = undefined;
    
    if (window.pageYOffset) {
        scrollTop = window.pageYOffset;
    } else {
        var zoomFactor = getZoomFactor();
        scrollTop = Math.round(document.documentElement.scrollTop / zoomFactor);
    }

    return(scrollTop);
}


/* Variable globale concernant le device en cours */
var current_device = detect_device();

/* Fonction de déplacement d'un bloc vers un autre */
function move_block(src, dest) {
    if (src && dest) {
//        var parent_node = src.parentNode;
//        var clone = src;

        dest.appendChild(src);
//        if (parent_node) {
//            parent_node.removeChild(clone);    
//        } 
//
//        dest.appendChild(clone);
    }       
}

/* Fonction de déplacement avant dest */
function move_block_before(node, src, dest) {
    if (node && src && dest) {
        var parent_node = src.parent;
        var clone = src;

        if (parent_node) {
            parent_node.removeChild(clone);    
        } 

        node.insertBefore(clone, dest);
    }       
}

/* Renvoit un objet contenant : 
 * bottom 
 * height 
 * left 
 * right 
 * top 
 * width */
function get_bounding(itemobj) {
    if (!itemobj) {
        return 0;
    }
    return (itemobj.getBoundingClientRect());
}

/* Renvoi la width d'un itemobj */
function get_width(itemobj) {
    return (get_bounding(itemobj).width);
}

function get_height(itemobj) {
    return (get_bounding(itemobj).height);
}

/* Fonction random */
function interval_random(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}  

/* Verifie si un caractère est un chiffre ou non */  
function is_digit(c) {
    if (c >= '0' && c <= '9') {
        return (true);
    } 

    return (false);
}

/* Permet un affichage de la forme 123 456 789, 1 234.5, 1 345Keuro */
function number_presenter(str) {
    var res = "";
    var idx = 0;
    var jdx = 0;
    var str_sz = str.length;
    var num = "";

    while (idx < str_sz) {
        if (!is_digit(str[idx])) {
            res += str[idx];
            idx++;
        } 
        else {
            jdx = idx;

            /* On continue jusqu'à la fin ou jusqu'au 
             * prochain caractère non chiffre */
            while (jdx < str_sz && is_digit(str[jdx])) {
                jdx++;
            }

            num = str.substring(idx, jdx);

            res += format_number(num);
            idx = jdx; 
        }
    }

    /* On remplace EURO ou EU par &euro; */
    var reg = new RegExp("EURO", "g");
    res = res.replace(reg, "&euro;");

    reg = new RegExp("EU", "g");
    res = res.replace(reg, "&euro;");

    return (res);
}

function format_number(num) {
    var num_sz = num.length;
    var res = "";
    var start = 0;
    var end = 0;
    var nb = 0;

    end = num_sz % 3;
    if (end == 0) {
        end = 3;
    }
    res += num.substring(start, end);
    start = end;
    end += 3;

    while (end <= num_sz) {
        res += "\xA0"; 
        res += num.substring(start, end);
        start = end;
        end += 3;
    } 
    return (res);
}

function display_num(itemobj) {
    if (itemobj) { 
        var tab = get_elementsbyclassname(itemobj, 'numdisplay'); 
        if (tab) {
            for (var i = 0; i < tab.length; i++) {
                tab[i].innerHTML = number_presenter(tab[i].innerHTML);
            }   
        }
    }
}

function build_table_chiffre(tab) {
    if (tab) {
        var list = tab.getElementsByTagName("td");

        for (var i = 0; i < list.length; i++) {
            var elem = list[i].getAttribute("chiffre");
            if (elem) {
                var nb = parseInt(elem);
                
                var monnaie = "";
                var idx = 0;
                if (elem[idx] == '-') {
                    idx++;
                }
                while (idx < elem.length && is_digit(elem[idx])) {
                    idx++;
                }
                monnaie = elem.substring(idx, elem.length);

                if ((nb > 999999 || nb < -999999) && is_phone_device()) {
                    list[i].innerHTML = Math.round(nb / 1000) + " K" + monnaie; 
                } else {
                    list[i].innerHTML = elem;
                }
            }
        }
    }
}

function get_offset_top(id) {
    var itemobj = document.getElementById(id);
    var res = 0;

    if (itemobj) {
        res = itemobj.offsetTop;
        while (itemobj.offsetParent) {
            itemobj = itemobj.offsetParent;
            res += itemobj.offsetTop;
        }
    }

    return (res);
}

_env_societe = 0;
_env_dirigeant = 1;

_env = _env_societe;

function is_dirigeant() {
    if (_env == _env_dirigeant) {
        return(true);
    }

    return(false);
}


function is_societe() {
    if (_env == _env_societe) {
        return(true);
    }

    return(false)
}


/********************************************************/
/***************** Fonction GUI general *****************/
/********************************************************/
function init_head() {
    init_header();
    init_menuphone();
    init_panierbar();
    init_compte();
    init_menu('menu');
    init_bug_fix();
    autopromo_query();

    event_input("input_search", "Entreprise, dirigeant, SIREN...");
    add_event(window, "resize", resize_header);
    add_event(window, "focus", init_compte);
}

function init_headdir() {
    init_header();
    init_menuphone();
    init_panierbar();
    init_compte();
    init_menu('menu');
    init_completion();
    init_bug_fix();
    autopromo_query();

    event_input("input_search", "Nom ou prénom du dirigeant...");
    add_event(window, "resize", resize_header);
    add_event(window, "focus", init_compte);
}

/* Fonction initialisation de la pub */
function init_pub() {
    var pubbanner = document.getElementById('pubbanner');
    display_obj_block(pubbanner);
}

/* Fonction permettant de corriger le bug du zoom sur ipad */
function init_bug_fix() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        var viewportmeta = document.querySelector('meta[name="viewport"]');
        if (viewportmeta) {
            viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
            document.body.addEventListener('gesturestart', function () {
                viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
            }, false);
        }
    }
}

/* Fonction permettant de gérer les différents cas lors d'une resize */
function resize_header() {
    init_header();

}

/* Ajout ou non des .com des liens du header */
function init_link() {
    var dirig_link = document.getElementById('dirig_link');
    var fich_link = document.getElementById('fich_link');
    var annu_link = document.getElementById('annu_link');

    display_obj_inline(dirig_link);
    display_obj_inline(fich_link);
    display_obj_inline(annu_link);

    var link_width = get_width(document.getElementById('sites'));
    var social_width = get_width(document.getElementById('pictosociaux'));
    var content_width = get_width(document.getElementById('reseaux'));

    /* Marge de 20 px */
    var width = link_width + social_width + 30;
    if (width >= content_width) {
        hide_obj(dirig_link);
        hide_obj(fich_link);
        hide_obj(annu_link);    
    }
}

/* Fonction d'initialisation du header */
function init_header() {
    var basket_content = document.getElementById('basket_content');
    var basket = document.getElementById('button_basket');
    var user_content = document.getElementById('user_content');
    var user = document.getElementById('button_user');
    var logo = document.getElementById('logo_img');
    var search = document.getElementById('recherche');
    var search_tablet = document.getElementById('recherche-tablette');
    var search_phone = document.getElementById('recherche-mobile');
    var searchplus = document.getElementById('searchpluslink');
    var searchplusphone = document.getElementById('searchplusmobile');
    var searchplustablet = document.getElementById('searchplustablet');
    var aidesociete = document.getElementById('aidesociete');
    var aidesocietephone = document.getElementById('aidesocietemobile');
    var aidesocietetablet = document.getElementById('aidesocietetablet');
    var input_search = document.getElementById('input_search');
    var button_search = document.getElementById('buttsearch');
    var buttheader = document.getElementById('buttheader');

    init_link();
}

/* Initialisation du panier_bar fixed */
function init_panier_prod() {
    

    var vval = get_elementsbyclassname(document, "vsommeht"); /* vitrine */
    var bval = document.getElementById('sommeht'); /* basket */
    if (vval && bval) {
        for (var i = 0; i < vval.length; i++) {
            vval[i].innerHTML = bval.innerHTML;
        }
    }

    vval = get_elementsbyclassname(document, 'vnbprod'); /* vitrine */
    bval = document.getElementById('nbprod'); /* basket */

    var nbprod = 0;
    var pubmobile = document.getElementById('pubmobile_media');
    var panierbar = document.getElementById('panier-bar');
    
    if (vval && bval) {
        nbprod = bval.innerHTML;
        if (is_phone_device() || is_tablet_device()) {
            if (parseInt(nbprod) > 0) {
                if (pubmobile) {
                    pubmobile.style.visibility = "hidden";
                }
                display_obj_block(panierbar);

            } else {
                if (pubmobile) {
                    pubmobile.style.visibility = "visible";
                }
                hide_obj(panierbar);
            }
        } else {
            hide_obj(panierbar);
        }

        for (var i = 0; i < vval.length; i++) {
            vval[i].innerHTML = nbprod;    
        }
    }

    var pluriel = get_elementsbyclassname(document, 'vplur');
    if (pluriel) {
        for (var i = 0; i < pluriel.length; i++) {
            if (nbprod > 1) {
                pluriel[i].innerHTML = "s";
            } else {
                pluriel[i].innerHTML = "";
            }
        }
    }
}


function init_panierbar() {
    var panierbar = document.getElementById('panier-bar');
    if (panierbar) {
        hide_obj(panierbar);
        add_event(window, "resize", init_panier_prod);
        init_panier_prod();
    }
}

/* initialisation du menu fixed */
function init_menuphone() {
    var menu = document.getElementById('menumobile');
    if (menu) {
        hide_obj(menu);
        add_event(window, "resize", function() {resize_menuphone(menu);});
        add_event(window, "scroll", function() {scroll_menuphone(menu);});
        scroll_menuphone(menu);
    }
}

function resize_menuphone(itemobj) {
    if (is_phone_device()) {
        display_obj_block(itemobj);
    } else {
        hide_obj(itemobj);
        remove_class(itemobj, "floatable");
    }
    scroll_menuphone(itemobj);
}

function scroll_menuphone(itemobj) {
    var buttmenu = document.getElementById('buttmenu');
    var pos = buttmenu.offsetTop + get_height(buttmenu);
    var menu = document.getElementById('menu');

    if (!is_phone_device()) {
        return;
    }

    if (is_display(menu)) {
        if (menu) {
            pos += get_height(menu);
        }

        var partmenu = document.getElementById('partmenu');
        if (partmenu) {
            pos += get_height(partmenu); 
        }
    }

    if (getY() >= pos) {
        display_obj_block(itemobj);
        add_class(itemobj, "floatable");
        itemobj.style.top = 0;
    } else {
        remove_class(itemobj, "floatable");
        hide_obj(itemobj);
    }   
}

/********************************************************/
/************** Gestion du champ de recherche ***********/
/********************************************************/
function submit_search() {
    var form = document.getElementById("form_search");
    var input = document.getElementById("input_search");
    var str = "";

    if (input && form) {
        if (input.value == "Entreprise, dirigeant, SIREN..." || input.value == "") {
            alert("Veuillez saisir un nom d'entreprise, un SIREN ou un nom de dirigeant");
            return (false);
        }
        
        ga('send', 'event', 'Search', 'Bouton_de_recherche');

        str = input.value;
        str.trim();
        str = str.replace(/ /g, "");
        str = str.replace(/\./g, "");

        if (str.length == 9 && !isNaN(str)) {
            input.value = str;
        }

        form.action = "/cgi-bin/search";
        form.submit();

        return (true);
    }

    return (false);
} 


/********************************************************/
/************** Gestion du champ de recherche ***********/
/********************************************************/
function init_completion() {

    clear_result_completion();
    add_event(window, "resize", resize_completion);
}



function resize_completion() {
    clear_result_completion();
    searchdir_checkrequest();
}



function clear_result_completion() {
    var results = document.getElementById('completion_results');

    if (results) {
        results.innerHTML = "";
        results.style.top = "";
        results.style.left = "";
        results.style.height = "";
        hide_obj(results);
    }
}


function submit_dirsearch() {
    var form = document.getElementById("form_search");
    var input = document.getElementById("input_search");
    var str = "";

    if (input && form) {
        if (input.value == "Nom ou prénom du dirigeant..." || input.value == "") {
            alert("Saisissez un nom ou un prénom du dirigeant");
            return (false);
        }
        
        ga('send', 'event', 'Search', 'Bouton_de_recherche_dirigeant');

        str = input.value;
        str.trim();
        str = str.replace(/ /g, "");
        str = str.replace(/\./g, "");

        if (str.length == 9 && !isNaN(str)) {
            input.value = str;
        }

        form.action = "/cgi-bin/searchdir";
        form.submit();

        return (true);
    }

    return (false);
} 



function searchdir_checkrequest() {
    var searchdir = document.getElementById('input_search');
    var results = document.getElementById('completion_results');

    if (searchdir && results) {
        if (searchdir.value.length >= 3) {
            var query = "/cgi-bin/searchdir-completion?champ=" + escape(searchdir.value);
            send_query(query, searchdir_completion); 
        } else {
            results.innerHTML = "";
            hide_obj(results);
        }
    }
}



function searchdir_completion(req) {
    if (req.readyState == 4 && req.status == 200) {
        var results = document.getElementById('completion_results');
        
        if (!results) {
            return;
        }

        if (req.responseTexte == "") {
            return;
        }


        clear_result_completion();

        var dir = eval(req.responseText);
        var height = 0;
        for (var i = 0; i < dir.length; i++) {
            var line = document.createElement("p");
            line.id = "completion-" + i;
            line.innerHTML = dir[i].nom + " (" + dir[i].resultat + " résultat";
            if (dir[i].resultat > 1) {
                line.innerHTML += "s";
            }
            line.innerHTML += ")";
            line.setAttribute("name", dir[i].nom);
            add_event(line, "click", completion_redirect);
            add_event(line, "mouseout", completion_mouseout);
            add_event(line, "mouseover", completion_mouseover);

            results.appendChild(line);
        }

        var input = document.getElementById('input_search');
        if (input) {

            var left = GetDomOffset(input, "offsetLeft");
            results.style.left = left + "px";
            
            if (is_phone_device()) {
                results.style.top = GetDomOffset(input, "offsetTop") + get_height(input) + "px";
            } else {
                results.style.top = GetDomOffset(input, "offsetTop");
            }
            
            results.style.width = input.offsetWidth + "px";
            results.style.position = "absolute";
        }

        display_obj_block(results);
    }
}



function completion_redirect() {
    var input = document.getElementById('input_search');
    if (input) {
        input.value = this.getAttribute("name");
        submit_dirsearch();
    }
}



function completion_mouseout() {
    remove_class(this, "completionselected");
}



function completion_mouseover() {
    var result = document.getElementById('completion_results');

    if (result) {
        for (var i = 0; i < result.childElementCount; i++) {
            remove_class(result.children[i], "completionselected");
        }

        add_class(this, "completionselected");
    }
}


function searchdir_keyup(evt) { 
    var e = window.event || evt;
    var result = document.getElementById('completion_results');
    var searchdir = document.getElementById('input_search');
    
    if (!result || !searchdir) {
        return;
    }   

    /* On recherche l'element courant */
    var index = -1;
    for (var i = 0; i < result.childElementCount; i++) {
        if (is_class_exist(result.children[i], "completionselected")) {
            index = i;
            break;
        }
    }

    if (e.keyCode == 40 && searchdir.value.length > 0) { // fleche bas
        if (index >= 0) {
            remove_class(result.children[index], "completionselected");
        }
        
        index++;
        if (index >= result.childElementCount) {
            index = 0;
        }

        add_class(result.children[index], "completionselected");
    } else if (e.keyCode == 38 && searchdir.value.length > 0) { // fleche du haut
        if (index >= 0) {
            remove_class(result.children[index], "completionselected");
        }
        
        index--;
        if (index < 0) {
            index = result.childElementCount - 1;
        }
        
        add_class(result.children[index], "completionselected");
    } else if (e.keyCode == 13 && is_display(result) && searchdir.value.length > 0) {
        e.preventDefault();

        if (index != -1) {
            searchdir.value = result.children[index].getAttribute("name");
        }

        submit_dirsearch();
    } else if (e.keyCode == 13) {
        var target = e.target || e.srcElement;
        e.preventDefault();

        searchdir.value = target.value;
        submit_dirsearch(); 
    } else if (e.keyCode == 27) {
        clear_result_completion();
    } else {
        clear_result_completion();
        searchdir_checkrequest();
    }
}



function searchdir_keydown(evt) {
    var e = window.event || evt;

    if (e.keyCode == 13) {
        e.preventDefault();
    }
}



/********************************************************/
/******************* Gestion du menu ********************/
/********************************************************/
/* Chaque titlemenu_num doit correspondre à un partmenu_num */

/* Initialisation du menu */
function init_menu(id) {
    var menu = document.getElementById(id);
    var butt = document.getElementById("butt" + id);

    if (menu) {
        hide_partmenu(menu);
        build_partmenu(menu);
        event_menu(menu);
        add_event(window, "resize", function(){resize_menu(menu);});
    }

    if (butt) {
        if (is_phone_device() && menu) {
            menu.style.display = "none";
        }

        add_event(butt, "click", function(){display_or_hide_butt_menu(menu, butt);});
    }
}

function display_or_hide_butt_menu(menu, butt) {
    if (menu && butt) {
        if (menu.style.display == "none") {
            if (is_phone_device()) {
                menu.style.display = "block";
            } else {
                menu.style.display = "table";
            }
        } else {
            menu.style.display = "none";
        }
    }       
}

/* On extrait le numero d'un id de la forme example_id */
function extract_num(id) {
    if (id) {
        var idx = id.lastIndexOf('_');
        if (idx == -1) {
            return idx;
        } 

        return (parseInt(id.substr(idx + 1)));
    }

    return (-1);
}

/* On cache toutes les parties du menu */
function hide_partmenu(menu) {
    if (menu) {
        for (var i = 0; i < nb_child(menu); i++) {
            var num = extract_num(menu.children[i].id);

            var partmenu = document.getElementById('partmenu_' + num);
            if (partmenu) {
                hide_obj(partmenu);
                remove_class(menu.children[i], "titremenuactif");
                
                change_icon_menu(menu.children[i]);
            }
        }
    }
}

/* On construit suivant le cas le menu */
function build_partmenu(menu) {
    var is_phone = is_phone_device();
    if (menu) {
        var partmenu = document.getElementById('partmenu');
        if (partmenu) {
            for (var i = nb_child(partmenu) - 1; i >= 0; i--) {
                var num = extract_num(partmenu.children[i].id);
                var titlemenu = document.getElementById('titlemenu_' + num);

                if (is_phone && titlemenu) {
                    move_block(partmenu.children[i], titlemenu);
                    remove_class(menu.children[i], "titremenuactif");
                } else {
                    if (is_display(partmenu.children[i])) {
                        add_class(menu.children[i], "titremenuactif");
                    } else {
                        remove_class(menu.children[i], "titremenuactif");
                    }
                }
            }           

        }
    }
}

/* Gestion des evenements du menu */
function event_menu(menu) {
    if (menu) {
        for (var i = 0; i < nb_child(menu); i++) {
            add_event(menu.children[i], "click", onclick_menu);
            add_event(menu.children[i], "mouseover", onmouseover_menu);
            add_event(menu.children[i], "mouseout", onmouseout_menu);
        } 
    }
} 

/* Gestion du changement de fond lors du passage de la souris */
function onmouseover_menu(e) {
    var evt = e || e.event;
    var itemobj;

    if (evt.srcElement) {
        itemobj = evt.srcElement;
    } else if (evt.target) {
        itemobj = evt.target;
    } else {
        itemobj = this;
    }

    if (!is_desktop_device()) {
        return;
    }
        
    if (!is_class_exist(itemobj, "titremenu")) {
        itemobj = itemobj.parentNode;
    }

    var num = extract_num(itemobj.id);
    var partmenu = document.getElementById('partmenu_' + num);
    if (!is_display(partmenu)) {
        remove_class(itemobj.getElementsByTagName('i')[0], 'invisible');
    }
}

/* Gestion du changement de fond lors du retrait de la souris */
function onmouseout_menu(e) {
    var evt = e || e.event;
    var itemobj;

    if (evt.srcElement) {
        itemobj = evt.srcElement;
    } else if (evt.target) {
        itemobj = evt.target;
    } else {
        itemobj = this;
    }
   
    if (!is_desktop_device()) {
        return;
    }
    
    if (!is_class_exist(itemobj, "titremenu")) {
        itemobj = itemobj.parentNode;
    }

    var num = extract_num(itemobj.id);
    var partmenu = document.getElementById('partmenu_' + num);
    if (!is_display(partmenu)) {
        remove_class(itemobj, "titremenuactif");
        add_class(itemobj.getElementsByTagName('i')[0], 'invisible');
    }
}

/* Evenement du click sur le menu */
function onclick_menu(e) {

    var evt = e || e.event;
    var itemobj;

    if (evt.srcElement) {
        itemobj = evt.srcElement;
    } else if (evt.target) {
        itemobj = evt.target;
    } else {
        itemobj = this;
    }
    
    if (!is_class_exist(itemobj, "titremenu")) {
        itemobj = itemobj.parentNode;
    }

    var num = extract_num(itemobj.id);
    var partmenu = document.getElementById('partmenu_' + num);
    var pubbanner = document.getElementById('pubbanner');

    display_or_hide_obj_block(partmenu);

    if (!is_phone_device()) {
        change_icon_menu(itemobj);
        if (is_display(partmenu)) {
            add_class(itemobj, "titremenuactif");
            hide_obj(pubbanner);
        } else {
            remove_class(itemobj, "titremenuactif");
            display_obj_block(pubbanner);
        }
    }

    /* Gestion de l'autopromo */
    if (!is_phone_device() && is_display(partmenu)) {
        var autopromo = document.getElementById('autopromocontent_' + num);
        complete_autopromo(autopromo);
    }  

    /* On cache le reste */
    if (detect_device() != device_type.PHONE) {
        var parentElement = itemobj.parentElement;
        if (parentElement) {
            for (var i = 0; i < nb_child(parentElement); i++) {
                var num = extract_num(parentElement.children[i].id);
                var partmenu = document.getElementById('partmenu_' + num);

                if (parentElement.children[i] !== itemobj) {
                    if (!is_phone_device()) {
                            remove_class(parentElement.children[i], "titremenuactif");
                    }
                    hide_obj(partmenu);
                    change_icon_menu(parentElement.children[i]);
                }
            }
        }
    }
   // set_panierinit();
}

/* On gère la modification de l'icone */
function change_icon_menu(itemobj) {
    if (itemobj && itemobj.id) {
        var num = extract_num(itemobj.id);
        var partmenu = document.getElementById('partmenu_' + num);
        if (partmenu) {
            if (is_display(partmenu)) {
                set_class(itemobj.getElementsByTagName('i')[0], 'icon-cancel-circled');
            } else {
                set_class(itemobj.getElementsByTagName('i')[0], 'icon-down-dir');
                add_class(itemobj.getElementsByTagName('i')[0], 'invisible');
            }
        }
    }
}

/* Fonction permettant de traiter l'event resize du menu */
function resize_menu(menu) {
    if (current_device != detect_device()) {
        current_device = detect_device();
        clean_menu(menu);
        build_partmenu(menu); 
        init_pub();

        if (is_phone_device()) {
            menu.style.display = "none";
        } else {
            menu.style.display = "table";
        }
    }
}

/* On nettoie le menu */
function clean_menu(menu) {
    var partmenu_content = document.getElementById('partmenu');

    if (menu) {
        for (var i = 0; i < nb_child(menu); i++) {
            var num = extract_num(menu.children[i].id);
            var partmenu = document.getElementById("partmenu_" + num);

            if (partmenu && partmenu_content) {
                move_block(partmenu, partmenu_content);
            }
        }       
    }
}


/********************************************************/
/************** Gestion du bouton compte ****************/
/********************************************************/
function init_compte() {
    var butt = document.getElementById('user_content');
    if (butt) {
        var query = "/cgi-bin/infoclient?e=1";
        send_query(query, compte_result); 
    }
}


function compte_result(res) {
    var id = document.getElementById('user_content');

    if (id && res.readyState == 4 && res.status == 200) {
        var json;
        try {
            json = JSON.parse(res.responseText);
        } catch (e) {
            id.innerHTML = "Votre compte";
            return;
        }

        if (json.connected && json.email) {
            id.innerHTML = json.email;
        } else {
            id.innerHTML = "Votre compte";
        }
    }
}

/********************************************************/
/****************** Gestion du QRcode *******************/
/********************************************************/

function set_link_qrcode() {
    if (is_dirigeant()) {
        var reg = new RegExp("http://(.*)\.societe\.com/dirigeant/(.*)", "g");
        var rep = "http://dirigeant.societe.com/qrdir/$2";
    } else {
        var reg = new RegExp("http://(.*)\.societe\.com/societe/(.*)-(.*)", "g");
        var rep = "http://societe.com/qrcode/-$3";
    }
    var link = window.location.href.replace(reg, rep);
    var qrcode = new QRCode(document.getElementById("qrcode"), { text : link, colorDark :"#0A66B2", colorLight : "#ffffff", width:"64", height:"64", correctLevel : QRCode.CorrectLevel.M });
}


/********************************************************/
/****************** Gestion des requêtes ****************/
/********************************************************/

/* Fonction permettant d'envoyer une query 
 * et d'appeler une callback pour le retour */
function send_query(query, callback) {
    var req = null;

    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
        if (req.overrideMimeType) {
            req.overrideMimeType("text/html");
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

    req.open("GET", query, true);
    if (callback) {
        req.onreadystatechange = function() {callback(req)};
    }
    req.setRequestHeader("Content-type", "text/html;charset=iso-8859-1");
    req.send(null); 
}

/* Fonction permettant de submit un form */
function submit(id) {
    if (id) {
        document.getElementById(id).submit();
    }
}


/********************************************************/
/******************** Autopromotion *********************/
/********************************************************/

var autopromo_tab = [];

/* Fonction permettant d'appeler les cgis de l'autopromo */
function autopromo_query() {    
    var query = "/cgi-bin/autopromo";
    send_query(query, autopromo_result);
}

/* Retour du cgi de l'autopromo */
function autopromo_result(res) {
    if (res.readyState == 4) {
        if (res.status == 200) {
            autopromo_tab = res.responseText.split('\n');
        }
    }
}

/* Remplit itemobj avec une phrase aléatoire */
function complete_autopromo(itemobj) {
    var num = interval_random(0, autopromo_tab.length - 1);

    if (itemobj && (typeof autopromo_tab[num] != 'undefined')) {
        itemobj.innerHTML = autopromo_tab[num];
    }
}


/********************************************************/
/******************** gestion des vues ******************/
/********************************************************/
var wasphone = "undefined";

function set_actionnumtel() {
    var isphone = is_phone_device();

    if (wasphone == isphone) {
        return;
    }
    wasphone = isphone;

    var list = get_elementsbyclassname(document, 'telnumaction');

    for (var i = 0; i < list.length; i++) {
        list[i].innerHTML = (isphone == true) ? "Appeler" : "Afficher";
    }
}

function resize_resume() {
    set_actionnumtel();
}

/* La vue resume */
function init_resume() {
    // init_identiteplus();
    // add_event(window, "resize", function(){init_identiteplus()});
    display_num(document.getElementById('identite'));
    add_event(window, "resize", function(){resize_resume()});
    set_actionnumtel();
}

/* La vue resume_etablissement */
function init_resume_etablissement() {
    // init_identiteplus();
    // add_event(window, "resize", function(){init_identiteplus()});
    add_event(window, "resize", function(){resize_resume()});
    set_actionnumtel();
}






function modif_aidesociete(id, url) {
    var link = document.getElementById('aidesocietelink');
    
    if (link) {
        link.onclick = function() {
            ga('send', 'event', 'fiche_produit_' + id, 'Acceder_au_service_bas');
        };
        link.href = url; 
    }

}


//function init_identiteplus() {
//    var text = document.getElementById('identitetext');
//    var link = document.getElementById('identitelien');
//    var plus = document.getElementById('identiteplus');
//    var tel = document.getElementById('identitetel');
//
//    if (is_phone_device()) {
//        move_block_before(link, plus, tel);
//    } else {
//        move_block(plus, text);
//    }
//}

/* Fonction permettant de boucler tant que la fonction existe pas */
function add_func(callback) {
    if (typeof(callback) == 'undefined') {
        setTimeout(function(){add_func(callback);}, 100);
    } else {
        callback();
    }
}

/* Permet à partir d'un string de créer la fonction avec le passage de paramètre */
function extract_func(name, param) {
    if (typeof(window[name]) == 'undefined') {
        setTimeout(function(){extract_func(name, param);}, 100);
    } else {
        var fonction = window[name](param);
        add_func(fonction);
    }
}


/********************************************************/
/******************** gestion ctn ***********************/
/********************************************************/
var ctn_unix = Math.round(+new Date() / 1000);
var ctn_siren = new Array();
var ctn_naf = new Array();
var ctn_custom = new Array();
var ctn_dirigeant = new Array();

function settrk(trk) {
    if (gettrk() >= 42) {
        return;
    }
    var d = new Date();
    d.setTime(d.getTime()+(393*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = "trk=" + trk + "; path=/; " + expires + "; domain=.societe.com;";
}

function gettrk() {
    var trk = "trk=";
    var ca = document.cookie.split(';');
    var c;
    var trackid;

    for (var i = 0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(trk) == 0) {
            trackid = parseInt(c.substring(trk.length, c.length));
            
            if (isNaN(trackid)) {
                trackid = 0;
            } 

            return(trackid);
        }
    }
    return(0);
}

function ctninit() {
    ctn_unix = Math.round(+new Date() / 1000);
    ctn_siren = new Array();
    ctn_naf = new Array();
    ctn_custom = new Array();
    ctn_dirigeant = new Array();
    if (typeof(ctn_cnt) == "undefined") {
        ctn_cnt = 0;
    }

    if (typeof(ctn_hit) == "undefined") {
        ctn_hit = 0;
    }
}

function ctn(pla, typ, src) {
    var ctn_url;
    var ref;

    if (ctn_cnt > 0 && gettrk() == null) {
        return;
    }
   
    ctn_url = "/cgi-bin/ctn?pla=" + pla + "&typ=" + typ + "&unix=" + ctn_unix + "&hit=" + ctn_hit;

    ref = document.referrer;
    for (var i = 0; i < ctn_siren.length; i++)
        if (ctn_siren[i] && ctn_siren[i].length != 0)
            ctn_url = ctn_url + "&sir=" + encodeURI(ctn_siren[i]);
    for (var i = 0; i < ctn_naf.length; i++)
        if (ctn_naf[i] && ctn_naf[i].length != 0)
            ctn_url = ctn_url + "&naf=" + encodeURI(ctn_naf[i]);
    for (var i = 0; i < ctn_custom.length; i++)
        if (ctn_custom[i] && ctn_custom[i].length != 0)
            ctn_url = ctn_url + "&cus=" + encodeURI(ctn_custom[i]);
    for (var i = 0; i < ctn_dirigeant.length; i++)
        if (ctn_dirigeant[i] && ctn_dirigeant[i].length != 0)
            ctn_url = ctn_url + "&dir=" + encodeURI(ctn_dirigeant[i]);
    ref = encode_to_hex(ref);
    ctn_url = ctn_url + "&cnt=" + ctn_cnt + "&ref=" + ref;

    if (src) {
        ctn_url += "&src=" + src;
    }

    ctn_cnt++;
    ctn_hit++;
    document.write('<scr' + 'ipt type="text/javascript" src="' + ctn_url + '"></scr' + 'ipt>');
    
    /* On reset les données indépendantes */
    ctninit();
}

function ctntest(pla, typ, src) {
    var ctn_url;
    var ref;

    if (ctn_cnt > 0 && gettrk() == null) {
        return;
    }
   
    ctn_url = "/cgi-bin/ctntest?pla=" + pla + "&typ=" + typ + "&unix=" + ctn_unix + "&hit=" + ctn_hit;

    ref = document.referrer;
    for (var i = 0; i < ctn_siren.length; i++)
        if (ctn_siren[i] && ctn_siren[i].length != 0)
            ctn_url = ctn_url + "&sir=" + encodeURI(ctn_siren[i]);
    for (var i = 0; i < ctn_naf.length; i++)
        if (ctn_naf[i] && ctn_naf[i].length != 0)
            ctn_url = ctn_url + "&naf=" + encodeURI(ctn_naf[i]);
    for (var i = 0; i < ctn_custom.length; i++)
        if (ctn_custom[i] && ctn_custom[i].length != 0)
            ctn_url = ctn_url + "&cus=" + encodeURI(ctn_custom[i]);
    for (var i = 0; i < ctn_dirigeant.length; i++)
        if (ctn_dirigeant[i] && ctn_dirigeant[i].length != 0)
            ctn_url = ctn_url + "&dir=" + encodeURI(ctn_dirigeant[i]);
    ref = encode_to_hex(ref);
    ctn_url = ctn_url + "&cnt=" + ctn_cnt + "&ref=" + ref;

    if (src) {
        ctn_url += "&src=" + src;
    }

    ctn_cnt++;
    ctn_hit++;
    document.write('<scr' + 'ipt type="text/javascript" src="' + ctn_url + '"></scr' + 'ipt>');
    
    /* On reset les données indépendantes */
    ctninit();
}
/* On execute ctn pour la première fois */
ctninit();

/********************************************************/
/*************** VIEW PRODUIT (DISPLAY / HIDE) *************/
/********************************************************/
var Ficheprod = function (id, id_label, id_obj, state) {
    this.id = id;
    this.label = id_label;
    this.obj = id_obj;
    this.state = state;
    this.ref;

    this.init = function() {
        if (!this.state) {
            hide_obj(document.getElementById(this.obj));
            document.getElementById(this.id).innerHTML = this.label;
        } else {
            display_obj_table(document.getElementById(this.obj));
            document.getElementById(this.id).innerHTML = '<i class="icon-minus-1"></i>Masquer';
        }
    }

    this.click = function() {
        var itemobj = this;
        add_event(document.getElementById(this.id), "click", function(){display_ficheprod(itemobj);});
    }
}

var prodtab = new Array();

function add_ficheprod(id, id_obj, state) {
    var elem = document.getElementById(id);
    if (elem) {
        var ficheprod = new Ficheprod(id, elem.innerHTML, id_obj, state);
        ficheprod.init();
        ficheprod.click();
        prodtab.push(ficheprod); 
    }
}

function display_ficheprod(itemobj) {
    if (itemobj) {
        display_or_hide_table(itemobj.obj);
        if (is_display(document.getElementById(itemobj.obj))) {
            document.getElementById(itemobj.id).innerHTML = '<i class="icon-minus-1"></i>Masquer';
        } else {
            document.getElementById(itemobj.id).innerHTML = itemobj.label;
        }
    }
}

/* La vue prod */
function display_prod(id_tab, id_button) {
    var btn = document.getElementById(id_button);
    var tab = document.getElementById(id_tab);

    if (tab && btn) {
        display_or_hide_table(id_tab);

        if (is_display(tab)) {
            btn.innerHTML = '<i class="icon-minus-1"></i>Masquer';
        } else {
            btn.innerHTML = '<i class="icon-plus-1"></i>En savoir plus';
        }
    } 
}


/* Variable globale panier */
var panier_posinit = 0;

/* Variable global minifiche */
var minifiche_posinit = 0;

var nbprod = 0;
var oldnbprod = -1;
var prod = new Array();
var pack = new Array();
var exclusions = new Array();
var included = new Array();
var panprod = new Array();
var reqbasket = new Array();
var reqpost = new Array();
var maxri = 4; /* 4 requetes simultanées */
var ri = 0;
var dheight = 0;
var dmin = 0;
var modtimer;
var MAX_BASKET = 20;


/* ========================= TAGS DE PUB ========================= */

/* ex: <div id="{plc}"><script type="text/javascript">pubsoc("{plc}");</script></div> */
/* ex: <script type="text/javascript">pubsoc("{plc}");</script> */

/* id pub adnext.fr */
_pubsoc_id = "89443";

/* charset des scripts */
_pubsoc_charset = "ISO-8859-1";

/* url adnext.fr */
_pubsoc_adnexturl = "http://adnext.fr/richmedia.adv";
_pubsoc_sociaux = "http://i.po.st/static/v3/post-widget.js#publisherKey=hs6cqd8k7j6uacfvipcq&retina=true";

/*
 * Emplacements possibles de la pub, nom de la DIV
 * Paramètre "&plc="
 * pubbanner = Bannière
 * PubPopup = popup flash (alias po(o)p up)
 * pubcarre = premier carré (ex. Home) <-> wide "angle"
 * PubAdsenseSousRecherche = pub Google sous le résultat de la recherche
 * PubAdsenseAuDessusChiffres = pub Google au dessus des chiffres clés sur l'identité
 * pubcarre2 = pub carré en dessous de la 1ere pub carre (identité)
 * PubTexteVM = pub texte en dessous de la bannière de recherche
 */
/* TEST MultiFormat in place of banner */
/*    "pubbanner":                     { "Code": 1, "Size": "big" }, */
var _pubsoc_plcs = {
    //"pubbanner":                     { "Code": 1, "Size": "big" }, 
    "pubbanner":                   { "Code": -1, "Size": "all", "Phone": false, "Tablet": true,  "Desktop" : true },
    "PubPopup":                    { "Code": 2,  "Size": "all", "Phone": true,  "Tablet": false, "Desktop" : true},
    "pubcarre":                    { "Code": 3,  "Size": "big", "Phone": false, "Tablet": false, "Desktop" : true},
    "PubAdsenseSousRecherche":     { "Code": 7,  "Size": "all", "Phone": false, "Tablet": false, "Desktop" : true},
    "PubAdsenseAuDessusChiffres":  { "Code": 9,  "Size": "all", "Phone": false, "Tablet": false, "Desktop" : true},
    "pubcarre2":                   { "Code": 12, "Size": "big", "Phone": false, "Tablet": false, "Desktop" : true},
    "PubTexteVM":                  { "Code": 31, "Size": "all", "Phone": false, "Tablet": false, "Desktop" : true},
    "pubmobile":                   { "Code": 15, "Size": "all", "Phone": true,  "Tablet": false, "Desktop" : false},
    "pubsociaux":                  { "Code": 0, "Size": "all", "Phone": false,  "Tablet": false, "Desktop" : true}
};

/*
 * Sections possibles
 */
var _pubsoc_section_home =      "home";
var _pubsoc_section_recherche = "search";
var _pubsoc_section_identite =  "fiche,identite";
var _pubsoc_section_bilan =  "fiche,bilan";
var _pubsoc_section_anafi =     "fiche,anafi_bilan_enquete";
var _pubsoc_section_carto =     "fiche,carto";
var _pubsoc_section_achat =     "fiche,achats";
var _pubsoc_section_dirigeant = "dirigeantsetactionnaires";
var _pubsoc_section_autres =    "autres";
var _pubsoc_section_publications = "publications";

/*
 * Tableau associatif des sections
 * la gestion des sections se fait :
 *  - soit par CGI (path complet du CGI)
 *  - soit par type de "répertoire"
 */
var _pubsoc_sections = {
    "/":                                    _pubsoc_section_home,
    "/cgi-bin/home":                        _pubsoc_section_home,
    "/cgi-bin/homedir":                     _pubsoc_section_home,
    "/cgi-bin/liste":                       _pubsoc_section_recherche,
    "/cgi-bin/listedir":                    _pubsoc_section_recherche,
    "/cgi-bin/search":                      _pubsoc_section_recherche,
    "/cgi-bin/searchdir":                   _pubsoc_section_recherche,
    "/cgi-bin/searchdir-avance":            _pubsoc_section_recherche,
    "/cgi-bin/fiche":                       _pubsoc_section_identite,
    "/cgi-bin/fichedir":                    _pubsoc_section_identite,
    "/societe/":                            _pubsoc_section_identite,
    "/dirigeant/":                          _pubsoc_section_identite,
    "/cgi-bin/anafi":                       _pubsoc_section_anafi,
    "/analyse-financiere/":                 _pubsoc_section_anafi,
    "/cgi-bin/carto":                       _pubsoc_section_carto,
    "/cgi-bin/bilan":                       _pubsoc_section_bilan,
    "/bilan/":                              _pubsoc_section_bilan,
    "/cgi-bin/vitrine":                     _pubsoc_section_achat,
    "/documents-officiels/":                _pubsoc_section_achat,
    "/pages/dirigeants-actionnaires.html":  _pubsoc_section_dirigeant,
    "/produits/liens-capitalistiques.html": _pubsoc_section_dirigeant,
    "/produits/dirigeants.html":            _pubsoc_section_dirigeant,
    "/publications/":                       _pubsoc_section_publications,
};

/*
 * Règles d'affichage de la pub
 */
var _pubsoc_sections_rules = {
    "home": {
        "pubbanner":  true,
        "pubcarre": true,
        "pubmobile": true,
        "PubPopup": true
    },
    "search": {
        "pubbanner":                  true,
        "pubcarre":                 true,
        "pubcarre2":                true,
        "PubTexteVM":               true,
        "PubAdsenseSousRecherche":  true,
        "pubmobile":                true,
        "PubPopup":                 true
    },
    "fiche,identite": {
        "pubbanner":                      true,
        "pubcarre":                     true,
        "pubcarre2":                    true,
        "PubTexteVM":                   true,
        "PubAdsenseAuDessusChiffres":   true,
        "pubmobile": true,
        "PubPopup":                     true,
        "pubsociaux":                     true
    },
    "fiche,bilan": {
        "pubbanner":                      true,
        "pubcarre":                     true,
        "pubcarre2":                    true,
        "PubTexteVM":                   true,
        "PubAdsenseAuDessusChiffres":   true,
        "pubmobile": true,
        "PubPopup":                     true
    },
    "fiche,anafi_bilan_enquete": {
        "pubbanner":      true,
        "pubcarre":     true,
        "pubcarre2":    true,
        "PubTexteVM":   true,
        "pubmobile": true,
        "PubPopup":     true
    },
    "fiche,carto": {
        "pubbanner":      true,
        "PubTexteVM":   true,
        "PubPopup":     true
    },
    "dirigeantsetactionnaires": {
        "pubbanner":      true,
        "pubcarre":     true,
        "pubcarre2":    true,
        "PubTexteVM":   true,
        "PubPopup":     true
    },
    "autres": {
        "pubbanner":      true,
        "pubcarre":     true,
        "pubcarre2":    true,
        "PubTexteVM":   true,
        "PubPopup":     true,
        "pubmobile": true
    },
    "publications": {
        "pubbanner":      true
    }
};



/* Variables à remplir si informations présentes */
var _pubsoc_categorie = "";
var _pubsoc_effectif = "";
var _pubsoc_chiffre = "";

/* ========================= TAGS DE PUB ========================= */
function _pubsoc_normalize(str) {
    var replacements = [
    { "rx": /[àâä]/g , "rp": "a" },
    { "rx": /[èéêë]/g , "rp": "e" },
    { "rx": /[îï]/g , "rp": "i" },
    { "rx": /[ôö]/g , "rp": "o" },
    { "rx": /[ùûü]/g , "rp": "u" },
    { "rx": /[\- ]/g , "rp": "_" },
    { "rx": /[^A-Za-z0-9_\-]/g , "rp": "" }
    ];
    var tmp = str;
    var index = 0;

    for (; index < replacements.length; index++) {
        tmp = tmp.replace(replacements[index].rx, replacements[index].rp);
    }
    return(tmp.toLowerCase());
}

function _pubsoc_effcode() {
    var _eff;

    _eff = parseInt(_pubsoc_effectif);
    if (isNaN(_eff)) {
        return(null);
    } else if (_eff > 0 && _eff <= 9) {

        return("Salarie1");
    } else if (_eff >= 10 && _eff <= 19) {

        return("Salarie2");
    } else if (_eff >= 20 && _eff <= 49) {

        return("Salarie3");
    } else if (_eff >= 50 && _eff <= 99) {

        return("Salarie4");
    } else if (_eff >= 100 && _eff <= 249) {

        return("Salarie5");
    } else if (_eff >= 250 && _eff <= 499) {

        return("Salarie6");
    } else if (_eff >= 500 && _eff <= 999) {

        return("Salarie7");
    } else if (_eff >= 1000 && _eff <= 4999) {

        return("Salarie8");
    } else if (_eff >= 5000) {

        return("Salarie9");
    }
}

function _pubsoc_cacode() {
    var _ca;

    _ca = parseFloat(_pubsoc_chiffre);
    if (isNaN(_ca)) {
        return(null);
    } else if (_ca > 0 && _ca <= 99999) {
        return("CA1");
    } else if (_ca >= 100000 && _ca <= 999999) {
        return("CA2");
    } else if (_ca >= 1000000 && _ca <= 9999999) {
        return("CA3");
    } else if (_ca >= 10000000 && _ca <= 99999999) {
        return("CA4");
    } else if (_ca > 0) {
        return("CA5");
    }
}

/*
 * Fonction "_pubsoc_hasrule"
 * Paramètres :
 *  - _ps_section, obligatoire : section, voir "_pubsoc_section_*"
 *  - _ps_plc, obligatoire: plc, voir "_pubsoc_plcs"
 * Retour:
 *  - null si pas de règle d'affichage, sinon true
 */
function _pubsoc_hasrule(_ps_section, _ps_plc) {
    var _rules;

    _rules = _pubsoc_sections_rules[_ps_section];
    if (_rules == null) {
        return null;
    }
    return(_rules[_ps_plc]);

}

function _pubsoc_check_device(plc) {
    if (is_phone_device()) {
        return (plc.Phone);
    } else if (is_tablet_device()) {
        return (plc.Tablet);
    } else {
        return (plc.Desktop);
    }
}

function _pubsoc_get_id() {
    var id;
    if (is_societe()) {
        if (is_phone_device()) {
            id = 100194;
        } else {
            id = 89443;
        }
    } else if (is_dirigeant()) {
        if (is_phone_device()) {
            id = 100809;
        } else {
            id = 99415;
        }
    } else {
        id = 89443;
    }

    return(id);
}

/*
 * Fonction "_pubsoc_createScript"
 * Paramètres :
 *  - args, obligatoire: arguments de la fonction appelante
 * Description: Creation de la balise script adnext
 */
function _pubsoc_createScript(args) {
    var _plc_div, _plc, _pathname, _section;
    var _elem, _url, _text;

    if (args.length == 0) {
        /* Voir paramètre obligatoire */
        return(null);
    }

    if (document.location.pathname == "/cgi-bin/pay-new") {
        /* Pas de pub sur l'espace client */
        return(null);
    }

    /* Récupération du plc */
    _plc_div = args[0];
    _plc = _pubsoc_plcs[_plc_div];
    if (_plc == null) {
        /* Voir les emplacements possibles dans le tableau associatif "_pubsoc_plcs" */
        return(null);
    }

    /* On rajoute les tests pour l'affichage mobile / ipad / desktop */
    if (!_pubsoc_check_device(_plc)) {
        return (null)
    }


    /* Récupération de la section */
    _pathname = document.location.pathname;
    if (_pubsoc_sections[_pathname] == null
            && _pathname.indexOf("/cgi-bin/") == -1) {
                _pathname = _pathname.substr(0, _pathname.lastIndexOf("/") + 1);
            }
    _section = _pubsoc_sections[_pathname];
    if (_section == null) {
        /* Si le path n'est pas dans le tableau associatif,
         * On considère qu'il s'agit d'une page "autres"
         */
        _section = _pubsoc_section_autres;
    } else if (_section == _pubsoc_section_home
            && document.location.pathname != "/"
            && document.location.pathname != "/index.shtml"
            && document.location.pathname != "/cgi-bin/index") 
    {
        /* "/" = "/index.shtml" */
        _section = _pubsoc_section_autres;
    }

    /* Affiche-t-on la pub ? */
    if (_pubsoc_hasrule(_section, _plc_div) == null) {
        return(null);
    }

    if (_plc_div == "pubbanner") {
        if (is_phone_device()) {
            return;
        } else if (is_tablet_device()) {
            _plc.Code = 1;
        } else {
            _plc.Code = 2;
            _section += ",testhabillage";
        }
    }
    
    /* Quand on est en mobile on a un autre id */
    _pubsoc_id = _pubsoc_get_id();

    if (_plc_div == "pubsociaux") {
        _url = _pubsoc_sociaux;
    } else {
        _url = _pubsoc_adnexturl + "?id=" + _pubsoc_id
            + "&plc=" + _plc.Code   
            + "&s=" + _plc.Size
            + "&section=" + _section;

        var _categorie  = _pubsoc_normalize(_pubsoc_categorie);
        if (_categorie != "") {
            _url += "," + _categorie;
        }

        var _effectif = _pubsoc_effcode();
        if (_effectif != null) {
            _url += "," + _effectif;
        }

        var _chiffre = _pubsoc_cacode();
        if (_chiffre != null) {
            _url += "," + _chiffre;
        }

        /* Timestamp pour gestion 20131218 */
        _url += "&ts=" + (new Date()).getTime();
    }

    var _text = "<script charset=\"" + _pubsoc_charset
        + "\" type=\"text/javascript\" src=\""
        + _url
        + "\"></script>";

    return(_text);
}
/*
 * Fonction "pubsoc"
 * Paramètres :
 *  - plc, obligatoire : emplacement, parmi les emplacements disponibles dans "_pubsoc_plcs"
 * Description: Affichage de la pub
 */
function pubsoc() {
    /* Retrait pour ie8- */
//    if (document.all && !document.addEventListener) {
//        return;
//    }
    var _script;
    var site = document.URL;

    if (site.indexOf("paiement.societe.com") != -1) {
        return;  
    }

    if (typeof(nopub) != "undefined" && nopub == 1) {
        return;
    }

    if ((_script = _pubsoc_createScript(arguments)) == null) {
        return;
    }

    document.write(_script);
}

/* Fonction permettant de déplacer les pubs au bon endroit */
var adnext_slots = ["pubbanner", "pubcarre", "pubcarre2", "pubsociaux"];

function GetDomOffset(Obj, Prop) { 
    var iVal = 0;
    while (Obj && Obj.tagName != 'BODY') {
        eval('iVal += Obj.' + Prop + ';');
        Obj = Obj.offsetParent;
    }
    return iVal;
}

function adnext_trackcleaner(container) {
    var adnext_container = document.getElementById(container);
    var adnext_imgElements = adnext_container.getElementsByTagName("img");
    for (var i=0; i<adnext_imgElements.length; i++) {
        if(adnext_imgElements[i].width == '1' && adnext_imgElements[i].height == '1') {
            adnext_imgElements[i].style.display = 'none';
        }
    }
}

function adnext_cssmove() {
    for(var j=0; j<adnext_slots.length; j++) {
        adslot_realid = adnext_slots[j] + '_media';
        if(document.getElementById(adnext_slots[j]) && document.getElementById(adslot_realid)) {
            adnext_trackcleaner(adslot_realid);
            document.getElementById(adslot_realid).style.position = 'absolute';
            document.getElementById(adnext_slots[j]).style.width = document.getElementById(adslot_realid).offsetWidth + 'px';
            document.getElementById(adnext_slots[j]).style.height = document.getElementById(adslot_realid).offsetHeight + 30 +'px';
            document.getElementById(adslot_realid).style.left = GetDomOffset(document.getElementById(adnext_slots[j]), 'offsetLeft')+'px';
            document.getElementById(adslot_realid).style.top = GetDomOffset(document.getElementById(adnext_slots[j]), 'offsetTop') + 'px';
        }
    }
}

if (window.addEventListener){
    window.addEventListener('resize', adnext_cssmove, false);
    window.addEventListener('load', adnext_cssmove, false);
    window.addEventListener('click', adnext_cssmove, false);
} else if (window.attachEvent) {
    window.attachEvent('onresize', adnext_cssmove);
    window.attachEvent('onload', adnext_cssmove);
    window.attachEvent('onclick', adnext_cssmove);
}

function init_pubs() {
    var site = document.URL;

    if (site.indexOf("paiement.societe.com") != -1) {
        return;  
    }

    var pub = document.getElementById('pubcontainer');
    if (pub) {
        pub.style.visibility = "visible";
    }

    add_event(window, "resize", resize_pub);

    move_block(document.getElementById('pubmobile_media'), document.getElementById('pubmobile'));
}

function resize_pub() {
    var pub = document.getElementById('pubcarre');
    var pub2 = document.getElementById('pubcarre2');
    
    if (!is_desktop_device()) {
        hide_obj(pub);
        hide_obj(pub2);
    } 
}


function init_gaq(notrackPageview) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-799512-1', 'auto');
    if (notrackPageview != 1) {
        ga('send', 'pageview');
    }
}

function isltIE9 () {
    return (document.all && !document.addEventListener);
}

