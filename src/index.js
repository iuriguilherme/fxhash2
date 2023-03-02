/**!
 * @file Collatz Bezier Rainbow
 * @version 2.1.0  
 * @copyright Iuri Guilherme 2023  
 * @license GNU AGPLv3  
 * @author Iuri Guilherme <https://iuri.neocities.org/>  
 * @description This is Collatz Bezier Rainbow made with p5js for 
 *      fxhash.xyz genarative tokens. Source code available at Github: 
 *      https://github.com/iuriguilherme/fxhash1  
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

import p5 from 'p5';
import { create, all } from 'mathjs';
const math = create(all, {})

const version = "2.1.0";
const cc = (n = 1) => n != 1 && (n % 2 && (3 * n) + 1 || n / 2) || n;
const sleep = ms => new Promise(r => setTimeout(r, ms));
// https://github.com/fxhash/fxhash-webpack-boilerplate/issues/20
const properAlphabet = 
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const variantFactor = 3.904e-87; // This number is magic
const fxhashDecimal = base58toDecimal(fxhashTrunc);
const limit = 60;
const featureVariant = math.max(2, fxHashToVariant(fxhashDecimal, limit));
//~ const featureVariant = limit;
let size, scale, ratio, reWidth, reHeight, canvas;
let width = window.innerWidth;
let height = window.innerHeight;
let curves = featureVariant;
let ceiling = curves;
let power = 60 - curves;
let delay = 600;

let sketch = function(p5) {
  p5.setup = function() {
    p5.randomSeed(fxrand() * 1e8);
    p5.noiseSeed(fxrand() * 1e8);
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
      for (let j = 0; j <= k; j++) {
        p5.translate(j / k, j / k);
        let x = collatzConjecture(math.round(fxrand() * power ** j));
        let y = collatzConjecture(math.round(fxrand() * power ** j));
        let start_x = x[0];
        let start_y = y[0];
        p5.beginShape();
        p5.vertex(start_x, start_y);
        for (let i = 0; i < x.length || i < y.length; i++) {
          p5.stroke(
            math.round((i * 360) / math.max(i, ceiling)),
            math.round((j * 100) / k),
            limit
          );
          p5.bezierVertex(
            x[math.min(i, x.length - 1)] * math.phi,
            y[math.min(i, y.length - 1)] * math.phi,
            y[math.min(i, y.length - 1)] * math.phi,
            x[math.min(i, x.length - 1)] * math.phi,
            x[math.min(i, x.length - 1)],
            y[math.min(i, y.length - 1)],
          );
          ceiling = math.max(i, ceiling);
        }
        p5.endShape();
      }
      await sleep(delay);
    }
    fxpreview();
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
      case 'q':
        power = math.max(1, power - 1);
        console.log(
          `Collatz random number multiplier decreased to ${power}`);
        break;
      case 'w':
        ceiling = 0;
        console.log(`longest Collatz sequence reset`);
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
        console.log(`animation delay deactivated`);
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
