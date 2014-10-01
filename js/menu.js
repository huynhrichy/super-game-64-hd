var menuState = {
	create: function() {
		game.add.image(0, 0, 'background');

		var nameLabel = game.add.text(game.world.centerX, -50, 'SUPER GAME 64 HD',
			{font: '63px Geo', fill: '#ffffff'});
		nameLabel.anchor.setTo(0.5, 0.5);
		game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();

		var startText = game.device.desktop ? 
			'press the up arrow key to start' : 'tap the screen to start';

		var startLabel = game.add.text(game.world.centerX, game.world.height - 80,
			startText, {font: '25px Geo', fill: '#ffffff'});
		startLabel.anchor.setTo(0.5, 0.5);
		game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 500).loop().start();

		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

		upKey.onDown.addOnce(this.start, this);

		game.input.onDown.addOnce(this.start, this);

		if (!localStorage.getItem('bestScore')) {
			localStorage.setItem('bestScore', 0);
		}

		if (game.global.score > localStorage.getItem('bestScore')) {
			localStorage.setItem('bestScore', game.global.score);
		}

		var scoreText = 'score: ' + game.global.score + '\nbest score: ' + 
			localStorage.getItem('bestScore');
		var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, scoreText,
			{font: '25px Geo', fill: '#ffffff', align: 'center'});
		scoreLabel.anchor.setTo(0.5, 0.5);

		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);

		this.muteButton.input.useHandCursor = true;

		this.startSound = game.add.audio('coin');
		this.startSound.volume = 0.5;

		if (game.sound.mute) {
			this.muteButton.frame = 1;
		}
	},

	start: function() {
		this.startSound.play();
		game.state.start('play');
	},

	toggleSound: function() {
		game.sound.mute = !game.sound.mute;
		this.muteButton.frame = game.sound.mute ? 1 : 0;
	}
};

