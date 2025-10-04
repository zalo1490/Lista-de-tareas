// =====================
// 🔹 Variables globales
// =====================
const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');

const tasksContainer = document.getElementById('tasksContainer');
const toggleThemeBtn = document.getElementById('toggleTheme');

const authContainer = document.getElementById('authContainer');
const loginFormDiv = document.getElementById('loginForm');
const registerFormDiv = document.getElementById('registerForm');
const mainApp = document.getElementById('mainApp');

const calendarElement = document.getElementById('calendar');
const calendarMonthYear = document.getElementById('calendarMonthYear');
const selectedDateLabel = document.getElementById('selectedDateLabel');

let selectedDate = new Date();
let currentMonth = selectedDate.getMonth();
let currentYear = selectedDate.getFullYear();

// Guardar tareas por usuario
let currentUser = null;
let tasksData = {}; // { "usuario": [ {text,date,done}, ... ] }

// =====================
// 🔹 Login / Registro
// =====================
function showRegister() {
  loginFormDiv.style.display = 'none';
  registerFormDiv.style.display = 'block';
}

function showLogin() {
  registerFormDiv.style.display = 'none';
  loginFormDiv.style.display = 'block';
}

function register(event) {
  event.preventDefault();
  const user = document.getElementById('registerUser').value;
  const pass = document.getElementById('registerPass').value;

  let users = JSON.parse(localStorage.getItem('users')) || {};
  if(users[user]) {
    alert("Usuario ya existe");
    return;
  }
  users[user] = { password: pass, tasks: [] };
  localStorage.setItem('users', JSON.stringify(users));
  alert("Registro exitoso. Ahora inicia sesión.");
  showLogin();
}

function login(event) {
  event.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;

  let users = JSON.parse(localStorage.getItem('users')) || {};
  if(users[user] && users[user].password === pass) {
    currentUser = user;
    tasksData[user] = users[user].tasks || [];
    authContainer.style.display = 'none';
    mainApp.style.display = 'block';
    setDate();
    renderCalendar(currentMonth, currentYear);
    renderTasksForSelectedDate();
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// =====================
// 🔹 Fecha actual
// =====================
const setDate = () => {
  const date = new Date();
  dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
  dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
  dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
  dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
};

// =====================
// 🔹 Dark / Light Mode
// =====================
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleThemeBtn.textContent = "☀️";
}

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    toggleThemeBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    toggleThemeBtn.textContent = "🌙";
  }
});

// =====================
// 🔹 Calendar
// =====================
function renderCalendar(month, year) {
  calendarElement.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  calendarMonthYear.textContent = `${new Date(year, month).toLocaleString('es', { month: 'long' })} ${year}`;

  // Ajustar inicio domingo-lunes
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  // Celdas vacías antes del primer día
  for(let i=0; i<startDay; i++){
    const emptyCell = document.createElement('div');
    calendarElement.appendChild(emptyCell);
  }

  // Celdas del mes
  for(let day=1; day<=daysInMonth; day++){
    const cell = document.createElement('div');
    cell.classList.add('calendar-day');
    cell.textContent = day;

    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    if(hasTasksOnDate(dateStr)) cell.classList.add('has-tasks');
    if(isSelectedDate(dateStr)) cell.classList.add('selected');

    cell.addEventListener('click', () => {
      selectedDate = new Date(year, month, day);
      renderCalendar(currentMonth, currentYear);
      renderTasksForSelectedDate();
    });

    calendarElement.appendChild(cell);
  }
}

function prevMonth() {
  currentMonth--;
  if(currentMonth < 0){
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
}

function nextMonth() {
  currentMonth++;
  if(currentMonth > 11){
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
}

function hasTasksOnDate(dateStr){
  return tasksData[currentUser]?.some(t => t.date === dateStr);
}

function isSelectedDate(dateStr){
  const sel = selectedDate;
  return dateStr === `${sel.getFullYear()}-${String(sel.getMonth()+1).padStart(2,'0')}-${String(sel.getDate()).padStart(2,'0')}`;
}

// =====================
// 🔹 Tasks
// =====================
function addNewTask(event){
  event.preventDefault();
  const { value } = event.target.taskText;
  if(!value) return;

  const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;
  const taskObj = { text: value, date: dateStr, done: false };

  tasksData[currentUser].push(taskObj);
  saveTasks();

  renderTasksForSelectedDate();
  event.target.reset();
}

function renderTasksForSelectedDate(){
  tasksContainer.innerHTML = '';
  const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;
  selectedDateLabel.textContent = dateStr;

  tasksData[currentUser]?.forEach((t, i) => {
    if(t.date === dateStr){
      const task = document.createElement('div');
      task.classList.add('task', 'roundBorder');
      if(t.done) task.classList.add('done');
      task.textContent = t.text;

      task.addEventListener('click', () => {
        t.done = !t.done;
        saveTasks();
        renderTasksForSelectedDate();
      });

      tasksContainer.appendChild(task);
      setTimeout(() => task.classList.add('show'), 50);
    }
  });
  renderCalendar(currentMonth, currentYear);
}

function saveTasks(){
  let users = JSON.parse(localStorage.getItem('users')) || {};
  if(currentUser) users[currentUser].tasks = tasksData[currentUser];
  localStorage.setItem('users', JSON.stringify(users));
}

// =====================
// 🔹 Task Filters & Order
// =====================
function filterTasks(filter) {
  const tasks = tasksContainer.querySelectorAll(".task");
  tasks.forEach(task => {
    switch(filter){
      case "all":
        task.style.display = "block";
        break;
      case "pending":
        task.style.display = task.classList.contains("done") ? "none" : "block";
        break;
      case "done":
        task.style.display = task.classList.contains("done") ? "block" : "none";
        break;
    }
  });
}

function order(){
  const done = [];
  const toDo = [];
  tasksContainer.childNodes.forEach(el => {
    if(el.classList && el.classList.contains('done')){
      done.push(el);
    } else {
      toDo.push(el);
    }
  });
  return [...toDo, ...done];
}

function renderOrderedTasks(){
  order().forEach(el => tasksContainer.appendChild(el));
  tasksContainer.style.transition = "all 0.3s ease";
  tasksContainer.style.transform = "scale(0.97)";
  setTimeout(() => tasksContainer.style.transform = "scale(1)", 300);
}

// =====================
// 🔹 Inicialización
// =====================
setDate();

// =====================
// 🔹 Logout
// =====================
document.getElementById("logoutBtn").addEventListener("click", () => {
  currentUser = null;
  // Ocultar la app y mostrar login otra vez
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("authContainer").style.display = "block";
});
