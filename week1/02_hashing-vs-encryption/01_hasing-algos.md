# Common hashing algorithms - SHA-256, MD5

## MD5

- **Output size:** 128 bits (32 hex characters)
- **Speed:** Very fast
- **Security:** ❌ **Broken**
- **Collisions:** Easy to generate (two different inputs with same hash)
- **Use today:**
    - ❌ Cryptography
    - ❌ Password hashing
    - ⚠️ Only for non-security uses (e.g., quick checksums)

**Status:** Obsolete for security purposes.


## SHA-256

- **Output size:** 256 bits (64 hex characters)
- **Speed:** Slower than MD5 (but still fast)
- **Security:** ✅ **Strong**
- **Collisions:** Computationally infeasible with current technology
- **Use today:**
    - ✅ Cryptography
    - ✅ Digital signatures
    - ✅ Blockchain (Bitcoin)