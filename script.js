const deviceRadios = document.querySelectorAll('input[name="device"]');
const dateInput = document.getElementById('date');
const totalHoursInput = document.getElementById('totalHours');
const wallpaperInput = document.getElementById('wallpaper');
const accentInput = document.getElementById('accent');
const appsList = document.getElementById('appsList');
const preview = document.getElementById('preview');
const previewDate = document.getElementById('previewDate');
const previewApps = document.getElementById('previewApps');

let apps = [
  { name: 'YouTube', minutes: 90, emoji: '▶️' },
  { name: 'Instagram', minutes: 60, emoji: '📸' },
  { name: 'Messages', minutes: 30, emoji: '💬' }
];

dateInput.value = new Date().toISOString().slice(0, 10);

function renderAppsEditor() {
  appsList.innerHTML = '';
  apps.forEach((app, index) => {
    const div = document.createElement('div');
    div.className = 'app-input';
    div.innerHTML = `
      <input type="text" value="${app.emoji}" maxlength="2" style="width:40px">
      <input type="text" value="${app.name}">
      <input type="number" value="${app.minutes}" min="0" style="width:70px">
      <button data-index="${index}">X</button>
    `;
    div.querySelector('input:nth-child(1)').addEventListener('input', e => {
      app.emoji = e.target.value;
      renderPreview();
    });
    div.querySelector('input:nth-child(2)').addEventListener('input', e => {
      app.name = e.target.value;
      renderPreview();
    });
    div.querySelector('input:nth-child(3)').addEventListener('input', e => {
      app.minutes = Number(e.target.value);
      renderPreview();
    });
    div.querySelector('button').addEventListener('click', e => {
      apps.splice(index, 1);
      renderAppsEditor();
      renderPreview();
    });
    appsList.appendChild(div);
  });
}

function renderPreview() {
  preview.style.background = wallpaperInput.value;
  previewDate.textContent = `${dateInput.value} • Total: ${totalHoursInput.value} hrs`;
  const totalMinutes = apps.reduce((sum, a) => sum + a.minutes, 0);
  previewApps.innerHTML = '';
  apps.sort((a, b) => b.minutes - a.minutes).forEach(app => {
    const pct = totalMinutes ? (app.minutes / totalMinutes) * 100 : 0;
    const div = document.createElement('div');
    div.className = 'app-bar';
    div.innerHTML = `
      <div class="app-bar-name"><span>${app.emoji} ${app.name}</span><span>${app.minutes}m</span></div>
      <div class="progress"><div class="progress-fill" style="width:${pct}%; background:${accentInput.value}"></div></div>
    `;
    previewApps.appendChild(div);
  });
}

document.getElementById('addApp').addEventListener('click', () => {
  apps.push({ name: 'New App', minutes: 10, emoji: '📱' });
  renderAppsEditor();
  renderPreview();
});

deviceRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    preview.style.width = radio.value === 'iphone' ? '320px' : '360px';
  });
});

document.getElementById('download').addEventListener('click', () => {
  html2canvas(preview, { scale: 2 }).then(canvas => {
    const link = document.createElement('a');
    link.download = `screentime-${dateInput.value}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
});

[dateInput, totalHoursInput, wallpaperInput, accentInput].forEach(input => {
  input.addEventListener('input', renderPreview);
});

renderAppsEditor();
renderPreview();
