var playState = {
	create: function() {
		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 500;

		this.cursor = game.input.keyboard.createCursorKeys();

		this.createWorld();

		this.coin = game.add.sprite(60, 140, 'coin');
		game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5, 0.5);

		this.scoreLabel = game.add.text(30, 30, 'score: 0',
			{ font: '18px Arial', fill: '#ffffff' });
		game.global.score = 0;

		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10, 'enemy');
		game.time.events.loop(2200, this.addEnemy, this);

		this.jumpSound = game.add.audio('jump');
		this.jumpSound.volume = 0.5;
		this.coinSound = game.add.audio('coin');
		this.coinSound.volume = 0.5;
		this.deadSound = game.add.audio('dead');
		this.deadSound.volume = 0.5;

		this.player.animations.add('right', [1, 2], 8, true);
		this.player.animations.add('left', [3, 4], 8, true);

		this.emitter = game.add.emitter(0, 0, 50);
		this.emitter.makeParticles('pixel');
		this.emitter.setYSpeed(-150, 150); // Speed randomly chosen between
		this.emitter.setXSpeed(-150, 150);
		this.emitter.gravity = 0;
		this.emitter.minParticleScale = 0.2;
		this.emitter.maxParticleScale = 0.7;
	},

	update: function() {
		game.physics.arcade.collide(this.player, this.walls);

		game.physics.arcade.collide(this.enemies, this.walls);

		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		this.movePlayer();
	},

	movePlayer: function() {
		if (!this.player.inWorld) {
			this.playerDie();
		}

		if (this.cursor.left.isDown) {
			this.player.body.velocity.x = -200;
			this.player.animations.play('left');
		}
		else if (this.cursor.right.isDown) {
			this.player.body.velocity.x = 200;
			this.player.animations.play('right');
		}
		else {
			this.player.body.velocity.x = 0;
			this.player.animations.stop();
			this.player.frame = 0;
		}

		if (this.cursor.up.isDown && this.player.body.touching.down) {
			this.jumpSound.play();
			this.player.body.velocity.y = -320;
		}
	},

	createWorld: function() {
		this.walls = game.add.group();
		this.walls.enableBody = true;

		game.add.sprite(0, 0, 'wallV', 0, this.walls);
		game.add.sprite(480, 0, 'wallV', 0, this.walls);

		game.add.sprite(0, 0, 'wallH', 0, this.walls);
		game.add.sprite(300, 0, 'wallH', 0, this.walls);
		game.add.sprite(0, 320, 'wallH', 0, this.walls);
		game.add.sprite(300, 320, 'wallH', 0, this.walls);

		game.add.sprite(-100, 160, 'wallH', 0, this.walls);
		game.add.sprite(400, 160, 'wallH', 0, this.walls);

		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);
		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleBottom.scale.setTo(1.5, 1);

		this.walls.setAll('body.immovable', true);
	},

	playerDie: function() {
		if (!this.player.alive) {
			return;
		}

		this.player.kill();

		this.deadSound.play();
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		this.emitter.start(true, 600, null, 15);
		
		game.time.events.add(1000, this.startMenu, this);
	}, 

	startMenu: function() {
		game.state.start('menu');
	},

	takeCoin: function(player, coin) {
		this.coinSound.play();
		game.global.score += 5;
		this.scoreLabel.text = 'score: ' + game.global.score;

		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();

		this.coin.scale.setTo(0, 0);
		game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
		this.updateCoinPosition();
	},

	updateCoinPosition: function() {
		var coinPosition = [
			{x: 140, y: 60}, {x: 360, y: 60},
			{x: 60, y: 140}, {x: 440, y: 140},
			{x: 130, y: 300}, {x: 370, y: 300}
		];

		for (var i = 0; i < coinPosition.length; i++) {
			if (coinPosition[i].x === this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}

		var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length-1)];

		this.coin.reset(newPosition.x, newPosition.y);
	},

	addEnemy: function() {
		var enemy = this.enemies.getFirstDead();

		if (!enemy) {
			return;
		}

		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.world.centerX, 0);
		enemy.body.gravity.y = 500;
		enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
		enemy.body.bounce.x = 1;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	}
};