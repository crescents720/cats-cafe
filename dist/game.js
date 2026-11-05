'use strict';

const starterCats = ['sesame','pudding','chestnut'];
const cats = {
  sesame: { name:'芝麻', stars:3, traits:'慢热 · 安静', coat:'#46434a', accent:'#bf5241' },
  pudding: { name:'布丁', stars:3, traits:'亲人 · 爱玩', coat:'#e49b4e', accent:'#667e58' },
  chestnut: { name:'栗子', stars:3, traits:'好奇 · 温和', coat:'#ead5ae', accent:'#9a654c' },
  mint: { name:'薄荷', stars:3, traits:'安静 · 温和' },
  peach: { name:'桃桃', stars:3, traits:'亲人 · 好奇' },
  latte: { name:'拿铁', stars:4, traits:'亲人 · 爱玩 · 好奇' },
  cloud: { name:'云朵', stars:4, traits:'安静 · 温和 · 亲人' },
  moon: { name:'月牙', stars:5, traits:'安静 · 好奇 · 温和 · 慢热' },
  caramel: { name:'焦糖', stars:5, traits:'爱玩 · 好奇 · 亲人 · 温和' },
  moss: { name:'青团', stars:3, traits:'爱玩 · 好奇' },
  mist: { name:'雾雾', stars:4, traits:'安静 · 慢热 · 好奇' },
  amber: { name:'琥珀', stars:5, traits:'安静 · 亲人 · 好奇 · 爱玩' }
};
const guests = [
  { name: '小林', hint: '想在窗边看会儿书。要是有只安静的猫就更好了。', cat: 'sesame', drink: '原味拿铁', stay:1 },
  { name: '阿遥', hint: '刚下班，想点杯咖啡，再找只猫玩一会儿。', cat: 'pudding', drink: '卡布奇诺', stay:1 },
  { name: '周老师', hint: '带了速写本，想画一只会自己凑过来的小猫。', cat: 'chestnut', drink: '蜂蜜拿铁', stay:2 },
  { name: '许邻居', hint: '在等雨停。哪只猫愿意陪我坐一会儿？', cat: 'sesame', drink: '美式咖啡', stay:1 }
];
const clues = [
  { title: '旧猫毯', detail: '她给猫留了一个靠近自己的位置，但希望猫可以自己决定什么时候过来。', x: 22, y: 39 },
  { title: '窗边的椅子', detail: '她每天在这把椅子上坐一会儿。旁边的宽窗台晒得到太阳。', x: 84, y: 29 },
  { title: '织到一半的毛衣', detail: '她做针线时喜欢安静。不过掉到脚边的毛线团，偶尔也需要一个小帮手。', x: 60, y: 72 }
];
const outcomes = {
  sesame: { title: '窗边的下午', message: '芝麻陪我织完了一只袖子。太阳落下去的时候，它还在窗台上。', place: '窗台', base: 3 },
  pudding: { title: '滚走的毛线团', message: '布丁把毛线团拨到椅子底下，自己也钻进去找。我笑了好一会儿。', place: '椅边', base: 3 },
  chestnut: { title: '沙发上的新朋友', message: '栗子在客厅转了一圈，最后选了我给它留的旧猫毯。', place: '沙发', base: 2 }
};
for (const [id,cat] of Object.entries(cats)) {
  if (!outcomes[id]) outcomes[id] = { title:cat.name + '的午后', message:cat.name + '在客厅里挑了一个舒服的位置。等我把毛线收好，它已经睡着了。', place:'客厅', base:cat.traits.includes('安静') || cat.traits.includes('爱玩') ? 3 : 2 };
}
const icons = {
  shop: '<path d="M3 9h18L19 4H5zM5 9v11h14V9M9 20v-6h6v6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  photo: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m4 16 5-5 4 4 3-3 4 4"/><circle cx="15" cy="8" r="1"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8m-3-4h6"/>',
  leaf: '<path d="M20 4c-9 0-15 3-15 9a5 5 0 0 0 5 5c6 0 9-6 10-14ZM4 21l9-9"/>',
  cup: '<path d="M4 8h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 9h2a2 2 0 0 1 0 4h-2M3 21h17M8 3v2m4-2v2"/>'
};
function icon(name) {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
}

