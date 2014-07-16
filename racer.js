$(document).ready(function() {
	String.prototype.repeat = function( num ){
		return new Array( num + 1 ).join( this );
	};


	// timer functions
	function Timer () {
		this.startTime = null;
		this.endTime = null;
	}

	Timer.prototype.start = function () {
		this.startTime = Date.now();
	};

	Timer.prototype.end = function () {
		this.endTime = Date.now();
	};

	Timer.prototype.duration = function () {
		return (this.endTime - this.startTime)/1000;
	};

	function Player (name, lane, keyCode, keyLetter) {
		this.name = name;
		this.lane = lane;
		this.keyCode = keyCode;
		this.keyLetter = keyLetter;
		this.position = 1;
	}

	Player.prototype.advance = function () {
		this.position++;
	};



	// Game function
	var Game = {
			numOfSpaces: 0,
			numOfPlayers: 0,
			players: [],
			timer: new Timer(),
		addPlayer: function (player) {
			this.players.push(player);
		},
		start: function(){
			this.timer.start();
		},
		end: function(){
			this.timer.end();
		},
		duration: function(){
			this.timer.duration();
		}
	};




	function pageController () {

		$("#game-info").on('submit',function (e) {
			e.preventDefault();
			$("#submit-num-players-spaces").prop("disabled", true);
			addGameInfo();
			showItem("#game", createPlayerForm(Game.numOfPlayers));
		});

		$(document).on('submit', "#player-names",function(e){
			e.preventDefault();
			createPlayers();
			$("#game").empty();
			showItem("#game", createRaceTrack(Game.numOfPlayers));
			gameController();
		});

		function addGameInfo () {
			Game.numOfPlayers = $("#game-info select[name=players").val();
			Game.numOfSpaces = $("#game-info select[name=spaces").val();
		}

		function showItem (ele, item) {
			$(ele).append(item);
		}

		function playerFormFormat (playerNum){
			return "<div><input name=\"player-" + playerNum + "\" id=\"" + playerNum + "\"></div>";
		}

		function createPlayerForm (playerNum) {
			var formString = "";
			for	( var num = 0; num < playerNum; num ++){
				formString += playerFormFormat(num + 1);
			}

			return "<form id=\"player-names\">"+ formString + "<input type=\"submit\" id=\"start-game\" value=\"let's play!\"/> </form>";
		}

		function createPlayers () {
			var names = $("#player-names div").children().map(function(){return $(this).val();}).get();
			var keyCodes = [81,80,90,191];// Q, P, Z, /
			var keyLetters = ["Q", "P", "Z", "/"];
			for (var i = 0; i < names.length; i++) {
				var player = new Player(names[i], i+1, keyCodes[i], keyLetters[i]);
				Game.addPlayer(player);
			}
		}

		function createRaceTrack (playerNum) {
			var raceTrack = "";
			for	( var num = 0; num < playerNum; num ++){
				raceTrack += createRaceLane(Game.players[num]);
			}
			return "<table id=\"race-track\">" + raceTrack + "</table>";
		}

		function createRaceLane (player) {
			var tableCells = "<td></td>".repeat(Game.numOfSpaces - 1);
			return "<tr id=\"player-" + player.lane + "\"><span><td>" + player.name + "(" + player.keyLetter + "):" + "</td></span><td class=\"active\"></td> </td>" + tableCells + "</tr>";
		}
	}

	function gameController () {

		$(document).on('keyup', function(e){
			var keyCode = e.which;
			startKeyUp(keyCode);
			playerKeyUp(keyCode);
		});

		function startKeyUp (keyCode){
			if(keyCode === 32){
				Game.start();
			}
			else{
				return false;
			}
		}

		function playerKeyUp (keyCode) {
			var player = $.grep(Game.players, function(player){ return player.keyCode === keyCode ;})[0];
			if (GameOver(player)){
				Game.end();
				$(document).unbind("keyup");
				alert(player.name + " has won in " + Game.duration() + " seconds! Whooo!" );
			}
			else{
				update_player_position(player);
			}
		}

		function GameOver(player){
			console.log(player.position);
			console.log(Game.numOfSpaces);

			if (player.position == Game.numOfSpaces){
				return true;
			}
			else{
				return false;
			}
		}

		function update_player_position (player){
			player.advance();
			$("#race-track #player-" + player.lane + " td.active").removeClass("active");
			$("#race-track #player-" + player.lane + " td:nth-child(" + (player.position + 1) +")").toggleClass("active");
		}


	}

	pageController();

});