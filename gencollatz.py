#!/usr/bin/env python3
"""This python script generates a javascript dictionary with the \
collatz sequence, collatz numbers as keys and for each number sequentially, \
the full Collatz sequence until 1, 4, 2 as an Array as values."""

from functools import lru_cache
import json
import os
import sys

out_file: str = os.path.join("public", "collatz.js")

try:
    limit: str = sys.argv[1]
except:
    limit: str = 3600
    print(f"Usage: `{sys.argv[0]} [LIMIT]`. Using {limit} as default.")

@lru_cache
def gen_collatz(n: int) -> int:
    """Collatz Conjecture"""
    yield n
    while n > 1:
        if n % 2:
            n = 3 * n + 1
        else:
            n = n // 2
        yield n

d: dict[str, str] = {str(n): list(gen_collatz(n)) for n in range(1, limit)}

with open(out_file, 'w') as f:
    f.write(f"collatz_index = {json.dumps(d)}")