const storageKey = 'cats-and-cafe-prototype-v1';
const fresh = () => ({ coins: 48, points: 0, beans: 4, milk: 4, honey: 1, menu: false, served: 0, turn: 0, period:0, morning:false, workers:{}, flour:2, pastries:{}, guest: 0, progress: 'locked', found: [], deadline: 0, away: null, pending: null, album: [], tables: [], roster:[], shift:[], opened:false, storySeen:false, diningLevel:0, theme:"spring", pity:0, capacity:4, cans:0, kibble:1, care:{}, energy:{day:realDay(),value:5}, cleared:[], puzzle:null });
function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.album) && Array.isArray(saved.found)) {
      const state = { ...fresh(), ...saved };
      if (!Array.isArray(saved.roster)) state.roster = [...starterCats];
      if (typeof saved.opened !== 'boolean') state.opened = state.roster.length >= 3;
      if (!Array.isArray(saved.shift)) state.shift = state.opened ? state.roster.slice(0,4) : [];
      if (typeof saved.storySeen !== 'boolean') state.storySeen = true;
      if (!Number.isInteger(saved.diningLevel)) state.diningLevel = state.opened ? 2 : 0;
      if (!Number.isInteger(saved.period)) state.tables = state.tables.map(table=>({...table,until:Math.min(table.until,state.turn+2)}));
      return state;
    }
  } catch {}
  return fresh();
}
let s = restore();
let tab = s.storySeen ? 'shop' : 'story';
let storyPage = 0;
let diningRoom = 0;
let selected = '';
let drink = 'latte';
let brewStep = 0;
let ingredientSelected = '';
let heatStart = null;
let milkTemperature = null;
let lounge = false;
let joiningSeat = null;
let toastTimeout;
const workspace = document.querySelector('#workspace');
const dialog = document.querySelector('#dialog');
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(s)); } catch {}
}
function note(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('on');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('on'), 2700);
}
function update() { save(); refresh(); }
function refresh() {
  const scroll = workspace.querySelector('.screen-body')?.scrollTop;
  render();
  if (scroll) workspace.querySelector('.screen-body')?.scrollTo(0, scroll);
}
function go(next) {
  tab = next;
  if (next !== 'brew') { selected = ''; heatStart = null; }
  if (next !== 'board') mergeSelected = null;
  render();
  workspace.focus({preventScroll:true});
}
const hours = ['10:00','11:30','13:00','14:30','16:00','17:30','19:00'];
function afterHours() { return s.period === hours.length-1; }
function isTrading() { return s.opened && !s.morning && !afterHours(); }
function advancePeriod() {
  if (!isTrading()) return;
  s.period += 1;
  advance();
}
function nextMorning() {
  if (!s.opened || s.morning || !afterHours()) return;
  advance();
  s.tables = [];
  s.period = 0;
  s.morning = true;
  for (const id of catIds()) {
    const info = careState(id);
    if (s.away?.cat !== id && !info.recovery) {
      info.stamina = Math.min(100,info.stamina+20);
      s.care[id] = info;
    }
  }
  joiningSeat = null; lounge = false; diningRoom = 0; save(); go('shop');
  note('新的一天。先做一张晨间订单，领开店金币。');
}
function advance() {
  s.turn += 1;
  s.tables = s.tables.filter(table => table.until > s.turn);
  if (s.away && s.turn >= s.away.until) {
    const cat = s.away.cat;
    const score = outcomes[cat].base + (s.away.clues >= 2 ? 1 : 0);
    s.pending = { id: 'visit-' + s.turn, template: 'lin-home-v1', cat, score };
    s.away = null;
    s.progress = 'mail';
    return true;
  }
  return false;
}
function catBusy(id) {
  if (s.away?.cat === id) return '上门陪伴中';
  if (careState(id).recovery) return '休息恢复中';
  const table = s.tables.find(item => item.cat === id);
  return table ? (table.seat + 1) + '号桌陪伴中' : '';
}
function availableSeat() {
  for (let offset = 0; offset < seatCount(); offset += 1) {
    const index = (s.served + offset) % seatCount();
    if (!s.tables.some(table => table.seat === index)) return index;
  }
  return -1;
}
function matchList() {
  return catIds().map(id => {
    const cat = cats[id];
    const unavailable = staffStatus(id,tab !== 'dispatch');
    return '<button type="button" class="choice ' + (selected === id ? 'selected' : '') + '" data-act="cat" data-id="' + id + '" aria-pressed="' + (selected === id) + '" ' + (unavailable ? 'disabled' : '') + '><img src="' + avatars[id] + '" alt=""><span><strong>' + cat.name + '</strong><small>' + stars(cat) + ' · ' + cat.traits + ' · 精力 ' + careState(id).stamina + '</small></span><small class="tag">' + (unavailable || (selected === id ? '已选' : '可安排')) + '</small></button>';
  }).join('');
}
function screen(title, kicker, content, back = 'shop') {
  workspace.innerHTML = '<header class="screen-head"><button class="back" type="button" data-act="tab" data-id="' + back + '" aria-label="返回">‹</button><div><h1>' + title + '</h1><p>' + kicker + '</p></div>' + (s.opened && !['renovate','brew','board','clues'].includes(tab) ? goalButton() : '') + '</header><div class="screen-body">' + content + '</div>';
}
function render() {
  document.documentElement.dataset.theme = s.theme;
  document.querySelector('#tabs').hidden = tab === 'story';
  const active = { order:'shop', brew:'shop', adopt:'shop', care:'shop', shift:'shop', renovate:'stock', team:'stock', board:'pantry', clues:'mail', dispatch:'mail', letter:'mail' }[tab] ?? tab;
  document.querySelector('#tabs').innerHTML = [['shop','猫咖'], ['pantry','备料'], ['mail','委托'], ['photo','相册'], ['stock','店务']].map(([id, label]) =>
    '<button type="button" class="tab" data-act="tab" data-id="' + id + '" aria-current="' + (active === id) + '">' + icon(id === 'stock' ? 'cup' : id === 'pantry' ? 'leaf' : id) + label + (id === 'mail' && (s.pending || s.progress === 'ready') ? '<em>' + (s.pending ? '新信' : '新') + '</em>' : '') + '</button>').join('');
  switch (tab) {
    case 'story': renderStory(); break;
    case 'shop': renderShop(); break;
    case 'renovate': renderRenovation(); break;
    case 'order': renderOrder(); break;
    case 'brew': renderBrew(); break;
    case 'stock': renderStock(); break;
    case 'team': renderTeam(); break;
    case 'adopt': renderAdoption(); break;
    case 'care': renderCare(); break;
    case 'shift': renderShift(); break;
    case 'pantry': renderPantry(); break;
    case 'board': renderBoard(); break;
    case 'mail': renderMission(); break;
    case 'clues': renderClues(); break;
    case 'dispatch': renderDispatch(); break;
    case 'letter': renderLetter(); break;
    case 'photo': renderAlbum(); break;
  }
}
const catPaths = {
  sesame: [51, 47, 59, 51, '8s', '-1s'],
  pudding: [42, 63, 62, 57, '6s', '-2s'],
  chestnut: [45, 72, 58, 65, '9s', '-3s']
};
const bunks = [[24,51],[50,51],[77,51],[24,60],[50,60],[77,60]];
function shelterActivity(id, index) {
  const info = careState(id);
  const recovery = info.recovery?.item;
  if (recovery === 'kibble' || recovery === 'can') return { x:index%2 ? 91 : 7, y:67+(index%3)*2, mode:'eat', label:'吃饭' };
  const bed = bunks[index%bunks.length];
  if (recovery === 'bed' || (!recovery && (info.stamina < minWorkStamina || (s.morning && index%2 === 0)))) {
    return { x:bed[0]+(index>=bunks.length ? 5 : -4), y:bed[1], mode:'sleep', label:'睡觉' };
  }
  return { x:24+(index%4)*16, y:76+(index%3)*5, mode:'roam', label:recovery === 'toy' ? '玩耍' : '活动' };
}
const diningStages = [
  { name:'街角小店', count:2, cost:0, detail:'先用两张桌子招待街坊。' },
  { name:'添一张窗边桌', count:3, cost:35, detail:'搬来一张二手木桌，主厅多一张营业桌。' },
  { name:'添一张花边桌', count:4, cost:110, detail:'把主厅的另一角也布置起来。' },
  { name:'打通隔壁阳光间', count:6, cost:360, detail:'开辟第二个餐区，新添两桌，可横滑切换。' },
  { name:'扩成绿植阳光房', count:8, cost:850, detail:'在阳光间再添两桌和一排窗边绿植。' }
];
const seats = Array.from({length:8}, (_, index) => {
  const slot = index % 4;
  const x = slot % 2 ? 74 : 23;
  const y = slot < 2 ? 57 : 74;
  return { x:x+5, y:y-2, catX:x-10, catY:y+1, furnitureX:x, furnitureY:y };
});
function seatCount() { return diningStages[s.diningLevel].count; }
function diningProject() { return diningStages[s.diningLevel + 1]; }
function goalButton(onScene = false) {
  const project = diningProject();
  if (!project) return '';
  return '<button class="' + (onScene ? 'build-float' : 'goal-header') + '" type="button" data-act="tab" data-id="renovate"><b>' + (onScene ? project.name : '扩店目标') + '</b><small>' + Math.min(s.coins,project.cost) + ' / ' + project.cost + ' 金币</small></button>';
}
function diningBackdrop() {
  return '<img class="cafe-bg scene-art' + (diningRoom ? ' annex-art' : '') + (afterHours() ? ' evening-art' : '') + '" draggable="false" src="assets/dining-sunlit.webp" alt="">';
}
function diningFurniture(seat, index) {
  return '<svg class="dining-furniture" style="left:' + seat.furnitureX + '%;top:' + seat.furnitureY + '%" viewBox="0 0 52 38" shape-rendering="crispEdges" aria-hidden="true"><path fill="var(--room-grain)" d="M5 30h44v3h-5v2H12v-2H5z"/><path fill="var(--room-frame)" d="M36 6h10v4h3v19h-3v6h-3v-7h-6v7h-3V15h2z"/><path fill="var(--room-trim)" d="M38 8h7v12h-7zm-1 15h10v4H37z"/><path fill="var(--room-frame)" d="M16 16h5v14h4v3H12v-3h4zM5 11h27v3h3v6h-3v3H5v-3H2v-6h3z"/><path fill="var(--room-table)" d="M6 10h25v3h3v5h-3v3H6v-3H3v-5h3z"/><path fill="#fff" opacity=".45" d="M6 11h8v1H6zm18 7h7v1h-7z"/><path fill="#fffaf0" d="M25 13h4v4h-4zm4 1h2v2h-2z"/><path fill="var(--room-pot)" d="M15 12h7v5h-7z"/><path fill="var(--room-green)" d="M17 6h2v7h-2zM14 5h3v4h-3zM19 3h3v5h-3z"/></svg>' +
    (s.tables.some(item => item.seat === index) ? '' : '<span class="empty-seat" style="left:' + seat.furnitureX + '%;top:' + (seat.furnitureY+1) + '%">' + (index+1) + '号桌</span>');
}
function animationArt(sheet, extra = '') {
  return '<span class="pixel-animation ' + extra + '" style="--frames:url(' + sheet + ')" aria-hidden="true"></span>';
}
function catActor(id, inLounge = false) {
  const table = s.tables.find(item => item.cat === id);
  const onFloor = s.shift.includes(id) && isTrading() && !restRequired(id);
  if (s.away?.cat === id || (inLounge && (table || onFloor)) || (!inLounge && !table && !onFloor)) return '';
  if (!inLounge && (table ? Math.floor(table.seat / 4) !== diningRoom : diningRoom === 1)) return '';
  const index = catIds().indexOf(id);
  const activity = inLounge ? shelterActivity(id,index) : null;
  const homePath = activity ? [activity.x,activity.y,Math.min(83,activity.x+11),activity.y-4,(6+index%4)+'s',(-index/2)+'s'] : catPaths[id];
  const [x,y,toX,toY,duration,delay] = homePath ?? [31+(index%3)*14, 50+(index%4)*5, 43+(index%3)*11, 53+(index%4)*5, (6+index%4)+'s', (-index/2)+'s'];
  const seat = table ? seats[table.seat] : null;
  const joining = table?.seat === joiningSeat;
  const stationary = activity && activity.mode !== 'roam';
  const style = '--x:' + (seat?.catX ?? x) + '%;--y:' + (seat?.catY ?? y) + '%;--from-x:' + x + '%;--from-y:' + y + '%;--to-x:' + toX + '%;--to-y:' + toY + '%;--duration:' + duration + ';--delay:' + delay + ';--size:clamp(38px,12vw,60px)';
  const art = stationary || (seat && !joining) ? catAnimation[id].sit : catAnimation[id].walk;
  return '<button class="actor cat ' + (stationary ? 'companion ' + activity.mode : seat ? joining ? 'pair' : 'companion' : 'roam') + '" type="button" data-act="pet" data-id="' + id + '" aria-label="看看' + cats[id].name + (activity ? ' · ' + activity.label : '') + '" style="' + style + '">' + animationArt(art) + (joining ? animationArt(catAnimation[id].sit, 'after-walk') : '') + '<span class="actor-label">' + cats[id].name + (stationary ? ' · ' + activity.label : '') + '</span>' + (seat ? '<span class="spark" aria-hidden="true">♥</span>' : activity?.mode === 'sleep' ? '<span class="spark" aria-hidden="true">z</span>' : '') + '</button>';
}
function guestActor(index, table = null) {
  const guest = guests[index];
  const seat = table ? seats[table.seat] : null;
  const joining = table?.seat === joiningSeat;
  const style = '--enter-x:' + (joining ? 46 : 89) + '%;--enter-y:' + (joining ? 55 : 83) + '%;--x:' + (seat?.x ?? 46) + '%;--y:' + (seat?.y ?? 55) + '%;--size:clamp(55px,16vw,78px)';
  const label = seat ? guest.name + ' · ' + (table.seat + 1) + '号桌' : guest.name + ' · 点单';
  const art = joining || !seat ? peopleAnimation[index].walk : peopleAnimation[index].sit;
  const after = joining ? peopleAnimation[index].sit : peopleAnimation[index].idle;
  const content = animationArt(art) + (joining || !seat ? animationArt(after, 'after-walk') : '') + '<span class="actor-label">' + label + '</span>';
  const action = seat ? 'table' : 'tab';
  return '<button class="actor guest ' + (seat ? joining ? 'seating' : 'seated' : 'arriving') + '" type="button" data-act="' + action + '" data-id="' + (seat ? table.seat : 'order') + '" aria-label="' + (seat ? label : '接待' + guest.name) + '" style="' + style + '">' + content + '</button>';
}
function floorHeader(clock) {
  return '<div class="scene-top"><div class="status-row"><span class="stat day-tag">' + (s.opened ? (s.morning ? '开店前备料' : afterHours() ? '19:00 · 打烊' : '营业时段 ' + clock) : '筹备中') + '</span><div class="stats"><span class="stat" aria-label="金币 ' + s.coins + '">' + icon('coin') + ' ' + s.coins + '</span><span class="stat" aria-label="营业积分 ' + s.points + '">' + icon('leaf') + ' ' + s.points + '</span></div></div><div class="sign"><h1>Cats <i>&amp;</i> Cafe</h1><p>' + (lounge ? '猫舍 · 休息与照顾' : isTrading() ? '街角猫咖 · 营业中' : s.opened ? '街角猫咖 · 暂未接单' : '街角猫咖 · 筹备中') + '</p></div><div class="floor-switch" aria-label="场景切换"><button type="button" data-act="floor" data-id="dining" aria-pressed="' + (!lounge && diningRoom === 0) + '">餐厅</button>' + (seatCount() > 4 ? '<button type="button" data-act="floor" data-id="annex" aria-pressed="' + (!lounge && diningRoom === 1) + '">阳光间</button>' : '') + '<button type="button" data-act="floor" data-id="lounge" aria-pressed="' + lounge + '">猫舍</button></div></div>';
}
function renderShop() {
  const index = s.guest % guests.length;
  const guest = guests[index];
  const clock = hours[s.period];
  const target = goalButton(true);
  if (!s.opened && !lounge) { renderOnboarding(clock); return; }
  const callout = s.pending ? '<button class="primary mail-float" type="button" data-act="open-mail">' + icon('mail') + ' 拆开新来信</button>' : s.progress === 'ready' ? '<button class="secondary mail-float" type="button" data-act="tab" data-id="mail">' + icon('mail') + ' 小林的委托</button>' : '';
  const activeCats = catIds().filter(id => !staffStatus(id)).length;
  if (lounge) {
    workspace.innerHTML = '<section class="scene" data-floor="lounge" aria-label="猫舍"><img class="cafe-bg" draggable="false" src="assets/shelter-sunlit.webp" alt=""><div class="sun-glint"></div>' + floorHeader(clock) + target + catIds().map(id => catActor(id, true)).join('') + '<div class="order-dock"><div class="order-copy"><b>猫舍</b><small>' + catIds().filter(id => (!isTrading() || !s.shift.includes(id) || restRequired(id)) && !s.tables.some(table => table.cat === id) && s.away?.cat !== id).length + ' 只在猫舍 · ' + catIds().length + ' / ' + catCapacity() + ' 个栏位</small></div><button type="button" class="secondary" data-act="tab" data-id="adopt">去领养</button>' + (!s.opened && canOpen() ? '<button type="button" class="primary" data-act="open-shop">开门营业</button>' : '<button type="button" class="primary" data-act="tab" data-id="care">照顾猫咪</button>') + '</div></section>';
    return;
  }
  const firstSeat = diningRoom * 4;
  const furniture = seats.slice(firstSeat,Math.min(firstSeat+4,seatCount())).map((seat,index)=>diningFurniture(seat,firstSeat+index)).join('');
  const occupied = s.tables.filter(item=>Math.floor(item.seat/4) === diningRoom).sort((a,b) => seats[a.seat].y - seats[b.seat].y).map(item => guestActor(item.guest, item)).join('');
  const blocked = !isTrading() || availableSeat() < 0 || !activeCats;
  const action = s.morning ? '<button class="primary" type="button" data-act="morning-board">去做晨间订单</button>' :
    afterHours() ? '<button class="primary" type="button" data-act="close-shop">结账打烊</button>' :
    '<button class="secondary" type="button" data-act="next-period">下一时段</button>' + (blocked ? (activeCats ? '' : '<button class="primary" type="button" data-act="tab" data-id="shift">安排排班</button>') : '<button class="primary" type="button" data-act="tab" data-id="order">接待客人</button>');
  const hint = s.morning ? '完成后领 24 金币，免费开局' : afterHours() ? '结账后进入次日筹备' : s.tables.length + ' / ' + seatCount() + ' 桌在座' + (blocked && !activeCats ? ' · 无空闲猫咪' : '');
  const title = s.morning ? '开店前备料' : afterHours() ? '今天营业结束' : blocked ? (activeCats ? '客人坐满了' : '猫咪正在忙') : guest.name + '来店了';
  workspace.innerHTML = '<section class="scene painted-dining" data-floor="dining" aria-label="猫咖餐厅">' + diningBackdrop() + floorHeader(clock) + target + furniture + occupied + catIds().map(id => catActor(id)).join('') + (!blocked && !diningRoom ? guestActor(index) : '') + callout + '<div class="order-dock"><div class="order-copy"><b>' + title + '</b><small>' + hint + '</small></div>' + action + '</div></section>';
}
function showTable(index) {
  const table = s.tables.find(item => item.seat === index);
  if (!table) return;
  dialog.innerHTML = '<div class="dialog-top"><h2 class="heading" id="dialog-title">' + (index + 1) + '号桌 · ' + guests[table.guest].name + '</h2><button type="button" class="close" data-act="close" aria-label="关闭">×</button></div><p class="copy">' + cats[table.cat].name + '正在陪伴。还可停留 ' + (table.until - s.turn) + ' 个营业时段。</p><button class="secondary wide" type="button" data-act="close-table" data-id="' + index + '">结账并让猫咪休息</button>';
  dialog.setAttribute('aria-labelledby','dialog-title');
  dialog.showModal();
}

