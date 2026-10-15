
'use strict';const CARDS=[
{id:'iemanja',name:'Iemanjá',emoji:'fa-water',cost:5,hp:430,dmg:54,range:110,speed:26,rate:1.35,type:'ranged',rarity:'legend',color:'#69e9ff'},
{id:'ogum',name:'Ogum',emoji:'fa-shield-halved',cost:4,hp:720,dmg:100,range:24,speed:35,rate:1.1,type:'melee',rarity:'epic',color:'#f9b35c'},
{id:'oxossi',name:'Oxóssi',emoji:'fa-bullseye',cost:3,hp:350,dmg:75,range:125,speed:38,rate:1.2,type:'ranged',rarity:'epic',color:'#83f28a'},
{id:'xango',name:'Xangô',emoji:'fa-bolt',cost:5,hp:850,dmg:110,range:30,speed:24,rate:1.5,type:'melee',rarity:'legend',color:'#f9d47c'},
{id:'tranca',name:'Tranca-Ruas',emoji:'fa-key',cost:4,hp:580,dmg:92,range:28,speed:38,rate:1.1,type:'melee',rarity:'epic',color:'#ff6c80'},
{id:'flechas',name:'Sete Flechas',emoji:'fa-crosshairs',cost:3,hp:315,dmg:65,range:140,speed:37,rate:1.05,type:'ranged',rarity:'epic',color:'#89edac'},
{id:'marinheiro',name:'Marinheiro',emoji:'fa-anchor',cost:3,hp:620,dmg:65,range:24,speed:28,rate:1.3,type:'melee',rarity:'',color:'#8ee6ff'},
{id:'boiadeiro',name:'Boiadeiro',emoji:'fa-hat-cowboy',cost:4,hp:790,dmg:80,range:30,speed:33,rate:1.2,type:'melee',rarity:'',color:'#ffcd8a'},
{id:'jurema',name:'Cabocla Jurema',emoji:'fa-leaf',cost:4,hp:380,dmg:74,range:110,speed:35,rate:1.1,type:'ranged',rarity:'epic',color:'#8af59d'},
{id:'pai',name:'Pai Benedito',emoji:'fa-hands-praying',cost:3,hp:400,dmg:46,range:105,speed:25,rate:1.4,type:'ranged',rarity:'',color:'#ffdf9b'},
{id:'iansa',name:'Iansã',emoji:'fa-wind',cost:5,hp:440,dmg:90,range:100,speed:48,rate:.95,type:'ranged',rarity:'legend',color:'#f2a5ff'},
{id:'mare',name:'Guardião das Marés',emoji:'fa-water',cost:4,hp:590,dmg:82,range:105,speed:36,rate:1.1,type:'ranged',rarity:'legend',color:'#72e8ec'},
{id:'oxe',name:'Raio de Xangô',emoji:'fa-cloud-bolt',cost:4,hp:0,dmg:230,range:65,speed:0,rate:0,type:'spell',rarity:'epic',color:'#fff091'}];
const REALMS=[['fa-water','Iemanjá','Santuário das Sete Ondas',0],['fa-tree','Oxóssi','Matas Encantadas',120],['fa-shield-halved','Ogum','Fortaleza de Ferro',300],['fa-mountain','Xangô','Pedreiras da Justiça',600],['fa-sun','Oxalá','Templo da Luz',1000],['fa-child-reaching','Iori','Jardim das Crianças',1500],['fa-hands-praying','Iorimá','Vale dos Ancestrais',2200]];
const STORE='reinosaxe_royale_v4';let saved={};try{saved=JSON.parse(localStorage.getItem(STORE)||'{}')}catch(e){}const state={coins:saved.coins??1800,gems:saved.gems??90,trophies:saved.trophies??0,owned:saved.owned??['marinheiro','flechas','pai','boiadeiro','oxe','oxossi','ogum','iemanja','mare'],deck:saved.deck??['iemanja','ogum','oxossi','flechas','marinheiro','pai','boiadeiro','mare'],levels:saved.levels??{},fragments:saved.fragments??{},decks:saved.decks??null,settings:saved.settings??{sound:true,quality:'alta',effects:true},claimed:saved.claimed??[]};function save(){state.decks[activeDeck-1]=state.deck.slice();localStorage.setItem(STORE,JSON.stringify(state))}function updateWallet(){document.querySelectorAll('[data-coins]').forEach(e=>e.textContent=state.coins);document.querySelectorAll('[data-gems]').forEach(e=>e.textContent=state.gems);document.getElementById('trophies').textContent=state.trophies;document.getElementById('playerLevel').textContent='Grau '+(1+Math.floor(state.trophies/100));document.querySelector('.kingdom-label').textContent='REINO DE '+currentRealm()[1].toUpperCase();document.querySelector('.lobby-info').firstChild.textContent=currentRealm()[2]+' · '}function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));if(id==='collection')renderCollection();if(id==='shop')renderShop();if(id==='realms')renderRealms();updateWallet()}let toastTimeout;function toast(msg){let el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),1900)}let audioCtx=null,soundOn=true;function sound(freq=400,dur=.1,wave='sine',volume=.06,slide=0){if(!soundOn)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=audioCtx.currentTime;o.type=wave;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),t+dur);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+dur)}catch(e){}}function toggleSound(){soundOn=!soundOn;state.settings.sound=soundOn;save();toast(soundOn?'Som ligado':'Som desligado');if(soundOn)sound(600,.15)}
function cardEl(c,click,extra=''){let el=document.createElement('button');el.className='card '+c.rarity+' '+extra+(state.owned.includes(c.id)?'':' locked-card');el.innerHTML=`<span class="cost">${c.cost}</span><span class="portrait portrait-${c.id}"><span class="halo"></span><span class="head"></span><span class="torso"></span><span class="weapon"></span></span>${state.owned.includes(c.id)?'':'<span class="lockmark">BLOQUEADO</span>'}<span class="name">${c.name}</span><span class="level">Nível ${state.levels[c.id]||1}</span>`;el.onclick=click;return el}let replaceIndex=-1,activeDeck=1;state.decks??=Array.from({length:5},()=>state.deck.slice());soundOn=state.settings.sound!==false;function renderCollection(){let tabs=document.getElementById('deckTabs');tabs.innerHTML='';for(let i=1;i<=5;i++){let b=document.createElement('button');b.textContent='CORRENTE '+i;b.className=i===activeDeck?'sel':'';b.onclick=()=>{state.decks[activeDeck-1]=state.deck.slice();activeDeck=i;state.deck=state.decks[i-1].slice();replaceIndex=-1;renderCollection()};tabs.append(b)}let grid=document.getElementById('deckGrid');grid.innerHTML='';state.deck.forEach((id,i)=>{let c=CARDS.find(x=>x.id===id);grid.append(cardEl(c,()=>{replaceIndex=i;renderCollection();toast('Escolha uma entidade do acervo para substituir')},replaceIndex===i?'selected':''))});let all=document.getElementById('allCards');all.innerHTML='';CARDS.forEach(c=>all.append(cardEl(c,()=>{if(replaceIndex<0){toast(c.name+' • '+c.cost+' de Axé para invocar');return}if(!state.owned.includes(c.id)){toast('Desperte esta entidade no Mercado ou em recompensas');return}let existing=state.deck.indexOf(c.id);if(existing>=0)[state.deck[existing],state.deck[replaceIndex]]=[state.deck[replaceIndex],state.deck[existing]];else state.deck[replaceIndex]=c.id;replaceIndex=-1;save();renderCollection();sound(700,.15)})));document.getElementById('avgCost').textContent=(state.deck.reduce((n,id)=>n+CARDS.find(c=>c.id===id).cost,0)/8).toFixed(1)}function renderShop(){let el=document.getElementById('upgradeList');el.innerHTML='<div class="section">HERÓIS · DESBLOQUEAR COM MOEDAS OU JOIAS</div>';CARDS.forEach(c=>{if(!state.owned.includes(c.id)){let box=document.createElement('div');box.className='panel shophero';let price=c.rarity==='legend'?2200:c.rarity==='epic'?1450:900;let gems=c.rarity==='legend'?220:c.rarity==='epic'?150:90;box.innerHTML='<div class="shop-portrait"><i class="fa-solid '+c.emoji+'"></i></div><div class="shop-desc"><b>'+c.name+'</b><small>Herói • '+c.cost+' de Axé por invocação</small></div>';let a=document.createElement('button');a.className='btn darkbtn';a.textContent=price+' ●';a.onclick=()=>buyHero(c,price,'coins');let b=document.createElement('button');b.className='btn darkbtn';b.textContent=gems+' ◆';b.onclick=()=>buyHero(c,gems,'gems');box.append(a,b);el.append(box)}});let title=document.createElement('div');title.className='section';title.textContent='EVOLUÇÃO DE HERÓIS';el.append(title);CARDS.filter(c=>state.owned.includes(c.id)).forEach(c=>{let level=state.levels[c.id]||1,need=level*4,fr=state.fragments[c.id]||0,price=100*level;let row=document.createElement('div');row.className='panel';row.style='display:flex;align-items:center;gap:12px;padding:9px;margin:10px 0';row.innerHTML=`<span class="hero-mini"><i class="fa-solid ${c.emoji}"></i></span><div style="flex:1"><b>${c.name}</b><div class="small">Nível ${level} · Fragmentos ${fr}/${need}</div></div>`;let b=document.createElement('button');b.className='btn blue';b.style='font-size:12px';b.textContent=price+' ●';b.onclick=()=>{if(fr<need)return toast('Faltam fragmentos');if(state.coins<price)return toast('Moedas insuficientes');state.coins-=price;state.fragments[c.id]-=need;state.levels[c.id]=level+1;save();renderShop();updateWallet();sound(950,.3)};row.append(b);el.append(row)})}function buyHero(c,price,currency){if(state[currency]<price)return toast('Saldo insuficiente');state[currency]-=price;state.owned.push(c.id);save();updateWallet();renderShop();sound(720,.24,'triangle',.08,390);toast('HERÓI DESBLOQUEADO: '+c.name)}function openChest(){if(state.coins<300)return toast('Moedas insuficientes');state.coins-=300;let c=CARDS[Math.floor(Math.random()*CARDS.length)];if(!state.owned.includes(c.id)){state.owned.push(c.id);window.chestMsg='Novo herói: '+c.name}else{state.fragments[c.id]=(state.fragments[c.id]||0)+5;window.chestMsg='+5 fragmentos: '+c.name}state.coins+=120;save();renderShop();updateWallet();sound(650,.3,'triangle',.08,500);toast(window.chestMsg+' e 120 moedas!')}function currentRealm(){return [...REALMS].reverse().find(r=>state.trophies>=r[3])||REALMS[0]}function renderRealms(){let el=document.getElementById('realmList');el.innerHTML='';REALMS.forEach(([emoji,name,desc,req],i)=>{let unlocked=state.trophies>=req;let row=document.createElement('div');row.className='panel realm '+(unlocked?'':'lock');row.innerHTML=`<span class="symbol"><i class="fa-solid ${emoji}"></i></span><div><b>REINO ${i+1} · ${name}</b><div class="small">${desc}</div><div class="badge">${unlocked?'✓ Desbloqueado':'Requer '+req+' de Axé'}</div></div>`;el.append(row)})}
const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');let W=360,H=620,units=[],towers=[],particles=[],projectiles=[],energy=5,enemyEnergy=5,hand=[],drawPile=[],selected=-1,battleTime=180,lastTime=0,gameOn=false,animId=0,enemyAITimer=0,playerCrown=0,enemyCrown=0,ending=false;const rnd=(a,b)=>a+Math.random()*(b-a);function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;let dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.floor(W*dpr);canvas.height=Math.floor(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}window.addEventListener('resize',()=>{if(gameOn)resize()});function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}function makeTowers(){towers=[];for(let side of [0,1]){for(let lane of [0,1])towers.push({side,lane,x:W*(lane? .77:.23),y:H*(side?.77:.23),hp:1500,max:1500,range:W*.165,rate:1.38,cd:0,king:false,alive:true});towers.push({side,lane:2,x:W*.5,y:H*(side?.885:.115),hp:2600,max:2600,range:W*.19,rate:1.3,cd:0,king:true,alive:true})}}function startBattle(){show('battle');resize();units=[];particles=[];projectiles=[];energy=5;enemyEnergy=5;selected=-1;battleTime=180;lastTime=0;enemyAITimer=2;playerCrown=0;enemyCrown=0;ending=false;makeTowers();drawPile=shuffle(state.deck.slice());hand=drawPile.splice(0,4);gameOn=true;renderHand();sound(360,.4,'sawtooth',.06,280);cancelAnimationFrame(animId);animId=requestAnimationFrame(loop);toast('BATALHA NO '+currentRealm()[1].toUpperCase()+' • Invoque com Axé!')}function leaveBattle(){gameOn=false;cancelAnimationFrame(animId);show('lobby')}function renderHand(){let el=document.getElementById('hand');el.innerHTML='';hand.forEach((id,i)=>{let c=CARDS.find(x=>x.id===id);el.append(cardEl(c,()=>{selected=i;renderHand();sound(510,.08)},(selected===i?'selected ':'')+(c.cost>energy?'disabled':'')))});document.getElementById('energy').textContent=Math.floor(energy);document.getElementById('energyFill').style.width=(energy*10)+'%';document.getElementById('nextCard').textContent='Próxima invocação: '+(CARDS.find(c=>c.id===drawPile[0])?.name||'—')}
function spawn(card,side,x,y){if(card.type==='spell'){let targetY=y;for(let t of [...units,...towers]){if(t.side!==side&&t.alive!==false&&Math.hypot(t.x-x,t.y-targetY)<W*.18){t.hp-=card.dmg*(1+.12*((state.levels[card.id]||1)-1));if(t.hp<=0&&'alive'in t)destroyTower(t)}}burst(x,y,card.color,26);sound(150,.4,'sawtooth',.12,-110);return}let lane=x<W/2?0:1;let px=W*(lane?.77:.23);let level=side===1?(state.levels[card.id]||1):1;units.push({side,lane,x:px+rnd(-8,8),y,card,entry:['iemanja','marinheiro','mare'].includes(card.id)?1.35:0,attackPose:0,hp:card.hp*(1+.12*(level-1)),max:card.hp*(1+.12*(level-1)),dmg:card.dmg*(1+.12*(level-1)),cd:rnd(.1,.6),walk:rnd(0,7),flash:0});burst(px,y,card.color,9);sound(420,.12,'triangle',.06,210)}function destroyTower(t){if(!t.alive)return;t.alive=false;burst(t.x,t.y,t.side?'#5bd8ff':'#ff6985',36);sound(110,.65,'sawtooth',.14,-70);if(t.side===0)playerCrown++;else enemyCrown++;if(t.king)finish(t.side===0);document.getElementById('myCrowns').textContent=playerCrown;document.getElementById('enemyCrowns').textContent=enemyCrown}
function burst(x,y,color,n){for(let i=0;i<n;i++)particles.push({x,y,vx:rnd(-85,85),vy:rnd(-90,90),life:rnd(.25,.8),max:.8,color,size:rnd(2,6)})}function shoot(a,b,damage,color){
 const id=a.card?.id||'';
 const atk=HERO_STYLES[id]?.attack||'';
 const kind=(id==='flechas'||id==='oxossi'||atk==='arrow'||atk==='multishot')?'arrow':
 (id==='boiadeiro'||atk==='lasso')?'lasso':
 (id==='marinheiro'||id==='iemanja'||id==='mare'||atk==='tide'||atk==='splash')?'water':
 (['tranca','marabo','caveira','tiriri'].includes(id)||atk==='fire')?'fire':
 (id==='jurema'||atk==='leaf')?'leaf':
 (id==='xango'||atk==='thunder')?'lightning':
 (id==='iansa'||atk==='gust')?'wind':
 (id==='pai'||atk==='blessing')?'blessing':'energy';
 projectiles.push({x:a.x,y:a.y,target:b,speed:kind==='arrow'?410:kind==='fire'?295:kind==='lasso'?320:260,damage,side:a.side,color,kind,rotation:0,trail:[]})
}function takeDamage(t,amount){t.hp-=amount;t.flash=.15;if(t.hp<=0){if('alive'in t)destroyTower(t);else{burst(t.x,t.y,t.card.color,12);t.dead=true;sound(180,.12,'triangle',.04,-80)}}}function targetFor(u){let enemies=units.filter(e=>e.side!==u.side&&!e.dead);let closest=null,best=1e9;for(let e of enemies){let d=Math.hypot(e.x-u.x,e.y-u.y);if(d<best&&d<W*.36){best=d;closest=e}}if(closest)return closest;let alive=towers.filter(t=>t.side!==u.side&&t.alive&&t.lane===u.lane);if(!alive.length)alive=towers.filter(t=>t.side!==u.side&&t.alive&&t.king);return alive[0]||null}
/* V9 — estilos de locomoção, habilidades e ataques por origem */
const HERO_STYLES={
 iemanja:{walk:'float',attack:'tide',ability:'maré protetora',desc:'Desliza pelas águas; onda que atinge alvos próximos.'},
 ogum:{walk:'march',attack:'cleave',ability:'corte de ferro',desc:'Marcha pesada; golpe de espada em área.'},
 oxossi:{walk:'stalk',attack:'arrow',ability:'flecha certeira',desc:'Passos silenciosos; flecha veloz de longo alcance.'},
 xango:{walk:'heavy',attack:'thunder',ability:'trovão',desc:'Passos de pedra; impacto que atinge inimigos próximos.'},
 tranca:{walk:'stride',attack:'curse',ability:'encruzilhada',desc:'Avança com firmeza; golpe que enfraquece a velocidade.'},
 flechas:{walk:'stalk',attack:'multishot',ability:'sete flechas',desc:'Corre pela mata; disparo duplo.'},
 marinheiro:{walk:'surf',attack:'splash',ability:'onda de chegada',desc:'Surfa uma onda no início; golpe de água.'},
 boiadeiro:{walk:'charge',attack:'lasso',ability:'laço do boiadeiro',desc:'Avanço impetuoso; laço que retarda o inimigo.'},
 jurema:{walk:'stalk',attack:'leaf',ability:'folhas de jurema',desc:'Passos leves; folhas encantadas que restauram aliados.'},
 pai:{walk:'slow',attack:'blessing',ability:'benção ancestral',desc:'Caminha devagar; bênção que recupera aliados.'},
 iansa:{walk:'wind',attack:'gust',ability:'rajada de vento',desc:'Deslocamento veloz; rajada que empurra adversários.'},
 mare:{walk:'surf',attack:'tide',ability:'investida das marés',desc:'Chega surfando uma onda; disparo de água em área.'},
 encantado:{walk:'float',attack:'arcane',ability:'encanto da corrente',desc:'Flutua; disparo espiritual que salta para outro alvo.'},
 guerreiroreal:{walk:'march',attack:'cleave',ability:'golpe do cruzeiro',desc:'Marcha de guerreiro; ataque de impacto em área.'}
};
function fighterStyle(u){return HERO_STYLES[u.card.id]||{walk:'march',attack:'strike',ability:'golpe',desc:'Ataque direto'}}
function applyHeroAttack(u,t){
 const a=fighterStyle(u).attack,near=units.filter(v=>v.side!==u.side&&!v.dead&&v!==t&&Math.hypot(v.x-t.x,v.y-t.y)<W*.15);
 if(['tide','splash','thunder','cleave','gust'].includes(a)){
  near.slice(0,a==='thunder'?3:2).forEach(v=>takeDamage(v,u.dmg*(a==='thunder'?.65:.38)));
  burst(t.x,t.y,a==='thunder'?'#ffdb6b':a==='cleave'?'#f4bd81':'#7cefff',a==='thunder'?17:10);
 }
 if(a==='multishot'&&near[0])shoot(u,near[0],u.dmg*.62,u.card.color);
 if(a==='arcane'&&near[0])shoot(t,near[0],u.dmg*.45,'#c4a5ff');
 if(a==='curse'||a==='lasso'){t.slowTimer=Math.max(t.slowTimer||0,2.6);burst(t.x,t.y,'#d3a0ff',7)}
 if(a==='gust'&&t.card){t.y+=u.side===1?-W*.06:W*.06}
 if(a==='blessing'||a==='leaf'){
  const ally=units.filter(v=>v.side===u.side&&!v.dead&&v.hp<v.max).sort((x,y)=>Math.hypot(x.x-u.x,x.y-u.y)-Math.hypot(y.x-u.x,y.y-u.y))[0];
  if(ally){ally.hp=Math.min(ally.max,ally.hp+u.dmg*(a==='blessing'?1.3:.8));burst(ally.x,ally.y,'#b6f6b4',9)}
 }
}

