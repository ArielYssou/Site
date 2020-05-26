// ############################################################
var s = function( p ) { // p could be any variable name
	var scl = 5;
	var cols, rows;

  p.setup = function() {
		var myWidth = document.getElementById("c1").offsetWidth;
    //p.createCanvas(myWidth, 200);
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(300, 300);
		cols = rows = Math.floor( p.width / scl ) 

		sim = Simulation(cols, 2.2);
		sim.initalize();

		sim.show_full();
  };

  p.draw = function() {
		sim.updadate()
		sim.show_update()
  };

	p.windowResized = function() {
		mwidth = document.getElementById("c1").offsetWidth;
		/*mheight = document.getElementById("c1").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);

		// Don't forget to resize all positions as well
		x = mwidth / 2;
	};

	Simulation = function(side, T) {
		this.side = side;
		this.total_sites = this.side ** 2;
		this.T = T;

		this.lattice = new Array();
		this.up = new Array();
		this.down = new Array();
		this.left = new Array();
		this.right = new Array();
		this.transitionProbs = new Array();

		this.need_update = new Array();

		this.initalize = function () {
			for(var i = 0; i < this.total_sites; i += 1) {
				this.lattice.push( (p.random() < 0.5) ? 1 : -1 );
				this.up.push( i - this.side );
				this.down.push( i + this.side );
				this.left.push( i - 1 );
				this.right.push( i + 1);
			}

			for(var i = 0; i < this.side; i++)
				this.up[i] = this.total_sites - ( this.side - i );

			for(var i = this.total_sites - this.side; i < this.total_sites; i++)
				this.down[i] = i - (this.total_sites - this.side);

			for(var i = 0; i < this.total_sites; i += this.side) 
				this.left[i] = i + (this.side - 1);

			for(var i = this.side - 1; i < this.total_sites; i += this.side)
				this.right[i] = i - (this.side - 1);

			this.transitionProbs.push( 0 );
			this.transitionProbs.push( p.exp( -2.0 / this.T ));
			this.transitionProbs.push( p.exp( -4.0 / this.T ));
			this.transitionProbs.push( p.exp( -6.0 / this.T ));
			this.transitionProbs.push( p.exp( -8.0 / this.T ));
		}

		this.updadate = function() {
			var pos = Math.floor(p.random(0, this.total_sites));
			let dE = 0;
			dE += this.lattice[this.up[pos]];
			dE += this.lattice[this.down[pos]];
			dE += this.lattice[this.right[pos]];
			dE += this.lattice[this.left[pos]];
			dE *= this.lattice[pos];

			if( dE <= 0) {
				this.lattice[pos] *= -1;
				this.need_update.push(pos);
			} else {
				r = p.random();
				if( r < this.transitionProbs[dE] )
					this.lattice[pos] *= -1;
					this.need_update.push(pos);
			}
		}

		this.show_full = function() {
			for(var i = 0; i < this.side; i += 1) {
				for(var j = 0; j < this.side; j += 1) {
					if( this.lattice[i + cols * j] == 1) 
						p.fill(1);
					else
						p.fill(250);

					p.rect(i * scl, j * scl, scl, scl);
				}
			}
		}

		this.show_update = function(pos) {
			for(var i = 0; i < this.need_update.length; i++ ) {
				var x = this.need_update[i] % this.side
				var y = Math.floor(this.need_update[i] / this.side);

				if( this.lattice[this.need_update[i]] == 1) 
					p.fill(1);
				else
					p.fill(250);
				p.rect(x * scl, y * scl, scl, scl);
				this.need_update.splice(i, 1);
			}
		}

		return this;
	}
};
var myp51 = new p5(s, 'c1');


var s = function( p ) { // p could be any variable name
	var scl = 10;
	var cols, rows;

  p.setup = function() {
		var myWidth = document.getElementById("c2").offsetWidth;
    //p.createCanvas(myWidth, 200);
		/* var myHeight = document.getElementById("c2").offsetHeight; */
    p.createCanvas(300, 300);
		cols = rows = Math.floor( p.width / scl ) 

		wolff = Wolff(cols, 1.2);
		wolff.initalize();

		wolff.show_full();
  };

  p.draw = function() {
		wolff.updadate()
		wolff.show_update()
  };

	p.windowResized = function() {
		mwidth = document.getElementById("c2").offsetWidth;
		/*mheight = document.getElementById("c2").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);

		// Don't forget to resize all positions as well
		x = mwidth / 2;
	};

	Wolff = function(side, T) {
		this.side = side;
		this.T = T;
		this.total_sites = this.side ** 2;

		this.lattice = new Array();
		this.up = new Array();
		this.down = new Array();
		this.left = new Array();
		this.right = new Array();
		this.bondProb = 1.0 - p.exp(-1.0 / this.T)
 
		this.need_update = new Array();

		this.initalize = function () {
			for(var i = 0; i < this.total_sites; i += 1) {
				this.lattice.push( (p.random() < 0.5) ? 1 : -1 );
				this.up.push( i - this.side );
				this.down.push( i + this.side );
				this.left.push( i - 1 );
				this.right.push( i + 1);
			}

			for(var i = 0; i < this.side; i++)
				this.up[i] = this.total_sites - ( this.side - i );

			for(var i = this.total_sites - this.side; i < this.total_sites; i++)
				this.down[i] = i - (this.total_sites - this.side);

			for(var i = 0; i < this.total_sites; i += this.side) 
				this.left[i] = i + (this.side - 1);

			for(var i = this.side - 1; i < this.total_sites; i += this.side)
				this.right[i] = i - (this.side - 1);
		}

		this.updadate = function() {
			var pos = Math.floor(p.random(0, this.total_sites));

			this.buffer = [pos];
			this.cluster = [pos];
			this.visited = [pos];

			while( this.buffer.length ) {
				var current = this.buffer.pop();
				//console.log(this.buffer);

				if( ! this.visited.includes(this.up[current])) {
					if( this.lattice[current] == this.lattice[this.up[current]] ) {
						if( p.random() < this.bondProb ){
							this.buffer.push( this.up[current] );
							this.cluster.push( this.up[current] );
							this.visited.push( this.up[current] );
						}
					}
				} else {
					this.visited.push( this.up[current] );
				}


				if( ! this.visited.includes(this.down[current])) {
					if( this.lattice[current] == this.lattice[this.down[current]] ) {
						if( p.random() < this.bondProb ){
							this.buffer.push( this.down[current] );
							this.cluster.push( this.down[current] );
							this.visited.push( this.down[current] );
						}
					}
				} else {
					this.visited.push( this.down[current] );
				}

				if( ! this.visited.includes(this.left[current])) {
					if( this.lattice[current] == this.lattice[this.left[current]] ) {
						if( p.random() < this.bondProb ){
							this.buffer.push( this.left[current] );
							this.cluster.push( this.left[current] );
							this.visited.push( this.left[current] );
						}
					}
				} else {
					this.visited.push( this.left[current] );
				}

				if( ! this.visited.includes(this.right[current])) {
					if( this.lattice[current] == this.lattice[this.right[current]] ) {
						if( p.random() < this.bondProb ){
							this.buffer.push( this.right[current] );
							this.cluster.push( this.right[current] );
							this.visited.push( this.right[current] );
							new_bonds = true;
						}
					}
				} else {
					this.visited.push( this.right[current] );
				}
			}

			//console.log(this.cluster)
			for(var i = 0; i < this.cluster.length; i += 1)
				this.lattice[this.cluster[i]] *= -1;

		}

		this.show_full = function() {
			for(var i = 0; i < this.side; i += 1) {
				for(var j = 0; j < this.side; j += 1) {
					if( this.lattice[i + cols * j] == 1) 
						p.fill(1);
					else
						p.fill(250);

					p.rect(i * scl, j * scl, scl, scl);
				}
			}
		}

		this.show_update = function(pos) {
			p.push();
			for(var i = 0; i < this.cluster.length; i++ ) {
				var x = this.cluster[i] % this.side
				var y = Math.floor(this.cluster[i] / this.side);

				if( this.lattice[this.cluster[i]] == 1) 
					p.fill(1);
				else
					p.fill(250);
				p.rect(x * scl, y * scl, scl, scl);
				this.cluster.splice(i, 1);
			}
			p.pop();
		}

		return this;
	}
};
var myp52 = new p5(s, 'c2');
