export function drawing(canvas,strokes=[],onChange=()=>{}){
 const ctx=canvas.getContext('2d');let active=null;let data=strokes;
 function render(){const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);ctx.scale(d,d);ctx.strokeStyle='#243e36';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=3;
  for(const s of data){if(!s.length)continue;ctx.beginPath();ctx.moveTo(s[0].x*r.width,s[0].y*r.height);for(const p of s)ctx.lineTo(p.x*r.width,p.y*r.height);if(s.length===1)ctx.lineTo(s[0].x*r.width+.1,s[0].y*r.height+.1);ctx.stroke();}}
 const point=e=>{const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};};
 canvas.onpointerdown=e=>{if(e.button>0||active)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);active=e.pointerId;data.push([point(e)]);render();};
 canvas.onpointermove=e=>{if(active!==e.pointerId)return;e.preventDefault();if(data.at(-1).length<3000){data.at(-1).push(point(e));render();}};
 const end=e=>{if(e.pointerId!==active)return;active=null;onChange(data);};canvas.onpointerup=end;canvas.onpointercancel=end;
 const observer=new ResizeObserver(render);observer.observe(canvas);render();
 return {clear(){data=[];onChange(data);render();},undo(){data.pop();onChange(data);render();},destroy(){observer.disconnect();},getStrokes(){return data;}};
}
