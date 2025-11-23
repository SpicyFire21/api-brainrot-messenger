// =================== UTILITAIRES ===================

// PGCD
function pgcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return Math.abs(a);
}

// Inverse modulaire (très simple)
function inverseModulaire(e, phi) {
    for (let d = 1; d < phi; d++) {
        if ((e * d) % phi === 1) return d;
    }
    return 0;
}

// Test de primalité
function estPremier(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

// Nombre premier aléatoire dans [min, max]
function premierAleatoire(min, max) {
    let p;
    do {
        p = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (!estPremier(p));
    return p;
}

// Exponentiation modulaire rapide
function expoModulaire(a, n, m) {
    if (n === 0) return 1 % m;
    let demi = expoModulaire(a, Math.floor(n / 2), m);
    demi = (demi * demi) % m;
    if (n % 2 === 1) demi = (demi * (a % m)) % m;
    return demi;
}

// =================== GÉNÉRATION DES CLÉS ===================
export function generateKeys() {
    let p = premierAleatoire(100, 300);
    let q = premierAleatoire(100, 300);
    while (p === q) q = premierAleatoire(100, 300);

    let n = p * q;
    let phi = (p - 1) * (q - 1);

    let e = 3;
    while (pgcd(e, phi) !== 1) e += 2;

    let d = inverseModulaire(e, phi);

    console.log(`p=${p}, q=${q}, n=${n}, phi=${phi}`);
    console.log(`Public Key (e,n)=(${e},${n})`);
    console.log(`Private Key (d,n)=(${d},${n})`);

    return { e, d, n };
}

// =================== CHIFFREMENT ===================
export function encrypt(message, e, n) {
    const cipher = [];
    for (let i = 0; i < message.length; i++) {
        cipher.push(expoModulaire(message.charCodeAt(i), e, n));
    }
    return cipher;
}

// =================== DÉCHIFFREMENT ===================
export function decrypt(cipher, d, n) {
    let message = '';
    for (const c of cipher) {
        message += String.fromCharCode(expoModulaire(c, d, n));
    }
    return message;
}


