import{j as r,r as d}from"./index-B0P4bOMx.js";const b=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Lumina Weavers · Kinetic Textiles, Kyoto</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"><\/script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"><\/script>
</head>
<body class="text-[#e8dcc4] overflow-hidden antialiased selection:bg-[#b02330] selection:text-white font-serif" style="background: radial-gradient(120% 100% at 50% 30%, #2a1113 0%, #1a0a0c 55%, #0f0607 100%); height: 100dvh; width: 100vw;">

    <!-- Aura Asset Background -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-[0.15] mix-blend-screen" style="background-image: url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/fa51902b-c2a4-4c33-a96e-a8f1ef67edc6_1600w.jpg');"></div>

    <!-- Stage / Background -->
    <div class="fixed inset-0 overflow-hidden z-0">
        <canvas id="cloth" class="absolute inset-0 w-full h-full block pointer-events-none"></canvas>
        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(90% 80% at 50% 46%, transparent 55%, rgba(10,5,6,.72) 100%);"></div>
    </div>

    <!-- UI Overlay -->
    <div class="absolute inset-0 z-10 flex flex-col p-6 md:p-12 pointer-events-none font-sans">
        
        <!-- Header -->
        <header class="flex justify-between items-center w-full pointer-events-auto">
            <div class="overflow-hidden">
                <div class="reveal-item opacity-0 translate-y-8 text-xs tracking-[0.28em] uppercase text-[#b99a8f] font-medium">
                    Est. 2024 · Kyoto, Japan
                </div>
            </div>
            <nav class="hidden md:flex gap-8">
                <div class="overflow-hidden">
                    <a href="#library" class="reveal-item block opacity-0 translate-y-8 text-xs tracking-widest uppercase text-[#e8dcc4]/80 hover:text-white transition-colors duration-300">Material Library</a>
                </div>
                <div class="overflow-hidden">
                    <a href="#trade" class="reveal-item block opacity-0 translate-y-8 text-xs tracking-widest uppercase text-[#e8dcc4]/80 hover:text-white transition-colors duration-300">Partnerships</a>
                </div>
                <div class="overflow-hidden">
                    <a href="#mill" class="reveal-item block opacity-0 translate-y-8 text-xs tracking-widest uppercase text-[#e8dcc4]/80 hover:text-white transition-colors duration-300">The Studio</a>
                </div>
            </nav>
        </header>

        <!-- Footer / Content -->
        <div class="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 pointer-events-auto w-full">
            
            <div class="max-w-md space-y-6">
                <div>
                    <p class="word-reveal text-sm md:text-base leading-relaxed text-[#e8dcc4]/90">
                        <strong class="text-white font-semibold block mb-1 text-base md:text-lg tracking-tight font-serif">Kinetic textiles, rendered to order.</strong>
                        Every meter is simulated on bespoke kinetic engines. Digital threads, authentic physics, designed for infinite virtual environments.
                    </p>
                </div>
                
                <div class="overflow-hidden pt-2">
                    <div class="reveal-item opacity-0 translate-y-8 inline-block rounded-sm p-[1px] bg-gradient-to-b from-white/30 via-[#e03848]/30 to-[#7c1622]/10 shadow-[0_10px_30px_rgba(124,22,34,0.4)] transition-transform duration-300 hover:-translate-y-0.5 group">
                        <a href="#commission" class="flex items-center gap-3 bg-[#b02330] group-hover:bg-[#961c27] text-white px-6 py-3 rounded-[1px] text-sm font-semibold tracking-wide transition-colors relative overflow-hidden">
                            <span class="relative z-10">Commission a textile</span>
                            <iconify-icon icon="solar:arrow-right-linear" width="18" class="relative z-10 transition-transform group-hover:translate-x-1"></iconify-icon>
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                        </a>
                    </div>
                </div>
            </div>

            <div class="text-left sm:text-right mt-8 sm:mt-0">
                <div class="word-reveal text-xs tracking-[0.24em] uppercase text-[#b99a8f] leading-[1.9] font-medium">
                    Vector &amp; matrix<br>
                    No. 42 azure thread<br>
                    Node 7 · Grid 2024
                </div>
            </div>

        </div>
    </div>

    <script>
        // --- GSAP Animation ---
        document.addEventListener("DOMContentLoaded", () => {
            gsap.registerPlugin(ScrollTrigger);
            
            // Standard reveals
            gsap.to(".reveal-item", {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });

            // Masked Word Reveal implementation
            document.querySelectorAll('.word-reveal').forEach(node => {
                function wrapWords(el) {
                    const childNodes = Array.from(el.childNodes);
                    childNodes.forEach(child => {
                        if (child.nodeType === 3) {
                            const words = child.nodeValue.split(/(\\s+)/);
                            const fragment = document.createDocumentFragment();
                            words.forEach(word => {
                                if (word.trim().length > 0) {
                                    const wrapper = document.createElement('span');
                                    wrapper.className = 'inline-flex overflow-hidden pb-1 -mb-1';
                                    const inner = document.createElement('span');
                                    inner.className = 'word-anim translate-y-[110%] opacity-0 inline-block';
                                    inner.textContent = word;
                                    wrapper.appendChild(inner);
                                    fragment.appendChild(wrapper);
                                } else {
                                    fragment.appendChild(document.createTextNode(word));
                                }
                            });
                            el.replaceChild(fragment, child);
                        } else if (child.nodeType === 1) {
                            wrapWords(child);
                        }
                    });
                }
                wrapWords(node);

                // ScrollTrigger staggered reveal
                gsap.to(node.querySelectorAll('.word-anim'), {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.02,
                    ease: "power4.out",
                    delay: 0.3,
                    scrollTrigger: {
                        trigger: node,
                        start: "top 95%",
                    }
                });
            });
        });

        // --- Three.js Cloth Simulation ---
        (() => {
            const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
            const canvas = document.getElementById('cloth');
            if (!window.THREE) return;

            // Generate Woven Texture
            function makeClothTexture() {
                const W = 1280, H = 800;
                const c = document.createElement('canvas'); 
                c.width = W; 
                c.height = H;
                const x = c.getContext('2d');
                
                // Ivory ground gradient
                const g = x.createLinearGradient(0, 0, 0, H);
                g.addColorStop(0, '#efe6d4'); 
                g.addColorStop(0.5, '#e9dfca'); 
                g.addColorStop(1, '#e3d7bf');
                x.fillStyle = g; 
                x.fillRect(0, 0, W, H);

                // Crimson hem border
                x.strokeStyle = '#a5202c'; 
                x.lineWidth = 10;
                x.strokeRect(46, 46, W-92, H-92);
                x.lineWidth = 3; 
                x.strokeStyle = '#7c1622';
                x.strokeRect(66, 66, W-132, H-132);

                // Typography
                x.fillStyle = '#a5202c';
                x.font = 'bold 78px Georgia, "Times New Roman", serif';
                x.textAlign = 'center'; 
                x.textBaseline = 'middle';
                x.fillText('L W', W/2, 190);
                
                x.font = 'normal 20px "Helvetica Neue", Arial, sans-serif';
                x.fillStyle = '#7c1622';
                x.fillText('· KYOTO ·', W/2, 246);

                x.fillStyle = '#9e1e2a';
                x.font = 'bold 118px Georgia, "Times New Roman", serif';
                x.fillText('LUMINA', W/2, 400);
                x.fillText('WEAVERS', W/2, 520);

                x.fillStyle = '#7c1622';
                x.font = '600 30px "Helvetica Neue", Arial, sans-serif';
                x.fillText('K I N E T I C   T E X T I L E S   ·   2 0 2 4', W/2, 626);

                // Weave overlay (Thread grid)
                x.globalAlpha = 1;
                for(let yy=0; yy<H; yy+=3){
                    x.strokeStyle = 'rgba(60,30,20,0.05)'; 
                    x.lineWidth = 1;
                    x.beginPath(); x.moveTo(0,yy+.5); x.lineTo(W,yy+.5); x.stroke();
                }
                for(let xx=0; xx<W; xx+=3){
                    x.strokeStyle = 'rgba(255,250,235,0.06)'; 
                    x.lineWidth = 1;
                    x.beginPath(); x.moveTo(xx+.5,0); x.lineTo(xx+.5,H); x.stroke();
                }

                // Fabric Slub Noise
                const id = x.getImageData(0, 0, W, H), d = id.data;
                for(let i=0; i<d.length; i+=4){
                    const n = (Math.random()*2-1)*10;
                    d[i]+=n; d[i+1]+=n; d[i+2]+=n;
                }
                x.putImageData(id, 0, 0);

                const tex = new THREE.CanvasTexture(c);
                tex.anisotropy = 4; 
                tex.colorSpace = THREE.SRGBColorSpace;
                return tex;
            }

            // Scene Setup
            const scene = new THREE.Scene();
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            let camera;

            const BW = 4.4, BH = 2.75; 
            const GX = 40, GY = 26;
            const geo = new THREE.PlaneGeometry(BW, BH, GX, GY);
            const mat = new THREE.MeshPhongMaterial({
                map: makeClothTexture(), 
                side: THREE.DoubleSide,
                shininess: 6, 
                specular: 0x2a1410, 
                color: 0xffffff
            });
            const mesh = new THREE.Mesh(geo, mat); 
            scene.add(mesh);

            // Lighting
            scene.add(new THREE.AmbientLight(0xffe9d0, 0.62));
            const key = new THREE.DirectionalLight(0xfff0dc, 1.15); 
            key.position.set(-3, 3.5, 3.2); 
            scene.add(key);
            const rim = new THREE.DirectionalLight(0xb02330, 0.42); 
            rim.position.set(3, -1.5, 2.0); 
            scene.add(rim);

            // Verlet Physics Data
            const pos = geo.attributes.position;
            const N = (GX + 1) * (GY + 1);
            const cur = new Float32Array(N * 3), prev = new Float32Array(N * 3), rest = new Float32Array(N * 3);
            const pinned = new Uint8Array(N);
            
            for(let i=0; i<N; i++){
                const ax = pos.getX(i), ay = pos.getY(i), az = 0;
                cur[i*3] = prev[i*3] = rest[i*3] = ax;
                cur[i*3+1] = prev[i*3+1] = rest[i*3+1] = ay;
                cur[i*3+2] = prev[i*3+2] = rest[i*3+2] = az;
            }
            
            for(let ix=0; ix<=GX; ix++){ pinned[ix] = 1; }
            const idx = (ix, iy) => ix + iy * (GX + 1);

            const restH = BW / GX, restV = BH / GY;
            const GRAV = -3.1, DAMP = 0.985, DT = 0.016;

            function wind(ix, iy, t) {
                const cx = ix / GX, cy = iy / GY;
                const travel = t * 1.7 - cy * 4.2;
                const gust = 0.6 + 0.42 * Math.sin(t * 0.6) + 0.18 * Math.sin(t * 1.9 + 1.3);
                const amp = 4.3 * cy;
                const fz = (Math.sin(travel + cx * 3.3) + 0.5 * Math.sin(travel * 1.7 + cx * 6.0)) * amp * gust;
                const fx = Math.sin(t * 0.9 + cy * 2.2) * 0.6 * cy;
                const fy = -0.4 * cy;
                return [fx, fy, fz];
            }

            function step(t) {
                for(let iy=0; iy<=GY; iy++){
                    for(let ix=0; ix<=GX; ix++){
                        const i = idx(ix, iy);
                        if(pinned[i]) continue;
                        const [fx, fy, fz] = wind(ix, iy, t);
                        for(let k=0; k<3; k++){
                            const j = i * 3 + k;
                            const a = (k===0 ? fx : k===1 ? (fy+GRAV) : fz);
                            const v = (cur[j] - prev[j]) * DAMP;
                            prev[j] = cur[j];
                            cur[j] = cur[j] + v + a * DT * DT;
                        }
                    }
                }
                
                for(let it=0; it<3; it++){
                    for(let iy=0; iy<=GY; iy++){
                        for(let ix=0; ix<GX; ix++){ solve(idx(ix,iy), idx(ix+1,iy), restH); }
                    }
                    for(let iy=0; iy<GY; iy++){
                        for(let ix=0; ix<=GX; ix++){ solve(idx(ix,iy), idx(ix,iy+1), restV); }
                    }
                }
                
                for(let ix=0; ix<=GX; ix++){
                    const i = ix;
                    cur[i*3] = rest[i*3]; cur[i*3+1] = rest[i*3+1]; cur[i*3+2] = rest[i*3+2];
                    prev[i*3] = rest[i*3]; prev[i*3+1] = rest[i*3+1]; prev[i*3+2] = rest[i*3+2];
                }
            }

            function solve(a, b, rl) {
                const ax = cur[a*3], ay = cur[a*3+1], az = cur[a*3+2];
                const bx = cur[b*3], by = cur[b*3+1], bz = cur[b*3+2];
                let dx = bx - ax, dy = by - ay, dz = bz - az;
                const d = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1e-6;
                const diff = (d - rl) / d * 0.5;
                dx *= diff; dy *= diff; dz *= diff;
                
                const pa = pinned[a], pb = pinned[b];
                if(!pa && !pb){ 
                    cur[a*3]+=dx; cur[a*3+1]+=dy; cur[a*3+2]+=dz; 
                    cur[b*3]-=dx; cur[b*3+1]-=dy; cur[b*3+2]-=dz; 
                }
                else if(pa && !pb){ cur[b*3]-=dx*2; cur[b*3+1]-=dy*2; cur[b*3+2]-=dz*2; }
                else if(!pa && pb){ cur[a*3]+=dx*2; cur[a*3+1]+=dy*2; cur[a*3+2]+=dz*2; }
            }

            function commit() {
                for(let i=0; i<N; i++){ pos.setXYZ(i, cur[i*3], cur[i*3+1], cur[i*3+2]); }
                pos.needsUpdate = true;
                geo.computeVertexNormals();
            }

            function fit() {
                const w = window.innerWidth, h = window.innerHeight;
                renderer.setSize(w, h, false);
                const aspect = w / h;
                camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
                const vFit = (BH/2) / Math.tan(42 * Math.PI / 360);
                const hFit = (BW/2) / Math.tan(42 * Math.PI / 360) / aspect;
                camera.position.set(0, 0.05, Math.max(vFit, hFit) * 1.16 + 0.4);
                camera.lookAt(0, 0, 0);
            }
            
            window.addEventListener('resize', fit); 
            fit();

            let running = false, raf = 0, t = 0;
            function loop() {
                if(!running) return;
                t += DT; 
                step(t); 
                commit();
                renderer.render(scene, camera);
                raf = requestAnimationFrame(loop);
            }
            
            function start() { if(running)return; running=true; raf=requestAnimationFrame(loop); }
            function stop() { running=false; cancelAnimationFrame(raf); }

            if(reduce) {
                for(let s=0; s<220; s++) step(s*DT);
                commit(); 
                renderer.render(scene, camera);
            } else {
                for(let s=0; s<40; s++) step(s*DT);
                t = 40 * DT;
                start();
                document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
            }
        })();
    <\/script>
