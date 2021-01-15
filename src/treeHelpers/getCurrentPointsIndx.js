export default function getCurrentPointsIndx(activities, bs) {
  if (typeof bs === 'string') return [activities.findIndex(act => act.status === bs)];
  return Object.entries(bs).map(([branchId, status]) => activities.findIndex(act => act.branchId === branchId && act.status === status));
}
// function strInject(str, n, x) {
//   const arr = str.split(' ');
//   const nOfB = Math.ceil(arr.length / n);
//   const ps = Array.from({ length: nOfB }).reduce((acc, _, i) => [...acc, arr.slice(i * n, (i + 1) * n)], []);
//   return ps.flatMap((p, i, { length }) => (i === length - 1 ? p : p.concat(x))).join(' ');
// }
