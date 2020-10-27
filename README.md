[Probleem](#probleem) | [Oplossing](#oplossing) | [Functies](#functies) | [Voorbeeld](https://spaghetti.haegepoorters.be/?email=webmaster@haegepoorters.be)

---
# spaghettiavond
Deze applicatie haalt data op van een Google Sheet die gekoppeld is aan een Form.

### Probleem
Door tijdgebrek was het niet mogelijk om nog zelf een volledig platform ineen te steken zodat mensen voor onze spaghettiavond konden bestellen. Daarom hadden we gebruik gemaakt van Google Forms om resultaten te verzamelen. Het probleem bij Google Forms is dat de mogelijkheden om data te verwerken heel beperkt zijn.
Om het totaal te tonen dat iemand moet betalen moesten we dus opzoek naar een alternatieve oplossing.

### Oplossing
We konden de resultaten van het formulier publiceren als CSV via een url, welke we dan konden fetchen in onze applicatie. Na het ophalen en het omzetten in JSON-data kunnen we verder aan de slag met deze gegevens.

Met behulp van serverless functions in Vercel konden we een api schrijven die bovenstaande handeling uitvoert en de JSON-data teruggeeft. In de url kunnen we het emailadres dat gekoppeld is aan de bestelling opgeven waarop de api alle bestellingen terug geeft onder dit adres. Daarnaast schreven we een interface die de bestellingen en het totaal dat de gebruiker moet betalen weergeeft.

Door gebruik te maken van een plugin in Google Forms hebben we wel de mogelijkheid om een gepersonaliseerd bericht te sturen met daarin de juiste url naar de detailpagina.

De volledige applicatie wordt gehost op Vercel en is gekoppeld aan een subdomein. Dit zorgt voor extra betrouwbaarheid op vlak van veiligheid en wat extra professionaliteit.

### Functies
- Persoonlijk overzicht bestellingen voor gebruiker
- Filteren op emailadres of ordernummer met behulp van parameters in url
- CRTL+F / CMD+F shortcut om nieuw emailadres op te geven
- Data aanpassen in gekoppeld Google Sheet en live weergeven in interface

[Hier](https://spaghetti.haegepoorters.be/?email=webmaster@haegepoorters.be) vind je een voorbeeld van zo'n bestelling.
