function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function strToHexcolor(rgbString) {
	const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
	const matches = rgbString.match(regex);

	if (matches) {
		const red = parseInt(matches[1], 10);
		const green = parseInt(matches[2], 10);
		const blue = parseInt(matches[3], 10);
		return rgbToHex(red, green, blue);
	}
	return rgbString;
}


export default class Svg {
	constructor(opts = {
		width: 60,
		height: 40,
		fontSize: 16,
		fontFamily: 'monospace'
	}) {
		this.matrix = [];
		this.opts = opts;
		this.messages = [];
	}

	addMessages(message) {
		this.messages.push(message);
		this.messages = this.messages.slice(-3);
	}

	setHp(hp, max) {
		this.hp = hp;
		this.maxHp = max;
	}

	draw(x, y, ch, fg, bg) {
		if (!this.matrix[y]) this.matrix[y] = [];
		this.matrix[y][x] = {
			ch,
			fg,
			bg
		};

	}

	setOptions(opts) {
		this.opts = opts;
		//super.setOptions(opts);
		//const style = (opts.fontStyle ? `${opts.fontStyle} ` : ``);
		//const font = `${style} ${opts.fontSize}px ${opts.fontFamily}`;
		//this._ctx.font = font;
		//this._updateSize();
		//this._ctx.font = font;
		//this._ctx.textAlign = "center";
		//this._ctx.textBaseline = "middle";
	}
	clear() {
		//this._ctx.fillStyle = this._options.bg;
		this.matrix = [];
		//this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
	}



	render() {

		let renderSquare = {}
		let svg = `<svg width="${this.opts.width*(this.opts.fontSize+4)}" height="${(this.opts.height + 4)*(this.opts.fontSize+4)+ 140}" xmlns="http://www.w3.org/2000/svg">`;
		// svg background
		svg += `<rect width="${this.opts.width*(this.opts.fontSize+4)}" height="${(this.opts.height + 4)*(this.opts.fontSize+4)+140}" fill="${this.opts.fg || 'black'}" />`;
		for (let y = 0; y < this.opts.height; y++) {
			for (let x = 0; x < this.opts.width; x++) {
				if (renderSquare[`x${x}y${y}`]) {
					//continue;
				}
				renderSquare[`x${x}y${y}`] = true;

				let cell = this.matrix[y] && this.matrix[y][x];
				if (cell) {
					if (cell.bg) cell.bg = strToHexcolor(cell.bg);
					if (cell.fg) cell.fg = strToHexcolor(cell.fg);

					if (this.matrix[y][x + 1] && this.matrix[y][x + 1].bg == cell.bg) {
						let endX = x;
						while (this.matrix[y][endX] && this.matrix[y][endX].bg == cell.bg) {
							endX++;
						}
						for (let j = x; j < endX; j++) {
							renderSquare[`x${j}y${y}`] = true;
						}
						svg += `<rect x="${x*(this.opts.fontSize + 4)}" y="${y*(this.opts.fontSize + 4)}" width="${(endX - x)*(this.opts.fontSize + 4) }" height="${this.opts.fontSize+4}" fill="${cell.bg}" />`;
					} else {
						svg += `<rect x="${x*(this.opts.fontSize + 4)}" y="${y*(this.opts.fontSize + 4)}" width="${this.opts.fontSize + 4}" height="${this.opts.fontSize+4}" fill="${cell.bg}" />`;
					}
				}
			}
		}
		for (let y = 0; y < this.opts.height; y++) {
			for (let x = 0; x < this.opts.width; x++) {
				let cell = this.matrix[y] && this.matrix[y][x];
				if (!cell) continue;

				if (cell.ch == " " || cell.ch == "") {
					// fill using rect
				} else {
					const font = `font-family="${this.opts.fontFamily}" font-size="${this.opts.fontSize}" font-color="${cell.bg}"`;
					svg += `<text x="${x*(this.opts.fontSize +4)+ 6}" y="${y*(this.opts.fontSize + 4)+14}" fill="${cell.fg}" ${font}>${cell.ch}</text>`;
				}
			}
		}

		//document.querySelector("#health-bar").style.width = `${Math.ceil(100*player.hp/player.effective_max_hp)}%`;
		//document.querySelector("#health-text").textContent = ` HP: ${player.hp} / ${player.effective_max_hp}`;

		//display.setHp(player.hp, player.effective_max_hp);
		if (this.maxHp) {
			const pct = Math.ceil(100 * this.hp / this.maxHp);
			let color = '#008000';
			if (pct < 90) {
				color = '#32CD32';
			}
			if (pct < 75) {
				color = '#FFFF00';
			}
			if (pct < 50) {
				color = '#FFA500';
			}
			if (pct < 25) {
				color = '#FF4500';
			}
			if (pct < 10) {
				color = '#FF0000';
			}
			// life bar
			svg += `<rect x="0" y="${(this.opts.height)*(this.opts.fontSize + 4)}" style="fill:${color};stroke:black;stroke-width:5px" width="${(this.opts.width*this.opts.fontSize* pct) / 100}" height="100px"></rect>`;
			const font = `font-family="${this.opts.fontFamily}" font-size="${this.opts.fontSize * 3}" fill="white"`;
			svg += `<text ${font} x="${(this.opts.width / 2 -6 )*(this.opts.fontSize + 4)}" y="${(this.opts.height + 3)*(this.opts.fontSize + 4)}">(${this.hp} / ${this.maxHp})</text>`;
			//svg += `<text x="${x*(this.opts.fontSize +4)+ 6}" y="${y*(this.opts.fontSize + 4)+14}" fill="${cell.fg}" ${font}>${cell.ch}</text>`;
			//<text style="fill:black;font-family:Arial;font-size:20px" x="448.22" y="389.36" id="e2_texte" xml:space="preserve" textLength="84.74864582438818" transform="matrix(1.67759 -0.0211904 0.0321802 1.10468 -304.469 -35.5712)">hp(100)</text>
		}
		this.messages.reverse().forEach((message, i) => {
			const font = `font-family="${this.opts.fontFamily}" font-size="${Math.ceil(this.opts.fontSize * 1.2)}" fill="white"`;
			svg += `<text ${font} x="16" y="${(this.opts.height + 4)*(this.opts.fontSize + 5) + (i*(this.opts.fontSize + 6))}">${message}</text>`;

		});
		svg += '</svg>';
		//console.log(svg)
		return svg;
	}
}