/* ============================================
   PREG MATH — script.js
   Funcionalidades: navegação, exercícios,
   accordions, simulado, busca.
   ============================================ */

'use strict';

/* ===== STATE ===== */
const state = {
  correctAnswers: 0,
  totalAnswered: 0,
  totalQuestions: 3,
  selectedQty: 5,
  selectedTime: 2,
};

/* ===== PAGE NAVIGATION ===== */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Close mobile menu if open
  document.getElementById('navLinks').classList.remove('open');
}

function setActive(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

/* ===== EXERCISES ===== */
function selectOption(optEl, groupId, isCorrect) {
  const group = document.getElementById(groupId);

  // Already answered?
  if (group.querySelector('.correct, .incorrect')) return;

  const allOpts = group.querySelectorAll('.option');
  allOpts.forEach(o => o.classList.add('disabled'));

  const qNum = groupId.replace('opts', '');
  const fbEl = document.getElementById('fb' + qNum);

  if (isCorrect) {
    optEl.classList.add('correct');
    state.correctAnswers++;
    fbEl.textContent = '✅ Correto! Muito bem!';
    fbEl.className = 'q-feedback show correct-fb';
  } else {
    optEl.classList.add('incorrect');
    // Highlight correct answer
    allOpts.forEach(o => {
      if (o.getAttribute('onclick') && o.getAttribute('onclick').includes('true')) {
        o.classList.add('correct');
      }
    });
    fbEl.textContent = '❌ Incorreto. Revise esse conceito!';
    fbEl.className = 'q-feedback show incorrect-fb';
  }

  state.totalAnswered++;
  updatePerfRing();

  // Mark nav dot as answered
  const dotIndex = parseInt(qNum) - 1;
  const dots = document.querySelectorAll('.q-dot');
  if (dots[dotIndex]) dots[dotIndex].classList.add('answered');
}

function updatePerfRing() {
  const pct = state.totalAnswered > 0
    ? Math.round((state.correctAnswers / state.totalAnswered) * 100)
    : 0;

  const circle = document.getElementById('perfCircle');
  const pctEl  = document.getElementById('perfPct');
  const label  = document.getElementById('perfLabel');

  if (!circle) return;

  const circumference = 2 * Math.PI * 40; // r=40
  const offset = circumference - (pct / 100) * circumference;

  circle.style.strokeDashoffset = offset;
  pctEl.textContent = pct + '%';

  if (pct >= 80) {
    circle.style.stroke = '#27ae60';
    label.textContent = '🎉 Excelente!';
  } else if (pct >= 50) {
    circle.style.stroke = '#FF8C00';
    label.textContent = '📚 Continue estudando!';
  } else {
    circle.style.stroke = '#e74c3c';
    label.textContent = '💪 Não desista!';
  }
}

function showResults() {
  const box = document.getElementById('resultBox');
  const answered = state.totalAnswered;
  const correct  = state.correctAnswers;
  const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  let emoji = pct >= 80 ? '🏆' : pct >= 50 ? '📘' : '💡';
  let msg   = pct >= 80 ? 'Excelente desempenho!' : pct >= 50 ? 'Bom trabalho, continue!' : 'Estude mais esse conteúdo.';

  box.style.display = 'block';
  box.innerHTML = `
    <div style="font-size:2.5rem;margin-bottom:12px">${emoji}</div>
    <h3 style="font-size:1.4rem;margin-bottom:8px">${msg}</h3>
    <p style="color:#888;margin-bottom:16px">Você acertou <strong style="color:#FF8C00">${correct} de ${answered}</strong> questões respondidas.</p>
    <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap">
      <div style="text-align:center">
        <div style="font-size:2rem;font-weight:800;color:#FF8C00;font-family:'Sora',sans-serif">${pct}%</div>
        <div style="font-size:.8rem;color:#888">Aproveitamento</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:2rem;font-weight:800;color:#27ae60;font-family:'Sora',sans-serif">${correct}</div>
        <div style="font-size:.8rem;color:#888">Acertos</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:2rem;font-weight:800;color:#e74c3c;font-family:'Sora',sans-serif">${answered - correct}</div>
        <div style="font-size:.8rem;color:#888">Erros</div>
      </div>
    </div>
    <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button class="btn-primary" onclick="showPage('simulado')"><i class="fas fa-play"></i> Fazer Simulado</button>
      <button class="btn-ghost" onclick="resetExercises()"><i class="fas fa-redo"></i> Refazer</button>
    </div>
  `;

  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetExercises() {
  // Reset state
  state.correctAnswers = 0;
  state.totalAnswered  = 0;

  // Reset all option groups
  ['opts1', 'opts2', 'opts3'].forEach(id => {
    const group = document.getElementById(id);
    if (!group) return;
    group.querySelectorAll('.option').forEach(o => {
      o.classList.remove('correct', 'incorrect', 'disabled');
    });
  });

  // Reset feedbacks
  ['fb1', 'fb2', 'fb3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'q-feedback';
  });

  // Reset result box
  const box = document.getElementById('resultBox');
  if (box) box.style.display = 'none';

  // Reset nav dots
  document.querySelectorAll('.q-dot').forEach(d => d.classList.remove('answered'));

  // Reset perf ring
  updatePerfRing();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToQ(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ===== ACCORDION ===== */
function toggleAccordion(id) {
  const item = document.getElementById(id);
  if (!item) return;

  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.accordion-item.open').forEach(a => a.classList.remove('open'));

  // Open clicked (if it wasn't open)
  if (!isOpen) item.classList.add('open');
}

/* ===== SIMULADO FORM ===== */
function selectQty(btn) {
  document.querySelectorAll('#qtySel .qty-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.selectedQty = parseInt(btn.dataset.qty);
}

function selectTime(btn) {
  btn.closest('.qty-selector').querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.selectedTime = parseInt(btn.dataset.time);
}

function startSimulado(e) {
  e.preventDefault();

  let valid = true;

  // Validate name
  const nome = document.getElementById('nomeCompleto').value.trim();
  const errNome = document.getElementById('errNome');
  if (!nome || nome.length < 3) {
    errNome.textContent = 'Por favor, informe seu nome completo.';
    valid = false;
  } else {
    errNome.textContent = '';
  }

  // Validate vestibulares
  const vesChecks = document.querySelectorAll('.ves-check:checked');
  const errVes = document.getElementById('errVes');
  if (vesChecks.length === 0) {
    errVes.textContent = 'Selecione pelo menos um vestibular.';
    valid = false;
  } else {
    errVes.textContent = '';
  }

  if (!valid) return;

  // Build summary
  const vestibulares = Array.from(vesChecks).map(c => c.value).join(', ');
  const topicos = Array.from(document.querySelectorAll('.top-check:checked')).map(c => c.value);
  const topStr  = topicos.length ? topicos.join(', ') : 'Todos os tópicos';
  const tempo   = state.selectedTime === 0 ? 'Livre' : state.selectedTime + ' min/questão';

  // Show success
  const form    = document.getElementById('simuladoForm');
  const success = document.getElementById('simuladoSuccess');
  const msgEl   = document.getElementById('successMsg');
  const detEl   = document.getElementById('successDetail');

  form.style.display    = 'none';
  success.style.display = 'block';

  msgEl.textContent = `Boa sorte, ${nome.split(' ')[0]}! 🎯`;
  detEl.innerHTML = `
    <strong>${state.selectedQty} questões</strong> · ${vestibulares}<br/>
    📚 Tópicos: ${topStr}<br/>
    ⏱️ Tempo: ${tempo}
  `;
}

function resetSimulado() {
  document.getElementById('simuladoForm').style.display    = 'block';
  document.getElementById('simuladoSuccess').style.display = 'none';
  document.getElementById('nomeCompleto').value = '';
  document.querySelectorAll('.ves-check, .top-check').forEach(c => c.checked = false);
  document.getElementById('errNome').textContent = '';
  document.getElementById('errVes').textContent  = '';
}

/* ===== SEARCH BAR ===== */
const searchInput = document.getElementById('searchInput');
const searchMap   = {
  'geometria'     : 'exercicios',
  'algebra'       : 'exercicios',
  'álgebra'       : 'exercicios',
  'estatistica'   : 'exercicios',
  'estatística'   : 'exercicios',
  'trigonometria' : 'exercicios',
  'porcentagem'   : 'conteudo',
  'fracao'        : 'conteudo',
  'fração'        : 'conteudo',
  'regra de tres' : 'conteudo',
  'regra de três' : 'conteudo',
  'video'         : 'videoaulas',
  'vídeo'         : 'videoaulas',
  'videoaula'     : 'videoaulas',
  'simulado'      : 'simulado',
  'exercicio'     : 'exercicios',
  'exercício'     : 'exercicios',
};

if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const q = searchInput.value.toLowerCase().trim();
    let found = false;

    for (const key in searchMap) {
      if (q.includes(key)) {
        showPage(searchMap[key]);
        searchInput.value = '';
        found = true;
        break;
      }
    }

    if (!found && q.length > 0) {
      showSearchNotFound(q);
    }
  });
}

function showSearchNotFound(q) {
  // Briefly flash the search input
  searchInput.style.background = 'rgba(231,76,60,.2)';
  setTimeout(() => { searchInput.style.background = ''; }, 800);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');

  // Animate perf ring on page load
  setTimeout(updatePerfRing, 300);

  // Add click-outside to close mobile menu
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      navLinks.classList.remove('open');
    }
  });
});