function renderOrder() {
  const index = s.guest % guests.length;
  const guest = guests[index];
  screen('接待客人', '01 / 客人点单', '<div class="order-guest"><img class="guest-avatar" src="' + peopleAnimation[index].portrait + '" alt=""><div><b>' + guest.name + ' · 想喝' + guest.drink + '</b><p>「' + guest.hint + '」</p></div></div><section class="panel"><h2 class="heading">挑一只猫陪伴</h2><p class="copy">根据客人的心情和猫咪的性格来安排。</p><div class="choice-list">' + matchList() + '</div><button class="primary wide" type="button" data-act="to-brew" ' + (!selected ? 'disabled' : '') + '>选好猫咪，去吧台</button></section>');
}
const coffeeMenu = {
  latte: { name:'原味拿铁', tasks:['beans','milk','heat','pitcher'], stock:['beans','milk'] },
  americano: { name:'美式咖啡', tasks:['beans','water'], stock:['beans'] },
  cappuccino: { name:'卡布奇诺', tasks:['beans','milk','heat','foam'], stock:['beans','milk'] },
  honey: { name:'蜂蜜拿铁', tasks:['beans','milk','heat','honey','pitcher'], stock:['beans','milk','honey'], recipe:true }
};
const ingredientNames = { beans:'咖啡豆', milk:'牛奶', honey:'蜂蜜', pitcher:'奶缸', water:'热水', foam:'绵密奶泡' };
const pastryMenu = {
  sponge: { name:'香草戚风', price:8, level:1 },
  honeycake: { name:'蜂蜜磅蛋糕', price:12, level:2, honey:true }
};
const crew = {
  baker: { name:'小满', title:'烘焙师', cost:65, upgrade:45, description:'烤蛋糕供搭售。2 级解锁蜂蜜磅蛋糕，培训后每炉产量增加。' },
  barista: { name:'阿青', title:'咖啡师', cost:90, upgrade:60, description:'协助吧台出杯。每级让每杯咖啡多赚 2 金币。' }
};
let pastry = '';
function coffeeUnlocked(id) { return !coffeeMenu[id].recipe || s.menu; }
function brewTasks() { return coffeeMenu[drink].tasks; }
function brewTask() { return brewTasks()[brewStep]; }
function canBrew() { return coffeeUnlocked(drink) && coffeeMenu[drink].stock.every(key=>s[key] > 0); }
function resetBrew() {
  brewStep = 0;
  ingredientSelected = '';
  heatStart = null;
  milkTemperature = null;
}
function ingredientIcon(id) {
  const art = {
    water:'<path fill="#567f88" d="M11 3h3v3h2v4h3v6h-2v4H7v-4H5v-6h3V6h3z"/><path fill="#cceefa" d="M11 7h3v4h3v5h-2v2H8v-2H7v-5h4z"/>',
    foam:'<path fill="#ba9a7c" d="M3 14h4v-4h3V7h5v3h4v4h2v6H3z"/><path fill="#fff3d8" d="M5 15h4v-4h3V9h2v3h4v3h1v3H5z"/>',
    beans:'<path fill="#583525" d="M5 7h7V5h5v3h4v8h-3v3h-6v2H7v-3H4V9z"/><path fill="#ad6b43" d="M6 9h4V7h5v3h-2v4h-3v4H7v-2H6zM16 11h3v4h-3v3h-4v-2h3z"/>',
    milk:'<path fill="#5e766d" d="M7 3h10v3l3 5v11H5V11l2-5z"/><path fill="#ffefcb" d="M8 4h8v3l2 4v9H7v-9l1-4z"/><path fill="#84a496" d="M7 12h11v6H7zM9 7h6v2H9z"/>',
    honey:'<path fill="#a36c35" d="M6 4h13v5h-2l3 3v8h-3v2H8v-2H5v-8l3-3H6z"/><path fill="#eab055" d="M8 6h9v2H8zm2 5h5v2h3v6H7v-6h3z"/><path fill="#ffeb97" d="M9 14h6v3H9z"/>',
    pitcher:'<path fill="#60524a" d="M3 6h16v4h3v7h-4v4H6v-3H4V9H3z"/><path fill="#a6ada5" d="M6 8h11v11H7v-3H6zm12 4h2v3h-2z"/><path fill="#e7e7ce" d="M7 8h9v2H7zM8 11h2v6H8z"/>'
  };
  return '<svg viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges">' + art[id] + '</svg>';
}
function brewArt(task) {
  const machine = '<path fill="#674b3a" d="M21 27h87v61H21z"/><path fill="#78917a" d="M23 28h83v57H23z"/><path fill="#a7b393" d="M23 28h83v13H23z"/><path fill="#344a40" d="M31 47h66v31H31z"/><path fill="#d8b180" d="M34 32h19v5H34zm47-1h5v6h-5zm9 0h5v6h-5z"/><path fill="#e4c79a" d="M22 81h85v5H22z"/>';
  const cup = '<path fill="#704b39" d="M46 48h34v7h10v15H79v9H54v-5h-5z"/><path fill="#fff0c7" d="M48 51h30v19h-4v6H55v-5h-4zm30 7h9v9h-9v-3h5v-3h-5z"/><path fill="#915936" d="M50 51h25v6H50z"/>';
  const jug = '<path fill="#62534a" d="M43 49h32l6 7h9v16H79v7H51v-6h-5z"/><path fill="#b7bcb2" d="M46 52h28l4 6v17H53v-5h-5zm34 8h7v9h-7v-3h4v-3h-4z"/><path fill="#f3e1ba" d="M48 53h25v7H48z"/>';
  const steam = '<path class="steam" fill="#fff0ce" d="M56 27h3v7h3v7h-3v-4h-3zm13-5h3v10h3v7h-3v-4h-3z"/>';
  const image = task === 'beans' ? machine + '<path fill="#e9c493" d="M48 10h34v12H48z"/><path fill="#64412f" d="M50 14h30v8H50z"/>' : (task === 'milk' || task === 'heat') ? machine + jug + (heatStart !== null ? steam : '') : cup + (task === 'pitcher' ? '<path fill="#fff0c7" d="M61 52h5v2h5v2h-5v2h-5v-2h-5v-2h5z"/>' : !task ? steam + '<path fill="#fff0c7" d="M61 52h5v2h5v2h-5v2h-5v-2h-5v-2h5z"/>' : '');
  return '<svg viewBox="0 0 128 92" aria-hidden="true" shape-rendering="crispEdges">' + image + '</svg>';
}
function brewTemperature(now) {
  if (heatStart === null) return milkTemperature ?? 42;
  const progress = ((now - heatStart) / 29) % 72;
  return Math.round(42 + Math.min(progress, 72 - progress));
}
function renderBrew() {
  const guest = guests[s.guest % guests.length];
  const tasks = brewTasks();
  const task = brewTask();
  const labels = { beans:'把咖啡豆拖到研磨机', milk:'把牛奶拖到奶缸', heat:'把牛奶加热到 58–66°C', honey:'把蜂蜜拖入杯中', pitcher:'把奶缸拖到咖啡杯', water:'加热水，调成美式', foam:'把厚奶泡轻轻盖在咖啡上' };
  const available = tasks.filter((id,index)=>id !== 'heat' && index >= brewStep);
  const ingredients = task && task !== 'heat' ? '<div class="ingredient-tray" aria-label="配料">' + available.map(id => '<button type="button" class="ingredient ' + (ingredientSelected === id ? 'picked' : '') + '" data-act="ingredient" data-id="' + id + '" aria-pressed="' + (ingredientSelected === id) + '">' + ingredientIcon(id) + '<span>' + ingredientNames[id] + '</span></button>').join('') + '</div>' : '';
  const gauge = task === 'heat' ? '<div class="temperature"><div class="line-item"><b id="temp-value">' + brewTemperature(performance.now()) + '°C</b><span>绿色区间 58–66°C</span></div><div class="temp-track" aria-hidden="true"><i id="temp-needle"></i></div><button class="primary wide" type="button" data-act="heat">' + (heatStart === null ? '启动蒸汽' : '停止加热') + '</button></div>' : '';
  const stage = '<div class="brew-visual ' + (task && task !== 'heat' ? 'drop-ready' : '') + '">' + (task && task !== 'heat' ? '<button class="brew-drop" type="button" data-act="drop" data-brew-drop>' + brewArt(task) + '<span>' + labels[task] + '</span></button>' : brewArt(task)) + '</div>';
  const status = milkTemperature !== null ? '<p class="copy">奶温 ' + milkTemperature + '°C · ' + (milkTemperature >= 58 && milkTemperature <= 66 ? '奶泡细腻，额外 +3 金币' : '这杯可以照常出杯') + '</p>' : '';
  const desserts = Object.entries(pastryMenu).filter(([id])=>s.pastries[id] > 0);
  const dessertSelect = desserts.length ? '<div class="line-item"><label for="pastry">搭配糕点</label><select id="pastry"><option value="">只上咖啡</option>' + desserts.map(([id,item])=>'<option value="' + id + '" ' + (pastry === id ? 'selected' : '') + '>' + item.name + ' · +' + item.price + ' 金币</option>').join('') + '</select></div>' : '';
  const coffeeOptions = Object.entries(coffeeMenu).filter(([id])=>coffeeUnlocked(id)).map(([id,item])=>'<option value="' + id + '" ' + (drink === id ? 'selected' : '') + '>' + item.name + '</option>').join('');
  const instructions = task === 'heat' ? '启动蒸汽，指针进入绿色区间时停下。' : task ? '拖动配料到目标上，也可以点选配料后再点目标。' : '做好了。现在可以给客人上咖啡。';
  screen('吧台做咖啡', '02 / 制作饮品', '<section class="panel"><div class="line-item"><label for="drink">这一单的饮品</label><select id="drink">' + coffeeOptions + '</select></div>' + dessertSelect + '<p class="copy">' + guest.name + '点了' + guest.drink + '，由' + cats[selected].name + '陪伴。</p><div class="steps brew-progress" aria-label="制作进度">' + tasks.map((id, i) => '<span class="' + (i < brewStep ? 'done' : i === brewStep ? 'current' : '') + '">' + (i < brewStep ? '✓' : i + 1) + ' ' + ({beans:'研磨',milk:'加奶',heat:'控温',honey:'调味',pitcher:'融合',water:'注水',foam:'铺奶泡'})[id] + '</span>').join('') + '</div>' + (canBrew() ? stage + ingredients + gauge + '<p class="copy">' + instructions + '</p>' + status + (!task ? '<button class="primary wide" type="button" data-act="serve">上咖啡并安排陪伴</button>' : '') : '<p class="notice">库存：豆 ' + s.beans + ' · 奶 ' + s.milk + ' · 蜂蜜 ' + s.honey + '</p><button class="secondary wide" type="button" data-act="tab" data-id="stock">食材不足，去店务补货</button>') + '</section>', 'order');
  if (heatStart !== null) requestAnimationFrame(updateHeat);
}
function updateHeat(now) {
  if (tab !== 'brew' || heatStart === null) return;
  const value = brewTemperature(now);
  const needle = document.querySelector('#temp-needle');
  if (!needle) return;
  needle.style.left = (value - 42) / 36 * 100 + '%';
  document.querySelector('#temp-value').textContent = value + '°C';
  requestAnimationFrame(updateHeat);
}
function addIngredient(id) {
  if (tab !== 'brew' || !canBrew() || !id || brewTask() === 'heat' || !brewTask()) return;
  if (id !== brewTask()) { note('还没到用' + ingredientNames[id] + '的这一步。'); return; }
  ingredientSelected = '';
  brewStep += 1;
  refresh();
  workspace.querySelector('.ingredient,[data-act="heat"],[data-act="serve"]')?.focus({preventScroll:true});
}

