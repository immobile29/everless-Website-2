/*
  EVERLESS – SIVUSTON ASETUKSET
  Tämä on ainoa tiedosto, jota tarvitset teeman, yhteystietojen ja varausasetusten vaihtamiseen.
*/
window.EVERLESS_CONFIG = {
  // Ulkoasu: "western" (lato/länsi-henkinen) tai "modern" (neutraali moderni).
  // Esikatselu ilman muutosta tiedostoon: avaa sivu osoitteella  index.html?theme=modern
  theme: "western",

  // Oletuskieli ("fi" tai "en"). Vierailijan oma valinta tallentuu selaimeen.
  defaultLang: "fi",

  // Esikatselun salasanaportti. Selaimessa toimiva kevyt suojaus (ei oikea turva).
  // Aseta enabled: false, kun sivusto julkaistaan kaikille.
  // Uusi salasana: aja  printf %s "uusisalasana" | shasum -a 256  ja liitä tulos sha256-kenttään.
  gate: {
    enabled: true,
    sha256: "1eb69cb48eb9cc8ec1762d054ee52aff7bff0624e718972cc9918ffff93a5663",
  },

  contact: {
    email: "everlesstheband@gmail.com",
    instagram: "Everlesstheband", // käyttäjänimi ilman @-merkkiä
    area: { fi: "Etelä-Suomi", en: "Southern Finland" },
  },

  booking: {
    // Pyyntö on tehtävä vähintään näin monta kuukautta ennen tapahtumaa.
    minLeadMonths: 1,
    // Lomakkeen lähetys: FormSubmit.co lähettää viestin suoraan tähän osoitteeseen (ei tiliä).
    // Ensimmäisen lähetyksen jälkeen everlesstheband@gmail.com saa aktivointiviestin,
    // jonka linkkiä on painettava kerran. Tyhjä arvo = lomake avaa sähköpostiohjelman (mailto).
    formEndpoint: "https://formsubmit.co/ajax/everlesstheband@gmail.com",
  },

  // Repertuaarin esikuuntelut haetaan Applen iTunes Search API:sta (30 s).
  previews: {
    enabled: true,
    country: "FI", // kauppa, josta haetaan (FI löytää myös suomalaiset biisit)
  },
};
