import "./App.css";
import {TextField} from "@mui/material";
import {Button} from "@mui/material";
import {Box} from "@mui/material";
import React, {useState} from "react";
import * as d3 from "d3";
import {
  calculateCentrality,
  calculateComplexity,
  calculateConnectivity,
} from "./Calculate";

export const App = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [n, setN] = useState<number | null>(null);
  const [p, setP] = useState<number | null>(null);
  const [connectivity, setConnectivity] = useState<number | null>(null);
  const [centrality, setCentrality] = useState<number | null>(null);
  const [complexity, setComplexity] = useState<number | null>(null);
  const handleChangeN = ({value}: {value: string | null}) =>
    setN(Number(value));
  const handleChangeP = ({value}: {value: string | null}) =>
    setP(Number(value));
  const create = () => {
    if (isActive) {
      const el = document.getElementById("123");
      el?.remove();
      setIsActive(false);
    }
    const starGraph = createStarGraph(n, p);
    visualizeGraph(starGraph, n);
    const graph = {};
    starGraph.links.forEach(link => {
      if (!graph[link.source]) graph[link.source] = [];
      if (!graph[link.target]) graph[link.target] = [];

      graph[link.source].push(link.target);
      graph[link.target].push(link.source);
    });
    setConnectivity(calculateConnectivity(graph));
    setCentrality(calculateCentrality(graph));
    setComplexity(calculateComplexity(graph));
    console.log("Связность:", connectivity);
    console.log("Индекс центральности:", centrality);
    console.log("Сложность:", complexity);
    setIsActive(true);
  };
  function createStarGraph(numNodes, randomNum) {
    const nodes = Array.from({length: numNodes}, (_, i) => ({id: i}));
    const links = nodes.slice(1).map(node => ({
      source: node.id,
      target: 0,
      weight: Math.random() > randomNum ? 1 : 0, // Задаем вес связи от 0 до 1
    }));
    return {nodes, links};
  }

  // // Функция для визуализации графа
  function visualizeGraph(graph, numNodes) {
    const width = 800;
    const height = 800;

    const svg = d3
      .select("div")
      .select("div")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "123");

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        "link",
        d3
          .forceLink(graph.links)
          .id(d => d.id)
          .distance(numNodes < 10 ? 50 : numNodes * 4),
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke", "gray") // Цвет связей
      .attr("stroke-width", d => d.weight * 3); // Толщина связи в зависимости от веса

    const node = svg
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", "skyblue");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
  }

  return (
    <div className="App">
      <div style={{display: "flex", flexDirection: "column"}}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": {m: 1, width: "25ch"},
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            inputProps={{
              min: 0,
              max: 50,
            }}
            label="Число узлов"
            type="number"
            value={n}
            // @ts-ignore
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeN(e.target)
            }
          />
          <TextField
            inputProps={{
              min: 0,
              max: 1,
            }}
            label="Вероятность от 0-1"
            type="number"
            value={p}
            // @ts-ignore
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeP(e.target)
            }
          />
          <Button
            variant="outlined"
            disabled={n && p ? false : true}
            onClick={() => create()}
          >
            Создать граф
          </Button>
        </Box>
        <div>Связность: {connectivity}</div>
        <div>Индекс центральности:{centrality}</div>
        <div>Сложность: {complexity}</div>
      </div>
    </div>
  );
};