const themes = {
  spring: {name:'晴窗薄荷', description:'薄荷绿窗框、奶油墙和浅橡木', colors:['#94bd9f','#f9f3df','#dcb58e']},
  breeze: {name:'海盐午后', description:'浅蓝窗框、云白墙和蜜桃木', colors:['#91b8cb','#f5f8fa','#e9bda9']},
  classic: {name:'暖木街角', description:'暖棕木色、金棕窗框和奶油墙', colors:['#a37751','#f1ddb5','#c8996d']}
};
const story = [
  {title:'最后一班地铁', text:'毕业后，我拖着行李去了大城市。后来我学会了在地铁上回消息，在便利店吃晚饭。某天赶上末班车，对面坐着一整排刚下班的人。车窗里，每个人看起来都跟我一样累。'},
  {title:'老街还留着一扇窗', text:'回家那天，我拐进小时候买面包的小巷。面包店搬走了，玻璃窗上还贴着半张营业时间。街对面的救助站正在找寄养家庭。志愿者一开门，一只橘猫探出半个脑袋，又缩了回去。'},
  {title:'给想歇一会儿的人', text:'我租下了那间小铺，用攒下的钱买了两张旧桌。我想靠卖咖啡付得起房租，也想给救助站的猫多留几个能晒太阳的位置。等第一壶水烧开，路过的人就能进来坐坐。'}
];
function renderStory() {
  const page = story[storyPage];
  workspace.innerHTML = '<section class="story" aria-label="开店序章"><div class="story-cover" aria-hidden="true"></div><div class="story-brand">CATS &amp; CAFE</div><article class="story-page"><div class="story-meta"><span>开店序章</span><span>' + (storyPage+1) + ' / ' + story.length + '</span></div><h1>' + page.title + '</h1><p>' + page.text + '</p><div class="actions"><button type="button" class="secondary" data-act="' + (storyPage ? 'story-step' : 'story-end') + '" data-id="' + (storyPage-1) + '">' + (storyPage ? '上一页' : '跳过') + '</button><button type="button" class="primary" data-act="' + (storyPage < story.length-1 ? 'story-step' : 'story-end') + '" data-id="' + (storyPage+1) + '">' + (storyPage < story.length-1 ? '继续' : s.opened ? '回到猫咖' : '开始筹备') + '</button></div></article></section>';
}
function renderRenovation() {
  const project = diningProject();
  const progress = project ? '<p class="copy">' + project.detail + '</p><div class="meter" role="progressbar" aria-label="金币进度" aria-valuemax="' + project.cost + '" aria-valuenow="' + Math.min(s.coins,project.cost) + '"><i style="width:' + Math.min(100,s.coins/project.cost*100) + '%"></i></div><p class="copy">现有 ' + s.coins + ' 金币 · ' + (s.coins >= project.cost ? '金币已攒够' : '还差 ' + (project.cost-s.coins) + ' 金币') + '</p><button class="primary wide" type="button" data-act="buy-dining" data-id="' + (s.diningLevel+1) + '" ' + (!s.opened || s.coins < project.cost ? 'disabled' : '') + '>' + (s.opened ? project.name + ' · ' + project.cost + ' 金币' : '开店后可购买') + '</button>' : '<p class="copy">主厅和阳光间都已布置完成。</p>';
  const stages = diningStages.map((stage,index)=>'<li><span>' + stage.name + '<small>' + stage.count + ' 张营业桌' + (stage.cost ? ' · ' + stage.cost + ' 金币' : '') + '</small></span><b>' + (index <= s.diningLevel ? '已完成' : index === s.diningLevel+1 ? '当前目标' : '待解锁') + '</b></li>').join('');
  screen('店面升级','添桌椅，慢慢把小店做大','<section class="panel"><p class="kicker">当前店面 · ' + seatCount() + ' 张桌</p><h2 class="heading">' + (project ? project.name : '绿植阳光房已完成') + '</h2>' + progress + '</section><section class="panel"><h2 class="heading">扩店计划</h2><ol class="upgrade-stages">' + stages + '</ol></section>');
}
function themeSettings() {
  return '<section class="panel"><h2 class="heading">店面配色</h2><p class="copy">换一套光线和颜色，随时切回。</p><div class="theme-list">' + Object.entries(themes).map(([id,theme])=>'<button class="theme-choice" type="button" data-act="theme" data-id="' + id + '" aria-pressed="' + (s.theme === id) + '"><span aria-hidden="true">' + theme.colors.map(color=>'<i style="background:' + color + '"></i>').join('') + '</span><b>' + theme.name + '</b><small>' + theme.description + '</small></button>').join('') + '</div></section>';
}
function staffAction(act,id) {
  if (!s.opened || seatCount() < 3 || tab !== 'team') return;
  if (act === 'bake') {
    if (!Object.hasOwn(pastryMenu,id)) return;
    const item = pastryMenu[id];
    const level = s.workers.baker || 0;
    if (level < item.level || s.flour < 1 || s.milk < 1 || (item.honey && s.honey < 1)) return;
    s.flour -= 1; s.milk -= 1;
    if (item.honey) s.honey -= 1;
    const count = 1+level;
    s.pastries[id] = (s.pastries[id] || 0)+count;
    update(); note(item.name + '出炉 · +' + count + ' 份'); return;
  }
  if (!Object.hasOwn(crew,id)) return;
  const worker = crew[id];
  const level = s.workers[id] || 0;
  if ((act === 'hire' && level) || (act === 'train' && (!level || level >= 3))) return;
  const price = level ? worker.upgrade*level : worker.cost;
  if (s.coins < price) return;
  s.coins -= price;
  s.workers[id] = level+1;
  update(); note(worker.name + (level ? '完成培训，升到 ' + (level+1) + ' 级' : '加入了猫咖'));
}
function renderTeam() {
  const unlocked = s.opened && seatCount() >= 3;
  const staff = Object.entries(crew).map(([id,worker])=>{
    const level = s.workers[id] || 0;
    const price = level ? worker.upgrade*level : worker.cost;
    return '<article class="staff-card"><span class="staff-avatar" aria-hidden="true">' + (id === 'baker' ? '♨' : '☕') + '</span><div><h3>' + worker.name + ' · ' + worker.title + '</h3><p class="copy">' + worker.description + '</p><small>' + (level ? '已入职 · Lv.' + level + ' / 3' : '待招聘') + '</small></div><button class="secondary" type="button" data-act="' + (level ? 'train' : 'hire') + '" data-id="' + id + '" ' + (!unlocked || s.coins < price || level >= 3 ? 'disabled' : '') + '>' + (level >= 3 ? '已满级' : (level ? '培训' : '招聘') + ' · ' + price) + '</button></article>';
  }).join('');
  const bakery = Object.entries(pastryMenu).map(([id,item])=>'<div class="line-item"><div><b>' + item.name + '</b><p class="copy">库存 ' + (s.pastries[id] || 0) + ' · 售价 ' + item.price + ' · 需要烘焙 Lv.' + item.level + '</p></div><button class="secondary" type="button" data-act="bake" data-id="' + id + '" ' + (!unlocked || (s.workers.baker || 0) < item.level || !s.flour || !s.milk || (item.honey && !s.honey) ? 'disabled' : '') + '>烘焙</button></div>').join('');
  screen('店员与烘焙','招聘 · 培训 · 搭售糕点','<section class="panel"><div class="line-item"><h2 class="heading">街坊招聘</h2><b>' + s.coins + ' 金币</b></div>' + (unlocked ? '' : '<p class="notice">开门并添置第 3 张桌后解锁店员。</p>') + staff + '</section><section class="panel"><h2 class="heading">烘焙备货</h2><p class="copy">每炉用 1 面粉、1 牛奶，磅蛋糕还要 1 蜂蜜。做好后可在吧台随咖啡搭售。</p><p class="copy">面粉 ' + s.flour + ' · 牛奶 ' + s.milk + ' · 蜂蜜 ' + s.honey + '</p>' + bakery + '</section>','stock');
}
function renderStock() {
  screen('店务', '升级 · 库存 · 装饰', '<button class="primary wide" style="margin:0 0 10px" type="button" data-act="tab" data-id="shift">营业排班</button><section class="panel"><h2 class="heading">店员与烘焙</h2><p class="copy">添置第三张桌后，可以招聘烘焙师和咖啡师。</p><button class="secondary wide" type="button" data-act="tab" data-id="team">查看店员与烘焙</button></section><section class="panel"><h2 class="heading">店面升级</h2><p class="copy">目前可接待 ' + seatCount() + ' 桌' + (diningProject() ? ' · 下一步：' + diningProject().name : '') + '</p><button class="primary wide" type="button" data-act="tab" data-id="renovate">查看扩店计划</button></section><section class="panel"><h2 class="heading">吧台备货</h2><p class="copy">金币 ' + s.coins + ' · 营业积分 ' + s.points + '</p><div class="line-item"><span>豆 ' + s.beans + ' · 奶 ' + s.milk + ' · 蜂蜜 ' + s.honey + ' · 面粉 ' + s.flour + '</span><button type="button" class="secondary" data-act="restock" ' + (s.coins < 10 ? 'disabled' : '') + '>补货 · 10 金币</button></div><div class="line-item"><span>蜂蜜拿铁配方</span><button type="button" class="secondary" data-act="recipe" ' + (s.menu || s.points < 3 ? 'disabled' : '') + '>' + (s.menu ? '已解锁' : '兑换 · 3 积分') + '</button></div></section><section class="panel"><h2 class="heading">猫窝</h2><p class="copy">在店 ' + catIds().length + ' 只 · 可照顾 ' + catCapacity() + ' 只</p><button type="button" class="secondary wide" data-act="expand" ' + (catCapacity() >= Object.keys(cats).length || s.coins < expansionCost() ? 'disabled' : '') + '>' + (catCapacity() >= Object.keys(cats).length ? '已扩到最大' : '扩建猫窝 · ' + expansionCost() + ' 金币') + '</button><button type="button" class="secondary wide" data-act="tab" data-id="adopt">打开领养所</button></section>' + themeSettings() + '<section class="panel"><p class="copy">试玩进度保存在当前浏览器。</p><button class="secondary wide" type="button" data-act="read-story">重看开店故事</button>' + (s.opened && afterHours() ? '<button class="secondary wide" type="button" data-act="close-shop">结账打烊</button>' : '') + '<button class="secondary wide" type="button" data-act="ask-reset">重新开始</button></section>');
}
function remaining() { return Math.max(0, Math.ceil((s.deadline - Date.now()) / 1000)); }
function timerText() { return '00:' + String(remaining()).padStart(2, '0'); }
const missionLetter = '<div class="commission"><div class="postmark">' + icon('mail') + '</div><div><h3>小林的留言</h3><p class="copy">我妈下午常一个人在家。她喜欢猫，但不习惯猫一上来就跳到腿上。</p></div></div>';
function renderMission() {
  let content = missionLetter;
  if (s.progress === 'locked') content += '<p class="notice">完成一单店内接待，小林就会发来委托。</p><button type="button" class="secondary wide" data-act="tab" data-id="shop">回猫咖接待客人</button>';
  if (s.progress === 'ready' || s.progress === 'done') content += '<p class="copy">用 30 秒看看客厅的细节。换一只猫，可能收到另一张照片。</p><button type="button" class="primary wide" data-act="start">' + (s.progress === 'done' ? '再接一次委托' : '接下委托 · 开始找线索') + '</button>';
  if (s.progress === 'finding') content += '<button type="button" class="primary wide" data-act="tab" data-id="clues">继续找线索</button>';
  if (s.progress === 'choosing') content += '<button type="button" class="primary wide" data-act="tab" data-id="dispatch">继续选猫</button>';
  if (s.away) content += '<p class="notice">' + cats[s.away.cat].name + '正在小林家陪伴。下一轮营业后回来。</p><div class="actions"><button type="button" class="secondary" data-act="tab" data-id="shop">回店继续接待</button><button type="button" class="primary" data-act="finish-turn">结束本轮营业</button></div>';
  if (s.pending) content += '<p class="notice">' + cats[s.pending.cat].name + '已经回店。小林的妈妈寄来了一张明信片。</p><button type="button" class="primary wide" data-act="open-mail">拆开信封</button>';
  screen('上门委托', '街坊来信 / NO. 01', '<section class="panel"><h2 class="heading">窗边的陪伴</h2><div style="margin-top:10px">' + content + '</div></section>');
}
function renderClues() {
  const hotspots = clues.map((clue, i) => {
    const seen = s.found.includes(i);
    return '<button type="button" class="pin ' + (seen ? 'found' : '') + '" style="left:' + clue.x + '%;top:' + clue.y + '%" data-act="clue" data-id="' + i + '" aria-label="' + (seen ? '已找到：' : '调查：') + clue.title + '" ' + (seen ? 'disabled' : '') + '>' + (seen ? '✓' : '?') + '</button>';
  }).join('');
  const latest = clues[s.found.at(-1)];
  screen('找线索', '小林家的客厅', '<section class="panel"><div class="line-item"><b>已找到 ' + s.found.length + ' / ' + clues.length + '</b><b id="timer" class="timer">' + timerText() + '</b></div><div class="room-picture"><img src="assets/room.webp" alt="小林家的客厅，沙发上有猫毯，窗边有椅子，地上有毛线篮">' + hotspots + '</div><p class="copy">' + (latest ? '<b>' + latest.title + '</b> · ' + latest.detail : '点按客厅里的标记，看看小林的妈妈需要怎样的陪伴。') + '</p><button type="button" class="primary wide" data-act="choose">根据线索选猫</button></section>', 'mail');
}
function renderDispatch() {
  const notes = s.found.length ? '<ul class="hint-list">' + s.found.map(i => '<li><b>' + clues[i].title + '</b> · ' + clues[i].detail + '</li>').join('') + '</ul>' : '<p class="copy">可以根据小林的留言选择猫咪。</p>';
  screen('派猫上门', '为小林妈妈挑一只猫', '<section class="panel">' + missionLetter + notes + '<div class="choice-list">' + matchList() + '</div><button type="button" class="primary wide" data-act="dispatch" ' + (!selected ? 'disabled' : '') + '>派这只猫上门</button></section>', 'mail');
}
function renderLetter() {
  const card = s.pending;
  const outcome = outcomes[card.cat];
  screen('收到明信片', '街坊来信 / 小林的妈妈', '<article class="mail-card"><canvas class="mail-canvas" width="320" height="240" aria-label="' + outcome.title + '"></canvas><div class="mail-message"><h3>' + outcome.title + '</h3><p>' + outcome.message + '</p><small>小林的妈妈 · 街坊来信</small></div><span class="badge">' + (card.score === 4 ? '特别留影' : '温暖留影') + '</span><button type="button" class="primary wide" data-act="collect">收进相册</button></article>', 'mail');
  drawCard(workspace.querySelector('canvas'), card);
}
function renderAlbum() {
  const content = s.album.length ? '<section class="panel"><h2 class="heading">收藏了 ' + s.album.length + ' 张来信</h2><p class="copy">点开照片，可以重读留言或下载明信片。</p><div class="album-grid">' + s.album.map(card => '<button type="button" class="album-card" data-act="view-card" data-id="' + card.id + '"><canvas width="320" height="240" data-card="' + card.id + '" aria-label="' + outcomes[card.cat].title + '"></canvas><b>' + outcomes[card.cat].title + '</b><small>' + cats[card.cat].name + ' · 街坊来信</small></button>').join('') + '</div></section>' : '<section class="panel album-empty"><div class="postmark">' + icon('photo') + '</div><h2 class="heading">等一张街坊寄来的照片</h2><p class="copy">完成上门委托并收下明信片，它就会留在这里。</p><button type="button" class="secondary wide" data-act="tab" data-id="mail">去看看委托</button></section>';
  screen('明信片相册', '街坊日记 / 收藏', content);
  workspace.querySelectorAll('canvas').forEach(canvas => drawCard(canvas, s.album.find(card => card.id === canvas.dataset.card)));
}

