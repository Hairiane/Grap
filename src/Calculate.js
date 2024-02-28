export function calculateConnectivity(graph) {
  // Используем DFS для подсчета компонент связности
  const visited = new Set();
  let connectivity = 0;

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);

    graph[node].forEach(neighbor => dfs(neighbor));
  }

  Object.keys(graph).forEach(node => {
    if (!visited.has(node)) {
      dfs(node);
      connectivity++;
    }
  });

  return connectivity;
}

export function calculateCentrality(graph) {
  // Используем центральность по посредничеству
  const centrality = {};

  Object.keys(graph).forEach(node => {
    centrality[node] = 0;

    Object.keys(graph).forEach(neighbor => {
      if (node !== neighbor) {
        centrality[node] += graph[node].includes(neighbor) ? 1 : 0;
      }
    });
  });
  return 1;
}

export function calculateComplexity(graph) {
  // Используем количество ребер
  let complexity = 0;

  Object.keys(graph).forEach(node => {
    complexity += graph[node].length;
  });

  return complexity / 2; // Ребра учтены дважды
}

// Пример использования
// const starGraph = createStarGraph(6, 0.5);
// const graph = {};

// starGraph.links.forEach(link => {
//   if (!graph[link.source]) graph[link.source] = [];
//   if (!graph[link.target]) graph[link.target] = [];

//   graph[link.source].push(link.target);
//   graph[link.target].push(link.source);
// });

// console.log(graph);
// const connectivity = calculateConnectivity(graph);
// const centrality = calculateCentrality(graph);
// const complexity = calculateComplexity(graph);

// console.log("Связность:", connectivity);
// console.log("Индекс центральности:", centrality);
// console.log("Сложность:", complexity);
