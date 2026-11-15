/* IBONARIUM KYIV — world.js: ВЕЛИКА карта Києва 320x384 (географія районів) + ліс і ІРПІНЬ далеко за містом (пд-захід) */
IB.TER={grass:0,park:1,field:2,sidewalk:3,pave:4,cobble:5,concrete:6,plaza:7,rubble:8,dirt:9,sand:10,rail:11,water:12,road:13,
  rock:14,tunnel:15,track:16,plat:17,   /* + підземка (батч 10): скеля, тунель, колія, платформа */
  floorw:18,floort:19,floorc:20,floorr:21};   /* + інтер'єри (батч 13): паркет, кахель, бетон, килим */
IB.ZONES=[
  {k:'OBO', n:'ОБОЛОНЬ', d:2},
  {k:'POD', n:'ПОДІЛ', d:2},
  {k:'OLD', n:'СТАРЕ МІСТО', d:3},
  {k:'HR',  n:'ХРЕЩАТИК', d:4},
  {k:'MAI', n:'МАЙДАН НЕЗАЛЕЖНОСТІ', d:5},
  {k:'PECH',n:'ПЕЧЕРСЬК', d:3},
  {k:'LVR', n:'КИЄВО-ПЕЧЕРСЬКА ЛАВРА', d:4},
  {k:'MOT', n:'БАТЬКІВЩИНА-МАТИ', d:4},
  {k:'LEFT',n:'ЛІВИЙ БЕРЕГ', d:2},
  {k:'ISL', n:'ГІДРОПАРК', d:1},
  {k:'IND', n:'ПРОМЗОНА • ДАРНИЦЯ', d:4},
  {k:'VOK', n:'ЗАЛІЗНИЧНИЙ ВОКАЗАЛ', d:2},
  {k:'RIV', n:'ДНІПРО', d:0},
  {k:'IRP', n:'ІРПІНЬ • ЛІС ЗА МІСТОМ', d:1},
];
IB.SEctORS=null;
IB.buildWorld=function(){
  const W=320,H=384;   /* КИЇВ + південні ліси + ІРПІНЬ далеко за містом */
  const ter=new Uint8Array(W*H),vrn=new Uint8Array(W*H),rdm=new Uint8Array(W*H),
        elev=new Uint8Array(W*H), zone=new Uint8Array(W*H), blk=new Uint8Array(W*H),
        brg=new Uint8Array(W*H);
  const idx=(x,y)=>y*W+x, inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  const T=IB.TER;
  const rnd=IB.rnd, ri=IB.ri, hsh=IB.hsh;
  /* ---- база: трава ---- */
  ter.fill(T.grass);
  for(let i=0;i<W*H;i++){vrn[i]=ri(0,2);}
  /* ---- річка Дніпро з вигинами ---- */
  const cx=y=>152+IB.M.round(8*IB.M.sin(y*0.043)+4*IB.M.sin(y*0.011+2));
  for(let y=0;y<H;y++){
    const c=cx(y);
    for(let x=c;x<=c+16;x++){ter[idx(x,y)]=T.water;vrn[idx(x,y)]=0;}
  }
  /* ---- острови: Труханів, Гідропарк ---- */
  function island(cxx,cyy,rx,ry,kind){
    for(let y=cyy-ry;y<=cyy+ry;y++)for(let x=cxx-rx;x<=cxx+rx;x++){
      if(!inb(x,y))continue;
      const q=((x-cxx)/rx)**2+((y-cyy)/ry)**2;
      if(q<=1){ter[idx(x,y)]=q>0.72?T.sand:kind;vrn[idx(x,y)]=ri(0,2);}
    }
  }
  island(160,72,5,20,T.grass);   // Труханів
  island(155,128,7,15,T.grass);  // Гідропарк
  /* ---- пагорби (рельєф Києва) ---- */
  function hill(x0,y0,x1,y1,e){
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(inb(x,y)&&ter[idx(x,y)]!==T.water)elev[idx(x,y)]=e;}
  }
  hill(58,120,132,172,2);  // Старе місто
  hill(128,158,174,212,2); // Печерськ
  hill(146,186,174,212,3); // пагорб Батьківщини-Матері
  /* ---- дороги ---- */
  function R(x,y,t){if(inb(x,y)&&ter[idx(x,y)]!==T.water){ter[idx(x,y)]=t;vrn[idx(x,y)]=0;}}
  function VR(x0,x1,y0,y1,t){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)R(x,y,t);}
  function HR(y0,y1,x0,x1,t){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)R(x,y,t);}
  const cob=T.cobble, rd=T.road, sw=T.sidewalk, pv=T.pave, con=T.concrete;
  /* Оболонь — магістралі 3-4 смуги */
  VR(33,36,8,62,rd); HR(39,42,8,64,rd); HR(23,26,10,60,rd); VR(49,52,14,58,rd);
  /* Гавань/Поділ */
  VR(66,67,42,72,rd); HR(83,86,60,126,rd); HR(99,102,60,124,rd);
  VR(75,78,74,116,rd); VR(107,110,74,116,rd); HR(91,94,78,124,rd);
  /* Набережна (вздовж Дніпра) */
  const BR=[56,104,160,206];
  for(let y=36;y<=196;y++){if(BR.indexOf(y)>=0)continue;const ex=cx(y)-6;if(inb(ex,y)&&ter[idx(ex,y)]!==T.water)R(ex,y,rd);if(inb(ex+1,y)&&ter[idx(ex+1,y)]!==T.water)R(ex+1,y,rd);}
  /* Андріївський узвіз: брукований спуск з пагорба */
  VR(102,103,108,126,cob);
  for(let y=112;y<=115;y++){elev[idx(102,y)]=1;elev[idx(103,y)]=1;}
  for(let y=116;y<=121;y++){elev[idx(102,y)]=2;elev[idx(103,y)]=2;}
  /* Старе місто */
  HR(132,133,60,128,pv); HR(148,149,60,128,pv); VR(88,89,120,166,pv); VR(120,121,120,166,pv);
  /* Хрещатик — головна магістраль 4 смуги + Європейська площа */
  HR(149,152,106,133,rd);
  for(let y=144;y<=156;y++)for(let x=108;x<=118;x++)if(ter[idx(x,y)]!==T.road)R(x,y,pv);
  /* Майдан: велика площа з малюнком */
  for(let y=142;y<=162;y++)for(let x=132;x<=152;x++)R(x,y,T.plaza);
  /* Печерськ + Лавра */
  VR(137,140,158,190,rd); HR(167,170,128,154,rd); HR(175,178,140,154,rd);
  VR(147,150,158,163,rd);
  /* Батьківщина-Мати: кільце + проїзд */
  HR(195,198,138,152,rd); VR(149,152,184,206,rd); VR(145,148,190,206,rd);
  /* Лівий берег — магістралі */
  VR(194,197,8,124,rd); HR(102,105,178,216,rd); HR(83,86,178,216,rd); HR(39,42,178,216,rd);
  VR(204,207,8,120,rd); HR(63,66,178,216,rd);
  /* Промзона Дарниця */
  HR(158,161,178,216,rd); VR(202,205,128,216,rd); HR(183,186,178,216,rd);
  /* Вокзал (південний захід) — далі дорога йде лісом на Ірпінь */
  VR(62,65,190,224,rd); HR(195,198,56,100,rd); HR(171,174,8,64,rd); VR(27,30,66,172,rd);
  /* ---- ЛІС + ІРПІНЬ ДАЛЕКО ЗА МІСТОМ (пд-захід): ґрунтовка від вокзалу крізь хвойний ліс ---- */
  for(let y=224;y<=301;y++){
    const wx=62+IB.M.round(7*IB.M.sin(y*0.045)+3*IB.M.sin(y*0.013+1));
    for(let x=wx;x<=wx+1;x++)R(x,y,T.dirt);
  }
  /* вулички дачного масиву Ірпеня (ґрунт) */
  VR(40,41,298,372,T.dirt); VR(56,57,294,372,T.dirt); VR(72,73,294,372,T.dirt); VR(88,89,300,368,T.dirt);
  HR(300,301,34,96,T.dirt); HR(316,317,34,96,T.dirt); HR(332,333,34,96,T.dirt); HR(348,349,38,92,T.dirt);
  HR(362,363,44,88,T.dirt);
  VR(58,59,16,56,rd); HR(32,33,36,62,rd);          /* Оболонь */
  VR(98,99,76,116,rd);                             /* Поділ */
  VR(104,105,124,164,pv); HR(140,141,64,128,pv);   /* Старе місто */
  VR(186,187,40,120,rd); HR(124,125,178,216,rd);   /* Лівий берег */
  HR(156,157,128,152,rd);                          /* Печерськ */
  /* залізниця */
  for(let x=178;x<=218;x++)if(ter[idx(x,188)]!==T.water)ter[idx(x,188)]=T.rail;
  for(let x=66;x<=132;x++)if(ter[idx(x,208)]!==T.water)ter[idx(x,208)]=T.rail;
  for(let y=196;y<=216;y++)if(ter[idx(70,y)]!==T.water)ter[idx(70,y)]=T.rail;
  /* ---- мости через Дніпро ---- */
  const BRIDGES=[[56,'ПІВНІЧНИЙ МІСТ'],[104,'МЕТРО МІСТ'],[160,'МІСТ ПАТОНА'],[206,'ПІВДЕННИЙ МІСТ']];
  for(const [by] of BRIDGES){
    const c=cx(by);
    for(let x=c-9;x<=c+25;x++){const i=idx(x,by);ter[i]=T.road;brg[i]=1;vrn[i]=0;blk[i]=0;}
  }
  /* тротуари вздовж доріг */
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
    if(ter[idx(x,y)]!==T.grass&&ter[idx(x,y)]!==T.field)continue;
    if(rd===1)continue;
    let near=false;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){if(inb(x+dx,y+dy)&&ter[idx(x+dx,y+dy)]===T.road)near=true;}
    if(near&&hsh(x,y,77)<0.92)ter[idx(x,y)]=T.sidewalk;
  }
  /* пляжі біля води */
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
    if(ter[idx(x,y)]!==T.grass)continue;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){if(inb(x+dx,y+dy)&&ter[idx(x+dx,y+dy)]===T.water){if(hsh(x,y,55)<0.5)ter[idx(x,y)]=T.sand;break;}}
  }
  /* руїни/сміття у промзоні та Майдані */
  for(let y=140;y<=160;y++)for(let x=114;x<=131;x++){if(ter[idx(x,y)]===T.road&&hsh(x,y,31)<0.14)ter[idx(x,y)]=T.rubble;}
  for(let y=130;y<=216;y++)for(let x=180;x<=216;x++){if(ter[idx(x,y)]===T.grass&&hsh(x,y,32)<0.18)ter[idx(x,y)]=T.rubble;}
  /* ---- зони ---- */
  function zoneAt(x,y){
    if(ter[idx(x,y)]===T.water)return 12;
    if(x<170&&y>=220)return 13;                             // ІРПІНЬ + ліс за містом — ДАЛЕКО на пд-захід, не одразу
    if(y>=240)return 13;                                    // хвойні ліси на півдні карти
    if(y>=113&&y<=143&&x>=148&&x<=162)return 9;             // Гідропарк
    if(x<66&&y<66)return 0;
    if(x>=56&&x<132&&y>=64&&y<120)return 1;
    if(x>=132&&x<154&&y>=140&&y<164)return 4;               // Майдан
    if(x>=108&&x<132&&y>=144&&y<156)return 3;               // Хрещатик
    if(x>=140&&x<158&&y>=163&&y<189)return 6;               // Лавра
    if(x>=144&&x<170&&y>=189&&y<212)return 7;               // Батьківщина-Мати
    if(x>=56&&x<132&&y>=120&&y<172)return 2;                // Старе місто
    if(x>=128&&x<176&&y>=156&&y<212)return 5;               // Печерськ
    if(x>=176&&y<128)return 8;                              // Лівий берег
    if(x>=176&&y>=128)return 10;                            // Промзона
    if(x>=56&&x<104&&y>=188)return 11;                      // Вокзал
    return (y<120?1:(y<172?2:5));
  }
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)zone[idx(x,y)]=zoneAt(x,y);
  /* ---- масиви колізій ---- */
  for(let i=0;i<W*H;i++){if(ter[i]===T.water)blk[i]=2;}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x<2||y<2||x>=W-2||y>=H-2)blk[idx(x,y)]=4;}
  /* ---- road mask ---- */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(ter[idx(x,y)]!==T.road)continue;
    let m=0;
    const isr=(x,y)=>inb(x,y)&&(ter[idx(x,y)]===T.road);
    if(isr(x,y-1))m|=1; if(isr(x+1,y))m|=2; if(isr(x,y+1))m|=4; if(isr(x-1,y))m|=8;
    rdm[idx(x,y)]=m;
  }
  /* друга прохідка: перехрестя всередині широкої (3+) дороги -> суцільний асфальт */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=idx(x,y);
    if(rdm[i]!==15)continue;
    const n15=(dx,dy)=>inb(x+dx,y+dy)&&rdm[idx(x+dx,y+dy)]===15;
    if(n15(0,-1)||n15(0,1)||n15(-1,0)||n15(1,0))rdm[i]=16;
  }
  /* ---- локації-домінанти (IB.LM) ---- */
  const LMS=[
    ['sophia_cath',81,127],['sophia_bell',89,129],['golden_gate',63,137],
    ['maidan_col',141,151],['lachida',140,157],
    ['lavra_cath',144,169],['lavra_bell',149,166],['lavra_refect',144,177],['caves_chapel',150,182],
    ['st_andrew',98,116],['motherland',152,191],['museum',150,196],
    ['gostyny',86,88],['samson',94,92],
    ['radio_tower',26,356],['radio_tower',154,126],['radio_tower',60,133],['radio_tower',140,194],['radio_tower',212,142],
    ['mm13',76,210],                          /* БАЗА ММ13 • КПІ — безпечна зона, склад і верстак */
  ];
  const lms=[];
  for(const[key,x,y]of LMS){
    const d=IB.LM[key];const wT=d.wT,dT=d.dT;
    for(let yy=y;yy<y+dT;yy++)for(let xx=x;xx<x+wT;xx++){if(inb(xx,yy)){ter[idx(xx,yy)]=T.concrete;blk[idx(xx,yy)]=3;}}
    lms.push({key,x,y,wT,dT,zone:zoneAt(x,y)});
  }
  /* ---- стіни Лаври ---- */
  const props=[];
  let propId=0;
  function prop(t,x,y,o={}){
    const p={id:propId++,t,x:x+0.5,y:y+0.5,s:!!o.s,loot:o.loot||null,looted:false,meta:o.meta||null};
    props.push(p);return p;
  }
  for(let x=141;x<=154;x++){ if(x>=146&&x<=149)continue; prop('wall_m',x,163,{s:1}); prop('wall_m',x,187,{s:1}); }
  for(let y=164;y<=186;y++){ prop('wall_m',141,y,{s:1}); if(y!==175&&y!==176)prop('wall_m',154,y,{s:1}); }
  prop('gate_m',148,163,{s:0});
  /* ---- будівлі по районах (Kenney City Kit footprints) — ФУТПРИНТИ СИНХРОННІ з build_assets.py CATS (БАТЧ 8:
     всі будівлі БІЛЬШІ: 3x2 житлові, 3x3 панельки-башти, 4x2 адмінки/істиричні, 4x3 заводи) —
     спрайт рендериться під цей самий футпринт, тому будівля завжди стоїть рівно на своїх тайлах */
  const CATS={
    khrus:[3,2],khrus2:[3,2],panel9:[3,3],panel9b:[3,3],hist2:[3,2],hist2b:[3,2],hist2c:[3,2],hist3:[4,2],
    admin3:[4,2],admin4:[4,3],shop1:[3,1],shop2:[3,1],factory:[4,3],factory2:[4,3],garage:[1,1],
    khrus_dmg:[3,2],panel9_dmg:[3,3],hist_ruin:[2,1],
    dacha1:[3,2],dacha2:[3,2],dacha3:[3,2],
  };
  const POOL={khrus:6,khrus2:4,panel9:4,panel9b:3,hist2:6,hist2b:4,hist2c:4,hist3:4,admin3:3,admin4:3,shop1:3,shop2:4,factory:4,factory2:4,garage:4,khrus_dmg:4,panel9_dmg:3,hist_ruin:3,dacha1:2,dacha2:2,dacha3:1};
  const blds=[];
  const ZB={
    0:['panel9','panel9b','khrus','khrus2','shop1','panel9_dmg'],
    1:['hist2','hist2b','hist2c','hist3','shop1','khrus'],
    2:['hist2','hist3','hist2b','hist2c','admin3','hist_ruin'],
    3:['admin4','admin3','shop2','hist3'],
    4:['admin4','admin3'],
    5:['admin3','khrus','panel9b','shop1'],
    8:['panel9','panel9b','khrus','khrus2','shop2','panel9_dmg'],
    10:['factory','factory2','garage','factory2','garage'],
    11:['admin3','factory','garage','hist_ruin'],
    13:['dacha1','dacha2','dacha3','hist3'],   /* дачі Ірпеня — ВЕЛИКІ (2x2), всі вищі за героя */
  };
  /* дачі не можуть стояти на ґрунтових вуличках */
  function onStreet(x,y,w,d){
    for(let yy=y-1;yy<=y+d;yy++)for(let xx=x-1;xx<=x+w;xx++){
      if(!inb(xx,yy))return true;
      const t=ter[idx(xx,yy)];
      if(t===T.dirt||t===T.road||t===T.water||t===T.rail)return true;
    }
    return false;
  }
  function nearRoadOrWater(x,y,w,d){
    for(let yy=y-1;yy<=y+d;yy++)for(let xx=x-1;xx<=x+w;xx++){
      if(!inb(xx,yy))return true;
      const t=ter[idx(xx,yy)];
      /* заборонено тільки дорога/вода/рейки/площа. Тротуар/бруківка — це фасад, будуємо впритул */
      if(t===T.road||t===T.water||t===T.rail||t===T.plaza||blk[idx(xx,yy)])return true;
    }
    return false;
  }
  /* фасад: хочемо будівлю впритул до тротуару/бруківки (як у справжньому місті) */
  function hasFrontage(x,y,w,d){
    for(let yy=y-1;yy<=y+d;yy++)for(let xx=x-1;xx<=x+w;xx++){
      if(!inb(xx,yy))continue;
      const t=ter[idx(xx,yy)];
      if(t===T.sidewalk||t===T.pave||t===T.cobble)return true;
    }
    return false;
  }
  function placeB(x,y,w,d,cat,z){
    if(x<3||y<3||x+w>W-3||y+d>H-3)return false;
    if(nearRoadOrWater(x,y,w,d))return false;
    /* двір бази ММ13 • КПІ — будівлі не лізуть */
    if(x+w>73&&x<85&&y+d>209&&y<218)return false;
    for(let yy=y;yy<y+d;yy++)for(let xx=x;xx<x+w;xx++){if(blk[idx(xx,yy)])return false;}
    for(let yy=y;yy<y+d;yy++)for(let xx=x;xx<x+w;xx++){ter[idx(xx,yy)]=T.concrete;blk[idx(xx,yy)]=1;}
    const b={cat,x,y,wT:w,dT:d,zone:z,mural:false,var:ri(0,(POOL[cat]||1)-1)};
    blds.push(b);
    if((cat==='panel9'||cat==='panel9b')&&hsh(x,y,44)<0.3)b.mural=true;
    if((cat==='khrus'||cat==='khrus2')&&hsh(x,y,45)<0.12)b.mural=true;
    return b;
  }
  /* лут-пропси біля будівель */
  function lootProp(x,y){
    if(!inb(x,y)||blk[idx(x,y)])return;
    const t=ter[idx(x,y)];
    if(t===T.water||t===T.road)return;
    const r=hsh(x,y,60);
    if(r<0.2)prop('dumpster',x,y,{s:1,loot:'dumpster'});
    else if(r<0.34)prop('crate',x,y,{s:1,loot:'crate'});
    else if(r<0.42)prop('barrels',x,y,{s:1,loot:'barrels'});
  }
  /* ДВІР: ґрунт, лавиці, дерева, гойдалки, контейнери — комплекси живуть навколо нього */
  function courtyard(x0,y0,w,d,z){
    for(let yy=y0;yy<y0+d;yy++)for(let xx=x0;xx<x0+w;xx++){
      if(!inb(xx,yy))continue;
      const i=idx(xx,yy);
      const t=ter[i];
      if(blk[i]||t===T.road||t===T.water||t===T.sidewalk||t===T.plaza||t===T.rail)continue;
      ter[i]=(z===3||z===4)?T.pave:T.dirt;
    }
    const cx2=(x0+w/2)|0,cy2=(y0+d/2)|0;
    const r=hsh(cx2,cy2,61);
    if(r<0.75&&inb(cx2,cy2)&&!blk[idx(cx2,cy2)])prop('bench',cx2,cy2,{s:1});
    if(r<0.55&&inb(cx2-2,cy2)&&!blk[idx(cx2-2,cy2)])prop(hsh(cx2,cy2,62)<0.5?'tree_o':'tree_o2',cx2-2,cy2,{s:0});
    if(r<0.62&&inb(cx2+2,cy2)&&!blk[idx(cx2+2,cy2)])prop('bush',cx2+2,cy2,{s:0});
    if(r>0.66&&(z===0||z===1||z===8)&&inb(cx2,cy2-1)&&!blk[idx(cx2,cy2-1)]){prop('swing',cx2,cy2-1,{s:1});prop('slide',cx2+1,cy2-1,{s:1});}
    if(r>0.52&&inb(x0,cy2)&&!blk[idx(x0,cy2)])prop('dumpster',x0,cy2,{s:1,loot:'dumpster'});
  }
  /* резерв: двір дачі-схованки та вишки в Ірпені — будинки в двори не лізуть */
  for(let yy=315;yy<=325;yy++)for(let xx=41;xx<=52;xx++){const ii=idx(xx,yy);if(inb(xx,yy)&&ter[ii]!==T.dirt&&!blk[ii])blk[ii]=1;}
  for(let yy=353;yy<=359;yy++)for(let xx=23;xx<=30;xx++){const ii=idx(xx,yy);if(inb(xx,yy)&&ter[ii]!==T.dirt&&!blk[ii])blk[ii]=1;}
  for(let gy=6;gy<H-8;gy+=8)for(let gx=6;gx<W-8;gx+=8){
    const z=zone[idx(gx+2,gy+2)];
    /* ІРПІНЬ (z13): дачний масив — 2-3 ВЕЛИКИХ дачі (3x2, вищі за героя) на блок між ґрунтовими вуличками,
       паркани, сади; поза селом — тільки ліс, ніяких будівель */
    if(z===13){
      if(gy>=292&&gx>=30&&gx<=100&&hsh(gx,gy,774)<0.82){
        const dcs=['dacha1','dacha2','dacha3'];
        const spots=[[1,1],[5,1],[1,4],[5,4],[3,2]];
        let n=0;
        for(let si=0;si<3;si++){
          const sp=spots[(si+((hsh(gx,gy,775)*5)|0))%5];
          const cat=dcs[((hsh(gx+sp[0],gy+sp[1],776)*3)|0)%3];
          const dw=CATS[cat][0],dd=CATS[cat][1];
          const bx0=gx+sp[0],by0=gy+sp[1];
          if(bx0+dw>W-4||by0+dd>H-4)continue;
          if(onStreet(bx0,by0,dw,dd))continue;
          if(placeB(bx0,by0,dw,dd,cat,13))n++;
        }
        /* паркан уздовж фронту ділянки */
        if(n>0&&hsh(gx,gy,778)<0.55){
          for(let fx=gx;fx<gx+4;fx++){
            const py2=gy+7;
            if(inb(fx,py2)&&!blk[idx(fx,py2)]&&ter[idx(fx,py2)]!==T.dirt&&ter[idx(fx,py2)]!==T.road&&ter[idx(fx,py2)]!==T.water)prop('fence',fx,py2,{s:0});
          }
        }
        if(n>0)lootProp(gx+3,gy+6);
      }
      continue;
    }
    const list=ZB[z];if(!list)continue;
    const roll=hsh(gx,gy,771);
    const res=(z===3||z===4);        /* адміністративно-торгові зони */
    if(z===10||z===11){
      /* промзона: ряди цехів і складів — РОЗМІРИ З CATS (спрайт = футпринт, заводи 4x3) */
      const c0=list[0],d0=CATS[c0];
      placeB(gx+1,gy+1,d0[0],d0[1],c0,z);
      if(roll<0.72){const c1=list[ri(0,list.length-1)],d1=CATS[c1];placeB(gx+1,gy+5,d1[0],d1[1],c1,z);}
      if(roll>0.42)placeB(gx+6,gy+2,1,1,'garage',z);
      lootProp(gx+4,gy+4);
      continue;
    }
    if(roll<0.52){
      /* КОМПЛЕКС-ПІДКОВА: 3-4 ВЕЛИКИХ будинки (футпринти 3x2…4x3) навколо спільного двору.
         Лейаути перераховані під нові розміри — правий будинок вирівняний до краю комірки */
      const o=hsh(gx,gy,772);
      const cA=list[ri(0,list.length-1)],cB=list[ri(0,list.length-1)],cC=list[ri(0,list.length-1)];
      const dA=CATS[cA],dB=CATS[cB],dC=CATS[cC];
      let n=0;
      if(o<0.25){          /* П-подібна: два будинки зверху по краях, один знизу по центру, отвір на південь */
        if(placeB(gx,gy,dA[0],dA[1],cA,z))n++;
        if(placeB(gx+8-dB[0],gy,dB[0],dB[1],cB,z))n++;
        if(placeB(gx+2,gy+5,dC[0],dC[1],cC,z))n++;
        if(n>=2&&roll<0.18){const cg=res?'shop1':'garage',dg=CATS[cg];placeB(gx+2,gy+7-dg[1],dg[0],dg[1],cg,z);}
        courtyard(gx+2,gy+2,4,3,z);
      } else if(o<0.5){    /* два ряди з двором-проходом посередині */
        if(placeB(gx,gy,dA[0],dA[1],cA,z))n++;
        if(placeB(gx+8-dB[0],gy,dB[0],dB[1],cB,z))n++;
        if(placeB(gx+2,gy+5,dC[0],dC[1],cC,z))n++;
        courtyard(gx+2,gy+2,4,3,z);
      } else if(o<0.75){   /* два ряди вертикально + бічний корпус */
        if(placeB(gx,gy,dA[0],dA[1],cA,z))n++;
        if(placeB(gx,gy+4,dB[0],dB[1],cB,z))n++;
        if(placeB(gx+5,gy+2,dC[0],dC[1],cC,z))n++;
        courtyard(gx+3,gy,2,8,z);
      } else {             /* Г-подібна */
        if(placeB(gx,gy,dA[0],dA[1],cA,z))n++;
        if(placeB(gx,gy+4,dB[0],dB[1],cB,z))n++;
        if(placeB(gx+5,gy+5,dC[0],dC[1],cC,z))n++;
        courtyard(gx+2,gy+2,3,3,z);
      }
      lootProp(gx+2,gy+7);
      if(n===0){ /* фолбек: окрема будівля */
        for(let tr=0;tr<3;tr++){
          const cat=list[ri(0,list.length-1)];
          const[w,d]=CATS[cat];
          if(placeB(gx+ri(0,7-w),gy+ri(0,7-d),w,d,cat,z))break;
        }
      }
    } else if(roll<0.78){
      /* РЯД уздовж фасаду — вулична лінія з крамницями (без обрізання футпринтів!) */
      const shopC=res?['shop1','shop2','admin3']:['hist2','hist3','shop1'];
      let x=gx;
      for(let i=0;i<3&&x<gx+8;i++){
        const cat=(i===1&&roll<0.74)?shopC[ri(0,shopC.length-1)]:list[ri(0,list.length-1)];
        const[w,d]=CATS[cat];
        if(placeB(x,gy+1,w,d,cat,z))x+=w+1; else x+=2;
      }
      courtyard(gx+1,gy+4,6,3,z);
    } else {
      /* БАГАТОПОВЕРХІВКА (3x3 башта / 4x3 адмінка) + зелений двір */
      const tall=res?'admin4':(hsh(gx,gy,773)<0.5?'panel9':'panel9b');
      const[tW,tD]=CATS[tall];
      if(placeB(gx+2,gy+2,tW,tD,tall,z)){
        courtyard(gx+1,gy+1,6,1,z);
        courtyard(gx+1,gy+5,6,2,z);
      } else {
        const cat=list[ri(0,list.length-1)];
        const[w,d]=CATS[cat];
        placeB(gx+2,gy+2,w,d,cat,z);
      }
    }
  }
  /* ---- ВХОДИ В БУДИНКИ (батч 10): двері на південному фасаді — E = зайти і СХОВАТИСЯ ----
     ставимо двері на фасаді кожної житлової будівлі (не гараж/руїна), тайл під фасадом вільний */
  let doorN=0;
  for(let bi=0;bi<blds.length;bi++){
    const b=blds[bi];
    if(b.cat==='garage'||b.cat==='hist_ruin')continue;
    const dx=b.x+((b.wT/2)|0), dy=b.y+b.dT;       /* тайл просто під південним фасадом */
    if(!inb(dx,dy))continue;
    const i=idx(dx,dy);
    if(blk[i]||ter[i]===T.road||ter[i]===T.water||ter[i]===T.plaza||ter[i]===T.rail)continue;
    const dp=prop('doorp',dx,dy,{s:0,meta:'enter'});
    dp.bld=bi;                    /* двері знають свою будівлю */
    b.door={x:dx,y:dy};           /* будівля знає свої двері */
    b.floors=IB.BLD_FLOORS(b);    /* 2-4 поверхи залежно від категорії */
    doorN++;
  }
  /* ---- ключові лут-точки та декор ---- */
  const put=[
    ['shelf',47,44,{s:1,loot:'pharmacy'}],['shelf',49,46,{s:1,loot:'pharmacy'}],['kiosk',48,45,{s:1}],
    ['shelf',118,153,{s:1,loot:'market'}],['shelf',120,153,{s:1,loot:'market'}],['shelf',122,151,{s:1,loot:'market'}],
    ['hole',64,141,{s:0,loot:'gate'}],['hole',151,186,{s:0,loot:'caves'}],['hole',152,199,{s:0,loot:'museum'}],
    ['hole',66,105,{s:0,loot:'podil'}],['hole',98,120,{s:0,loot:'andrew'}],
    ['barrels',66,52,{s:1,loot:'barrels'}],['barrels',68,52,{s:1,loot:'barrels'}],['tank',62,50,{s:1}],
    ['cache',69,146,{s:1,loot:'cache'}],['cache',30,30,{s:0,loot:'flat'}],
    ['cache',205,159,{s:1,loot:'cache'}],['cache',197,61,{s:1,loot:'cache'}],
    ['cache',69,200,{s:1,loot:'cache'}],['cache',101,104,{s:1,loot:'cache'}],
    ['cache',135,186,{s:1,loot:'cache'}],['cache',150,199,{s:0,loot:'cache'}],
    ['cache',211,141,{s:1,loot:'cache'}],['cache',99,92,{s:1,loot:'cache'}],
    ['cache',143,150,{s:1,loot:'cache'}],['cache',109,148,{s:1,loot:'cache'}],
    ['bench',86,130,{s:1}],['bench',92,136,{s:1}],['fountain',84,133,{s:1}],['statue',87,136,{s:1}],
    ['bench',136,146,{s:1}],['fountain',136,147,{s:1}],['fountain',147,147,{s:1}],
    ['tree_o',112,128,{s:0}],['tree_o',116,142,{s:0}],['tree_o2',124,156,{s:0}],['bush',114,136,{s:0}],
    ['tree_o',134,170,{s:0}],['tree_o',142,166,{s:0}],['pine',130,200,{s:0}],['tree_o2',148,180,{s:0}],
    ['swing',36,30,{s:1}],['slide',38,31,{s:1}],['bench',37,33,{s:1}],['wreck1',35,32,{s:1}],
    ['swing',192,52,{s:1}],['slide',194,53,{s:1}],['wreck2',193,55,{s:1}],
    ['dumpster',33,34,{s:1,loot:'dumpster'}],['dumpster',196,58,{s:1,loot:'dumpster'}],
    ['traff',119,150,{s:1}],['traff',131,151,{s:1}],['busstop',115,153,{s:1}],['busstop',125,150,{s:1}],
    ['barr',116,151,{s:1}],['barr',121,151,{s:1}],['barr',126,151,{s:1}],['sandbag',118,149,{s:1}],['sandbag',124,153,{s:1}],
    ['wreck1',114,152,{s:1}],['wreck2',123,152,{s:1}],['wreck1',129,151,{s:1}],
    ['barr',139,154,{s:1}],['sandbag',143,156,{s:1}],['wreck2',137,156,{s:1}],
    ['lamp_b',80,90,{s:1}],['kiosk',90,96,{s:1,loot:'crate'}],
    ['pipe',186,166,{s:1}],['pipe',192,172,{s:1}],['chimney',182,158,{s:1}],['chimney',198,150,{s:1}],
    ['tank',190,164,{s:1}],['tank',200,170,{s:1}],['vent',188,178,{s:1}],['cone',196,182,{s:1}],
    ['wreck1',184,172,{s:1}],['wreck2',206,168,{s:1}],['dumpster',200,160,{s:1,loot:'dumpster'}],
    ['vent',70,204,{s:1}],['fence',74,196,{s:1}],['wreck2',60,198,{s:1}],
    ['doorp',36,29,{s:0}],['doorp',100,106,{s:0}],['doorp',71,148,{s:0}],['doorp',158,135,{s:0}],['doorp',198,62,{s:0}],['doorp',206,162,{s:0}],['doorp',69,202,{s:0}],
    ['cone',180,106,{s:0}],['barr',178,103,{s:1}],['sandbag',179,106,{s:1}],
    /* ІРПІНЬ (пд-захід, далеко): дачне життя біля схованки */
    ['kiosk',44,318,{s:1}],['cache',49,322,{s:1,loot:'cache'}],['cache',43,324,{s:1,loot:'cache'}],
    ['bench',48,318,{s:1}],['swing',43,321,{s:1}],['slide',44,321,{s:1}],
    ['wreck1',51,315,{s:1}],['dumpster',42,319,{s:1,loot:'dumpster'}],['barr',49,318,{s:1}],
    ['fence',44,323,{s:0}],['fence',45,323,{s:0}],['fence',46,323,{s:0}],
    ['pine',40,322,{s:0}],['pine',58,326,{s:0}],['bush',42,326,{s:0}],['tree_o2',39,318,{s:0}],
  ];
  for(const[t,x,y,o]of put)prop(t,x,y,o||{});
  /* ---- БАЗА ММ13 • КПІ: укріплення навколо (мішки, барикади, генератор) ---- */
  const BASE={x:78.5,y:214.6,r:6.5};          /* центр безпечної зони (південний вхід бази) */
  prop('sandbag',74,210,{s:1});prop('sandbag',82,211,{s:1});prop('sandbag',75,213,{s:0});
  prop('barr',74,212,{s:1});prop('barr',82,213,{s:1});prop('tank',73,215,{s:1});
  prop('cache',80,215,{s:0,loot:'crate'});prop('dumpster',72,212,{s:1,loot:'dumpster'});
  prop('lamp_b',76,214,{s:1});prop('lamp_b',81,215,{s:1});prop('flag',79,213,{s:0});
  /* дерева на траві: у лісі Ірпеня — густі сосни */
  for(let y=4;y<H-4;y+=2)for(let x=4;x<W-4;x+=2){
    if(ter[idx(x,y)]!==T.grass||blk[idx(x,y)])continue;
    const r=hsh(x,y,808);
    const z=zone[idx(x,y)];
    if(z===13){
      if(r<0.11)prop('pine',x,y,{s:0});
      else if(r<0.14)prop('tree_o2',x,y,{s:0});
      else if(r<0.155)prop('bush',x,y,{s:0});
      continue;
    }
    const p=z===10||z===5?0.05:0.028;
    if(r<p)prop(r<0.02?'tree_o':'tree_o2',x,y,{s:0});
    else if(r<p+0.012)prop('bush',x,y,{s:0});
    else if(r<p+0.02&&(z===10||z===11))prop('dead',x,y,{s:0});
  }
  /* ліхтарі вздовж доріг */
  for(let y=6;y<H-6;y+=5)for(let x=6;x<W-6;x+=5){
    if(ter[idx(x,y)]!==T.sidewalk||blk[idx(x,y)])continue;
    if(hsh(x,y,909)<0.5)prop(hsh(x,y,910)<0.5?'lamp':'lamp_b',x,y,{s:1});
  }
  /* ---- метро: входи-станції ---- */
  const stations=[
    {x:35,y:37,n:'ОБОЛОНЬ'},{x:92,y:97,n:'КОНТРАКТОВА ПЛОЩА'},{x:119,y:153,n:'ХРЕЩАТИК'},
    {x:136,y:154,n:'МАЙДАН НЕЗАЛЕЖНОСТІ'},{x:139,y:171,n:'ПЕЧЕРСЬКА'},
    {x:196,y:102,n:'ЛІВОБЕРЕЖНА'},{x:196,y:183,n:'ДАРНИЦЯ'},{x:66,y:199,n:'ВОКАЗАЛЬНА'},
  ];
  for(const st of stations){prop('metro_m',st.x,st.y,{s:1,meta:st.n});blk[idx(st.x,st.y)]=0;}
  /* ---- підземні переходи ---- */
  const passages=[
    {a:[134,146],b:[148,156],n:'ПІДЗЕМНИЙ ПЕРЕХІД — МАЙДАН'},
    {a:[117,154],b:[127,149],n:'ПІДЗЕМНИЙ ПЕРЕХІД — ХРЕЩАТИК'},
    {a:[104,100],b:[110,92],n:'ПІДЗЕМНИЙ ПЕРЕХІД — ПОДІЛ'},
  ];
  for(const p of passages){prop('stairs',p.a[0],p.a[1],{s:0,meta:'pass'});prop('stairs',p.b[0],p.b[1],{s:0,meta:'pass'});}
  /* ---- схованки (safehouse) ---- */
  const safes=[
    {x:46,y:319,n:'ДАЧА В ІРПНІ',z:'ІРПІНЬ'},   /* далеко за містом — треба пройти ліс */
    {x:31,y:30,n:'КВАРТИРА ВІКТОРА',z:'ОБОЛОНЬ'},
    {x:101,y:105,n:'ПОДІЛЬСЬКИЙ ПІДВАЛ',z:'ПОДІЛ'},
    {x:70,y:147,n:'СТАРИЙ СКЛАД БІЛЯ ЗОЛОТИХ ВОРІТ',z:'СТАРЕ МІСТО'},
    {x:158,y:134,n:'ТАБІР НА ГІДРОПАРКУ',z:'ГІДРОПАРК'},
    {x:197,y:61,n:'КВАРТИРА НА ЛІВОБЕРЕЖЖІ',z:'ЛІВИЙ БЕРЕГ'},
    {x:205,y:160,n:'СКЛАД У ПРОМЗОНІ',z:'ПРОМЗОНА'},
    {x:68,y:201,n:'ГАРАЖ БІЛЯ ВОКАЗАЛУ',z:'ВОКАЗАЛ'},
  ];
  for(const s of safes)prop('cache',s.x,s.y,{s:0,meta:'safe'});
  /* ---- NPC ---- */
  const npcs=[
    {x:95.5,y:94.5,n:'ВАЛЕНТИНА — ТОРГОВКА',role:'trader'},
    {x:157.5,y:132.5,n:'СЕРГІЙ — ТАБІР',role:'camp'},
    {x:160.5,y:136.5,n:'ОЛЯ — МЕДСЕСТРА',role:'medic'},
    {x:181.5,y:103.5,n:'ПАТОН — ВАРТОВИЙ МОСТУ',role:'guard'},
    {x:196.5,y:62.5,n:'ГАНЯ — ЛІВОБЕРЕЖЖЯ',role:'trader2'},
  ];
  /* ---- радіовежі (сигнали) ---- */
  const towers=[{x:26,y:356,n:'ВИШКА ІРПІНЬ'},{x:154,y:126,n:'ВИШКА ГІДРОПАРК'},{x:60,y:133,n:'ВИШКА СТАРОГО МІСТА'},{x:140,y:194,n:'ВИШКА ПЕЧЕРСЬКА'},{x:212,y:142,n:'ВИШКА ДАРНИЦЯ'}];
  /* ---- авто: припарковані вздовж доріг усього міста (багато, БІЛЯ ПРАВОГО УЗБІЧЧЯ — правосторонній рух,
     щоб авто не вилазили за край дороги і не здавалися "більшими за дорогу") ---- */
  const CARS=IB.SPR.CARS;
  const cars=[];
  function addCar(mdl,x,y,dir,drivable,fuel,hp,exact){
    /* батч 13: кольоровий варіант (Kenney car-kit рендери _a/_b), детермінований */
    const vr=hsh(x*7+y,3,715)<0.42?(hsh(x,y,716)<0.5?'a':'b'):null;
    cars.push({mdl,var:vr,x:exact?x:x+0.5,y:exact?y:y+0.5,dir,drivable,fuel,hp,broken:!drivable,looted:false});
  }
  /* зсув до узбіччя (side=1 праворуч / -1 ліворуч): скануємо дорогу поперек напряму, паркунок так,
     щоб увесь габарит (hw = половина ширини моделі) вліз в асфальт із зазором */
  function curbOff(x,y,dir,hw,side){
    const dv=[[1,0],[-1,0],[0,1],[0,-1]][dir];
    const p=side===-1?[dv[1],-dv[0]]:[-dv[1],dv[0]];   /* бік паркування */
    let r=0;while(r<5&&inb(x+p[0]*(r+1),y+p[1]*(r+1))&&ter[idx(x+p[0]*(r+1),y+p[1]*(r+1))]===T.road&&!brg[idx(x+p[0]*(r+1),y+p[1]*(r+1))])r++;
    let l=0;while(l<5&&inb(x-p[0]*(l+1),y-p[1]*(l+1))&&ter[idx(x-p[0]*(l+1),y-p[1]*(l+1))]===T.road&&!brg[idx(x-p[0]*(l+1),y-p[1]*(l+1))])l++;
    const hi=r+0.5-hw-0.07, lo=hw+0.07-(l+0.5);   /* межі: не за край дороги з обох боків */
    return [p,Math.max(lo,hi)];
  }
  addCar('vaz',33,28,0,true,45,95);  // перше авто біля дому
  addCar('truck',64,48,1,true,60,120);
  const MDLS=['vaz','lanos','skoda','taxi','suv','vaz','lanos','truck','vaz','police','skoda','van','lanos','delivery','taxi','ambulance'];   /* довгі автобуси прибрано — 6 ДЕТАЛЬНИХ моделей легкових+пікап */
  let carN=2;
  outer:
  for(let y=8;y<H-8;y+=5)for(let x=8;x<W-8;x+=5){
    if(carN>=120)break outer;
    if(ter[idx(x,y)]!==T.road||brg[idx(x,y)]||hsh(x,y,707)>0.34)continue;
    const rm=rdm[idx(x,y)];
    if(rm===15||rm===16)continue;               /* не на перехрестях */
    const vert=(rm&1||rm&4)&&!(rm&2||rm&8);
    const horiz=(rm&2||rm&8)&&!(rm&1||rm&4);
    const dir=vert?(hsh(x,y,709)<0.5?1:3):(horiz?(hsh(x,y,710)<0.5?0:2):(hsh(x,y,711)<0.5?0:2));
    const mdl=MDLS[ri(0,MDLS.length-1)];
    const[cp,off]=curbOff(x,y,dir,IB.SPR.CARS[mdl].wt*0.5);
    addCar(mdl,x+0.5+cp[0]*off,y+0.5+cp[1]*off,dir,hsh(x,y,712)<0.6,15+IB.M.round(55*hsh(x,y,713)),70+IB.M.round(30*hsh(x,y,714)),true);
    carN++;
  }
  addCar('lanos',116,150,0,false,0,0);addCar('skoda',124,153,2,true,35,88);
  addCar('skoda',140,196,1,true,50,110);addCar('vaz',150,199,0,false,0,0);
  addCar('truck',186,161,0,true,70,140);addCar('skoda',182,104,0,true,40,90);
  /* дорога на пд крізь ліс + вулички Ірпеня (далеко за містом) */
  addCar('vaz',53,240,1,true,30,80);addCar('skoda',54,260,1,true,25,75);
  addCar('lanos',59,280,1,true,20,70);
  addCar('vaz',57,302,1,true,35,85);addCar('vaz',41,316,2,true,20,70);
  addCar('skoda',73,316,2,true,30,80);addCar('vaz',89,318,1,true,15,60);
  addCar('lanos',57,334,1,false,0,0);addCar('vaz',44,333,0,true,25,75);
  addCar('skoda',58,350,2,true,30,75);addCar('vaz',75,349,0,false,0,0);
  /* ---- випалени рештки (декор) ---- */
  prop('wreck1',70,44,{s:1});prop('wreck2',44,42,{s:1});prop('wreck1',110,90,{s:1});
  prop('wreck2',86,102,{s:1});prop('wreck1',142,168,{s:1});prop('wreck2',164,176,{s:1});
  prop('corpse',120,148,{s:0});prop('corpse',84,104,{s:0});prop('corpse',138,158,{s:0});prop('corpse',192,168,{s:0});
  /* ---- блокування від пропсів ---- */
  for(const p of props){if(p.s&&inb(p.x|0,p.y|0)){if(blk[idx(p.x|0,p.y|0)]===0)blk[idx(p.x|0,p.y|0)]=1;}}
  /* АВТО НЕ СТОЯТЬ У БУДІВЛЯХ: перевіряємо ВЕСЬ ГАБАРИТ кузова (довге авто ~4 тайли),
     зсуваємо на найближче вільне місце — інакше clearArea нижче стирає колізію будівлі
     і в неї ПРОЇДЖАЮТЬ НАСКРІЗЬ */
  function carFits(x,y,dir,lt,wt){
    const dv=[[1,0],[-1,0],[0,1],[0,-1]][dir];
    const px=-dv[1],py=dv[0],hl=lt*0.5,hw=wt*0.5+0.1;
    for(const[sa,sb]of[[hl,0],[-hl,0],[0,hw],[0,-hw],[hl,hw],[hl,-hw],[-hl,hw],[-hl,-hw],[0,0]]){
      const tx=(x+dv[0]*sa+px*sb)|0,ty=(y+dv[1]*sa+py*sb)|0;
      if(!inb(tx,ty)||blk[idx(tx,ty)]||ter[idx(tx,ty)]===T.water||ter[idx(tx,ty)]===T.rail)return false;
    }
    return true;
  }
  for(const c of cars){
    const spec=CARS[c.mdl],cx0=c.x|0,cy0=c.y|0;
    if(!carFits(c.x,c.y,c.dir,spec.lt,spec.wt)){
      let done=false;
      for(let rr=1;rr<=3&&!done;rr++){
        for(let yy=cy0-rr;yy<=cy0+rr&&!done;yy++)for(let xx=cx0-rr;xx<=cx0+rr&&!done;xx++){
          if(!inb(xx,yy))continue;
          const fx=xx+0.5,fy=yy+0.5;
          if(carFits(fx,fy,c.dir,spec.lt,spec.wt)){c.x=fx;c.y=fy;done=true;}
        }
      }
      if(!done){c.x=cx0+0.5;c.y=cy0+0.5;}
    }
    /* другий прохід: авто на дорозі — підтягнути до узбіччя (спочатку правого, якщо зайнято — лівого) */
    const sx0=c.x|0,sy0=c.y|0;
    if(inb(sx0,sy0)&&ter[idx(sx0,sy0)]===T.road&&!brg[idx(sx0,sy0)]){
      for(const side of [1,-1]){
        const[cp2,off2]=curbOff(sx0,sy0,c.dir,spec.wt*0.5,side);
        const fx2=sx0+0.5+cp2[0]*off2, fy2=sy0+0.5+cp2[1]*off2;
        if(carFits(fx2,fy2,c.dir,spec.lt,spec.wt)){c.x=fx2;c.y=fy2;break;}
      }
    }
  }
  /* ---- ГАРАНТОВАНІ ЧИСТІ ЗОНИ: ніколи не замуровуємо ключові точки ---- */
  function clearArea(cx,cy,r){
    for(let yy=Math.max(1,Math.floor(cy-r));yy<=Math.min(H-2,Math.ceil(cy+r));yy++)
    for(let xx=Math.max(1,Math.floor(cx-r));xx<=Math.min(W-2,Math.ceil(cx+r));xx++){
      const i=idx(xx,yy);
      if(ter[i]===T.water)continue;
      if(blk[i]===4)continue;                  /* кордон карти лишається */
      if(blk[i])blk[i]=0;
    }
  }
  /* спавн гравця — двір квартири */
  for(let yy=28;yy<=34;yy++)for(let xx=28;xx<=35;xx++){const i=idx(xx,yy);if(ter[i]===T.grass&&blk[i]===0)ter[i]=T.dirt;}
  clearArea(31.5,31.5,2.6);
  for(const s of safes)clearArea(s.x+0.5,s.y+0.5,2.2);
  for(const st of stations)clearArea(st.x+0.5,st.y+0.5,2.2);
  for(const p of passages){clearArea(p.a[0]+0.5,p.a[1]+0.5,1.6);clearArea(p.b[0]+0.5,p.b[1]+0.5,1.6);}
  for(const n of npcs)clearArea(n.x,n.y,1.6);
  for(const c of cars)clearArea(c.x,c.y,0.55);   /* лише свій тайл — НЕ стираємо колізію сусідніх будівель */
  for(const l of lms){                          /* входи до локацій */
    clearArea(l.x+l.wT/2,l.y-1,1.8);
    clearArea(l.x-1,l.y+l.dT/2,1.8);
    clearArea(l.x+l.wT+0.5,l.y+l.dT/2,1.8);
  }
  /* БАЗА ММ13: clearArea входів розмиває футпринт — відновлюємо суцільну колізію корпусу */
  for(let yy=210;yy<=212;yy++)for(let xx=76;xx<=79;xx++){const ii=idx(xx,yy);if(inb(xx,yy)){blk[ii]=1;ter[ii]=T.concrete;}}
  /* вільні тайли підходу з півдня (двір бази) */
  for(let xx=75;xx<=83;xx++){const ii=idx(xx,213);if(inb(xx,213))blk[ii]=0;}
  /* ---- мінімапа ---- */
  const mm=IB.mk(W,H);const g=mm.g;
  const MC={[T.grass]:'#1c3a1e',[T.park]:'#225028',[T.field]:'#3e4422',[T.sidewalk]:'#3a3f4a',[T.pave]:'#40444e',[T.cobble]:'#3a3830',
    [T.concrete]:'#2e3138',[T.plaza]:'#4e2a20',[T.rubble]:'#2e3138',[T.dirt]:'#3a3228',[T.sand]:'#565638',[T.rail]:'#40404a',[T.water]:'#1c3860',[T.road]:'#4c4c55'};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){g.fillStyle=MC[ter[idx(x,y)]]||'#1c3a1e';g.fillRect(x,y,1,1);}
  for(const b of blds){g.fillStyle='#5a606c';g.fillRect(b.x,b.y,b.wT,b.dT);}
  for(const l of lms){g.fillStyle='#f0d050';g.fillRect(l.x,l.y,l.wT,l.dT);}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(elev[idx(x,y)]>=2){g.fillStyle='#ffffff10';g.fillRect(x,y,1,1);}}
  const world={W,H,ter,vrn,rdm,elev,zone,blk,brg,blds,lms,props,cars,stations,passages,safes,npcs,towers,mm,base:BASE,
    bridges:BRIDGES,ridx:idx,inb,clearArea,
    /* найближчий вільний тайл навколо точки (спіраль) — анти-замуровування */
    freeSpot:(x,y,maxR=6)=>{
      x|=0;y|=0;
      if(!inb(x,y))return {x:IB.M.max(3,IB.M.min(W-4,x)),y:IB.M.max(3,IB.M.min(H-4,y))};
      if(!blk[idx(x,y)]&&ter[idx(x,y)]!==T.water)return {x:x+0.5,y:y+0.5};
      for(let r=1;r<=maxR;r++){
        let best=null,bd=1e9;
        for(let yy=y-r;yy<=y+r;yy++)for(let xx=x-r;xx<=x+r;xx++){
          if(!inb(xx,yy)||blk[idx(xx,yy)]||ter[idx(xx,yy)]===T.water)continue;
          const d=(xx-x)*(xx-x)+(yy-y)*(yy-y);
          if(d<bd){bd=d;best={x:xx+0.5,y:yy+0.5};}
        }
        if(best)return best;
      }
      return null;
    },
    zoneAt:(x,y)=>inb(x|0,y|0)?zone[idx(x|0,y|0)]:0,
    zoneName:z=>IB.ZONES[z]?IB.ZONES[z].n:'—',
    danger:z=>IB.ZONES[z]?IB.ZONES[z].d:0,
    elevAt:(x,y)=>inb(x|0,y|0)?elev[idx(x|0,y|0)]:0,
    solid:(x,y)=>{x|=0;y|=0;if(!inb(x,y))return true;return blk[idx(x,y)]!==0;},
  };
  IB.WORLD=world;
  return world;
};

