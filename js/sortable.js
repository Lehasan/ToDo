'use strict'

import { isMobile } from "./devices.js"
import { toDo } from "./script.js"

// mobile device check
if (!isMobile.any()) {
	// init sortable
	const sortable = Sortable.create(toDo.listTasksElement, {
		animation: 200,

		// update tasks when on sort
		onUpdate: function () {
			return toDo.updateTasks()
		},
	})
}