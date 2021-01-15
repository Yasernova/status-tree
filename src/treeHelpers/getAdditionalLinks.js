/* eslint-disable prefer-destructuring */
import getEnds from './getEnds';

export default function getAdditionalLinking(activities, activitiesMap) {
  const closeMap = {};
  activities.forEach((act, i) => {
    if (act.closingActivity) {
      closeMap[act.rootActivityId] = [`${i}`, `${act.rootActivityId}/${act.status}`];
    }
  });

  const mainRoots = activities.filter(act => act.rootActivity && !act.branchActivity);
  const nestedRoots = {};
  activities.forEach((act) => {
    if (act.rootActivity && act.branchActivity) { nestedRoots[act.rootActivityId] = (nestedRoots[act.rootActivityId] || []).push(act.activityId); }
  });
  const ends = getEnds(activities, activitiesMap);
  const toBeLinked = {};
  function recurRoots(arr, parent) {
    arr.forEach((child) => {
      if (nestedRoots[child]) recurRoots(nestedRoots[child], child);
      const endsKeys = [];

      Object.keys(ends).forEach((key) => {
        if (ends[key] && key.startsWith(child)) {
          endsKeys.push(key);
          //   delete ends[key];
        }
      });
      if (closeMap[child]) {
        ends[closeMap[child][1]] = closeMap[child][0];
        toBeLinked[closeMap[child][0]] = endsKeys.map(key => ends[key]);
      } else if (parent) {
        endsKeys.forEach((key) => {
          const originalIndex = activitiesMap[key];
          ends[`${parent}/${key}`] = originalIndex;
        });
      }
    });
  }
  mainRoots.forEach(root => recurRoots([root.activityId]));
  return toBeLinked;
}
