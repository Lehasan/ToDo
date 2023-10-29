'use strict'

import { isMobile } from "./devices.js"

export const toDo = {
	// variables
	navigationElement: document.querySelector('.navigation'),
	listTasksElement: document.querySelector('.list-tasks'),
	popupElement: document.querySelector('.popup'),
	inputElement: document.querySelector('.popup__input'),

	completeTasksButton: document.getElementById('completed-tasks'),
	popupOpenButton: document.getElementById('popup-open'),
	addTaskButton: document.getElementById('add-task'),
	clearInputButton: document.getElementById('clear'),

	tasks: JSON.parse(localStorage.getItem('tasks')),

	// load tasks
	loadTasks() {
		if (!this.tasks) this.tasks = []

		this.tasks.map((taskItem, taskIndex) => {
			const { task, status } = taskItem
			const isTaskCompleted = status === 'completed'

			return this.createTask(task, taskIndex, isTaskCompleted)
		})
	},

	// check tasks length
	checkTasksLength() {
		return !this.tasks?.length
			? this.listTasksElement.dataset.message = 'Task list is empty'
			: this.listTasksElement.dataset.message = ''
	},

	// create task
	createTask(value, id, isTaskCompleted) {
		const taskTemplate = `
		<li class="list-tasks__item" id="${id}">
			<button type="button" class="list-tasks__button ${isTaskCompleted ? '_active' : ''}">${value}</button>
			<button type="button" class="list-tasks__button-delete">+</button>
		</li>`

		return this.listTasksElement.insertAdjacentHTML('beforeend', taskTemplate)
	},

	// show complete tasks
	checkAndShowCompletedTasks() {
		const taskElements = document.querySelectorAll('.list-tasks__button')

		taskElements.forEach(taskItem => {
			const isCompletedButtonActive = this.completeTasksButton.classList.contains('_active'),
				isTaskCompleted = taskItem.classList.contains('_active')

			return !isTaskCompleted && isCompletedButtonActive
				? taskItem.parentElement.classList.add('_hide')
				: taskItem.parentElement.classList.remove('_hide')
		})
	},

	// open and close popup
	togglePopup() {
		const { listTasksElement, popupOpenButton, popupElement } = toDo

		listTasksElement.classList.toggle('_disable')
		popupOpenButton.classList.toggle('_active')
		popupElement.classList.toggle('_show')

		toDo.toggleEventsWhenPopupActive()

		return toDo.clearInputValue()
	},

	// toggle events when popup active
	toggleEventsWhenPopupActive() {
		const isPopupVisible = this.popupElement.classList.contains('_show')

		if (isPopupVisible) {
			if (!isMobile.any()) document.addEventListener('keyup', this.handleKeyupClick)

			this.addTaskButton.addEventListener('click', this.handleAddTaskButtonClick)
			this.clearInputButton.addEventListener('click', this.clearInputValue)

			return
		}

		document.removeEventListener('keyup', this.handleKeyupClick)
		this.addTaskButton.removeEventListener('click', this.handleAddTaskButtonClick)
		this.clearInputButton.removeEventListener('click', this.clearInputValue)
	},

	// clear input value
	clearInputValue() {
		const { inputElement } = toDo

		inputElement.value = null
		return inputElement.focus()
	},

	// set completed task
	completedTask(event) {
		const taskTarget = event.target.closest('.list-tasks__button')

		if (!taskTarget) return

		taskTarget.classList.toggle('_active')

		const taskTargetId = taskTarget.parentElement.id
		const isTaskActive = taskTarget.classList.contains('_active')

		isTaskActive
			? this.tasks[taskTargetId].status = 'completed'
			: this.tasks[taskTargetId].status = 'pending'

		return localStorage.setItem('tasks', JSON.stringify(this.tasks))
	},

	// remove task
	removeTask(event) {
		const deleteButtonTarget = event.target.closest('.list-tasks__button-delete')

		if (!deleteButtonTarget) return

		const taskId = deleteButtonTarget.parentElement.id
		deleteButtonTarget.parentElement.remove()

		this.tasks.splice(taskId, 1)
		localStorage.setItem('tasks', JSON.stringify(this.tasks))

		this.checkTasksLength()

		return this.updateTaskId()
	},

	// update task id
	updateTaskId() {
		const taskElements = document.querySelectorAll('.list-tasks__item')

		taskElements.forEach((taskItem, taskIndex) => {
			return taskItem.id = taskIndex
		})
	},

	// update tasks
	updateTasks() {
		const taskElements = document.querySelectorAll('.list-tasks__button')

		toDo.tasks = []

		taskElements.forEach(taskItem => {
			const { textContent } = taskItem
			const isTaskCompleted = taskItem.classList.contains('_active')

			isTaskCompleted
				? toDo.tasks.push({ task: textContent, status: 'completed' })
				: toDo.tasks.push({ task: textContent, status: 'pending' })
		})

		toDo.updateTaskId()

		return localStorage.setItem('tasks', JSON.stringify(toDo.tasks))
	},

	// switch navigation when on click
	handleNavigationButtonClick(event) {
		const targetNavigation = event.target.closest('.navigation__button')

		if (!targetNavigation) return

		const targetNavigationActive = document.querySelector('.navigation__button._active')
		if (targetNavigationActive) targetNavigationActive.classList.remove('_active')

		targetNavigation.classList.add('_active')

		return toDo.checkAndShowCompletedTasks()
	},

	// add task when on click
	handleAddTaskButtonClick() {
		const { tasks } = toDo,
			{ value } = toDo.inputElement

		if (!value.trim()) return

		toDo.createTask(value, tasks.length)
		toDo.checkAndShowCompletedTasks()
		toDo.togglePopup()

		tasks.push({ task: value, status: 'pending' })

		toDo.checkTasksLength()

		return localStorage.setItem('tasks', JSON.stringify(tasks))
	},

	// task event when on click
	handleTaskClick(event) {
		toDo.completedTask(event)
		toDo.removeTask(event)
	},

	// close popup and add task when on keyup click
	handleKeyupClick(event) {
		switch (event.code) {
			case 'Enter':
				return toDo.handleAddTaskButtonClick()
			case 'Escape':
				return toDo.togglePopup()
		}
	},

	// init handlers
	initEvents() {
		this.navigationElement.addEventListener('click', this.handleNavigationButtonClick)
		this.popupOpenButton.addEventListener('click', this.togglePopup)
		this.listTasksElement.addEventListener('click', this.handleTaskClick)
	},

	// init app function
	init() {
		this.loadTasks()
		this.checkTasksLength()
		this.initEvents()
	}
}

// init app when on load
window.addEventListener('load', toDo.init())