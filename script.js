// simple app to mimic iOS Screen Time appearance
const dateInput = document.getElementById('date');
const totalHoursInput = document.getElementById('totalHours');
const wallpaperInput = document.getElementById('wallpaper');
const accentInput = document.getElementById('accent');
const appsList = document.getElementById('appsList');
const previewApps = document.getElementById('previewApps');
const previewDate = document.getElementById('previewDate');
const totalHoursView = document.getElementById('totalHoursView');
const previewDevice = document.getElementById('previewDevice');

const addBtn = document.getElementById('addApp');
const downloadBtn = document.getElementById('download');
const exportBtn = document.getElementById('exportJSON');
const importInp = document.getElementById('importJSON');

let apps = [
  {emoji:'▶️', name:'YouTube', minutes: 90},
  {emoji:'📸', name:'Instagram', minutes: 60},
  {emoji:'💬', name:'Messages', minutes: 30}
];

dateInput.value = new Date().toISOString().slice(0,10);

function renderAppsEditor(){
  appsList.innerHTML = '';
  apps.forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'app-row';
    row.innerHTML = `
      <input class="emoji" value="${a.emoji}" maxlength="2" style="width:42px">
      <input class="name" value="${a.name}" placeholder="App name">
      <input class="mins" type="number" value="${a.minutes}" min="0" style="width:80px">
      <button class="del btn small">Del</button>
    `;
    row.querySelector('.emoji').addEventListener('input', e => { a.emoji = e.target.value; renderPreview(); });
    row.querySelector('.name').addEventListener('input', e => { a.name = e.target.value; renderPreview(); });
    row.querySelector('.mins').addEventListener('input', e => { a.minutes = Number(e.target.value); renderPreview(); });
    row.querySelector('.del').addEventListener('click', () => { apps.splice(i,1); renderAppsEditor(); renderPreview(); });
    appsList.appendChild(row);
  });
}

function renderPreview(){
  // wallpaper + accent
  previewDevice.style.background = wallpaperInput.value;
  previewDevice.style.setProperty('--accent', accentInput.value);

  // date & total hours
  previewDate.textContent = `${dateInput.value} • Total: ${Number(totalHoursInput.value)||0} hrs`;
  totalHoursView.textContent = `${Number(totalHoursInput.value)||0} hrs`;

  // apps
  const total = apps.reduce((s, x)=> s + (Number(x.minutes)||0), 0) || 1;
  previewApps.innerHTML = '';
  // sort descending
  apps.slice().sort((a,b)=>b.minutes-a.minutes).forEach(a=>{
    const pct = Math.max(3, Math.round((a.minutes/total)*100));
    const itm = document.createElement('div');
    itm.className = 'app-item';
    itm.innerHTML = `
      <div class="row"><div>${a.emoji} ${a.name}</div><div>${a.minutes}m</div></div>
      <div class="progress"><i style="width:${pct}%; background:${accentInput.value}"></i></div>
    `;
    previewApps.appendChild(itm);
  });
}

// device width toggle
document.querySelectorAll('input[name="device"]').forEach(r=>{
  r.addEventListener('change', (e)=>{
    if(e.target.value === 'iphone'){
      previewDevice.classList.remove('android');
      previewDevice.classList.add('iphone');
      previewDevice.style.width = '390px';
      previewDevice.style.borderRadius = '42px';
    } else {
      previewDevice.classList.remove('iphone');
      previewDevice.classList.add('android');
      previewDevice.style.width = '360px';
      previewDevice.style.borderRadius = '18px';
    }
  });
});

addBtn.addEventListener('click', ()=>{
  apps.push({emoji:'📱', name:'New App', minutes:10});
  renderAppsEditor();
  renderPreview();
});

[dateInput, totalHoursInput, wallpaperInput, accentInput].forEach(el=> el.addEventListener('input', renderPreview));

// download as png
downloadBtn.addEventListener('click', ()=> {
  // temporarily remove outline shadows to get a clean capture
  html2canvas(previewDevice, {scale:2, backgroundColor:null}).then(canvas=>{
    const a = document.createElement('a');
    a.download = `screentime-${dateInput.value}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  });
});

// export/import JSON
exportBtn.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify({
    date: dateInput.value, totalHours: totalHoursInput.value,
    wallpaper: wallpaperInput.value, accent: accentInput.value, apps
  },null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'screentime-presets.json';
  a.click();
});

importInp.addEventListener('change', (e)=>{
  const f = e.target.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try{
      const obj = JSON.parse(ev.target.result);
      dateInput.value = obj.date || dateInput.value;
      totalHoursInput.value = obj.totalHours || totalHoursInput.value;
      wallpaperInput.value = obj.wallpaper || wallpaperInput.value;
      accentInput.value = obj.accent || accentInput.value;
      apps = obj.apps && obj.apps.length ? obj.apps : apps;
      renderAppsEditor();
      renderPreview();
    }catch(err){
      alert('Invalid JSON');
    }
  };
  r.readAsText(f);
});

renderAppsEditor();
renderPreview();
