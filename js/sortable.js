import { toDo } from "./script.js"

// init sortable
const sortable = Sortable.create(toDo.listTasksElement, {
	animation: 200,

	// update tasks when on sort
	onUpdate: function () {
		return toDo.updateTasks()
	},
})