## Extensión para Chrome y Firefox de sitios Basketball-Reference y StatHead para Liga chilenos2 en Yahoo

Basado en la extension de RotoGrinders BasketballReference.
Extension para Google Chrome y Mozilla Firefox que agrega columna "YH" en los stats de Jugadores del sitio [Basketball-Reference.com](http://www.basketball-reference.com) 
y [StatHead](https://stathead.com/basketball) con un indicador de color estilo heat-map.

### Modo de instalación:

#### Opción 1: Chrome Web Store (Recomendado)
- **Próximamente:** La extensión estará disponible en Chrome Web Store
- Instalación con un click y actualizaciones automáticas

#### Opción 2: Desarrollo/Testing (Mientras tanto)
- Si usas **Google Chrome**:
  1. Descarga o clona este repositorio
  2. Abre `chrome://extensions/`
  3. Activa "Modo de desarrollador" (Developer mode)
  4. Click en "Cargar extensión sin empaquetar" (Load unpacked)
  5. Selecciona la carpeta del repositorio

- Si usas **Mozilla Firefox**:
  1. Descarga o clona este repositorio
  2. Abre `about:debugging#/runtime/this-firefox`
  3. Click en "Cargar complemento temporal..." (Load Temporary Add-on)
  4. Selecciona el archivo `manifest.json`

#### Opción 3: Build desde código (Desarrolladores)
Ver [BUILD_GUIDE.md](BUILD_GUIDE.md) para instrucciones completas de construcción y distribución. 

#### Ejemplos:
- GameLog de un jugador en una temporada: 
  - http://www.basketball-reference.com/players/w/whiteha01/gamelog/2015/#pgl_basic::none
- Box Score de un partido: 
  - http://www.basketball-reference.com/boxscores/201502060ATL.html
- Promedios anuales de un jugador: 
  - http://www.basketball-reference.com/players/j/jordami01.html#per_game::none
- Promedios temporada 2014-2015 todos los jugadores:
  - http://www.basketball-reference.com/leagues/NBA_2015_per_game.html


### Known bugs:
- [x] ~~Resultado inflado por no saber calcular si un jugador es titular o no.~~ FIXED
- [x] En el game log anual de un jugador, el valor de "median" es un poco menor que el promedio aritmetico. No revisé (y no entendí bien) esa función. Sin embargo, cuando el jugador jugó los 82 partidos del año, ahi coinciden los valores Median y Promedio per game.
- [x] ~~En el boxscore de un partido, hay que ignorar el valor en "Team totals", ya que en vez de ser la suma de la columna YH, trata de calcular como si se tratara de un jugador más, y lo ve en el listado de suplentes.~~ FIXED v2.0.0
- [x] En Per Game de jugadores en una temporada, parece haber 5 puntos extras (ejemplo: http://goo.gl/WLuklH ) ~~ FIXED

### References:
- https://rotogrinders.com/pages/rotogrinders-daily-fantasy-browser-extensions-245335
- https://github.com/nickyvu/basketball-reference-dfs
- http://www.basketball-reference.com

### Disclaimer:
Agradecimientos a los fantasy GM de Grand Wizzard y cero32 por desarrollo y patches

### ChangeLog:
- Version 2.0.0: 20251112 Major refactor - Manifest V3, removed jQuery dependency, modernized to ES6+, added configuration system, improved error handling, fixed Team Totals bug, optimized performance with caching
- Version 1.5.0: 20210304 Añadiendo soporte para STATHEAD e instrucciones para Firefox
- Version 1.4.1: 20191219 Ajustando HeatMap de colores
- Version 1.4.0: 20191203 Version 2019-20
- Version 1.2.0: 20151028 Agregado stats para Projections, cambio de formula a temporada 2015-2016
- Version 1.1.3: 20150312 Minor fixes, new color scheme
- Version 1.0.0: 20150219 First version

### What's New in v2.0.0:
- **Manifest V3**: Updated to latest Chrome extension standard (future-proof until 2025+)
- **Zero Dependencies**: Removed jQuery (~85KB savings), now using vanilla JavaScript
- **Modern ES6+**: Refactored with classes, arrow functions, const/let, template literals
- **Configuration System**: Easy to update scoring rules for different seasons
- **Better Code Quality**: Added error handling, JSDoc comments, constants instead of magic numbers
- **Performance**: Implemented header caching to reduce DOM queries
- **Bug Fixes**: Fixed Team Totals calculation in box scores
- **Smaller & Faster**: Reduced file size and improved load times