</body>
</html>`,s={hue:0,saturation:1,brightness:1},w={luminaWeaversCloth:{title:"Woven Cloth kinetic textile",source:b,background:"#16090b",targets:[{selector:"body > div.fixed.inset-0.overflow-hidden.z-0",role:"background"}],presentation:"woven-cloth-label"}};function f(e,t,i){return Math.min(i,Math.max(t,e))}function y(e,t,i){if(!e.includes(t))throw new Error(`Neuform source adapter could not find: ${t}`);return e.replace(t,i)}function E(e){return[["return { t0: after + 5.6 + frnd() * 7.2, dur: total, segs: segs };","return { t0: after + 1.25 + frnd() * 1.75, dur: total, segs: segs };"],["if (!ev) ev = nextEvent(4.2);","if (!ev) ev = nextEvent(0.55);"],["cap = Math.min((W - W * 0.12) / blockW, (H - H * 0.18) / blockH);","cap = Math.min((W - W * 0.20) / blockW, (H - H * 0.28) / blockH);"],["var y0 = (H - blockH * cap) * 0.48;","var y0 = (H - blockH * cap) / 2;"]].reduce((t,[i,n])=>y(t,i,n),e)}function H(e){return[["x.fillText('L W', W/2, 190);","x.fillText('E F', W/2, 190);"],["x.fillText('· KYOTO ·', W/2, 246);","x.fillText('· EXPENSEFLOW ·', W/2, 246);"],["x.fillText('LUMINA', W/2, 400);","x.fillText('EXPENSE', W/2, 400);"],["x.fillText('WEAVERS', W/2, 520);","x.fillText('FLOW', W/2, 520);"],["x.fillText('K I N E T I C   T E X T I L E S   ·   2 0 2 4', W/2, 626);","x.fillText('TRACK · BUDGET · SAVE', W/2, 626);"]].reduce((t,[i,n])=>y(t,i,n),e)}function T(e,t){return typeof e.background=="function"?e.background(t):e.background}function k(e,t){const i=JSON.stringify(e.targets).replace(/</g,"\\u003c"),n=T(e,t),c=t==="light"?"grayscale(1) invert(1) contrast(1.08)":"grayscale(1) contrast(1.08)",l=e.presentation==="animated-typography"?`
@keyframes sf-neon-type-breathe {
  0%, 100% { transform: translate3d(0, 3px, 0) scale(0.988); opacity: 0.88; }
  45% { transform: translate3d(0, -3px, 0) scale(1); opacity: 1; }
  68% { transform: translate3d(0, 0, 0) scale(0.996); opacity: 0.96; }
}
#board { overflow: visible !important; }
#neon {
  transform-origin: 50% 52%;
  animation: sf-neon-type-breathe 5.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  filter: ${c};
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: reduce) {
  #neon { animation: none !important; transform: none !important; opacity: 1 !important; }
}
`:"",o=`<style data-threeui-focus>
html, body { width: 100% !important; height: 100% !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: ${n} !important; }
body { position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; }
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-role="background"] { position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; z-index: 0 !important; opacity: 1 !important; pointer-events: none !important; }
[data-threeui-role="ui"] { position: relative !important; z-index: 1 !important; width: min(calc(100% - 32px), var(--threeui-target-width, 1040px)) !important; max-width: none !important; max-height: calc(100% - 32px) !important; margin: auto !important; overflow: auto !important; opacity: 1 !important; transform: none !important; filter: none !important; flex: none !important; box-sizing: border-box !important; }
${l}
</style>`,a=`<script data-threeui-focus>
(function () {
  var isolated = false;
  function isolate() {
    if (isolated) return;
    var specs = ${i};
    var roots = [];
    specs.forEach(function (spec) {
      var element = document.querySelector(spec.selector);
      if (!element) return;
      element.setAttribute('data-threeui-role', spec.role);
      if (spec.width) element.style.setProperty('--threeui-target-width', spec.width);
      if (!roots.some(function (root) { return root.contains(element); })) roots.push(element);
    });
    if (!roots.length) return;
    isolated = true;
    roots.forEach(function (root) { document.body.appendChild(root); });
    Array.from(document.body.children).forEach(function (element) {
      if (roots.indexOf(element) !== -1) return;
      element.setAttribute('data-threeui-residual', '');
      element.setAttribute('aria-hidden', 'true');
      if ('inert' in element) element.inert = true;
    });
    document.body.setAttribute('data-threeui-ready', '');
    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
  }
  function scheduleIsolation() { setTimeout(isolate, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleIsolation, { once: true });
  else scheduleIsolation();
  window.addEventListener('load', isolate, { once: true });
})();
<\/script>`;return(e.presentation==="animated-typography"?E(e.source):e.presentation==="woven-cloth-label"?H(e.source):e.source).replace(/<\/head>/i,`${o}</head>`).replace(/<\/body>/i,`${a}</body>`)}function W({definition:e,mode:t="dark",hue:i=s.hue,saturation:n=s.saturation,brightness:c=s.brightness,className:l,style:o}){const a=t==="light"?"light":"dark",x=T(e,a),h=d.useMemo(()=>k(e,a),[e,a]),p=f(i,-180,180),m=f(n,0,2),g=f(c,.35,1.65),v=p===0&&m===1&&g===1?void 0:`hue-rotate(${p}deg) saturate(${m}) brightness(${g})`;return r.jsx("iframe",{className:l,"data-mode":a,title:e.title,srcDoc:h,sandbox:"allow-scripts",loading:"eager",style:{display:"block",width:"100%",height:"100%",border:0,background:x,filter:v,...o}})}function M(e){return function(t){return r.jsx(W,{...t,definition:e})}}const R=M(w.luminaWeaversCloth),S=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Woven Cloth · Atelier Flag</title>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"><\/script>
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #12100d; }
  #cloth { display: block; width: 100%; height: 100%; }
  #vignette {
    position: fixed; inset: 0; pointer-events: none;
    background: radial-gradient(84% 76% at 46% 42%, transparent 50%, rgba(14,12,10,.72) 100%);
  }
</style>
</head>
<body>
<canvas id="cloth"></canvas>
<div id="vignette"></div>
<script>
(() => {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const canvas = document.getElementById('cloth');
  if (!window.THREE) return;

  const TW = 1600, TH = 1030;

  // Cut-and-sew geometry, in texture pixels. Everything the flag is made of
  // — hoist band, panel seams, hems, topstitching — is laid out from here.
  const HOIST = 122;          // heading tape down the pinned edge
  const FLY_HEM = 48;         // doubled hem at the flying edge
  const EDGE_HEM = 36;        // top and bottom hems
  const SEAM_Y = [TH / 3, (TH * 2) / 3];
  const SEAM_H = 24;

  function surface(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return { canvas: c, ctx: c.getContext('2d', { willReadFrequently: true }) };
  }

  function alpha(ctx) { return ctx.getImageData(0, 0, TW, TH).data; }

  // --- masks ---------------------------------------------------------------
  // Construction: the raised cloth of the band, the felled seams, the hems.
  function makeStructureMask() {
    const s = surface(TW, TH), x = s.ctx;
    x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
    x.fillStyle = '#fff';
    x.fillRect(0, 0, HOIST, TH);
    x.fillRect(TW - FLY_HEM, 0, FLY_HEM, TH);
    x.fillRect(0, 0, TW, EDGE_HEM);
    x.fillRect(0, TH - EDGE_HEM, TW, EDGE_HEM);
    SEAM_Y.forEach((y) => x.fillRect(HOIST, y - SEAM_H / 2, TW - HOIST - FLY_HEM, SEAM_H));
    return alpha(x);
  }

  // Topstitching: every seam and hem gets its own run of thread.
  function makeStitchMask() {
    const s = surface(TW, TH), x = s.ctx;
    x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
    x.strokeStyle = '#fff';
    x.lineWidth = 4;
    x.setLineDash([15, 11]);
    x.lineCap = 'butt';
    const run = (x0, y0, x1, y1) => { x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); };

    run(16, 0, 16, TH);                 // hoist tape, inner and outer rows
    run(HOIST - 16, 0, HOIST - 16, TH);
    run(TW - FLY_HEM + 16, 0, TW - FLY_HEM + 16, TH);
    run(HOIST, EDGE_HEM - 13, TW - FLY_HEM, EDGE_HEM - 13);
    run(HOIST, TH - EDGE_HEM + 13, TW - FLY_HEM, TH - EDGE_HEM + 13);
    SEAM_Y.forEach((y) => {
      run(HOIST, y - SEAM_H / 2 + 5, TW - FLY_HEM, y - SEAM_H / 2 + 5);
      run(HOIST, y + SEAM_H / 2 - 5, TW - FLY_HEM, y + SEAM_H / 2 - 5);
    });

    // The sewn-on woven label, tacked down on all four sides.
    x.setLineDash([11, 9]);
    x.lineWidth = 3.5;
    x.strokeRect(TW - 470, TH - 214, 300, 104);
    x.setLineDash([]);
    return alpha(x);
  }

  // Everything printed: the house lockup, the composition line, the label.
  function makeInkMask() {
    const s = surface(TW, TH), x = s.ctx;
    x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
    x.fillStyle = '#fff';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    const cx = HOIST + (TW - HOIST - FLY_HEM) / 2;

    x.font = '700 30px "Helvetica Neue", Arial, sans-serif';
    x.fillText('E X P E N S E F L O W', cx, TH * 0.235);

    x.font = 'bold 152px Georgia, "Times New Roman", serif';
    x.fillText('EXPENSE', cx, TH * 0.395);
    x.fillText('FLOW', cx, TH * 0.555);

    x.fillRect(cx - 250, TH * 0.645, 500, 4);

    x.font = '600 28px "Helvetica Neue", Arial, sans-serif';
    x.fillText('TRACK  ·  BUDGET  ·  SAVE  ·  ALL IN RUPEES', cx, TH * 0.705);

    // Woven label content.
    x.font = 'bold 40px Georgia, "Times New Roman", serif';
    x.fillText('E F', TW - 320, TH - 184);
    x.font = '600 19px "Helvetica Neue", Arial, sans-serif';
    x.fillText('THREE PANEL · FLAT FELLED', TW - 320, TH - 144);
    return alpha(x);
  }

  const structure = makeStructureMask();
  const stitch = makeStitchMask();
  const ink = makeInkMask();

  // Plain linen weave — square, matte, slightly irregular in the thread.
  function weaveHeight(x, y) {
    const p = 7;
    const cx = Math.floor(x / p), cy = Math.floor(y / p);
    const u = (x % p) / p, v = (y % p) / p;
    const warpUp = ((cx + cy) % 2) === 0;
    const h = warpUp ? Math.sin(u * Math.PI) : Math.sin(v * Math.PI);
    return h + Math.sin(cx * 12.9898) * Math.sin(cy * 4.1414 + 1.9) * 0.22;
  }

  const height = new Float32Array(TW * TH);
  for (let y = 0; y < TH; y++) {
    for (let x = 0; x < TW; x++) {
      const i = y * TW + x;
      const st = structure[i * 4] / 255;
      const th = stitch[i * 4] / 255;
      height[i] = weaveHeight(x, y) + st * 1.5 + th * 3.4 + (ink[i * 4] / 255) * 0.22;
    }
  }

  function blurHeight(passes) {
    const tmp = new Float32Array(TW * TH);
    for (let n = 0; n < passes; n++) {
      for (let y = 0; y < TH; y++) {
        const row = y * TW;
        for (let x = 0; x < TW; x++) {
          const a = height[row + (x > 0 ? x - 1 : x)], b = height[row + x];
          const c = height[row + (x < TW - 1 ? x + 1 : x)];
          tmp[row + x] = (a + b + b + c) * 0.25;
        }
      }
      for (let x = 0; x < TW; x++) {
        for (let y = 0; y < TH; y++) {
          const a = tmp[(y > 0 ? y - 1 : y) * TW + x], b = tmp[y * TW + x];
          const c = tmp[(y < TH - 1 ? y + 1 : y) * TW + x];
          height[y * TW + x] = (a + b + b + c) * 0.25;
        }
      }
    }
  }

  function makeAlbedoTexture() {
    const s = surface(TW, TH), x = s.ctx;
    // Three panels, each cut from its own dye lot.
    const lots = ['#ded2b8', '#d8ccb1', '#e2d6bd'];
    for (let k = 0; k < 3; k++) {
      x.fillStyle = lots[k];
      x.fillRect(0, (TH / 3) * k, TW, TH / 3 + 1);
    }
    const img = x.getImageData(0, 0, TW, TH), d = img.data;
    const INK = [33, 48, 77], TAPE = [26, 37, 72], THREAD = [242, 234, 218];
    for (let i = 0; i < TW * TH; i++) {
      const px = i % TW;
      const st = structure[i * 4] / 255;
      const th = stitch[i * 4] / 255;
      const ik = ink[i * 4] / 255;
      const o = i * 4;
      const shade = 0.86 + height[i] * 0.14;
      let r = d[o] * shade, g = d[o + 1] * shade, b = d[o + 2] * shade;
      // The heading tape is indigo canvas; the seams and hems only darken.
      if (px < HOIST) {
        r += (TAPE[0] - r) * 0.94; g += (TAPE[1] - g) * 0.94; b += (TAPE[2] - b) * 0.94;
      } else if (st > 0) {
        r *= 1 - st * 0.17; g *= 1 - st * 0.17; b *= 1 - st * 0.15;
      }
      if (ik > 0 && px >= HOIST) {
        r += (INK[0] - r) * ik; g += (INK[1] - g) * ik; b += (INK[2] - b) * ik;
      }
      if (th > 0) {
        r += (THREAD[0] - r) * th * 0.92; g += (THREAD[1] - g) * th * 0.92; b += (THREAD[2] - b) * th * 0.92;
      }
      d[o] = r; d[o + 1] = g; d[o + 2] = b;
    }
    x.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(s.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Mercerised topstitch thread is the only glossy thing on the flag.
  function makeRoughnessTexture() {
    const s = surface(TW, TH), x = s.ctx;
    const img = x.createImageData(TW, TH), d = img.data;
    for (let i = 0; i < TW * TH; i++) {
      const th = stitch[i * 4] / 255;
      const ik = ink[i * 4] / 255;
      let r = 0.86 - height[i] * 0.05 - th * 0.42 - ik * 0.12;
      r = Math.max(0.18, Math.min(0.98, r));
      const o = i * 4;
      d[o] = d[o + 1] = d[o + 2] = r * 255; d[o + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(s.canvas);
  }

  function makeNormalTexture(strength) {
    const s = surface(TW, TH);
    const img = s.ctx.createImageData(TW, TH), d = img.data;
    for (let y = 0; y < TH; y++) {
      const yp = y > 0 ? y - 1 : y, yn = y < TH - 1 ? y + 1 : y;
      for (let x = 0; x < TW; x++) {
        const xp = x > 0 ? x - 1 : x, xn = x < TW - 1 ? x + 1 : x;
        const dx = (height[y * TW + xp] - height[y * TW + xn]) * strength;
        const dy = (height[yp * TW + x] - height[yn * TW + x]) * strength;
        const len = Math.sqrt(dx * dx + dy * dy + 1);
        const o = (y * TW + x) * 4;
        d[o] = (dx / len * 0.5 + 0.5) * 255;
        d[o + 1] = (dy / len * 0.5 + 0.5) * 255;
        d[o + 2] = (1 / len * 0.5 + 0.5) * 255;
        d[o + 3] = 255;
      }
    }
    s.ctx.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(s.canvas);
  }

  // A photographer's seamless: warm sweep behind, softbox above, bounce left.
  function makeStudioEnvironment(renderer) {
    const W = 1024, H = 512, s = surface(W, H), x = s.ctx;
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#2a2620');
    g.addColorStop(0.46, '#1a1713');
    g.addColorStop(1, '#0d0b09');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const box = (cx, cy, rw, rh, color, a) => {
      const grad = x.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rw, rh));
      grad.addColorStop(0, color); grad.addColorStop(1, 'rgba(0,0,0,0)');
      x.globalAlpha = a; x.fillStyle = grad;
      x.save(); x.translate(cx, cy); x.scale(rw / Math.max(rw, rh), rh / Math.max(rw, rh));
      x.beginPath(); x.arc(0, 0, Math.max(rw, rh), 0, Math.PI * 2); x.fill(); x.restore();
      x.globalAlpha = 1;
    };
    box(W * 0.30, H * 0.14, 340, 130, '#fffaf0', 1);
    box(W * 0.78, H * 0.40, 220, 200, '#c8d8ea', 0.55);
    box(W * 0.06, H * 0.62, 200, 240, '#e8d3ac', 0.5);
    const tex = new THREE.CanvasTexture(s.canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose(); tex.dispose();
    return env;
  }

  function makeBackdropTexture() {
    const W = 512, H = 320, s = surface(W, H), x = s.ctx;
    x.fillStyle = '#100e0b'; x.fillRect(0, 0, W, H);
    const g = x.createRadialGradient(W * 0.44, H * 0.36, 0, W * 0.44, H * 0.36, W * 0.60);
    g.addColorStop(0, 'rgba(96,84,66,0.95)');
    g.addColorStop(0.5, 'rgba(44,38,30,0.6)');
    g.addColorStop(1, 'rgba(13,11,9,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const tex = new THREE.CanvasTexture(s.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ------------------------------------------------------------- scene -- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene();
  scene.background = makeBackdropTexture();
  scene.environment = makeStudioEnvironment(renderer);

  const BW = 5.0, BH = 2.9;
  const GX = 52, GY = 34;
  const geo = new THREE.PlaneGeometry(BW, BH, GX, GY);

  const albedo = makeAlbedoTexture();
  blurHeight(1);
  const normalMap = makeNormalTexture(2.6);
  const roughnessMap = makeRoughnessTexture();
  [albedo, normalMap, roughnessMap].forEach((t) => { t.anisotropy = maxAniso; });

  const mat = new THREE.MeshPhysicalMaterial({
    map: albedo,
    normalMap,
    normalScale: new THREE.Vector2(0.55, 0.55),
    roughnessMap,
    roughness: 1.0,
    metalness: 0.0,
    side: THREE.DoubleSide,
    envMapIntensity: 1.15,
    sheen: 0.6,
    sheenColor: new THREE.Color('#f3e6cd'),
    sheenRoughness: 0.62,
  });

  const flag = new THREE.Mesh(geo, mat);
  const rig = new THREE.Group();
  rig.add(flag);
  scene.add(rig);

  /* ---------------------------------------------------------- hardware -- */
  const brass = new THREE.MeshStandardMaterial({ color: 0xb98f47, metalness: 1.0, roughness: 0.32 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x8d8f95, metalness: 1.0, roughness: 0.28 });

  const HOIST_X = -BW / 2;
  const GROMMET_V = [0.09, 0.5, 0.91];       // down the hoist, in 0..1 of BH
  const grommets = GROMMET_V.map((v) => {
    const g = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.021, 12, 28), brass);
    g.position.set(HOIST_X + 0.05, BH / 2 - v * BH, 0);
    rig.add(g);
    return g;
  });

  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.042, BH * 1.5, 18),
    steel,
  );
  mast.position.set(HOIST_X - 0.16, -BH * 0.12, -0.04);
  rig.add(mast);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.072, 20, 14), brass);
  finial.position.set(HOIST_X - 0.16, -BH * 0.12 + BH * 0.75 + 0.05, -0.04);
  rig.add(finial);

  // The clips that carry the hoist grommets on the mast.
  grommets.forEach((g) => {
    const clip = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.011, 10, 22), steel);
    clip.position.set(HOIST_X - 0.11, g.position.y, -0.02);
    clip.rotation.y = Math.PI / 2.4;
    rig.add(clip);
  });

  /* ------------------------------------------------------------ lights -- */
  scene.add(new THREE.HemisphereLight(0xcadcf2, 0x4a3d2c, 0.75));
  const key = new THREE.DirectionalLight(0xfff4e0, 2.5);
  key.position.set(2.6, 3.4, 3.0); scene.add(key);
  const bounce = new THREE.DirectionalLight(0xe6cfa4, 0.85);
  bounce.position.set(-3.4, -1.6, 2.0); scene.add(bounce);
  const back = new THREE.DirectionalLight(0xfff0d8, 1.5);
  back.position.set(-1.6, 1.4, -3.2); scene.add(back);

  /* ----------------------------------------------------------- physics --
     Pinned down the hoist instead of along the top, so the wave travels out
     to the fly and the free corners snap the way a flown flag does. */
  const pos = geo.attributes.position;
  const N = (GX + 1) * (GY + 1);
  const cur = new Float32Array(N * 3), prev = new Float32Array(N * 3), rest = new Float32Array(N * 3);
  const pinned = new Uint8Array(N);
  const idx = (ix, iy) => ix + iy * (GX + 1);

  for (let i = 0; i < N; i++) {
    const ax = pos.getX(i), ay = pos.getY(i);
    cur[i * 3] = prev[i * 3] = rest[i * 3] = ax;
    cur[i * 3 + 1] = prev[i * 3 + 1] = rest[i * 3 + 1] = ay;
    cur[i * 3 + 2] = prev[i * 3 + 2] = rest[i * 3 + 2] = 0;
  }
  for (let iy = 0; iy <= GY; iy++) pinned[idx(0, iy)] = 1;

  const restH = BW / GX, restV = BH / GY;
  const GRAV = -0.22, DAMP = 0.986, DT = 0.016;

  function wind(ix, iy, t) {
    const cx = ix / GX, cy = iy / GY;
    // Amplitude grows with distance from the hoist: the fly end does the work,
    // while a steady outward pull keeps the flag flown rather than limp.
    const reach = cx * (0.35 + 0.65 * cx);
    const gust = 0.78 + 0.26 * Math.sin(t * 0.53) + 0.14 * Math.sin(t * 1.47 + 0.9);
    const travel = t * 4.2 - cx * 6.6;
    const fz = (Math.sin(travel) + 0.38 * Math.sin(travel * 1.9 + cy * 2.6)) * 3.4 * reach * gust;
    const fy = Math.sin(travel * 0.8 + 1.2) * 0.85 * reach;
    const fx = 2.6 * reach * gust;
    return [fx, fy, fz];
  }

  function solve(a, b, rl) {
    const ax = cur[a * 3], ay = cur[a * 3 + 1], az = cur[a * 3 + 2];
    let dx = cur[b * 3] - ax, dy = cur[b * 3 + 1] - ay, dz = cur[b * 3 + 2] - az;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
    const diff = (d - rl) / d * 0.5;
    dx *= diff; dy *= diff; dz *= diff;
    const pa = pinned[a], pb = pinned[b];
    if (!pa && !pb) {
      cur[a * 3] += dx; cur[a * 3 + 1] += dy; cur[a * 3 + 2] += dz;
      cur[b * 3] -= dx; cur[b * 3 + 1] -= dy; cur[b * 3 + 2] -= dz;
    } else if (pa && !pb) { cur[b * 3] -= dx * 2; cur[b * 3 + 1] -= dy * 2; cur[b * 3 + 2] -= dz * 2; }
    else if (!pa && pb) { cur[a * 3] += dx * 2; cur[a * 3 + 1] += dy * 2; cur[a * 3 + 2] += dz * 2; }
  }

  function step(t) {
    for (let iy = 0; iy <= GY; iy++) {
      for (let ix = 0; ix <= GX; ix++) {
        const i = idx(ix, iy);
        if (pinned[i]) continue;
        const f = wind(ix, iy, t);
        for (let k = 0; k < 3; k++) {
          const j = i * 3 + k;
          const a = k === 0 ? f[0] : k === 1 ? f[1] + GRAV : f[2];
          const v = (cur[j] - prev[j]) * DAMP;
          prev[j] = cur[j];
          cur[j] = cur[j] + v + a * DT * DT;
        }
      }
    }
    for (let it = 0; it < 4; it++) {
      for (let iy = 0; iy <= GY; iy++) for (let ix = 0; ix < GX; ix++) solve(idx(ix, iy), idx(ix + 1, iy), restH);
      for (let iy = 0; iy < GY; iy++) for (let ix = 0; ix <= GX; ix++) solve(idx(ix, iy), idx(ix, iy + 1), restV);
    }
    // The heading tape is sewn to a rigid edge; hold it exactly.
    for (let iy = 0; iy <= GY; iy++) {
      const i = idx(0, iy);
      for (let k = 0; k < 3; k++) { cur[i * 3 + k] = rest[i * 3 + k]; prev[i * 3 + k] = rest[i * 3 + k]; }
    }
  }

  function commit() {
    for (let i = 0; i < N; i++) pos.setXYZ(i, cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2]);
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  /* --------------------------------------------------------------- fit -- */
  let camera;
  function fit() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    const vFit = (BH * 1.12 / 2) / Math.tan(40 * Math.PI / 360);
    const hFit = ((BW + 1.0) / 2) / Math.tan(40 * Math.PI / 360) / aspect;
    camera.position.set(0.10, 0.06, Math.max(vFit, hFit) * 1.13 + 0.30);
    camera.lookAt(0.10, 0.0, 0);
  }
  window.addEventListener('resize', fit);
  fit();

  function draw(t) {
    // The mast leans a few degrees so the flag is never seen dead flat.
    rig.rotation.y = -0.16 + Math.sin(t * 0.11) * 0.045;
    rig.rotation.z = Math.sin(t * 0.08 + 0.7) * 0.012;
    camera.position.y = 0.06 + Math.sin(t * 0.15) * 0.06;
    camera.lookAt(0.10, 0.0, 0);
    renderer.render(scene, camera);
  }

  let running = false, raf = 0, t = 0;
  function loop() {
    if (!running) return;
    t += DT;
    step(t); commit(); draw(t);
    raf = requestAnimationFrame(loop);
  }
  function start() { if (running) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  window.__seek = (time) => {
    const target = Math.max(0, time);
    if (target < t) { t = 0; for (let i = 0; i < N * 3; i++) { cur[i] = rest[i]; prev[i] = rest[i]; } }
    while (t < target - DT * 0.5) { t += DT; step(t); }
    commit(); draw(t);
  };

  for (let s = 0; s < 160; s++) step(s * DT);
  t = 160 * DT;
  if (reduce) {
    commit(); draw(t);
  } else {
    start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }
})();
<\/script>
</body>
</html>
`,G=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Woven Cloth · Iridescent Silk</title>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"><\/script>
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #05060d; }
  #cloth { display: block; width: 100%; height: 100%; }
  #vignette {
    position: fixed; inset: 0; pointer-events: none;
    background: radial-gradient(78% 70% at 50% 44%, transparent 46%, rgba(3,4,10,.78) 100%);
  }
