export default function CardButton({
	status,
	user_id,
	task_id,
	refreshHandler,
}) {
	let buttonLabel = '';
	let buttonStyle = {};
	if (status === 'complete') {
		buttonLabel = 'Archive';
		buttonStyle = { backgroundColor: '#666' };
	} else {
		buttonLabel = status === 'open' ? 'Assign' : 'Complete';
		buttonStyle =
			status === 'open'
				? { backgroundColor: 'rgb(56, 14, 134)' } // assign
				: { backgroundColor: 'rgb(14, 134, 94)' }; // complete
	}

	const handleClick = async () => {
		if (!user_id) {
			console.warn('No user id');
			return;
		}
		if (!task_id) {
			console.warn('No task id');
			return;
		}

		let nextStatus = '';
		switch (status) {
			case 'open':
				nextStatus = 'inprogress';
				break;
			case 'inprogress':
				nextStatus = 'complete';
				break;
			case 'complete':
				nextStatus = 'archive';
		}

		const payload = {
			user_id,
			status: nextStatus,
		};

		try {
			const response = await fetch(
				`http://localhost:3002/api/tasks/${task_id}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) {
				console.log(response.status);
			}

			refreshHandler(c => c + 1);
		} catch (error) {
			console.error('error:', error);
		}
	};

	return (
		<div>
			<button
				className='btn'
				style={buttonStyle}
				onClick={handleClick}
			>
				{buttonLabel}
			</button>
		</div>
	);
}
