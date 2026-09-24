import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const BG = hexToRgb("#0d1815");
const RING = hexToRgb("#cba135");
const PANEL = hexToRgb("#122720");
const NEEDLE_N = hexToRgb("#cba135");
const NEEDLE_S = hexToRgb("#cb7455");

function makeIcon(size, maskableSafe) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * (maskableSafe ? 0.36 : 0.46);
  const ringWidth = size * 0.045;
  const innerR = outerR - ringWidth;

  const raw = Buffer.alloc((size * 4 + 1) * size);
  let pos = 0;
  for (let y = 0; y < size; y++) {
    raw[pos++] = 0; // filter type: none
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let color = BG;
      let alpha = maskableSafe ? 255 : 0;

      if (dist <= outerR && dist >= innerR) {
        color = RING;
        alpha = 255;
      } else if (dist < innerR) {
        color = PANEL;
        alpha = 255;
        // needle: a thin diamond pointing N (gold) and S (rust)
        const needleWidth = size * 0.05;
        const withinNeedleX = Math.abs(dx) < needleWidth * (1 - dist / innerR) + 1;
        if (withinNeedleX && dy < 0) {
          color = NEEDLE_N;
        } else if (withinNeedleX && dy >= 0) {
          color = NEEDLE_S;
        }
      } else if (maskableSafe) {
        color = BG;
        alpha = 255;
      }

      raw[pos++] = color[0];
      raw[pos++] = color[1];
      raw[pos++] = color[2];
      raw[pos++] = alpha;
    }
  }

  const idat = deflateSync(raw, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const png = Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  return png;
}

writeFileSync("public/icons/icon-192.png", makeIcon(192, false));
writeFileSync("public/icons/icon-512.png", makeIcon(512, false));
writeFileSync("public/icons/icon-maskable-512.png", makeIcon(512, true));
console.log("icons written");
