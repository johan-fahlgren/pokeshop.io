# Projektarbete Javascript

_PokéShop, februari-mars 2022_<br>
_Pia Hagman och Johan Fahlgren_

<!-- [issue #13 - #16](https://github.com/PiaHagman/csharp-projektarbete/projects/1) -->

## Planering

Planeringen av vårt projekt gick smidigt. Jag och Johan känner varandra och har jobbat mycket tillsammans tidigare varför vi vet ungefär hur den andre jobbar. Vi ville båda göra en PokéShop genom PokeAPI:n och beslöt oss för att jobba på i början på projektet för att sedan ha tid kvar i slutet för bonusfunktioner. Vi ville båda testa TypeScript och jobba med minst två filer, en för glue-kod och en för logik. Vår design ville vi skulle likna Pokémon-kort. Om tid fanns ville vi även i detta projekt implementera localStorage för att kunna spara en påfylld kundvagn mellan sessioner.

### Möjliga förbättringar till nästa projekt

Om detta hade varit ett verkligt projekt i arbetslivet hade vi alldeles säkert lagt mer tid på planeringen och använda oss av issues och Kanban i GitHub. Men som alltid under utbildning måste det viktigaste för varje kurs prioriteras, därav fokuserade vi på att komma igång med kodandet och läsa på om API:n.

## Implementering

Implementeringen av vår PokéShop har gått smidigt och relativt smärtfritt. Vi har parkodat hela tiden med några få, små undantag och förökte fördela comittsen mellan oss. Vi gjorde alla web-api anrop tillsammans men förökte se till så att vi comittade minst en var. I övrigt följde vår implementering vår planering.

### Lösningar och beslut

Vårt program bygger på att vi hela tiden utgår från en url där vi efterfrågar 12 pokemons i taget i vår metod `fetchPokemonURL()`. Vi utnyttjar på så sätt API:ns funktion och sparar samtidigt ner nästa och föregående sida i våra variabler `getNextPage` och `getPreviousPage`. På så sätt kan vi enkelt gå en sida fram och en sida bak.  
<br><br>
I nästa steg `getPokemonData()` hämtar vi hem data om de tolv aktuella pokemonsen och sparar ner dem som objekt i vår array `pokemonObj[]`. Från denna array skriver vi sedan ut våra pokemonskort i main.js.
<br><br>
För att kunna hämta den lilla beskrivande texten till varje Pokémon krävdes ytterligare en fetch i metoden `fetchSpeciesData()`, liksom för att kunna söka på ett specifikt Pokèmon-namn eller id i `searchPokemon()`.

### Möjliga förbättringar av program

Generellt känner jag att vi har en bra riktning i vårt program och vi har inte förändrat vår grundidé speciellt mycket längs med vägen. Jag har därför lite svårt att se vilka stora förbättringar som skulle kunna göras på logiken.

En sak jag tänkt på ar att vi skulle behöva använda id- klass- och varibelnamn mer konsekvent och strukturerat. Kanske borde en redan i planeringsfasen bestämma sig för formen på de olika så att en inte behöver scrolla fram och tillbaka i sin egen kod för att dubbelkolla vad de olika delarna namngetts till. En liten detalj, men det känns som att det blir viktigare och viktigare ju större programmen blir.

Utöver ovan har vi en del TODO's i programmet som vi gärna skulle jobba vidare på.

## Beskrivning av tidsförloppen vid en fetch

När jag kallar på `fetchPokemonURL(pokeURL)` skickas en web-api-förfrågan som en get-request till en server om att få tillgång till den url som jag skickar in som argument. Det som returneras är ett promise-objekt som omvandlas till svaret på min request (response) som innehåller bland annat body och headers med exempelvis statuskod (ok = true om statuskoden är mellan 200-299). För att få tag på innehållet (body) i svaret så måste vi med `.then` använda svaret och kalla på en promise-baserad metod. I vårt fall response.json() som gör svaret till json-text och tolkar om det till ett javascript-objekt. Men det finns även andra metoder som response.text() som returnerar svaret som en textsträng och response.blob() som kan användas för binära filer. I vår variabel urlData ligger sedan vårt resultat under urlData.results.

## Sammantagen känsla av projektet

Härligt att jobba med Johan! Johan är grym på att söka information och har en tydlig bild av målet samtidigt som han är lyhörd för idéer. Han kan redan mycket, men vi lär oss också en hel del tillsammans och det varierar vem av oss som sitter på lösningarna eller vem som löser klurigheter och problem. Vi har debuggat en massa och klarat oss ganska bra utan att ta in hjälp utanför vår grupp. Johan är lika noga med detaljer som jag varför vi ibland nördar in oss på pixelnivå i css:en. Men det tycker vi båda är kul och jag har haft ett riktigt utvecklande projektarbete där jag lärt mig massor.
