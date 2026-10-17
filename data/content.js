/*
  MUU SISÄLTÖ: jäsenet, galleria, videot ja varatut päivät.
  Tekstit (roolit, kuvaukset) ovat kielitiedostoissa data/i18n/fi.js ja en.js.
*/

// Bändin jäsenet ja DJ:t. roleKey viittaa kielitiedoston avaimeen.
window.EVERLESS_MEMBERS = [
  // Aakkosjärjestyksessä
  { name: "Ana",    roleKey: "role.vocals",       img: "assets/img/members/ana.webp" },
  { name: "Erik",   roleKey: "role.guitar",       img: "assets/img/members/erik.webp" },
  { name: "Jemina", roleKey: "role.vocals",       img: "assets/img/members/jemina.webp" },
  { name: "Juho",   roleKey: "role.drums",        img: "assets/img/members/juho.webp" },
  { name: "Julita", roleKey: "role.keys",         img: "assets/img/members/julita.webp" },
  { name: "Nixu",   roleKey: "role.bass",         img: "assets/img/members/nixu.webp" },
  { name: "Totti",  roleKey: "role.guitarVocals", img: "assets/img/members/totti.webp" },
];
window.EVERLESS_DJS = [
  { name: "Aspect", roleKey: "role.dj", img: "assets/img/members/jon.webp" },
  { name: "Alwar", roleKey: "role.dj", img: "assets/img/members/alex.webp" },
];

// Galleria. w/h = kuvan mitat (käytetään asettelun hyppimisen estämiseen).
window.EVERLESS_GALLERY = [
  { id: "barn-109", w: 1600, h: 1067, alt: "gallery.alt.barn" },
  { id: "barn-54",  w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "wedding-45", w: 1600, h: 1067, alt: "gallery.alt.wedding" },
  { id: "barn-55",  w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-58",  w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-138", w: 1600, h: 1067, alt: "gallery.alt.barn" },
  { id: "barn-141", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "wedding-46", w: 1600, h: 1067, alt: "gallery.alt.wedding" },
  { id: "barn-102", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-137", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-107", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "wedding-48b", w: 1600, h: 1067, alt: "gallery.alt.wedding" },
  { id: "barn-105", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-95",  w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-140", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-104", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-106", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-136", w: 1067, h: 1600, alt: "gallery.alt.barn" },
  { id: "barn-101", w: 1067, h: 1600, alt: "gallery.alt.barn" },
];

// Videot. Vie video YouTubeen (esim. listaamattomana) ja liitä tähän YouTube-tunnus.
// Tunnus on osoitteessa youtube.com/watch?v=TÄSTÄ_TULEE_TUNNUS
window.EVERLESS_VIDEOS = [
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", youtubeId: "ETzgYsCAyHc" },
  { title: "You're Gonna Go Far, Kid",    artist: "The Offspring",   youtubeId: "7olwNNpNZ38" },
];
