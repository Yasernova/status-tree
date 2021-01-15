const arrify = x => [].concat(x);

export default function getEnds(activities, activitiesMap) {
  const nodes = {};
  activities.forEach((act) => {
    const withPrev = act.previousStatusArray || act.previousStatus;
    if (!withPrev) return;

    if (act.branches) {
      act.branches.forEach((branch) => {
        const id = `${act.activityId}/${branch.branchId}/${act.status}`;
        if (nodes[id] == null) {
          nodes[id] = true;
        }
      });
    } else {
      const id = act.branchActivity ? `${act.rootActivityId}/${act.branchId}/${act.status}` : act.status;
      if (nodes[id] == null) {
        nodes[id] = true;
      }
    }
    arrify(withPrev).forEach((prev) => {
      const id = act.branchActivity ? `${act.rootActivityId}/${act.branchId}/${prev}` : prev;
      nodes[id] = false;
    });
  });
  Object.keys(nodes).forEach((key) => {
    if (nodes[key]) {
      nodes[key] = activitiesMap[key];
    } else {
      delete nodes[key];
    }
  });
  return nodes;
}
