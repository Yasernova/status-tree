/* eslint-disable new-cap */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
// import dagreD3 from 'dagre-d3';
// import * as d3 from 'd3';
import dagre from 'dagre';
import uniq from 'lodash/uniq';
import getEnds from './getEnds';
import getAdditionalLinking from './getAdditionalLinks';
import getActivitiesMap from './getActivitiesMap';
import getTreeRoutes from './getTreeRoutes';
import getCurrentPointsIndx from './getCurrentPointsIndx';
import arrify from './arrify';


export default function (acts, history, branchesStatuses, svgRef, containerWidth) {
  const g = new dagre.graphlib.Graph()
    .setGraph({ ranksep: 100 })
    .setDefaultEdgeLabel(() => ({}));

  const activities = acts.map(act => ({ ...act }));
  const activitiesMap = getActivitiesMap(activities);
  const toBeLinked = getAdditionalLinking(activities, activitiesMap);
  const activitiesMapReversed = Object.fromEntries(Object.entries(activitiesMap).map(([key, value]) => [value, key]));
  Object.entries(toBeLinked).forEach(([key, arr]) => {
    activities[key] = { ...activities[key], previousStatusArray: arr.map(key => activitiesMapReversed[key]) };
  });
  const ends = getEnds(activities, activitiesMap);
  activities.forEach((act, i) => {
    act.index = i;
    const withPrev = act.previousStatusArray || act.previousStatus;
    if (withPrev) {
      act.previousIndexArray = arrify(withPrev).map(prev => (act.branchActivity ? activitiesMap[`${act.rootActivityId}/${act.branchId}/${prev}`] : activitiesMap[prev]));
    }
  });
  const routes = getTreeRoutes(activities, Object.values(ends));
  const indxs = getCurrentPointsIndx(activities, branchesStatuses);
  const intersecArrays = indxs.reduce((acc, n) => {
    acc[n] = routes.filter(r => r.includes(n));
    return acc;
  }, {});

  const prevIndxs = uniq(Object.entries(intersecArrays)
    .flatMap(([n, rs]) => rs.map(r => r.slice(r.indexOf(+n))))
    .flat());
  const excludesPrevActs = prevIndxs.reduce((acc, indx) => {
    const _acc = {};
    const act = activities[indx];
    if (act.branchActivity) {
      const parent = history.find(h => h.activityId === act.rootActivityId);
      const result = parent.branchesHistory[act.branchId].find(h => h.newStatus === act.status);
      if (!result) _acc[indx] = act;
    } else {
      const result = history.find(h => h.newStatus === act.status);
      if (!result) _acc[indx] = act;
    }
    return Object.assign(acc, _acc);
  }, {});

  const intersecMap = Object.entries(intersecArrays).reduce((acc, [key, r]) => {
    const _acc = {};
    r.flat().forEach((n) => {
      if (!excludesPrevActs[n]) { _acc[n] = true; }
    });
    return Object.assign(acc, _acc);
  }, {});

  const activitiesOfIntersec = activities.filter((act, i) => intersecMap[i]);

  activitiesOfIntersec.forEach((act) => {
    const isDone = prevIndxs.includes(act.index);
    g.setNode(act.index, {
      width: 200,
      height: 50,
      isDone,
      // class: isDone ? 'done' : '',
      // title: act.activityName,
      // label: act.activityName.length > 27 ? `...${act.activityName.slice(0, 24)}` : act.activityName,
    });
  });
  // g.nodes().forEach((v) => {
  //   const node = g.node(v);
  //   node.rx = 5;
  //   node.ry = 5;
  // });
  activitiesOfIntersec.forEach((act) => {
    const withPrev = act.previousIndexArray;
    if (withPrev) {
      return (withPrev).forEach((prev) => {
        if (!intersecMap[prev]) return;
        g.setEdge(prev, act.index, {
          // arrowheadClass: 'arrowhead',
          // label: activities[prev].rootActivity ? 'اسم البرانش' : '',
          // curve: d3.curveBasis,
        });
      });
    }
  });
  dagre.layout(g);
  // console.log(g, g.nodes());
  return [g, indxs];
}
// Create the renderer
//   const render = new dagreD3.render();

//   // Set up an SVG group so that we can translate the final graph.
//   const svg = d3.select(svgRef);
//   const svgGroup = svg.append('g');

//   const zoom = d3.zoom()
//     .on('zoom', (e) => {
//       svgGroup.attr('transform', e.transform);
//     });
//   svg.call(zoom);
//   // Run the renderer. This is what draws the final graph.
//   render(d3.select('svg g'), g);
//   d3.selectAll('g.node').attr('data-tip', v => g.node(v).title);
//   // Center the graph
//   svg.attr('width', containerWidth);
//   // svg.attr('margin', 'auto');
//   const xCenterOffset = (svg.attr('width') - g.graph().width) / 2;
//   svgGroup.attr('transform', `translate(${xCenterOffset}, 20)`);
//   svg.attr('height', g.graph().height + 40);
// }

