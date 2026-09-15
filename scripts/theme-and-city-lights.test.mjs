import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import sharp from 'sharp';
import { resolveTheme, themePreference, themeBootstrap } from '../src/lib/theme.mjs';
import { geographicUV, sampleCityLight, cityIntensity } from '../public/scripts/city-light-field.mjs';

test('automatic theme changes at 07:00 and 19:00 in local time', () => {
  for (let minute = 0; minute < 1440; minute++) {
    const date = new Date(2026, 8, 14, 0, minute);
    assert.equal(resolveTheme('auto', date), minute < 420 || minute >= 1140 ? 'dark' : 'light');
    assert.equal(resolveTheme('light', date), 'light');
    assert.equal(resolveTheme('dark', date), 'dark');
  }
});

test('prepaint theme matches hydration, including denied storage and invalid preferences', () => {
  for (const saved of ['auto', 'dark', 'light', null, 'invalid', 'denied']) {
    for (const hour of [0, 6, 7, 12, 18, 19, 23]) {
      const document = { documentElement: { dataset: {}, style: {} } };
      vm.runInNewContext(themeBootstrap, {
        document,
        Date: class { getHours() { return hour; } },
        localStorage: { getItem() { if (saved === 'denied') throw new Error('Denied'); return saved; } },
      });
      const expected = resolveTheme(themePreference(saved), new Date(2026, 8, 14, hour));
      assert.equal(document.documentElement.dataset.theme, expected);
      assert.equal(document.documentElement.style.colorScheme, expected);
    }
  }
});

test('geographic sampling preserves longitude, latitude and the dateline', () => {
  for (const [lon, lat] of [[139.7,35.68],[-118.24,34.05],[133,34.65],[0,0],[179.9,60],[-179.9,-60]]) {
    const a=(lon-125)*Math.PI/180,b=lat*Math.PI/180;
    const [u,v]=geographicUV(Math.cos(b)*Math.cos(a),Math.sin(b),-Math.cos(b)*Math.sin(a));
    assert.ok(Math.abs(u-(lon+180)/360)<1e-12);
    assert.ok(Math.abs(v-(90-lat)/180)<1e-12);
  }
});

test('bilinear sampler wraps horizontally and clamps at the poles', () => {
  const pixels = new Uint8Array([0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255]);
  assert.equal(sampleCityLight(pixels,2,2,.25,0),0);
  assert.equal(sampleCityLight(pixels,2,2,.75,1),1);
  assert.equal(sampleCityLight(pixels,2,2,0,.5),sampleCityLight(pixels,2,2,1,.5));
  assert.equal(sampleCityLight(pixels,2,2,.75,-1),1);
  assert.equal(sampleCityLight(pixels,2,2,.75,2),1);
  assert.equal(cityIntensity(0),0);
  assert.ok(cityIntensity(.08)>.1, 'faint observed settlements remain visible');
});

test('real satellite texture distinguishes city clusters from unlit ocean and desert', async () => {
  const {data,info}=await sharp('public/images/earth/city-light-sampling.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const at=(lon,lat)=>sampleCityLight(data,info.width,info.height,(lon+180)/360,(90-lat)/180);
  for(const [name,lon,lat] of [['Tokyo',139.7,35.68],['Osaka',135.5,34.7],['Guangzhou',113.26,23.13],['Los Angeles',-118.24,34.05]]) {
    assert.ok(at(lon,lat)>.7, `${name} should illuminate the tree`);
  }
  assert.equal(at(-145,15),0, 'unlit Pacific must not generate city light');
  assert.ok(at(10,25)<.02, 'remote Sahara must remain dark');
  const texture=await sharp('public/images/earth/nasa-black-marble-2016-8k.jpg').metadata();
  assert.deepEqual([texture.width,texture.height],[8192,4096]);
});
