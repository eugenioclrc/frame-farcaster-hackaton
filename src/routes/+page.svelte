<script>
    import { PUBLIC_BASE_URL } from '$env/static/public';
import data from './data.json';

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

let renderSquare = {}
        let svg = `<svg width="${data.opts.width*(data.opts.fontSize+4)}" height="${(data.opts.height + 4)*(data.opts.fontSize+4)+ 140}" xmlns="http://www.w3.org/2000/svg">`;
        // svg background
        svg += `<rect width="${data.opts.width*(data.opts.fontSize+4)}" height="${(data.opts.height + 4)*(data.opts.fontSize+4)+140}" fill="${data.opts.fg || 'black'}" />`;
        for(let y = 0; y < data.opts.height; y++) {
            for(let x = 0; x < data.opts.width; x++) {
                if (renderSquare[`x${x}y${y}`]) {
                   continue;
                }
                renderSquare[`x${x}y${y}`] = true;

                let cell = data.matrix[y] && data.matrix[y][x];
                if(cell){
                    if(cell.bg) {
                        cell.bg = strToHexcolor(cell.bg);
                    }
                    if(cell.fg) {
                    cell.fg = strToHexcolor(cell.fg);
                    }
                    if (data.matrix[y][x+1] && data.matrix[y][x+1].bg == cell.bg) {
                        let endX = x;
                        while(data.matrix[y][endX] && data.matrix[y][endX].bg == cell.bg) {
                            endX++;
                        }
                        for(let j = x; j < endX; j++) {
                            renderSquare[`x${j}y${y}`] = true;
                        }
                        svg += `<rect x="${x*(data.opts.fontSize + 4)}" y="${y*(data.opts.fontSize + 4)}" width="${(endX - x)*(data.opts.fontSize + 4) }" height="${data.opts.fontSize+4}" fill="${cell.bg}" />`;                    
                    } else {
                        svg += `<rect x="${x*(data.opts.fontSize + 4)}" y="${y*(data.opts.fontSize + 4)}" width="${data.opts.fontSize + 4}" height="${data.opts.fontSize+4}" fill="${cell.bg}" />`;
                    }
                }
            }
        }
        svg = svg + '</svg>';

</script>

<svelte:head>
    <meta property="of:accepts:xmtp" content="2024-02-01" />
    <meta property="og:image" content="{PUBLIC_BASE_URL}/splash.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="{PUBLIC_BASE_URL}/splash.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:post_url" content="{PUBLIC_BASE_URL}/api" />
        <meta property="fc:frame:button:1" content="Lets play!" />
   
        <title>Farcaster Frames</title>

</svelte:head>

<h1>Hello Farcaster!</h1>

    
{svg}
