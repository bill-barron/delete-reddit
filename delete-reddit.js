/**
 * Usage: 
 * 	1. Open up your reddit user profile and switch over to the comments tab to exclude your posts.
 * 	2. Then paste this code into your browser console and hit enter.
 * 
 * 	It will simulate all the user clicks you would do if you were deleting your comments manually.
 */
(function () {
	/**
	 * Gets the options button of the first comment on the page
	 */
	function getOptionsButton() {
		return document.querySelector('[aria-label="more options"]');
	}
	
	/**
	 * Gets the delete button within the comment options menu
	 */
	function getDeleteButton() {
		return document.querySelector('div[role~="menu"][style~="left:"] > button:last-child');
	}
	
	/**
	 * Gets the confirm delete button of the modal that appears when deleting a comment
	 */
	function getConfirmDeleteButton() {
		return document.querySelector('div[aria-modal="true"] button:nth-child(2)');
	}
	
	/**
	 * This will click the ""..."" options button next to the current comment
	 */
	function getOptions() {
		return new Promise((resolve, reject) => {
			var optionsButton = getOptionsButton();
			if(optionsButton === null) {
				reject("No options button");
			} else {
				optionsButton.click();
				window.setTimeout(() => {
					resolve(optionsButton);
				}, 100);
			}
		});
	}
	
	/**
	 * This will click the delete option from the comment options menu.
	 */
	function deletePost() {
		return new Promise((resolve, reject) => {
			var deleteButton = getDeleteButton();
			if(deleteButton === null) {
				reject("No delete button");
			} else {
				deleteButton.click();
				window.setTimeout(() => {
					resolve(deleteButton);
				}, 600);
			}
		});
	}
	
	/**
	 * This will click the confirm delete button in the modal that appears when you try to delete a comment.
	 */
	function confirmDelete() {
		return new Promise((resolve, reject) => {
			var confirmButton = getConfirmDeleteButton();
			if(confirmButton === null) {
				reject("No confirm delete button");
			} else {
				confirmButton.click();
				window.setTimeout(() => {
					resolve(confirmButton);
				}, 900);
			}
		});
	}
	
	/**
	 * Gets the state of the page in order to know what action to take next
	 */
	function getState() {
		if(getConfirmDeleteButton() !== null) {
			return "modal";
		}
		
		if (getDeleteButton() !== null) {
			return "options";
		}
		
		if (getOptionsButton() !== null) {
			return "initial";
		}
		
		return "done";
	}
	
	/**
	 * Sometimes the delays between each action is off and you get stuck trying to open
	 * the comment options when really the modal is open waiting for you to confirm deletion.
	 * This method takes a step back to see what state you are in and tries to get you back on track.
	 */
	function getUnstuck() {
		window.setTimeout(() => {
			var state = getState();
			
			if(state === "done") {
				console.log("Done.");
				return;
			}
			
			console.log("Getting unstuck from state:", state);
			
			if (state === "modal") {
				confirmDelete().then(doDelete);
				return;
			}
			
			if (state === "options") {
				deletePost().then(confirmDelete).then(doDelete);
				return;
			}
			
			if (state === "initial") {
				doDelete();
			}
		}, 500);
	}
	
	/**
	 * This is the main loop that controls the comment deletion process.
	 */
	function doDelete() {
		getOptions()
			.then(deletePost)
			.then(confirmDelete)
			.then(() => {
				// Everything went ok, repeat the process
				setTimeout(doDelete, 500);
		}).catch(() => {
			// something went wrong. Try to detect current state and get unstuck
			getUnstuck();
		});
	}

	doDelete();
}());