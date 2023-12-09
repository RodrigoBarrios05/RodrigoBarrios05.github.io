// Agrega una variable global para almacenar las tareas
let tasks = [];

// Obtén una referencia al elemento de la lista de tareas
const taskList = document.getElementById("taskList");

// Función para renderizar las tareas en la interfaz de usuario
function renderTasks() {
  // Borra la lista actual antes de renderizar las tareas
  taskList.innerHTML = "";

  // Itera sobre las tareas y crea elementos de lista para cada una
  tasks.forEach((task) => {
    const newTask = document.createElement("li");
    newTask.textContent = task;
    taskList.appendChild(newTask);
  });
}

// Función para agregar una tarea
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const newTask = taskInput.value.trim();

  if (newTask === "") {
    alert("Por favor, ingresa una tarea.");
    return;
  }

  // Agrega la nueva tarea a la lista
  tasks.push(newTask);

  // Renderiza las tareas actualizadas en la interfaz de usuario
  renderTasks();

  // Limpia el campo de entrada
  taskInput.value = "";

  // Guarda las tareas en el caché
  if ('caches' in window) {
    caches.open('task-list-v2').then((cache) => {
      cache.put('/api/tasks', new Response(JSON.stringify(tasks)));
    });
  }
}

// Registro del Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then((registration) => {
      console.log('Service Worker registrado con éxito:', registration);
    })
    .catch((error) => {
      console.log('Error al registrar el Service Worker:', error);
    });

  // Recuperar las tareas almacenadas en caché al cargar la página
  caches.open('task-list-v2').then((cache) => {
    cache.match('/api/tasks').then((response) => {
      if (response) {
        return response.json();
      }
      return [];
    }).then((cachedTasks) => {
      tasks = cachedTasks;
      renderTasks();
    });
  });
}
