export default function getActiviesMap(activities) {
  const activitiesMap = {};
  activities.forEach((act, i) => {
    if (act.branches) {
      return act.branches.forEach((branch) => {
        activitiesMap[`${act.activityId}/${branch.branchId}/${act.status}`] = i;
      });
    }
    if (act.branchActivity) {
      activitiesMap[`${act.rootActivityId}/${act.branchId}/${act.status}`] = i;
      return;
    }
    activitiesMap[act.status] = i;
  });
  return activitiesMap;
}