function pixelCanvas(size, columns = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = size * columns;
  canvas.height = size;
  return canvas;
}
function pixelTools(ctx) {
  return {
    rect(color,x,y,w,h) { ctx.fillStyle = color; ctx.fillRect(x,y,w,h); },
    shape(color, points) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(...points[0]);
      for (const point of points.slice(1)) ctx.lineTo(...point);
      ctx.closePath();
      ctx.fill();
    }
  };
}
function frameStrip(size, paint) {
  const canvas = pixelCanvas(size, 5);
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < 5; i += 1) {
    ctx.save();
    ctx.translate(i * size, 0);
    paint(ctx, i % 4);
    ctx.restore();
  }
  return canvas.toDataURL();
}
const catPalettes = {
  sesame: ['#514b52','#746973','#36333b','#eee1c5','#b35441'],
  pudding: ['#d48c48','#edb46d','#9a5736','#fff0ce','#557b5a'],
  chestnut: ['#e2c49b','#f0d8ad','#a76f50','#fbecd0','#b76a57'],
  mint: ['#87948a','#a0afa2','#59675d','#f2e8ca','#5b8268'],
  peach: ['#d89687','#edb7a3','#a46459','#fff0ce','#b25b6a'],
  latte: ['#ad8165','#cca180','#754f42','#ffe5c2','#98674f'],
  cloud: ['#c7c1b0','#e1dcc9','#8b877c','#fff0d5','#7b89a3'],
  moon: ['#777e9b','#a7a9be','#4f5068','#f4e7cb','#c2a34c'],
  caramel: ['#cc8753','#f0b77a','#9a5433','#fff0ce','#9d574c'],
  moss: ['#8d9873','#b3b990','#5b664d','#f4e6bd','#9d6657'],
  mist: ['#938c9a','#bdb1c0','#61566a','#f7e8d3','#5b8291'],
  amber: ['#a7744e','#d2a175','#644536','#ffe6c2','#b58f4b']
};
function drawCatFrame(ctx, id, pose, frame) {
  const {rect,shape} = pixelTools(ctx);
  const [fur,lit,shade,cream,accent] = catPalettes[id];
  const ink = '#372927';
  const walking = pose === 'walk';
  const bounce = walking && frame % 2 ? 1 : 0;
  const tail = [0,-3,0,2][frame];
  if (walking) {
    const legs = [[15,29],[18,26],[14,32],[17,28]][frame];
    for (const x of legs) {
      rect(ink,x,36,7,7); rect(shade,x+1,36,5,5); rect(cream,x+1,40,5,2);
    }
  } else {
    rect(ink,17,38,21,6); rect(shade,19,38,17,4); rect(cream,26,41,10,2);
  }
  ctx.save(); ctx.translate(0,bounce);
  shape(ink,[[16,37],[11,36],[7,33],[4,29+tail],[4,24+tail],[8,24+tail],[9,29+tail],[12,31],[17,31]]);
  shape(shade,[[15,35],[10,33],[6,29+tail],[6,26+tail],[8,29+tail],[11,32],[16,33]]);
  shape(ink,walking ? [[11,34],[13,27],[19,24],[28,24],[31,20],[40,21],[43,27],[39,36],[36,40],[15,40]] : [[12,37],[14,30],[19,26],[24,24],[29,19],[39,21],[40,31],[37,40],[32,42],[17,42]]);
  shape(fur,walking ? [[13,34],[15,28],[20,26],[29,26],[32,23],[39,24],[41,28],[37,35],[35,38],[16,38]] : [[14,37],[16,31],[20,28],[26,26],[30,22],[38,23],[38,32],[35,39],[31,40],[17,40]]);
  rect(lit,18,28,9,2); rect(shade,16,35,8,3); rect(lit,22,31,6,2);
  if (id !== 'sesame') { rect(shade,20,28,2,4); rect(shade,25,27,2,4); }
  shape(ink,[[27,25],[25,20],[25,14],[28,8],[32,11],[34,14],[38,14],[42,10],[44,12],[44,19],[47,22],[47,27],[44,31],[34,32],[29,30]]);
  shape(fur,[[28,24],[27,19],[27,15],[29,11],[33,15],[39,16],[42,13],[43,20],[45,23],[45,26],[43,29],[35,30],[30,28]]);
  rect(lit,29,17,10,2); rect('#c78878',28,14,2,3); rect('#c78878',41,15,1,3);
  shape(cream,[[39,23],[43,23],[45,25],[44,28],[41,30],[35,29],[35,26]]);
  rect(ink,38,21,2,pose === 'sit' && frame === 2 ? 1 : 2);
  rect('#5b3b32',44,24,2,1); rect('#e3ab85',36,26,2,1);
  rect(accent,30,29,9,2); rect(accent,30,31,4,3); rect(cream,33,32,3,5);
  if (id === 'chestnut') { rect(shade,29,19,4,4); rect(shade,20,32,4,3); }
  ctx.restore();
}
function catFrames(id) {
  const portrait = pixelCanvas(48);
  drawCatFrame(portrait.getContext('2d'),id,'sit',0);
  return { portrait:portrait.toDataURL(), walk:frameStrip(48,(ctx,frame)=>drawCatFrame(ctx,id,'walk',frame)), sit:frameStrip(48,(ctx,frame)=>drawCatFrame(ctx,id,'sit',frame)) };
}
const peoplePalettes = [
  ['#604033','#7b5843','#bd654b','#934834','#684f50'],
  ['#392f37','#53444d','#879571','#596b51','#76624d'],
  ['#7b6a60','#9b8877','#b18560','#896246','#5d665f'],
  ['#433742','#5d4b55','#858ba3','#626580','#716052']
];
function drawPersonFrame(ctx, index, pose, frame) {
  const {rect,shape} = pixelTools(ctx);
  const [hair,hairLight,shirt,fold,pants] = peoplePalettes[index];
  const ink = '#382923', skin = '#f2c397', tan = '#d99573', linen = '#fff0c7';
  const walk = pose === 'walk', seated = pose === 'sit';
  const sway = walk ? [0,-1,0,-1][frame] : 0;
  const stride = walk ? [-3,-1,2,0][frame] : 0;
  if (seated) {
    shape(ink,[[16,42],[33,42],[39,48],[37,54],[25,55],[15,51]]);
    shape(pants,[[17,43],[32,44],[36,48],[34,51],[27,51],[17,48]]);
    rect('#6b4d40',21,52,8,2); rect('#6b4d40',32,51,5,2);
  } else {
    for (const [x, offset] of [[17,stride],[30,-stride]]) {
      rect(ink,x,41,9,10+offset); rect(pants,x+1,42,6,8+offset);
      rect(ink,x-1,49+offset,10,5); rect('#725648',x,49+offset,7,2);
    }
  }
  ctx.save(); ctx.translate(0,sway + (seated ? 3 : 0));
  shape(ink,[[15,32],[19,28],[33,28],[39,31],[42,36],[41,43],[37,45],[17,45],[13,41],[13,36]]);
  shape(shirt,[[16,35],[21,30],[32,30],[37,33],[39,37],[37,41],[34,43],[18,43],[16,40]]);
  rect(fold,17,39,19,3); rect(linen,22,30,10,2); rect(linen,25,32,4,3);
  rect(fold,20,33,2,5); rect(fold,34,34,2,5);
  if (seated) { rect(skin,19,39,6,3); rect(skin,29,39,6,3); }
  else { rect(skin,13,39+(walk && frame % 2 ? -2 : 0),5,4); rect(skin,37,39+(walk && frame % 2 ? 2 : 0),5,4); }
  shape(ink,[[13,12],[15,8],[19,5],[32,5],[38,8],[41,13],[42,21],[40,28],[34,31],[18,30],[12,25],[11,18]]);
  shape(hair,[[14,13],[17,9],[22,7],[32,7],[37,10],[39,15],[40,22],[38,27],[33,29],[18,28],[14,25],[13,18]]);
  shape(hairLight,[[16,14],[18,10],[23,9],[33,9],[36,12],[34,14],[28,13],[23,14],[21,16]]);
  shape(skin,[[18,18],[22,16],[28,15],[34,17],[37,18],[37,24],[34,28],[23,29],[18,26],[17,22]]);
  rect(tan,22,27,11,2); rect(tan,17,22,2,3); rect(tan,35,22,2,2);
  const blink = !walk && frame === 2;
  rect(ink,22,21,2,blink ? 1 : 2); rect(ink,32,21,2,blink ? 1 : 2);
  rect('#d78a79',20,24,2,1); rect('#d78a79',34,24,2,1); rect('#996752',27,25,3,1);
  if (index === 2) { rect('#8c6a54',20,20,6,1); rect('#8c6a54',30,20,6,1); rect('#8c6a54',26,21,4,1); }
  if (index === 0) { rect('#d1a76d',16,17,4,2); rect('#ecc083',16,18,2,2); }
  if (seated) {
    rect('#684732',25,40,8,3); rect(linen,26,36,7,5); rect('#a56c47',27,36,5,1);
  }
  ctx.restore();
}
function guestFrames(index) {
  const portrait = pixelCanvas(56);
  drawPersonFrame(portrait.getContext('2d'),index,'idle',0);
  const animate = pose => frameStrip(56,(ctx,frame)=>drawPersonFrame(ctx,index,pose,frame));
  return { portrait:portrait.toDataURL(), walk:animate('walk'), idle:animate('idle'), sit:animate('sit') };
}

function sprite(id, pose = 'sit') {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const cat = cats[id];
  const outline = '#382923';
  const white = '#fff0d0';
  const shade = { sesame: '#656068', pudding: '#ad6038', chestnut: '#bb835d' }[id];
  const rect = (color, x, y, w, h) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
  function shape(color, points) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    points.slice(1).forEach(point => ctx.lineTo(...point));
    ctx.closePath();
    ctx.fill();
  }
  if (pose === 'play') {
    shape(outline, [[2,23],[2,20],[5,20],[5,23],[8,23],[8,19],[11,16],[19,16],[19,12],[23,14],[26,12],[28,17],[30,19],[30,24],[27,26],[27,29],[9,29],[9,27],[4,27],[4,25],[2,25]]);
    shape(cat.coat, [[5,24],[9,24],[9,21],[12,18],[21,18],[21,15],[23,16],[26,15],[27,18],[29,20],[29,23],[26,25],[26,27],[10,27],[10,26],[5,26]]);
    rect(shade, 12, 19, 2, 4);
    rect(shade, 16, 18, 2, 4);
    rect(shade, 23, 17, 2, 2);
    rect(cat.accent, 20, 22, 2, 4);
    rect(white, 24, 23, 5, 2);
    rect(white, 21, 26, 6, 2);
    rect(outline, 26, 20, 2, 1);
    return canvas;
  }
  shape(outline, [[4,28],[4,22],[6,22],[6,25],[9,25],[9,19],[12,16],[11,14],[11,8],[13,8],[13,3],[16,3],[19,7],[23,7],[26,4],[28,4],[28,11],[30,13],[30,17],[27,20],[25,20],[25,28],[28,28],[28,31],[10,31],[10,30],[6,30],[6,28]]);
  shape(cat.coat, [[6,26],[10,27],[10,21],[14,17],[13,15],[13,9],[15,9],[15,5],[18,9],[24,9],[26,6],[27,6],[27,12],[29,14],[29,16],[26,19],[24,19],[24,28],[26,29],[26,30],[11,30],[8,29],[6,29]]);
  rect(shade, 12, 22, 2, 5);
  rect(shade, 14, 20, 2, 2);
  rect(shade, 17, 10, 3, 2);
  rect('#d88a7d', 15, 7, 2, 2);
  rect('#d88a7d', 25, 8, 2, 2);
  rect(white, 23, 14, 6, 3);
  rect(white, 20, 19, 4, 5);
  rect(white, 21, 26, 3, 4);
  rect(white, 25, 29, 2, 1);
  rect(cat.accent, 18, 18, 8, 2);
  rect(cat.accent, 17, 19, 3, 3);
  rect(outline, 23, 12, 2, 1);
  rect(outline, 28, 14, 1, 1);
  if (id === 'pudding') {
    rect(shade, 20, 9, 2, 3);
    rect(shade, 12, 24, 4, 2);
  }
  if (id === 'chestnut') {
    rect(shade, 11, 23, 5, 4);
    rect(shade, 14, 8, 4, 4);
  }
  return canvas;
}
const peopleAnimation = guests.map((_,index)=>guestFrames(index));
const catAnimation = Object.fromEntries(Object.keys(cats).map(id=>[id,catFrames(id)]));
const sprites = Object.fromEntries(starterCats.map(id=>[id,sprite(id)]));
const avatars = Object.fromEntries(Object.entries(catAnimation).map(([id,frames])=>[id,frames.portrait]));
const playingPudding = sprite('pudding', 'play');
const backdrop = new Image();
const backdropReady = new Promise(resolve => {
  backdrop.onload = () => resolve(true);
  backdrop.onerror = () => resolve(false);
});
backdrop.src = 'assets/postcard-room.webp';
async function drawCard(canvas, card) {
  if (!canvas || !card) return false;
  if (!await backdropReady) {
    canvas.insertAdjacentHTML('afterend', '<p class="copy">画面暂未加载，留言仍在相册里。</p>');
    return false;
  }
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(backdrop, 0, 0, 320, 240);
  const [x, y, scale] = { sesame: [89, 57, 2], pudding: [121, 152, 2], chestnut: [254, 101, 2] }[card.cat] ?? [90, 54, 2];
  ctx.fillStyle = '#4f2b274a';
  ctx.fillRect(x + 14, y + 59, 37, 4);
  const original = card.cat === 'pudding' ? playingPudding : sprites[card.cat];
  if (original) ctx.drawImage(original, x, y, 32 * scale, 32 * scale);
  else {
    const portrait = pixelCanvas(48);
    drawCatFrame(portrait.getContext('2d'),card.cat,'sit',0);
    ctx.drawImage(portrait,x,y,68,68);
  }
  if (card.cat === 'pudding') {
    ctx.fillStyle = '#a84f34';
    ctx.fillRect(175, 205, 8, 6);
    ctx.fillStyle = '#d67b4e';
    ctx.fillRect(177, 204, 5, 2);
  }
  return true;
}
function showCard(card) {
  const outcome = outcomes[card.cat];
  dialog.innerHTML = '<div class="dialog-top"><span class="badge">' + icon('mail') + ' ' + '街坊相册' + '</span><button type="button" class="close" data-act="close" aria-label="关闭">×</button></div><canvas class="mail-canvas" width="320" height="240" aria-label="' + outcome.title + '，' + cats[card.cat].name + '在' + outcome.place + '"></canvas><div class="mail-message"><h3 id="dialog-title">' + outcome.title + '</h3><p>' + outcome.message + '</p><small>小林的妈妈 · 街坊来信</small></div><span class="badge">' + (card.score === 4 ? '特别留影' : '温暖留影') + '</span><div class="actions">' + '<a class="primary" data-download aria-disabled="true" download="Cats-and-Cafe-' + card.cat + '-' + card.id + '.png">下载明信片</a>' + '</div>';
  dialog.setAttribute('aria-labelledby', 'dialog-title');
  dialog.showModal();
  const picture = dialog.querySelector('canvas');
  drawCard(picture, card).then(ready => {
    if (!ready || !picture.isConnected) return;
    const download = dialog.querySelector('[data-download]');
    download.href = postcardFile(card, picture);
    download.removeAttribute('aria-disabled');
  });
}
function postcardFile(card, picture) {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = 688;
  exportCanvas.height = 652;
  const ctx = exportCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#fff6e2';
  ctx.fillRect(0, 0, 688, 652);
  ctx.strokeStyle = '#c7a77c';
  ctx.strokeRect(10, 10, 668, 632);
  ctx.drawImage(picture, 24, 24, 640, 480);
  ctx.fillStyle = '#3a2a22';
  ctx.font = 'bold 30px serif';
  ctx.fillText(outcomes[card.cat].title, 26, 546);
  ctx.font = '19px sans-serif';
  ctx.fillText(outcomes[card.cat].message, 26, 584, 636);
  ctx.fillText('小林的妈妈 · 街坊来信', 26, 618);
  return exportCanvas.toDataURL('image/png');
}

