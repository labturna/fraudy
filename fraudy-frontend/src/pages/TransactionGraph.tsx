import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { useTheme } from "@mui/material/styles";

interface TransactionGraphProps {
  address: string;
}

interface TooltipData {
  content: string;
  x: number;
  y: number;
}


const TransactionGraph: React.FC<TransactionGraphProps> = ({ address }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const rendererRef = useRef<Sigma | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  useEffect(() => {
    const graph = new Graph();
    // Add source node (your address)
    graph.addNode(address, {
      label: `Source: ${address.slice(0, 6)}...`,
      size: 30,
      color: "#ff9800",
      x: Math.random() * 10,
      y: Math.random() * 10,
      details: `Main Account\nAddress: ${address}\nTotal Sent: 450 XLM\nTotal Received: 120 XLM`
    });

    // Generate mock transaction data with depth
    const generateMockTransactions = (source: string, depth: number, currentDepth = 0) => {
      if (currentDepth >= depth) return;

      const transactionCount = 2 + Math.floor(Math.random() * 3);

      for (let i = 1; i <= transactionCount; i++) {
        const target = `${source}_T${currentDepth}_${i}`;
        const amount = Math.floor(Math.random() * 100) + 1;
        const isReturnTransaction = currentDepth > 0 && Math.random() > 0.7;

        if (!graph.hasNode(target)) {
          const received = Math.floor(Math.random() * 200) + 50;
          const sent = Math.floor(Math.random() * 150);
          graph.addNode(target, {
            label: currentDepth === 0 ? `Recipient ${i}` : `Node ${currentDepth}-${i}`,
            size: 22 - currentDepth * 3,
            color: currentDepth === 0 ? "#4caf50" :
              currentDepth === 1 ? "#2196f3" :
                currentDepth === 2 ? "#9c27b0" : "#607d8b",
            x: Math.random() * 10,
            y: Math.random() * 10,
            details: `Address: ${target}\n` +
              `Total Received: ${received} XLM\n` +
              `Total Sent: ${sent} XLM\n` +
              `First Tx: ${new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
          });
        }

        graph.addEdge(source, target, {
          label: `${amount} XLM`,
          size: 1,
          color: isReturnTransaction ? "#f44336" : "#888",
          type: isReturnTransaction ? "arrow" : "line",
          details: `From: ${source}\nTo: ${target}\nAmount: ${amount} XLM\n` +
            `Date: ${new Date().toLocaleDateString()}`
        });

        if (currentDepth < depth - 1 && Math.random() > 0.3) {
          generateMockTransactions(target, depth, currentDepth + 1);
        }

        if (currentDepth > 0 && Math.random() > 0.7) {
          const returnAmount = Math.floor(amount * 0.5);
          graph.addEdge(target, source, {
            label: `${returnAmount} XLM`,
            size: 1,
            color: "#f44336",
            type: "arrow",
            details: `Return Transaction\nFrom: ${target}\nTo: ${source}\nAmount: ${returnAmount} XLM`
          });
        }
      }
    };

    generateMockTransactions(address, 3);

    const positions = forceAtlas2(graph, {
      iterations: 200,
      settings: {
        gravity: 0.1,
        scalingRatio: 10,
        slowDown: 1
      }
    });

    graph.updateEachNodeAttributes((node, attrs) => ({
      ...attrs,
      x: positions[node]?.x ?? Math.random() * 10,
      y: positions[node]?.y ?? Math.random() * 10,
    }));

    if (containerRef.current) {
      const renderer = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: true,
        labelFont: "Inter, sans-serif",
        labelColor: { color: isDark ? "#08611e" : "#7827e3" },
        edgeLabelSize: 10,
        labelSize: 14,
        defaultEdgeColor: isDark ? "#aaa" : "#666",
        defaultNodeColor: isDark ? "#90caf9" : "#2196f3",
      });
      
      rendererRef.current = renderer;

      // Set up hover events
      renderer.on("enterNode", (event) => {
        const node = event.node;
        const nodeData = graph.getNodeAttributes(node);
        const position = renderer.viewportToGraph(event.event);

        setTooltip({
          content: nodeData.details || "No information available",
          x: position.x,
          y: position.y
        });
      });

      renderer.on("leaveNode", () => {
        setTooltip(null);
      });

      // Set up edge hover events
      renderer.on("enterEdge", (event) => {
        const edge = event.edge;
        const edgeData = graph.getEdgeAttributes(edge);
        const position = renderer.viewportToGraph(event.event);

        setTooltip({
          content: edgeData.details || "No information available",
          x: position.x,
          y: position.y
        });
      });

      renderer.on("leaveEdge", () => {
        setTooltip(null);
      });

      return () => {
        renderer.kill();
        rendererRef.current = null;
      };
    }
  }, [address]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      maxWidth: "1200px",
      margin: "24px auto 0"
    }}>
      <div
        ref={containerRef}
        style={{
          height: "80vh",
          width: "100%",
          minWidth: "320px",
          borderRadius: "12px",
          border: `1px solid ${isDark ? "#444" : "#ccc"}`,
          background: isDark
            ? "linear-gradient(to right, #0f2027, #0f2027,rgb(18, 40, 49))"
            : "linear-gradient(to right, #ffffff, #f0f4f8)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          marginTop: "24px",
          touchAction: "pan-x pan-y", // 🆕 ekledik
          cursor: "grab", // UX iyileştirmesi
        }}
      />
      {tooltip && rendererRef.current && (
        <div
          style={{
            position: "absolute",
            left: `clamp(10px, ${rendererRef.current.graphToViewport(tooltip).x + 10}px, calc(100% - 320px))`, // Keep tooltip on screen
            top: `clamp(10px, ${rendererRef.current.graphToViewport(tooltip).y + 10}px, calc(100% - 150px))`,
            backgroundColor: isDark ? "rgba(33,33,33,0.95)" : "rgba(255,255,255,0.95)",
            color: isDark ? "#fff" : "#000",
            border: `1px solid ${isDark ? "#444" : "#ddd"}`,
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 10,
            pointerEvents: "none",
            whiteSpace: "pre-line",
            fontSize: "14px",
            maxWidth: "min(300px, 90vw)", // Responsive width
            wordBreak: "break-word",
            backdropFilter: "blur(2px)",
            transform: "translateZ(0)", // Improve rendering performance
          }}
        >
          <div style={{
            fontWeight: "bold",
            marginBottom: "8px",
            fontSize: "15px",
            borderBottom: "1px solid #eee",
            paddingBottom: "4px"
          }}>
            {tooltip.content.split('\n')[0]}
          </div>
          <div>
            {tooltip.content.split('\n').slice(1).join('\n')}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionGraph;