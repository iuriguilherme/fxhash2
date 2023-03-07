/**!
 * @file Collatz Bezier Rainbow
 * @version 3.1.0    
 * @copyright Iuri Guilherme 2023  
 * @license GNU AGPLv3  
 * @author Iuri Guilherme <https://iuri.neocities.org/>  
 * @description This is Collatz Bezier Rainbow made with p5js for 
 *      fxhash.xyz genarative tokens. Source code available at Github: 
 *      https://github.com/iuriguilherme/fxhash2  
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU Affero General Public License as published by the 
 * Free Software Foundation, either version 3 of the License, or (at your 
 * option) any later version.  
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.  
 * See the GNU Affero General Public License for more details.  
 * 
 * You should have received a copy of the GNU Affero General Public License 
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.  
 * 
 */

const seed = fxrand() * 1e8;

import p5 from "p5";
import { create, all } from "mathjs";
const math = create(all, {"randomSeed": seed})

const version = "3.1.0";
const cc = (n = 1) => n != 1 && (n % 2 && (3 * n) + 1 || n / 2) || n;
const sleep = ms => new Promise(r => setTimeout(r, ms));
// https://github.com/fxhash/fxhash-webpack-boilerplate/issues/20
const properAlphabet = 
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const variantFactor = 3.904e-87; // This number is magic
const fxhashDecimal = base58toDecimal(fxhashTrunc);
//~ const limit = 90;
const limit = 30;
const featureVariant = math.max(2, fxHashToVariant(fxhashDecimal, limit));
//~ const featureVariant = limit;
let x, y, size, scale, ratio, reWidth, reHeight, reRatio, canvas, xWeigths,
  yWeigths, buffer, scaleFactor, sizeX, sizeY;
let width = window.innerWidth;
let height = window.innerHeight;
let curves = limit;
//~ let curves = limit / 2;
//~ let curves = 2;
let ceiling = curves;
let power = 1;
let delay = 600;
/* Effective size of the buffer */
const BUFF_SIZE = 1080;
/* Change the ASPECT RATIO of your sketch with these */
const BUFF_WID_MOD = 1;
const BUFF_HEI_MOD = 1;
const BUFF_WID = BUFF_SIZE * BUFF_WID_MOD;
const BUFF_HEI = BUFF_SIZE * BUFF_HEI_MOD;
const CANVAS_PIXEL_DENSITY = 1;
const BUFF_PIXEL_DENSITY = 4;