let drag = null;
let swipe = null;
let ignoreIngredientClick = 0;
let ignoreSwipeClick = 0;
workspace.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  const source = event.target.closest('.ingredient,.merge-tile:not(.tile-empty)');
  if (source && (tab === 'brew' || (tab === 'board' && s.puzzle?.status === 'playing'))) {
    drag = { pointer:event.pointerId, source, x:event.clientX, y:event.clientY, ghost:null };
    source.setPointerCapture(event.pointerId);
    return;
  }
  if (event.target.closest('[data-floor]')) swipe = { pointer:event.pointerId, x:event.clientX, y:event.clientY };
});
workspace.addEventListener('pointermove', event => {
  if (drag?.pointer !== event.pointerId) return;
  if (!drag.ghost && Math.hypot(event.clientX-drag.x,event.clientY-drag.y) < 7) return;
  if (!drag.ghost) {
    drag.ghost = drag.source.cloneNode(true);
    drag.ghost.classList.add('ingredient-ghost');
    drag.ghost.style.width = drag.source.offsetWidth + 'px';
    drag.ghost.removeAttribute('data-act');
    drag.ghost.setAttribute('aria-hidden','true');
    drag.ghost.tabIndex = -1;
    document.body.append(drag.ghost);
  }
  drag.ghost.style.left = event.clientX + 'px';
  drag.ghost.style.top = event.clientY + 'px';
  const target = document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-brew-drop]');
  workspace.querySelector('[data-brew-drop]')?.classList.toggle('over',!!target);
});
function clearDrag() {
  drag.ghost?.remove();
  workspace.querySelector('[data-brew-drop]')?.classList.remove('over');
  drag = null;
}
workspace.addEventListener('pointerup', event => {
  if (drag?.pointer === event.pointerId) {
    const { ghost, source } = drag;
    const over = document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-brew-drop],.merge-tile');
    clearDrag();
    if (ghost) {
      ignoreIngredientClick = performance.now() + 360;
      if (over?.matches('[data-brew-drop]')) addIngredient(source.dataset.id);
      if (tab === 'board' && s.puzzle?.status === 'playing' && over?.matches('.merge-tile')) mergeTiles(Number(source.dataset.id),Number(over.dataset.id));
    }
    return;
  }
  if (swipe?.pointer !== event.pointerId) return;
  const dx = event.clientX-swipe.x, dy = event.clientY-swipe.y;
  swipe = null;
  if (tab !== 'shop' || Math.abs(dx) < 52 || Math.abs(dx) < 1.3*Math.abs(dy)) return;
  const rooms = seatCount() > 4 ? ['dining','annex','lounge'] : ['dining','lounge'];
  const floor = lounge ? 'lounge' : diningRoom ? 'annex' : 'dining';
  const next = rooms[rooms.indexOf(floor) + (dx < 0 ? 1 : -1)];
  if (!next) return;
  ignoreSwipeClick = performance.now() + 360;
  lounge = next === 'lounge';
  diningRoom = next === 'annex' ? 1 : 0;
  joiningSeat = null;
  refresh();
});
workspace.addEventListener('pointercancel', event => {
  if (drag?.pointer === event.pointerId) clearDrag();
  if (swipe?.pointer === event.pointerId) swipe = null;
});
workspace.addEventListener('lostpointercapture', event => {
  if (drag?.pointer === event.pointerId) clearDrag();
});
workspace.addEventListener('click', event => {
  if (performance.now() >= ignoreSwipeClick) return;
  event.preventDefault();
  event.stopPropagation();
}, true);

document.addEventListener('change', event => {
  if (event.target.id === 'pastry') { pastry = event.target.value; return; }
  if (event.target.id !== 'drink' || !Object.hasOwn(coffeeMenu,event.target.value) || !coffeeUnlocked(event.target.value)) return;
  drink = event.target.value;
  resetBrew();
  refresh();
  document.querySelector('#drink')?.focus();
});
document.addEventListener('click', event => {
  const button = event.target.closest('button[data-act]');
  if (!button || button.disabled) return;
  const { act, id } = button.dataset;
  switch (act) {
    case 'tab':
      if (id === 'order' && (!isTrading() || availableSeat() < 0 || catIds().every(cat=>staffStatus(cat)))) { note('等有空桌和空闲的猫咪再接单。'); return; }
      go(id); break;
    case 'floor':
      lounge = id === 'lounge';
      if (!lounge) diningRoom = id === 'annex' && seatCount() > 4 ? 1 : 0;
      joiningSeat = null; refresh(); break;
    case 'story-step':
      if (tab === 'story') { storyPage = Number(id); render(); }
      break;
    case 'story-end':
      s.storySeen = true; save(); lounge = false; diningRoom = 0; go('shop'); break;
    case 'read-story':
      storyPage = 0; go('story'); break;
    case 'theme':
      if (Object.hasOwn(themes,id)) { s.theme = id; update(); }
      break;
    case 'buy-dining': {
      const project = diningProject();
      if (!s.opened || !project || s.coins < project.cost || Number(id) !== s.diningLevel+1) return;
      s.coins -= project.cost; s.diningLevel += 1;
      lounge = false; diningRoom = project.count > 4 ? 1 : 0;
      save(); go('shop'); note(project.name + '完成 · 可接待 ' + project.count + ' 桌'); break;
    }
    case 'table': showTable(Number(id)); break;
    case 'close-table':
      s.tables = s.tables.filter(table => table.seat !== Number(id));
      joiningSeat = null; dialog.close(); update(); break;
    case 'next-period':
      joiningSeat = null; advancePeriod(); update(); break;
    case 'close-shop': nextMorning(); break;
    case 'morning-board':
      if (s.morning) startPantry(s.puzzle?.status === 'playing' ? s.puzzle.level : 0);
      break;
    case 'pet':
      if (lounge) { careCat = id; go('care'); }
      else note(cats[id].name + ' · ' + cats[id].traits);
      break;
    case 'to-brew':
      if (!isTrading() || !selected || staffStatus(selected) || availableSeat() < 0) return;
      const requested = guests[s.guest % guests.length].drink;
      const exactDrink = Object.keys(coffeeMenu).find(key=>coffeeMenu[key].name === requested && coffeeUnlocked(key));
      drink = exactDrink ?? 'latte';
      pastry = '';
      resetBrew(); go('brew'); break;
    case 'ingredient':
      if (performance.now() < ignoreIngredientClick) return;
      ingredientSelected = id; refresh();
      workspace.querySelector('[data-brew-drop]')?.focus({preventScroll:true});
      break;
    case 'drop': addIngredient(ingredientSelected); break;
    case 'heat':
      if (tab !== 'brew' || brewTask() !== 'heat') return;
      if (heatStart === null) heatStart = performance.now();
      else {
        milkTemperature = brewTemperature(performance.now());
        heatStart = null; brewStep += 1;
      }
      refresh();
      workspace.querySelector('[data-act="heat"],.ingredient')?.focus({preventScroll:true});
      break;
    case 'cat':
      if (!catIds().includes(id) || staffStatus(id,tab !== 'dispatch')) return;
      selected = id;
      refresh();
      document.querySelector('[data-act="cat"][data-id="' + id + '"]')?.focus();
      break;
    case 'serve': {
      if (!isTrading() || tab !== 'brew' || brewStep !== brewTasks().length || !selected || staffStatus(selected) || !canBrew()) return;
      const seat = availableSeat();
      if (seat < 0) return;
      const guest = guests[s.guest % guests.length];
      const sought = { sesame:'安静', pudding:'爱玩', chestnut:'好奇' }[guest.cat];
      const match = catTags(cats[selected]).includes(sought);
      const recipeMatch = coffeeMenu[drink].name === guest.drink;
      const quality = milkTemperature >= 58 && milkTemperature <= 66;
      const dessert = Object.hasOwn(pastryMenu,pastry) && s.pastries[pastry] > 0 ? pastryMenu[pastry] : null;
      const gain = 10 + (match ? 6 : 0) + (recipeMatch ? 2 : 0) + (quality ? 3 : 0) + (careState(selected).bond >= 2 ? 2 : 0) + (s.workers.barista || 0)*2 + (dessert?.price || 0);
      const points = match ? 2 : 1;
      for (const key of coffeeMenu[drink].stock) s[key] -= 1;
      if (dessert) s.pastries[pastry] -= 1;
      s.coins += gain;
      s.points += points;
      s.served += 1;
      const guestIndex = s.guest % guests.length;
      s.guest += 1;
      if (s.progress === 'locked') s.progress = 'ready';
      s.tables.push({ seat, guest: guestIndex, cat: selected, until: s.turn + guests[guestIndex].stay });
      diningRoom = Math.floor(seat / 4);
      consumeWork(selected);
      joiningSeat = seat;
      const name = cats[selected].name;
      resetBrew(); save(); go('shop');
      note((dessert ? '加售' + dessert.name + ' · ' : '') + name + (match ? '和客人很投缘' : '陪客人坐了一会儿') + ' · +' + gain + ' 金币 · +' + points + ' 积分');
      break;
    }
    case 'hire': case 'train': case 'bake': staffAction(act,id); break;
    case 'restock':
      if (s.coins < 10) return;
      s.coins -= 10; s.beans += 3; s.milk += 3; s.honey += 1; s.flour += 2;
      update(); note('已补货 · 咖啡豆 +3 · 牛奶 +3 · 蜂蜜 +1 · 面粉 +2'); break;
    case 'recipe':
      if (s.menu || s.points < 3) return;
      s.points -= 3; s.menu = true;
      update(); note('蜂蜜拿铁已加入菜单。'); break;
    case 'expand':
      if (catCapacity() >= Object.keys(cats).length || s.coins < expansionCost()) return;
      s.coins -= expansionCost(); s.capacity += 1;
      update(); note('猫窝扩建完成，照顾栏位增加到 ' + catCapacity() + ' 个。'); break;
    case 'start':
      if (!['ready', 'done'].includes(s.progress)) return;
      s.progress = 'finding'; s.found = []; s.deadline = Date.now() + 30000;
      save(); go('clues'); break;
    case 'clue':
      if (s.progress !== 'finding' || !remaining() || s.found.includes(Number(id))) return;
      s.found.push(Number(id));
      update(); note('发现线索 · ' + clues[Number(id)].title);
      if (s.found.length === clues.length) document.querySelector('[data-act="choose"]')?.focus();
      break;
    case 'choose':
      if (s.progress !== 'finding') return;
      s.progress = 'choosing'; save(); go('dispatch'); break;
    case 'dispatch':
      if (s.progress !== 'choosing' || !selected || s.away || staffStatus(selected,false)) return;
      s.away = { cat: selected, clues: s.found.length, until: s.turn + 1 };
      s.progress = 'away'; save(); go('mail'); break;
    case 'finish-turn':
      if (!s.away) return;
      joiningSeat = null;
      if (isTrading()) advancePeriod(); else advance();
      update(); break;
    case 'open-mail':
      if (s.pending) go('letter');
      break;
    case 'collect':
      if (!s.pending) return;
      s.album.unshift(s.pending); s.pending = null; s.progress = 'done';
      save(); go('photo'); note('明信片已收进街坊相册。'); break;
    case 'view-card': {
      const card = s.album.find(item => item.id === id);
      if (card) showCard(card);
      break;
    }
    case 'ask-reset':
      dialog.innerHTML = '<div class="dialog-top"><h2 class="heading" id="dialog-title">重新开始？</h2><button type="button" class="close" data-act="close" aria-label="关闭">×</button></div><p class="copy">这会清空当前浏览器的营业进度和明信片收藏。</p><div class="actions"><button type="button" class="secondary" data-act="close">继续营业</button><button type="button" class="primary" data-act="reset">确认重新开始</button></div>';
      dialog.setAttribute('aria-labelledby', 'dialog-title');
      dialog.showModal(); break;
    case 'reset':
      s = fresh(); careCat = 'sesame'; mergeSelected = null; drink = 'latte'; resetBrew(); lounge = false; joiningSeat = null; dialog.close(); storyPage = 0; diningRoom = 0; save(); go('story'); break;
    case 'draw-cat': pullCat(); break;
    case 'first-board': startPantry(0); break;
    case 'open-shop':
      if (!s.opened && canOpen()) { s.opened = true; s.shift = catIds().filter(id=>!staffStatus(id,false)).slice(0,3); lounge = false; diningRoom = 0; update(); note('今天开始营业！'); }
      break;
    case 'shift-cat': shiftAction(id); break;
    case 'adopt': adoptCat(id); break;
    case 'care-cat': careCat = id; refresh(); break;
    case 'buy-rest': case 'use-rest': careAction(act,id); break;
    case 'level': startPantry(Number(id)); break;
    case 'tile': case 'spawn': case 'deliver': case 'discard': case 'abandon':
      if (act !== 'tile' || performance.now() >= ignoreIngredientClick) pantryAction(act,id);
      break;
    case 'confirm-abandon':
      if (s.puzzle?.status === 'playing') { s.puzzle = null; mergeSelected = null; dialog.close(); save(); go('pantry'); }
      break;
    case 'close': dialog.close(); break;
  }
});
function tick() {
  if (finishRecoveries() && ['shop','care','shift','order','dispatch'].includes(tab)) refresh();
  const countdown = document.querySelector('#rest-countdown');
  if (countdown) countdown.textContent = recoveryTime(careState(careCat));
  if (s.progress !== 'finding') return;
  if (!remaining()) {
    s.progress = 'choosing';
    save();
    if (tab === 'clues') { go('dispatch'); note('找线索时间结束，可以选猫了。'); }
    else if (tab === 'mail') render();
  } else {
    const timer = document.querySelector('#timer');
    if (timer) timer.textContent = timerText();
  }
}
const adoptionPrices = { 3:25, 4:42, 5:60 };
const adoptionWeights = { 3:60, 4:30, 5:10 };
const drawPrice = 20;
const pityLimit = 5;
const minWorkStamina = 50;
const workCost = { 3:55, 4:45, 5:35 };
const maxEnergy = 5;
const maxShift = 4;
const recoveryItems = {
  kibble: { name:'猫粮', cost:6, gain:55, seconds:45, stock:'kibble' },
  can: { name:'猫罐头', cost:12, gain:100, seconds:18, stock:'cans', bond:true, bondDay:'fed' },
  toy: { name:'逗猫棒', cost:24, gain:40, seconds:24, owned:'toy', bond:true, bondDay:'played' },
  bed: { name:'高级猫窝', cost:48, gain:100, seconds:32, owned:'bed' }
};
let careCat = 'sesame';
let mergeSelected = null;

