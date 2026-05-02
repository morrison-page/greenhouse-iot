function toggleTheme(cb) {
  const dark = cb.checked;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
 
document.addEventListener('DOMContentLoaded', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.getElementById('theme-switch').checked = isDark;
 
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      document.getElementById('theme-switch').checked = e.matches;
    }
  });

  mqttConnect();
});
 
let client = null;
const MQTT_URL = localStorage.getItem('mqtt-url') || 'ws://172.22.101.29:9001';
const MQTT_USERNAME = localStorage.getItem('mqtt-username') || 'greenhouse';
const MQTT_PASSWORD = localStorage.getItem('mqtt-password') || 'greenhouse';
 
function log(msg, cls = '') {
  const el = document.getElementById('log');
  const ts = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-dim">[${ts}]</span> <span class="${cls}">${msg}</span>`;
  el.appendChild(entry);
  el.scrollTop = el.scrollHeight;
}
 
function clearLog() {
  document.getElementById('log').innerHTML = '<span class="log-dim">- log cleared -</span>';
}
 
function setActionBtns(enabled) {
  document.querySelectorAll('#action-grid .mqtt-btn, #btn-custom').forEach(b => {
    b.disabled = !enabled;
  });
}

function updateControlButtonStates() {
  const modeBtn = document.querySelector('[data-control="mode"]');
  const modeState = (modeBtn?.dataset.state || '').toUpperCase();
  const otherBtns = document.querySelectorAll('[data-control]:not([data-control="mode"])');
  const disableOthers = (modeState === 'LOCAL');
  otherBtns.forEach(btn => {
    btn.disabled = disableOthers;
  });
}
 
function mqttConnect() {
  const url = MQTT_URL;
  const username = MQTT_USERNAME;
  const password = MQTT_PASSWORD;
  const clientId = document.getElementById('cfg-client')?.value.trim()
    || `web_${Math.random().toString(36).slice(2, 9)}`;
 
  if (client) { client.end(true); }
 
  log(`Connecting to ${url} as ${clientId} …`, 'log-info');
 
  client = mqtt.connect(url, {
    clientId,
    username,
    password,
    clean: true,
    connectTimeout: 6000,
    reconnectPeriod: 0,
  });
 
  client.on('connect', () => {
    setActionBtns(true);
    updateControlButtonStates();
    log('Connected ✓', 'log-ok');
  });
 
  client.on('error', err => {
    setActionBtns(false);
    log(`Error: ${err.message}`, 'log-err');
  });
 
  client.on('close', () => {
    setActionBtns(false);
    log('Connection closed.', 'log-dim');
  });
 
  client.on('offline', () => {
    log('Client went offline.', 'log-err');
  });
}
 
function mqttDisconnect() {
  if (client) {
    client.end(false, {}, () => log('Disconnected.', 'log-dim'));
    setActionBtns(false);
  }
}
 
function mqttSend(btn) {
  const deviceId = document.getElementById('device-id')?.value.trim();
  if (!deviceId) { log('Device ID required in the textbox.', 'log-err'); return; }

  const control = btn.dataset.control;
  if (!control) { log('Button missing data-control attribute.', 'log-err'); return; }

  // Determine current state and toggle
  let state = (btn.dataset.state || '').toUpperCase();
  let payload = '';
  if (control === 'mode') {
    // toggle between LOCAL and REMOTE
    state = (state === 'REMOTE') ? 'LOCAL' : 'REMOTE';
    payload = state;
  } else {
    // other controls toggle ON/OFF
    state = (state === 'ON') ? 'OFF' : 'ON';
    payload = state;
  }

  // Build topic: mode -> devices/{id}/mode/set ; others -> devices/{id}/control/{control}/set
  const topic = control === 'mode'
    ? `devices/${deviceId}/mode/set`
    : `devices/${deviceId}/control/${control}/set`;

  // persist new state on the button and update its label
  btn.dataset.state = state;
  const label = btn.querySelector('.btn-label');
  if (label) {
    // keep the emoji and name, append state suffix
    const parts = label.textContent.split(' - ')[0].trim();
    label.textContent = `${parts} - ${state}`;
  }

  // if mode button, update control button states
  if (control === 'mode') {
    updateControlButtonStates();
  }

  publish(topic, payload);
}
 
function mqttSendCustom() {
  const topic   = document.getElementById('custom-topic').value.trim();
  const payload = document.getElementById('custom-payload').value.trim();
  if (!topic) { log('Topic is required.', 'log-err'); return; }
  publish(topic, payload);
}
 
function publish(topic, payload) {
  if (!client || !client.connected) {
    log('Not connected - connect first.', 'log-err');
    return;
  }
  client.publish(topic, payload, { qos: 1 }, err => {
    if (err) {
      log(`Publish failed on "${topic}": ${err.message}`, 'log-err');
    } else {
      log(`→ ${topic}  ${payload}`, 'log-ok');
    }
  });
}