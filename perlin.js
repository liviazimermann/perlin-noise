/**
 * Perlin Noise — implementação baseada em:
 * Ken Perlin, "An Image Synthesizer", SIGGRAPH 1985
 * DOI: 10.1145/325165.325247
 *
 * Implementação: Bruno Petroski Enghi, Lívia Zimermann, Lucas Rodrigues Pinheiro
 * UNIVALI — Tópicos Especiais em Computação Gráfica, 2025/1
 */

class PerlinNoise {
  constructor(seed = Math.random()) {
    // Tabela de permutação pseudoaleatória (256 entradas, duplicada para evitar overflow)
    this._p = [...Array(256)].map((_, i) => i);
    this._shuffle(seed);
    this.perm = [...this._p, ...this._p];
  }

  /**
   * Embaralha a tabela de permutação usando Fisher-Yates com semente determinística.
   */
  _shuffle(seed) {
    let s = seed * 2 ** 32;
    const rng = () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 2 ** 32;
    };
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [this._p[i], this._p[j]] = [this._p[j], this._p[i]];
    }
  }

  /**
   * Função de suavização cúbica (Ken Perlin, 2002 — versão melhorada):
   * f(t) = 6t^5 - 15t^4 + 10t^3
   * Garante continuidade de primeira e segunda derivada nas bordas de célula.
   */
  _fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /** Interpolação linear */
  _lerp(a, b, t) {
    return a + t * (b - a);
  }

  /**
   * Função gradiente: associa um hash a um vetor gradiente unitário e
   * calcula o produto interno com o vetor de deslocamento (x, y, z).
   */
  _grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }

  /**
   * Ruído de gradiente 3D (Perlin Noise clássico).
   * Retorna valor no intervalo aproximado [-1, 1].
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number}
   */
  noise(x, y, z = 0) {
    const perm = this.perm;

    // Coordenadas da célula
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    // Posição relativa dentro da célula
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    // Curvas de suavização
    const u = this._fade(x);
    const v = this._fade(y);
    const w = this._fade(z);

    // Hashes dos 8 vértices do cubo unitário
    const A  = perm[X]     + Y,  AA = perm[A]     + Z,  AB = perm[A + 1] + Z;
    const B  = perm[X + 1] + Y,  BA = perm[B]     + Z,  BB = perm[B + 1] + Z;

    // Interpolação trilinear dos gradientes nos vértices
    return this._lerp(
      this._lerp(
        this._lerp(this._grad(perm[AA],     x,     y,     z),
                   this._grad(perm[BA],     x - 1, y,     z), u),
        this._lerp(this._grad(perm[AB],     x,     y - 1, z),
                   this._grad(perm[BB],     x - 1, y - 1, z), u), v),
      this._lerp(
        this._lerp(this._grad(perm[AA + 1], x,     y,     z - 1),
                   this._grad(perm[BA + 1], x - 1, y,     z - 1), u),
        this._lerp(this._grad(perm[AB + 1], x,     y - 1, z - 1),
                   this._grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v),
      w
    );
  }

  /**
   * Fractal Brownian Motion (fBm) — soma de múltiplas oitavas do ruído.
   * Cada oitava dobra a frequência e multiplica a amplitude pela persistência.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} octaves   - número de camadas (padrão: 4)
   * @param {number} persistence - fator de amplitude por oitava (padrão: 0.5)
   * @returns {number} valor normalizado em [-1, 1]
   */
  fbm(x, y, z = 0, octaves = 4, persistence = 0.5) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value    += this.noise(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return value / maxValue;
  }
}

// Exporta para uso como módulo ES (import) ou CommonJS (require)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PerlinNoise };
} else {
  window.PerlinNoise = PerlinNoise;
}