function realDay() {
  const now = new Date();
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
}
function refreshEnergy() {
  const today = realDay();
  if (s.energy.day >= today) return;
  s.energy.value = Math.min(maxEnergy, s.energy.value + 3 * (today - s.energy.day));
  s.energy.day = today;
  save();
}
function catIds() { return s.roster; }
function catCapacity() { return s.capacity; }
function expansionCost() { return 45 + (catCapacity() - 4) * 10; }
function careState(id) { return { bond:0, toy:false, bed:false, fed:-1, played:-1, stamina:100, recovery:null, ...s.care[id] }; }
function catTags(cat) { return cat.traits.split(' · '); }
function stars(cat) { return '★'.repeat(cat.stars); }
function staminaCost(id) { return workCost[cats[id].stars]; }
function restRequired(id) { return careState(id).stamina < minWorkStamina; }
function staffStatus(id, needsShift = true) {
  return catBusy(id) || (restRequired(id) ? '精力不足' : needsShift && !s.shift.includes(id) ? '未排班' : '');
}
function consumeWork(id) {
  const info = careState(id);
  info.stamina = Math.max(0, info.stamina - staminaCost(id));
  s.care[id] = info;
  if (info.stamina < minWorkStamina) s.shift = s.shift.filter(cat => cat !== id);
}
function canOpen() { return s.cleared.includes(0) && catIds().length >= 3; }
function renderOnboarding(clock) {
  const cleared = s.cleared.includes(0);
  const count = catIds().length;
  refreshEnergy();
  const action = !cleared ? (s.energy.value || s.puzzle?.status === 'playing' ? '<button class="primary wide" type="button" data-act="first-board">去备料挑战 · 第 1 关</button>' : '<p class="notice">体力用完了，本地零点恢复。</p>') :
    count < 3 ? '<button class="primary wide" type="button" data-act="tab" data-id="adopt">去领养所招募猫咪</button>' :
    '<button class="primary wide" type="button" data-act="open-shop">三只猫就位，开门营业</button>';
  workspace.innerHTML = '<section class="scene" aria-label="猫咖筹备"><img class="cafe-bg" draggable="false" src="assets/cafe.webp" alt=""><div class="sun-glint"></div>' + floorHeader(clock) + '<article class="opening-card panel"><p class="kicker">开店准备</p><h2 class="heading">招齐三只猫，准备开门</h2><ol class="opening-check"><li>' + (cleared ? '✓ ' : '') + '完成第 1 关备料挑战，领取 32 金币</li><li>' + (count >= 3 ? '✓ ' : '') + '招募至少三只猫 · ' + Math.min(3,count) + ' / 3</li><li>安排首班猫咪，开始营业</li></ol>' + action + '</article></section>';
}
function remainingCats() { return Object.keys(cats).filter(id => !catIds().includes(id)); }
function drawTiers(ids = remainingCats()) {
  return Object.keys(adoptionWeights).map(Number).map(tier => ({ stars:tier, weight:adoptionWeights[tier], ids:ids.filter(id => cats[id].stars === tier) })).filter(tier => tier.ids.length);
}
function drawCatResult(tiers, pity, random = Math.random) {
  const highest = tiers.at(-1);
  if (!highest) return null;
  const guaranteed = highest.stars >= 4 && pity >= pityLimit - 1;
  let roll = guaranteed ? 0 : random() * tiers.reduce((sum,tier)=>sum+tier.weight,0);
  const tier = guaranteed ? highest : tiers.find(item => (roll -= item.weight) < 0);
  return { id:tier.ids[Math.floor(random()*tier.ids.length)], pity:tier.stars === highest.stars && tier.stars >= 4 ? 0 : Math.min(pityLimit-1,pity+1), guaranteed };
}
function renderAdoption() {
  const ids = remainingCats();
  const tiers = drawTiers(ids);
  const target = tiers.at(-1)?.stars;
  const weight = tiers.reduce((sum,tier)=>sum+tier.weight,0);
  const odds = tiers.map(tier=>tier.stars + ' 星 ' + Number((tier.weight/weight*100).toFixed(1)) + '%').join(' · ');
  const full = catIds().length >= catCapacity();
  const pull = !ids.length || full || s.coins < drawPrice;
  const pity = target >= 4 ? '<p class="copy">缘分 <b>' + s.pity + ' / ' + pityLimit + '</b> · 每次没抽到 ' + target + ' 星加 1，最迟第 ' + pityLimit + ' 抽保底；抽到 ' + target + ' 星后归零。' + (s.pity >= pityLimit-1 ? '下一抽必得 ' + target + ' 星。' : '') + '</p><div class="meter" aria-hidden="true"><i style="width:' + (s.pity/pityLimit*100) + '%"></i></div>' : '<p class="copy">当前猫池没有四星或五星猫。</p>';
  const offers = ids.map(id => {
    const cat = cats[id], price = adoptionPrices[cat.stars];
    return '<article class="adoption-cat"><img src="' + avatars[id] + '" alt=""><div><h3>' + cat.name + ' <span class="rarity rarity-' + cat.stars + '" aria-label="' + cat.stars + '星">' + stars(cat) + '</span></h3><p>' + cat.traits + '</p></div><button type="button" class="secondary" data-act="adopt" data-id="' + id + '" aria-label="领养' + cat.name + '，' + price + '金币" ' + (full || s.coins < price ? 'disabled' : '') + '>领养 · ' + price + '</button></article>';
  }).join('');
  screen('街坊领养所','金币招募 · 缘分保底','<section class="panel"><div class="line-item"><b>猫舍 ' + catIds().length + ' / ' + catCapacity() + '</b><span>金币 ' + s.coins + '</span></div>' + pity + (odds ? '<p class="copy">当前普通抽取概率：' + odds + '。已领养猫咪会从池中移除。</p>' : '') + '<button class="primary wide" type="button" data-act="draw-cat" ' + (pull ? 'disabled' : '') + '>抽一张缘分卡 · 20 金币</button>' + (full && ids.length ? '<button class="secondary wide" type="button" data-act="tab" data-id="stock">猫舍满了，去扩建</button>' : '') + (!full && ids.length && s.coins < drawPrice ? '<button class="secondary wide" type="button" data-act="tab" data-id="pantry">去备料赚金币</button>' : '') + '</section><section class="panel"><h2 class="heading">也可以指定领养</h2>' + (offers || '<p class="copy">这一批猫咪都找到新家了。</p>') + '</section>');
}
function recruitCat(id, price) {
  if (!remainingCats().includes(id) || catIds().length >= catCapacity() || s.coins < price) return false;
  s.coins -= price;
  s.roster.push(id);
  careCat = id;
  lounge = true;
  joiningSeat = null;
  save(); go('shop');
  return true;
}
function adoptCat(id) {
  if (cats[id] && recruitCat(id,adoptionPrices[cats[id].stars])) note(cats[id].name + '到猫舍报到啦。');
}
function pullCat() {
  if (catIds().length >= catCapacity() || s.coins < drawPrice) return;
  const result = drawCatResult(drawTiers(),s.pity);
  if (!result) return;
  s.pity = result.pity;
  if (!recruitCat(result.id,drawPrice)) return;
  const cat = cats[result.id];
  dialog.innerHTML = '<div class="dialog-top"><h2 class="heading" id="dialog-title">' + (result.guaranteed ? '缘分到了！' : '遇见新伙伴') + '</h2><button class="close" type="button" data-act="close" aria-label="关闭">×</button></div><div class="care-summary"><img src="' + avatars[result.id] + '" alt=""><div><h3>' + cat.name + ' · ' + cat.stars + ' 星</h3><p class="copy">' + cat.traits + '</p></div></div><p class="copy">已加入猫舍。当前缘分 ' + s.pity + ' / ' + pityLimit + '。</p><button class="primary wide" type="button" data-act="close">欢迎回家</button>';
  dialog.setAttribute('aria-labelledby','dialog-title');
  dialog.showModal();
}
function recoveryTime(info) {
  return info.recovery ? Math.max(0,Math.ceil((info.recovery.until-Date.now())/1000)) : 0;
}
function finishRecoveries() {
  let changed = false;
  for (const id of catIds()) {
    const info = careState(id);
    if (!info.recovery || info.recovery.until > Date.now()) continue;
    info.stamina = Math.min(100,info.stamina+info.recovery.gain);
    info.recovery = null;
    s.care[id] = info;
    changed = true;
  }
  if (changed) save();
  return changed;
}
function shiftAction(id) {
  if (!s.opened || !catIds().includes(id) || catBusy(id)) return;
  if (s.shift.includes(id)) s.shift = s.shift.filter(cat => cat !== id);
  else if (!restRequired(id) && s.shift.length < maxShift) s.shift.push(id);
  else return;
  update();
}
function renderShift() {
  const rows = catIds().map(id=>{
    const cat = cats[id], info = careState(id), assigned = s.shift.includes(id), busy = catBusy(id);
    const block = !s.opened || !!busy || (!assigned && (restRequired(id) || s.shift.length >= maxShift));
    const label = busy || (restRequired(id) ? '精力不足，需休息' : assigned ? '当班' : '猫舍待命');
    return '<article class="adoption-cat"><img src="' + avatars[id] + '" alt=""><div><h3>' + cat.name + ' · ' + cat.stars + ' 星</h3><p>精力 ' + info.stamina + ' / 100 · ' + label + '</p></div><button class="secondary" type="button" data-act="shift-cat" data-id="' + id + '" aria-label="' + (assigned ? '下班' : '上班') + cat.name + '" ' + (block ? 'disabled' : '') + '>' + (assigned ? '下班' : '上班') + '</button></article>';
  }).join('');
  screen('营业排班','按精力安排今日当班','<section class="panel"><h2 class="heading">当班 ' + s.shift.length + ' / ' + maxShift + '</h2><p class="copy">至少 50 精力才能接单。每桌三星消耗 55，四星 45，五星 35。低于 50 的猫会陪完这一桌，然后自动回猫舍。</p></section><section class="panel">' + (rows || '<p class="copy">先到领养所招募猫咪。</p>') + '</section><button class="secondary wide" type="button" data-act="tab" data-id="care">去猫舍安排休息</button>');
}
function recoveryStatus(id, item, info) {
  const owned = item.stock ? s[item.stock] : info[item.owned];
  const bond = item.bond && info.bond < 5 && info[item.bondDay] < realDay();
  const reason = !owned ? (item.stock ? '没有库存' : '还未购买') :
    catBusy(id) || (info.stamina >= 100 && !bond ?
      (item.bond && info.bond < 5 ? '精力已满，今日亲密度已加' : '精力已满') : '');
  return { owned,bond,reason };
}
function renderCare() {
  if (!catIds().includes(careCat)) careCat = catIds()[0];
  if (!careCat) {
    screen('猫舍照顾','饮食与休息','<section class="panel"><p class="copy">猫舍还没有猫咪。</p><button class="primary wide" type="button" data-act="tab" data-id="adopt">去领养所</button></section>');
    return;
  }
  const cat = cats[careCat], info = careState(careCat), busy = catBusy(careCat);
  const list = catIds().map(id=>'<button class="care-tab" type="button" data-act="care-cat" data-id="' + id + '" aria-pressed="' + (id === careCat) + '"><img src="' + avatars[id] + '" alt=""><span>' + cats[id].name + '</span></button>').join('');
  const items = Object.entries(recoveryItems).map(([id,item])=>{
    const { owned,reason } = recoveryStatus(careCat,item,info);
    return '<article class="care-item"><div><b>' + item.name + '</b><p>+' + item.gain + ' 精力 · ' + item.seconds + ' 秒' + (item.stock ? ' · 库存 ' + owned : owned ? ' · 已购买' : ' · 可重复使用') + '</p></div><button type="button" class="secondary" data-act="buy-rest" data-id="' + id + '" aria-label="购买' + item.name + '" ' + (s.coins < item.cost || (item.owned && owned) ? 'disabled' : '') + '>' + (item.owned && owned ? '已购买' : '购买 ' + item.cost) + '</button><button type="button" class="secondary" data-act="use-rest" data-id="' + id + '" aria-label="使用' + item.name + '" ' + (reason ? 'disabled' : '') + '>使用</button>' + (owned && reason ? '<p class="care-reason">' + reason + '</p>' : '') + '</article>';
  }).join('');
  const recovery = info.recovery ? '<p class="notice">使用' + recoveryItems[info.recovery.item].name + '休息中 · 还需 <b id="rest-countdown">' + recoveryTime(info) + '</b> 秒</p>' : '';
  screen('猫舍照顾','饮食与休息','<section class="panel"><div class="line-item"><b>金币 ' + s.coins + '</b><button class="secondary" type="button" data-act="tab" data-id="shift">营业排班</button></div><div class="care-roster" aria-label="选择猫咪">' + list + '</div><div class="care-summary"><img src="' + avatars[careCat] + '" alt=""><div><h2 class="heading">' + cat.name + '</h2><p class="copy">' + stars(cat) + ' · ' + cat.traits + '</p><p class="copy">精力 ' + info.stamina + ' / 100 · 每桌消耗 ' + staminaCost(careCat) + '</p><p class="copy">亲密度 ' + info.bond + ' / 5 · ' + (busy || '可休息') + '</p></div></div><div class="meter" aria-hidden="true"><i style="width:' + info.stamina + '%"></i></div>' + recovery + '</section><section class="panel"><h2 class="heading">恢复道具</h2><p class="copy">休息期间会暂时离开排班，完成后可重新安排。逗猫棒可以反复恢复精力。罐头和玩具每天各可增加 1 点亲密度。</p>' + items + '</section>');
}
function careAction(act,id) {
  if (tab !== 'care' || !catIds().includes(careCat) || !recoveryItems[id]) return;
  const item = recoveryItems[id], info = careState(careCat);
  const { owned,bond,reason } = recoveryStatus(careCat,item,info);
  if (act === 'buy-rest') {
    if (s.coins < item.cost || (item.owned && owned)) return;
    s.coins -= item.cost;
    if (item.stock) s[item.stock] += 1;
    else info[item.owned] = true;
  } else {
    if (reason) { note(reason); return; }
    if (item.stock) s[item.stock] -= 1;
    if (bond) { info.bond += 1; info[item.bondDay] = realDay(); }
    s.shift = s.shift.filter(cat => cat !== careCat);
    info.recovery = { item:id, until:Date.now()+item.seconds*1000, gain:item.gain };
  }
  s.care[careCat] = info;
  update();
}

