// --- DOM Elements ---
const taskInput = document.getElementById('new-task');
const addButton = document.querySelector('.task-form__button');
const incompleteTaskHolder = document.getElementById('incompleteTasks');
const completedTasksHolder = document.getElementById('completed-tasks');

// --- Helper Functions for DOM Creation ---
const createElement = (tag, className = '', attributes = {}) => {
  const element = document.createElement(tag);

  if (className) element.className = className;

  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });

  return element;
};

const createDeleteButton = () => {
  const deleteButton = createElement(
    'button',
    'task-item__button task-item__button--delete',
    { type: 'button' },
  );
  const deleteImg = createElement('img', 'task-item__icon', {
    src: './remove.svg',
    alt: 'Delete',
  });

  deleteButton.append(deleteImg);

  return deleteButton;
};

const createNewTaskElement = (taskString) => {
  const listItem = createElement('li', 'task-item');

  const checkBox = createElement('input', 'task-item__checkbox', {
    type: 'checkbox',
  });
  const label = createElement('label', 'task-item__label');
  label.textContent = taskString;

  const editInput = createElement('input', 'task-item__input', {
    type: 'text',
  });

  const editButton = createElement(
    'button',
    'task-item__button task-item__button--edit',
    {
      type: 'button',
      textContent: 'Edit',
    },
  );

  const deleteButton = createDeleteButton();

  listItem.append(checkBox, label, editInput, editButton, deleteButton);

  return listItem;
};

// --- Task Business Logic ---
const addTask = (event) => {
  event?.preventDefault();
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const listItem = createNewTaskElement(taskText);

  incompleteTaskHolder.append(listItem);
  bindTaskEvents(listItem, taskCompleted);

  taskInput.value = '';
};

const toggleEditMode = (listItem, label, editInput, editButton) => {
  const isEditing = listItem.classList.contains('task-item--edit');

  if (isEditing) {
    label.textContent = editInput.value;
    editButton.textContent = 'Edit';
  } else {
    editInput.value = label.textContent;
    editButton.textContent = 'Save';
  }

  listItem.classList.toggle('task-item--edit');
};

const editTask = (event) => {
  const listItem = event.currentTarget.closest('.task-item');
  const editInput = listItem.querySelector('.task-item__input');
  const label = listItem.querySelector('.task-item__label');
  const editBtn = listItem.querySelector('.task-item__button--edit');

  toggleEditMode(listItem, label, editInput, editBtn);
};

const deleteTask = (event) => {
  const listItem = event.currentTarget.closest('.task-item');
  listItem.remove();
};

const taskCompleted = function () {
  const listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
};

const taskIncomplete = function () {
  const listItem = this.parentNode;
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
};

const ajaxRequest = function () {};
addButton.onclick = addTask;
addButton.addEventListener('click', addTask);
addButton.addEventListener('click', ajaxRequest);

const bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  const checkBox = taskListItem.querySelector('input[type=checkbox]');
  const editButton = taskListItem.querySelector('.task-item__button--edit');
  const deleteButton = taskListItem.querySelector('.task-item__button--delete');

  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};

for (let i = 0; i < incompleteTaskHolder.children.length; i++) {
  bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted);
}

for (let i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}
