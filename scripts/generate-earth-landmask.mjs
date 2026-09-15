// Rebuild the mask with the same World Atlas data used for continent-outlines.js.
// Usage: node scripts/generate-earth-landmask.mjs /path/to/land-110m.json
// Source: https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json
import fs from 'node:fs/promises';
import sharp from 'sharp';

const topology=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const width=3600,height=1800;
const arcs=topology.arcs.map(arc=>{
  let x=0,y=0;
  return arc.map(([dx,dy])=>{
    x+=dx;y+=dy;
    return [x*topology.transform.scale[0]+topology.transform.translate[0],y*topology.transform.scale[1]+topology.transform.translate[1]];
  });
});
const paths=[];
for(const land of topology.objects.land.geometries){
  const polygons=land.type==='Polygon'?[land.arcs]:land.arcs;
  for(const polygon of polygons){
    const rings=polygon.map(indices=>{
      const ring=[];
      for(const index of indices){
        const arc=index<0?[...arcs[~index]].reverse():arcs[index];
        ring.push(...(ring.length?arc.slice(1):arc));
      }
      return ring.map(([longitude,latitude],i)=>`${i?'L':'M'}${((longitude+180)*10).toFixed(3)},${((90-latitude)*10).toFixed(3)}`).join(' ')+'Z';
    });
    paths.push(`<path d="${rings.join(' ')}" fill="white" fill-rule="evenodd"/>`);
  }
}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="black"/>${paths.join('')}</svg>`;
await sharp(Buffer.from(svg)).greyscale().removeAlpha().png({palette:true,colours:16,compressionLevel:9}).toFile('public/images/earth/coastline-landmask.png');