</style>
</head>
<body>
<canvas id="cloth"></canvas>
<div id="vignette"></div>
<script>
(() => {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const canvas = document.getElementById('cloth');
  if (!window.THREE) return;

  /* ---------------------------------------------------------------- maps --
     Everything the silk needs is drawn once into 2D canvases: a satin weave
     height field, the wordmark woven into it as raised warp floats, and a
     smooth film-thickness field that makes the interference colour travel. */

  const TW = 1600, TH = 1000;

  function surface(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return { canvas: c, ctx: c.getContext('2d', { willReadFrequently: true }) };
  }

  // Wordmark drawn once as a white-on-black coverage mask.
  function makeWordmarkMask() {
    const s = surface(TW, TH), x = s.ctx;
    x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
    x.fillStyle = '#fff';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 96px Georgia, "Times New Roman", serif';
    x.fillText('E F', TW / 2, 208);
    x.font = '700 30px "Helvetica Neue", Arial, sans-serif';
    x.fillText('· EXPENSEFLOW ·', TW / 2, 278);
    x.font = 'bold 150px Georgia, "Times New Roman", serif';
    x.fillText('EXPENSE', TW / 2, 452);
    x.fillText('FLOW', TW / 2, 600);
    x.font = '700 38px "Helvetica Neue", Arial, sans-serif';
    x.fillText('TRACK · BUDGET · SAVE', TW / 2, 718);
    // Hairline frame, woven as a raised rib rather than printed.
    x.strokeStyle = '#fff'; x.lineWidth = 7;
    x.strokeRect(64, 64, TW - 128, TH - 128);
    x.lineWidth = 3;
    x.strokeRect(92, 92, TW - 184, TH - 184);
    return x.getImageData(0, 0, TW, TH).data;
  }

  // Five-harness satin: long warp floats broken by a scattered binding point.
  function weaveHeight(x, y) {
    const p = 8;
    const cx = Math.floor(x / p), cy = Math.floor(y / p);
    const u = (x % p) / p, v = (y % p) / p;
    const binding = ((cx * 2 + cy) % 5) === 0;
    const profile = (t) => Math.sin(t * Math.PI);
    let h = binding ? profile(v) * 0.9 : profile(u);
    // Slubs: a few threads run thicker than their neighbours.
    h += Math.sin(cx * 12.9898) * Math.sin(cx * 4.1414 + 2.3) * 0.16;
    h += Math.sin(cy * 7.233 + 1.7) * 0.06;
    return h;
  }

  function valueNoise(seed) {
    const G = 64, grid = new Float32Array(G * G);
    let s = seed;
    const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < G * G; i++) grid[i] = rnd();
    const smooth = (t) => t * t * (3 - 2 * t);
    return (u, v) => {
      const fx = u * G, fy = v * G;
      const ix = Math.floor(fx), iy = Math.floor(fy);
      const tx = smooth(fx - ix), ty = smooth(fy - iy);
      const at = (a, b) => grid[((b % G) + G) % G * G + ((a % G) + G) % G];
      const a = at(ix, iy), b = at(ix + 1, iy), c = at(ix, iy + 1), d = at(ix + 1, iy + 1);
      return (a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty;
    };
  }

  const mask = makeWordmarkMask();

  // One pass builds the height field; albedo, normal and roughness share it.
  const height = new Float32Array(TW * TH);
  for (let y = 0; y < TH; y++) {
    for (let x = 0; x < TW; x++) {
      const i = y * TW + x;
      const m = mask[i * 4] / 255;
      // Inside a letter the warp floats ride higher and longer.
      height[i] = weaveHeight(x, y) * (1 - m * 0.30) + m * 1.15;
    }
  }

  function blurHeight(passes) {
    const tmp = new Float32Array(TW * TH);
    for (let n = 0; n < passes; n++) {
      for (let y = 0; y < TH; y++) {
        const row = y * TW;
        for (let x = 0; x < TW; x++) {
          const a = height[row + (x > 0 ? x - 1 : x)];
          const b = height[row + x];
          const c = height[row + (x < TW - 1 ? x + 1 : x)];
          tmp[row + x] = (a + b + b + c) * 0.25;
        }
      }
      for (let x = 0; x < TW; x++) {
        for (let y = 0; y < TH; y++) {
          const a = tmp[(y > 0 ? y - 1 : y) * TW + x];
          const b = tmp[y * TW + x];
          const c = tmp[(y < TH - 1 ? y + 1 : y) * TW + x];
          height[y * TW + x] = (a + b + b + c) * 0.25;
        }
      }
    }
  }

  function makeNormalTexture(strength) {
    const s = surface(TW, TH);
    const img = s.ctx.createImageData(TW, TH), d = img.data;
    for (let y = 0; y < TH; y++) {
      const yp = y > 0 ? y - 1 : y, yn = y < TH - 1 ? y + 1 : y;
      for (let x = 0; x < TW; x++) {
        const xp = x > 0 ? x - 1 : x, xn = x < TW - 1 ? x + 1 : x;
        const dx = (height[y * TW + xp] - height[y * TW + xn]) * strength;
        const dy = (height[yp * TW + x] - height[yn * TW + x]) * strength;
        const len = Math.sqrt(dx * dx + dy * dy + 1);
        const o = (y * TW + x) * 4;
        d[o] = (dx / len * 0.5 + 0.5) * 255;
        d[o + 1] = (dy / len * 0.5 + 0.5) * 255;
        d[o + 2] = (1 / len * 0.5 + 0.5) * 255;
        d[o + 3] = 255;
      }
    }
    s.ctx.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(s.canvas);
  }

  function makeAlbedoTexture() {
    const s = surface(TW, TH), x = s.ctx;
    const g = x.createLinearGradient(0, 0, TW * 0.35, TH);
    g.addColorStop(0, '#161033');
    g.addColorStop(0.45, '#0d1030');
    g.addColorStop(1, '#100b26');
    x.fillStyle = g; x.fillRect(0, 0, TW, TH);
    const img = x.getImageData(0, 0, TW, TH), d = img.data;
    for (let i = 0; i < TW * TH; i++) {
      const m = mask[i * 4] / 255;
      const shade = 0.88 + height[i] * 0.10;
      const o = i * 4;
      d[o] = Math.min(255, d[o] * shade + m * 96);
      d[o + 1] = Math.min(255, d[o + 1] * shade + m * 78);
      d[o + 2] = Math.min(255, d[o + 2] * shade + m * 118);
    }
    x.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(s.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Satin floats inside the letters read glossier than the matte ground.
  function makeRoughnessTexture() {
    const s = surface(TW, TH), x = s.ctx;
    const img = x.createImageData(TW, TH), d = img.data;
    const grain = valueNoise(9271);
    for (let y = 0; y < TH; y++) {
      for (let xx = 0; xx < TW; xx++) {
        const i = y * TW + xx;
        const m = mask[i * 4] / 255;
        const n = grain(xx / TW * 5, y / TH * 5);
        let r = 0.30 - height[i] * 0.07 + n * 0.09 - m * 0.16;
        r = Math.max(0.04, Math.min(0.8, r));
        const o = i * 4;
        d[o] = d[o + 1] = d[o + 2] = r * 255; d[o + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(s.canvas);
  }

  // Film thickness drives the interference hue; broad and smooth so the
  // colour sweeps across the folds instead of flickering per-thread.
  function makeThicknessTexture() {
    const W = 512, H = 320, s = surface(W, H), x = s.ctx;
    const img = x.createImageData(W, H), d = img.data;
    const a = valueNoise(4471), b = valueNoise(88231);
    for (let y = 0; y < H; y++) {
      for (let xx = 0; xx < W; xx++) {
        const u = xx / W, v = y / H;
        const n = a(u * 3.4, v * 2.4) * 0.58 + b(u * 8.5, v * 5.6) * 0.42;
        const o = (y * W + xx) * 4;
        const sweep = 0.5 + 0.42 * Math.sin(u * Math.PI * 2 - v * 1.15);
        const t = Math.max(0, Math.min(1, sweep + (n - 0.5) * 0.26));
        d[o] = d[o + 1] = d[o + 2] = t * 255; d[o + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0);
    return new THREE.CanvasTexture(s.canvas);
  }

  /* ------------------------------------------------------- environment --
     A small studio painted into an equirectangular canvas: three softboxes
     of different colour temperature, which is what the iridescent film has
     to break apart into colour. */
  function makeStudioEnvironment(renderer) {
    const W = 1024, H = 512, s = surface(W, H), x = s.ctx;
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0a0c1c');
    g.addColorStop(0.5, '#05060e');
    g.addColorStop(1, '#02030a');
    x.fillStyle = g; x.fillRect(0, 0, W, H);

    const box = (cx, cy, w, h, color, alpha) => {
      const grad = x.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      x.globalAlpha = alpha;
      x.fillStyle = grad;
      x.save(); x.translate(cx, cy); x.scale(w / Math.max(w, h), h / Math.max(w, h));
      x.beginPath(); x.arc(0, 0, Math.max(w, h), 0, Math.PI * 2); x.fill();
      x.restore();
      x.globalAlpha = 1;
    };

    box(W * 0.24, H * 0.20, 300, 120, '#fff3e2', 1);      // warm key overhead
    box(W * 0.74, H * 0.34, 230, 190, '#7fd8ff', 0.95);   // cool side fill
    box(W * 0.52, H * 0.86, 340, 130, '#ff5fa8', 0.55);   // magenta bounce
    box(W * 0.02, H * 0.55, 160, 220, '#9d7bff', 0.5);    // violet rim

    const tex = new THREE.CanvasTexture(s.canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
    tex.dispose();
    return env;
  }

  function makeBackdropTexture() {
    const W = 512, H = 320, s = surface(W, H), x = s.ctx;
    x.fillStyle = '#04050c'; x.fillRect(0, 0, W, H);
    const g = x.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, W * 0.62);
    g.addColorStop(0, 'rgba(58,42,120,0.85)');
    g.addColorStop(0.45, 'rgba(22,20,58,0.55)');
    g.addColorStop(1, 'rgba(3,4,11,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const tex = new THREE.CanvasTexture(s.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ------------------------------------------------------------- scene -- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.48;

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene();
  scene.background = makeBackdropTexture();
  scene.environment = makeStudioEnvironment(renderer);

  const BW = 4.7, BH = 2.8;
  const GX = 56, GY = 40;
  const geo = new THREE.PlaneGeometry(BW, BH, GX, GY);

  const albedo = makeAlbedoTexture();
  blurHeight(2);
  const normalMap = makeNormalTexture(2.4);
  const roughnessMap = makeRoughnessTexture();
  const thicknessMap = makeThicknessTexture();
  thicknessMap.wrapS = THREE.RepeatWrapping;
  [albedo, normalMap, roughnessMap, thicknessMap].forEach((t) => { t.anisotropy = maxAniso; });

  const mat = new THREE.MeshPhysicalMaterial({
    map: albedo,
    normalMap,
    normalScale: new THREE.Vector2(0.24, 0.24),
    roughnessMap,
    roughness: 1.0,
    metalness: 0.45,
    side: THREE.DoubleSide,
    envMapIntensity: 2.6,
    iridescence: 1.0,
    iridescenceIOR: 2.2,
    iridescenceThicknessRange: [300, 820],
    iridescenceThicknessMap: thicknessMap,
    sheen: 0.3,
    sheenColor: new THREE.Color('#a9d9ff'),
    sheenRoughness: 0.32,
  });

  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0x3b3676, 0.55));
  const key = new THREE.DirectionalLight(0xffeede, 2.1);
  key.position.set(-3.1, 3.2, 3.4); scene.add(key);
  const rimCool = new THREE.DirectionalLight(0x3fbcff, 2.9);
  rimCool.position.set(3.6, 0.6, 2.2); scene.add(rimCool);
  const rimWarm = new THREE.DirectionalLight(0xff3d8e, 2.4);
  rimWarm.position.set(0.4, -2.6, 1.6); scene.add(rimWarm);
  const fill = new THREE.DirectionalLight(0x9d7bff, 1.6);
  fill.position.set(-3.2, -1.0, 2.6); scene.add(fill);

  /* ----------------------------------------------------------- physics --
     The parent's Verlet sheet, run finer and slower so the specular travels
     over the folds instead of chattering. The pinned top row is driven on a
     shallow standing wave, which is what sets the vertical folds. */
  const pos = geo.attributes.position;
  const N = (GX + 1) * (GY + 1);
  const cur = new Float32Array(N * 3), prev = new Float32Array(N * 3), rest = new Float32Array(N * 3);
  const pinned = new Uint8Array(N);

  for (let i = 0; i < N; i++) {
    const ax = pos.getX(i), ay = pos.getY(i);
    cur[i * 3] = prev[i * 3] = rest[i * 3] = ax;
    cur[i * 3 + 1] = prev[i * 3 + 1] = rest[i * 3 + 1] = ay;
    cur[i * 3 + 2] = prev[i * 3 + 2] = rest[i * 3 + 2] = 0;
  }
  for (let ix = 0; ix <= GX; ix++) pinned[ix] = 1;

  const idx = (ix, iy) => ix + iy * (GX + 1);
  const restH = BW / GX, restV = BH / GY;
  const GRAV = -2.15, DAMP = 0.989, DT = 0.016;

  function wind(ix, iy, t) {
    const cx = ix / GX, cy = iy / GY;
    const travel = t * 1.15 - cy * 3.4;
    const gust = 0.52 + 0.34 * Math.sin(t * 0.44) + 0.16 * Math.sin(t * 1.31 + 1.1);
    const amp = 2.15 * cy;
    const fz = (Math.sin(travel + cx * 2.6) + 0.46 * Math.sin(travel * 1.55 + cx * 5.1)) * amp * gust;
    const fx = Math.sin(t * 0.6 + cy * 1.9) * 0.9 * cy * (cx - 0.5);
    return [fx, -0.3 * cy, fz];
  }

  // Standing folds: the rail the silk hangs from breathes in and out.
  function railZ(ix, t) {
    const cx = ix / GX;
    return Math.sin(cx * Math.PI * 3.0 + t * 0.22) * 0.15
         + Math.sin(cx * Math.PI * 5.0 - t * 0.15) * 0.05;
  }

  function solve(a, b, rl) {
    const ax = cur[a * 3], ay = cur[a * 3 + 1], az = cur[a * 3 + 2];
    let dx = cur[b * 3] - ax, dy = cur[b * 3 + 1] - ay, dz = cur[b * 3 + 2] - az;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
    const diff = (d - rl) / d * 0.5;
    dx *= diff; dy *= diff; dz *= diff;
    const pa = pinned[a], pb = pinned[b];
    if (!pa && !pb) {
      cur[a * 3] += dx; cur[a * 3 + 1] += dy; cur[a * 3 + 2] += dz;
      cur[b * 3] -= dx; cur[b * 3 + 1] -= dy; cur[b * 3 + 2] -= dz;
    } else if (pa && !pb) { cur[b * 3] -= dx * 2; cur[b * 3 + 1] -= dy * 2; cur[b * 3 + 2] -= dz * 2; }
    else if (!pa && pb) { cur[a * 3] += dx * 2; cur[a * 3 + 1] += dy * 2; cur[a * 3 + 2] += dz * 2; }
  }

  function step(t) {
    for (let iy = 0; iy <= GY; iy++) {
      for (let ix = 0; ix <= GX; ix++) {
        const i = idx(ix, iy);
        if (pinned[i]) continue;
        const f = wind(ix, iy, t);
        for (let k = 0; k < 3; k++) {
          const j = i * 3 + k;
          const a = k === 0 ? f[0] : k === 1 ? f[1] + GRAV : f[2];
          const v = (cur[j] - prev[j]) * DAMP;
          prev[j] = cur[j];
          cur[j] = cur[j] + v + a * DT * DT;
        }
      }
    }
    for (let it = 0; it < 4; it++) {
      for (let iy = 0; iy <= GY; iy++) for (let ix = 0; ix < GX; ix++) solve(idx(ix, iy), idx(ix + 1, iy), restH);
      for (let iy = 0; iy < GY; iy++) for (let ix = 0; ix <= GX; ix++) solve(idx(ix, iy), idx(ix, iy + 1), restV);
    }
    for (let ix = 0; ix <= GX; ix++) {
      const i = ix, z = railZ(ix, t);
      cur[i * 3] = prev[i * 3] = rest[i * 3];
      cur[i * 3 + 1] = prev[i * 3 + 1] = rest[i * 3 + 1];
      cur[i * 3 + 2] = prev[i * 3 + 2] = z;
    }
  }

  function commit() {
    for (let i = 0; i < N; i++) pos.setXYZ(i, cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2]);
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  /* -------------------------------------------------------------- bloom --
     Scene into a half-float target, a bright pass at quarter resolution,
     two separable blurs, then one composite that tone-maps to the screen. */
  const rtScene = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const rtA = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  const rtB = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  [rtScene, rtA, rtB].forEach((rt) => {
    rt.texture.minFilter = THREE.LinearFilter;
    rt.texture.magFilter = THREE.LinearFilter;
    rt.texture.generateMipmaps = false;
  });

  const quadGeo = new THREE.PlaneGeometry(2, 2);
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(quadGeo, null);
  quadScene.add(quad);

  const VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

  const brightMat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, threshold: { value: 0.72 } },
    vertexShader: VERT,
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform float threshold; varying vec2 vUv;',
      'void main(){',
      '  vec3 c = texture2D(tDiffuse, vUv).rgb;',
      '  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));',
      '  float k = max(l - threshold, 0.0) / max(l, 1e-4);',
      '  gl_FragColor = vec4(c * k, 1.0);',
      '}',
    ].join('\\n'),
  });

  const blurMat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, direction: { value: new THREE.Vector2(1, 0) } },
    vertexShader: VERT,
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform vec2 direction; varying vec2 vUv;',
      'void main(){',
      '  vec3 sum = texture2D(tDiffuse, vUv).rgb * 0.2270270270;',
      '  sum += texture2D(tDiffuse, vUv + direction * 1.3846153846).rgb * 0.3162162162;',
      '  sum += texture2D(tDiffuse, vUv - direction * 1.3846153846).rgb * 0.3162162162;',
      '  sum += texture2D(tDiffuse, vUv + direction * 3.2307692308).rgb * 0.0702702703;',
      '  sum += texture2D(tDiffuse, vUv - direction * 3.2307692308).rgb * 0.0702702703;',
      '  gl_FragColor = vec4(sum, 1.0);',
      '}',
    ].join('\\n'),
  });

  const compositeMat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, tBloom: { value: null }, strength: { value: 0.62 } },
    vertexShader: VERT,
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform sampler2D tBloom; uniform float strength; varying vec2 vUv;',
      'void main(){',
      '  vec3 base = texture2D(tDiffuse, vUv).rgb;',
      '  vec3 glow = texture2D(tBloom, vUv).rgb;',
      '  gl_FragColor = vec4(base + glow * strength, 1.0);',
      '  #include <tonemapping_fragment>',
      '  #include <colorspace_fragment>',
      '}',
    ].join('\\n'),
  });

  function blit(material, target) {
    quad.material = material;
    renderer.setRenderTarget(target);
    renderer.render(quadScene, quadCam);
  }

  /* --------------------------------------------------------------- fit -- */
  let camera, cw = 1, ch = 1;
  function fit() {
    cw = window.innerWidth; ch = window.innerHeight;
    renderer.setSize(cw, ch, false);
    const dpr = renderer.getPixelRatio();
    const pw = Math.max(2, Math.floor(cw * dpr)), ph = Math.max(2, Math.floor(ch * dpr));
    rtScene.setSize(pw, ph);
    rtA.setSize(Math.max(2, pw >> 2), Math.max(2, ph >> 2));
    rtB.setSize(Math.max(2, pw >> 2), Math.max(2, ph >> 2));
    const aspect = cw / ch;
    camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    const vFit = (BH / 2) / Math.tan(40 * Math.PI / 360);
    const hFit = (BW / 2) / Math.tan(40 * Math.PI / 360) / aspect;
    camera.position.set(0, 0.02, Math.max(vFit, hFit) * 0.98 + 0.24);
    camera.lookAt(0, -0.04, 0);
  }
  window.addEventListener('resize', fit);
  fit();

  function draw(t) {
    thicknessMap.offset.x = (t * 0.028) % 1;
    // Slow parallax so the highlight sweeps rather than sits.
    const base = camera.position.z;
    camera.position.x = Math.sin(t * 0.13) * 0.30;
    camera.position.y = 0.02 + Math.sin(t * 0.17 + 1.4) * 0.12;
    camera.position.z = base;
    camera.lookAt(0, -0.04, 0);

    renderer.setRenderTarget(rtScene);
    renderer.clear();
    renderer.render(scene, camera);

    brightMat.uniforms.tDiffuse.value = rtScene.texture;
    blit(brightMat, rtA);
    blurMat.uniforms.tDiffuse.value = rtA.texture;
    blurMat.uniforms.direction.value.set(1 / rtA.width, 0);
    blit(blurMat, rtB);
    blurMat.uniforms.tDiffuse.value = rtB.texture;
    blurMat.uniforms.direction.value.set(0, 1 / rtA.height);
    blit(blurMat, rtA);

    compositeMat.uniforms.tDiffuse.value = rtScene.texture;
    compositeMat.uniforms.tBloom.value = rtA.texture;
    renderer.setRenderTarget(null);
    blit(compositeMat, null);
  }

  let running = false, raf = 0, t = 0;
  function loop() {
    if (!running) return;
    t += DT;
    step(t); commit(); draw(t);
    raf = requestAnimationFrame(loop);
  }
  function start() { if (running) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // Deterministic capture hook — render one frame at an exact time.
  window.__seek = (time) => {
    const target = Math.max(0, time);
    if (target < t) { t = 0; for (let i = 0; i < N * 3; i++) { cur[i] = rest[i]; prev[i] = rest[i]; } }
    while (t < target - DT * 0.5) { t += DT; step(t); }
    commit(); draw(t);
  };

  for (let s = 0; s < 150; s++) step(s * DT);
  t = 150 * DT;
  if (reduce) {
    commit(); draw(t);
  } else {
    start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }
})();
<\/script>
</body>
</html>
`,A=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Woven Cloth · Washi Noren</title>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"><\/script>
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0d0a07; }
  #cloth { display: block; width: 100%; height: 100%; }
  #vignette {
    position: fixed; inset: 0; pointer-events: none;
    background: radial-gradient(80% 74% at 50% 44%, transparent 46%, rgba(10,7,5,.80) 100%);
  }
</style>
</head>
<body>
<canvas id="cloth"></canvas>
<div id="vignette"></div>
<script>
(() => {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const canvas = document.getElementById('cloth');
  if (!window.THREE) return;

  const TW = 1500, TH = 980;
  const PANELS = 3;
  const BAND = 0.15;            // the uncut sleeve the rod runs through
  const SLIT_U = [1 / 3, 2 / 3];

  // A small deterministic generator, so the paper's fibres and torn edge are
  // the same every load — the deckle has to match the alpha mask exactly.
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  function surface(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return { canvas: c, ctx: c.getContext('2d', { willReadFrequently: true }) };
  }

  /* ------------------------------------------------------------- deckle --
     One torn profile, sampled by both the alpha mask and the shading, so the
     edge reads as a genuine hand-made sheet rather than a cropped rectangle. */
  const deckleRand = rng(20260826);
  const deckleLow = new Float32Array(TW);
  {
    const control = [];
    for (let i = 0; i <= 24; i++) control.push(deckleRand());
    for (let x = 0; x < TW; x++) {
      const f = (x / TW) * 24;
      const i = Math.floor(f), t = f - i;
      const smooth = t * t * (3 - 2 * t);
      const a = control[i], b = control[Math.min(24, i + 1)];
      const base = a + (b - a) * smooth;
      const fine = Math.sin(x * 0.19) * 0.16 + Math.sin(x * 0.061 + 1.7) * 0.24;
      deckleLow[x] = TH - 14 - (base * 26 + fine * 12);
    }
  }

  function makeAlphaMask() {
    const s = surface(TW, TH), x = s.ctx;
    x.fillStyle = '#fff'; x.fillRect(0, 0, TW, TH);
    x.fillStyle = '#000';

    // Slits between the panels, stopping short of the sleeve.
    const slitW = 22, bandPx = TH * BAND;
    SLIT_U.forEach((u) => x.fillRect(u * TW - slitW / 2, bandPx, slitW, TH - bandPx));

    // Torn lower edge.
    x.beginPath();
    x.moveTo(0, TH);
    for (let px = 0; px < TW; px++) x.lineTo(px, deckleLow[px]);
    x.lineTo(TW, TH);
    x.closePath();
    x.fill();

    // Softly feathered outer edges, as a couched sheet dries.
    const side = rng(771);
    for (let e = 0; e < 2; e++) {
      x.beginPath();
      x.moveTo(e ? TW : 0, 0);
      for (let py = 0; py <= TH; py += 6) {
        const w = 6 + side() * 9;
        x.lineTo(e ? TW - w : w, py);
      }
      x.lineTo(e ? TW : 0, TH);
      x.closePath();
      x.fill();
    }
    return s;
  }

  /* ---------------------------------------------------------- the cloth --
     Indigo-dyed kozo: vat unevenness, long fibres, the laid and chain lines
     the papermaking screen leaves, and a resist-dyed crest and lettering. */
  function drawWeaveCrest(x, cx, cy, R) {
    const cells = 6, step = (R * 1.86) / cells, origin = -R * 0.93;
    x.save();
    x.beginPath(); x.arc(cx, cy, R * 0.86, 0, Math.PI * 2); x.clip();
    x.fillStyle = '#f3ece0';
    for (let a = 0; a < cells; a++) {
      for (let b = 0; b < cells; b++) {
        if ((a + b) % 2) continue;
        x.fillRect(cx + origin + a * step, cy + origin + b * step, step + 0.5, step + 0.5);
      }
    }
    x.restore();
    x.strokeStyle = '#f3ece0';
    x.lineWidth = R * 0.10;
    x.beginPath(); x.arc(cx, cy, R * 0.96, 0, Math.PI * 2); x.stroke();
  }

  function verticalWord(x, word, cx, top, size, step) {
    x.font = 'bold ' + size + 'px Georgia, "Times New Roman", serif';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let i = 0; i < word.length; i++) x.fillText(word[i], cx, top + i * step);
  }

  function makeClothCanvas() {
    const s = surface(TW, TH), x = s.ctx;

    // Indigo vat: deeper where the cloth was dipped longest.
    const g = x.createLinearGradient(0, 0, 0, TH);
    g.addColorStop(0, '#284a6c');
    g.addColorStop(0.42, '#203d5e');
    g.addColorStop(1, '#17304e');
    x.fillStyle = g; x.fillRect(0, 0, TW, TH);

    const cloud = rng(4471);
    for (let i = 0; i < 26; i++) {
      const cx = cloud() * TW, cy = cloud() * TH, r = 120 + cloud() * 320;
      const light = cloud() > 0.5;
      const rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      rg.addColorStop(0, light ? 'rgba(96,132,168,0.13)' : 'rgba(9,22,40,0.16)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = rg; x.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    // Laid lines from the bamboo screen, then the heavier chain lines.
    x.strokeStyle = 'rgba(180,205,228,0.045)';
    x.lineWidth = 1;
    for (let px = 0; px < TW; px += 4) { x.beginPath(); x.moveTo(px + 0.5, 0); x.lineTo(px + 0.5, TH); x.stroke(); }
    x.strokeStyle = 'rgba(196,218,238,0.10)';
    x.lineWidth = 2;
    for (let py = 26; py < TH; py += 38) { x.beginPath(); x.moveTo(0, py + 0.5); x.lineTo(TW, py + 0.5); x.stroke(); }

    // Kozo fibres: long, mostly aligned, a few standing proud of the sheet.
    const fib = rng(90210);
    for (let i = 0; i < 2200; i++) {
      const fx = fib() * TW, fy = fib() * TH;
      const len = 30 + fib() * 150;
      const ang = (fib() - 0.5) * 0.9 + (fib() > 0.82 ? Math.PI / 2 : 0);
      const bow = (fib() - 0.5) * 26;
      const pale = fib();
      x.strokeStyle = pale > 0.3
        ? 'rgba(214,232,247,' + (0.022 + fib() * 0.048) + ')'
        : 'rgba(10,20,36,' + (0.04 + fib() * 0.07) + ')';
      x.lineWidth = 0.7 + fib() * 1.9;
      x.beginPath();
      x.moveTo(fx, fy);
      x.quadraticCurveTo(
        fx + Math.cos(ang) * len * 0.5 + bow, fy + Math.sin(ang) * len * 0.5 - bow,
        fx + Math.cos(ang) * len, fy + Math.sin(ang) * len,
      );
      x.stroke();
    }

    // Katazome: a resist-dyed frame inside each panel.
    const panelW = TW / PANELS;
    x.strokeStyle = 'rgba(243,236,224,0.72)';
    for (let k = 0; k < PANELS; k++) {
      const x0 = k * panelW + 34, w = panelW - 68;
      x.lineWidth = 5;
      x.strokeRect(x0, TH * BAND + 34, w, TH - TH * BAND - 118);
      x.lineWidth = 2;
      x.strokeRect(x0 + 13, TH * BAND + 47, w - 26, TH - TH * BAND - 144);
    }

    // The sleeve the rod runs through, and its shadow on the cloth below.
    x.fillStyle = 'rgba(8,18,34,0.30)';
    x.fillRect(0, 0, TW, TH * BAND);
    const sh = x.createLinearGradient(0, TH * BAND, 0, TH * BAND + 54);
    sh.addColorStop(0, 'rgba(6,14,28,0.42)');
    sh.addColorStop(1, 'rgba(6,14,28,0)');
    x.fillStyle = sh; x.fillRect(0, TH * BAND, TW, 54);
    x.strokeStyle = 'rgba(243,236,224,0.5)';
    x.lineWidth = 2.5;
    x.beginPath(); x.moveTo(0, TH * BAND); x.lineTo(TW, TH * BAND); x.stroke();

    x.fillStyle = '#f3ece0';
    verticalWord(x, 'FLOW', panelW * 0.5, TH * 0.34, 96, 116);
    drawWeaveCrest(x, panelW * 1.5, TH * 0.53, 158);
    verticalWord(x, 'CLOTH', panelW * 2.5, TH * 0.34, 96, 116);

    // Vermilion seal, stamped at the foot of the centre panel.
    const S = 96, sx = panelW * 1.5 - S / 2, sy = TH * 0.828;
    x.fillStyle = '#a8342a';
    x.fillRect(sx, sy, S, S);
    x.strokeStyle = '#f3ece0';
    x.lineWidth = 4;
    x.strokeRect(sx + 11, sy + 11, S - 22, S - 22);
    x.fillStyle = '#f3ece0';
    for (let k = 0; k < 3; k++) x.fillRect(sx + 23 + k * 18, sy + 23, 8, S - 46);
    x.fillRect(sx + 23, sy + 38, S - 46, 8);
    x.fillRect(sx + 23, sy + 60, S - 46, 8);

    return s;
  }

  function makeWoodTexture() {
    const W = 512, H = 96, s = surface(W, H), x = s.ctx;
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#a1764a');
    g.addColorStop(0.45, '#7d5533');
    g.addColorStop(1, '#563820');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const grain = rng(3312);
    for (let i = 0; i < 160; i++) {
      const y = grain() * H;
      x.strokeStyle = 'rgba(28,17,8,' + (0.05 + grain() * 0.16) + ')';
      x.lineWidth = 0.6 + grain() * 1.8;
      x.beginPath();
      x.moveTo(0, y);
      for (let px = 0; px <= W; px += 32) x.lineTo(px, y + Math.sin(px * 0.02 + i) * 2.4);
      x.stroke();
    }
    const tex = new THREE.CanvasTexture(s.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  // A shoji screen behind the noren gives the paper something to glow with.
  function makeShojiTexture() {
    const W = 768, H = 512, s = surface(W, H), x = s.ctx;
    x.fillStyle = '#1a1109'; x.fillRect(0, 0, W, H);
    const glow = x.createRadialGradient(W * 0.5, H * 0.44, 0, W * 0.5, H * 0.44, W * 0.52);
    glow.addColorStop(0, '#ffdda4');
    glow.addColorStop(0.40, '#a97c42');
    glow.addColorStop(0.76, '#341d0c');
    glow.addColorStop(1, '#150d06');
    x.fillStyle = glow; x.fillRect(0, 0, W, H);
    // Kumiko lattice, softened so it stays a suggestion behind the cloth.
    if ('filter' in x) x.filter = 'blur(7px)';
    x.strokeStyle = 'rgba(46,28,13,0.20)';
    x.lineWidth = 3;
    for (let px = 54; px < W; px += 128) { x.beginPath(); x.moveTo(px, 0); x.lineTo(px, H); x.stroke(); }
    for (let py = 46; py < H; py += 118) { x.beginPath(); x.moveTo(0, py); x.lineTo(W, py); x.stroke(); }
    if ('filter' in x) x.filter = 'none';
    const tex = new THREE.CanvasTexture(s.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ------------------------------------------------------------- scene -- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c0906);

  const shoji = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 8.4),
    new THREE.MeshBasicMaterial({ map: makeShojiTexture() }),
  );
  shoji.position.set(0, 0, -2.4);
  scene.add(shoji);

  const BW = 4.4, BH = 2.9;
  const GX = 60, GY = 40;
  const geo = new THREE.PlaneGeometry(BW, BH, GX, GY);

  const clothCanvas = makeClothCanvas();
  const albedo = new THREE.CanvasTexture(clothCanvas.canvas);
  albedo.colorSpace = THREE.SRGBColorSpace;
  const alphaMap = new THREE.CanvasTexture(makeAlphaMask().canvas);
  [albedo, alphaMap].forEach((t) => { t.anisotropy = maxAniso; });

  const mat = new THREE.MeshPhysicalMaterial({
    map: albedo,
    alphaMap,
    alphaTest: 0.5,
    transparent: false,
    side: THREE.DoubleSide,
    roughness: 0.92,
    metalness: 0.0,
    transmission: 0.82,
    thickness: 0.10,
    ior: 1.36,
    attenuationColor: new THREE.Color('#9dc0dd'),
    attenuationDistance: 3.0,
    sheen: 0.9,
    sheenColor: new THREE.Color('#d8e6f2'),
    sheenRoughness: 0.85,
  });

  const noren = new THREE.Mesh(geo, mat);
  scene.add(noren);

  /* ------------------------------------------------------------ fittings */
  const wood = new THREE.MeshStandardMaterial({ map: makeWoodTexture(), roughness: 0.66, metalness: 0.0 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, BW + 0.9, 20), wood);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, BH / 2 + 0.045, 0.02);
  scene.add(rod);
  [-1, 1].forEach((side) => {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.082, 18, 12), wood);
    cap.position.set(side * (BW + 0.9) / 2, BH / 2 + 0.045, 0.02);
    scene.add(cap);
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 3.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.9 }));
    cord.position.set(side * (BW + 0.72) / 2, BH / 2 + 1.75, 0.02);
    scene.add(cord);
  });

  /* ------------------------------------------------------------ lights -- */
  scene.add(new THREE.AmbientLight(0x4a3a28, 0.8));
  const lantern = new THREE.DirectionalLight(0xffd9a0, 3.6);   // through the shoji
  lantern.position.set(-0.4, 0.9, -3.2); scene.add(lantern);
  const key = new THREE.DirectionalLight(0xffe9cc, 2.1);
  key.position.set(-2.6, 2.4, 2.6); scene.add(key);
  const fill = new THREE.DirectionalLight(0x94b6d8, 0.5);
  fill.position.set(3.0, -1.0, 2.0); scene.add(fill);

  /* ----------------------------------------------------------- physics --
     One sheet, but the horizontal links are cut below the sleeve at each
     slit, so the three panels hang and sway as their own pieces of cloth. */
  const pos = geo.attributes.position;
  const N = (GX + 1) * (GY + 1);
  const cur = new Float32Array(N * 3), prev = new Float32Array(N * 3), rest = new Float32Array(N * 3);
  const pinned = new Uint8Array(N);
  const idx = (ix, iy) => ix + iy * (GX + 1);

  for (let i = 0; i < N; i++) {
    const ax = pos.getX(i), ay = pos.getY(i);
    cur[i * 3] = prev[i * 3] = rest[i * 3] = ax;
    cur[i * 3 + 1] = prev[i * 3 + 1] = rest[i * 3 + 1] = ay;
    cur[i * 3 + 2] = prev[i * 3 + 2] = rest[i * 3 + 2] = 0;
  }
  for (let ix = 0; ix <= GX; ix++) pinned[ix] = 1;

  const BAND_ROWS = Math.round(GY * BAND);
  const SLIT_IX = SLIT_U.map((u) => Math.round(u * GX));
  const panelOf = (ix) => (ix < SLIT_IX[0] ? 0 : ix < SLIT_IX[1] ? 1 : 2);
  const linked = (ix, iy) => !(iy > BAND_ROWS && SLIT_IX.indexOf(ix + 1) !== -1);

  const restH = BW / GX, restV = BH / GY;
  const restD = Math.sqrt(restH * restH + restV * restV);
  const GRAV = -1.65, DAMP = 0.986, DT = 0.016;

  function wind(ix, iy, t) {
    const cx = ix / GX, cy = iy / GY;
    // An indoor draft: each panel catches it on its own beat.
    const ph = panelOf(ix) * 2.1;
    const gust = 0.40 + 0.28 * Math.sin(t * 0.37 + ph * 0.6) + 0.15 * Math.sin(t * 0.93 + ph);
    const travel = t * 1.2 - cy * 2.2 + ph;
    const amp = 1.5 * cy;
    const fz = (Math.sin(travel) + 0.35 * Math.sin(travel * 1.8 + cx * 3.4)) * amp * gust;
    const fx = Math.sin(t * 0.44 + ph) * 0.20 * cy;
    return [fx, -0.18 * cy, fz];
  }

  function solve(a, b, rl) {
    const ax = cur[a * 3], ay = cur[a * 3 + 1], az = cur[a * 3 + 2];
    let dx = cur[b * 3] - ax, dy = cur[b * 3 + 1] - ay, dz = cur[b * 3 + 2] - az;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
    const diff = (d - rl) / d * 0.5;
    dx *= diff; dy *= diff; dz *= diff;
    const pa = pinned[a], pb = pinned[b];
    if (!pa && !pb) {
      cur[a * 3] += dx; cur[a * 3 + 1] += dy; cur[a * 3 + 2] += dz;
      cur[b * 3] -= dx; cur[b * 3 + 1] -= dy; cur[b * 3 + 2] -= dz;
    } else if (pa && !pb) { cur[b * 3] -= dx * 2; cur[b * 3 + 1] -= dy * 2; cur[b * 3 + 2] -= dz * 2; }
    else if (!pa && pb) { cur[a * 3] += dx * 2; cur[a * 3 + 1] += dy * 2; cur[a * 3 + 2] += dz * 2; }
  }

  function step(t) {
    for (let iy = 0; iy <= GY; iy++) {
      for (let ix = 0; ix <= GX; ix++) {
        const i = idx(ix, iy);
        if (pinned[i]) continue;
        const f = wind(ix, iy, t);
        for (let k = 0; k < 3; k++) {
          const j = i * 3 + k;
          const a = k === 0 ? f[0] : k === 1 ? f[1] + GRAV : f[2];
          const v = (cur[j] - prev[j]) * DAMP;
          prev[j] = cur[j];
          cur[j] = cur[j] + v + a * DT * DT;
        }
      }
    }
    for (let it = 0; it < 3; it++) {
      for (let iy = 0; iy <= GY; iy++) {
        for (let ix = 0; ix < GX; ix++) if (linked(ix, iy)) solve(idx(ix, iy), idx(ix + 1, iy), restH);
      }
      for (let iy = 0; iy < GY; iy++) {
        for (let ix = 0; ix <= GX; ix++) solve(idx(ix, iy), idx(ix, iy + 1), restV);
      }
      for (let iy = 0; iy < GY; iy++) {
        for (let ix = 0; ix < GX; ix++) {
          if (!linked(ix, iy) || !linked(ix, iy + 1)) continue;
          solve(idx(ix, iy), idx(ix + 1, iy + 1), restD);
          solve(idx(ix + 1, iy), idx(ix, iy + 1), restD);
        }
      }
    }
    for (let ix = 0; ix <= GX; ix++) {
      const i = ix;
      for (let k = 0; k < 3; k++) { cur[i * 3 + k] = rest[i * 3 + k]; prev[i * 3 + k] = rest[i * 3 + k]; }
    }
  }

  function commit() {
    for (let i = 0; i < N; i++) pos.setXYZ(i, cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2]);
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  /* --------------------------------------------------------------- fit -- */
  let camera;
  function fit() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    const vFit = (BH * 1.12 / 2) / Math.tan(38 * Math.PI / 360);
    const hFit = ((BW + 1.2) / 2) / Math.tan(38 * Math.PI / 360) / aspect;
    camera.position.set(0, 0.06, Math.max(vFit, hFit) * 1.02 + 0.3);
    camera.lookAt(0, -0.02, 0);
  }
  window.addEventListener('resize', fit);
  fit();

  function draw(t) {
    camera.position.x = Math.sin(t * 0.1) * 0.20;
    camera.position.y = 0.06 + Math.sin(t * 0.14 + 1.1) * 0.07;
    camera.lookAt(0, -0.02, 0);
    renderer.render(scene, camera);
  }

  let running = false, raf = 0, t = 0;
  function loop() {
    if (!running) return;
    t += DT;
    step(t); commit(); draw(t);
    raf = requestAnimationFrame(loop);
  }
  function start() { if (running) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  window.__seek = (time) => {
    const target = Math.max(0, time);
    if (target < t) { t = 0; for (let i = 0; i < N * 3; i++) { cur[i] = rest[i]; prev[i] = rest[i]; } }
    while (t < target - DT * 0.5) { t += DT; step(t); }
    commit(); draw(t);
  };

  for (let s = 0; s < 180; s++) step(s * DT);
  t = 180 * DT;
  if (reduce) {
    commit(); draw(t);
  } else {
    start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }
})();
<\/script>
</body>
</html>
`,D={iridescent:{title:"Woven Cloth iridescent silk",background:"#05060d",source:G},atelier:{title:"Woven Cloth atelier flag",background:"#12100d",source:S},washi:{title:"Woven Cloth washi noren",background:"#0d0a07",source:A}};function u(e,t,i){return Math.min(i,Math.max(t,e))}function C({definition:e,hue:t=s.hue,saturation:i=s.saturation,brightness:n=s.brightness,className:c,style:l}){const o=u(t,-180,180),a=u(i,0,2),x=u(n,.35,1.65),h=o===0&&a===1&&x===1?void 0:`hue-rotate(${o}deg) saturate(${a}) brightness(${x})`;return r.jsx("iframe",{className:c,title:e.title,srcDoc:e.source,sandbox:"allow-scripts",loading:"eager",style:{display:"block",width:"100%",height:"100%",border:0,background:e.background,filter:h,...l}})}function N({variant:e="woven-cloth",...t}){const i=d.useMemo(()=>e==="woven-cloth"?void 0:D[e]??void 0,[e]);return i?d.createElement(C,{...t,key:e,definition:i}):r.jsx(R,{...t})}function P(){try{const e=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(e.getContext("webgl")||e.getContext("experimental-webgl")))}catch{return!1}}function L(){const[e,t]=d.useState(!0);return d.useEffect(()=>{const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=P();(i||!n)&&t(!1)},[]),e?r.jsx("div",{className:"shader-frame",children:r.jsx(N,{variant:"original"})}):r.jsx("div",{className:"static-fallback-bg"})}export{L as Scene,L as default};
