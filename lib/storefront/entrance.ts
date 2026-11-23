export type EntranceStage = "checking" | "playing" | "revealing" | "complete"
export const ENTRANCE_SESSION_KEY = "savage_rise_visited"
export const ENTRANCE_HOLD_MS = 2800
export const ENTRANCE_EXIT_MS = 500
export const ENTRANCE_REDUCED_HOLD_MS = 300
export const ENTRANCE_REDUCED_EXIT_MS = 150
export type EntranceController = { stage: EntranceStage; reducedMotion: boolean; reveal: () => void; complete: () => void }

// This small controller runs before first paint, independently of React chunks.
// It owns the only entrance timers; hydration subscribes to the current stage.
export const ENTRANCE_BOOTSTRAP = `(function(){
  if(window.__savageEntrance)return;
  var root=document.documentElement,visited=false,hold,exit,frame;
  try{visited=!!sessionStorage.getItem('${ENTRANCE_SESSION_KEY}')}catch(e){}
  var preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  var controller=window.__savageEntrance={stage:visited?'complete':'playing',reducedMotion:preference.matches,reveal:reveal,complete:complete};
  function publish(stage){
    controller.stage=stage;
    root.dataset.storeEntrance=stage==='playing'?'pending':stage;
    root.dataset.storeEntranceMotion=controller.reducedMotion?'reduce':'full';
    window.dispatchEvent(new Event('savage-rise:entrance-change'));
  }
  function cleanup(){
    clearTimeout(hold);clearTimeout(exit);cancelAnimationFrame(frame);
    preference.removeEventListener('change',reduce);
    document.removeEventListener('keydown',key);
    document.removeEventListener('click',click);
    window.removeEventListener('pagehide',complete);
  }
  function complete(){
    cleanup();publish('complete');
    try{sessionStorage.setItem('${ENTRANCE_SESSION_KEY}','true')}catch(e){}
  }
  function reveal(){
    if(controller.stage!=='playing')return;
    clearTimeout(hold);publish('revealing');
    exit=setTimeout(complete,controller.reducedMotion?${ENTRANCE_REDUCED_EXIT_MS}:${ENTRANCE_EXIT_MS});
  }
  function reduce(){
    if(!preference.matches||controller.stage==='complete')return;
    controller.reducedMotion=true;publish(controller.stage);
    if(controller.stage==='playing'){clearTimeout(hold);hold=setTimeout(reveal,${ENTRANCE_REDUCED_HOLD_MS})}
    else{clearTimeout(exit);exit=setTimeout(complete,${ENTRANCE_REDUCED_EXIT_MS})}
  }
  function key(event){
    if(event.key==='Escape'){event.preventDefault();reveal()}
    if(event.key==='Tab'){
      var button=document.querySelector('.store-entrance-skip');
      if(button){event.preventDefault();button.focus()}
    }
  }
  function click(event){if(event.target instanceof Element&&event.target.closest('.store-entrance-skip'))reveal()}
  publish(controller.stage);
  if(visited)return;
  preference.addEventListener('change',reduce);
  document.addEventListener('keydown',key);
  document.addEventListener('click',click);
  window.addEventListener('pagehide',complete);
  hold=setTimeout(reveal,controller.reducedMotion?${ENTRANCE_REDUCED_HOLD_MS}:${ENTRANCE_HOLD_MS});
  frame=requestAnimationFrame(function(){var panel=document.querySelector('.store-entrance');if(panel&&controller.stage!=='complete')panel.focus({preventScroll:true})});
})();`
