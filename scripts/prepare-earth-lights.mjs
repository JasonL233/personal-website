// Usage: node scripts/prepare-earth-lights.mjs /path/to/BlackMarble_2016_3km_gray.jpg
// Source/attribution: public/images/earth/README.md
import sharp from 'sharp';

const source=process.argv[2];
if(!source)throw new Error('Provide the NASA 13500 × 6750 grayscale JPEG.');
await sharp(source).resize(8192,4096,{kernel:'lanczos3'}).jpeg({quality:94,mozjpeg:true}).toFile('public/images/earth/nasa-black-marble-2016-8k.jpg');
await sharp('public/images/earth/nasa-black-marble-2016-8k.jpg').resize(2048,1024).png({palette:true,colours:256}).toFile('public/images/earth/city-light-sampling.png');