let sketch = function(p5) {
  /**
   * @description Resize screen helper function
   */
  function checkRatio() {
    reRatio = p5.windowWidth / p5.windowHeight;
    if (reRatio > ratio) {
      scale = p5.windowHeight / p5.height;
      reWidth = (p5.windowHeight / p5.height) * p5.width;
      reHeight = p5.windowHeight;
    } else {
      scale = p5.windowWidth / p5.width;
      reWidth = p5.windowWidth;
      reHeight = (p5.windowWidth / p5.width) * p5.height;
    }
  }
  p5.setup = function() {
    p5.randomSeed(seed);
    p5.noiseSeed(seed);
    p5.colorMode(p5.HSL);
    size = p5.min(p5.windowWidth, p5.windowHeight);
    sizeX = size * BUFF_WID_MOD;
    sizeY = size * BUFF_HEI_MOD;
    canvas = p5.createCanvas(sizeX, sizeY);
    p5.pixelDensity(CANVAS_PIXEL_DENSITY);
    p5.frameRate(60);
    p5.noLoop();
  };
  p5.draw = async function() {
    console.log(`
fx(hash): ${fxhashTrunc}
fx(hash) base 10: ${fxhashDecimal}
Feature: ${featureVariant}
Bezier curves: ${curves}
Collatz number multiplier: ${power}
Animation delay: ${delay}
Longest Collatz sequence: ${ceiling}
`)
    buffer = p5.createGraphics(BUFF_WID, BUFF_HEI);
    buffer.colorMode(p5.HSL);
    buffer.pixelDensity(BUFF_PIXEL_DENSITY);
    p5.scaleFactor = BUFF_SIZE / size;
    buffer.scaleFactor = BUFF_SIZE / size;
    p5.backgroundColor = 255;
    buffer.background(255);
    buffer.stroke(0);
    buffer.noFill();
    for (let k = 0; k <= curves; k++) {
      buffer.translate(k, k);
      for (let j = 0; j <= k; j++) {
        x = collatzConjecture(math.round(fxrand() * power ** j));
        y = collatzConjecture(math.round(fxrand() * power ** j));
        xWeigths = [];
        yWeigths = [];
        for (let w = 0; w < x.length; w++) {
          xWeigths.push(p5.random());
        }
        for (let w = 0; w < y.length; w++) {
          yWeigths.push(p5.random());
        }
        buffer.beginShape();
        buffer.vertex(x[0], y[0]);
        for (let i = 0; i < x.length || i < y.length; i++) {
          buffer.stroke(
            //~ math.randomInt(360),
            math.round((i * 360) / math.max(i, ceiling)),
            //~ math.round((i * 100) / math.max(i, ceiling)),
            math.round((j * 100) / k),
            60
          );
          buffer.bezierVertex(
            x[math.min(i, y.length - 1)] * (math.pi / 4),
            y[math.min(i, y.length - 1)] * (math.pi - 3),
            x[math.min(i, y.length - 1)] * (math.phi / 2),
            y[math.min(i, x.length - 1)] * (math.phi - 1),
            math.pickRandom(x, xWeigths),
            math.pickRandom(y, yWeigths)
          );
          ceiling = math.max(i, ceiling);
          //~ await sleep(1);
        }
        buffer.endShape();
        p5.image(buffer, 0, 0, sizeX, sizeY);
        //~ await sleep(1);
      }
      await sleep(delay);
    }
    fxpreview();
    power = math.min(power + 1, limit);
    //~ if (fxrand() > 0.666666) {
      //~ ceiling = 0;
    //~ }
    await sleep(delay);
  };
  p5.windowResized = function() {
    size = p5.min(p5.windowWidth, p5.windowHeight);
    sizeX = size * BUFF_WID_MOD;
    sizeY = size * BUFF_HEI_MOD;
    p5.scaleFactor = BUFF_SIZE / size;
    p5.resizeCanvas(sizeX, sizeY);
    p5.image(buffer, 0, 0, sizeX, sizeY);
  }
  p5.keyTyped = function() {
    switch (p5.key) {
      case 'r':
        p5.redraw();
        break;
      case 'f':
        p5.windowResized();
        break;
      case 'q':
        power = math.max(1, power - 1);
        console.log(
          `Collatz random number multiplier decreased to ${power}`);
        break;
      case 'w':
        ceiling = 0;
        console.log(`longest Collatz sequence reset, it is now zero`);
        break;
      case 'e':
        power = math.min(limit, power + 1);
        console.log(
          `Collatz random number multiplier increased to ${power}`);
        break;
      case 'a':
        curves = math.max(1, curves - 1);
        console.log(`curves decreased to ${curves}`);
        break;
      case 's':
        p5.saveCanvas(canvas,
          `collatz_bezier_rainbow_v${version}_${curves}.png`);
        break;
      case 'd':
        curves = math.min(limit, curves + 1);
        console.log(`curves increased to ${curves}`);
        break;
      case 'z':
        delay = math.max(100, delay - 100);
        console.log(`animation delay decreased to ${delay}ms`);
        break;
      case 'x':
        delay = 0;
        console.log(`animation delay deactivated, it is now 0ms`);
        break;
      case 'c':
        delay = math.min(limit * 1e2, delay + 100);
        console.log(`animation delay increased to ${delay}ms`);
        break;
      default:
        console.log(`key ${p5.key} was pressed, which doesn't do anything`);
    }
  }
}

let myp5 = new p5(sketch, window.document.body);

/**
 * @description Collatz Conjecture Function
 * @param {int} number: A natural number to calculate the Collatz sequence
 * @returns {Array} the Collatz sequence for the given number
 */
function collatzConjecture(number = 0) {
  try {
    collatz_index[number][0];
    return collatz_index[number];
  } catch {
    let c = number;
    let a = [c];
    while (c > 1) {
      c = cc(c);
      a.push(c);
    }
    collatz_index[number] = a;
    return collatz_index[number];
  }
}

/**
 * @param {String} hash: unique fxhash string (or xtz transaction hash)
 * @returns {float} decimal representation of the number in base58 
 */
function base58toDecimal(hash = fxhashTrunc) {
  let decimal = 0;
  let iterArray = Array.from(hash).reverse();
  while (iterArray.length > 0) {
    decimal += properAlphabet.indexOf(iterArray.slice(-1)) * (math.pow(58,
      iterArray.length - 1));
    iterArray = iterArray.slice(0, -1);
  }
  return decimal;
}

/**
 * @param {float} decimalHash: output from base58toDecimal(fxhash)
 * @param {int} maxVariants: the inclusive n from the desired range 
 *      of (0, n) for the return value
 * @param {boolean} inverse: transforms range into (n, 0)
 * @returns {int} one random integer defined by fxhash and a threshold
 *      defined by maxVariants * variantFactor
 */
function fxHashToVariant(decimalHash, maxVariants = 0, inverse = false) {
  let variant = math.round(decimalHash * maxVariants * variantFactor);
  if (inverse) {
    return math.abs(maxVariants - variant);
  }
  return variant;
}

window.$fxhashFeatures = {
  "Bezier Curves": featureVariant
}
