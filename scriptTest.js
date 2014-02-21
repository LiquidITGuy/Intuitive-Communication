/*jslint browser:true */
/*jslint plusplus: true */
/*global document: false */
/*global console: false */
/*global window: false */
/*global ActiveXObject: false */
/*global xhr: true */
/*global debug: true */
/*global audio: true */
/*global divPicto: true */
/*global base: true */
/*global sid: true */
/*global sessionid: true */
var audios, xhr, divPhrase, divPicto, a, base, debug, sid, sessionid;

function tmp() {
	"use strict";
    xhr.onreadystatechange = function () { actualisationAutomatique(this); };
	xhr.open('GET', base + 'modele/light.php?PHPSESSID=' + sessionid + '&sid=' + sid , true);
	//xhr.setRequestHeader( 'Set-Cookie' , 'PHPSESSID='+sid );
	//xhr.setDisableHeaderCheck(true);	
	//xhr.setRequestHeader( 'Cookie' , 'session='+sid ); 
	xhr.send(null);
}

/**
*@brief Initialise la session d'utilisateur de l'application
*@Author Simon Belbeoch
*@TODO sécuriser appels distants
*@Version 0.2 alpha
*@date 10/01/2014
**/
function initializeSID() {
	"use strict";
		var xmlhttp2;
		xmlhttp2 = new XMLHttpRequest();

		xmlhttp2.onreadystatechange = function () {
			if (xmlhttp2.readyState === 4 && xmlhttp2.status === 200) {	
				sessionid = xmlhttp2.responseText;
				localStorage["sessionid"] = sessionid;
	if (localStorage.sid === null || localStorage.sid === undefined) {
		var xmlhttp;
		xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				sid = xmlhttp.responseText;
				localStorage["sid"]  = sid;
				tmp();

			}
		};
		xmlhttp.open('GET', base + 'modele/log2.php', true);
		xmlhttp.send();
	} else {
		sid = localStorage["sid"];
		tmp();

	}
			}
		};
		xmlhttp2.open('GET', base + 'modele/log.php', true);
		xmlhttp2.send();
}

/**
*@brief initialise toutes les variables
*@Author Simon Belbeoch
*@Version 0.9 beta alpha
**/
function initializeVariable() {
    "use strict";
    audios = [];
	base = "http://ci.worldheberg.com/";
    xhr = new XMLHttpRequest();
    divPhrase = "phrase";
    divPicto = "picto";
}

/**
*@brief teste si une image existe déjà avec le alt dans une div
*@describe la verification se fait par le alt
*@Author Simon Belbeoch
*@Version 0.9 beta alpha
*@param[in]: texte : contenu du alt de l'image
*@param[in]: nomDic : nom de la div contenant les images sur la page
*@return : bool indiquant si l'image est non présente (true = image absente)
**/
function imageNonPresente(texte, nomDiv) {
    "use strict";
    var divTestee, nbElements, i;
	divTestee = document.getElementById(nomDiv).children;
    nbElements = divTestee.length;
	for (i = 0; i < nbElements; i++) {
		if (texte === divTestee[i].alt) {
			return false;
		}
	}
    return true;
}

/**
*@brief créé une image et l'initialise
*@Author Simon Belbeoch
*@Version 0.3 alpha
*@param[in] : src : adresse de l'image
*@param[in] : alt : texte de remplacement de l'image
*@param[in] : fonction: fonction à attribuer au clic sur l'image
*@return : image au format element html
**/
function createImageBase(src, alt, classe, fonction) {
    "use strict";
    var image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    image.className = classe;
    image.onclick = fonction;
    return image;
}

/**
*@brief Complete une image avec les informations du pictogramme
*@Version 0.3 alpha
*@TODO programmer la fonction
**/
function completePicto(image, id, texte, audio) {
	"use strict";
}

/**
*@brief ajoute l'image a une div après avoir vérifié qu'elle n'existait pas déjà si nécéssaire
*@Author Simon Belbeoch
*@Version 0.3 alpha
*@param[in] : image : image à ajouter à la div
*@param[in] : nomDiv :div dans laquelle on souhaite ajouter l'image
*@param[in] : testerExistance : boolean indiquant si on insere l'image dans la div si elle y est déjà présente
*@return : boolean indiquant si l'insertion à eu lieu
**/
function ajoutImageDiv(image, nomDiv, testerExistance) {
    "use strict";
    var inserer, div;
    inserer = true;
    div = document.getElementById(nomDiv);
    if (testerExistance) {
        inserer = imageNonPresente(image.alt, nomDiv);
    }
    if (inserer) {
        div.appendChild(image);
    }
	if (!inserer) {
		return inserer;
	}
	return image;
}


