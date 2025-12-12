// VedicCare UI Prototype - vediccare.js

/* --- Simple SPA nav --- */
const pages = ['home','doctors','profile','signup','dashboard-patient','dashboard-doctor','admin','blog','faq','contact'];
function navTo(page){
  pages.forEach(p=>{
    const el=document.getElementById('page-'+p);
    if(!el) return;
    if(p===page) el.classList.remove('hidden'); else el.classList.add('hidden');
  })
  window.scrollTo({top:0,behavior:'smooth'});
  if(page==='doctors') renderDoctors();
}

// initial
navTo('home');

/* --- Sample dataset --- */
const doctors = [
  {id:1,name:'Dr. Anjali Kothari', spec:'General Physician', fee:499, rating:4.9, lang:['English','Hindi'], slots:['2025-12-10 10:00','2025-12-10 16:00'], about:'12 years experience. Focus on preventive care.'},
  {id:2,name:'Dr. Rohan Mehta', spec:'Dermatology', fee:699, rating:4.7, lang:['English'], slots:['2025-12-11 11:00','2025-12-12 15:00'], about:'Skin specialist with 8 years experience.'},
  {id:3,name:'Dr. Priya Sharma', spec:'Pediatrics', fee:599, rating:4.8, lang:['English','Hindi'], slots:['2025-12-10 09:00','2025-12-13 14:00'], about:'Child health and vaccination specialist.'},
];

const specialties = [...new Set(doctors.map(d=>d.spec))];
const specialtySelects = document.querySelectorAll('#searchSpecialty, #filterSpecialty');
specialtySelects.forEach(s=>{specialties.forEach(sp=>{const opt=document.createElement('option');opt.value=sp;opt.innerText=sp;s.appendChild(opt)})});

// render list
function renderDoctors(){
  const list = document.getElementById('doctorsList'); list.innerHTML='';
  const sort = document.getElementById('sortBy')?.value || 'relevance';
  let ds = [...doctors];
  if(sort==='rating') ds.sort((a,b)=>b.rating-a.rating);
  if(sort==='fee_low') ds.sort((a,b)=>a.fee-b.fee);
  if(sort==='fee_high') ds.sort((a,b)=>b.fee-a.fee);
  ds.forEach(d=>{
    const el = document.createElement('div'); el.className='card doctor-card';
    el.innerHTML = `<div class="avatar">${getInitials(d.name)}</div>
      <div class="doctor-meta">
        <div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${d.name}</strong><div class="muted" style="font-size:13px">${d.spec}</div></div><div style="text-align:right"><div style="font-weight:700">₹${d.fee}</div><div class="muted" style="font-size:13px">${d.rating} ★</div></div></div>
        <div style="margin-top:8px"><div class="muted" style="font-size:13px">Languages: ${d.lang.join(', ')}</div></div>
        <div style="margin-top:8px;display:flex;gap:8px"><button class="btn-primary" onclick="openProfile(${d.id})">View profile</button><button class="btn-ghost" onclick="openBookingModal(${d.id})">Book</button></div>
      </div>`;
    list.appendChild(el);
  })
}

function getInitials(name){return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}

function openProfile(id){
  const d = doctors.find(x=>x.id===id);
  if(!d) return;
  document.getElementById('profileAvatar').innerText = getInitials(d.name);
  document.getElementById('profileName').innerText = d.name;
  document.getElementById('profileSpecs').innerText = `${d.spec} • ${d.lang.join(', ')}`;
  document.getElementById('profileAbout').innerText = d.about;
  const slots = document.getElementById('profileSlots'); slots.innerHTML=''; d.slots.forEach(s=>{const sp=document.createElement('div');sp.className='slot';sp.innerText=s;sp.onclick=()=>openBookingModal(id,s);slots.appendChild(sp)})
  const rev = document.getElementById('profileReviews'); rev.innerHTML = `<div class="muted">Excellent consult. Very clear instructions. — Patient</div>`;
  navTo('profile');
}

/* Booking modal */
function openBookingModal(docId,slot){
  const d = doctors.find(x=>x.id===docId) || doctors[0];
  const html = `<div class="modal-backdrop" onclick="closeModal()"><div class="modal" onclick="event.stopPropagation()"><h3>Book appointment — ${d.name}</h3>
    <div style="display:grid;grid-template-columns:1fr 140px;gap:8px;margin-top:8px"> <input id="bookDate" placeholder="YYYY-MM-DD HH:MM" value="${slot||''}"/> <div><button class="btn-primary" onclick="confirmBooking(${d.id})">Confirm</button></div></div>
    <div style="margin-top:8px"><button class="btn-ghost" onclick="closeModal()">Cancel</button></div></div></div>`;
  const root = document.getElementById('modalRoot'); root.innerHTML = html; root.classList.remove('hidden');
}
function closeModal(){document.getElementById('modalRoot').classList.add('hidden'); document.getElementById('modalRoot').innerHTML=''}
function confirmBooking(docId){const date=document.getElementById('bookDate').value||'unspecified'; alert('Booking confirmed with doctor #'+docId+' at '+date); closeModal();}

/* Signup modal flows */
function openModal(kind){
  const html = `<div class="modal-backdrop" onclick="closeModal()"><div class="modal" onclick="event.stopPropagation()"><h3>${kind==='signupDoctor'?'Doctor signup':'Patient signup'}</h3>
    <div style="margin-top:8px;display:grid;gap:8px"> <input placeholder="Full name"/><input placeholder="Email"/> <input placeholder="Password" type="password"/></div>
    <div style="margin-top:8px;display:flex;gap:8px"><button class="btn-primary">Create account</button><button class="btn-ghost" onclick="closeModal()">Cancel</button></div></div></div>`;
  const root = document.getElementById('modalRoot'); root.innerHTML = html; root.classList.remove('hidden');
}
function openSignup(){ navTo('signup'); openModal('signupPatient'); }

/* Instant consult placeholder */
function startInstantConsult(){ alert('Starting instant consult (placeholder) — this would open secure video/voice chat window in real app.'); }

/* Simple filters */
function applyFilters(){ renderDoctors(); }
function searchDoctors(){ const q=document.getElementById('searchInput').value; alert('Search for: '+q+' (demo)'); navTo('doctors'); }

/* Small dashboards renders */
function renderPatientDashboard(){
  document.getElementById('patientUpcoming').innerHTML = '<div class="card">No upcoming appointments. <button class="btn-primary" style="margin-top:8px" onclick="navTo(\'doctors\')">Book now</button></div>';
}
function renderDoctorDashboard(){
  document.getElementById('doctorSchedule').innerHTML = '<div class="muted">No appointments scheduled for today.</div>';
}

/* Admin users */
function renderAdminUsers(){
  const tbody = document.getElementById('adminUsers'); tbody.innerHTML='';
  const sample=[['Anjali','Doctor','2024-06-12'],['Jainil','Patient','2024-09-10']];
  sample.forEach(s=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td><button class="btn-ghost">Manage</button></td>`;tbody.appendChild(tr)})
}

// wire nav for dashboards
document.addEventListener('keydown',e=>{ if(e.key==='1') navTo('dashboard-patient'); if(e.key==='2') navTo('dashboard-doctor'); if(e.key==='3') navTo('admin'); });

// init
renderDoctors(); renderPatientDashboard(); renderDoctorDashboard(); renderAdminUsers();