const chains = {
  b: { label:'咖啡原料箱', icons:['●','◉','☕','♨'], names:['咖啡豆','研磨粉','浓缩咖啡','手冲拼配'] },
  m: { label:'乳品原料箱', icons:['♧','▥','♨','✿'], names:['鲜奶','奶缸','奶泡','奶油顶'] },
  p: { label:'面点原料箱', icons:['✦','◈','◇','▰'], names:['面粉','面团','黄油酥','烘焙礼盒'] }
};
const pantryLevels = [
  { title:'开店第一杯', goals:['b2'], limit:6, reward:32 },
  { title:'午后拿铁', goals:['b2','m2'], limit:11, reward:38 },
  { title:'磨豆练习', goals:['b3','m1'], limit:14, reward:44 },
  { title:'烘焙窗口', goals:['p2','m2','b2'], limit:16, reward:50 },
  { title:'街坊下午茶', goals:['p3','m2','b2'], limit:20, reward:56 },
  { title:'周末拼配单', goals:['b3','m3','p2'], limit:24, reward:64 },
  { title:'烘焙师的大订单', goals:['b3','m3','p3'], limit:27, reward:76 },
  { title:'阳光间的下午茶', goals:['b3','m3','p3','m1'], limit:27, reward:90 }
];
function tileName(item) { return chains[item[0]].names[Number(item[1])]; }
function tileContent(item) {
  return '<i aria-hidden="true">' + chains[item[0]].icons[Number(item[1])] + '</i><small>' + tileName(item) + '</small>';
}
function pantryEnergy() {
  return '<span class="energy-label"><b aria-hidden="true">ϟ</b> 体力 ' + s.energy.value + ' / ' + maxEnergy + '</span>';
}
function renderPantry() {
  refreshEnergy();
  const active = s.puzzle?.status === 'playing';
  const morning = s.morning ? '<section class="panel"><h2 class="heading">开店前的晨间订单</h2><p class="copy">免费合一份浓缩咖啡，领 24 金币后开门。</p><button class="primary wide" type="button" data-act="morning-board">' + (active ? '继续当前订单' : '开始晨间订单') + '</button></section>' : '';
  const list = pantryLevels.map((level,index) => {
    const unlocked = index === 0 || s.cleared.includes(index-1);
    const cleared = s.cleared.includes(index);
    const resume = active && s.puzzle.level === index;
    const reward = cleared ? 12 : level.reward;
    return '<article class="level-row"><span class="level-no">' + String(index+1).padStart(2,'0') + '</span><div><h3>' + level.title + '</h3><p>' + (unlocked ? level.goals.map(tileName).join(' · ') : '完成上一关解锁') + '</p></div><button class="secondary" type="button" data-act="level" data-id="' + index + '" ' + (!unlocked || (!resume && (active || !s.energy.value)) ? 'disabled' : '') + '>' + (resume ? '继续' : unlocked ? (cleared ? '重玩 · +' : '开局 · +') + reward : '未解锁') + '</button></article>';
  }).join('');
  screen('备料挑战','二合订单 / 街角工坊',morning + '<section class="panel pantry-intro"><div class="line-item">' + pantryEnergy() + '<b>金币 ' + s.coins + '</b></div><h2 class="heading">合成订单，赚猫猫零花钱</h2><p class="copy">开一局消耗 1 点体力。每天本地零点恢复 3 点，最多存 5 点。每关首通奖励不同，重玩通关也可得 12 金币。</p></section><section class="panel">' + list + '</section>');
}
function startPantry(index) {
  refreshEnergy();
  if (s.puzzle?.status === 'playing') {
    if (s.puzzle.level === index) go('board');
    return;
  }
  const morning = s.morning && index === 0;
  if (!pantryLevels[index] || (!morning && !s.energy.value) || (index && !s.cleared.includes(index-1))) return;
  if (!morning) s.energy.value -= 1;
  s.puzzle = { level:index, board:Array(16).fill(null), delivered:[], supplies:pantryLevels[index].limit, status:'playing', reward:0, morning };
  mergeSelected = null;
  save(); go('board');
}
function renderBoard() {
  const attempt = s.puzzle;
  const level = pantryLevels[attempt.level];
  const board = attempt.board.map((item,index)=>'<button type="button" class="merge-tile ' + (item ? 'tile-' + item[0] : 'tile-empty') + (mergeSelected === index ? ' picked' : '') + '" data-act="tile" data-id="' + index + '" aria-pressed="' + (mergeSelected === index) + '" aria-label="' + (item ? tileName(item) : '空格') + '，第 ' + (index+1) + ' 格">' + (item ? tileContent(item) : '') + '</button>').join('');
  const goals = level.goals.map(item=>'<button type="button" class="goal tile-' + item[0] + '" data-act="deliver" data-id="' + item + '" ' + (attempt.delivered.includes(item) || !attempt.board.includes(item) ? 'disabled' : '') + '>' + tileContent(item) + '<span>' + (attempt.delivered.includes(item) ? '已交付' : '交付') + '</span></button>').join('');
  const boxes = [...new Set(level.goals.map(item=>item[0]))].map(key=>'<button class="secondary" type="button" data-act="spawn" data-id="' + key + '" ' + (!attempt.supplies || !attempt.board.includes(null) ? 'disabled' : '') + '>' + chains[key].label + '</button>').join('');
  const done = attempt.status === 'won';
  screen('备料挑战 · 第 ' + (attempt.level+1) + ' 关',level.title,done ? '<section class="panel"><h2 class="heading">订单全部完成</h2><p class="reward-number">+' + attempt.reward + ' 金币</p><p class="copy">已经放进猫咖账本，可用来领养、买玩具和罐头。</p><button class="primary wide" type="button" data-act="tab" data-id="' + (attempt.morning ? 'shop' : !s.opened ? (catIds().length < 3 ? 'adopt' : 'shop') : 'pantry') + '">' + (attempt.morning ? '带上金币，开门营业' : !s.opened ? (catIds().length < 3 ? '拿金币去招募猫咪' : '回店准备开门') : '返回关卡') + '</button></section>' : '<section class="panel"><div class="line-item">' + pantryEnergy() + '<b>剩余取料 ' + attempt.supplies + '</b></div><div class="merge-goals">' + goals + '</div><div class="merge-board" aria-label="合成棋盘">' + board + '</div><div class="actions merge-boxes">' + boxes + '</div><p class="copy">点原料箱取料，把两个相同原料拖到一起，或依次点选两格。合成目标后点上方交付。</p><div class="actions"><button class="secondary" type="button" data-act="discard" ' + (mergeSelected === null ? 'disabled' : '') + '>清掉所选格</button><button class="secondary" type="button" data-act="abandon">放弃本局</button></div></section>','pantry');
}
function mergeTiles(from,to) {
  const board = s.puzzle.board;
  if (from === to || !board[from]) return false;
  if (!board[to]) {
    board[to] = board[from]; board[from] = null;
  } else if (board[to] === board[from] && Number(board[from][1]) < chains[board[from][0]].names.length-1) {
    board[to] = board[from][0] + (Number(board[from][1])+1); board[from] = null;
  } else {
    note('需要两个相同、可升级的原料。');
    return false;
  }
  mergeSelected = null;
  update();
  return true;
}
function pantryAction(act,id) {
  const attempt = s.puzzle;
  if (tab !== 'board' || attempt?.status !== 'playing') return;
  const level = pantryLevels[attempt.level];
  const board = attempt.board;
  if (act === 'tile') {
    const next = Number(id);
    if (mergeSelected !== null && mergeTiles(mergeSelected,next)) return;
    mergeSelected = board[next] && mergeSelected !== next ? next : null;
    refresh();
    workspace.querySelector('[data-act="tile"][data-id="' + next + '"]')?.focus({preventScroll:true});
  } else if (act === 'spawn' && level.goals.some(item=>item[0] === id) && attempt.supplies && board.includes(null)) {
    board[board.indexOf(null)] = id+'0'; attempt.supplies -= 1; update();
  } else if (act === 'discard' && mergeSelected !== null) {
    board[mergeSelected] = null; mergeSelected = null; update();
  } else if (act === 'deliver' && level.goals.includes(id) && board.includes(id) && !attempt.delivered.includes(id)) {
    board[board.indexOf(id)] = null; attempt.delivered.push(id); mergeSelected = null;
    if (attempt.delivered.length === level.goals.length) {
      const first = !s.cleared.includes(attempt.level);
      attempt.morning = s.morning;
      attempt.reward = attempt.morning ? 24 : first ? level.reward : 12;
      if (attempt.morning) s.morning = false;
      if (first) s.cleared.push(attempt.level);
      s.coins += attempt.reward;
      attempt.status = 'won';
    }
    update();
  } else if (act === 'abandon') {
    dialog.innerHTML = '<div class="dialog-top"><h2 class="heading" id="dialog-title">放弃这局？</h2><button class="close" type="button" data-act="close" aria-label="关闭">×</button></div><p class="copy">' + (attempt.morning ? '晨间订单可以免费重试。' : '本局消耗的 1 点体力会保留为已使用，未交完的订单不会发奖。') + '</p><div class="actions"><button class="secondary" type="button" data-act="close">继续玩</button><button class="primary" type="button" data-act="confirm-abandon">确认放弃</button></div>';
    dialog.setAttribute('aria-labelledby','dialog-title');
    dialog.showModal();
  }
}

finishRecoveries();
render();
tick();
setInterval(tick, 250);
