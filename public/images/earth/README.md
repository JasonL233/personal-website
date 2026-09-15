# Earth night lights

The globe uses NASA Earth Observatory's **2016 Black Marble** grayscale composite from Suomi NPP VIIRS. It is aligned by longitude and latitude with the coastline geometry. It is a historical, display-mapped composite, not live city lighting or calibrated radiance.

`nasa-black-marble-2016-8k.jpg` is an 8192 × 4096 derivative of NASA's 13500 × 6750 (3 km) source, resized with Lanczos3 and encoded at JPEG quality 94 for the WebGL texture. `nasa-black-marble-2016.jpg` retains the unmodified 3600 × 1800 source as a fallback for GPUs with smaller texture limits. `city-light-sampling.png` is a 2048 × 1024 derivative for inexpensive CPU sampling of the same city field.

Source and downloads: https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/
Original file: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/144000/144897/BlackMarble_2016_01deg_gray.jpg
Higher-resolution source: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/144000/144897/BlackMarble_2016_3km_gray.jpg

Rebuild the derivatives with `node scripts/prepare-earth-lights.mjs /path/to/BlackMarble_2016_3km_gray.jpg`.

The rendering uses a warm palette to match the portfolio. No city locations are generated or moved, and NASA branding or endorsement is not implied.

`coastline-landmask.png` is derived from World Atlas 2.0.2 / Natural Earth 1:110m land polygons, the same source as `public/scripts/continent-outlines.js`. It uses a 3600 × 1800 equirectangular grid and colors the night surface. It no longer clips the light map: generalized coastlines were erasing observed coastal settlements and small islands. Rebuild with `node scripts/generate-earth-landmask.mjs /path/to/land-110m.json`. World Atlas license: `/public/data/world-atlas-LICENSE`.

Night Earth's imagery layer also uses Black Marble (https://www.nightearth.com/); its separate modeled sky-brightness layer is not a city-light texture. Matching geographic observations does not imply identical exposure, resolution, or year across every layer.

The shared display curve in `public/scripts/city-light-field.mjs` preserves faint settlements above a low noise floor. City emission is added independently of the day/night surface, with identical strength in both themes. A sample patch follows the tree through the globe's inverse world transform, including rotation and tilt, and drives a capped, warm diffuse fill at night. Regional averaging and slow interpolation soften the response, without a point-light hot spot near the roots. The patch spans the tree's stylized footprint; this lighting is artistic, not a physical Earth-scale illumination simulation.