/* ================================================================
   МЕТРО — ПІДЗЕМНА КАРТА (батч 10): ДРУГА МАПА МІСТА.
   Ті ж координати, що й на поверхні: спустився на Оболоні (35,37) —
   і йдеш тунелями до Печерська (139,171). Тунелі-лабіринти, платформи,
   колії, сходи, ліхтарі, заражені в темряві. Повітряні атаки в метро
   НЕ ДІЮТЬ — це укриття №1 від шахедів.
   ================================================================ */
IB.MSTATIONS=[
  {x:35, y:37, n:'ОБОЛОНЬ'},
  {x:92, y:97, n:'КОНТРАКТОВА ПЛОЩА'},
  {x:119,y:153,n:'ХРЕЩАТИК'},
  {x:136,y:154,n:'МАЙДАН НЕЗАЛЕЖНОСТІ'},
  {x:139,y:171,n:'ПЕЧЕРСЬКА'},
  {x:196,y:102,n:'ЛІВОБЕРЕЖНА'},
  {x:196,y:183,n:'ДАРНИЦЯ'},
  {x:66, y:199,n:'ВОКАЗАЛЬНА'},
];
/* лінії тунелів (порядок станцій = маршрут) */
IB.MLINES=[
  [0,1,2,3,4],        /* Оболонь → Контрактова → Хрещатик → Майдан → Печерська */
  [1,7],              /* Контрактова → Вокзальна */
  [2,5,6],            /* Хрещатик → Лівобережна → Дарниця (під Дніпром) */
  [4,6],              /* Печерська → Дарниця (службовий, лабіринт) */
];
IB.ZONES_M=[{k:'MET',n:'МЕТРО • ТУНЕЛІ',d:2}];
for(const st of IB.MSTATIONS)IB.ZONES_M.push({k:'M'+st.n,n:'МЕТРО • '+st.n,d:1});

