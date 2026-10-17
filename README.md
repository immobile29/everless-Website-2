# Everless – verkkosivusto

Kaksikielinen (suomi / englanti) staattinen sivusto. Ei build-vaihetta eikä Node.js:ää: pelkkää HTML:ää, CSS:ää ja JavaScriptiä.

## Esikatselu omalla koneella

```bash
cd "Everless website"
python3 -m http.server 8123
```

Avaa selaimessa http://localhost:8123 . Toisen teeman voi esikatsella lisäämällä osoitteeseen `?theme=modern` tai `?theme=western`.

## Mitä mistäkin muokataan

| Haluan muuttaa... | Tiedosto |
| --- | --- |
| Teemaa (ilme), yhteystietoja, varauksen vähimmäisaikaa, lomakkeen osoitetta | `data/site.config.js` |
| Värejä, fontteja, pyöristyksiä | `css/themes.css` |
| Suomenkielisiä tekstejä | `data/i18n/fi.js` |
| Englanninkielisiä tekstejä | `data/i18n/en.js` |
| Repertuaaria (biisit) | `data/songs.js` |
| Jäseniä, DJ:itä, galleriaa, videoita | `data/content.js` |
| Ehtoja, kuvaajien nimiä, tapahtumatyyppejä | `data/i18n/fi.js` ja `en.js` (`terms.*`, `footer.photos`, `gallery.credit`, `services.event.*`) |
| Logoa, yläpalkkia ja alatunnistetta | `js/layout.js` (jaettu kaikille sivuille) ja `assets/favicon.svg` |

### Logo
Logo on tekstipohjainen (sana "Everless" teeman fontilla ja tähti-ikoni), joten se muuttuu teeman mukana. Voit vaihtaa sen omaan SVG-tiedostoon korvaamalla `.logo`-lohkon (`js/layout.js`) sisällön `<img src="assets/logo.svg" alt="Everless">`-elementillä.

### Teeman vaihto
`data/site.config.js`: `theme: "western"` tai `theme: "modern"`.

### Sivut
Sivusto on kolmisivuinen: `index.html` (etusivu: palvelut, genret, ehdot ja lomake), `galleria.html` (kokoonpano, DJ:t, kuvat, videot) ja `repertuaari.html` (biisit). Yläpalkki ja alatunniste tulevat tiedostosta `js/layout.js`. Kalenteria ei ole: lomakkeen päivävalitsin estää menneet päivät ja alle `booking.minLeadMonths` kuukauden päässä olevat päivät.

### Videot
1. Vie videot YouTubeen (esim. listaamattomana).
2. Kopioi osoitteesta `youtube.com/watch?v=TÄMÄ` tunnus ja liitä se kohtaan `youtubeId` tiedostossa `data/content.js`.

Huom: alkuperäiset videot ovat kansiossa `Reference songs/` (n. 4 Gt) eikä niitä julkaista sivuston mukana (`.gitignore`). Tarkista, näkyykö videoilla yleisön kasvoja selvästi, ja sumenna ne tarvittaessa ennen julkaisua.

### Yhteydenottolomake
Lomake lähettää viestin suoraan osoitteeseen `everlesstheband@gmail.com` palvelun FormSubmit.co kautta (`booking.formEndpoint` tiedostossa `data/site.config.js`). Ensimmäisen lähetyksen jälkeen osoite saa aktivointiviestin, jonka linkkiä pitää klikata kerran. Tämän jälkeen jokainen pyyntö tulee sähköpostiin taulukkomuodossa. Jos kenttä on tyhjä, lomake avaa sähköpostiohjelman (mailto).

### Repertuaarin kuuntelupätkät
Pätkät haetaan Applen iTunes Search API:sta (30 s) vasta kun vierailija painaa toistopainiketta, ja ne tallentuvat selaimen välimuistiin. Jos biisille ei löydy pätkää, toistopainike harmaantuu.
Yksittäisen biisin voi korjata `data/songs.js`:ssä: `q` (oma hakusana), `previewUrl` (oma äänitiedosto) tai `noPreview: true`.

### Kuvat
Alkuperäiset kuvat jäävät omiin kansioihinsa. Verkkokokoiset kuvat tuotetaan komennolla `python3 tools/optimize_images.py` (vaatii Pythonin Pillow-kirjaston) kansioon `assets/img/`. Uuden galleriakuvan lisäys: lisää kuva skriptin listaan, aja skripti ja lisää rivi tiedostoon `data/content.js` (`EVERLESS_GALLERY`).

## Julkaisu
Sivusto on pelkkiä staattisia tiedostoja, joten sen voi julkaista esimerkiksi Netlifyssä, Vercelissä, GitHub Pagesissa tai Cloudflare Pagesissa. Lataa kansio (ilman `Reference songs/`-kansiota ja alkuperäisiä kuvakansioita) palveluun.

## Esikatselun jakaminen (Netlify Drop) ja salasana
1. Aja `python3 tools/build_deploy.py`. Se kokoaa kansion `deploy/` (vain sivuston tiedostot).
2. Vedä `deploy/`-kansio sivulle https://app.netlify.com/drop ja kirjaudu Netlifyyn. Saat osoitteen muotoa `https://jokin-nimi.netlify.app`.
3. Sivulla on salasanaportti (`gate` tiedostossa `data/site.config.js`, nyt `everless2026`). Se on selaimessa toimiva kevyt suojaus, ei oikea turva. Kun sivusto julkaistaan oikeasti, aseta `gate.enabled: false`, aja build uudelleen ja vedä kansio Netlifyyn uudelleen. Jos käytät samaa sivustoa (Site configuration), päivitys säilyttää osoitteen.
