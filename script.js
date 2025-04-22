document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const clearCompletedBtn = document.getElementById("clear-completed");

  // State
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let currentFilter = "all";

  // Initialize
  renderTodos();

  // Event Listeners
  todoForm.addEventListener("submit", addTodo);
  todoList.addEventListener("click", handleTodoClick);
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setFilter(btn.dataset.filter);
    });
  });
  clearCompletedBtn.addEventListener("click", clearCompleted);

  // Functions
  function addTodo(e) {
    e.preventDefault();

    const todoText = todoInput.value.trim();

    if (todoText === "") return;

    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false,
      createdAt: new Date(),
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();

    todoInput.value = "";
    todoInput.focus();
  }

  function handleTodoClick(e) {
    const item = e.target.closest(".todo-item");

    if (!item) return;

    const id = parseInt(item.dataset.id);

    // Handle checkbox click
    if (e.target.classList.contains("todo-checkbox")) {
      toggleTodoComplete(id);
    }

    // Handle delete button click
    if (
      e.target.classList.contains("delete-btn") ||
      e.target.closest(".delete-btn")
    ) {
      deleteTodo(id);
    }
  }

  function toggleTodoComplete(id) {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    saveTodos();
    renderTodos();
  }

  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
  }

  function setFilter(filter) {
    currentFilter = filter;

    // Update active filter button
    filterBtns.forEach((btn) => {
      if (btn.dataset.filter === filter) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    renderTodos();
  }

  function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    saveTodos();
    renderTodos();
  }

  function renderTodos() {
    // Clear the list
    todoList.innerHTML = "";

    // Filter todos based on current filter
    let filteredTodos = todos;

    if (currentFilter === "active") {
      filteredTodos = todos.filter((todo) => !todo.completed);
    } else if (currentFilter === "completed") {
      filteredTodos = todos.filter((todo) => todo.completed);
    }

    // Sort todos by creation date (newest first)
    filteredTodos.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Render filtered todos
    if (filteredTodos.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.className = "empty-message";
      emptyMessage.textContent = "No tasks found";
      emptyMessage.style.textAlign = "center";
      emptyMessage.style.padding = "20px";
      emptyMessage.style.color = "#aaa";
      todoList.appendChild(emptyMessage);
      return;
    }

    filteredTodos.forEach((todo) => {
      const todoItem = document.createElement("li");
      todoItem.className = `todo-item ${todo.completed ? "completed" : ""}`;
      todoItem.dataset.id = todo.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.checked = todo.completed;

      const todoText = document.createElement("span");
      todoText.className = "todo-text";
      todoText.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

      todoItem.appendChild(checkbox);
      todoItem.appendChild(todoText);
      todoItem.appendChild(deleteBtn);

      todoList.appendChild(todoItem);
    });
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
});
