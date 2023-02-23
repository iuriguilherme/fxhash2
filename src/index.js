/**!
 * @file Collatz Bezier Rainbow
 * @version 1.0.0  
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

const sleep = ms => new Promise(r => setTimeout(r, ms));
// https://github.com/fxhash/fxhash-webpack-boilerplate/issues/20
const properAlphabet = 
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const variantFactor = 3.904e-87; // This number is magic
const luminance = 60;
const fxhashDecimal = base58toDecimal(fxhashTrunc);
const featureVariant = fxHashToVariant(fxhashDecimal, 60);
//~ const featureVariant = 60;
let size, scale, ratio, reWidth, reHeight;
let width = window.innerWidth;
let height = window.innerHeight;

let sketch = function(p5) {
  p5.setup = function() {
    p5.randomSeed(fxrand() * 1e8);
    p5.colorMode(p5.HSL);
    ratio = width / height;
    checkRatio();
    size = p5.min(reWidth, reHeight);
    p5.createCanvas(size, size);
    scale = width / reWidth;
    p5.scale(scale);
    p5.frameRate(60);
    //~ p5.noLoop();
  };
  p5.draw = async function() {
    p5.background(255);
    //~ console.log({
      //~ "fxhash": fxhashTrunc,
      //~ "fxhashDecimal": fxhashDecimal,
      //~ "featureVariant": featureVariant
    //~ })
    p5.stroke(0);
    p5.noFill();
    for (let k = 0; k <= featureVariant; k++) {  
      for (let j = 0; j <= k; j++) {
        p5.translate(j / k, j / k);
        let x = math.round(fxrand() * 10 ** j);
        let y = math.round(fxrand() * 10 ** j);
        let start_x = x;
        let start_y = y;
        p5.beginShape();
        p5.vertex(x, y);
        let i = 0;
        while (x > 4 || y > 4) {
          //~ console.log({"i": i, "j": j, "k": k, "x": x, "y": y});
          p5.stroke(
            math.round((i * 360) / math.max(i, 597)),
            math.round((j * 100) / k),
            luminance
          );
          p5.bezierVertex(
            x * math.phi,
            y * math.phi,
            y * math.phi,
            x * math.phi,
            x,
            y,
          );
          x = collatzConjecture(x);
          y = collatzConjecture(y);
          i++;
        }
        p5.endShape();
      }
    }
    fxpreview();
    await sleep(math.abs(featureVariant * 1000 / 60 - 1000));
  };
  p5.windowResized = function() {
    checkRatio();
    size = p5.min(reWidth, reHeight);
    p5.resizeCanvas(size, size);
  }
}
let myp5 = new p5(sketch, window.document.body);

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

/**
 * @description Collatz Conjecture Function
 * @param {int} number: A natural number to test for eveness / oddness
 * @returns {int} next number in Collatz Conjecture
 */
function collatzConjecture(number = 0) {
  if (number % 2) {
    return (3 * number) + 1;
  }
  return number / 2;
}

window.$fxhashFeatures = {
  "Bezier Curves": featureVariant
}
