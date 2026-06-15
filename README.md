# Perlin Noise — SIGGRAPH 1985

Implementação interativa do algoritmo **Perlin Noise** (ruído de gradiente), baseada no artigo original:

> Ken Perlin. **"An Image Synthesizer"**.  
> ACM SIGGRAPH Computer Graphics, v. 19, n. 3, p. 287–296, 1985.  
> DOI: [10.1145/325165.325247](https://doi.org/10.1145/325165.325247)

**Trabalho 3.1 / 3.2 — Tópicos Especiais em Computação Gráfica**  
UNIVALI — Universidade do Vale do Itajaí, 2025/1

**Acadêmicos:** Bruno Petroski Enghi · Lívia Zimermann · Lucas Rodrigues Pinheiro

---

## Demo

Abra `index.html` diretamente no navegador — nenhuma instalação necessária.

Ou acesse a versão online via GitHub Pages (se habilitado no repositório).

---

## Estrutura

```
perlin-noise/
├── index.html   # Demo interativo completo
├── perlin.js    # Módulo do algoritmo (PerlinNoise class)
└── README.md
```

---

## O Algoritmo

### Perlin Noise (ruído de gradiente)

O algoritmo gera valores de ruído contínuos e suaves a partir de quatro etapas:

1. **Grade de gradientes** — cada vértice de uma grade regular recebe um vetor gradiente pseudoaleatório, determinado por uma tabela de permutação.

2. **Produto interno** — para um ponto de consulta `p`, calcula-se o produto interno entre o gradiente de cada vértice vizinho e o vetor de deslocamento de `p` até aquele vértice.

3. **Interpolação suave** — os valores são interpolados com a função cúbica:
   ```
   f(t) = 6t⁵ − 15t⁴ + 10t³
   ```
   Garante continuidade de C¹ e C² nas bordas das células.

4. **fBm (fractal Brownian motion)** — múltiplas oitavas são somadas com frequência crescente e amplitude decrescente, produzindo detalhes em diferentes escalas.

### Complexidade

- Tempo: **O(2ⁿ)** por ponto consultado, onde `n` é a dimensão
- Espaço: **O(1)** (tabela de permutação de tamanho fixo)

---

## Uso do módulo `perlin.js`

```js
// Importar (ES module ou <script src="perlin.js">)
const p = new PerlinNoise(/* seed opcional */);

// Ruído simples em 2D ou 3D
const n = p.noise(x, y);       // retorna valor em [-1, 1]
const n = p.noise(x, y, z);

// fBm com oitavas
const n = p.fbm(x, y, z, octaves = 4, persistence = 0.5);
```

---

## Modos de Visualização

| Modo      | Descrição                                                  |
|-----------|------------------------------------------------------------|
| Textura   | Escala de cinza direta — visualiza o valor bruto do ruído  |
| Terreno   | Mapa de altura com paleta de cores (água → neve)           |
| Nuvens    | Gradiente azul/branco com fBm animado no eixo Z (tempo)    |
| Contornos | Linhas de isovalor sobrepostas ao ruído em escala de cinza |

---

## Referências

- PERLIN, K. An image synthesizer. *ACM SIGGRAPH Computer Graphics*, v. 19, n. 3, p. 287–296, 1985.
- PERLIN, K. Improving noise. *ACM Transactions on Graphics*, v. 21, n. 3, p. 681–682, 2002.
- EBERT, D. S. et al. *Texturing and Modeling: A Procedural Approach*. 3. ed. Morgan Kaufmann, 2003.
