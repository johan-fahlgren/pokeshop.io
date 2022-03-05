# [PROJEKTARBETE JAVASCRIPT](https://github.com/PiaHagman/JavascriptProjektuppgift)

#### Co-coder : [Pia Hagman](https://github.com/PiaHagman)

<br/>

## Inledning

Tillsammans bestämde vi oss för utveckla en SPA med hjälp av TypeScript och dela upp frontend och backend i varsina filer. Resultatet blev en webbshop vi kallar för "PokeShop" och den hämtar design insperation från pokemonkort.

Projektet utgår från att använda [pokeapi.io](https://pokeapi.co/), en öppen API som innehåller objekt med all tänkbara information om Pokémons och deras universum.

<br/>

## Fetch()

PokeShop har en metod som heter `FetchPokemonURL()` och det är denna metod som är grunden i att hämta all pokemondata till vår sidan. Metoden börjar med att använda `fetch()`, med fetch måste vi skicka med vår sökväg till den resurs vi vill hämta.

Fetch'en är en asynkron metod för att hämta en resurs vilket är varför vi lägger `await` på den, await användes för att fetch metod ska jobba klart innan koden jobbar vidare i denna metod/funktion.

Den retunerar ett `promise` och ett promise kan ha tre olika lägen. Det första vi ser är `pending` vilket betyder att vi fortfarande väntar på ett svar. När sedan svaret kommer får vi antigen `fulfilled` vilket betyder att fetchen gick som förväntat och vi får med ett `value`, eller så får vi `rejected` att något gick fel och vi får med ett `error`.

När detta promise är klart omvandlas det till ett `Response` objekt. Det är en typ av "wrapper" för det hämtade response objektet. Resposen har lite olika `properties` som exempelvis en body och en header med t.ex. status, type, url.

Responsen har lite olika `metoder` kopplade till sig sam används för att bestämma hur en vill hatera denna response body. exempelvis:

- `json()` som tolkar om responsen body till JSON.
- `text()` som tolkar om response body till vanlig text.

För att hantera vår pokeapi response och omvandla den till ett .JSON objekt använder vi oss av `then()` med hjälp av en callback funktion som retunerar det som JSON.

Sedan sparar vi ner datan från JSON objekt ner till olika variabler som vi kan använda för att göra ny fetch metoder i vår kod.

<br/>

## Reflektioner

- Att pokeApin skickar med URLer för next och previous page med samma offset och limit som du använder vid ditt första anrop är verkligen smidigt för att koda vidare med en pagination eller liknande. Det blev variabler vi kunde spara ner direkt med vår `fetchPokemonURL()` metod.

- Väldigt nöjd med vår enkla search bar, det var något jag velat testa att koda ganska länge nu och vi löste det direkt tillsammans utan större problem. Alltid härligt när koden fungerar.

  Samtidigt var det svårt att bestämma sig för på vliken sida vi skulle hantera vår if-sats för om det var `number` || `string` vi fick med vårat `value`. å ena sidan känns det onödigt att kalla på `getPokemonId()` i glu-koden om vi fick in ett `number`. En enkel if skulle enkelt kunna hoppa över denna metod och bara kalla på den vid en `string`. Men samtidigt känndes det som att detta inte var något frontend skulle behöva tänka på.

- Vi började med att dela upp gluecode och logic delarna direkt i början av projektet, det har varit väldigt skönt. Att som jag gjorde i förra inlämningsuppgiften och mixa från början och sedan försöka dela upp var inte säskilt roligt.

- Vi hann inte riktigt klart med den men påbörjade en kundvagn. Det skulle vara roligt att få lite input på hur vi skulle hantera varibler som pris, antal av samma produkt och totalt med produkter i kundvagen. Det var något vi diskuterade och vi var nog båda lite osäkra på hur vi skulle spara denna data. Är det bäst att skapa en nya Array eller kan man "lika gärna" fylla på med nya variabler i vårat pokemonObj[]. Vart nog en blandning nu :).

<br/>

> Johan Fahlgren, 2022-03-05
