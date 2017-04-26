#!/usr/bin/env node

var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;
var fs = require('fs');

var express = require('express');

const NL = "\n";

const BIBLE_FILE = 'bible.xml';

const BOOK_LIST = {
  1: "1.Mose",
  2: "2.Mose",
  3: "3.Mose",
  4: "4.Mose",
  5: "5.Mose",
  6: "Josua",
  7: "Richter",
  8: "Rut",
  9: "1.Samuel",
  10: "2.Samuel",
  11: "1.Könige",
  12: "2.Könige",
  13: "1.Chronik",
  14: "2.Chronik",
  15: "Esra",
  16: "Nehemia",
  17: "Esther",
  18: "Hiob",
  19: "Psalmen",
  20: "Sprüche",
  21: "Prediger",
  22: "Hoheslied",
  23: "Jesaja",
  24: "Jeremia",
  25: "Klagelieder",
  26: "Hesekiel",
  27: "Daniel",
  28: "Hosea",
  29: "Joel",
  30: "Amos",
  31: "Obadja",
  32: "Jona",
  33: "Micha",
  34: "Nahum",
  35: "Habakuk",
  36: "Zefanja",
  37: "Haggai",
  38: "Sacharja",
  39: "Maleachi",
  40: "Matthäus",
  41: "Markus",
  42: "Lukas",
  43: "Johannes",
  44: "Apostelgeschichte",
  45: "Römer",
  46: "1.Korinther",
  47: "2.Korinther",
  48: "Galater",
  49: "Epheser",
  50: "Philipper",
  51: "Kolosser",
  52: "1.Thessalonicher",
  53: "2.Thessalonicher",
  54: "1.Timotheus",
  55: "2.Timotheus",
  56: "Titus",
  57: "Philemon",
  58: "Hebräer",
  59: "Jakobus",
  60: "1.Petrus",
  61: "2.Petrus",
  62: "1.Johannes",
  63: "2.Johannes",
  64: "3.Johannes",
  65: "Judas",
  66: "Offenbarung"
};

var app = express();
var doc = loadBible();

app.get('/get/:bnumber/:cnumber/:vnumber', function (req, res) {
  res.send(
    getVers(req.params.bnumber, req.params.cnumber, req.params.vnumber)
  );
});

app.get('/fish/:bnumber/:cnumber/:vnumber', function (req, res) {
  // Same as get but format as a fish list
  var result = getVers(req.params.bnumber, req.params.cnumber, req.params.vnumber);
  res.send(
     result.text + NL +
     result.book + NL +
     result.chapter + NL +
     result.vers + NL +
     //result.link + NL +
     result.next.book + NL +
     result.next.chapter + NL +
     result.next.vers
  );
});

app.listen(3055, function () {
  console.log('Jesaja server listening on port 3055!');
});


function loadBible() {
  return new dom().parseFromString(fs.readFileSync(BIBLE_FILE).toString());
}

function trim(string) {
  return string.trim();
}

function filter(node) {
  if (!node) return "---";
  resultString = "";
  for (i = 0; i < node.childNodes.length ;i++) {
    if (
      node.childNodes[i].nodeType == 3 // TEXT_NODE
      || node.childNodes[i].nodeName == "STYLE"
    ) {
      resultString += node.childNodes[i].textContent;
    }
  }
  return resultString;
}

function getVers(bnumber, cnumber, vnumber) {
  return {
    "text" : getVersText(bnumber, cnumber, vnumber),
    "book" : getBookName(bnumber),
    "chapter": cnumber,
    "vers": vnumber,
    "link": getBibServLink(getBookName(bnumber), cnumber, vnumber),
    "next": getNext(bnumber, cnumber, vnumber)
  }
}

function getVersText(bnumber, cnumber, vnumber) {
  return trim(
    filter(
      xpath.select(
        "//BIBLEBOOK[@bnumber='"+ bnumber +"']/CHAPTER[@cnumber='"+ cnumber +"']/VERS[@vnumber='"+ vnumber +"']", doc
      )[0]
    )
  );
}

function getBookName(bnumber) {
  return BOOK_LIST[bnumber];
}

function getNext(bnumber, cnumber, vnumber) {
  if (++vnumber > getHighest(xpath.select("//BIBLEBOOK[@bnumber='"+ bnumber +"']/CHAPTER[@cnumber='"+ cnumber +"']/VERS", doc), "vnumber")) {
    vnumber = 1;
    if (++cnumber > getHighest(xpath.select("//BIBLEBOOK[@bnumber='"+ bnumber +"']/CHAPTER", doc), "cnumber")) {
      cnumber = 1;
      if (++bnumber > getHighest(xpath.select("//BIBLEBOOK", doc), "bnumber")) {
        bnumber = 1;
      }
    }
  }
  return {
    "book": parseInt(bnumber),
    "chapter": parseInt(cnumber),
    "vers": parseInt(vnumber)
  }
}

function getHighest(nodes, attr) {
  // Reverse sort!
  var node = nodes.sort(function(a, b) {
    return b.getAttribute(attr) - a.getAttribute(attr);
  })[0];
  return node ? node.getAttribute(attr) : -1;
}

function getBibServLink(bname, cnumber, vnumber) {
  return 'https://www.bibleserver.com/text/NeÜ/'+bname+cnumber+'?ref='+bname+'%20'+cnumber+','+vnumber
}
