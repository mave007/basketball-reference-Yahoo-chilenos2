## Extensión para Chrome Basketball-Reference para Liga chilenos2 en Yahoo

Basado en la extension de RotoGrinders BasketballReference.
Extension para Google Chrome que agrega columna "YH" en los stats de Jugadores del sitio [Basketball-Reference.com](http://www.basketball-reference.com), con un indicador de color estilo heat-map.

### Modo de instalación:
- Bajar la ultima version del CRX desde https://github.com/mave007/basketball-reference-Yahoo-chilenos2/blob/master/basketball-reference-Yahoo-chilenos2.crx?raw=true
- Activar el modo developer en [chrome://extensions](chrome://extensions/)
- Arrastrar el CRX a esa misma carpeta.

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
- [ ] En el boxscore de un partido, hay que ignorar el valor en "Team totals", ya que en vez de ser la suma de la columna YH, trata de calcular como si se tratara de un jugador más, y lo ve en el listado de suplentes.
- [x] En Per Game de jugadores en una temporada, parece haber 5 puntos extras (ejemplo: http://goo.gl/WLuklH ) ~~ FIXED

### References:
- https://rotogrinders.com/pages/rotogrinders-daily-fantasy-browser-extensions-245335
- https://github.com/nickyvu/basketball-reference-dfs
- http://www.basketball-reference.com

### Disclaimer:
Agradecimientos a GM de Grand Wizzard por los fixes y desarrollo.

### ChangeLog:
- Version 1.4.1: 20191219 Ajustando HeatMap de colores
- Version 1.4.0: 20191203 Version 2019-20
- Version 1.2.0: 20151028 Agregado stats para Projections, cambio de formula a temporada 2015-2016
- Version 1.1.3: 20150312 Minor fixes, new color scheme
- Version 1.0.0: 20150219 First version
