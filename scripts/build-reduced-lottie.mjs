import { readFileSync, writeFileSync } from "node:fs";

const input = new URL("../public/lotties/dspf.json", import.meta.url);
const output = new URL("../public/lotties/dspf_10fps.json", import.meta.url);
const source = JSON.parse(readFileSync(input, "utf8"));
const frameStep = 3;

if (source.fr !== 30 || source.ip !== 0 || source.op !== 191) {
  throw new Error("The source timeline changed; check the frame sampling before rebuilding.");
}
if (source.layers.some((layer) => layer.ty !== 2 || layer.parent !== undefined)) {
  throw new Error("The source now has non-image or parented layers.");
}

const layers = [];
const assetIds = new Set();
for (let frame = source.ip; frame < source.op; frame += frameStep) {
  const active = source.layers.filter((layer) => layer.ip <= frame && frame < layer.op);
  if (active.length !== 1) throw new Error(`Expected one image at frame ${frame}.`);

  const layer = active[0];
  assetIds.add(layer.refId);
  layers.push({
    ...layer,
    ind: layers.length + 1,
    ip: frame,
    op: Math.min(frame + frameStep, source.op),
    st: frame,
  });
}

const assets = source.assets.filter((asset) => assetIds.has(asset.id));
if (assets.length !== assetIds.size) throw new Error("A sampled image asset is missing.");

// Hold each sampled image for three original timeline frames. fr and op stay
// unchanged, so playback still covers every part of the 6.37-second loop.
writeFileSync(output, JSON.stringify({ ...source, assets, layers }));
console.log(`Wrote ${layers.length} displayed images, ${assets.length} assets, ${source.op / source.fr}s loop.`);
