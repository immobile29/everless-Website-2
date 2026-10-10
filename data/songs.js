/*
  REPERTUAARI
  Lisää tai poista biisejä muokkaamalla listoja. Kentät:
    artist, title   – näytettävät nimet
    q               – (valinnainen) oma hakusana esikuuntelun löytämiseksi
    previewUrl      – (valinnainen) suora osoite omaan 30 s äänitiedostoon, ohittaa iTunes-haun
    noPreview: true – (valinnainen) piilottaa toistopainikkeen tältä biisiltä
*/
window.EVERLESS_SONGS = {
  pop: [
    { artist: "ABBA", title: "Does Your Mother Know" },
    { artist: "Britney Spears", title: "...Baby One More Time" },
    { artist: "Kaija Koo", title: "Supernaiset" },
    { artist: "Kaija Koo", title: "Tinakenkätyttö" },
    { artist: "Katy Perry", title: "Last Friday Night (T.G.I.F.)" },
    { artist: "Natasha Bedingfield", title: "Unwritten" },
    { artist: "Pepe Willberg & The Paradise", title: "Aamu" },
    { artist: "PMMP", title: "Rusketusraidat" },
    { artist: "Ronan Keating", title: "When You Say Nothing at All" },
    { artist: "Samuli Putro", title: "Olet puolisoni nyt" },
    { artist: "Tapani Kansa", title: "Auringon lapset" },
    { artist: "Taylor Swift", title: "Love Story (Taylor's Version)" },
    { artist: "Virve Rosti", title: "Sata salamaa" },
    { artist: "Whitney Houston", title: "I Wanna Dance with Somebody (Who Loves Me)" },
  ],
  rock: [
    { artist: "AC/DC", title: "Highway to Hell" },
    { artist: "Dire Straits", title: "Lady Writer" },
    { artist: "Dire Straits", title: "Sultans of Swing" },
    { artist: "Eppu Normaali", title: "Murheellisten laulujen maa" },
    { artist: "Eric Clapton", title: "Layla" },
    { artist: "Eric Clapton", title: "Layla (Acoustic Live)", q: "Eric Clapton Layla Unplugged" },
    { artist: "Eric Clapton", title: "Wonderful Tonight" },
    { artist: "Franz Ferdinand", title: "Take Me Out" },
    { artist: "J. Karjalainen & Mustat Lasit", title: "Hän" },
    { artist: "J. Karjalainen & Mustat Lasit", title: "Sekaisin" },
    { artist: "Linkin Park", title: "New Divide" },
    { artist: "Lynyrd Skynyrd", title: "Sweet Home Alabama" },
    { artist: "Metallica", title: "Enter Sandman" },
    { artist: "Metallica", title: "For Whom the Bell Tolls" },
    { artist: "Muse", title: "Supermassive Black Hole" },
    { artist: "Pearl Jam", title: "Black" },
    { artist: "Radiohead", title: "Creep" },
    { artist: "Red Hot Chili Peppers", title: "Californication" },
    { artist: "Stevie Ray Vaughan", title: "Mary Had a Little Lamb" },
    { artist: "Sublime", title: "Santeria" },
    { artist: "Sunrise Avenue", title: "Hollywood Hills" },
    { artist: "The Offspring", title: "You're Gonna Go Far, Kid" },
    { artist: "Wheatus", title: "Teenage Dirtbag" },
  ],
  country: [
    { artist: "Chris Norman & Suzi Quatro", title: "Stumblin' In" },
    { artist: "Creedence Clearwater Revival", title: "Proud Mary" },
    { artist: "Ennio Morricone", title: "The Good, the Bad and the Ugly (instrumental)", q: "Ennio Morricone The Good, the Bad and the Ugly" },
    { artist: "Glen Campbell", title: "Rhinestone Cowboy" },
    { artist: "Gordon Lightfoot", title: "The Wreck of the Edmund Fitzgerald" },
    { artist: "John Denver", title: "Annie's Song" },
    { artist: "Johnny Cash", title: "Folsom Prison Blues" },
    { artist: "Johnny Cash", title: "Ring of Fire" },
    { artist: "Marty Robbins", title: "Big Iron" },
    { artist: "The Highwaymen", title: "Highwayman" },
    { artist: "Tom T. Hall", title: "I Like Beer" },
  ],
};
