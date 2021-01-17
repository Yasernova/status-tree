import React, { useMemo, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider, Background, Controls, useStore, useZoomPanHelper,
} from 'react-flow-renderer';
import draw from './dagree';
import acts, { history } from './acts';

function nodeUI(activityName, isDone) {
  return (
    <span className={`${isDone ? 'shadow-md' : ''}`}>
      {activityName}
    </span>
  );
}

function DrawTree() {
  // متربطش القافله بأكتيفتى ريجيكتد
  // لما تجيب الراوتس المشتركة استخدم اللى اخرهم مش ريجيكتيد لو مفيش استخدم اللى معاك
  const branchesStatuses = {
    nyaba: '14',
    mror: '215',
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [g, currentIndexs] = useMemo(() => draw(acts, history, branchesStatuses), []);
  const elements = useMemo(() => [
    g.nodes().map(id => ({
      id,
      data: { label: nodeUI(acts[id].activityName, g.node(id).isDone) },
      position: { x: g.node(id).x, y: g.node(id).y },
      style: g.node(id).isDone
        ? { backgroundColor: 'rgba(20, 184, 166)', color: 'white', border: 'none' }
        : { backgroundColor: 'white', color: 'black', border: '1px solid #444' }
    })),
    g.edges().map(({ v, w }) => ({
      id: `e${v}${w}`, source: v, target: w, arrowHeadType: 'arrowclosed', type: 'smoothstep',
    })),
  ].flat(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  const store = useStore();
  const { transform } = useZoomPanHelper();
  useEffect(() => {
    const { nodes, width } = store.getState();
    if (nodes.length) {
      const node = nodes[0];
      const x = width / 2 - (node.__rf.position.x + node.__rf.width / 2);
      const zoom = 1;
      transform({ x, y: 0, zoom });
    }
  }, [currentIndexs, store, transform]);
  const graphStyles = { width: "100%", height: "600px" };
  return (
    <div className="p-10">
      <div dir="ltr" className="shadow-lg rounded-lg h-600px">
        <ReactFlow
          style={graphStyles}
          arrowHeadColor="#94a3b8"
          elements={elements}
          elementsSelectable
          nodesConnectable={false}
          nodesDraggable={false}
          zoomOnScroll
          zoomOnDoubleClick
          paneMoveable
          snapToGrid
          maxZoom="1"
        >
          <Background />
          <Controls showInteractive={false} showFitView={false} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default () => <ReactFlowProvider><DrawTree /></ReactFlowProvider>;