function ajoutTexteImage(image) {
    "use strict";
	var a, z;
	a = document.getElementById("contentOfText");
	z = document.createElement("span");
	z.className = "legende";
	//z.onClick = document.getElementById(z.dataset.img).click();
	// z.onClick = console.log(z);
	z.onClick = debug = z.dataset.img;
	z.style.top = image.offsetTop + "px";
	z.style.left = (image.offsetLeft + 20) + "px";
	z.innerHTML = image.dataset.ecrit;
	a.appendChild(z);
}

/**
*@brief créé l'image et la met dans la div
*@Author Simon Belbeoch
*@Version 0.3 alpha
*@TODO tester la fonction
*@param[in] : src : adresse de l'image
*@param[in] : alt : texte de remplacement de l'image
*@param[in] : classe :  style à appliquer à l'image (classe)
*@param[in] : fonction: fonction à attribuer au clic sur l'image
*@param[in] : nomDiv :div dans laquelle on souhaite ajouter l'image
*@param[in] : testerExistance : boolean indiquant si on insere l'image dans la div si elle y est déjà présente
*@return : boolean indiquant si l'insertion à eu lieu
**/
function creerImageComplet(src, alt, classe, fonction, nomDiv, testerExistance) {
    "use strict";
    var image;
    image = createImageBase(src, alt, classe, fonction);
    return ajoutImageDiv(image,  nomDiv, testerExistance);
}


/**
*@brief Mise a jour du contenu grace au xhr
*@Author Simon Belbeoch
*@Version 0.314 gamma
*@param[in] : mot : categories suivant le mot
*@param[in] : text : mot précédant le mot actuel
*@TODO : donner le mot actuel pour enregistrement en bdd
**/
function majContenu(mot, text) {
    "use strict";
	// cf : initialisation qui defini le xhr
	xhr.open('GET', base + 'modele/light.php?cat=' + mot + '&PHPSESSID=' + sessionid + '&sid=' + sid + '&motPrec=' + text + '&pers=' + document.getElementById("phrase").children[0].dataset.id, true);
	//xhr.setRequestHeader( 'Set-Cookie' , 'PHPSESSID='+sid ); 
	xhr.send(null);
}

/**
*@brief Vide un element HTML de tous ses fils
*@author Simon Belbeoch
*@Version 0.3
*@param[in] : nomDiv : id de l'élément à vider
*@return : nombre d'élements supprimés
**/
function viderConteneur(nomDiv) {
    "use strict";
	var conteneur;
    conteneur = document.getElementById(nomDiv);
	if (conteneur.children !== null) {
		while (conteneur.children.length > 0) {
			conteneur.removeChild(conteneur.children[0]);
		}
	}
}

/**
*@brief Action à la selection d'un pictogramme
*@Author Simon Belbeoch
*@Version 0.31 beta
*@param[in] : o : objet déclencheur de la séléction
**/
function selectionnePicto(o) {
    "use strict";
    ajoutImageDiv(o, divPhrase, false);
	o.onclick = function () { retourMot(); };
    viderConteneur(divPicto);
	viderConteneur("contentOfText");
	majContenu(o.dataset.suite, o.dataset.id);
}



/**
*@brief Initialise le tableau des pictogrammes
*@Author Simon Belbeoch
*@Version 0.31 beta
*@TODO Plein de trucs
**/
function initializeImages(tableau) {
    "use strict";
	var  existant, i, conteneur, image, fonction;
    fonction = function () { selectionnePicto(this); };
	
	image = creerImageComplet(tableau.image, tableau.id, "picto", fonction, divPicto, true);
	image.dataset.id = tableau.id;
	image.dataset.suite = tableau.suite;
	image.dataset.audio = tableau.son;
	image.dataset.ecrit = tableau.ecriture;
}

function playSound(nbSon) {
	"use strict";
	var a;
	if (nbSon === 0 || audios === null || audios[(nbSon - 1)].played.length === 1) {
		a = audios[nbSon];
		a.volume = 1;
		a.play();
	}
}


function makeAttente() {
    "use strict";
	var i, o, taille;
	taille = audios.length;
	for (i = 0; i < taille - 1; i++) {
		o = audios[i];
        (function (arg1) {
            o.addEventListener('ended', function () {
                playSound(arg1 + 1);
            }, false);
        })(i);
    }
    o = audios[i];
    if (!o.loadeddata) {
        o.addEventListener('loadeddata', playSound(0), false);
    } else {
        playSound(0);
    }
}

function closePhrase() {
	"use strict";
	var a, z;
	z = document.getElementsByTagName("html");
	a = document.getElementById("font");
	z = z[0];
	z.removeChild(a);
}

