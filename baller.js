var StatRow = {
  initialize: function($row) {
    this.row = $row;
    return this;
  },

  calculateFD: function(perGame) {
      var games = 1;
      if (perGame) {
        var games = this.getGames();
      }
      return ((this.getValue('PTS') + (1.5*this.getValue('AST')) + (2*this.getValue('STL')) + (2*this.getValue('BLK')) - this.getValue('TOV') + (1.2*this.getValue('TRB')))/games).toFixed(2);
  },

  calculateDK: function(perGame) {
    var games = 1;
    if (perGame) {
      var games = this.getGames();
    }
    var stats = [this.getValue('PTS')/games, this.getValue('AST')/games, this.getValue('STL')/games, this.getValue('BLK')/games, this.getValue('TRB')/games];
    var doubles = stats.map(this.checkDouble);
    var doublesSum = doubles.reduce(function (a,b) { return a + b });
    var dkBonus = this.checkBonus(doublesSum);
    return ((this.getValue('PTS') + (1.5*this.getValue('AST')) + (2*this.getValue('STL')) + (2*this.getValue('BLK')) - (.5*this.getValue('TOV')) + (1.25*this.getValue('TRB')) + (.5*this.getValue('3P')) + dkBonus)/games).toFixed(2);
  },
  
  calculateYH: function(tipo, indice) {
    var games = 1;
	var started = this.getStartedGames();
	var totgames = this.getGames();
	var starter = 1;

    if (tipo == 1) {
      //var games = this.getGames();

	  //BOXSCORE: verifica si jugador está en listado de Starters:	
	  if (indice < 6)
		starter = 1;
	  else
		starter = 0;
    } 
	if (tipo == 2) {
	  //player game log:
	  if (isNaN(started))
		starter = 0;
	  else
	    starter = started;	
	}
	if (tipo == 3) {
	  //per-games:
	  starter = started/totgames;	
	}
    var stats = [this.getValue('PTS')/games, this.getValue('AST')/games, this.getValue('STL')/games, this.getValue('BLK')/games, this.getValue('TRB')/games];
    var doubles = stats.map(this.checkDouble);
    var doublesSum = doubles.reduce(function (a,b) { return a + b;});
	var TripDub = 0 ;
	if (doublesSum >= 3) {
	  TripDub = 1;
	}

	  return ((  (starter*5)
			   - (this.getValue('FGA')*0.45)
			   + (this.getValue('FG')*1)
			   - (this.getValue('FTA')*0.75)
			   + (this.getValue('FT')*1)
			   + (this.getValue('3P')*2)
			   + (this.getValue('PTS')*0.5)
			   + (this.getValue('ORB')*1.9)
			   + (this.getValue('DRB')*1.5)
			   + (this.getValue('AST')*2)
			   + (this.getValue('STL')*2.5)
			   + (this.getValue('BLK')*2.5)
			   - (this.getValue('TOV')*2)
			   - (this.getValue('PF')*1)
			   + (TripDub*10))/games).toFixed(2);	
	
  },

  getGames: function() {
    return this.getValue('G');
  },
  
  getStartedGames: function() {
    return this.getValue('GS');
  },  

  median: function (values) {
    values.sort( function(a,b) { return a - b; });
    var half = Math.floor(values.length/2);

    if(values.length % 2)
      return values[half];
    else
      return (Number(values[half - 1]) + Number(values[half]))/2.0;
  },

  checkDouble: function (stat) {
    if ( stat >= 10 ) {
      return 1;
    } else {
      return 0;
    }
  },

  checkBonus: function (x) {
    if ( x == 2 ) {
      return 1.5;
    }
    if (x >= 3 ) {
      return 3;
    }
    else {
      return 0;
    }
  },

  getIndex: function(category) {
    var selector = "th:contains(" + category + ")";
    var $table = this.row.parent().parent();
    var idx = $table.find('thead tr:not(.over_header)').first().find(selector).index();
    return idx;
  },

  getValue: function(category) {
    return Number(this.row.find('td').eq(this.getIndex(category)).text());
  },

  getPlayer: function(category) {
    return this.row.find('td').eq(this.getIndex(category)).text();
  }
  
};

$(document).ready(function() {
  $('#per_game thead tr, #pgl_basic thead tr, #stats thead tr').append('<th>YH</th>');
  $('#per_game tbody tr, #per_game tfoot tr').each(function(index){
    var $row = $(this);
    var statRow = Object.create(StatRow).initialize($row);
    var fd = statRow.calculateYH(3,0);
    //var dk = statRow.calculateDK();
    $(this).append("<td bgcolor='#FFFF00'>" + fd + "</td>");
  });

  var tableHeading = $('.table_heading h2').text();

  /*
  $('#stats tbody tr').each(function(index){
    var $row = $(this);
    var perGame = true;
    var statRow = Object.create(StatRow).initialize($row);
    var fd = statRow.calculateFD(perGame);
    var dk = statRow.calculateDK(perGame);
    $(this).append("<td>" + fd + "</td>" + "<td>" + dk + "</td>");
  });
  */
  
  var fd_vals = []; 
  //var dk_vals = [];
  $("#pgl_basic tbody tr").not(".thead").each(function(index){
    var $row = $(this);
    var statRow = Object.create(StatRow).initialize($row);
    var fd = statRow.calculateYH(2,0);
    //var dk = statRow.calculateDK();
    fd_vals.push(fd);
    //dk_vals.push(dk);
    $(this).append("<td bgcolor='#FFFF00'>" + fd + "</td>");
  });
  
  $("#pgl_basic tbody").append("<tr bgcolor='#00FF00'><td><strong>YH</strong></td><td> Median</td><td>" + StatRow.median(fd_vals) + "</td><td></td><td>Min</td><td>" + Math.min.apply(Math,fd_vals) + "</td><td></td><td>Max</td><td>" + Math.max.apply(Math,fd_vals) + "</td></tr>");
  //$("#pgl_basic tbody").append("<tr><td><strong>DK</strong></td><td> Median</td><td>" + StatRow.median(dk_vals) + "</td><td></td><td>Min</td><td>" + Math.min.apply(Math,dk_vals) + "</td><td></td><td>Max</td><td>" + Math.max.apply(Math,dk_vals) + "</td></tr>");
  
  var url = document.URL;
  var indice = 0;
  if ( url.split('/')[3] == "boxscores" ) {
    $('table').each(function() {
      if ( $(this).attr('id') != undefined && $(this).attr('id').split('_')[1] == "basic" ) {
        $(this).find('thead tr').not('.over_header').append('<th>YH</th>');
        $(this).find('tbody tr, tfoot tr').not('.thead').each(function(index){
          var $row = $(this);
          var statRow = Object.create(StatRow).initialize($row);
		  indice = indice + 1;
		  var player = statRow.getPlayer('Starters');		  
          var fd = statRow.calculateYH(1,indice);		  
  		  if (player == "Team Totals")
			indice = 0;
		  //console.log(player + " " + indice);
          //var dk = statRow.calculateDK();
          $(this).append("<td bgcolor='#FFFF00'>" + fd + "</td>");
      });
    }
  });
  }
});
