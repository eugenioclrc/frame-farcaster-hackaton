export default class Svg {
    constructor(opts = {width: 60, height: 25, fontSize: 16, fontFamily: 'monospace'}) {
        this.matrix = [];
        this.opts = opts;
    }

    draw(x, y, ch, fg, bg) {
        if(!this.matrix[y]) this.matrix[y] = [];
        this.matrix[y][x] = {
            ch,fg,bg
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
        let svg = `<svg width="${this.opts.width*this.opts.fontSize}" height="${this.opts.height*(this.opts.fontSize + 2)}" xmlns="http://www.w3.org/2000/svg">`;
        // svg background
        svg += `<rect width="${this.opts.width*this.opts.fontSize}" height="${this.opts.height*(this.opts.fontSize+2)}" fill="${this.opts.fg}" />`;
        for(let y = 0; y < this.opts.height; y++) {
            for(let x = 0; x < this.opts.width; x++) {
                let cell = this.matrix[y] && this.matrix[y][x];
                if(cell) {
                    svg += `<rect x="${x*this.opts.fontSize + 4}" y="${y*this.opts.fontSize + 6}" width="${this.opts.fontSize + 3}" height="${this.opts.fontSize+12}" fill="${cell.bg}" />`;
                    
                }
            }
        }
        for(let y = 0; y < this.opts.height; y++) {
            for(let x = 0; x < this.opts.width; x++) {
                let cell = this.matrix[y] && this.matrix[y][x];
                if(!cell ) continue;
        
                if(cell.ch == " " || cell.ch == "") {
                    // fill using rect
                } else {
                    const font = `font-family="${this.opts.fontFamily}" font-size="${this.opts.fontSize}" font-color="${cell.bg}"`;
                    svg += `<text x="${x*this.opts.fontSize + 6}" y="${(y*this.opts.fontSize) + 18}" fill="${cell.fg}" ${font}>${cell.ch}</text>`;
                }
            }
        }
        // life bar
        svg += `<rect x="0" y="${(this.opts.height-3)*(this.opts.fontSize + 2)}" style="fill:green;stroke:black;stroke-width:5px" width="${this.opts.width*this.opts.fontSize}" height="100px"></rect>`;
        //<text style="fill:black;font-family:Arial;font-size:20px" x="448.22" y="389.36" id="e2_texte" xml:space="preserve" textLength="84.74864582438818" transform="matrix(1.67759 -0.0211904 0.0321802 1.10468 -304.469 -35.5712)">hp(100)</text>
        svg += '</svg>';
        return svg; 
    }
}