function affiche(phrase) {
	"use strict";
    var a, z, e, b;
	e = document.getElementsByTagName("html");
	e = e[0];
	a = document.createElement("div");
	z = document.createElement("div");
	b = document.createElement("button");
	b.id = "validation";
	b.innerHTML = "OK";
	a.appendChild(z);
	a.id = "font";
	z.id = "popup";
	z.innerHTML = phrase;
	z.appendChild(b);
	a.onclick = function () { closePhrase(); };
	z.onclick = function () { closePhrase(); };
	e.appendChild(a);
}


function listen() {
    "use strict";
    var listO, phrase, i, nbElem, source;
    listO = document.getElementById(divPhrase).children;
	phrase = "";
	audios = [];
    nbElem = listO.length;
	
	for (i = 0; i < nbElem; i++) {
		audios[i] = document.createElement('audio');
        source =  document.createElement('source');
        if (audios[i].canPlayType('audio/ogg')) {
            source.src = listO[i].dataset.audio + ".ogg";
            source.type = "audio/ogg";
        } else {
            source.setAttribute('src', listO[i].dataset.audio + ".mp3");
            source.setAttribute('type', "audio/mpeg");
        }
        audios[i].appendChild(source);
        phrase += listO[i].dataset.ecrit + " ";
	}
	makeAttente();
	affiche(phrase);
}

function makeSuite(noMot, images, suites) {
    "use strict";
    var i;
    for (i = 0; i < suites.length; i++) {
        if (suites[i].attributes !== null) {
            images[noMot].suite += ", " + suites[i].firstChild.nodeValue;
        }
    }
}

/**
*@brief Initialise le modèle à partir d'un xml chargé (node contenu)
*@Author Simon Belbeoch
*@Version 0.31 beta
*@date 09/05/2013
*@TODO Plein de trucs + reduire la complexité
**/
function initializeModele(mots) {
    "use strict";
    var i, images, noMot, node, suites;
    images = [];
    noMot = 0;
    for (i = 0; i < mots.childNodes.length; i++) {
        node = mots.childNodes[i];
        if (node.nodeName !== "#text" && node.attributes !== null) {
            images[noMot] = [];
            images[noMot].id = node.getElementsByTagName('i')[0].firstChild.nodeValue;
            images[noMot].image = "img/" + node.getElementsByTagName('im')[0].firstChild.nodeValue + ".jpg";
            images[noMot].nom = node.getElementsByTagName('n')[0].firstChild.nodeValue;
            images[noMot].ecriture = node.getElementsByTagName('e')[0].firstChild.nodeValue;
            images[noMot].son = "audio/" + node.getElementsByTagName('so')[0].firstChild.nodeValue;
            images[noMot].suite = '0';
            
            suites = node.getElementsByTagName('s');
            makeSuite(noMot, images, suites);
            noMot++;
        }
    }
    return images;
}

function addText() {
	"use strict";
	var i, j, conteneur;
	i = 0;
	conteneur = document.getElementById("picto");
    j = conteneur.children.length;
    while (i < j) {
        ajoutTexteImage(conteneur.children[i]);
        i++;
    }
}

function actualisationAutomatique(xhr) {
    "use strict";

    var XML, i, images, mots, conteneur;
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
        images = [];
        XML = xhr.responseXML;
        mots = XML.getElementsByTagName('c')[0];
        images = initializeModele(mots);
        for (i = 0; i < images.length; i++) {
            initializeImages(images[i]);
        }
	    addText();
	}
}
/**
*@brief Initialise la page
*@Author Simon Belbeoch
*@TODO appeler la fonction d'initialisation d'image
*@TODO faire script retour arriere
*@TODO faire appel image dans php
*@Version 0.3 alpha
*@date 17/04/2013
**/
function initialize() {
    "use strict";
	initializeVariable();
	initializeSID();
	viderConteneur(divPicto);
	viderConteneur(divPhrase);
	viderConteneur("contentOfText");
}

/**
*@brief repère un scroll sur les pictogrammes
*@Author Simon Belbeoch
*@Version 0.1 alpha
*@date 22/02/2014
**/
function scroll(oEvent) {
	"user strict";
    console.log(oEvent);
}

/**
*@brief retourne en arrière d'un mot
*@Author Simon Belbeoch
*@Version 0.5 beta
*@date 26/12/2013
**/
function retourMot() {
    "use strict";
    var contain, image;
	contain = document.getElementById(divPhrase);
	if (contain.children.length === 1) {
		initialize();
	} else {
		contain.removeChild(contain.children[contain.children.length - 1]);
		selectionnePicto(contain.children[contain.children.length - 1]);
	}
}

