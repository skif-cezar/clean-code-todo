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

const changeTaskStatus = (targetHolder, eventHandler) => {
  return (event) => {
    const listItem = event.currentTarget.closest('.task-item');

    targetHolder.append(listItem);
    bindTaskEvents(listItem, eventHandler);
  };
};

const taskCompleted = changeTaskStatus(completedTasksHolder, (event) =>
  taskIncomplete(event),
);
const taskIncomplete = changeTaskStatus(incompleteTaskHolder, (event) =>
  taskCompleted(event),
);

// --- Event Binding ---
const bindTaskEvents = (taskListItem, checkBoxEventHandler) => {
  const checkBox = taskListItem.querySelector('.task-item__checkbox');
  const editButton = taskListItem.querySelector('.task-item__button--edit');
  const deleteButton = taskListItem.querySelector('.task-item__button--delete');

  // Clear out old listeners by cloning, in order to avoid leaks and duplication
  editButton.replaceWith(editButton.cloneNode(true));
  deleteButton.replaceWith(deleteButton.cloneNode(true));
  checkBox.replaceWith(checkBox.cloneNode(true));

  const freshEditButton = taskListItem.querySelector(
    '.task-item__button--edit',
  );
  const freshDeleteButton = taskListItem.querySelector(
    '.task-item__button--delete',
  );
  const freshCheckBox = taskListItem.querySelector('.task-item__checkbox');

  freshEditButton.addEventListener('click', editTask);
  freshDeleteButton.addEventListener('click', deleteTask);
  freshCheckBox.addEventListener('change', checkBoxEventHandler);
};

// --- Initialization ---
const initApp = () => {
  addButton.addEventListener('click', addTask);

  Array.from(incompleteTaskHolder.children).forEach((item) => {
    bindTaskEvents(item, taskCompleted);
  });

  Array.from(completedTasksHolder.children).forEach((item) => {
    bindTaskEvents(item, taskIncomplete);
  });
};

initApp();
