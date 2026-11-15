/* IBONARIUM KYIV — assets.js: Kenney CC0 asset loader (city kits + cars + train + furniture) */
IB.ASSETS = (function(){
  const POOLS = {
    khrus: 6, khrus2: 4, panel9: 4, panel9b: 3,
    hist2: 6, hist2b: 4, hist2c: 4, hist3: 4,
    admin3: 3, admin4: 3, shop1: 3, shop2: 4,
    factory: 4, factory2: 4, garage: 4,
    khrus_dmg: 4, panel9_dmg: 3, hist_ruin: 3,
    dacha1: 2, dacha2: 2, dacha3: 1,
  };
  const PROPS = ['tree_o','tree_o2','pine','dumpster','traff','lamp','lamp_b','barr','cone',
                 'crate','crate2','crate3','chimney','tank','fence','bush','antenna'];
  const ROADS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,'wide'];
  /* БАТЧ 13: авто (car-kit), вагони (train-kit), меблі (furniture-kit) */
  const CARS = ['vaz','vaz_a','vaz_b','lanos','lanos_a','lanos_b','skoda','skoda_a','skoda_b',
                'taxi','suv','truck','police','ambulance','van','delivery','wreck1','wreck2'];
  const DIRS = ['se','sw','nw','ne'];
  const WAGONS = ['wagon_a','wagon_b','wagon_c','loco_a'];
  const FURN = ['bed','bed2','bunk','table','chair','chair2','sofa','sofa2','shelf','shelf2',
                'fridge','stove','sink','washer','tv','tv2','toilet','tub','desk','pc',
                'wardrobe','drawer','plant','plant2','rug','doormat','lamp','lamp2','box','boxo','bear','bench'];
  const IMG = {};
  function listAll(){
    const out = [];
    for(const cat in POOLS) for(let i = 0; i < POOLS[cat]; i++)
      out.push(['bld_' + cat + '_' + i, 'assets/bld_' + cat + '_' + i + '.png']);
    for(const p of PROPS) out.push(['prop_' + p, 'assets/' + p + '.png']);
    for(const r of ROADS) out.push(['road_' + r, 'assets/road_' + r + '.png']);
    for(const m of CARS) for(const d of DIRS){
      out.push(['car_' + m + '_' + d, 'assets/car_' + m + '_' + d + '.png']);
      out.push(['car_' + m + '_' + d + '_d', 'assets/car_' + m + '_' + d + '_d.png']);
    }
    for(const w of WAGONS) out.push([w, 'assets/' + w + '.png']);
    for(const f of FURN) out.push(['furn_' + f, 'assets/furn_' + f + '.png']);
    return out;
  }
  function load(){
    const list = listAll();
    let done = 0;
    return new Promise(res=>{
      if(!list.length){ res(IMG); return; }
      const fin = ()=>{ done++; if(done >= list.length) res(IMG); };
      for(const [key, url] of list){
        const im = new Image();
        im.onload = fin;
        im.onerror = fin;   /* missing file -> procedural fallback */
        im.src = url;
        IMG[key] = im;
      }
    });
  }
  return {load, IMG, POOLS};
})();
