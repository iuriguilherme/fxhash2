Collatz Bezier Rainbow
===

Powered by 
[fxhash webpack boilerplate](https://github.com/fxhash/fxhash-webpack-boilerplate)  

Generated token available for minting on 
[fx(hash)](https://www.fxhash.xyz/generative/25615)  

Description for fxhash.xyz
---

These are Bezier vertices using numbers from sequences made from the Collatz 
conjecture https://en.wikipedia.org/wiki/Collatz_conjecture  

The color of each vertex is defined in the HSL range relative to how large is 
the sequence compared to the size of the largest sequence found so far in the 
generation. Because it uses fxrandom() for each new number, the colors should 
slightly differ during each generation.  

The number of generated Bezier vertices is limited between 2 and 60, because a 
single vertex can leave the whole screen blank, and more than 60 can't be seen 
in the canvas space. In fact, the whole Bezier curves can't be seen in the 
canvas space, but this is deliberate and carefully coded for the artistic 
impression of the specific part that can be seen.  

A lot of Collatz sequences were pre calculated using a Python script for the 
higher Features, but for low number of vertices they are calculated at run 
time.  

The controls are optimized for a QWERTY keyboard:  

q w e r  
a s d  
z x c  

You can see what has changed in the Javascript console log.  

r: Restart the drawing (it is best to wait until the last drawing has finished, 
because the code is asynchronous)  

The random number multiplier is a factor that affects the size of the integers 
to search for the Collatz conjecture. The initial value is 60 - the number of 
Bezier vertices. For 50 Bezier vertices it means the random numbers will be 
multiplied by 10 at the power of each iteration (1e1, 1e2, 1e3, ... 1e50). The 
higher the multiplier, the higher is the probability of a larger sequence, and 
the drawing overall will be more green / blue. Shorter sequences will make the 
drawing appear more red.  

The numbers until 21000 have the sequence pre calculated in the collatz.js 
file, but numbers larger than that will be calculated at run time.  

q: Decrease the random number size in powers of ten  
e: Increase the random number size in powers of ten  
w: Resets the longest sequence size to zero  

The number of Bezier vertices define how crowded the canvas will be. Since the 
vertices are overlapping others, the highest value of 60 will fill all the 
screen, making a pattern as if matrix printers are drawing with colored crayons 
during an earthquake. The lowest value of 2 will show two random recognizable 
Bezier patterns with different colors.  

a: Decrease the number of Bezier curves or vertices  
d: Increase the number of Bezier curves or vertices  
s: Save the current canvas to PNG format  

The animation delay is the number in milliseconds that the async function will 
timeout until the next vertex is drawn.  

EPILETIC TRIGGER WARNING: If there are too few curves and the delay is too 
fast, you can be affected by the quick changes of the colors. I had two 
epilepsy events during development when testing low values.  

z: Decrease the animation delay in 100ms  
c: Increase the animation delay in 100ms  
x: Sets the animation delay to 0ms  

This token donates a small fraction of royalties to Girls Who Code and the 
Processing Foundation, which develops the software used to produce this art.  

Almost all of the secondary royalties goes to the minter.  

The source code is available by AGPLv3 at 
https://github.com/iuriguilherme/fxhash2  

LICENSE
---

Copyright 2023 Iuri Guilherme <https://iuri.neocities.org/>

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU Affero General Public License as published by the Free 
Software Foundation, either version 3 of the License, or (at your option) any 
later version.  

This program is distributed in the hope that it will be useful, but WITHOUT ANY 
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
PARTICULAR PURPOSE.  
See the GNU Affero General Public License for more details.  

You should have received a copy of the GNU Affero General Public License along 
with this program.  If not, see <https://www.gnu.org/licenses/>.  