/* ---- БАТЧ 13: поверхи будівель (2-4 за категорією) + спеціальні кімнати метро ---- */
IB.BLD_FLOORS=function(b){
  const F={panel9:4,panel9b:4,panel9_dmg:3,admin4:4,admin3:3,factory:2,factory2:2,
    khrus:2,khrus2:2,khrus_dmg:2,hist2:2,hist2b:2,hist2c:2,hist3:3,shop1:2,shop2:2,
    dacha1:2,dacha2:2,dacha3:2};
  return F[b.cat]||2;
};
IB.MROOMS=[];
IB.buildMetro=function(){
  const W=320,H=384;
  const T=IB.TER;
  const ter=new Uint8Array(W*H),vrn=new Uint8Array(W*H),rdm=new Uint8Array(W*H),
        elev=new Uint8Array(W*H), zone=new Uint8Array(W*H), blk=new Uint8Array(W*H),
        brg=new Uint8Array(W*H);
  const idx=(x,y)=>y*W+x, inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  const hsh=IB.hsh, ri=IB.ri;
  /* все — скеля, все solid */
  ter.fill(T.rock);
  vrn.fill(0);
  blk.fill(1);
  const props=[];let propId=0;
  function prop(t,x,y,o={}){
    const p={id:propId++,t,x:x+0.5,y:y+0.5,s:!!o.s,loot:o.loot||null,looted:false,meta:o.meta||null};
    props.push(p);return p;
  }
  function carve(x,y,tt){       /* вирубати тайл: підлога тунелю/платформа/колія */
    if(!inb(x,y))return;
    const i=idx(x,y);
    ter[i]=tt;blk[i]=0;vrn[i]=0;elev[i]=0;
  }
  /* горизонтальна ділянка тунелю: 3 у перетині (підлога-колія-підлога) */
  function segH(x0,x1,y){
    const st=x0<=x1?1:-1;const pts=[];
    for(let x=x0;x!==x1+st;x+=st){
      carve(x,y-1,T.tunnel);carve(x,y,T.track);carve(x,y+1,T.tunnel);
      pts.push([x,y]);
    }
    return pts;
  }
  function segV(y0,y1,x){
    const st=y0<=y1?1:-1;const pts=[];
    for(let y=y0;y!==y1+st;y+=st){
      carve(x-1,y,T.tunnel);carve(x,y,T.track);carve(x+1,y,T.tunnel);
      pts.push([x,y]);
    }
    return pts;
  }
  const lampPts=[];
  /* маршрут між двома точками з меандром (лабіринтність) */
  function tunnel(a,b,seed){
    const mx=IB.M.round((a[0]+b[0])/2+hsh(seed,1,10)*10-5);
    const my=IB.M.round((a[1]+b[1])/2+hsh(seed,2,11)*10-5);
    const p1=segH(a[0],mx,a[1]);lampPts.push(...p1.filter((_,i)=>i%5===2));
    const p2=segV(a[1],my,mx);lampPts.push(...p2.filter((_,i)=>i%5===2));
    const p3=segH(mx,b[0],my);lampPts.push(...p3.filter((_,i)=>i%5===2));
    const p4=segV(my,b[1],b[0]);lampPts.push(...p4.filter((_,i)=>i%5===2));
  }
  /* ---- СТАНЦІЇ: зал з платформою, колією, сходами нагору, знаком М ---- */
  const stations=[];
  for(let si=0;si<IB.MSTATIONS.length;si++){
    const s=IB.MSTATIONS[si],x=s.x,y=s.y;
    /* зал: платформа 9x5 */
    for(let yy=y-2;yy<=y+2;yy++)for(let xx=x-4;xx<=x+4;xx++)carve(xx,yy,T.plat);
    /* колія вздовж південного краю залу + вихід колії за межі */
    for(let xx=x-7;xx<=x+7;xx++)carve(xx,y+3,T.track);
    /* тупики колії закриті: тайли за краями залу лишаються скелею виходячи з колії не вийти */
    /* сходи нагору (північ центр) */
    carve(x,y-2,T.plat);
    prop('stairs',x,y-2,{s:0,meta:'up'});
    blk[idx(x,y-2)]=0;
    /* знак М + стрілка */
    prop('metro_m2',x-2,y,{s:0});
    /* лавки, лут-полиці, бочки, вогняні бочки-печки */
    prop('bench',x+3,y-1,{s:1});
    if(hsh(x,y,101)<0.8)prop('shelf',x+3,y+1,{s:1,loot:'metro'});
    if(hsh(x,y,102)<0.6)prop('shelf',x-3,y+1,{s:1,loot:'metro'});
    if(hsh(x,y,103)<0.5)prop('barrels',x-4,y+2,{s:1,loot:'barrels'});
    /* лампа під стелею в центрі залу */
    lampPts.push([x,y]);
    /* ---- БАТЧ 13: ВАГОНИ (train-kit subway) — припарковані на колії ---- */
    const wn = 1 + ((hsh(x,y,131)*3)|0);
    for(let wi=0;wi<wn;wi++){
      const wx2 = x + 1 + wi*5;
      if(wx2+2<W-4 && inb(wx2,y+3)){
        const kind = wi===0 ? 'wagon_a' : ((hsh(x,wi,132)<0.5?'wagon_b':'wagon_c'));
        prop(kind,wx2,y+3,{s:1});
      }
    }
    stations.push({x,y,n:s.n});
  }
  /* ---- ТУНЕЛІ між станціями (лінії метро) ---- */
  for(let li=0;li<IB.MLINES.length;li++){
    const line=IB.MLINES[li];
    for(let k=0;k<line.length-1;k++){
      const a=IB.MSTATIONS[line[k]],b=IB.MSTATIONS[line[k+1]];
      tunnel([a.x,a.y+3],[b.x,b.y+3],li*17+k*7+3);
    }
  }
  /* ---- ЛАБІРИНТНИ ВІДГАЛУДКИ — БАТЧ 13: кожна 3-я гілка = СЕРВЕРНА або МАЙСТЕРНЯ ---- */
  for(let bi=0;bi<12;bi++){
    const base=lampPts[(hsh(bi,4,77)*lampPts.length)|0];
    if(!base)continue;
    let cx=base[0],cy=base[1];
    const len=4+((hsh(bi,5,78)*5)|0);
    for(let st=0;st<len;st++){
      const dir=(hsh(bi,st,79)*4)|0;
      if(dir===0){const p=segH(cx,cx+3,cy);cx+=3;lampPts.push(p[2]);}
      else if(dir===1){const p=segH(cx,cx-3,cy);cx-=3;lampPts.push(p[2]);}
      else if(dir===2){const p=segV(cy,cy+3,cx);cy+=3;lampPts.push(p[2]);}
      else {const p=segV(cy,cy-3,cx);cy-=3;lampPts.push(p[2]);}
    }
    if(bi%3===2){
      const srv = hsh(bi,9,133)<0.5;
      for(let yy=cy-2;yy<=cy+2;yy++)for(let xx=cx-3;xx<=cx+3;xx++)carve(xx,yy,T.plat);
      if(srv){
        prop('rack',cx-2,cy-1,{s:1});prop('rack',cx-1,cy-1,{s:1});prop('rack',cx,cy-1,{s:1});
        prop('shelf',cx+2,cy,{s:1,loot:'metro'});
        prop('corpse',cx-2,cy+1,{s:0});
      } else {
        prop('bench_w',cx,cy-1,{s:1,meta:'craft'});
        prop('barrels',cx-2,cy+1,{s:1,loot:'barrels'});
        prop('shelf',cx+2,cy,{s:1,loot:'metro'});
      }
      prop('lamp_m',cx,cy,{s:0});
      lampPts.push([cx,cy]);
      IB.MROOMS.push({x:cx,y:cy,srv,n:srv?'СЕРВЕРНА':'МАЙСТЕРНЯ'});
    } else {
      for(let yy=cy-1;yy<=cy+1;yy++)for(let xx=cx-1;xx<=cx+1;xx++)carve(xx,yy,T.tunnel);
      prop('shelf',cx,cy,{s:1,loot:'metro'});
      if(hsh(cx,cy,80)<0.5)prop('barrels',cx+1,cy+1,{s:1,loot:'barrels'});
      if(hsh(cx,cy,81)<0.35)prop('corpse',cx-1,cy,{s:0});
    }
  }
  /* ---- ЛАМПИ вдоль тунелів (ближче до стін) ---- */
  for(const[px,py]of lampPts){
    if(!inb(px,py)||blk[idx(px,py)])continue;
    if(hsh(px,py,90)<0.62)prop('lamp_m',px,py,{s:0});
  }
  /* розкидуні ящики по тунелях */
  for(let i=0;i<14;i++){
    const p=lampPts[(hsh(i,9,88)*lampPts.length)|0];
    if(!p)continue;
    if(inb(p[0],p[1])&&!blk[idx(p[0],p[1])])prop('crate',p[0],p[1],{s:1,loot:'crate'});
  }
  /* ---- блокування від пропсів (лавки/полиці/бочки — колізія) ---- */
  for(const p of props){if(p.s&&inb(p.x|0,p.y|0)){if(blk[idx(p.x|0,p.y|0)]===0)blk[idx(p.x|0,p.y|0)]=1;}}
  /* ---- зони ---- */
  function zoneAt(x,y){
    for(let si=0;si<stations.length;si++){
      const s=stations[si];
      if(IB.dist(x,y,s.x,s.y)<6)return si+1;
    }
    return 0;
  }
  for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++)zone[idx(xx,yy)]=zoneAt(xx,yy);
  /* ---- кордон карти ---- */
  for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){if(xx<2||yy<2||xx>=W-2||yy>=H-2)blk[idx(xx,yy)]=4;}
  /* ---- чисті зони у залах (спавн без замуровування) ---- */
  function clearArea(cx,cy,r){
    for(let yy=IB.M.max(1,IB.M.floor(cy-r));yy<=IB.M.min(H-2,IB.M.ceil(cy+r));yy++)
    for(let xx=IB.M.max(1,IB.M.floor(cx-r));xx<=IB.M.min(W-2,IB.M.ceil(cx+r));xx++){
      const i=idx(xx,yy);
      if(blk[i]===4)continue;
      if(blk[i])blk[i]=0;
    }
  }
  for(const st of stations){clearArea(st.x+0.5,st.y+0.5,3.4);}
  /* ---- мінімапа підземки (темні тунелі) ---- */
  const mm=IB.mk(W,H);const g=mm.g;
  const MC={[T.rock]:'#101218',[T.tunnel]:'#33363e',[T.track]:'#26282e',[T.plat]:'#3e4a58'};
  for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){g.fillStyle=MC[ter[idx(xx,yy)]]||'#101218';g.fillRect(xx,yy,1,1);}
  for(const st of stations){g.fillStyle='#cc4438';g.fillRect(st.x-1,st.y-1,3,3);}
  const world={W,H,ter,vrn,rdm,elev,zone,blk,brg,blds:[],lms:[],props,cars:[],stations,passages:[],safes:[],npcs:[],towers:[],mm,
    base:null,bridges:[],ridx:idx,inb,clearArea,
    metro:true,
    freeSpot:(x,y,maxR=6)=>{
      x|=0;y|=0;
      if(!inb(x,y))return {x:IB.M.max(3,IB.M.min(W-4,x)),y:IB.M.max(3,IB.M.min(H-4,y))};
      if(!blk[idx(x,y)])return {x:x+0.5,y:y+0.5};
      for(let r=1;r<=maxR;r++){
        let best=null,bd=1e9;
        for(let yy2=y-r;yy2<=y+r;yy2++)for(let xx2=x-r;xx2<=x+r;xx2++){
          if(!inb(xx2,yy2)||blk[idx(xx2,yy2)])continue;
          const d=(xx2-x)*(xx2-x)+(yy2-y)*(yy2-y);
          if(d<bd){bd=d;best={x:xx2+0.5,y:yy2+0.5};}
        }
        if(best)return best;
      }
      return null;
    },
    zoneAt:(x,y)=>inb(x|0,y|0)?zone[idx(x|0,y|0)]:0,
    zoneName:z=>IB.ZONES_M[z]?IB.ZONES_M[z].n:'МЕТРО',
    danger:z=>IB.ZONES_M[z]?IB.ZONES_M[z].d:2,
    elevAt:(x,y)=>0,
    solid:(x,y)=>{x|=0;y|=0;if(!inb(x,y))return true;return blk[idx(x,y)]!==0;},
  };
  IB.MWORLD=world;
  return world;
};

