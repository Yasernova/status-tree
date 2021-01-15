import React, { useRef, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { useRetryVariable } from 'e-service-form';
import draw from './dagree';
import acts, { history } from './acts';

export default function DrawTree() {
  const w = useRef();
  const s = useRef();
  const [v, r] = useRetryVariable();
  useEffect(() => {
    // هندل تلوين الاستيتاس العادية مش البرانش
    // متربطش القافله بأكتيفتى ريجيكتد
    // لما تجيب الراوتس المشتركة استخدم اللى اخرهم مش ريجيكتيد لو مفيش استخدم اللى معاك
    const branchesStatuses = {
      nyaba: '14',
      mror: '215',
    };
    draw(acts, history, branchesStatuses, s.current, w.current.getBoundingClientRect().width);
    r();
  }, [r]);
  return (
    <>
      <div ref={w} dir="ltr" className="w-full">
        <svg ref={s} />
      </div>
      <ReactTooltip key={v} getContent={dataTip => dataTip} />
    </>
  );
}