// const activities = acts.map(act => ({ ...act, children: [] }));
// const activitiesMap = getActivitiesMap(activities);

// const toBeLinked = getAdditionalLinking(activities, activitiesMap);
// const activitiesMapReversed = Object.fromEntries(Object.entries(activitiesMap).map(([key, value]) => [value, key]));
// Object.entries(toBeLinked).forEach(([key, arr]) => {
//   activities[key] = { ...activities[key], previousStatusArray: arr.map(key => activitiesMapReversed[key]) };
// });
// const ends = getEnds(activities, activitiesMap);

// // console.log(ends, toBeLinked);

// activities.forEach((act, i) => {
//   act.index = i;
//   const withPrev = act.previousStatusArray || act.previousStatus;
//   if (withPrev) {
//     act.previousIndexArray = arrify(withPrev).map(prev => (act.branchActivity ? activitiesMap[`${act.rootActivityId}/${act.branchId}/${prev}`] : activitiesMap[prev]));
//   }
// });

// const routes = getTreeRoutes(Object.values(ends));
// const branchesStatuses = {
//   nyaba: '14',
//   mror: '215',
// };

// const indxs = getCurrentPointsIndx(branchesStatuses);
// // console.log(indxs);
// const intersecArrays = indxs.reduce((acc, n) => {
//   acc[n] = routes.filter(r => r.includes(n));
//   return acc;
// }, {});

// const prevIndxs = uniq(Object.entries(intersecArrays)
//   .flatMap(([n, rs]) => rs.map(r => r.slice(r.indexOf(+n))))
//   .flat());
// // const intersecArrays = routes.filter(r => r.includes(21));
// const excludesPrevActs = prevIndxs.reduce((acc, indx) => {
//   const _acc = {};
//   const act = activities[indx];
//   if (act.branchActivity) {
//     const parent = history.find(h => h.activityId === act.rootActivityId);
//     const result = parent.branchesHistory[act.branchId].find(h => h.newStatus === act.status);
//     if (!result) _acc[indx] = act;
//     // else act.done = true;
//   } else {
//     const result = history.find(h => h.newStatus === act.status);
//     if (!result) _acc[indx] = act;
//     // else act.done = true;
//   }
//   return Object.assign(acc, _acc);
// }, {});
// // console.log(intersecArrays, activities, excludesPrevActs);
// const intersecMap = Object.entries(intersecArrays).reduce((acc, [key, r]) => {
//   const _acc = {};
//   r.flat().forEach((n) => {
//     if (!excludesPrevActs[n]) { _acc[n] = true; }
//   });
//   return Object.assign(acc, _acc);
// }, {});
// // console.log(intersec);
// // Object.values(ends);
// // .reduce(end => {

// // });
// const activitiesOfIntersec = activities.filter((act, i) => intersecMap[i]);

// activitiesOfIntersec.forEach((act) => {
//   const isDone = prevIndxs.includes(act.index);
//   g.setNode(act.index, {
//     class: isDone ? 'done' : '',
//     title: act.activityName,
//     label: act.activityName.length > 27 ? `...${act.activityName.slice(0, 24)}` : act.activityName,
//   });
// //   g.setNode(act.index, { label: act.status });
// });
// g.nodes().forEach((v) => {
//   const node = g.node(v);
//   // Round the corners of the nodes
//   node.rx = node.ry = 5;
// });
// activitiesOfIntersec.forEach((act) => {
//   const withPrev = act.previousIndexArray;
//   if (withPrev) {
//     return (withPrev).forEach((prev) => {
//       if (!intersecMap[prev]) return;
//       g.setEdge(prev, act.index, {
//         arrowheadClass: 'arrowhead',
//         // label: activities[prev].rootActivity ? 'اسم البرانش' : '',
//         curve: d3.curveBasis,
//       });
//     });
//   }
// });

// // Create the renderer
// const render = new dagreD3.render();

// // Set up an SVG group so that we can translate the final graph.
// const svg = d3.select('svg');
// const svgGroup = svg.append('g');

// const zoom = d3.zoom()
//   .on('zoom', (e) => {
//     svgGroup.attr('transform', e.transform);
//   });
// svg.call(zoom);
// // Run the renderer. This is what draws the final graph.
// render(d3.select('svg g'), g);
// d3.selectAll('g.node').attr('data-tip', v => g.node(v).title);
// // Center the graph
// svg.attr('width', 1000);
// // svg.attr('margin', 'auto');
// const xCenterOffset = (svg.attr('width') - g.graph().width) / 2;
// svgGroup.attr('transform', `translate(${xCenterOffset}, 20)`);
// svg.attr('height', g.graph().height + 40);


// // const getPathPart = (str, postFix = '', def = '') => (str ? `${str}${postFix}` : def);
//