/* ================= БАТЧ 13: ІНТЕР'ЄРИ БУДИНКІВ =================
   Кожна будівля має 2-4 поверхи (IB.BLD_FLOORS). Інтер'єр генерується при вході,
   сідується від id будівлі + поверху (детерміновано). Зомбі всередині: зачистив
   поверх/будівлю → будівля «ЗВІЛЬНЕНА» (позначка на карті, можна сховатись/відпочити).
   Через 30-40 хв реального часу зомбі захоплюють будівлю назад (динаміка). */
IB.INTERIORS={};          /* кеш: bldIdx_floor -> world */
IB.bldState=function(bi){  /* стан будівлі: {cleared: 0/1, t: коли зачищено, floor: останній} */
  const G=IB.G;
  G.blds=G.blds||{};
  return G.blds[bi]||(G.blds[bi]={cleared:0,t:0});
};

IB.buildInterior=function(bi,floor){
  const key=bi+'_'+floor;
  if(IB.INTERIORS[key])return IB.INTERIORS[key];
  const b=IB.CWORLD.blds[bi];
  const T=IB.TER;
  const W=(b.wT*3+5)|0, H=(b.dT*3+5)|0;
  const ter=new Uint8Array(W*H),vrn=new Uint8Array(W*H),rdm=new Uint8Array(W*H),
        elev=new Uint8Array(W*H), zone=new Uint8Array(W*H), blk=new Uint8Array(W*H),
        brg=new Uint8Array(W*H);
  const idx=(x,y)=>y*W+x, inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  const hsh=IB.hsh, ri=IB.ri, seed=bi*13+floor*7;
  /* тип інтер'єру за категорією будівлі */
  const res=b.zone===0||b.zone===1||b.zone===8||b.cat==='dacha1'||b.cat==='dacha2'||b.cat==='dacha3'||b.cat==='khrus'||b.cat==='khrus2'||b.cat==='panel9'||b.cat==='panel9b';
  const ind=b.cat==='factory'||b.cat==='factory2';
  const off=b.zone===3||b.zone===4||b.cat==='admin3'||b.cat==='admin4'||b.cat==='hist3';
  const wallT=res?'intwall':(off?'intwall2':'intwall3');
  const floorT=res?T.floorw:(off?T.floorc:(ind?T.floorc:T.floort));
  for(let i=0;i<W*H;i++){ter[i]=floorT;blk[i]=1;}
  const x0=1,y0=1,x1=W-2,y1=H-2;
  for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){blk[idx(xx,yy)]=0;}
  const props=[];let propId=0;
  function prop(t,x,y,o={}){
    const p={id:propId++,t,x:x+0.5,y:y+0.5,s:!!o.s,loot:o.loot||null,looted:false,meta:o.meta||null};
    props.push(p);return p;
  }
  /* каркас стін по периметру */
  for(let xx=x0;xx<=x1;xx++){prop(wallT,xx,y0,{s:1});prop(wallT,xx,y1,{s:1});}
  for(let yy=y0+1;yy<y1;yy++){prop(wallT,x0,yy,{s:1});prop(wallT,x1,yy,{s:1});}
  /* ВИХІД: двері в центрі південної стіни */
  const dx=((x0+x1)/2)|0;
  for(let xx=dx-1;xx<=dx+1;xx++){
    for(let pi=props.length-1;pi>=0;pi--){
      const q=props[pi];
      if(q.t===wallT&&q.x===xx+0.5&&q.y===y1+0.5)props.splice(pi,1);
    }
  }
  prop('intdoor',dx,y1,{s:0,meta:'exit'});
  /* ВНУТРІШНІ ПЕРЕГОРОДКИ: стіна по середині з прорізами */
  const my=((y0+y1)/2)|0;
  const gapA=dx-1,gapB=dx+2;
  for(let xx=x0+1;xx<x1;xx++){
    if(xx===gapA||xx===gapB||xx===gapA-1)continue;
    prop(wallT,xx,my,{s:1});
  }
  /* сходи: ВНИЗ у південно-західному куті (поверх>0), ВГОРУ у південно-східному */
  if(floor>0){
    for(let yy=y0+1;yy<=y1-1;yy++)for(let xx=x0+1;xx<=x0+2;xx++)blk[idx(xx,yy)]=0;
    prop('stairs',x0+1,y1-1,{s:0,meta:'fdown'});
  }
  if(floor<(b.floors||2)-1){
    for(let yy=y0+1;yy<=y1-1;yy++)for(let xx=x1-2;xx<=x1-1;xx++)blk[idx(xx,yy)]=0;
    prop('stairs',x1-1,y1-1,{s:0,meta:'fup'});
  }
  /* ---- МЕБЛІ (furniture-kit) за типом кімнат ---- */
  function furn(t,x,y,loot){prop('furn_'+t,x,y,{s:t!=='rug'&&t!=='doormat',loot:loot||null});}
  if(res){
    /* житлова: спальня (пн-зх), вітальня (пн-сх), кухня (пд-зх), прихожа (пд-сх) */
    furn('bed',x0+2,y0+2);furn('wardrobe',x0+3,y0+1);furn('rug',x0+2,y0+3);furn('lamp2',x0+3,y0+3);
    furn('sofa',x1-3,y0+2);furn('tv',x1-2,y0+1);furn('table',x1-4,y0+2);furn('chair2',x1-4,y0+3);
    furn('fridge',x0+2,my+2);furn('stove',x0+3,my+2);furn('sink',x0+2,my+3);furn('table',x0+4,my+2);
    furn('shelf2',x1-2,my+2,'flat');furn('drawer',x1-3,my+2);furn('doormat',dx,y1-1);
    furn('plant',x0+1,y0+1);furn('plant2',x1-1,y0+2);furn('bear',x0+2,y0+4);
    if(hsh(bi,floor,141)<0.6)furn('boxo',dx-2,y1-2,'flat');
    if(hsh(bi,floor,142)<0.5)furn('box',dx+2,y1-2);
  } else if(ind){
    /* промзона: майстерня + склад */
    prop('bench_w',x0+2,my,{s:1,meta:'craft'});
    furn('shelf2',x0+2,y0+1,'flat');furn('shelf2',x0+4,y0+1,'flat');
    furn('box',x1-2,y0+1);furn('boxo',x1-3,y0+2,'flat');furn('box',x1-2,y0+3);
    prop('barrels',x0+2,y1-2,{s:1,loot:'barrels'});
    furn('washer',x1-2,y1-2);
    furn('rug',dx,y1-1);
  } else if(off){
    /* офіс: кабінети + серверні стійки на останньому поверсі */
    furn('desk',x0+2,y0+2);furn('chair',x0+2,y0+3);furn('pc',x0+2,y0+1);
    furn('shelf2',x0+4,y0+1,'flat');furn('desk',x1-3,y0+2);furn('chair',x1-3,y0+3);
    furn('table',((x0+x1)/2)|0,my-1);furn('chair2',(((x0+x1)/2)|0)-1,my+1);
    furn('shelf',x1-2,my+2,'flat');furn('drawer',x1-3,my+1);
    furn('doormat',dx,y1-1);furn('plant',x0+1,my+1);
    if(hsh(bi,floor,143)<0.5)prop('rack',x0+2,y1-2,{s:1});
  } else {
    /* магазин/інше: прилавки і полиці */
    furn('shelf2',x0+2,y0+1,'flat');furn('shelf2',x0+3,y0+1,'flat');furn('shelf2',x0+4,y0+1,'flat');
    furn('table',((x0+x1)/2)|0,my);furn('chair2',(((x0+x1)/2)|0)-1,my+1);
    furn('fridge',x1-2,y0+1);furn('boxo',x1-2,y1-2,'flat');
    furn('doormat',dx,y1-1);
  }
  /* ---- зомбі поверху (спавн при вході; зачистка = смерть усіх) ---- */
  const ndanger=Math.min(4,1+floor+((IB.ZONES[b.zone]||{}).d>=4?1:0));
  const zdefs=[];
  const types=['walker','crawler','runner'];
  for(let zi=0;zi<ndanger;zi++){
    const zx=x0+1+((hsh(bi,zi+floor*3,151)*(W-4))|0);
    const zy=y0+1+((hsh(zi,bi+floor,152)*(H-4))|0);
    const tt=types[(hsh(zi,bi,153)*3)|0];
    zdefs.push({x:IB.clamp(zx,x0+1,x1-1),y:IB.clamp(zy,y0+1,y1-1),t:tt,dead:false});
  }
  /* лампа освітлення в центрі (gfx light holes) */
  prop('lamp_m',((x0+x1)/2)|0,((y0+y1)/2)|0,{s:0});
  /* блокування від пропсів (стіни/меблі з s) */
  for(const p of props){if(p.s&&inb(p.x|0,p.y|0)){if(blk[idx(p.x|0,p.y|0)]===0)blk[idx(p.x|0,p.y|0)]=1;}}
  /* двері/сходи не блокують */
  for(const p of props){if((p.meta==='exit'||p.meta==='fup'||p.meta==='fdown')&&inb(p.x|0,p.y|0))blk[idx(p.x|0,p.y|0)]=0;}
  /* ---- мінімапа інтер'єру ---- */
  const mm=IB.mk(W,H);const g=mm.g;
  const MC={[T.floorw]:'#5e4630',[T.floort]:'#6e7680',[T.floorc]:'#44464e',[T.floorr]:'#6e3830'};
  for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){g.fillStyle=blk[idx(xx,yy)]?'#20232c':(MC[ter[idx(xx,yy)]]||'#4a4c54');g.fillRect(xx,yy,1,1);}
  const zoneName='БУДИНОК • '+(IB.ZONES[b.zone]?IB.ZONES[b.zone].n:'КИЇВ')+' • ПОВЕРХ '+(floor+1)+'/'+(b.floors||2);
  const world={W,H,ter,vrn,rdm,elev,zone,blk,brg,blds:[],lms:[],props,cars:[],stations:[],passages:[],safes:[],npcs:[],towers:[],mm,
    base:null,bridges:[],ridx:idx,inb,
    clearArea:null,
    freeSpot:(x,y,maxR=5)=>{
      x|=0;y|=0;
      if(!inb(x,y))return{x:W/2,y:H/2};
      if(!blk[idx(x,y)])return{x:x+0.5,y:y+0.5};
      for(let r=1;r<=maxR;r++){
        for(let yy2=y-r;yy2<=y+r;yy2++)for(let xx2=x-r;xx2<=x+r;xx2++){
          if(!inb(xx2,yy2)||blk[idx(xx2,yy2)])continue;
          return{x:xx2+0.5,y:yy2+0.5};
        }
      }
      return{x:W/2,y:H/2};
    },
    zoneAt:()=>b.zone,
    zoneName:()=>zoneName,
    danger:()=>(IB.ZONES[b.zone]||{}).d||2,
    elevAt:()=>0,
    solid:(x,y)=>{x|=0;y|=0;if(!inb(x,y))return true;return blk[idx(x,y)]!==0;},
    interior:true,bld:bi,floor,floors:(b.floors||2),zdefs,
  };
  IB.INTERIORS[key]=world;
  return world;
};