function update(dt){battleTime-=dt;energy=Math.min(10,energy+dt*(battleTime<60? .82:.43));enemyEnergy=Math.min(10,enemyEnergy+dt*(battleTime<60?.82:.43));for(let u of units){if(u.dead)continue;u.walk+=dt*({surf:13,wind:17,stalk:10,march:7,heavy:5,slow:4,float:8,charge:14,stride:9}[fighterStyle(u).walk]||9);u.slowTimer=Math.max(0,(u.slowTimer||0)-dt);u.cd-=dt;u.entry=Math.max(0,(u.entry||0)-dt);u.attackPose=Math.max(0,(u.attackPose||0)-dt);u.flash=Math.max(0,u.flash-dt);let t=targetFor(u);if(!t)continue;let dx=t.x-u.x,dy=t.y-u.y,d=Math.hypot(dx,dy)||1;if(d>u.card.range*.63){let motion=fighterStyle(u).walk;let step=u.card.speed*dt*(u.entry>0?2.25:1)*(u.slowTimer>0?.5:1)*(motion==='wind'?1.17:motion==='heavy'?.82:motion==='slow'?.87:1);u.x+=dx/d*step;u.y+=dy/d*step}else if(u.cd<=0){u.cd=u.card.rate;u.attackPose=.32;if(u.card.type==='ranged')shoot(u,t,u.dmg,u.card.color);else{takeDamage(t,u.dmg);burst(t.x,t.y,u.card.color,4);if(u.card.id==='ogum'||u.card.id==='boiadeiro')burst(t.x,t.y,'#ffd28a',7)}applyHeroAttack(u,t);sound(u.card.type==='ranged'?620:170,.085,u.card.type==='ranged'?'sine':'square',.023,-100)}}for(let t of towers){if(!t.alive)continue;t.cd-=dt;if(t.cd>0)continue;let enemies=units.filter(u=>u.side!==t.side&&!u.dead&&Math.hypot(u.x-t.x,u.y-t.y)<t.range);if(enemies.length){enemies.sort((a,b)=>Math.hypot(a.x-t.x,a.y-t.y)-Math.hypot(b.x-t.x,b.y-t.y));shoot(t,enemies[0],t.king?90:70,t.side?'#6deaff':'#ff7386');t.cd=t.rate}}for(let p of projectiles){let t=p.target;if(t.dead||t.alive===false){p.dead=true;continue}let dx=t.x-p.x,dy=t.y-p.y,d=Math.hypot(dx,dy);if(d<p.speed*dt+7){takeDamage(t,p.damage);burst(t.x,t.y,p.color,5);p.dead=true;sound(360,.07,'triangle',.025,-180)}else{p.x+=dx/d*p.speed*dt;p.y+=dy/d*p.speed*dt}}projectiles=projectiles.filter(p=>!p.dead);units=units.filter(u=>!u.dead);for(let p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;p.life-=dt}particles=particles.filter(p=>p.life>0);if(battleTime<=0)finish(playerCrown>enemyCrown||playerCrown===enemyCrown&&towers.filter(t=>t.side===0).reduce((a,b)=>a+b.hp,0)<towers.filter(t=>t.side===1).reduce((a,b)=>a+b.hp,0));document.getElementById('timer').textContent=Math.floor(Math.max(0,battleTime)/60)+':'+String(Math.floor(Math.max(0,battleTime)%60)).padStart(2,'0');renderHandState()}
function renderHandState(){document.getElementById('energy').textContent=Math.floor(energy);document.getElementById('energyFill').style.width=(energy*10)+'%';document.querySelectorAll('#hand .card').forEach((e,i)=>e.classList.toggle('disabled',CARDS.find(c=>c.id===hand[i]).cost>energy))}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}function drawAxeArena(){
 const realm=Math.max(0,Math.min(6,typeof chosenRealm==='number'?chosenRealm:0));
 const themes=[['#102c32','#3c6865','#a4d9ca'],['#152e22','#527456','#b5d6a0'],['#282e31','#7b7770','#e6ca92'],['#382920','#8a654b','#e8b68a'],['#30343c','#939da0','#f1e7c8'],['#30243d','#816d91','#dcc4ec'],['#1d293b','#657f99','#d7e4f4']];
 const [shadow,stone,glow]=themes[realm],time=performance.now()*.001;
 // Chão texturizado e iluminação volumétrica: arena em perspectiva isométrica 2.5D.
 const floor=ctx.createLinearGradient(0,0,W,H);floor.addColorStop(0,shadow);floor.addColorStop(.52,stone);floor.addColorStop(1,shadow);ctx.fillStyle=floor;ctx.fillRect(0,0,W,H);
 let vignette=ctx.createRadialGradient(W*.5,H*.48,W*.12,W*.5,H*.48,H*.76);vignette.addColorStop(0,'#ffffff12');vignette.addColorStop(1,'#00000099');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
 // Lajes irregulares desenhadas de forma determinística, sem grade de tabuleiro.
 for(let i=0;i<150;i++){
   let x=((i*127.71)%997)/997*W,y=((i*311.37)%991)/991*H;
   let w=W*(.025+((i*17)%13)*.003),h=H*(.009+((i*23)%11)*.0012);
   ctx.beginPath();ctx.moveTo(x-w*.55,y);ctx.lineTo(x-w*.18,y-h);ctx.lineTo(x+w*.55,y-h*.55);ctx.lineTo(x+w*.65,y+h*.45);ctx.lineTo(x-w*.24,y+h*.72);ctx.closePath();
   ctx.fillStyle=i%4===0?'#d7e3d00e':'#020a111b';ctx.fill();ctx.strokeStyle=i%3===0?'#e3ddbc13':'#00000026';ctx.lineWidth=.8;ctx.stroke();
 }
 // Anel de pedra elevado: sombra projetada, parede lateral e superfície elíptica.
 ctx.save();ctx.translate(W*.5,H*.5);
 for(let j=12;j>=0;j--){ctx.beginPath();ctx.ellipse(0,j*.9,W*.475,H*.405,0,0,Math.PI*2);ctx.fillStyle=j>4?'#09171ba0':'#101b2299';ctx.fill()}
 let ring=ctx.createLinearGradient(-W*.4,-H*.35,W*.42,H*.35);ring.addColorStop(0,'#c9bd9b');ring.addColorStop(.3,stone);ring.addColorStop(.75,shadow);ring.addColorStop(1,'#d6c4a1');
 ctx.beginPath();ctx.ellipse(0,-5,W*.475,H*.405,0,0,Math.PI*2);ctx.fillStyle=ring;ctx.fill();ctx.strokeStyle='#e3d0a071';ctx.lineWidth=3;ctx.stroke();
 ctx.beginPath();ctx.ellipse(0,-5,W*.435,H*.369,0,0,Math.PI*2);ctx.fillStyle='#0d1a20c4';ctx.fill();ctx.strokeStyle=glow+'78';ctx.lineWidth=1.5;ctx.stroke();
 // Estratos de pedra na circunferência, relevos e fendas.
 for(let i=0;i<36;i++){let a=i*Math.PI/18;ctx.beginPath();ctx.moveTo(Math.cos(a)*W*.435,Math.sin(a)*H*.369-5);ctx.lineTo(Math.cos(a)*W*.473,Math.sin(a)*H*.405-5);ctx.strokeStyle=i%3?'#0a141e85':'#fff1cc47';ctx.lineWidth=1.5;ctx.stroke()}
 ctx.restore();
 // Duas passagens de pedra com bordas em relevo, em vez de pontes.
 for(let lane=0;lane<2;lane++){
  const x=W*(lane?.77:.23),bw=W*.165;
  ctx.beginPath();ctx.moveTo(x-bw*.5,0);ctx.bezierCurveTo(x-bw*.7,H*.3,x-bw*.7,H*.7,x-bw*.5,H);ctx.lineTo(x+bw*.5,H);ctx.bezierCurveTo(x+bw*.7,H*.7,x+bw*.7,H*.3,x+bw*.5,0);ctx.closePath();
  let path=ctx.createLinearGradient(x-bw,0,x+bw,0);path.addColorStop(0,'#091719');path.addColorStop(.18,stone);path.addColorStop(.5,'#aaab9688');path.addColorStop(.82,stone);path.addColorStop(1,'#091719');ctx.fillStyle=path;ctx.fill();
  ctx.strokeStyle=glow+'44';ctx.lineWidth=1.5;ctx.stroke();
  for(let k=0;k<23;k++){let y=k*H/22;ctx.beginPath();ctx.moveTo(x-bw*.43,y);ctx.lineTo(x+bw*.43,y+Math.sin(k*2)*2);ctx.strokeStyle=k%3?'#00000024':'#ffffff20';ctx.lineWidth=1;ctx.stroke()}
 }
 // Selo central com aro de metal, sombra, brilho e inscrição original.
 ctx.save();ctx.translate(W*.5,H*.5);ctx.shadowColor='#000';ctx.shadowBlur=18;ctx.shadowOffsetY=9;ctx.fillStyle='#111a20';ctx.beginPath();ctx.ellipse(0,0,W*.13,W*.092,0,0,7);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 let seal=ctx.createRadialGradient(-8,-8,1,0,0,W*.12);seal.addColorStop(0,'#8d8c7a');seal.addColorStop(.7,'#303b3c');seal.addColorStop(1,'#111b21');ctx.fillStyle=seal;ctx.beginPath();ctx.ellipse(0,-5,W*.12,W*.087,0,0,7);ctx.fill();ctx.strokeStyle=glow;ctx.lineWidth=2.5;ctx.stroke();
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${Math.max(17,W*.055)}px Georgia`;ctx.fillStyle=glow;ctx.shadowColor=glow;ctx.shadowBlur=8+Math.sin(time*2)*3;ctx.fillText('✦',0,-7);ctx.restore();
 // Luminárias rituais laterais com pedestal e chamas discretas.
 for(let i=0;i<12;i++){let x=i%2?W*.965:W*.035,y=H*(.11+Math.floor(i/2)*.155),f=.75+Math.sin(time*3+i)*.2;
  ctx.fillStyle='#0009';ctx.beginPath();ctx.ellipse(x+3,y+9,11,5,0,0,7);ctx.fill();ctx.fillStyle='#192326';ctx.fillRect(x-5,y-1,10,13);ctx.fillStyle='#ad9673';ctx.fillRect(x-7,y-3,14,4);
  ctx.save();ctx.globalAlpha=f;ctx.shadowColor=glow;ctx.shadowBlur=14;ctx.fillStyle=glow;ctx.beginPath();ctx.ellipse(x,y-8,2.5,6,0,0,7);ctx.fill();ctx.restore();
 }
 // Divisão territorial: luz no piso, sem barreira física.
 ctx.save();ctx.strokeStyle=glow+'48';ctx.lineWidth=2;ctx.setLineDash([4,10]);ctx.beginPath();ctx.moveTo(W*.06,H*.5);ctx.lineTo(W*.94,H*.5);ctx.stroke();ctx.restore();
}

function draw(){ctx.clearRect(0,0,W,H);drawAxeArena();for(let t of towers){if(!t.alive)continue;let r=t.king?W*.09:W*.075;ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(t.x,t.y+r*.6,r*1.2,r*.45,0,0,7);ctx.fill();roundRect(t.x-r,t.y-r,r*2,r*1.9,7,t.side?'#3277c4':'#9e344b',t.side?'#b5edff':'#ffb6b6');roundRect(t.x-r*.82,t.y-r*.9,r*1.64,r*.65,6,t.side?'#7ed6fc':'#fda1a1','#fff9');ctx.font=`${r*.9}px serif`;ctx.textAlign='center';drawSanctuary(t,r);drawHP(t.x,t.y-r*1.35,r*2,t.hp/t.max,t.side);ctx.save();ctx.textAlign='center';ctx.font='900 '+Math.max(12,W*.035)+'px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#04131f';ctx.strokeText(Math.max(0,Math.ceil(t.hp))+' / '+t.max,t.x,t.y-r*1.35-8);ctx.fillStyle='#ffffff';ctx.fillText(Math.max(0,Math.ceil(t.hp))+' / '+t.max,t.x,t.y-r*1.35-8);ctx.restore()}for(let u of units){let r=Math.max(18,W*.060);ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(u.x,u.y+r*.5,r,r*.38,0,0,7);ctx.fill();ctx.beginPath();ctx.strokeStyle=u.side?'#46c5f999':'#e8526999';ctx.lineWidth=1.5;ctx.ellipse(u.x,u.y+r*.48,r*.47,r*.14,0,0,7);ctx.stroke();ctx.save();ctx.translate(u.x,u.y+Math.sin(u.walk)*1.5);drawFighter(u,r);ctx.restore();drawHP(u.x,u.y-r-11,r*2.5,u.hp/u.max,u.side)}for(let p of projectiles){drawPowerProjectile(p)}for(let p of particles){ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,7);ctx.fill()}ctx.globalAlpha=1;if(selected>=0){drawDeployZone()}}function drawHP(x,y,w,f,side){roundRect(x-w/2,y,w,5,2,'#0d1527');roundRect(x-w/2,y,Math.max(0,w*f),5,2,side?'#60d7ff':'#ff6487')}
function loop(ts){if(!gameOn)return;let dt=Math.min((ts-lastTime)/1000||0,.04);lastTime=ts;update(dt);draw();if(gameOn)animId=requestAnimationFrame(loop)}canvas.addEventListener('pointerdown',e=>{if(!gameOn||selected<0)return;let c=CARDS.find(x=>x.id===hand[selected]);if(c.cost>energy)return toast('Axé insuficiente!');let r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;if(c.type!=='spell'&&!canDeployHere(1,x,y))return toast('Destrua a torre inimiga desta rota para avançar!');energy-=c.cost;spawn(c,1,x,y);hand[selected]=drawPile.shift();drawPile.push(c.id);selected=-1;renderHand()});function finish(win){if(ending)return;ending=true;gameOn=false;cancelAnimationFrame(animId);if(win){state.trophies+=30;state.coins+=150;if(Math.random()<.38){let locked=CARDS.filter(c=>!state.owned.includes(c.id));if(locked.length){let prize=locked[Math.floor(Math.random()*locked.length)];state.owned.push(prize.id);window.lastHeroPrize=prize.name}else{let prize=CARDS[Math.floor(Math.random()*CARDS.length)];state.fragments[prize.id]=(state.fragments[prize.id]||0)+3;window.lastHeroPrize='3 fragmentos de '+prize.name}}else window.lastHeroPrize='';sound(520,.3,'triangle',.09,450)}else{state.trophies=Math.max(0,state.trophies-10);state.coins+=40;sound(220,.4,'sawtooth',.08,-160)}save();document.getElementById('resultIcon').innerHTML=win?'<i class="fa-solid fa-trophy"></i>':'<i class="fa-solid fa-shield-halved"></i>';document.getElementById('resultTitle').textContent=win?'VITÓRIA!':'DERROTA';document.getElementById('resultText').textContent=win?'Você conquistou +30 de Axé de ranking e 150 moedas!'+(window.lastHeroPrize?' Herói ou prêmio: '+window.lastHeroPrize:''):'Você recebeu 40 moedas. Seu Axé de ranking diminuiu em 10.';document.getElementById('result').classList.add('show')}
updateWallet();renderRealms();

const REALM_THEMES=[
 ['#0a2636','#1a6773','#061d35','#075a75','#9beeff88','#3a9f9d','Conchas, marés e coral'],
 ['#0e2a22','#31583b','#081a1c','#315a46','#a0e3b788','#639b57','Raízes, cipós e folhas'],
 ['#242e3c','#586071','#131c2b','#374b5a','#c1d6e388','#9aa7ae','Ferro, brasas e forjas'],
 ['#2b2332','#66546d','#171723','#48415e','#e5c4ff88','#927e9b','Pedreiras e trovões'],
 ['#4a4539','#a79a79','#242b34','#9a9074','#fff5d588','#e1d5a2','Mármore, luz e altares'],
 ['#342446','#75527d','#1b1938','#674e85','#f9c6ff88','#a76fa7','Jardins e estrelas'],
 ['#292b35','#635b60','#141b27','#434956','#d3d0da88','#8b8a99','Ancestrais, velas e pedras']
];
function realmIndex(){return Math.max(0,REALMS.findIndex(r=>r[1]===currentRealm()[1]))}
function realmPalette(){return REALM_THEMES[realmIndex()]}
function drawRealmDecor(){let idx=realmIndex(),t=performance.now()*.001;ctx.save();for(let i=0;i<22;i++){let x=(i*67.31)%W,y=(i*113.7)%H;if(Math.abs(y-H*.5)<H*.09)continue;ctx.globalAlpha=.23+Math.sin(t*1.5+i)*.1;ctx.fillStyle=realmPalette()[5];ctx.beginPath();if(idx===0){ctx.arc(x,y,4+i%4,0,7)}else if(idx===1){ctx.ellipse(x,y,4,9,(i%5)*.7,0,7)}else if(idx===2){ctx.rect(x,y,5,5)}else if(idx===3){ctx.moveTo(x,y-8);ctx.lineTo(x+6,y+5);ctx.lineTo(x-6,y+5)}else if(idx===4){ctx.arc(x,y,2+i%3,0,7)}else if(idx===5){ctx.arc(x,y,3,0,7)}else{ctx.rect(x,y,3,8)}ctx.fill()}ctx.restore()}
function drawSanctuary(t,r){ctx.save();ctx.translate(t.x,t.y);ctx.fillStyle=t.side?'#a8e3f0':'#edb7b5';ctx.strokeStyle='#d9b87b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.55,r*.3);ctx.lineTo(-r*.35,-r*.25);ctx.lineTo(0,-r*.68);ctx.lineTo(r*.35,-r*.25);ctx.lineTo(r*.55,r*.3);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=realmPalette()[5];ctx.beginPath();ctx.arc(0,-r*.2,r*.22,0,7);ctx.fill();ctx.restore()}
function drawFighter(u,r){let id=u.card.id,t=u.walk,attack=u.attackPose>0,marine=u.entry>0,body=u.card.color;ctx.save();if(marine){ctx.fillStyle='#57d9ff88';ctx.beginPath();ctx.ellipse(0,r*.45,r*1.65,r*.58,0,0,7);ctx.fill();ctx.strokeStyle='#c1ffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,2,r*1.1,Math.PI,Math.PI*1.92);ctx.stroke()}
ctx.rotate(Math.sin(t)*.055);ctx.fillStyle='#182332';ctx.beginPath();ctx.ellipse(0,r*.14,r*.62,r*.9,0,0,7);ctx.fill();ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-r*.48,-r*.2);ctx.lineTo(r*.48,-r*.2);ctx.lineTo(r*.33,r*.56);ctx.lineTo(-r*.33,r*.56);ctx.closePath();ctx.fill();ctx.fillStyle='#d8b18e';ctx.beginPath();ctx.arc(0,-r*.52,r*.35,0,7);ctx.fill();ctx.fillStyle='#1a2632';ctx.fillRect(-r*.3,-r*.91,r*.6,r*.16);ctx.strokeStyle=body;ctx.lineWidth=r*.17;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-r*.34,0);ctx.lineTo(-r*.55,r*(attack?-.52:.24));ctx.moveTo(r*.34,0);ctx.lineTo(r*.62,r*(attack?-.65:.24));ctx.stroke();ctx.strokeStyle=id==='ogum'?'#f2f6fa':id==='flechas'||id==='oxossi'?'#bc945b':body;ctx.lineWidth=3;ctx.beginPath();if(u.card.type==='ranged'){ctx.moveTo(r*.55,-r*.2);ctx.lineTo(r*.9,-r*.6);ctx.lineTo(r*.65,-r*.95)}else{ctx.moveTo(r*.6,0);ctx.lineTo(r*.85,-r*(attack?1.3:.75))}ctx.stroke();if(attack){ctx.strokeStyle=body;ctx.globalAlpha=.8;ctx.lineWidth=3;ctx.beginPath();ctx.arc(r*.55,-r*.3,r*.55,-1.7,.5);ctx.stroke()}ctx.restore()}
function showSettings(){document.getElementById('optSound').checked=state.settings.sound!==false;document.getElementById('optFx').checked=state.settings.effects!==false;document.getElementById('optQuality').value=state.settings.quality||'alta'}
const baseShow=show;show=function(id){baseShow(id);if(id==='settings')showSettings();if(id==='shop')addMarketSections();if(id==='realms')decorateRealmList()};
function addMarketSections(){const root=document.querySelector('#shop .scroll');root.querySelectorAll('.premium-section').forEach(x=>x.remove());let gem=document.createElement('div');gem.className='premium-section';gem.innerHTML='<h3>◆ TESOURO DE CRISTAIS</h3><p class="small">Pacotes demonstrativos para testar a economia. Nenhuma cobrança real.</p><div class="premium-grid" id="crystalOffers"></div>';root.prepend(gem);for(let amount of [80,250,650,1500]){let el=document.createElement('div');el.className='premium-offer';el.innerHTML=`<b>◆ ${amount} cristais</b><small>Pacote de demonstração</small><button>SIMULAR RESGATE</button>`;el.querySelector('button').onclick=()=>{state.gems+=amount;save();updateWallet();sound(900,.16);toast('+'+amount+' cristais de demonstração')};gem.querySelector('#crystalOffers').append(el)}let mysteries=document.createElement('div');mysteries.className='premium-section';mysteries.innerHTML='<h3>✧ MISTÉRIOS SELADOS</h3><p class="small">Revele entidades, moedas ou essências. Probabilidades ilustrativas.</p><div class="premium-grid" id="mysteryOffers"></div>';gem.after(mysteries);for(let offer of [{n:'Mistério das Águas',price:300,cur:'coins',hero:.2},{n:'Mistério Ancestral',price:85,cur:'gems',hero:.55}]){let el=document.createElement('div');el.className='premium-offer';el.innerHTML=`<b>${offer.n}</b><small>Herói ou recompensa aleatória</small><button>${offer.price} ${offer.cur==='coins'?'●':'◆'}</button>`;el.querySelector('button').onclick=()=>revealMystery(offer);mysteries.querySelector('#mysteryOffers').append(el)}}
function revealMystery(offer){if(state[offer.cur]<offer.price)return toast('Saldo insuficiente');state[offer.cur]-=offer.price;let locked=CARDS.filter(c=>!state.owned.includes(c.id));let msg;if(locked.length&&Math.random()<offer.hero){let h=locked[Math.floor(Math.random()*locked.length)];state.owned.push(h.id);msg='ENTIDADE DESPERTA: '+h.name}else if(Math.random()<.5){let amt=100+Math.floor(Math.random()*300);state.coins+=amt;msg='REVELAÇÃO: +'+amt+' moedas'}else{let h=CARDS[Math.floor(Math.random()*CARDS.length)];state.fragments[h.id]=(state.fragments[h.id]||0)+5;msg='REVELAÇÃO: 5 essências de '+h.name}save();updateWallet();renderShop();addMarketSections();sound(760,.32,'triangle',.08,320);toast(msg)}
function decorateRealmList(){let rows=document.querySelectorAll('#realmList .realm');rows.forEach((el,i)=>{let key='realm'+i;if(el.dataset.decorated)return;el.dataset.decorated='1';let note=document.createElement('div');note.className='small';note.textContent=REALM_THEMES[i][6]+' · '+(i===0?'Corrente inicial': 'Novas entidades ao ascender');el.querySelector('div')?.append(note)})}
function checkRealmRewards(oldRealm){let now=realmIndex();for(let i=oldRealm+1;i<=now;i++){if(state.claimed.includes(i))continue;state.claimed.push(i);let pool=CARDS.filter(c=>!state.owned.includes(c.id));if(pool.length){let c=pool[Math.min(pool.length-1,(i*3)%pool.length)];state.owned.push(c.id);toast('NOVO REINO! Entidade recebida: '+c.name)}else{state.gems+=30;toast('NOVO REINO! +30 cristais')}}save()}
const previousFinish=finish;finish=function(win){let before=realmIndex();previousFinish(win);if(win)checkRealmRewards(before);updateWallet()};
const previousWallet=updateWallet;updateWallet=function(){previousWallet();let lobby=document.querySelector('.lobby-center');lobby.style.background=`radial-gradient(ellipse at center,${realmPalette()[1]}aa,transparent 75%)`;document.querySelector('.kingdom').style.filter=`hue-rotate(${realmIndex()*38}deg)`};
const previousBurst=burst;burst=function(x,y,color,n){if(state.settings.effects===false)return;previousBurst(x,y,color,state.settings.quality==='economica'?Math.ceil(n/2):n)};

/* V6: reino selecionável, adversário, arte das águas e invocação animada */
const WATER_ART='https://i.pinimg.com/736x/49/d4/d1/49d4d16d0fa42614462b59b5d709fdc6.jpg';
const waterImage=new Image();waterImage.crossOrigin='anonymous';waterImage.src=WATER_ART;
let chosenRealm=Math.min(Number(saved.chosenRealm||0),REALMS.length-1);
const baseRealmIndex=realmIndex;
realmIndex=function(){return Math.min(chosenRealm,baseRealmIndex())};
function unlockedRealmIndex(){let n=0;REALMS.forEach((r,i)=>{if(state.trophies>=r[3])n=i});return n}
function shiftRealm(step){let target=chosenRealm+step;if(target<0||target>=REALMS.length)return;if(target>unlockedRealmIndex()){toast('Reino selado: conquiste '+REALMS[target][3]+' de Axé para acessar');return}chosenRealm=target;state.chosenRealm=target;save();updateWallet();sound(530,.22,'triangle',.06,190)}
const walletV6=updateWallet;updateWallet=function(){walletV6();let max=unlockedRealmIndex();if(chosenRealm>max)chosenRealm=max;const r=REALMS[chosenRealm];document.querySelector('.kingdom-label').textContent='REINO DE '+r[1].toUpperCase();document.getElementById('realmProgress').innerHTML='<i class="fa-solid '+r[0]+'"></i> · PORTAL '+(chosenRealm+1)+' / 7';document.getElementById('realmDots').innerHTML=REALMS.map((x,i)=>'<span class="'+(i===chosenRealm?'current':'')+'" style="opacity:'+(i<=max?1:.23)+'"></span>').join('');document.getElementById('realmPrev').disabled=chosenRealm===0;document.getElementById('realmNext').disabled=chosenRealm===REALMS.length-1;document.querySelector('.lobby-info').innerHTML='<i class="fa-solid '+r[0]+'"></i> '+r[2]+'<div class="small">'+(chosenRealm===max?'Reino mais avançado da sua jornada':'Reino conquistado · selecione para batalhar')+'</div>';document.querySelector('.kingdom').style.filter='hue-rotate('+(chosenRealm*38)+'deg)';};
const originalCardEl=cardEl;cardEl=function(c,click,extra=''){let el=originalCardEl(c,click,extra);if(c.id==='mare'){const portrait=el.querySelector('.portrait');if(portrait){portrait.outerHTML='<img class="hero-art" src="'+WATER_ART+'" alt="Guardião das Marés" onerror="this.style.display=\'none\'">'}}return el};
const originalDrawFighter=drawFighter;drawFighter=function(u,r){if(u.card.id!=='mare'||!waterImage.complete||!waterImage.naturalWidth)return originalDrawFighter(u,r);ctx.save();let attack=u.attackPose>0;let bob=Math.sin(u.walk*1.7)*2;let scale=attack?1.2:1;ctx.translate(0,bob);ctx.rotate(Math.sin(u.walk)*.10+(attack?-.2:0));ctx.shadowColor='#6af4ff';ctx.shadowBlur=attack?23:10;ctx.beginPath();ctx.arc(0,0,r*1.05,0,Math.PI*2);ctx.clip();ctx.drawImage(waterImage,-r*1.08*scale,-r*1.3*scale,r*2.16*scale,r*2.6*scale);ctx.restore();if(u.entry>0){ctx.strokeStyle='#a7faff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*1.5,Math.PI*.3,Math.PI*1.8);ctx.stroke()}if(attack){ctx.strokeStyle='#8bffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*1.7,-1,1);ctx.stroke()}};
const oldShopRender=renderShop;renderShop=function(){oldShopRender();const root=document.querySelector('#shop .scroll');root.querySelectorAll('.hero-highlight').forEach(n=>n.remove());const hero=CARDS.find(c=>c.id==='mare');let card=document.createElement('div');card.className='hero-highlight';card.innerHTML='<img src="'+WATER_ART+'" alt="Guardião das Marés"><div><b>GUARDIÃO DAS MARÉS</b><p class="small">Povo d’Água · Atirador das marés · Avanço inicial em onda</p><button class="btn blue" id="waterBuy">'+(state.owned.includes('mare')?'NA SUA CORRENTE':'INVOCAR · 700 MOEDAS')+'</button></div>';root.prepend(card);card.querySelector('button').onclick=()=>{if(state.owned.includes('mare')){show('collection');return}if(state.coins<700){toast('Moedas insuficientes');return}state.coins-=700;state.owned.push('mare');save();renderShop();updateWallet();toast('Guardião das Marés incorporado ao acervo!')};};
const oldBattleStart=startBattle;startBattle=function(){const enemies=['Guardião das Marés','Sentinela do Cruzeiro','Vigia das Matas','Guardião da Pedreira','Filho da Corrente'];let name=enemies[chosenRealm%enemies.length];document.getElementById('enemyName').textContent=name;document.getElementById('enemyRank').textContent='Grau '+(chosenRealm+1)+' · Axé '+REALMS[chosenRealm][3];oldBattleStart()};
function showOpponent(){document.getElementById('opponentTitle').textContent=document.getElementById('enemyName').textContent;document.getElementById('opponentInfo').innerHTML='<i class="fa-solid fa-ranking-star"></i> '+document.getElementById('enemyRank').textContent+'<br><i class="fa-solid fa-dungeon"></i> '+REALMS[chosenRealm][1];document.getElementById('opponentModal').classList.add('show')}
const originalFinishV6=finish;finish=function(win){originalFinishV6(win);if(win){let max=unlockedRealmIndex();if(max>chosenRealm){toast('NOVO REINO DESBLOQUEADO! Use a seta no portal para visitar.')}}};
// Guardião das Marés liberado gratuitamente, inclusive para jornadas já salvas.
if(!state.owned.includes('mare')) state.owned.push('mare');
// Coloca na corrente ativa para ficar imediatamente disponível em batalha.
if(!state.deck.includes('mare')) state.deck[state.deck.length-1]='mare';
// Garante que a primeira corrente também tenha o personagem.
if(!state.decks[0].includes('mare')) state.decks[0][state.decks[0].length-1]='mare';
state.decks[activeDeck-1]=state.deck.slice();
save();


/* V8: os retratos passam a ser os combatentes visíveis na arena. */
const ART_HEROES={
 mare:{url:WATER_ART,name:'Guardião das Marés',role:'Povo d’Água · Atirador',kind:'water'},
 encantado:{url:'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/84f6d3c7-19b3-471c-99b3-ebe943ca814d/divi6ap-049223c3-4a84-4fee-8461-378f5ca36ea1.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi84NGY2ZDNjNy0xOWIzLTQ3MWMtOTliMy1lYmU5NDNjYTgxNGQvZGl2aTZhcC0wNDkyMjNjMy00YTg0LTRmZWUtODQ2MS0zNzhmNWNhMzZlYTEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.3CgdfGE9dGZLjI5IwsCL4u37tBiNl3y1D1hNhorsosk',name:'Encantado da Corrente',role:'Entidade · Atirador',kind:'magic'},
 guerreiroreal:{url:'https://www.freeiconspng.com/uploads/clash-royale-png-file-7.png',name:'Guerreiro do Cruzeiro',role:'Guerreiro · Corpo a corpo',kind:'warrior'}
};
CARDS.push({id:'encantado',name:'Encantado da Corrente',emoji:'fa-wand-magic-sparkles',cost:4,hp:440,dmg:76,range:112,speed:34,rate:1.08,type:'ranged',rarity:'epic',color:'#a9a1ff'});
CARDS.push({id:'guerreiroreal',name:'Guerreiro do Cruzeiro',emoji:'fa-shield-halved',cost:4,hp:790,dmg:110,range:27,speed:35,rate:1.18,type:'melee',rarity:'epic',color:'#f5bd76'});
const heroImages={};
for(const [id,meta] of Object.entries(ART_HEROES)){
 const img=new Image();img.referrerPolicy='no-referrer';img.src=meta.url;heroImages[id]=img;
}
// Atualiza todas as cartas, inclusive a mão de batalha, com a imagem do personagem.
const cardV8=cardEl;
cardEl=function(c,click,extra=''){
 const el=cardV8(c,click,extra),a=ART_HEROES[c.id];
 if(a){const old=el.querySelector('.portrait,.hero-art');const img=document.createElement('img');img.className='hero-art';img.alt=c.name;img.loading='eager';img.decoding='async';img.referrerPolicy='no-referrer';img.src=a.url;img.onerror=()=>{img.referrerPolicy='';img.onerror=()=>{el.classList.add('art-unavailable');img.style.opacity='.18'};img.src=a.url+'?retry=1'};if(old)old.replaceWith(img);else el.insertBefore(img,el.querySelector('.name'))}
 return el;
};
// Sprite animado a partir da arte original: corpo completo, flutuação,
// avanço, inclinação, impacto e energia; não substitui animação esquelética.
const fighterV8=drawFighter;
drawFighter=function(u,r){
 const a=ART_HEROES[u.card.id],img=heroImages[u.card.id];
 if(!a||!img||!img.complete||!img.naturalWidth)return fighterV8(u,r);
 const t=performance.now()/1000,attack=u.attackPose>0,entry=u.entry>0;
 const bob=Math.sin(t*7+u.walk)*1.8,tilt=Math.sin(t*5+u.walk)*.055+(attack?.19:0);
 const facing=u.side===1?-1:1,scale=attack?1.12:1;
 ctx.save();ctx.translate(0,bob-(attack?3:0));ctx.rotate(tilt*facing);
 if(entry){ctx.shadowColor='#62eeff';ctx.shadowBlur=23;ctx.fillStyle='#5de7ff70';ctx.beginPath();ctx.ellipse(0,r*.68,r*1.55,r*.5,0,0,Math.PI*2);ctx.fill()}
 ctx.shadowColor=u.card.color;ctx.shadowBlur=attack?24:9;
 // A figura original ocupa o espaço do lutador em vez de um boneco genérico.
 const h=r*3.15*scale,w=h*(img.naturalWidth/img.naturalHeight);
 const maxW=r*2.5*scale;const finalW=Math.min(w,maxW);
 ctx.drawImage(img,-finalW/2,-h*.79,finalW,h);
 ctx.shadowBlur=0;
 if(attack){ctx.strokeStyle=u.card.color;ctx.lineWidth=3;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(facing*r*.75,-r*.2,r*.9,-.8,1.25);ctx.stroke()}
 ctx.restore();
};
// Mantém o Guardião liberado e disponibiliza os dois novos heróis para testes.
for(const id of ['mare','encantado','guerreiroreal'])if(!state.owned.includes(id))state.owned.push(id);
// Prepara uma corrente com os três personagens visíveis em batalha.
for(const id of ['mare','encantado','guerreiroreal'])if(!state.deck.includes(id)){
 const replace=state.deck.findIndex(x=>!ART_HEROES[x]);if(replace>=0)state.deck[replace]=id;
}
state.decks[activeDeck-1]=state.deck.slice();save();
// Vitrine com os três personagens e status de disponibilidade das artes.
const shopV8=renderShop;
renderShop=function(){shopV8();const root=document.querySelector('#shop .scroll');
 root.querySelectorAll('.art-v8-showcase').forEach(e=>e.remove());
 const showcase=document.createElement('div');showcase.className='art-v8-showcase';
 showcase.innerHTML='<div class="section">ENTIDADES ILUSTRADAS · PRONTAS PARA BATALHA</div>';
 for(const [id,a] of Object.entries(ART_HEROES)){
  const c=CARDS.find(c=>c.id===id),item=document.createElement('div');item.className='art-v8-item';
  item.innerHTML='<img alt="'+c.name+'" referrerpolicy="no-referrer" src="'+a.url+'"><div><b>'+c.name+'</b><small>'+a.role+'</small><small>Disponível na sua Corrente</small></div><i class="fa-solid fa-check-circle"></i>';
  showcase.append(item)
 }root.prepend(showcase)
};


/* V9: cada combatente tem ritmo, pose e aura conforme sua origem. */
const fighterV9=drawFighter;
drawFighter=function(u,r){
 const style=fighterStyle(u),t=u.walk,atk=u.attackPose>0;
 ctx.save();
 if(style.walk==='surf'){ctx.translate(0,Math.sin(t*1.5)*r*.17);ctx.strokeStyle='#77eaff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,r*.7,r*1.4,r*.38,Math.sin(t)*.1,0,Math.PI*2);ctx.stroke()}
 else if(style.walk==='float'||style.walk==='wind'){ctx.translate(Math.sin(t)*r*.09,Math.cos(t)*r*.19);if(style.walk==='wind'){ctx.strokeStyle='#d5baff99';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,r*(1.2+i*.2),t+i,t+i+1);ctx.stroke()}}}
 else if(style.walk==='heavy'||style.walk==='march'){ctx.translate(0,Math.abs(Math.sin(t))*r*.08);if(style.walk==='heavy'&&Math.sin(t)>.93)burst(u.x,u.y+r*.8,'#e5b96a',1)}
 else if(style.walk==='stalk'){ctx.translate(Math.sin(t)*r*.1,-Math.abs(Math.sin(t))*r*.12)}
 else if(style.walk==='charge'){ctx.rotate(Math.sin(t)*.08)}
 else if(style.walk==='slow'){ctx.translate(0,Math.sin(t)*r*.06)}
 if(atk){ctx.rotate(style.attack==='arrow'||style.attack==='multishot'?-.13:style.attack==='cleave'?.24:-.08);ctx.scale(1.10,1.10)}
 fighterV9(u,r);
 if(atk){ctx.strokeStyle=u.card.color;ctx.shadowColor=u.card.color;ctx.shadowBlur=14;ctx.lineWidth=3;ctx.beginPath();if(['arrow','multishot','arcane','tide','leaf','blessing'].includes(style.attack)){ctx.moveTo(r*.25,-r*.4);ctx.lineTo(r*1.8,-r*.8)}else{ctx.arc(0,0,r*1.45,-1.1,.8)}ctx.stroke();ctx.shadowBlur=0}
 ctx.restore();
};
// Identidade de combate consultável no Acervo e na Corrente.
const originalCardV9=cardEl;
cardEl=function(c,click,extra=''){
 const el=originalCardV9(c,click,extra),style=HERO_STYLES[c.id];
 if(style){el.title=c.name+' — '+style.ability+' | '+style.desc;el.setAttribute('aria-label',el.title)}
 return el;
};


/* V10 — duas novas figuras com sprites próprios e habilidades individuais. */
const NOVOS_GUERREIROS=[
 {id:'feiticeira_noturna',name:'Feiticeira da Noite',emoji:'fa-moon',cost:5,hp:470,dmg:91,range:122,speed:29,rate:1.35,type:'ranged',rarity:'legend',color:'#b18aff',url:'https://clashofclans.wiki.gg/es/images/Night_Witch_info.png?5e2c71',role:'Feitiçaria noturna · Ataque espiritual',kind:'magic',walk:'float',attack:'arcane',ability:'Sombras da Noite',desc:'Flutua e lança energia violeta que alcança outro inimigo.'},
 {id:'cavaleiro_javali',name:'Cavaleiro do Javali',emoji:'fa-horse',cost:4,hp:920,dmg:128,range:27,speed:48,rate:1.25,type:'melee',rarity:'epic',color:'#ffb56c',url:'https://freepngimg.com/thumb/clash_of_clans/93496-toy-clash-of-pig-figurine-royale-clans.png',role:'Montaria de guerra · Investida',kind:'warrior',walk:'charge',attack:'cleave',ability:'Investida da Montaria',desc:'Corre montado e desfere golpes de impacto em área.'}
];
for(const hero of NOVOS_GUERREIROS){
 const {url,role,kind,walk,attack,ability,desc,...card}=hero;
 if(!CARDS.some(c=>c.id===hero.id))CARDS.push(card);
 ART_HEROES[hero.id]={url,name:hero.name,role,kind};
 HERO_STYLES[hero.id]={walk,attack,ability,desc};
 const img=new Image();img.referrerPolicy='no-referrer';img.src=url;heroImages[hero.id]=img;
 if(!state.owned.includes(hero.id))state.owned.push(hero.id);
}
// Disponibiliza as duas figuras imediatamente na corrente ativa, inclusive em saves antigos.
for(const hero of NOVOS_GUERREIROS){
 if(!state.deck.includes(hero.id)){
  const replace=state.deck.findIndex(id=>!NOVOS_GUERREIROS.some(h=>h.id===id)&&!['mare','encantado','guerreiroreal'].includes(id));
  if(replace>=0)state.deck[replace]=hero.id;
 }
}
state.decks[activeDeck-1]=state.deck.slice();save();

updateWallet();

/* V11 — Heróis oficiais: artes, identidade cromática e habilidades. */
const HEROES_V11=[
 {id:'flechas',name:'Sete Flechas',url:'https://i.ibb.co/Q3f6Wwpf/image-removebg-preview.png',role:'Caboclos · Atirador',kind:'forest',color:'#4fe18b',walk:'stalk',attack:'multishot',ability:'Rajada das Sete Flechas',desc:'Dispara flechas verdes; o segundo disparo busca outro adversário.',cost:3,hp:345,dmg:73,range:153,speed:39,rate:1.03,type:'ranged',rarity:'epic'},
 {id:'ogum',name:'Ogum de Ronda',url:'https://i.ibb.co/dwcnDxS1/188c60cd-cc68-4e7a-86d7-a58c95cee7de-removebg-preview.png',role:'Linha de Ogum · Guerreiro',kind:'iron',color:'#ffb75e',walk:'march',attack:'cleave',ability:'Ronda de Ferro',desc:'Marcha firme e executa um golpe de espada que atinge inimigos próximos.',cost:4,hp:780,dmg:112,range:27,speed:33,rate:1.16,type:'melee',rarity:'epic'},
 {id:'marinheiro',name:'João do Mar',url:'https://i.ibb.co/YFHjzYky/image-removebg-preview-1.png',role:'Marinheiros · Povo d’Água',kind:'water',color:'#54d9ff',walk:'surf',attack:'splash',ability:'Onda de Chegada',desc:'Surfa uma onda e recebe aceleração apenas nos primeiros segundos; depois combate normalmente.',cost:3,hp:650,dmg:72,range:27,speed:29,rate:1.25,type:'melee',rarity:''},
 {id:'boiadeiro',name:'Zé do Laço',url:'https://i.ibb.co/4gT6MmvG/dbce0b2f-78aa-4c83-8f91-3256dc560fc7-removebg-preview.png',role:'Boiadeiros · Controle',kind:'earth',color:'#f0ad64',walk:'charge',attack:'lasso',ability:'Laço de Sete Voltas',desc:'Arremessa um laço dourado que desacelera o adversário por alguns segundos.',cost:4,hp:810,dmg:78,range:88,speed:34,rate:1.35,type:'ranged',rarity:'epic'},
 {id:'jurema',name:'Jurema',url:'https://i.ibb.co/ymZ4Lswf/44f8d45d-4cf1-48e7-960d-e3421488515d-removebg-preview.png',role:'Caboclos · Suporte',kind:'forest',color:'#85f09b',walk:'stalk',attack:'leaf',ability:'Folhas de Cura',desc:'Emite partículas de folhas e recupera periodicamente a vida dos aliados próximos.',cost:4,hp:410,dmg:42,range:108,speed:32,rate:1.28,type:'ranged',rarity:'epic'}
];
for(const hero of HEROES_V11){
 const c=CARDS.find(c=>c.id===hero.id);
 const {url,role,kind,walk,attack,ability,desc,...stats}=hero;
 if(c)Object.assign(c,stats);else CARDS.push(stats);
 ART_HEROES[hero.id]={url,name:hero.name,role,kind};
 HERO_STYLES[hero.id]={walk,attack,ability,desc};
 const im=new Image();im.referrerPolicy='no-referrer';im.src=url;heroImages[hero.id]=im;
 if(!state.owned.includes(hero.id))state.owned.push(hero.id);
}
// Corrige correntes antigas para preservar os novos nomes e garantir que todos
// possam ser testados. Não remove cartas adquiridas do acervo.
const officialIds=HEROES_V11.map(h=>h.id);
for(const id of officialIds){
 if(!state.deck.includes(id)){
  let idx=state.deck.findIndex(x=>!officialIds.includes(x));
  if(idx>=0)state.deck[idx]=id;
 }
}
state.decks[activeDeck-1]=state.deck.slice();
// O inimigo também pode receber estes personagens e suas artes.
const updateV11Base=update;
update=function(dt){
 updateV11Base(dt);
 if(!gameOn)return;
 for(const u of units){
  if(u.dead||u.card.id!=='jurema')continue;
  u.healCooldown=(u.healCooldown??0.5)-dt;
  if(u.healCooldown>0)continue;
  u.healCooldown=2.4;
  const friends=units.filter(v=>!v.dead&&v.side===u.side&&v.hp<v.max&&Math.hypot(v.x-u.x,v.y-u.y)<W*.31);
  friends.sort((a,b)=>a.hp/a.max-b.hp/b.max);
  for(const v of friends.slice(0,2)){
   v.hp=Math.min(v.max,v.hp+64*(1+.12*((state.levels.jurema||1)-1)));
   burst(v.x,v.y,'#8dffa7',10);
  }
  if(friends.length)sound(680,.12,'sine',.022,200);
 }
};
const attackV11Base=applyHeroAttack;
applyHeroAttack=function(u,t){
 attackV11Base(u,t);
 if(u.card.id==='boiadeiro'){
  t.slowTimer=Math.max(t.slowTimer||0,3.4);
  burst(t.x,t.y,'#f6bd74',12);
 }
 if(u.card.id==='flechas')burst(t.x,t.y,'#61f39d',8);
 if(u.card.id==='ogum')burst(t.x,t.y,'#ffb457',13);
 if(u.card.id==='marinheiro')burst(t.x,t.y,'#65dfff',13);
};
// Animação 2D das imagens estáticas: cada classe tem ritmo e aura diferentes.
// Não é animação esquelética; preserva a arte enviada e movimenta o sprite inteiro.
const drawV11Base=drawFighter;
drawFighter=function(u,r){
 const id=u.card.id;
 if(!officialIds.includes(id))return drawV11Base(u,r);
 const im=heroImages[id];
 if(!im||!im.complete||!im.naturalWidth)return drawV11Base(u,r);
 const a=u.attackPose>0,phase=u.walk,dir=u.side===1?-1:1;
 ctx.save();
 if(id==='flechas'){
  ctx.translate(Math.sin(phase)*r*.08,-Math.abs(Math.sin(phase))*r*.12);
  if(a)ctx.rotate(-.18*dir);
 }else if(id==='ogum'){
  ctx.translate(0,Math.abs(Math.sin(phase))*r*.075);
  if(a)ctx.rotate(.24*dir);
 }else if(id==='marinheiro'){
  ctx.translate(Math.sin(phase*.7)*r*.12,Math.cos(phase)*r*.14);
  if(u.entry>0){ctx.strokeStyle='#8efaff';ctx.lineWidth=4;ctx.shadowColor='#53dfff';ctx.shadowBlur=15;ctx.beginPath();ctx.ellipse(0,r*.7,r*1.5,r*.4,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0}
  if(a)ctx.rotate(-.12*dir);
 }else if(id==='boiadeiro'){
  ctx.rotate(Math.sin(phase)*.055+(a?.12*dir:0));
  if(a){ctx.strokeStyle='#f3bf7b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(r*.55,-r*.55,r*1.1,0,Math.PI*1.6);ctx.stroke()}
 }else if(id==='jurema'){
  ctx.translate(Math.sin(phase)*r*.06,Math.sin(phase*.65)*r*.07);
  ctx.strokeStyle='#75ec91';ctx.globalAlpha=.45;ctx.beginPath();ctx.arc(0,-r*.3,r*1.15,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
  if(a)ctx.rotate(-.07*dir);
 }
 ctx.shadowColor=u.card.color;ctx.shadowBlur=a?21:6;
 const h=r*(id==='boiadeiro'?3.7:3.55)*(a?1.08:1);
 const w=Math.min(h*im.naturalWidth/im.naturalHeight,r*3.55);
 ctx.drawImage(im,-w/2,-h*.79,w,h);
 ctx.restore();
};
// Na loja, mostra também os cinco retratos e a descrição das habilidades.
const renderShopV11Base=renderShop;
renderShop=function(){
 renderShopV11Base();
 const root=document.querySelector('#shop .scroll');
 root.querySelector('.official-heroes-v11')?.remove();
 const sec=document.createElement('div');sec.className='official-heroes-v11';
 sec.innerHTML='<div class="section"><i class="fa-solid fa-wand-magic-sparkles"></i> HERÓIS OFICIAIS · PODERES E MAGIAS</div>';
 for(const hero of HEROES_V11){
  const item=document.createElement('div');item.className='art-v8-item';
  item.innerHTML=`<img src="${hero.url}" alt="${hero.name}" referrerpolicy="no-referrer"><div><b>${hero.name}</b><small>${hero.role}</small><small style="color:${hero.color}">${hero.ability}</small><small>${hero.desc}</small></div><i class="fa-solid fa-check-circle" title="Desbloqueado"></i>`;
  sec.append(item);
 }
 root.prepend(sec);
};
// Deixa o acervo atualizado com os nomes e retratos recém-integrados.
try{save();updateWallet()}catch(e){console.warn('Falha ao salvar progresso',e)}


/* V12: projéteis coerentes com a arma e origem de cada entidade. */
function drawPowerProjectile(p){
 const t=p.target,ang=Math.atan2((t?.y??p.y)-p.y,(t?.x??p.x)-p.x);
 const size=Math.max(5,W*.015);
 ctx.save();ctx.translate(p.x,p.y);ctx.rotate(ang);
 ctx.lineCap='round';ctx.lineJoin='round';
 if(p.kind==='arrow'){
  ctx.shadowBlur=7;ctx.shadowColor='#64ed93';ctx.strokeStyle='#b99257';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-size*2.7,0);ctx.lineTo(size*2.3,0);ctx.stroke();
  ctx.fillStyle='#dce9e3';ctx.beginPath();ctx.moveTo(size*3.4,0);ctx.lineTo(size*1.5,-size*.75);ctx.lineTo(size*1.5,size*.75);ctx.closePath();ctx.fill();
  ctx.fillStyle='#45df83';for(const sign of [-1,1]){ctx.beginPath();ctx.moveTo(-size*2.7,0);ctx.lineTo(-size*3.8,sign*size*.95);ctx.lineTo(-size*.9,sign*size*.35);ctx.closePath();ctx.fill()}
 }else if(p.kind==='fire'){
  ctx.shadowBlur=22;ctx.shadowColor='#ff650a';for(let i=0;i<3;i++){ctx.fillStyle=['#ff4b15','#ffb02c','#fff0a0'][i];ctx.beginPath();ctx.ellipse(-size*(1.5-i*.4),0,size*(2.4-i*.6),size*(1.15-i*.28),0,0,7);ctx.fill()}
  ctx.fillStyle='#ff5c20';ctx.beginPath();ctx.moveTo(-size*3.4,-size*.5);ctx.lineTo(-size*5.5,0);ctx.lineTo(-size*3.4,size*.5);ctx.fill();
 }else if(p.kind==='water'){
  ctx.shadowBlur=16;ctx.shadowColor='#55dfff';ctx.fillStyle='#3cbef0';ctx.beginPath();ctx.ellipse(0,0,size*2.3,size*.85,0,0,7);ctx.fill();ctx.strokeStyle='#c4ffff';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-size*3,size*.2);ctx.quadraticCurveTo(-size,-size*1.8,size*1.8,-size*.15);ctx.stroke();
 }else if(p.kind==='lasso'){
  ctx.strokeStyle='#efbd77';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(size*.6,0,size*1.65,size*1.05,-.3,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(-size*3,0);ctx.lineTo(-size*.9,0);ctx.stroke();
 }else if(p.kind==='leaf'){
  ctx.shadowBlur=11;ctx.shadowColor='#54ef83';ctx.fillStyle='#74e994';ctx.beginPath();ctx.ellipse(0,0,size*1.8,size*.65,-.3,0,7);ctx.fill();ctx.strokeStyle='#d4ffd9';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-size*1.5,0);ctx.lineTo(size*1.5,0);ctx.stroke();
 }else if(p.kind==='lightning'){
  ctx.shadowBlur=16;ctx.shadowColor='#ffe36b';ctx.strokeStyle='#fff3a1';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-size*3,-size);ctx.lineTo(-size*.7,size*.7);ctx.lineTo(size*.1,-size*.8);ctx.lineTo(size*2.5,size*.5);ctx.stroke();
 }else if(p.kind==='wind'){
  ctx.strokeStyle='#e9caff';ctx.lineWidth=3;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-size*2.5,i*size*.65);ctx.quadraticCurveTo(0,i*size*1.4,size*2.5,i*size*.5);ctx.stroke()}
 }else{
  ctx.shadowBlur=16;ctx.shadowColor=p.color;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(0,0,size,0,7);ctx.fill();
 }
 ctx.restore();
}

/* V13 — orientação dinâmica das entidades no campo de batalha.
   Espelha o sprite no eixo horizontal quando o alvo está atrás,
   sem modificar a imagem original nem a direção dos projéteis. */
const drawFacingBaseV13=drawFighter;
const naturalFacingV13={flechas:1,ogum:1,marinheiro:1,boiadeiro:1,jurema:1};
drawFighter=function(u,r){
  let target=targetFor(u);
  // Evita alternância nervosa ao cruzar o mesmo eixo horizontal.
  const dx=target?target.x-u.x:0;
  if(Math.abs(dx)>Math.max(5,r*.28))u.visualFacing=dx>0?1:-1;
  else if(u.visualFacing===undefined)u.visualFacing=u.lane===0?1:-1;
  const imageDefault=naturalFacingV13[u.card.id]||1;
  ctx.save();
  ctx.scale(u.visualFacing===imageDefault?1:-1,1);
  drawFacingBaseV13(u,r);
  ctx.restore();
};

/* V14 — paisagens vivas, trilha sintetizada e identidade sonora */
let ambienceClock=0, battleMusicClock=0, battleVisualClock=0, battleAudioActive=false;
const sceneSeeds=Array.from({length:54},(_,i)=>({x:(i*0.61803398875)%1,y:(i*0.371239)%1,phase:i*1.7,size:2+(i%5)}));
function ambientLayer(){
 const k=realmIndex(),t=battleVisualClock;
 ctx.save();
 // Decoração de fundo nos limites do campo, sem esconder os combatentes.
 if(k===1){
  // Troncos e cipós nas laterais do Reino das Matas.
  for(let side of [0,1])for(let j=0;j<5;j++){
   let x=side?W-8:8,y=H*(.09+j*.20);ctx.strokeStyle='#284a2b';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x,y-45);ctx.quadraticCurveTo(x+(side?-17:17),y,x,y+48);ctx.stroke();
   ctx.strokeStyle='#60975d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-30);ctx.quadraticCurveTo(x+(side?-32:32),y-2,x+(side?-18:18),y+22);ctx.stroke();
  }
  // Folhas em queda com oscilação lateral.
  sceneSeeds.forEach((p,i)=>{let x=(p.x*W+Math.sin(t*1.5+p.phase)*20+W)%W,y=((p.y*H+t*(12+p.size*3))%(H+30))-15;ctx.save();ctx.translate(x,y);ctx.rotate(t*1.8+p.phase);ctx.fillStyle=['#83bd5b','#c9a257','#548b48','#b0c96b'][i%4];ctx.beginPath();ctx.ellipse(0,0,p.size*.8,p.size*1.7,.4,0,7);ctx.fill();ctx.restore()});
  // Pássaros sobrevoando a parte alta da mata.
  for(let i=0;i<5;i++){let x=((t*(17+i*6)+i*W*.29)%(W+70))-35,y=H*(.10+i*.07)+Math.sin(t*2+i)*9;ctx.strokeStyle='#d4e9c2bb';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-9,y);ctx.quadraticCurveTo(x-4,y-8,x,y);ctx.quadraticCurveTo(x+4,y-8,x+9,y);ctx.stroke()}
 }else if(k===0){
  // Bolhas, conchas e cardumes do Reino das Águas.
  sceneSeeds.forEach((p,i)=>{let x=p.x*W+Math.sin(t+p.phase)*7,y=H-((p.y*H+t*(9+p.size*2))%(H+20));ctx.strokeStyle='#a5f4f4aa';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,p.size*.65,0,7);ctx.stroke()});
  for(let i=0;i<5;i++){let x=((t*18+i*89)%(W+45))-20,y=H*(.16+i*.16);ctx.fillStyle='#80d5d4aa';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-10,y-5);ctx.lineTo(x-10,y+5);ctx.closePath();ctx.fill()}
 }else if(k===2){
  // Forja: brasas ascendentes, engrenagens e metal incandescente.
  sceneSeeds.forEach((p,i)=>{let x=p.x*W,y=H-((p.y*H+t*(14+p.size*5))%H);ctx.globalAlpha=.45+.3*Math.sin(t*3+i);ctx.fillStyle=i%3?'#ef863d':'#ffcc72';ctx.fillRect(x,y,p.size*.55,p.size*1.2)});ctx.globalAlpha=1;
  for(let i=0;i<4;i++){let x=i%2?W-14:14,y=H*(.16+Math.floor(i/2)*.65);ctx.strokeStyle='#a7a9a8aa';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.stroke();for(let n=0;n<8;n++){let a=t*.3+n*Math.PI/4;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*13,y+Math.sin(a)*13);ctx.lineTo(x+Math.cos(a)*18,y+Math.sin(a)*18);ctx.stroke()}}
 }else if(k===3){
  // Pedreiras e relâmpagos intermitentes.
  for(let i=0;i<9;i++){let x=(i*.13*W)%W,y=H*(i%2?.89:.13);ctx.fillStyle='#80788c88';ctx.beginPath();ctx.moveTo(x-16,y+15);ctx.lineTo(x,y-13);ctx.lineTo(x+18,y+15);ctx.fill()}
  if(Math.sin(t*1.3)> .985){ctx.strokeStyle='#f7e5ff';ctx.lineWidth=2;ctx.shadowBlur=15;ctx.shadowColor='#e8aaff';ctx.beginPath();ctx.moveTo(W*.7,0);ctx.lineTo(W*.63,H*.12);ctx.lineTo(W*.71,H*.16);ctx.lineTo(W*.61,H*.30);ctx.stroke()}
 }else if(k===4){
  // Raios de luz e partículas douradas.
  for(let i=0;i<7;i++){let x=W*(i+.5)/7;ctx.fillStyle='#fff1bb12';ctx.beginPath();ctx.moveTo(x-8,0);ctx.lineTo(x+8,0);ctx.lineTo(x+48,H);ctx.lineTo(x-35,H);ctx.fill()}
  sceneSeeds.forEach((p,i)=>{ctx.fillStyle='#fff3c9aa';ctx.beginPath();ctx.arc(p.x*W,p.y*H+Math.sin(t+i)*5,1.2+i%3,0,7);ctx.fill()});
 }else if(k===5){
  // Borboletas, estrelas e pétalas do Jardim dos Erês.
  sceneSeeds.forEach((p,i)=>{let x=p.x*W+Math.sin(t*1.8+i)*12,y=(p.y*H+t*(8+i%5))%H;ctx.fillStyle=['#ffb8e1','#e8d483','#bbadf8'][i%3];ctx.beginPath();ctx.ellipse(x-3,y,3,5,.6,0,7);ctx.ellipse(x+3,y,3,5,-.6,0,7);ctx.fill()});
 }else{
  // Velas, fumaça e pontos de luz do Vale dos Ancestrais.
  for(let i=0;i<8;i++){let x=i%2?W-14:14,y=H*(.08+Math.floor(i/2)*.25);ctx.fillStyle='#e1d3b0';ctx.fillRect(x-3,y,6,14);ctx.fillStyle='#ffd787';ctx.beginPath();ctx.ellipse(x,y-4,2.5,6,0,0,7);ctx.fill();ctx.strokeStyle='#d4d3dc55';ctx.beginPath();ctx.moveTo(x,y-10);ctx.quadraticCurveTo(x+Math.sin(t+i)*9,y-22,x+Math.sin(t*.8+i)*13,y-38);ctx.stroke()}
 }
 ctx.restore();
}
const v14DrawBase=draw;
draw=function(){v14DrawBase();ambientLayer()};
const v14UpdateBase=update;
update=function(dt){battleVisualClock+=dt;v14UpdateBase(dt);if(gameOn){battleMusicClock-=dt;if(battleMusicClock<=0){battleMusicClock=.31;musicBeat()}}};
function tone(freq,dur=.13,vol=.025,kind='sine',delay=0){if(!state.settings.sound)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();const t=audioCtx.currentTime+delay,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=kind;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+.009);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+dur+.01)}catch(e){}}
let beatCount=0;
function musicBeat(){if(!state.settings.sound)return;const idx=realmIndex(),base=[146.83,164.81,130.81,155.56,174.61,196,110][idx];let n=beatCount++;tone(base*(n%8===0?1:.5),.16,.018,'triangle');if(n%2===0)tone(65,.085,.014,'sine');if(n%4===2)tone(base*2,.1,.009,'triangle');if(n%8===7)tone(base*1.5,.2,.014,'sine')}
function heroSfx(u){if(!state.settings.sound)return;const id=u.card.id;const soundMap={flechas:[760,.12,'triangle'],ogum:[135,.19,'sawtooth'],marinheiro:[470,.26,'sine'],boiadeiro:[245,.18,'triangle'],jurema:[680,.3,'sine'],tranca:[185,.25,'sawtooth'],xango:[115,.29,'sawtooth'],iansa:[570,.2,'triangle'],pai:[520,.32,'sine'],iemanja:[410,.28,'sine'],oxossi:[790,.12,'triangle']};let [f,d,w]=soundMap[id]||[360,.12,'triangle'];tone(f,d,.035,w);if(id==='flechas'||id==='oxossi')tone(f*1.4,.065,.016,'triangle',.045);if(id==='marinheiro'||id==='iemanja')tone(f*.65,.2,.013,'sine',.04);if(id==='ogum'||id==='tranca')tone(f*.5,.16,.018,'sawtooth',.07)}
const v14SpawnBase=spawn;
spawn=function(card,side,x,y){v14SpawnBase(card,side,x,y);if(side===1)tone(420+card.cost*60,.18,.025,'triangle')};
// Acompanha a execução dos ataques reais para tocar sons de cada entidade.
const v14ApplyAttackBase=applyHeroAttack;
applyHeroAttack=function(u,t){v14ApplyAttackBase(u,t);if(u.side===1||Math.random()<.24)heroSfx(u)};
const v14StartBase=startBattle;
startBattle=function(){battleVisualClock=0;battleMusicClock=0;beatCount=0;v14StartBase();tone(293.66,.28,.06,'triangle');tone(440,.38,.04,'triangle',.12)};
const v14LeaveBase=leaveBattle;
leaveBattle=function(){battleMusicClock=999;v14LeaveBase()};
const v14FinishBase=finish;
finish=function(win){if(ending)return;v14FinishBase(win);battleMusicClock=999;const modal=document.querySelector('#result .modal');modal.classList.remove('v14-win','v14-loss');void modal.offsetWidth;modal.classList.add(win?'v14-win':'v14-loss');const icon=document.getElementById('resultIcon');icon.classList.add(win?'v14-crown':'v14-defeat');setTimeout(()=>icon.classList.remove('v14-crown','v14-defeat'),2500);if(state.settings.sound){const melody=win?[392,493.88,587.33,783.99,987.77]:[330,293.66,246.94,164.81];melody.forEach((n,i)=>tone(n,.29,.052,win?'triangle':'sine',i*.17))}};

/* V15 — reparo de áudio para navegadores móveis */
let axeMaster=null,axeAudioReady=false;
function axeAudioUnlock(){
  try{
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(!axeMaster){
      axeMaster=audioCtx.createGain();
      axeMaster.gain.value=.78;
      axeMaster.connect(audioCtx.destination);
    }
    const promise=audioCtx.resume();
    if(promise&&promise.then)promise.then(()=>{axeAudioReady=audioCtx.state==='running';}).catch(()=>{});
    axeAudioReady=audioCtx.state==='running';
    return true;
  }catch(e){console.warn('Áudio indisponível',e);return false}
}
function axeVolume(){return Number(state.settings.volume??85)/100}
tone=function(freq,dur=.13,vol=.025,kind='sine',delay=0){
  if(state.settings.sound===false)return;
  if(!axeAudioUnlock())return;
  try{
    const t=audioCtx.currentTime+Math.max(0,delay);
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type=kind;
    o.frequency.setValueAtTime(Math.max(35,freq),t);
    const v=Math.max(.0002,Math.min(.28,vol*3.4*axeVolume()));
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(v,t+.012);
    g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.045,dur));
    o.connect(g);g.connect(axeMaster);
    o.start(t);o.stop(t+Math.max(.05,dur)+.02);
  }catch(e){console.warn('Falha no som',e)}
};
sound=function(freq=400,dur=.1,wave='sine',volume=.06,slide=0){
  if(state.settings.sound===false||!axeAudioUnlock())return;
  try{
    const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type=wave;o.frequency.setValueAtTime(Math.max(35,freq),t);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(35,freq+slide),t+dur);
    g.gain.setValueAtTime(Math.max(.0002,Math.min(.28,volume*2.2*axeVolume())),t);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(axeMaster);o.start(t);o.stop(t+dur+.02);
  }catch(e){console.warn('Falha no efeito sonoro',e)}
};
function axeTestSound(){
  state.settings.sound=true;soundOn=true;
  const cb=document.getElementById('optSound');if(cb)cb.checked=true;
  axeAudioUnlock();save();
  [392,523.25,659.25,783.99].forEach((f,i)=>tone(f,.3,.08,'triangle',i*.19));
  toast('Teste de som iniciado — aumente o volume do aparelho');
}
document.addEventListener('pointerdown',axeAudioUnlock,{capture:true});
document.addEventListener('touchstart',axeAudioUnlock,{capture:true,passive:true});
document.addEventListener('keydown',axeAudioUnlock,{capture:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&gameOn)axeAudioUnlock()});
const axeStartPrevious=startBattle;
startBattle=function(){axeAudioUnlock();axeStartPrevious();tone(440,.35,.10,'triangle');tone(587.33,.4,.08,'triangle',.15)};
const axeSettings=document.querySelector('#settings .scroll');
if(axeSettings){
 const audioPanel=document.createElement('div');
 audioPanel.className='premium-section';
 audioPanel.innerHTML='<h3><i class="fa-solid fa-volume-high"></i> ÁUDIO DO JOGO</h3><p class="small">Toque em TESTAR SOM para liberar o áudio no navegador do celular.</p><div class="settings-row"><label for="axeVolumeControl">Volume geral</label><input id="axeVolumeControl" type="range" min="0" max="100" step="5" style="width:48%" value="'+(state.settings.volume??85)+'"></div><button type="button" class="btn primary" style="width:100%;font-size:14px;margin-top:12px" onclick="axeTestSound()"><i class="fa-solid fa-volume-high"></i> TESTAR SOM</button><p class="small" style="margin-top:10px">Ative “Efeitos sonoros” acima. Se estiver no silencioso, ajuste também o volume de mídia do aparelho.</p>';
 axeSettings.prepend(audioPanel);
 audioPanel.querySelector('#axeVolumeControl').addEventListener('input',e=>{state.settings.volume=Number(e.target.value);save()});
}

/* V16 — avanço territorial, efeitos de impacto e percussão de batalha */
function canDeployHere(side,x,y){
  const lane=x<W/2?0:1, bridge=H*.5;
  if(side===1){
    if(y>=bridge+H*.045)return true;
    return y>=H*.12&&y<bridge+H*.045&&towers.some(t=>t.side===0&&t.lane===lane&&!t.alive);
  }
  if(y<=bridge-H*.045)return true;
  return y<=H*.88&&y>bridge-H*.045&&towers.some(t=>t.side===1&&t.lane===lane&&!t.alive);
}
function drawDeployZone(){
  ctx.save();ctx.fillStyle='#65e3e61d';ctx.fillRect(0,H*.55,W,H*.45);
  for(let lane=0;lane<2;lane++){
    if(towers.some(t=>t.side===0&&t.lane===lane&&!t.alive)){
      ctx.fillStyle='#5bf4c32c';ctx.fillRect(lane*W*.5,H*.12,W*.5,H*.43);
      ctx.strokeStyle='#b1ffdb';ctx.setLineDash([7,5]);ctx.strokeRect(lane*W*.5+3,H*.12,W*.5-6,H*.43);ctx.setLineDash([]);
    }
  }
  ctx.strokeStyle='#a7ffff';ctx.setLineDash([8,7]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,H*.55);ctx.lineTo(W,H*.55);ctx.stroke();ctx.restore();
}
let axeShake=0,axeRings=[],axeLobbyBeat=0,axeBattleBeat=0,axeDrumBuffers={};
function axeNoiseBuffer(){
 const sr=audioCtx.sampleRate,len=Math.floor(sr*.9),b=audioCtx.createBuffer(1,len,sr),data=b.getChannelData(0);
 let previous=0;for(let i=0;i<len;i++){let white=Math.random()*2-1;previous=(previous+white*.16)/1.16;data[i]=previous*.85+white*.15}return b;
}
function axePerc(kind='drum',volume=.5,delay=0){
 if(state.settings.sound===false||!axeAudioUnlock())return;
 try{
  if(!axeDrumBuffers.noise||axeDrumBuffers.noise.sampleRate!==audioCtx.sampleRate)axeDrumBuffers.noise=axeNoiseBuffer();
  const t=audioCtx.currentTime+delay,src=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=audioCtx.createGain();
  src.buffer=axeDrumBuffers.noise;
  f.type=kind==='metal'?'highpass':kind==='wind'?'bandpass':'lowpass';
  f.frequency.setValueAtTime(kind==='metal'?1200:kind==='wind'?600:kind==='hit'?330:160,t);
  if(kind==='metal')f.frequency.exponentialRampToValueAtTime(650,t+.25);
  g.gain.setValueAtTime(Math.max(.001,volume*.24*axeVolume()),t);
  g.gain.exponentialRampToValueAtTime(.0001,t+(kind==='wind'?.8:kind==='metal'?.33:.28));
  src.connect(f);f.connect(g);g.connect(axeMaster);src.start(t);src.stop(t+.88);
  if(kind==='drum'||kind==='hit'){
   const o=audioCtx.createOscillator(),og=audioCtx.createGain();o.type='sine';
   o.frequency.setValueAtTime(kind==='hit'?130:105,t);o.frequency.exponentialRampToValueAtTime(kind==='hit'?48:42,t+.16);
   og.gain.setValueAtTime(volume*.24*axeVolume(),t);og.gain.exponentialRampToValueAtTime(.0001,t+.3);
   o.connect(og);og.connect(axeMaster);o.start(t);o.stop(t+.32);
  }
 }catch(e){console.warn('Percussão',e)}
}
function axeCombatMusic(dt){
 if(!state.settings.sound)return;
 axeBattleBeat-=dt;if(axeBattleBeat>0)return;
 axeBattleBeat=battleTime<60?.28:.38;
 const n=axeLobbyBeat++;
 axePerc(n%4===0?'hit':n%2===0?'drum':'metal',n%4===0?.9:.38);
 if(n%8===0)axePerc('wind',.19);
}
function axeLobbyMusic(){
 if(state.settings.sound===false||gameOn||!document.getElementById('lobby').classList.contains('active'))return;
 if(!axeAudioReady)return;
 const n=axeLobbyBeat++;
 axePerc(n%4===0?'drum':'metal',n%4===0?.44:.12);
 if(n%8===0)axePerc('wind',.12);
}
// O áudio só inicia depois de uma interação real do jogador (política dos navegadores).
setInterval(axeLobbyMusic,670);
const axeV16Update=update;
update=function(dt){axeV16Update(dt);axeCombatMusic(dt);axeShake=Math.max(0,axeShake-dt*20);for(const ring of axeRings)ring.life-=dt;axeRings=axeRings.filter(r=>r.life>0)};
const axeV16Draw=draw;
draw=function(){ctx.save();if(axeShake>0)ctx.translate((Math.random()-.5)*axeShake,(Math.random()-.5)*axeShake);axeV16Draw();ctx.restore();ctx.save();for(const r of axeRings){ctx.globalAlpha=Math.max(0,r.life/.6);ctx.strokeStyle=r.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,(.6-r.life)*90,0,7);ctx.stroke()}ctx.restore()};
const axeV16Tower=destroyTower;
destroyTower=function(t){if(!t.alive)return;axeV16Tower(t);axeShake=15;axeRings.push({x:t.x,y:t.y,color:t.side?'#7aeaff':'#ffbe77',life:.6});axePerc('hit',1);axePerc('metal',.7,.08);if(!t.king&&t.side===0)toast('TORRE DESTRUÍDA! Invoque na rota conquistada!')};
const axeV16Damage=takeDamage;
takeDamage=function(t,amount){const old=t.hp;axeV16Damage(t,amount);if(old>0&&amount>=60&&Math.random()<.20){axeShake=Math.max(axeShake,2.5);axePerc('hit',.17)}};
const axeV16Hero=heroSfx;
heroSfx=function(u){axeV16Hero(u);const id=u.card.id;if(id==='flechas'||id==='oxossi')axePerc('wind',.24);else if(id==='ogum'||id==='xango')axePerc('metal',.45);else if(id==='tranca')axePerc('wind',.55);else if(id==='boiadeiro')axePerc('hit',.3);else if(id==='marinheiro'||id==='iemanja')axePerc('wind',.35);else if(id==='jurema')axePerc('wind',.17)};
const axeV16Start=startBattle;
startBattle=function(){axeLobbyBeat=0;axeBattleBeat=0;axeV16Start();axePerc('drum',1);axePerc('metal',.6,.12)};
const axeV16Finish=finish;
finish=function(win){axeV16Finish(win);axePerc(win?'metal':'hit',.85);if(win){axePerc('drum',.8,.18);axePerc('metal',.9,.38)}else axePerc('wind',.6,.25)};
const axeV16Test=axeTestSound;
axeTestSound=function(){axeV16Test();axePerc('drum',.8,.05);axePerc('metal',.6,.3);axePerc('wind',.4,.6)};
// A versão anterior usava notas eletrônicas contínuas; nesta versão a percussão assume a trilha.
musicBeat=function(){};

/* V17 — poderes identitários, temporadas e nova direção visual */
const AXE_SEASONS=[{title:'TEMPORADA 01',subtitle:'A JORNADA DOS SETE REINOS',realms:REALMS.map(r=>r[1]),active:true}];
const axeOldAttack=applyHeroAttack;
applyHeroAttack=function(u,t){
 axeOldAttack(u,t);
 if(u.card.id==='boiadeiro' && t && t.card && !t.dead){
   const d=Math.hypot(t.x-u.x,t.y-u.y);
   if(d>17 && d<W*.39 && (u.lassoCooldown||0)<=0){
     const pull=Math.min(d-15,W*.19);
     const from={x:t.x,y:t.y};
     t.x-=(t.x-u.x)/d*pull;
     t.y-=(t.y-u.y)/d*pull;
     t.slowTimer=Math.max(t.slowTimer||0,2.2);
     u.lassoCooldown=4.2;
     axeLassos.push({x:u.x,y:u.y,tx:from.x,ty:from.y,life:.46,max:.46});
     burst(t.x,t.y,'#e9c18b',13);
     axePerc('wind',.55);axePerc('hit',.4,.10);
   }
 }
 if(u.card.id==='tranca' && t){t.slowTimer=Math.max(t.slowTimer||0,1.6);burst(t.x,t.y,'#ff783d',7)}
 if(u.card.id==='ogum' && t && t.card){t.slowTimer=Math.max(t.slowTimer||0,.45)}
};
let axeLassos=[];
const axePreviousUpdate17=update;
update=function(dt){axePreviousUpdate17(dt);for(const u of units)if(u.lassoCooldown>0)u.lassoCooldown-=dt;for(const l of axeLassos)l.life-=dt;axeLassos=axeLassos.filter(l=>l.life>0)};
const axePreviousDraw17=draw;
draw=function(){axePreviousDraw17();ctx.save();for(const l of axeLassos){ctx.globalAlpha=Math.min(1,l.life*3);ctx.strokeStyle='#f2d5a1';ctx.lineWidth=3;ctx.setLineDash([5,3]);ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(l.tx,l.ty);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.ellipse(l.tx,l.ty,11,7,0,0,Math.PI*2);ctx.stroke()}ctx.restore()};
const axePrevStart17=startBattle;
startBattle=function(){axeLassos=[];axePrevStart17()};
// Sons de interface: toque em botões e cartas; áudio começa após gesto do jogador.
document.addEventListener('click',function(e){
 const control=e.target.closest('button, .card, select, input[type="checkbox"]');
 if(!control||state.settings.sound===false)return;
 axeAudioUnlock();
 if(control.classList.contains('primary')){axePerc('drum',.20);tone(490,.075,.018,'triangle')}
 else if(control.classList.contains('card')){axePerc('wind',.075);tone(570,.055,.013,'sine')}
 else{tone(420,.048,.014,'triangle')}
},true);
// Painel da temporada atual e dos sete reinos. Estrutura pronta para temporadas futuras.
const axeSeasonInfo=document.createElement('div');
axeSeasonInfo.className='axe-season';
axeSeasonInfo.innerHTML='<div class="axe-season-kicker">✦ TEMPORADA 01 · ATIVA</div><strong>A JORNADA DOS SETE REINOS</strong><div class="axe-season-description">Das águas de Iemanjá aos caminhos dos ancestrais</div><div class="axe-season-progress"><span>7 REINOS · 1ª TEMPORADA</span><span>✦ AXÉ</span></div>';
const lobbyCenter=document.querySelector('#lobby .lobby-center');
if(lobbyCenter)lobbyCenter.insertBefore(axeSeasonInfo,lobbyCenter.querySelector('.lobby-info'));
const seasonHeading=document.createElement('div');seasonHeading.className='axe-season-realm';seasonHeading.innerHTML='<span>✦ TEMPORADA 01</span><b>Os Sete Reinos</b><small>Os próximos conjuntos de sete reinos chegarão em novas temporadas.</small>';
const realmList=document.getElementById('realmList');if(realmList)realmList.parentElement.insertBefore(seasonHeading,realmList);
// Tooltip simples no acervo: habilidades claras sem alterar a progressão existente.
const axePrevCard17=cardEl;
cardEl=function(c,click,extra=''){
 const el=axePrevCard17(c,click,extra);
 const descriptions={boiadeiro:'Laço de captura: puxa o inimigo para perto e reduz sua velocidade.',flechas:'Dispara flechas e pode atingir mais de um alvo.',ogum:'Espada de ferro: ataque em área e breve interrupção.',marinheiro:'Onda de chegada: avanço inicial acelerado.',jurema:'Folhas encantadas: cura aliados próximos.',tranca:'Fogo de guarda: enfraquece e desacelera.',pai:'Bênção ancestral: restaura a vida dos aliados.'};
 el.title=descriptions[c.id]||HERO_STYLES[c.id]?.desc||c.name;
 return el;
};




(function(){
'use strict';
const themes=[
 ['#164b73','#0c2946','#4dd3dd','🌊'],['#1b4c2b','#071d1a','#7bdb77','🌿'],
 ['#4d4140','#171a27','#ff9d51','⚔️'],['#58432d','#1b1d2b','#ffd174','⚡'],
 ['#74664d','#2a3545','#fff4b5','☀️'],['#60437a','#24233d','#dfb1ff','🦋'],
 ['#4d3b58','#181b2b','#d3b5ed','🕯️']
];
function refreshRealmBackground(){
 const i=Math.max(0,Math.min(6,typeof chosenRealm==='number'?chosenRealm:0));
 const [a,b,c]=themes[i];
 const lc=document.querySelector('#lobby .lobby-center'),king=document.querySelector('#lobby .kingdom');
 if(lc)lc.style.background=`radial-gradient(ellipse at 50% 35%,${a} 0%,${b} 75%),linear-gradient(${a},${b})`;
 if(king){king.style.background=`radial-gradient(ellipse at 50% 70%,${c}77,${a}aa 55%,transparent 78%)`;king.style.boxShadow=`0 0 45px ${c}44,inset 0 0 45px ${c}33`;king.style.filter='none'}
}
const oldWallet=updateWallet;
updateWallet=function(){oldWallet();refreshRealmBackground()};
const oldShift=shiftRealm;
shiftRealm=function(step){oldShift(step);refreshRealmBackground()};
const wallet=document.querySelector('#lobby .topbar .currency');
if(wallet){
 wallet.classList.add('axe-wallet');
 wallet.innerHTML='<button type="button" class="currency" onclick="axeOpenShop(\'coins\')" aria-label="Abrir loja de moedas"><i class="fa-solid fa-coins gold"></i> <span data-coins></span> <i class="fa-solid fa-plus"></i></button><button type="button" class="currency" onclick="axeOpenShop(\'gems\')" aria-label="Abrir loja de diamantes"><i class="fa-solid fa-gem gem"></i> <span data-gems></span> <i class="fa-solid fa-plus"></i></button>';
}
const shop=document.querySelector('#shop .scroll');
if(shop){
 const header=document.createElement('div');
 header.innerHTML='<div class="axe-shop-banner"><strong>✦ LOJA DO AXÉ</strong><small>Relíquias, moedas, diamantes e entidades para fortalecer sua corrente.</small></div><div class="axe-shop-tabs" id="axeShopTabs"><button data-tab="heroes">ENTIDADES</button><button data-tab="gems">DIAMANTES</button><button data-tab="coins">MOEDAS</button></div><div id="axeShopPacks"></div>';
 shop.prepend(header);
}
const packs={
 gems:[['fa-gem','100 diamantes','Pacote inicial'],['fa-gem','550 diamantes','Baú de cristais'],['fa-gem','1.200 diamantes','Tesouro azul'],['fa-gem','2.800 diamantes','Reserva lendária']],
 coins:[['fa-coins','1.000 moedas','Bolsa de ouro'],['fa-coins','5.000 moedas','Arca dourada'],['fa-coins','12.000 moedas','Tesouro do reino'],['fa-coins','30.000 moedas','Fortuna ancestral']]
};
window.axeOpenShop=function(tab='heroes'){show('shop');axeShopTab(tab)};
window.axeShopTab=function(tab){
 const panel=document.getElementById('axeShopPacks');
 if(!panel)return;
 document.querySelectorAll('#axeShopTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 const original=document.querySelector('#shop .scroll > .panel');
 const upgrade=document.getElementById('upgradeList');
 if(original)original.style.display=tab==='heroes'?'':'none';
 if(upgrade)upgrade.style.display=tab==='heroes'?'':'none';
 if(tab==='heroes'){panel.innerHTML='';return}
 panel.innerHTML='<p class="small">Vitrine demonstrativa: pagamentos reais não estão integrados nesta versão.</p><div class="axe-pack-grid">'+packs[tab].map(([ico,name,sub])=>`<div class="axe-pack"><div class="big"><i class="fa-solid ${ico}"></i></div><b>${name}</b><small>${sub}</small><button class="btn primary" type="button" onclick="toast('Compra real ainda não disponível')">VER OFERTA</button></div>`).join('')+'</div>';
};
document.querySelectorAll('#axeShopTabs button').forEach(b=>b.addEventListener('click',()=>axeShopTab(b.dataset.tab)));
const oldShow=show;
show=function(id){oldShow(id);if(id==='shop')axeShopTab('heroes');if(id==='ranking')axeRenderRanking()};
const lobbyNav=document.querySelector('#lobby .nav');
if(lobbyNav){
 const btn=document.createElement('button');btn.innerHTML='<i class="fa-solid fa-ranking-star"></i><br>RANKING';btn.onclick=()=>show('ranking');
 lobbyNav.append(btn);lobbyNav.style.gridTemplateColumns='repeat(5,1fr)';
}
const ranking=document.createElement('section');
ranking.id='ranking';ranking.className='screen';
ranking.innerHTML='<div class="topbar"><button class="back" onclick="show(\'lobby\')"><i class="fa-solid fa-arrow-left"></i></button><div class="title">PÓDIO NACIONAL</div><span>🏆</span></div><div class="scroll"><div class="axe-shop-banner"><strong>RANKING DA TEMPORADA</strong><small>Temporada 01 · A Jornada dos Sete Reinos</small></div><p class="small">Ranking ilustrativo com adversários fictícios do modo demonstrativo. O ranking nacional real exigirá servidor e contas de jogadores.</p><div id="axeRankingContent"></div></div>';
document.getElementById('app').append(ranking);
window.axeRenderRanking=function(){
 const mock=[['Guardião do Norte',3100],['Filha das Matas',2890],['Vento do Axé',2710],['Maré Sagrada',2530],['Ferro e Fé',2320]];
 const all=[...mock,['Você',state.trophies]].sort((a,b)=>b[1]-a[1]);
 const podium=all.slice(0,3);
 const icons=['🥇','🥈','🥉'];
 document.getElementById('axeRankingContent').innerHTML='<div class="axe-ranking-podium">'+[1,0,2].map(i=>podium[i]?`<div class="axe-rank-block"><div class="medal">${icons[i]}</div><b>${podium[i][0]}</b><small>${podium[i][1]} Axé</small></div>`:'').join('')+'</div>'+all.map((a,i)=>`<div class="axe-rank-row ${a[0]==='Você'?'me':''}"><b>${i+1}º · ${a[0]}</b><span>✦ ${a[1]} Axé</span></div>`).join('');
};
const battle=document.getElementById('battle');
if(battle){
 const field=document.getElementById('field');
 const btn=document.createElement('button');btn.className='axe-emote-open';btn.innerHTML='💬';btn.setAttribute('aria-label','Enviar figurinha');btn.onclick=()=>document.getElementById('axeEmoteMenu').classList.toggle('open');
 field.append(btn);
 const menu=document.createElement('div');menu.id='axeEmoteMenu';menu.className='axe-emote-menu';
 const emotes=['🔥','👏','😂','❤️','🙏','💪','⚡','🌊','🏆'];
 emotes.forEach(emo=>{let b=document.createElement('button');b.textContent=emo;b.onclick=()=>{menu.classList.remove('open');axeEmote(emo,false);setTimeout(()=>{if(gameOn)axeEmote(emotes[Math.floor(Math.random()*emotes.length)],true)},800+Math.random()*1400)};menu.append(b)});
 field.append(menu);
}
function axeEmote(emoji,enemy){
 const field=document.getElementById('field');if(!field)return;
 const b=document.createElement('div');b.className='axe-emote-bubble '+(enemy?'enemy':'player');b.textContent=emoji;field.append(b);setTimeout(()=>b.remove(),2400);
 if(typeof tone==='function')tone(enemy?340:570,.10,.02,'triangle');
}
let previousIndex=unlockedRealmIndex();
const oldFinish=finish;
finish=function(win){
 const before=unlockedRealmIndex();
 oldFinish(win);
 const after=unlockedRealmIndex();
 if(after>before){
  state.pendingRealmReveal=after;
  save();
 }
};
function showRealmReveal(){
 const idx=state.pendingRealmReveal;
 if(idx===undefined||idx===null)return;
 delete state.pendingRealmReveal;save();
 const r=REALMS[idx],theme=themes[idx];
 const el=document.createElement('div');el.className='axe-realm-unlock';
 el.innerHTML=`<div class="inside"><div style="font-size:12px;letter-spacing:3px;color:#f8d995">NOVO REINO CONQUISTADO!</div><div class="symbol">${theme[3]}</div><h2>REINO DE ${r[1].toUpperCase()}</h2><p>${r[2]}</p><p class="small">✦ ${r[3]} de Axé de ranking alcançados</p><button class="btn primary" style="width:100%" type="button">CONTINUAR JORNADA</button></div>`;
 document.getElementById('app').append(el);
 el.querySelector('button').onclick=()=>{el.remove();chosenRealm=idx;state.chosenRealm=idx;save();updateWallet()};
 if(typeof axePerc==='function')axePerc('metal',.75);
 if(typeof tone==='function'){tone(440,.3,.05,'triangle');setTimeout(()=>tone(660,.45,.05,'triangle'),180)}
}
const backResult=document.querySelector('#result .modal button');
if(backResult)backResult.addEventListener('click',()=>setTimeout(showRealmReveal,100));
const oldStart=startBattle;
startBattle=function(){
 document.querySelectorAll('.axe-emote-bubble').forEach(el=>el.remove());
 const menu=document.getElementById('axeEmoteMenu');if(menu)menu.classList.remove('open');
 oldStart();
};
updateWallet();
})();



(function(){'use strict';
const imgMap={jurema:'https://i.ibb.co/jvVnjtYQ/Xam-Tribal-da-Magia-Verde.png',tereza:'https://i.ibb.co/M5Rn08tq/Vaqueira-guerreira-sobre-touro-em-a-o.png',iara:'https://i.ibb.co/5X4JwGmb/Sereia-Guerreira-em-F-ria-Aqu-tica.png',mata:'https://i.ibb.co/cKZrtTx5/On-a-tribal-em-ataque-feroz.png',pai:'https://i.ibb.co/vxX1pWKT/Anci-o-Xam-com-Cajado-e-Fuma-a-removebg-preview.png',figueira:'https://i.ibb.co/spXzYFpT/Feiticeira-Tribal-da-Energia-Rubra-removebg-preview.png',tiriri:'https://i.ibb.co/tMy8YtTZ/Guerreiro-Xam-das-Correntes-Rubras-removebg-preview.png',marinheiro:'https://i.ibb.co/sdHFD1xd/Guerreiro-do-Mar-com-ncora-e-Sabre-removebg-preview.png'};
const shopRoot=document.querySelector('#shop .scroll');
const store=document.createElement('div');store.id='axeV19Store';store.className='axe-v19-store';shopRoot.prepend(store);
let tab='entities';
const fmt=n=>Number(n).toLocaleString('pt-BR');
const icon=(name)=>'<i class="fa-solid '+name+'"></i>';
function art(c){return imgMap[c.id]?'<img loading="lazy" src="'+imgMap[c.id]+'" alt="'+c.name+'">':icon(c.emoji)}
function card(c,owned){const p=c.rarity==='legend'?2200:c.rarity==='epic'?1450:900;const g=c.rarity==='legend'?220:c.rarity==='epic'?150:90;return '<article class="axe-v19-product"><div class="axe-v19-art">'+art(c)+'<span class="axe-v19-tag">'+(c.rarity==='legend'?'LENDÁRIA':c.rarity==='epic'?'ÉPICA':'ENTIDADE')+'</span></div><b>'+c.name+'</b><small>'+(owned?'Já está no seu acervo':'Custo de invocação: '+c.cost+' Axé')+'</small><div class="axe-v19-actions">'+(owned?'<button disabled>ADQUIRIDA</button>':'<button class="secondary" onclick="axeV19BuyHero(\''+c.id+'\','+p+',\'coins\')">● '+fmt(p)+'</button><button onclick="axeV19BuyHero(\''+c.id+'\','+g+',\'gems\')">◆ '+g+'</button>')+'</div></article>'}
const crystals=[{n:80,p:'R$ 4,90',t:'Essencial'},{n:250,p:'R$ 12,90',t:'Jornada'},{n:650,p:'R$ 29,90',t:'Fortalecimento'},{n:1500,p:'R$ 59,90',t:'Reserva'}];
const boxes=[{n:'Caixa das Marés',g:55,ico:'fa-water',t:'Recompensa surpresa básica'},{n:'Caixa das Matas',g:95,ico:'fa-leaf',t:'Chance maior de fragmentos'},{n:'Caixa do Ferro',g:160,ico:'fa-shield-halved',t:'Chance de entidade não adquirida'},{n:'Caixa dos Sete Reinos',g:290,ico:'fa-crown',t:'Recompensas superiores'}];
window.axeV19Tab=function(next){tab=next;axeV19Render()};
window.axeV19BuyHero=function(id,price,cur){const c=CARDS.find(c=>c.id===id);if(!c||state.owned.includes(id))return;if(state[cur]<price){toast('Saldo insuficiente');axeV19Tab(cur==='gems'?'crystals':'boxes');return}buyHero(c,price,cur);axeV19Render()};
window.axeV19Upgrade=function(id,price){const c=CARDS.find(c=>c.id===id);if(!c||!state.owned.includes(id))return;if(state.gems<price)return toast('Cristais insuficientes');state.gems-=price;state.levels[id]=(state.levels[id]||1)+1;save();updateWallet();axeV19Render();toast(c.name+' fortalecido para nível '+state.levels[id]);if(typeof sound==='function')sound(620,.16,'triangle',.06,180)};
window.axeV19Box=function(i){const b=boxes[i];if(!b||state.gems<b.g)return toast('Cristais insuficientes');state.gems-=b.g;const missing=CARDS.filter(c=>!state.owned.includes(c.id));let message='';if(missing.length&&Math.random()<(i===3?.35:i===2?.24:i===1?.14:.07)){const h=missing[Math.floor(Math.random()*missing.length)];state.owned.push(h.id);message='Nova entidade: '+h.name}else if(Math.random()<.6){const amount=Math.round(b.g*(5+Math.random()*4));state.coins+=amount;message='+'+amount+' moedas'}else{const h=CARDS[Math.floor(Math.random()*CARDS.length)];state.fragments[h.id]=(state.fragments[h.id]||0)+Math.max(3,Math.round(b.g/15));message='Fragmentos de '+h.name}save();updateWallet();axeV19Render();toast(message);if(typeof sound==='function')sound(700,.25,'triangle',.08,220)};
window.axeV19Render=function(){
 const sections={entities:'Entidades',crystals:'Cristais',boxes:'Caixas',upgrade:'Fortalecer'};
 let out='<div class="axe-v19-heading"><div class="axe-v19-eyebrow">TEMPORADA 01 · OS SETE REINOS</div><h2>LOJA DO AXÉ</h2><p>Entidades, cristais, caixas e evolução da sua corrente.</p></div>';
 out+='<div class="axe-v19-wallet"><button onclick="axeV19Tab(\'boxes\')">'+icon('fa-coins')+' <span class="axe-v19-coin">'+fmt(state.coins)+'</span> moedas</button><button onclick="axeV19Tab(\'crystals\')">'+icon('fa-gem')+' <span class="axe-v19-gem">'+fmt(state.gems)+'</span> cristais</button></div>';
 out+='<div class="axe-v19-tabs">'+Object.entries(sections).map(([k,v])=>'<button class="'+(tab===k?'active':'')+'" onclick="axeV19Tab(\''+k+'\')">'+v.toUpperCase()+'</button>').join('')+'</div>';
 if(tab==='entities'){out+='<h3 class="axe-v19-title">Entidades disponíveis</h3><p class="axe-v19-desc">Adquira diretamente com moedas ou cristais. As cartas usam a mesma identidade do acervo.</p><div class="axe-v19-grid">'+CARDS.filter(c=>c.type!=='spell').map(c=>card(c,state.owned.includes(c.id))).join('')+'</div>'}
 if(tab==='crystals'){out+='<h3 class="axe-v19-title">Pacotes de cristais</h3><p class="axe-v19-desc">Valores de referência para a futura loja de pagamentos.</p><div class="axe-v19-grid">'+crystals.map(p=>'<article class="axe-v19-product"><div class="axe-v19-art">'+icon('fa-gem')+'</div><b>'+fmt(p.n)+' cristais</b><small>'+p.t+'</small><button class="axe-v19-buy" onclick="toast(\'Pagamento em R$ ainda não disponível\')">'+p.p+'</button></article>').join('')+'</div><div class="axe-v19-notice">Compras em reais são apenas uma vitrine de preços. Nenhum pagamento é processado nesta versão HTML.</div>'}
 if(tab==='boxes'){out+='<h3 class="axe-v19-title">Caixas misteriosas</h3><p class="axe-v19-desc">Troque cristais por recompensas aleatórias dentro do jogo.</p><div class="axe-v19-grid">'+boxes.map((b,i)=>'<article class="axe-v19-product"><div class="axe-v19-art">'+icon(b.ico)+'</div><b>'+b.n+'</b><small>'+b.t+'</small><button class="axe-v19-buy" onclick="axeV19Box('+i+')">◆ '+b.g+' cristais</button></article>').join('')+'</div><div class="axe-v19-notice">As recompensas são aleatórias e simuladas. As probabilidades precisam ser definidas e exibidas antes de um lançamento comercial.</div>'}
 if(tab==='upgrade'){const owned=CARDS.filter(c=>state.owned.includes(c.id)&&c.type!=='spell');out+='<h3 class="axe-v19-title">Fortalecimento de entidades</h3><p class="axe-v19-desc">Evolua suas entidades usando cristais. O preço cresce a cada nível.</p>'+(owned.length?'<div class="axe-v19-grid">'+owned.map(c=>{const lvl=state.levels[c.id]||1,price=30*lvl;return '<article class="axe-v19-product"><div class="axe-v19-art">'+art(c)+'</div><b>'+c.name+'</b><small>Nível '+lvl+' → '+(lvl+1)+'</small><button class="axe-v19-buy" onclick="axeV19Upgrade(\''+c.id+'\','+price+')">◆ '+price+' cristais</button></article>'}).join('')+'</div>':'<div class="axe-v19-empty">Você ainda não possui entidades para fortalecer.</div>')}
 store.innerHTML=out;
};
const oldOpen=window.axeOpenShop;window.axeOpenShop=function(kind){show('shop');axeV19Tab(kind==='gems'?'crystals':kind==='coins'?'boxes':'entities')};
const oldShow=show;show=function(id){oldShow(id);if(id==='shop')axeV19Render();if(id==='ranking')axeV19Rank()};
const oldWallet=updateWallet;updateWallet=function(){oldWallet();document.querySelectorAll('#lobby .axe-wallet button').forEach(b=>{b.setAttribute('aria-label',b.textContent.includes('diamantes')?'Abrir loja de cristais':b.getAttribute('aria-label'))});const btns=document.querySelectorAll('#lobby .axe-wallet button');if(btns[1])btns[1].setAttribute('aria-label','Abrir loja de cristais')};
const gemBtn=document.querySelector('#lobby .axe-wallet button:nth-child(2)');if(gemBtn)gemBtn.title='Cristais';
window.axeV19Rank=function(){const min=REALMS[5][3],eligible=state.trophies>=min;const mock=[['Guardião do Norte',3100],['Filha das Matas',2890],['Vento do Axé',2710],['Maré Sagrada',2530],['Ferro e Fé',2320]];const all=[...mock,...(eligible?[['Você',state.trophies]]:[])].sort((a,b)=>b[1]-a[1]);const podium=all.slice(0,3),medals=['🥇','🥈','🥉'];const el=document.getElementById('axeRankingContent');if(!el)return;el.innerHTML=(eligible?'<div class="axe-v19-notice">Você está habilitado ao ranking desta temporada.</div>':'<div class="axe-v19-notice">Ranking disponível somente a partir do 6º Reino (Iori, 1.500 Axé). Você tem '+fmt(state.trophies)+' Axé. Continue sua jornada para competir.</div>')+'<div class="axe-ranking-podium">'+[1,0,2].map(i=>podium[i]?'<div class="axe-rank-block"><div class="medal">'+medals[i]+'</div><b>'+podium[i][0]+'</b><small>'+fmt(podium[i][1])+' Axé</small></div>':'').join('')+'</div>'+all.map((a,i)=>'<div class="axe-rank-row '+(a[0]==='Você'?'me':'')+'"><b>'+(i+1)+'º · '+a[0]+'</b><span>✦ '+fmt(a[1])+' Axé</span></div>').join('');};
const rankInfo=document.querySelector('#ranking .scroll > p.small');if(rankInfo)rankInfo.textContent='Somente jogadores dos Reinos 6 e 7 entram no ranking. Classificação demonstrativa, sem conexão com jogadores reais.';
const originalRenderRank=window.axeRenderRanking;window.axeRenderRanking=window.axeV19Rank;
const shopTitle=document.querySelector('#shop .topbar .title');if(shopTitle)shopTitle.textContent='LOJA DO AXÉ';
axeV19Render();updateWallet();
})();



(function(){'use strict';
const heroes=[
{id:'jurema',name:'Cabocla Jurema',emoji:'fa-leaf',cost:4,hp:345,dmg:36,range:115,speed:29,rate:1.55,type:'ranged',rarity:'',color:'#73d992',role:'Suporte',walk:'stalk',attack:'leaf',ability:'Folhas de cura',desc:'Cura um aliado próximo em pequena quantidade a cada ataque.',url:'https://i.ibb.co/jvVnjtYQ/Xam-Tribal-da-Magia-Verde.png'},
{id:'tereza',name:'Tereza Légua do Laço',emoji:'fa-hat-cowboy',cost:4,hp:690,dmg:67,range:31,speed:33,rate:1.38,type:'melee',rarity:'epic',color:'#e9b26c',role:'Controle',walk:'charge',attack:'lasso',ability:'Laço da vaqueira',desc:'Puxa uma unidade inimiga próxima, com intervalo de 5 segundos.',url:'https://i.ibb.co/M5Rn08tq/Vaqueira-guerreira-sobre-touro-em-a-o.png'},
{id:'iara',name:'Iara',emoji:'fa-water',cost:4,hp:450,dmg:75,range:100,speed:34,rate:1.48,type:'ranged',rarity:'epic',color:'#6ee8ee',role:'Impacto aquático',walk:'surf',attack:'splash',ability:'Impacto das águas',desc:'Projétil aquático que atinge o alvo e causa 30% do dano a até dois inimigos próximos.',url:'https://i.ibb.co/5X4JwGmb/Sereia-Guerreira-em-F-ria-Aqu-tica.png'},
{id:'mata',name:'Força da Mata',emoji:'fa-paw',cost:3,hp:255,dmg:150,range:24,speed:77,rate:1.5,type:'melee',rarity:'epic',color:'#d4b56c',role:'Investida explosiva',walk:'charge',attack:'strike',ability:'Salto da onça',desc:'Corre até o alvo e explode ao chegar, causando dano em área; dano cresce com o nível.',url:'https://i.ibb.co/cKZrtTx5/On-a-tribal-em-ataque-feroz.png'},
{id:'pai',name:'Pai Joaquim',emoji:'fa-smoking',cost:3,hp:410,dmg:35,range:95,speed:23,rate:1.65,type:'ranged',rarity:'',color:'#d6c2a1',role:'Controle',walk:'slow',attack:'curse',ability:'Fumaça do cachimbo',desc:'Nuvem de fumaça desacelera os ataques e a marcha dos adversários.',url:'https://i.ibb.co/vxX1pWKT/Anci-o-Xam-com-Cajado-e-Fuma-a-removebg-preview.png'},
{id:'figueira',name:'Figueira',emoji:'fa-fire-flame-curved',cost:5,hp:410,dmg:83,range:118,speed:28,rate:1.55,type:'ranged',rarity:'legend',color:'#e66a7a',role:'Debuff',walk:'float',attack:'fire',ability:'Energia rubra',desc:'Aplica queimadura por 3 segundos e reduz a cura recebida pelo alvo.',url:'https://i.ibb.co/spXzYFpT/Feiticeira-Tribal-da-Energia-Rubra-removebg-preview.png'},
{id:'tiriri',name:'Tiriri',emoji:'fa-link',cost:4,hp:610,dmg:89,range:30,speed:39,rate:1.18,type:'melee',rarity:'epic',color:'#f06e78',role:'Guerreiro de controle',walk:'stride',attack:'cleave',ability:'Correntes rubras',desc:'Golpeia com correntes e imobiliza brevemente um alvo a cada 4 segundos.',url:'https://i.ibb.co/tMy8YtTZ/Guerreiro-Xam-das-Correntes-Rubras-removebg-preview.png'},
{id:'marinheiro',name:'João do Mar',emoji:'fa-anchor',cost:3,hp:610,dmg:71,range:28,speed:32,rate:1.25,type:'melee',rarity:'',color:'#78cfe9',role:'Guerreiro',walk:'surf',attack:'strike',ability:'Âncora e sabre',desc:'Combate próximo; o primeiro golpe empurra levemente o alvo.',url:'https://i.ibb.co/sdHFD1xd/Guerreiro-do-Mar-com-ncora-e-Sabre-removebg-preview.png'}
];
const ids=new Set([...heroes.map(h=>h.id),'rompe','flechas','boiadeiro','pedrinho','almas','baiana','tranca','padilha','mironga','dende','brasa']);
CARDS.splice(0,CARDS.length);
for(const h of heroes){const {url,role,walk,attack,ability,desc,...card}=h;CARDS.push(card);ART_HEROES[h.id]={url,name:h.name,role,kind:h.id==='iara'?'water':h.id==='mata'?'beast':'warrior'};HERO_STYLES[h.id]={walk,attack,ability,desc};const im=new Image();im.referrerPolicy='no-referrer';im.src=url;heroImages[h.id]=im}
// Uma corrente com 8 personagens para testar as funções. Todos os personagens antigos saem do acervo.
state.owned=heroes.map(h=>h.id);
state.deck=heroes.map(h=>h.id);
state.decks=Array.from({length:5},()=>state.deck.slice());
state.levels=Object.fromEntries(Object.entries(state.levels).filter(([id])=>ids.has(id)));
state.fragments=Object.fromEntries(Object.entries(state.fragments).filter(([id])=>ids.has(id)));
replaceIndex=-1;activeDeck=1;save();
// A IA também usa exclusivamente as oito entidades da nova temporada.
const prevSpawn=spawn;
spawn=function(card,side,x,y){if(!card||!ids.has(card.id))return;prevSpawn(card,side,x,y);const u=units[units.length-1];if(u&&u.card.id===card.id){u.specialCD=0;u.burn=0;u.healBlock=0;u.snare=0;u.attackSlow=0}};
const baseAttack=applyHeroAttack;
applyHeroAttack=function(u,t){
 if(!ids.has(u.card.id))return;
 if(u.card.id==='mata')return;
 if(u.card.id==='jurema'){
  const ally=units.filter(v=>v.side===u.side&&!v.dead&&v.hp<v.max&&Math.hypot(v.x-u.x,v.y-u.y)<W*.35).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];
  if(ally){ally.hp=Math.min(ally.max,ally.hp+46*(1+.12*((state.levels.jurema||1)-1)));burst(ally.x,ally.y,'#86e5a2',7)}
  return;
 }
 if(u.card.id==='pai'){
  t.slowTimer=Math.max(t.slowTimer||0,2.1);t.attackSlow=Math.max(t.attackSlow||0,2.1);burst(t.x,t.y,'#c4c1b1',8);return;
 }
 if(u.card.id==='figueira'){
  t.burn=Math.max(t.burn||0,3);t.healBlock=Math.max(t.healBlock||0,3);burst(t.x,t.y,'#ed667d',9);return;
 }
 if(u.card.id==='tiriri'){
  if((u.specialCD||0)<=0){t.snare=Math.max(t.snare||0,.9);u.specialCD=4;burst(t.x,t.y,'#ec7181',10)}
  return;
 }
 if(u.card.id==='tereza'){
  if((u.specialCD||0)<=0&&t.card){let dx=u.x-t.x,dy=u.y-t.y,d=Math.hypot(dx,dy);if(d>10&&d<W*.36){let pull=Math.min(d-12,W*.14);t.x+=dx/d*pull;t.y+=dy/d*pull;t.slowTimer=Math.max(t.slowTimer||0,1.3);u.specialCD=5;burst(t.x,t.y,'#edb66b',10)}}return;
 }
 if(u.card.id==='marinheiro'){
  if(!u.firstHit&&t.card){t.y+=u.side===1?-W*.035:W*.035;u.firstHit=true;burst(t.x,t.y,'#74d4ed',7)}return;
 }
 if(u.card.id==='iara'){
  units.filter(v=>v.side!==u.side&&!v.dead&&v!==t&&Math.hypot(v.x-t.x,v.y-t.y)<W*.13).slice(0,2).forEach(v=>takeDamage(v,u.dmg*.3));burst(t.x,t.y,'#74e2f6',9);return;
 }
 baseAttack(u,t);
};
const originalUpdate=update;
update=function(dt){
 for(const u of units){if(u.dead)continue;u.specialCD=Math.max(0,(u.specialCD||0)-dt);u.snare=Math.max(0,(u.snare||0)-dt);u.attackSlow=Math.max(0,(u.attackSlow||0)-dt);u.healBlock=Math.max(0,(u.healBlock||0)-dt);if(u.burn>0){u.burn=Math.max(0,u.burn-dt);if(u.hp>0)takeDamage(u,Math.min(u.hp,12*dt))}
  if(u.card.id==='mata'&&!u.detonated){let t=targetFor(u);if(t&&Math.hypot(t.x-u.x,t.y-u.y)<W*.085){u.detonated=true;let dmg=u.dmg;for(const enemy of [...units,...towers])if(enemy.side!==u.side&&!enemy.dead&&enemy.alive!==false&&Math.hypot(enemy.x-u.x,enemy.y-u.y)<W*.17)takeDamage(enemy,dmg);burst(u.x,u.y,'#e9b96e',23);u.dead=true}}
 }
 // Aplica imobilização e ataque lento sem reescrever o motor central.
 const held=units.filter(u=>u.snare>0||u.attackSlow>0).map(u=>({u,speed:u.card.speed,rate:u.card.rate}));
 held.forEach(({u})=>{if(u.snare>0)u.card.speed=0;if(u.attackSlow>0)u.card.rate*=1.65});
 try{originalUpdate(dt)}finally{held.forEach(({u,speed,rate})=>{u.card.speed=speed;u.card.rate=rate})}
};
// Brasões oficiais enviados para o portal central e a jornada dos reinos.
const crests={Iemanjá:'https://i.ibb.co/jvZktMf3/Bras-o-Dourado-da-Rainha-do-Mar-removebg-preview.png',Oxóssi:'https://i.ibb.co/xtVZG3qn/Emblema-Florestal-de-Arco-e-Flecha-removebg-preview.png',Ogum:'https://i.ibb.co/PsN54byj/Bras-o-Fant-stico-Azul-e-Carmesim-removebg-preview.png',Xangô:'https://i.ibb.co/TDnx0jht/Bras-o-de-Xang-com-Raios-e-Fogo-removebg-preview.png'};
const kingdom=document.querySelector('#lobby .kingdom');const crest=document.createElement('img');crest.className='axe-crest';crest.alt='Brasão do reino';kingdom.append(crest);
function syncCrest(){const r=REALMS[typeof chosenRealm==='number'?chosenRealm:0]||currentRealm();crest.src=crests[r[1]]||'';crest.style.display=crests[r[1]]?'block':'none';crest.alt='Brasão de '+r[1]}
const previousWallet=updateWallet;updateWallet=function(){previousWallet();syncCrest()};
const prevRealms=renderRealms;renderRealms=function(){prevRealms();document.querySelectorAll('#realmList .realm').forEach((row,i)=>{let src=crests[REALMS[i][1]];if(src){let sym=row.querySelector('.symbol');if(sym)sym.innerHTML='<img class="axe-realm-crest" src="'+src+'" alt="Brasão de '+REALMS[i][1]+'">'}})};
const oldCollection=renderCollection;renderCollection=function(){oldCollection();document.querySelectorAll('#allCards .card,#deckGrid .card').forEach(b=>{const name=b.querySelector('.name')?.textContent;const c=CARDS.find(c=>c.name===name);if(c)b.title=c.name+' · '+HERO_STYLES[c.id].ability+' — '+HERO_STYLES[c.id].desc})};
// Vitrine: atualiza após o novo catálogo ser aplicado.
updateWallet();renderCollection();
})();



(function(){'use strict';
// Ataques físicos recebem impacto, recuo e animação sem substituir o sistema de progressão.
const impacts=[],labels=[];let cameraKick=0,combo=0,comboClock=0,combatClock=0;
const field=document.getElementById('field');const status=document.createElement('div');status.id='axeCombatStatus';status.innerHTML='⚔ <strong>ARENA PVP</strong> · DUELO';field.append(status);
function fx(x,y,color,size=25,kind='ring'){impacts.push({x,y,color,size,kind,life:.48,max:.48});if(impacts.length>85)impacts.shift()}
function popup(x,y,txt,color='#fff1cb'){labels.push({x,y,txt,color,life:.9});if(labels.length>55)labels.shift()}
const originalDamage=takeDamage;takeDamage=function(t,n){if(!t||t.dead||t.alive===false)return;const old=t.hp;originalDamage(t,n);const dmg=Math.max(0,old-t.hp);if(dmg>2){popup(t.x+(Math.random()-.5)*15,t.y-19,'−'+Math.ceil(dmg),t.side===1?'#ffe1b4':'#ffd0da');fx(t.x,t.y,t.side===1?'#9fe5ff':'#f39e93',Math.min(42,12+dmg*.08));cameraKick=Math.min(6,cameraKick+Math.min(2,dmg/120));combo++;comboClock=2.3;}}
const originalSpawn=spawn;spawn=function(c,side,x,y){originalSpawn(c,side,x,y);if(c&&c.type!=='spell'){const u=units[units.length-1];if(u&&u.card?.id===c.id){fx(u.x,u.y,c.color,36,'summon');popup(u.x,u.y-35,c.name,'#f2dfae')}}};
const oldAttack=applyHeroAttack;applyHeroAttack=function(u,t){if(!u||!t)return;oldAttack(u,t);const id=u.card.id;
 if(id==='tereza'){fx(t.x,t.y,'#e6bb79',33,'lasso');}
 if(id==='iara'){fx(t.x,t.y,'#76edff',48,'wave');cameraKick=Math.min(6,cameraKick+1.1)}
 if(id==='jurema'){const ally=units.filter(v=>v.side===u.side&&!v.dead&&v.hp<v.max&&Math.hypot(v.x-u.x,v.y-u.y)<W*.35).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(ally){fx(ally.x,ally.y,'#80e5a1',27,'heal');popup(ally.x,ally.y-26,'✚ CURA','#a5ffc5')}}
 if(id==='pai'){fx(t.x,t.y,'#b5aea0',42,'smoke');popup(t.x,t.y-31,'LENTO','#e9e1ce')}
 if(id==='figueira'){fx(t.x,t.y,'#f36a83',35,'fire');popup(t.x,t.y-31,'QUEIMADURA','#ffb0aa')}
 if(id==='tiriri'){fx(t.x,t.y,'#ef8b9e',30,'chain')}
 if(id==='marinheiro'){fx(t.x,t.y,'#89d8f2',27,'wave')}
};
// Efeitos de velocidade e área são limitados para não transformar as cartas em invencíveis.
const oldUpdate=update;update=function(dt){combatClock+=dt;comboClock=Math.max(0,comboClock-dt);if(comboClock<=0)combo=0;cameraKick=Math.max(0,cameraKick-dt*12);for(const p of impacts)p.life-=dt;for(const p of labels){p.life-=dt;p.y-=dt*19}oldUpdate(dt);for(let i=impacts.length-1;i>=0;i--)if(impacts[i].life<=0)impacts.splice(i,1);for(let i=labels.length-1;i>=0;i--)if(labels[i].life<=0)labels.splice(i,1);status.innerHTML=combo>=5?'⚔ <strong>COMBO '+combo+' GOLPES</strong> · COMBATE INTENSO':'⚔ <strong>ARENA PVP</strong> · '+(battleTime<60?'AXÉ ACELERADO':'DUELO');};
const oldDraw=draw;draw=function(){ctx.save();if(cameraKick>.1)ctx.translate((Math.random()-.5)*cameraKick,(Math.random()-.5)*cameraKick);oldDraw();ctx.restore();ctx.save();for(const p of impacts){const t=1-p.life/p.max;ctx.globalAlpha=Math.min(.85,(1-t)*1.6);ctx.strokeStyle=p.color;ctx.fillStyle=p.color;ctx.lineWidth=p.kind==='wave'?4:2;const radius=p.size*(.25+t*.85);ctx.beginPath();ctx.ellipse(p.x,p.y,radius,radius*(p.kind==='wave'?.42:.65),0,0,Math.PI*2);ctx.stroke();if(p.kind==='wave'){for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(p.x+(i-1)*12,p.y-6,radius*.5,Math.PI*1.05,Math.PI*1.95);ctx.stroke()}}if(p.kind==='smoke'){for(let i=0;i<3;i++){ctx.globalAlpha=.17*(1-t);ctx.beginPath();ctx.arc(p.x+(i-1)*13,p.y-15-t*26,12+t*14,0,7);ctx.fill()}}if(p.kind==='summon'){ctx.beginPath();ctx.ellipse(p.x,p.y,radius*.65,radius*.22,0,0,7);ctx.stroke()}}for(const p of labels){ctx.globalAlpha=Math.min(1,p.life*2);ctx.textAlign='center';ctx.font='900 12px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#06141c';ctx.strokeText(p.txt,p.x,p.y);ctx.fillStyle=p.color;ctx.fillText(p.txt,p.x,p.y)}ctx.restore();};
const oldBattle=startBattle;startBattle=function(){impacts.length=0;labels.length=0;combo=0;combatClock=0;oldBattle()};
// Corrige unidades de suporte: não precisam ficar atacando torres para ajudar o time.
const prevTarget=targetFor;targetFor=function(u){if(u?.card?.id==='jurema'){const damaged=units.filter(v=>v.side===u.side&&v!==u&&!v.dead&&v.hp<v.max*.9&&Math.hypot(v.x-u.x,v.y-u.y)<W*.32).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(damaged)return damaged}return prevTarget(u)};
// Evita que Jurema cause dano ao aliado enquanto aplica sua cura.
const prevShoot=shoot;shoot=function(a,b,damage,color){if(a.card?.id==='jurema'&&b.side===a.side){b.hp=Math.min(b.max,b.hp+Math.max(24,damage));fx(b.x,b.y,'#86e9ac',30,'heal');popup(b.x,b.y-23,'+'+Math.ceil(Math.max(24,damage)),'#a7ffc3');return}prevShoot(a,b,damage,color)};
})();



(function(){'use strict';
const magic=[];let clock=0;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const push=e=>{magic.push(e);if(magic.length>95)magic.shift()};
function foeNear(u,x,y,r){return [...units,...towers].filter(t=>t.side!==u.side&&!t.dead&&t.alive!==false&&Math.hypot(t.x-x,t.y-y)<r)}
function damage(t,n){if(t.dead||t.alive===false)return;takeDamage(t,n)}
function repel(u,t,power){if(!t.card)return;let dx=t.x-u.x,dy=t.y-u.y,d=Math.hypot(dx,dy)||1;const dist=Math.min(W*.13,power);t.x=clamp(t.x+dx/d*dist,17,W-17);t.y=clamp(t.y+dy/d*dist,24,H-24);t.slowTimer=Math.max(t.slowTimer||0,.55)}
const oldShoot=shoot;
shoot=function(a,b,n,color){const id=a.card?.id;
 if(id==='pai'){
  const dx=b.x-a.x,dy=b.y-a.y,ang=Math.atan2(dy,dx),length=Math.hypot(dx,dy);
  push({kind:'smoke',x:a.x,y:a.y,tx:b.x,ty:b.y,ang,life:1.12,max:1.12,side:a.side});
  for(const t of foeNear(a,b.x,b.y,W*.15)){damage(t,Math.max(7,n*.28));repel(a,t,W*.11)}
  sound(115,.35,'triangle',.055,-65);burst(b.x,b.y,'#d3cec2',8);return;
 }
 if(id==='iara'){
  // Encaminha para a mecânica de investida/retorno da V23. Sem furacão.
  oldShoot(a,b,n,color);return;
 }
 if(id==='tiriri'){
  for(let i=0;i<5;i++)push({kind:'bat',x:a.x,y:a.y,tx:b.x,ty:b.y,target:b,source:a,damage:n*.19,life:1.1+i*.07,max:1.1+i*.07,delay:i*.075,seed:i*2.399,hit:false,side:a.side});
  sound(480,.19,'sawtooth',.045,-250);return;
 }
 oldShoot(a,b,n,color);
};
// Tiriri ataca de longe com morcegos, em vez de atingir apenas com golpes corpo a corpo.
const tiriri=CARDS.find(c=>c.id==='tiriri');if(tiriri){tiriri.type='ranged';tiriri.range=118;tiriri.dmg=78;tiriri.rate=1.85;tiriri.hp=525;tiriri.cost=4}
const pai=CARDS.find(c=>c.id==='pai');if(pai){pai.dmg=31;pai.rate=1.85;pai.range=112}
const iara=CARDS.find(c=>c.id==='iara');if(iara){iara.dmg=66;iara.rate=2.2;iara.range=105}
if(HERO_STYLES.tiriri){HERO_STYLES.tiriri.attack='bats';HERO_STYLES.tiriri.ability='Morcegos da sombra';HERO_STYLES.tiriri.desc='Invoca cinco morcegos que voam até o adversário e causam dano.'}
if(HERO_STYLES.pai){HERO_STYLES.pai.attack='smoke';HERO_STYLES.pai.ability='Sopro do cachimbo';HERO_STYLES.pai.desc='Sopra uma nuvem de fumaça que empurra inimigos e causa dano leve.'}
if(HERO_STYLES.iara){HERO_STYLES.iara.attack='waterdash';HERO_STYLES.iara.ability='Investida da rajada';HERO_STYLES.iara.desc='Avança em rajada de água, recua e dispara três esferas aquáticas.'}
const oldUpdate=update;
update=function(dt){clock+=dt;oldUpdate(dt);for(const m of magic){m.life-=dt;if(m.kind==='bat'&&!m.hit){const age=m.max-m.life;if(age<m.delay)continue;const progress=clamp((age-m.delay)/.54,0,1);if(m.target&&!m.target.dead&&m.target.alive!==false){m.tx=m.target.x;m.ty=m.target.y}m.cx=m.x+(m.tx-m.x)*progress+Math.sin(progress*11+m.seed)*14;m.cy=m.y+(m.ty-m.y)*progress+Math.cos(progress*9+m.seed)*10;if(progress>=1){m.hit=true;const target=m.target;if(target&&!target.dead&&target.alive!==false){damage(target,m.damage);burst(target.x,target.y,'#c64765',3)}else{const near=foeNear(m.source,m.tx,m.ty,25)[0];if(near)damage(near,m.damage)}}}}for(let i=magic.length-1;i>=0;i--)if(magic[i].life<=0)magic.splice(i,1)};
function bat(x,y,sz,wing){ctx.save();ctx.translate(x,y);ctx.fillStyle='#250b1e';ctx.strokeStyle='#ed536c';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-sz*.1,0);ctx.quadraticCurveTo(-sz*.6,-sz*(.5+wing),-sz*1.35,-sz*.25);ctx.lineTo(-sz*1.06,sz*.24);ctx.lineTo(-sz*.75,sz*.12);ctx.lineTo(-sz*.5,sz*.5);ctx.lineTo(0,sz*.25);ctx.lineTo(sz*.5,sz*.5);ctx.lineTo(sz*.75,sz*.12);ctx.lineTo(sz*1.06,sz*.24);ctx.lineTo(sz*1.35,-sz*.25);ctx.quadraticCurveTo(sz*.6,-sz*(.5+wing),sz*.1,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ff5672';ctx.fillRect(-sz*.24,-sz*.02,2,2);ctx.fillRect(sz*.15,-sz*.02,2,2);ctx.restore()}
const oldDraw=draw;
draw=function(){oldDraw();ctx.save();for(const m of magic){const age=m.max-m.life,t=clamp(age/m.max,0,1);if(m.kind==='smoke'){
  const distance=Math.hypot(m.tx-m.x,m.ty-m.y),dir=m.ang;ctx.save();ctx.translate(m.x,m.y);ctx.rotate(dir);for(let i=0;i<23;i++){let q=i/23,advance=clamp(t*1.75-q*.33,0,1),xx=distance*q*advance,yy=Math.sin(i*8.2+clock*3)*11*q,rad=(9+q*W*.08)*(1+.28*Math.sin(i*2.4));ctx.globalAlpha=(.12+.23*(1-q))*(1-t*.75);const g=ctx.createRadialGradient(xx,yy,0,xx,yy,rad);g.addColorStop(0,'#f0eee5');g.addColorStop(.55,'#bcbcb8');g.addColorStop(1,'#929a9800');ctx.fillStyle=g;ctx.beginPath();ctx.arc(xx,yy,rad,0,7);ctx.fill()}ctx.restore();
  ctx.save();ctx.translate(m.tx,m.ty);ctx.rotate(dir);ctx.globalAlpha=(1-t)*.65;ctx.strokeStyle='#f4f1e4';ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,14+t*W*.15,-.7+i*.43,.1+i*.43);ctx.stroke()}ctx.restore();
 }else if(m.kind==='vortex'){
  ctx.save();ctx.translate(m.x,m.y);ctx.globalAlpha=clamp(m.life/.27,0,1);const radius=W*(.07+.12*Math.sin(Math.min(t,1)*Math.PI*.8));for(let k=0;k<9;k++){const height=(k-4)*W*.031,rr=radius*(1-Math.abs(k-4)*.12),rot=clock*5+k*.75;ctx.beginPath();ctx.ellipse(Math.sin(rot)*rr*.17,height,rr,rr*.26,rot*.13,0,Math.PI*2);ctx.strokeStyle=k%2?'#bcffff':'#2db9ed';ctx.lineWidth=3.7-k*.13;ctx.shadowColor='#67e9ff';ctx.shadowBlur=11;ctx.stroke();ctx.shadowBlur=0}for(let i=0;i<32;i++){const a=i*2.4+clock*5,rr=radius*(.2+(i%7)/8),h=(i%11-5)*W*.025;ctx.fillStyle=i%3?'#bdfaff':'#49cbf1';ctx.beginPath();ctx.arc(Math.cos(a)*rr,h+Math.sin(a)*rr*.3,1.4+i%3,0,7);ctx.fill()}ctx.restore();
 }else if(m.kind==='bat'){
  if(m.hit)continue;const age=m.max-m.life;if(age<m.delay)continue;ctx.globalAlpha=clamp(m.life/.2,0,1);bat(m.cx??m.x,m.cy??m.y,5.5+Math.sin(clock*9+m.seed)*.7,Math.sin(clock*29+m.seed)*.35);
 }}ctx.restore()};
const previousCollection=renderCollection;renderCollection=function(){previousCollection();};
})();



(function(){'use strict';
const LOGO='https://i.ibb.co/jkCGhXcz/Emblema-Dourado-Reinos-do-Ax.png';
const urls={mata:'https://i.ibb.co/pBk7X3Sf/On-a-tribal-em-ataque-feroz-removebg-preview.png',jurema:'https://i.ibb.co/Vct3SWXh/Xam-Tribal-da-Magia-Verde-removebg-preview.png',iara:'https://i.ibb.co/b5pHt8xz/Sereia-Guerreira-em-F-ria-Aqu-tica-removebg-preview.png',tereza:'https://i.ibb.co/9m5gC51z/Vaqueira-guerreira-sobre-touro-em-a-o-removebg-preview-removebg-preview.png'};
for(const [id,url] of Object.entries(urls)){
 if(ART_HEROES[id])ART_HEROES[id].url=url;
 const im=new Image();im.referrerPolicy='no-referrer';im.src=url;heroImages[id]=im;
}
const brand=document.querySelector('#lobby .brand');if(brand){brand.innerHTML='<img src="'+LOGO+'" alt="Reinos de Axé" onerror="this.style.display=\'none\'">'}
// Corrige o combate: o jogador controla exclusivamente a própria mão; a IA tem sua própria rotação.
let aiHand=[],aiPile=[],aiTime=1.2,aiDifficulty=1,aiMoves=0;
const aiShuffle=a=>shuffle(a.slice());
function initAI(){aiPile=aiShuffle(CARDS.map(c=>c.id));aiHand=aiPile.splice(0,4);aiTime=1.7;aiMoves=0;aiDifficulty=Math.min(3,1+Math.floor(state.trophies/600));}
function lanePressure(lane){const allies=units.filter(u=>u.side===1&&!u.dead&&u.lane===lane);const defenders=units.filter(u=>u.side===0&&!u.dead&&u.lane===lane);return allies.reduce((n,u)=>n+u.hp/u.max*(u.card.cost||3),0)-defenders.reduce((n,u)=>n+u.hp/u.max*(u.card.cost||3),0)}
function aiDecision(){const options=aiHand.map((id,i)=>({c:CARDS.find(c=>c.id===id),i})).filter(o=>o.c&&o.c.cost<=enemyEnergy&&!units.some(u=>u.side===0&&!u.dead&&u.card.id===o.c.id));if(!options.length)return false;
 const pressures=[lanePressure(0),lanePressure(1)];const defenseLane=pressures[0]>pressures[1]?0:1;
 let scored=options.map(o=>{let c=o.c,score=1;let defending=pressures[defenseLane]>2.2;
 if(defending){score+=(c.id==='tereza'||c.id==='pai'||c.id==='tiriri'?3:0);score+=(c.id==='mata'?2:0)}
 else{score+=(c.id==='marinheiro'||c.id==='tereza'||c.id==='mata'?2.4:0);score+=(c.id==='jurema'&&units.some(u=>u.side===0&&!u.dead)?3:0);score+=(c.id==='iara'&&units.some(u=>u.side===1&&!u.dead)?2:0)}
 score+=(c.cost<=enemyEnergy-2?.45:0);score+=Math.random()*(aiDifficulty===1?2.2:aiDifficulty===2?1.2:.55);return {...o,score}}).sort((a,b)=>b.score-a.score);
 const {c,i}=scored[0];const lane=pressures[defenseLane]>2.2?defenseLane:(aiMoves%4===0?1-defenseLane:defenseLane);
 const enemyAdvanced=towers.some(t=>t.side===1&&t.lane===lane&&!t.alive);
 const y=H*(enemyAdvanced?.42:.19)+rnd(-H*.025,H*.025);
 enemyEnergy-=c.cost;spawn(c,0,W*(lane?.77:.23),Math.max(20,y));
 aiHand[i]=aiPile.shift();aiPile.push(c.id);aiMoves++;return true;
}
const oldBattle=startBattle;startBattle=function(){oldBattle();initAI();};
// Efeitos físicos e trajetórias sincronizados com os golpes.
const specials=[];let fxClock=0;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const add=e=>{specials.push(e);if(specials.length>65)specials.shift()};
function impact(t,n,color){if(!t||t.dead||t.alive===false)return;takeDamage(t,n);burst(t.x,t.y,color,9)}
const prevShoot=shoot;
shoot=function(a,b,n,color){if(a.card?.id==='iara'){
 // Iara transforma-se em rajada: investida -> impacto -> retorno -> esferas de água.
 if(!a.dashState&&!a.dead&&b&&!b.dead&&b.alive!==false){
  a.dashState={phase:'forward',time:0,fromX:a.x,fromY:a.y,toX:b.x,toY:b.y,target:b,damage:n};
  add({kind:'surge',source:a,target:b,life:1.5,max:1.5});sound(210,.32,'sawtooth',.06,-110);
 }
 return;
 }
 prevShoot(a,b,n,color);
};
// Laço é lançado visualmente antes de puxar: não ocorre teletransporte instantâneo.
const prevHeroAttack=applyHeroAttack;
applyHeroAttack=function(u,t){
 if(u.card?.id==='tereza'){
  if(t?.card&&!t.dead&&(u.ropeCooldown||0)<=0){
   u.ropeCooldown=5.2;add({kind:'rope',source:u,target:t,life:.85,max:.85,hit:false,fromX:u.x,fromY:u.y,toX:t.x,toY:t.y});
   sound(340,.22,'triangle',.05,-180);
 }
 return;
 }
 if(u.card?.id==='iara')return; // dano vem da investida e das esferas, não de furacão.
 prevHeroAttack(u,t);
};
const oldUpdate=update;
update=function(dt){
 // Impede o bot antigo de invocar cartas aleatórias e dá o mesmo carregamento de Axé aos dois lados.
 oldUpdate(dt);
 aiTime-=dt;
 if(false&&gameOn&&aiTime<=0){aiDecision();aiTime=2.7}
 fxClock+=dt;
 for(const u of units){
  u.ropeCooldown=Math.max(0,(u.ropeCooldown||0)-dt);
  const d=u.dashState;if(!d||u.dead)continue;
  d.time+=dt;
  if(d.phase==='forward'){
   const t=clamp(d.time/.24,0,1);const dest=d.target&&!d.target.dead?d.target:{x:d.toX,y:d.toY};
   u.x=d.fromX+(dest.x-d.fromX)*t;u.y=d.fromY+(dest.y-d.fromY)*t;
   if(t>=1){d.phase='back';d.time=0;
    const targets=[...units,...towers].filter(v=>v.side!==u.side&&!v.dead&&v.alive!==false&&Math.hypot(v.x-u.x,v.y-u.y)<W*.13);
    for(const enemy of targets)impact(enemy,d.damage*(enemy===d.target?.8:.35),'#a8faff');
    add({kind:'splash',x:u.x,y:u.y,life:.55,max:.55});sound(130,.24,'triangle',.08,160);
   }
  }else if(d.phase==='back'){
   const t=clamp(d.time/.27,0,1);u.x=d.toX+(d.fromX-d.toX)*t;u.y=d.toY+(d.fromY-d.toY)*t;
   if(t>=1){d.phase='balls';d.time=0;d.shots=0}
  }else if(d.phase==='balls'){
   if(d.time>=.14&&d.shots<3){d.time=0;d.shots++;let target=d.target&&!d.target.dead&&d.target.alive!==false?d.target:targetFor(u);
    if(target){prevShoot(u,target,d.damage*.25,'#78efff');add({kind:'waterball',x:u.x,y:u.y,tx:target.x,ty:target.y,life:.24,max:.24})}
   }
   if(d.shots>=3){u.dashState=null;u.cd=Math.max(u.cd,.55)}
  }
 }
 for(const e of specials){e.life-=dt;
  if(e.kind==='rope'&&e.source&&!e.source.dead&&e.target&&!e.target.dead){
   e.toX=e.target.x;e.toY=e.target.y;
   const age=e.max-e.life;
   if(age>.32&&!e.hit){e.hit=true;const t=e.target,u=e.source;
    const dx=u.x-t.x,dy=u.y-t.y,dist=Math.hypot(dx,dy)||1;
    const pull=Math.min(W*.16,Math.max(0,dist-15));
    t.x=clamp(t.x+dx/dist*pull,16,W-16);t.y=clamp(t.y+dy/dist*pull,16,H-16);
    t.slowTimer=Math.max(t.slowTimer||0,1.2);impact(t,u.dmg*.28,'#e6c48b');
    add({kind:'ropehit',x:t.x,y:t.y,life:.35,max:.35});sound(145,.2,'triangle',.06,-90);
   }
  }
 }
 for(let i=specials.length-1;i>=0;i--)if(specials[i].life<=0)specials.splice(i,1);
};
const oldDraw=draw;
draw=function(){oldDraw();ctx.save();
 for(const e of specials){const age=e.max-e.life,p=clamp(age/e.max,0,1);ctx.globalAlpha=clamp(e.life/.22,0,1);
  if(e.kind==='rope'&&e.source){
   const x=e.source.x,y=e.source.y,tx=e.toX,ty=e.toY,progress=clamp(age/.32,0,1);
   const endX=x+(tx-x)*progress,endY=y+(ty-y)*progress;
   ctx.strokeStyle='#e5bf82';ctx.lineWidth=3.5;ctx.lineCap='round';ctx.shadowColor='#26190b';ctx.shadowBlur=4;
   ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo((x+endX)/2+Math.sin(p*11)*13,(y+endY)/2-25,endX,endY);ctx.stroke();ctx.shadowBlur=0;
   ctx.beginPath();ctx.ellipse(endX,endY,9,5,Math.atan2(ty-y,tx-x),0,Math.PI*2);ctx.stroke();
   if(e.hit){ctx.strokeStyle='#ffd99b';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(tx,ty,13,7,0,0,7);ctx.stroke()}
  }else if(e.kind==='surge'&&e.source?.dashState){
   const u=e.source,d=u.dashState;ctx.save();ctx.translate(u.x,u.y);ctx.rotate(Math.atan2(d.toY-d.fromY,d.toX-d.fromX));
   for(let i=0;i<6;i++){ctx.strokeStyle=i%2?'#d0ffff':'#33bde8';ctx.lineWidth=2.5+i%2;ctx.beginPath();ctx.moveTo(-26-i*6,-10-i*2);ctx.quadraticCurveTo(-7,Math.sin(fxClock*12+i)*9,14,0);ctx.stroke()}
   ctx.restore();
  }else if(e.kind==='splash'){
   ctx.strokeStyle='#a7faff';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(e.x,e.y,15+p*42,8+p*19,0,0,7);ctx.stroke();
   for(let k=0;k<9;k++){let a=k*Math.PI*2/9;ctx.fillStyle='#7defff';ctx.beginPath();ctx.arc(e.x+Math.cos(a)*(15+p*40),e.y+Math.sin(a)*(9+p*26),3+p*2,0,7);ctx.fill()}
  }else if(e.kind==='waterball'){
   ctx.strokeStyle='#a7ffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x+(e.tx-e.x)*p,e.y+(e.ty-e.y)*p,6,0,7);ctx.stroke();
  }else if(e.kind==='ropehit'){
   ctx.strokeStyle='#edcc8e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,8+p*13,0,7);ctx.stroke();
  }
 }
 ctx.restore();
};
// Não há modo automático para o usuário: fechar a partida encerra sua ação e não aciona cartas.
const oldLeave=leaveBattle;leaveBattle=function(){oldLeave();specials.length=0};
const iara=CARDS.find(c=>c.id==='iara');if(iara){iara.range=100;iara.rate=2.35;iara.dmg=68;iara.speed=34}
if(HERO_STYLES.iara){HERO_STYLES.iara.attack='waterdash';HERO_STYLES.iara.ability='Investida da rajada';HERO_STYLES.iara.desc='Avança como rajada de água, atinge o inimigo, recua e dispara três esferas de água.'}
if(HERO_STYLES.tereza){HERO_STYLES.tereza.ability='Laço da Tereza';HERO_STYLES.tereza.desc='Arremessa o laço visível, prende e puxa o inimigo com recarga de 5 segundos.'}
const oldRenderCollection=renderCollection;renderCollection=function(){oldRenderCollection();};
updateWallet();
})();



(function(){
const logo='https://i.ibb.co/jkCGhXcz/Emblema-Dourado-Reinos-do-Ax.png';
const brand=document.querySelector('#lobby .brand');if(brand){brand.textContent='';const img=document.createElement('img');img.src=logo;img.alt='Reinos de Axé';img.loading='eager';brand.appendChild(img)}
const art={tereza:'https://i.ibb.co/9m5gC51z/Vaqueira-guerreira-sobre-touro-em-a-o-removebg-preview-removebg-preview.png',iara:'https://i.ibb.co/b5pHt8xz/Sereia-Guerreira-em-F-ria-Aqu-tica-removebg-preview.png',jurema:'https://i.ibb.co/Vct3SWXh/Xam-Tribal-da-Magia-Verde-removebg-preview.png',mata:'https://i.ibb.co/pBk7X3Sf/On-a-tribal-em-ataque-feroz-removebg-preview.png'};
for(const [id,url] of Object.entries(art)){if(ART_HEROES[id])ART_HEROES[id].url=url;const image=new Image();image.src=url;heroImages[id]=image;}
if(HERO_STYLES.iara){HERO_STYLES.iara.attack='waterdash';HERO_STYLES.iara.ability='Investida da rajada';HERO_STYLES.iara.desc='Investe como uma rajada de água, recua e lança três esferas aquáticas.'}
if(typeof renderHand==='function'&&document.getElementById('battle').classList.contains('active'))renderHand();
})();



(function(){'use strict';
const additions=[
{id:'rompe',name:'Rompe Mato',emoji:'fa-khanda',cost:4,hp:630,dmg:108,range:29,speed:40,rate:1.28,type:'melee',rarity:'epic',color:'#7edc82',role:'Investida e espada',walk:'charge',attack:'cleave',ability:'Lançada e corte',desc:'Avança com a espada e executa um corte que atinge inimigos próximos.',url:'https://i.ibb.co/q3wW1H72/Guerreiro-Caboclo-Rompe-Mato-em-A-o.png'},
{id:'flechas',name:'Sete Flechas',emoji:'fa-bullseye',cost:4,hp:310,dmg:23,range:142,speed:34,rate:2.4,type:'ranged',rarity:'epic',color:'#60baff',role:'Arqueiro múltiplo',walk:'stalk',attack:'seven',ability:'Tiro das sete flechas',desc:'Dispara uma salva de sete flechas azuis que se distribuem entre os alvos.',url:'https://i.ibb.co/n8gWHYzt/Guerreiro-Arqueiro-Tribal-de-Energia-Azul.png'},
{id:'boiadeiro',name:'Boiadeiro Sete Laços',emoji:'fa-hat-cowboy',cost:5,hp:900,dmg:94,range:31,speed:38,rate:1.35,type:'melee',rarity:'epic',color:'#d8ae76',role:'Boiada',walk:'charge',attack:'cleave',ability:'Estouro da boiada',desc:'Avança com os bois levantando poeira e empurra inimigos com a investida.',url:'https://i.ibb.co/MyrZ6DDx/Vaqueiro-em-Cavalgada-Triunfal-removebg-preview.png'},
{id:'pedrinho',name:'Erê Pedrinho',emoji:'fa-child-reaching',cost:3,hp:290,dmg:39,range:98,speed:57,rate:1.55,type:'ranged',rarity:'',color:'#ffe37d',role:'Distração',walk:'hop',attack:'trick',ability:'Travessura',desc:'Caminha saltitando, espalha piões brilhantes e distrai inimigos.',url:'https://i.ibb.co/fzxnbZHY/Menino-Travesso-em-Salto-M-gico.png'},
{id:'almas',name:'Almas Benditas',emoji:'fa-ghost',cost:4,hp:205,dmg:29,range:100,speed:34,rate:1.55,type:'ranged',rarity:'epic',color:'#80d7ff',role:'Enxame espiritual',walk:'float',attack:'miasma',ability:'Miasmas em conjunto',desc:'Invoca três almas que avançam juntas e expelem miasmas.',url:'https://i.ibb.co/mC6bj0KV/Espectros-Azuis-em-F-ria.png'},
{id:'baiana',name:'Baiana',emoji:'fa-wind',cost:4,hp:520,dmg:67,range:36,speed:30,rate:1.5,type:'melee',rarity:'epic',color:'#e4d8a0',role:'Controle de área',walk:'spin',attack:'gust',ability:'Giro de saia',desc:'Gira a saia e cria ventos que afastam inimigos próximos.',url:'https://i.ibb.co/NdZxS32S/Sacerdotisa-Afro-Brasileira-em-Invoca-o.png'},
{id:'tranca',name:'Exu Tranca-Ruas',emoji:'fa-key',cost:4,hp:750,dmg:77,range:29,speed:32,rate:1.38,type:'melee',rarity:'epic',color:'#ee5367',role:'Defesa',walk:'mist',attack:'curse',ability:'Névoa da encruzilhada',desc:'Flutua sobre neblina vermelha, resiste a ataques e desacelera inimigos.',url:'https://i.ibb.co/j9K0BJPQ/Guardi-o-Tranca-Ruas-em-F-ria-Crimson.png'},
{id:'padilha',name:'Maria Padilha',emoji:'fa-fan',cost:4,hp:390,dmg:67,range:112,speed:33,rate:1.42,type:'ranged',rarity:'legend',color:'#ff688e',role:'Rosas encantadas',walk:'mist',attack:'roses',ability:'Redemoinho de rosas',desc:'Flutua em neblina vermelha e lança rosas encantadas que atingem inimigos próximos.',url:'https://i.ibb.co/xSHMJdMz/Feiticeira-das-Rosas-em-Movimento.png'},
{id:'mironga',name:'Pó de Mironga',emoji:'fa-mortar-pestle',cost:3,hp:0,dmg:0,range:0,speed:0,rate:0,type:'spell',rarity:'epic',color:'#a4a0f4',role:'Magia de controle',walk:'',attack:'',ability:'Lentidão',desc:'Reduz a velocidade de movimento dos inimigos em uma área por 4 segundos.',url:'https://i.ibb.co/3y9zSqXD/Caldeir-o-M-stico-de-P-de-Mironga.png'},
{id:'dende',name:'Dendê',emoji:'fa-flask',cost:3,hp:0,dmg:0,range:0,speed:0,rate:0,type:'spell',rarity:'epic',color:'#ffad35',role:'Magia de apoio',walk:'',attack:'',ability:'Agilidade do dendê',desc:'Aumenta a velocidade de ataque das tropas aliadas em uma área por 5 segundos.',url:'https://i.ibb.co/dwRsvCZ7/Po-o-Dourada-em-Espiral-M-gica.png'},
{id:'brasa',name:'Caldeirão de Brasa',emoji:'fa-fire',cost:4,hp:0,dmg:80,range:0,speed:0,rate:0,type:'spell',rarity:'epic',color:'#ff793e',role:'Magia de dano',walk:'',attack:'',ability:'Brasa de fogo',desc:'Causa dano em área e deixa brasas que queimam inimigos por 4 segundos.',url:'https://i.ibb.co/5hrszHGX/Caldeir-o-Ancestral-em-Chamas.png'}
];
for(const h of additions){const {url,role,walk,attack,ability,desc,...card}=h;const i=CARDS.findIndex(c=>c.id===h.id);if(i>=0)CARDS[i]=card;else CARDS.push(card);ART_HEROES[h.id]={url,name:h.name,role,kind:h.type==='spell'?'spell':'warrior'};HERO_STYLES[h.id]={walk,attack,ability,desc};const img=new Image();img.src=url;heroImages[h.id]=img}
const allIds=new Set(CARDS.map(c=>c.id));state.owned=[...allIds];
const originalEight=['jurema','tereza','iara','mata','pai','figueira','tiriri','marinheiro'];
const priorDeck=Array.isArray(state.deck)?state.deck.filter(id=>allIds.has(id)):[];
state.deck=[...new Set([...priorDeck,...originalEight])].slice(0,8);
if(state.deck.length<8)state.deck=[...new Set([...state.deck,...CARDS.map(c=>c.id)])].slice(0,8);
state.decks=Array.from({length:5},(_,i)=>{const d=(state.decks?.[i]||[]).filter(id=>allIds.has(id));return [...new Set([...d,...state.deck])].slice(0,8)});
state.decks[0]=state.deck.slice();save();
const spellZones=[];
const previousSpawn=spawn;
spawn=function(card,side,x,y){
 if(['mironga','dende','brasa'].includes(card?.id)){
  const radius=W*.23,duration=card.id==='dende'?5:4;
  spellZones.push({id:card.id,side,x,y,radius,time:duration,max:duration,tick:0});
  burst(x,y,card.color,32);sound(490,.25,'triangle',.08);return;
 }
 const before=units.length;previousSpawn(card,side,x,y);
 if(card?.id==='almas'&&units.length>before){const main=units[units.length-1];for(let i=0;i<2;i++){const copy={...main,x:main.x+(i?19:-19),y:main.y+(i?12:-12),walk:rnd(0,7),cd:rnd(.3,.9),hp:main.hp,max:main.max};units.push(copy)}burst(main.x,main.y,'#8bdcff',16)}
};
const previousAttack=applyHeroAttack;
applyHeroAttack=function(u,t){
 const id=u.card.id;
 if(id==='flechas'){const candidates=[t,...units.filter(v=>v.side!==u.side&&!v.dead&&v!==t&&Math.hypot(v.x-u.x,v.y-u.y)<W*.48)];for(let i=0;i<6;i++){const dest=candidates[i%candidates.length];shoot(u,dest,u.dmg,'#66c6ff')}burst(u.x,u.y,'#62baff',14);return}
 if(id==='rompe'){units.filter(v=>v.side!==u.side&&!v.dead&&v!==t&&Math.hypot(v.x-t.x,v.y-t.y)<W*.13).slice(0,2).forEach(v=>takeDamage(v,u.dmg*.48));burst(t.x,t.y,'#9aff93',13);return}
 if(id==='boiadeiro'){if(t.card){t.y+=u.side===1?-W*.055:W*.055}burst(u.x,u.y,'#caa579',13);return}
 if(id==='pedrinho'){if(t.card){t.slowTimer=Math.max(t.slowTimer||0,1.5);t.cd=Math.max(t.cd||0,.5)}burst(t.x,t.y,'#ffe46d',10);return}
 if(id==='almas'){t.slowTimer=Math.max(t.slowTimer||0,.65);burst(t.x,t.y,'#88c7fa',9);return}
 if(id==='baiana'){for(const v of units.filter(v=>v.side!==u.side&&!v.dead&&Math.hypot(v.x-u.x,v.y-u.y)<W*.16)){if(v!==t)takeDamage(v,u.dmg*.3);v.y+=u.side===1?-W*.06:W*.06}burst(u.x,u.y,'#fff2c2',18);return}
 if(id==='tranca'){t.slowTimer=Math.max(t.slowTimer||0,1.8);burst(t.x,t.y,'#f14a65',8);return}
 if(id==='padilha'){units.filter(v=>v.side!==u.side&&!v.dead&&v!==t&&Math.hypot(v.x-t.x,v.y-t.y)<W*.13).slice(0,2).forEach(v=>takeDamage(v,u.dmg*.36));burst(t.x,t.y,'#ff5c91',14);return}
 previousAttack(u,t);
};
const previousUpdate=update;
update=function(dt){
 for(let i=spellZones.length-1;i>=0;i--){const z=spellZones[i];z.time-=dt;z.tick+=dt;
  for(const u of units){if(u.dead||Math.hypot(u.x-z.x,u.y-z.y)>z.radius)continue;
   if(z.id==='mironga'&&u.side!==z.side)u.slowTimer=Math.max(u.slowTimer||0,.35);
   if(z.id==='dende'&&u.side===z.side)u.dendeBoost=Math.max(u.dendeBoost||0,.28);
   if(z.id==='brasa'&&u.side!==z.side)u.burn=Math.max(u.burn||0,.3);
  }
  if(z.id==='brasa'&&z.tick>=.5){z.tick=0;for(const t of [...units,...towers])if(t.side!==z.side&&!t.dead&&t.alive!==false&&Math.hypot(t.x-z.x,t.y-z.y)<z.radius)takeDamage(t,14)}
  if(z.time<=0)spellZones.splice(i,1);
 }
 const boosted=[];for(const u of units){if(u.dendeBoost>0){u.dendeBoost-=dt;boosted.push([u,u.card.rate]);u.card.rate*=.72}}
 try{previousUpdate(dt)}finally{for(const [u,rate] of boosted)u.card.rate=rate}
};
const previousDraw=draw;
draw=function(){previousDraw();ctx.save();for(const z of spellZones){const alpha=Math.min(.5,z.time/z.max*.5);ctx.globalAlpha=alpha;const colors={mironga:'#a2a1f6',dende:'#ffad2f',brasa:'#ff4e23'};ctx.fillStyle=colors[z.id];ctx.strokeStyle=colors[z.id];ctx.lineWidth=3;ctx.beginPath();ctx.arc(z.x,z.y,z.radius,0,Math.PI*2);ctx.fill();ctx.stroke();for(let k=0;k<9;k++){const a=k*6.283/9+performance.now()*.001;ctx.beginPath();ctx.arc(z.x+Math.cos(a)*z.radius*.75,z.y+Math.sin(a)*z.radius*.75,3,0,7);ctx.fill()}}ctx.restore()};
const previousFighter=drawFighter;
drawFighter=function(u,r){const id=u.card.id,t=performance.now()*.001;
 ctx.save();if(id==='pedrinho')ctx.translate(0,-Math.abs(Math.sin(t*8+u.walk))*r*.35);
 if(id==='baiana'){
  // Passos de dança com balanço lateral; giro completo apenas no ataque.
  const step=Math.sin(u.walk*.65);
  ctx.translate(step*r*.13,-Math.abs(Math.sin(u.walk*.42))*r*.075);
  ctx.rotate((u.attackPose>0 ? Math.sin((.32-u.attackPose)*15)*.48 : Math.sin(u.walk*.42)*.065));
  ctx.strokeStyle='#e7e1c4aa';ctx.lineWidth=2;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,r*.38,r*(.8+i*.22),Math.PI*.1+t*.35,Math.PI*.85+t*.35);ctx.stroke()}
 }
 if(id==='tranca'){
  // Flutuação lenta, imponente, sem passadas nem tremedeira.
  ctx.translate(0,-r*.16-Math.sin(t*2.1+u.walk*.13)*r*.12);
  ctx.rotate(Math.sin(t*1.2)*.018);
 }
 if(id==='tranca'||id==='padilha'){
  ctx.fillStyle=id==='tranca'?'#a8194760':'#ff457766';
  for(let i=0;i<6;i++){
   const drift=Math.sin(t*(id==='tranca'?1.35:2.2)+i*1.3);
   ctx.beginPath();ctx.ellipse(drift*r*(.4+i*.15),r*(.7+i*.11)+Math.cos(t*1.6+i)*r*.11,r*(.55+i*.1),r*.17,0,0,Math.PI*2);ctx.fill();
  }
 }
 if(id==='boiadeiro'){
  // Nuvem de poeira e cascalho acompanhando a cavalgada.
  for(let i=0;i<13;i++){
   const phase=t*2.7+i*2.399,spread=(i%5+1)*r*.28;
   ctx.fillStyle=i%3===0?'#e0bb8655':i%3===1?'#a27c5266':'#c9a77b55';
   ctx.beginPath();ctx.arc(Math.sin(phase)*spread,r*(.6+i%4*.18)+Math.cos(phase*.8)*r*.18,r*(.10+(i%4)*.06),0,Math.PI*2);ctx.fill();
  }
 }
 previousFighter(u,r);ctx.restore()};
const previousStart=startBattle;startBattle=function(){spellZones.length=0;previousStart()};
const previousLeave=leaveBattle;leaveBattle=function(){spellZones.length=0;previousLeave()};
renderCollection();updateWallet();
})();



(function(){'use strict';
const names=['LuaDoDende','SeteEncruzas','CabocloVento','FlorDeJurema','AxéViajante','RosaDoOriente','FilhoDaMata','EstrelaDaGuia','PedraDeFogo','BrisaDaSerra','MaréDeOuro','FlechaSagrada','CruzeiroVivo','VentoDeIansã','RaizDoAxé','ChamaAncestral','BoiadaLivre','MestreDaLua','SolDeArimateia','GiraDaNoite','ArcoDoDestino','GuardaDasOndas'];
let profile=null,skill=0,style='balanced',aiDeck=[];
const prevStart=startBattle;
startBattle=function(){
 const realm=Math.max(0,Math.min(6,typeof chosenRealm==='number'?chosenRealm:0));
 const seed=Math.floor(Math.random()*10000),name=names[Math.floor(Math.random()*names.length)]+(10+seed%89);
 skill=Math.max(0,Math.min(1,realm*.145+Math.min(.12,state.trophies/12000)));
 style=['defender','aggressive','counter','balanced'][Math.floor(Math.random()*4)];
 const realmCards=CARDS.filter(c=>c.type!=='spell');
 const order=realmCards.map(c=>({c,score:Math.random()*3+(c.type==='ranged'?1:0)+(style==='defender'&&c.hp>500?2:0)+(style==='aggressive'&&c.speed>35?2:0)+(style==='counter'&&c.range>90?2:0)})).sort((a,b)=>b.score-a.score);
 aiDeck=order.slice(0,Math.min(8,order.length)).map(v=>v.c.id);
 const spells=CARDS.filter(c=>c.type==='spell');if(spells.length&&aiDeck.length>=7)aiDeck[7]=spells[seed%spells.length].id;
 profile={name,realm,style,rank:Math.max(1,realm*4+1+seed%4),deck:aiDeck.slice()};
 prevStart();
 document.getElementById('enemyName').textContent=profile.name;
 document.getElementById('enemyRank').textContent='Reino de '+REALMS[realm][1]+' · Grau '+profile.rank;
 };
 // Each opponent owns a distinct deck and a stable cycle. Never borrow the player's hand.
 const oldUpdate=update;
 let think=0,sequence=[],cycle=[],aiLast=0;
 const oldBattle=startBattle;
 startBattle=function(){oldBattle();cycle=shuffle(aiDeck.slice());sequence=cycle.splice(0,Math.min(4,cycle.length));think=1.1+Math.random();aiLast=0;};
 // Disable the older AI's separate decision routine by preserving its normal
 // combat update while preventing its timer from reaching zero.
 update=function(dt){oldUpdate(dt);if(!gameOn||!profile)return;
 think-=dt;if(think>0)return;
 const delay=2.5-skill*.85+(Math.random()-.5)*(1.3-skill*.6);think=Math.max(.85,delay);
 const avail=sequence.map((id,i)=>({c:CARDS.find(c=>c.id===id),i})).filter(o=>o.c&&o.c.cost<=enemyEnergy);
 if(!avail.length)return;
 const laneThreat=[0,1].map(l=>units.filter(u=>u.side===1&&!u.dead&&u.lane===l).reduce((v,u)=>v+(u.hp/Math.max(1,u.max))*(u.card.cost||3),0));
 const laneFriend=[0,1].map(l=>units.filter(u=>u.side===0&&!u.dead&&u.lane===l).reduce((v,u)=>v+(u.hp/Math.max(1,u.max))*(u.card.cost||3),0));
 const threatened=laneThreat[0]-laneFriend[0]>laneThreat[1]-laneFriend[1]?0:1;
 let lane=threatened;
 if(style==='aggressive'&&laneThreat[threatened]<3)lane=laneFriend[0]>laneFriend[1]?0:1;
 if(Math.random()<.24-skill*.13)lane=1-lane;
 const defending=laneThreat[threatened]-laneFriend[threatened]>1.8;
 const scored=avail.map(o=>{let c=o.c,s=Math.random()*(2.3-skill*1.9);const allies=units.filter(u=>u.side===0&&!u.dead&&u.lane===lane),foes=units.filter(u=>u.side===1&&!u.dead&&u.lane===lane);const tank=allies.some(u=>u.card.hp>=500),swarm=foes.filter(u=>u.hp<300).length>=2;const nearest=foes.reduce((v,u)=>Math.min(v,Math.abs(u.y-H*.23)),H);if(defending){s+=c.hp>500?2.3:0;s+=c.type==='ranged'&&tank?2.4:0;s+=c.type==='spell'&&foes.length>=2?3.5:-2;s+=c.range>W*.28?1.4:0;s+=swarm&&c.type==='ranged'?1.3:0}else{s+=c.hp>550&&!tank?2.7:0;s+=c.type==='ranged'&&tank?3.1:0;s+=c.speed>35&&style==='aggressive'?1.6:0;s+=c.type==='spell'&&foes.length>=2?2:-2.4;s+=c.hp<300&&tank?1.1:0}if(c.cost>enemyEnergy-1)s-=1.2*skill;if(enemyEnergy>=8)s+=c.cost*.23;if(nearest<H*.13&&c.type==='ranged')s+=1.2;return {...o,score:s}}).sort((a,b)=>b.score-a.score);
 // Humanlike variation: some pauses, but higher realms react more reliably.
 if(Math.random()<.10-skill*.07)return;
 const {c,i}=scored[0];let x=W*(lane?.77:.23),advanced=towers.some(t=>t.side===1&&t.lane===lane&&!t.alive);
 let y=c.type==='spell'?(units.filter(u=>u.side===1&&!u.dead&&u.lane===lane).sort((a,b)=>b.hp-a.hp)[0]?.y||H*.72):H*(advanced?.39:.255)+(Math.random()-.5)*H*.045;
 enemyEnergy-=c.cost;spawn(c,0,x,y);
 sequence[i]=cycle.shift()||c.id;cycle.push(c.id);aiLast++;
 };
 const modal=document.querySelector('#opponentModal .modal .small');if(modal)modal.textContent='Perfil de um adversário do universo Reinos de Axé. Esta versão utiliza partidas locais contra inteligência artificial, sem multiplayer online.';
 const prevProfile=showOpponent;
 showOpponent=function(){prevProfile();if(!profile)return;document.getElementById('opponentInfo').innerHTML='<i class="fa-solid fa-ranking-star"></i> Grau '+profile.rank+'<br><i class="fa-solid fa-dungeon"></i> Reino de '+REALMS[profile.realm][1]+'<br><i class="fa-solid fa-users"></i> Corrente: '+profile.deck.map(id=>CARDS.find(c=>c.id===id)?.name||id).join(' · ')};
})();



(function(){'use strict';
const originalFighter=drawFighter;
// Consistent sprite bounding box regardless of the original PNG's aspect ratio.
drawFighter=function(u,r){const img=heroImages[u.card.id];if(img&&img.complete&&img.naturalWidth){const size=Math.max(35,Math.min(51,W*.125));const scale=Math.min(size/img.naturalWidth,size/img.naturalHeight);const w=img.naturalWidth*scale,h=img.naturalHeight*scale;ctx.save();const sway=Math.sin(u.walk)*1.0;ctx.translate(0,sway);if(u.side===0)ctx.scale(1,-1);ctx.drawImage(img,-w/2,-h*.76,w,h);ctx.restore();return;}originalFighter(u,r)};
// A dark-fantasy battlefield with cinematic depth, independent of the original arena geometry.
drawAxeArena=function(){
 const time=performance.now()*.001,realm=typeof chosenRealm==='number'?chosenRealm:0;
 const palettes=[['#182522','#364b40','#a6b39a'],['#17291e','#42583b','#a7bd80'],['#292b30','#55575c','#c4b79b'],['#32271f','#655140','#e0ae74'],['#202b33','#4e6873','#a3c7c8'],['#302637','#584864','#b7a2c7'],['#202533','#46536b','#b7c5df']];
 const [dark,mid,light]=palettes[Math.min(6,Math.max(0,realm))];
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b131a');g.addColorStop(.23,dark);g.addColorStop(.54,mid);g.addColorStop(.8,dark);g.addColorStop(1,'#0b131a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 // Stonework in receding perspective: broad irregular flagstones, not a checkerboard.
 const rand=n=>{let x=Math.sin(n*78.233+realm*14.7)*43758.5453;return x-Math.floor(x)};
 for(let row=0;row<35;row++){const y=H*row/35,ny=H*(row+1)/35;const depth=.7+Math.abs(y/H-.5)*.8;const count=7+Math.floor(depth*3);for(let col=0;col<count;col++){const x=W*(col+rand(row*51+col)*.14)/count;const x2=W*(col+1+rand(row*73+col)*.1)/count;ctx.beginPath();ctx.moveTo(x,y+rand(row*7+col)*3);ctx.lineTo(x2,y);ctx.lineTo(x2-3,ny);ctx.lineTo(x+3,ny);ctx.closePath();ctx.fillStyle=rand(row*21+col)>.5?'#b8aa8930':'#060d153b';ctx.fill();ctx.strokeStyle='#080d12a0';ctx.lineWidth=1.25;ctx.stroke();}}
 // Two ruined stone arcades frame the battleground, with volumetric shadows.
 for(const side of [-1,1]){ctx.save();if(side===1){ctx.translate(W,0);ctx.scale(-1,1)}const wall=ctx.createLinearGradient(0,0,W*.12,0);wall.addColorStop(0,'#050b0f');wall.addColorStop(.55,'#29312f');wall.addColorStop(1,'#64706733');ctx.fillStyle=wall;ctx.fillRect(0,0,W*.105,H);for(let k=0;k<9;k++){const y=k*H/8;ctx.fillStyle='#78827626';ctx.fillRect(0,y,W*.095,3);ctx.fillStyle='#03090c77';ctx.fillRect(W*.07,y+3,4,H/8-4)}ctx.restore()}
 // Ancient engraved circular sigil with worn metal inlay.
 ctx.save();ctx.translate(W*.5,H*.51);ctx.scale(1,.55);for(let j=0;j<3;j++){ctx.beginPath();ctx.arc(0,0,W*(.20+j*.043),0,Math.PI*2);ctx.strokeStyle=j===1?'#d9ba7880':'#111918b8';ctx.lineWidth=j===1?2:7;ctx.stroke()}for(let j=0;j<8;j++){const a=j*Math.PI/4+time*.015;ctx.beginPath();ctx.moveTo(Math.cos(a)*W*.12,Math.sin(a)*W*.12);ctx.lineTo(Math.cos(a+.48)*W*.19,Math.sin(a+.48)*W*.19);ctx.strokeStyle='#c9a76d55';ctx.lineWidth=2;ctx.stroke()}ctx.restore();
 // Torchlight and low-lying mist provide atmospheric depth.
 for(const x of [W*.09,W*.91])for(const y of [H*.31,H*.7]){const halo=ctx.createRadialGradient(x,y,1,x,y,W*.19);halo.addColorStop(0,'#ffc2773b');halo.addColorStop(.4,'#e68c3920');halo.addColorStop(1,'#ff9b2800');ctx.fillStyle=halo;ctx.fillRect(x-W*.2,y-W*.2,W*.4,W*.4);ctx.fillStyle='#f4c07a';ctx.beginPath();ctx.ellipse(x,y+Math.sin(time*3+x)*2,2,6,0,0,7);ctx.fill()}
 for(let i=0;i<11;i++){const y=H*(.1+i*.085);const x=Math.sin(time*.25+i*1.8)*W*.09;const mist=ctx.createLinearGradient(0,y-12,0,y+20);mist.addColorStop(0,'#b5c8bf00');mist.addColorStop(.5,'#b5c8bf0c');mist.addColorStop(1,'#b5c8bf00');ctx.fillStyle=mist;ctx.fillRect(x,y,W*.9,32)}
 const shade=ctx.createRadialGradient(W*.5,H*.5,W*.13,W*.5,H*.5,H*.79);shade.addColorStop(0,'#00000000');shade.addColorStop(1,'#03070ac9');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
};
})();



(function(){'use strict';
// RPG presentation layer. Keep every hero upright: never mirror on the Y axis.
const priorFighterV31=drawFighter;
const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const phaseFor=u=>((u.x*13.17+u.y*7.3)%6.28);
function ellipse(x,y,rx,ry,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),0,0,Math.PI*2);ctx.fill()}
function line(x1,y1,x2,y2,stroke,width){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
drawFighter=function(u,r){
 const img=heroImages[u.card.id];if(!(img&&img.complete&&img.naturalWidth&&img.naturalHeight)){priorFighterV31(u,r);return}
 const t=performance.now()*.001,seed=phaseFor(u),walking=Math.min(1,Math.abs(u.card.speed||25)/50);
 // 22-30% larger than V30; consistent full-body image box for all cards.
 const box=Math.max(47,Math.min(67,W*.158));const scale=Math.min(box/img.naturalWidth,box/img.naturalHeight);
 const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
 const flying=['iara','almas','tranca','padilha'].includes(u.card.id);
 const hopping=u.card.id==='pedrinho';const idle=reduceMotion?0:Math.sin(t*(hopping?8:3.2)+seed);
 const lift=hopping?Math.abs(idle)*7:flying?4+idle*3:Math.abs(idle)*walking*1.8;
 const attacking=u.attackPose>0;
 ctx.save();
 // Ground contact and depth cues are independent from sprite orientation.
 ellipse(0,r*.9,Math.max(11,w*.39),Math.max(3,w*.105),'#020608a6');
 if(flying){const hue=u.card.id==='almas'?'92,202,255':u.card.id==='iara'?'74,205,244':'235,51,78';
  for(let i=0;i<4;i++){const dx=Math.sin(t*1.9+seed+i*1.8)*(9+i*2);ellipse(dx,r*.7+i*2,9+i*3,3+i*.8,`rgba(${hue},${.12-i*.02})`)}
 }
 if(u.card.id==='boiadeiro'&&!reduceMotion){for(let i=0;i<9;i++){const a=t*1.5+i*2.3;ellipse(Math.sin(a)*box*.6,r*.8+Math.cos(a*.8)*8,2+i%3*1.7,1.5+i%3,'#c9a37758')}}
 if(u.card.id==='baiana'){
  // Dance uses gentle skirt sway, not continuous spinning or inversion.
  for(let i=0;i<3;i++){ctx.strokeStyle=['#f7e5ae77','#d6efff55','#fff5d455'][i];ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,r*.56,box*(.33+i*.095),box*(.12+i*.025),Math.sin(t*1.4)*.12,Math.PI*.1,Math.PI*.9);ctx.stroke()}
 }
 ctx.translate(0,-lift);
 // A very small tilt makes sprites feel alive without rotating upside-down.
 const lean=reduceMotion?0:Math.sin(t*2.5+seed)*.022+(attacking?Math.sin(t*12)*.045:0);
 ctx.rotate(lean);
 // Side changes only the direction of gaze for original artwork; do not flip Y.
 ctx.drawImage(img,-w*.5,-h*.81,w,h);
 if(attacking&&!reduceMotion){ctx.save();ctx.globalCompositeOperation='screen';ctx.strokeStyle=u.card.color||'#ffda8b';ctx.lineWidth=2;ctx.globalAlpha=.48;ctx.beginPath();ctx.arc(0,-h*.33,box*.39,-1.5,.5);ctx.stroke();ctx.restore()}
 ctx.restore();
};
// Extra battle atmosphere and art direction; no gameplay rules changed.
const prevArenaV31=drawAxeArena;
drawAxeArena=function(){prevArenaV31();const t=performance.now()*.001;
 ctx.save();
 // Asymmetric moss, fractures, gold veins, embers: a unique ancestral citadel.
 for(let i=0;i<125;i++){
  const f=Math.sin(i*127.13)*43758.5453,fx=f-Math.floor(f);
  const g=Math.sin(i*73.77+9)*14591.29,fy=g-Math.floor(g);
  const x=fx*W,y=fy*H;const edge=Math.min(x,W-x)/W;
  if(edge<.19){ellipse(x,y,1.5+(i%4)*1.2,.8+(i%3)*.9,i%4===0?'#a8a06a43':'#4a74533c')}
  else if(i%4===0){line(x,y,x+W*.018,y-H*.009,i%3===0?'#bdab7850':'#080d0f78',.7)}
 }
 // Four original obelisks marking the warding circle.
 for(const [x,y] of [[W*.16,H*.16],[W*.84,H*.16],[W*.16,H*.84],[W*.84,H*.84]]){
  ellipse(x+3,y+8,W*.044,H*.018,'#0009');
  ctx.fillStyle='#121d21';ctx.beginPath();ctx.moveTo(x-W*.023,y+H*.027);ctx.lineTo(x-W*.019,y-H*.022);ctx.lineTo(x,y-H*.048);ctx.lineTo(x+W*.022,y-H*.022);ctx.lineTo(x+W*.023,y+H*.027);ctx.closePath();ctx.fill();
  line(x,y-H*.034,x,y+H*.01,'#bdab76a8',1.5);
  const glow=ctx.createRadialGradient(x,y-H*.035,1,x,y-H*.035,W*.11);glow.addColorStop(0,'#71d7d144');glow.addColorStop(1,'#71d7d100');ctx.fillStyle=glow;ctx.fillRect(x-W*.11,y-H*.035-W*.11,W*.22,W*.22)
 }
 if(!reduceMotion){
  for(let i=0;i<24;i++){const x=((i*79.7+Math.sin(t*.24+i)*16)%W+W)%W,y=((i*113.3-t*(5+i%5))%H+H)%H;ellipse(x,y,1+i%3*.35,1+i%3*.35,i%3===0?'#f3c47b8c':'#8be1d777')}
 }
 ctx.restore();
};
// Minor reactive screen feedback without changing battle positions or hitboxes.
const prevDrawV31=draw;
draw=function(){prevDrawV31();if(!gameOn)return;const t=performance.now()*.001;ctx.save();
 const pulse=.12+.07*Math.sin(t*2.1);const aura=ctx.createRadialGradient(W*.5,H*.5,4,W*.5,H*.5,W*.42);aura.addColorStop(0,`rgba(217,185,116,${pulse*.19})`);aura.addColorStop(1,'rgba(217,185,116,0)');ctx.fillStyle=aura;ctx.fillRect(0,0,W,H);
 ctx.restore()};
})();



(function(){'use strict';
// V32: tactical sanctuary range + distinct cinematic spell/hero visuals.
const fx=[];let previousFrame=performance.now();
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const add=(type,x,y,color,side=1,scale=1)=>{if(fx.length>115)fx.splice(0,fx.length-115);fx.push({type,x,y,color,side,scale,t:0,d:type==='ward'?1.25:type==='ring'?.7:type==='rune'?.9:.55})};
const originalAttack=applyHeroAttack;
applyHeroAttack=function(u,t){
 originalAttack(u,t);
 const id=u.card.id,atk=fighterStyle(u).attack;
 const colors={flechas:'#72caff',rompe:'#e9cf91',rompemato:'#e9cf91',boiadeiro:'#d9ad6b',pedrinho:'#ffc9f1',almas:'#99c8fa',baiana:'#efffff',tranca:'#e63255',padilha:'#fc547d',jurema:'#8af3b1',pai:'#f9e6b1',iara:'#6fe8ff',tiriri:'#bb79fa',marinheiro:'#7acbff'};
 const c=colors[id]||u.card.color||'#f3d59a';
 if(['baiana','iansa'].includes(id)||atk==='gust'){add('wind',u.x,u.y,c,u.side,1.5);add('ring',t.x,t.y,c,u.side,1)}
 else if(['tranca','padilha','figueira'].includes(id)){add('rune',t.x,t.y,c,u.side,1.2);add('embers',u.x,u.y,c,u.side,1)}
 else if(['jurema','pai'].includes(id)){add('ward',u.x,u.y,c,u.side,1.1)}
 else if(['flechas','seteflechas'].includes(id)){add('arrows',t.x,t.y,c,u.side,1.2)}
 else if(['almas','tiriri'].includes(id)){add('miasma',t.x,t.y,c,u.side,1.25)}
 else if(['boiadeiro','tereza'].includes(id)){add('dust',t.x,t.y,c,u.side,1.3)}
 else if(['pedrinho'].includes(id)){add('stars',t.x,t.y,c,u.side,1.2)}
 else if(['iara','marinheiro','iemanja'].includes(id)){add('water',t.x,t.y,c,u.side,1.3)}
 else if(['rompe','rompemato','ogum'].includes(id)){add('slash',t.x,t.y,c,u.side,1.3)}
 else if(['xango'].includes(id)){add('lightning',t.x,t.y,c,u.side,1.2)}
 else add('ring',t.x,t.y,c,u.side,.75);
};
const oldSpawn=spawn;
spawn=function(card,side,x,y){const before=units.length;oldSpawn(card,side,x,y);if(card.type==='spell'){
 const id=card.id;
 add(id.includes('dende')?'ward':id.includes('mironga')?'miasma':id.includes('brasa')?'embers':'rune',x,y,card.color||'#e8c68c',side,2.4);
 add('ring',x,y,card.color||'#e8c68c',side,2);
}else if(units.length>before){const u=units[units.length-1];add('rune',u.x,u.y,u.card.color||'#e7c48a',side,.7)}};
const oldShoot=shoot;
shoot=function(a,b,damage,color){oldShoot(a,b,damage,color);if(a.card?.id==='flechas'){
 // A single gameplay volley, seven visible trails; avoids multiplying damage by seven.
 const dx=b.x-a.x,dy=b.y-a.y;
 for(let k=-3;k<=3;k++){
 const px=b.x+(-dy/(Math.hypot(dx,dy)||1))*k*4,py=b.y+(dx/(Math.hypot(dx,dy)||1))*k*4;
 add('arrowtrail',px,py,'#8ad9ff',a.side,.8)
 }
 }};
function paint(e){const p=Math.min(1,e.t/e.d),a=1-p,x=e.x,y=e.y,r=(13+45*p)*e.scale;
 ctx.save();ctx.globalAlpha=Math.max(0,a)*.85;ctx.lineCap='round';ctx.lineJoin='round';
 const glow=(color,blur=15)=>{ctx.shadowColor=color;ctx.shadowBlur=blur};
 const ring=(radius,flatten=.4)=>{ctx.beginPath();ctx.ellipse(x,y,radius,radius*flatten,0,0,Math.PI*2);ctx.stroke()};
 ctx.strokeStyle=e.color;ctx.fillStyle=e.color;ctx.lineWidth=Math.max(1,3*(1-p));glow(e.color);
 if(e.type==='ring'||e.type==='water'||e.type==='ward'||e.type==='wind'){ring(r,e.type==='wind'?.6:.34);if(e.type!=='ring'){ring(r*.65,.32);if(e.type==='ward'){ctx.setLineDash([4,5]);ring(r*1.15,.35);ctx.setLineDash([])}if(e.type==='wind'){for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(x,y-r*.15,r*.55+i*4,-2+p*2,1.1+p*2);ctx.stroke()}}}}
 else if(e.type==='rune'){ring(r*.85,.45);for(let k=0;k<7;k++){const th=k*Math.PI*2/7+p;ctx.beginPath();ctx.moveTo(x+Math.cos(th)*r*.6,y+Math.sin(th)*r*.25);ctx.lineTo(x+Math.cos(th)*r*.94,y+Math.sin(th)*r*.43);ctx.stroke()}}
 else if(e.type==='slash'){ctx.lineWidth=5*(1-p)+1;ctx.beginPath();ctx.arc(x,y,r*.8,Math.PI*1.13,Math.PI*1.92);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.stroke()}
 else if(e.type==='lightning'){ctx.beginPath();ctx.moveTo(x-r*.25,y-r);ctx.lineTo(x+r*.08,y-r*.22);ctx.lineTo(x-r*.1,y-r*.18);ctx.lineTo(x+r*.2,y+r*.3);ctx.stroke()}
 else if(e.type==='arrows'||e.type==='arrowtrail'){for(let k=-3;k<=3;k++){const xx=x+k*5;ctx.beginPath();ctx.moveTo(xx-3,y-r*.45);ctx.lineTo(xx,y+r*.15);ctx.lineTo(xx+2,y+r*.25);ctx.stroke()}}
 else if(['embers','dust','stars','miasma'].includes(e.type)){for(let k=0;k<10;k++){const th=k*2.399+p*2,rad=r*(.22+(k%5)*.16),xx=x+Math.cos(th)*rad,yy=y+Math.sin(th)*rad*.55-(e.type==='miasma'?p*22:0);ctx.beginPath();ctx.arc(xx,yy,(e.type==='dust'?4:2.5)*(1-p*.6),0,Math.PI*2);ctx.fill()}}
 ctx.restore()}
const oldDraw=draw;
draw=function(){oldDraw();if(!gameOn)return;const now=performance.now();const dt=Math.min(.05,Math.max(0,(now-previousFrame)/1000));previousFrame=now;
 for(let i=fx.length-1;i>=0;i--){const e=fx[i];e.t+=dt*(reduced?2.5:1);if(e.t>=e.d){fx.splice(i,1);continue}paint(e)}
 // Visible tower attack radius when selecting a card: a tactical cue, not permanent clutter.
 if(selected>=0){ctx.save();ctx.setLineDash([4,7]);ctx.lineWidth=1;for(const t of towers){if(!t.alive||t.side!==0)continue;ctx.beginPath();ctx.arc(t.x,t.y,t.range,0,Math.PI*2);ctx.strokeStyle='#ffb8843e';ctx.stroke()}ctx.restore()}
};
const oldStart=startBattle;
startBattle=function(){fx.length=0;previousFrame=performance.now();oldStart()};
})();
