/**!
 * @file Collatz Bezier Rainbow
 * @version 3.0.1  
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

const version = "3.0.1";
const cc = (n = 1) => n != 1 && (n % 2 && (3 * n) + 1 || n / 2) || n;
const sleep = ms => new Promise(r => setTimeout(r, ms));
// https://github.com/fxhash/fxhash-webpack-boilerplate/issues/20
const properAlphabet = 
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const variantFactor = 3.904e-87; // This number is magic
const fxhashDecimal = base58toDecimal(fxhashTrunc);
const limit = 90;
const featureVariant = math.max(2, fxHashToVariant(fxhashDecimal, limit));
//~ const featureVariant = limit;
let x, y, size, scale, ratio, reWidth, reHeight, canvas, xw, yw;
let width = window.innerWidth;
let height = window.innerHeight;
let curves = limit;
//~ let curves = limit / 2;
//~ let curves = 2;
let ceiling = curves;
let power = 1;
let delay = 600;

let sketch = function(p5) {
  p5.setup = function() {
    p5.randomSeed(seed);
    p5.noiseSeed(seed);
    p5.colorMode(p5.HSL);
    ratio = width / height;
    checkRatio();
    size = p5.min(reWidth, reHeight);
    canvas = p5.createCanvas(size, size);
    scale = width / reWidth;
    p5.scale(scale);
    p5.frameRate(60);
    p5.noLoop();
  };
  p5.draw = async function() {
    p5.background(255);
    console.log(`
fx(hash): ${fxhashTrunc}
fx(hash) base 10: ${fxhashDecimal}
Feature: ${featureVariant}
Bezier curves: ${curves}
Collatz number multiplier: ${power}
Animation delay: ${delay}
Longest Collatz sequence: ${ceiling}
`)
    p5.stroke(0);
    p5.noFill();
    for (let k = 0; k <= curves; k++) {  
      p5.translate(k, k);
      for (let j = 0; j <= k; j++) {
        //~ p5.translate(j / k, j / k);
        x = collatzConjecture(math.round(fxrand() * power ** j));
        y = collatzConjecture(math.round(fxrand() * power ** j));
        xw = [];
        yw = [];
        for (let w = 0; w < x.length; w++) {
          xw.push(p5.random());
        }
        for (let w = 0; w < y.length; w++) {
          yw.push(p5.random());
        }
        p5.beginShape();
        p5.vertex(x[0], y[0]);
        for (let i = 0; i < x.length || i < y.length; i++) {
          p5.stroke(
            math.randomInt(360),
            math.round((i * 100) / math.max(i, ceiling)),
            //~ math.round((j * 100) / k),
            60
          );
          p5.bezierVertex(
            x[math.min(i, y.length - 1)] * (math.pi / 4),
            y[math.min(i, y.length - 1)] * (math.pi - 3),
            x[math.min(i, y.length - 1)] * (math.phi / 2),
            y[math.min(i, x.length - 1)] * (math.phi - 1),
            math.pickRandom(x, xw),
            math.pickRandom(y, yw)
          );
          ceiling = math.max(i, ceiling);
        }
        p5.endShape();
        //~ p5.beginShape();
        //~ p5.vertex(p5.width, p5.height);
        //~ for (let i = 0; i < x.length || i < y.length; i++) {
          //~ p5.stroke(
            //~ math.randomInt(360),
            //~ math.round((i * 360) / math.max(i, ceiling)),
            //~ math.abs(100 - math.round((j * 100) / k)),
            //~ math.round((j * 100) / k),
            //~ limit
          //~ );
          //~ p5.bezierVertex(
            //~ p5.width - x[math.min(i, x.length - 1)] * (math.pi / 2),
            //~ p5.height - y[math.min(i, y.length - 1)] * math.phi,
            //~ p5.width - math.pickRandom(x, xw),
            //~ p5.height - math.pickRandom(y, yw),
            //~ p5.width - x[math.min(i, y.length - 1)],
            //~ p5.height - y[math.min(i, x.length - 1)],
          //~ );
          //~ ceiling = math.max(i, ceiling);
        //~ }
        //~ p5.endShape();
      }
      checkRatio();
      scale = p5.width / reWidth;
      p5.scale(scale);
      await sleep(delay);
    }
    fxpreview();
    power = math.min(power + 1, limit);
    if (fxrand() > 0.666666) {
      ceiling = 0;
    }
    await sleep(delay);
  };
  p5.windowResized = function() {
    checkRatio();
    size = p5.min(reWidth, reHeight);
    p5.resizeCanvas(size, size);
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
 * @description Resize screen helper function
 */
function checkRatio() {
  let reRatio = window.innerWidth / window.innerHeight;
  if (reRatio > ratio) {
    scale = window.innerHeight / height;
    reWidth = (window.innerHeight / height) * width;
    reHeight = window.innerHeigth;
  } else {
    scale = window.innerWidth / width;
    reWidth = window.innerWidth;
    reHeight = (window.innerWidth / width) * height;
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
