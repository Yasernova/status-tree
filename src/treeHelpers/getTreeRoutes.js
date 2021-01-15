export default function getTreeRoutes(activities, indxs, from = []) {
  return indxs.reduce((acc, ind) => {
    const _from = from.concat(ind);
    const act = activities[ind];
    if (act.previousIndexArray) return acc.concat(getTreeRoutes(activities, act.previousIndexArray, _from));
    return acc.concat([_from]);
  }, []);
}
