// Info date
const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');

// Tasks Container
const tasksContainer = document.getElementById('tasksContainer');

const setDate = () => {
    const date = new Date();
    dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
    dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
};

const addNewTask = event => {
    event.preventDefault();
    const { value } = event.target.taskText;
    if(!value) return;

    const task = document.createElement('div');
    task.classList.add('task', 'roundBorder');
    task.textContent = value;

    // Animación de entrada
    setTimeout(() => task.classList.add('show'), 50);

    // Evento de cambio de estado
    task.addEventListener('click', changeTaskState);

    // Insertar en el inicio
    tasksContainer.prepend(task);

    // Reset input
    event.target.reset();
};

const changeTaskState = event => {
    const task = event.target;
    task.classList.toggle('done');

    // Efecto de “check” animado
    if (task.classList.contains('done')) {
        task.style.transform = "scale(0.95)";
        task.style.transition = "all 0.2s ease";
        setTimeout(() => {
            task.style.transform = "scale(1)";
        }, 200);
    }
};

const order = () => {
    const done = [];
    const toDo = [];
    tasksContainer.childNodes.forEach(el => {
        if (el.classList && el.classList.contains('done')) {
            done.push(el);
        } else {
            toDo.push(el);
        }
    });
    return [...toDo, ...done];
};

const renderOrderedTasks = () => {
    order().forEach(el => tasksContainer.appendChild(el));

    // Feedback visual al ordenar
    tasksContainer.style.transition = "all 0.3s ease";
    tasksContainer.style.transform = "scale(0.97)";
    setTimeout(() => {
        tasksContainer.style.transform = "scale(1)";
    }, 300);
};

setDate();
// Toggle Dark/Light Mode
const toggleThemeBtn = document.getElementById('toggleTheme');

// Cargar preferencia guardada
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleThemeBtn.textContent = "☀️";
}

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Guardar preferencia
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleThemeBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        toggleThemeBtn.textContent = "🌙";
    }
});
// Filtro de tareas
const filterTasks = (filter) => {
    const tasks = tasksContainer.querySelectorAll(".task");
    tasks.forEach(task => {
        switch(filter) {
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
};

