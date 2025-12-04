import { useState } from 'react';
import './CSS/createtaskmodal.css';

export default function CreateTaskModal({
	onClickHandler,
	id,
	refreshHandler,
}) {
	const initial = {
		task_name: '',
		task_desc: '',
	};
	const [formData, setFormData] = useState({
		task_name: '',
		task_desc: '',
	});

	const handleOnChange = e => {
		const { name, value } = e.target;
		console.log('value:', value);

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleOnSubmit = async e => {
		e.preventDefault();

		const userId = id;
		if (!userId) {
			console.warn('No id');
			return;
		}

		const payload = JSON.stringify({
			user_id: userId,
			team_name: 'personal',
			...formData,
			status: 'open',
		});

		try {
			const response = await fetch('http://localhost:3002/api/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: payload,
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Server error ${response.status}: ${error}`);
			}

			const data = await response.json();
			console.log('task created', data);

			setFormData(initial);
			onClickHandler();
			refreshHandler(c => c + 1); // refreshes the lists
		} catch (error) {
			console.error('submit failed', error);
		}
	};

	return (
		<div className='task-modal'>
			<div className='modal-header'>
				<h2
					style={{ fontSize: '2rem', textAlign: 'center', marginTop: '3rem' }}
				>
					Create Task
				</h2>
			</div>

			<div>
				<form
					className='new-task-form'
					action='#'
					method='POST'
					onSubmit={handleOnSubmit}
				>
					<div className='form-element'>
						<label htmlFor='task_name'>Task name:</label>
						<input
							className='modal-input'
							type='text'
							id='task_name'
							name='task_name'
							required
							onChange={handleOnChange}
							value={formData.task_name}
						/>
					</div>
					<div className='form-element'>
						<label htmlFor='task_name'>Task Description:</label>
						<textarea
							className='modal-input text-area'
							name='task_desc'
							id='task_desc'
							onChange={handleOnChange}
							value={formData.task_desc}
						></textarea>
					</div>
					<div className='modal-footer'>
						<button
							className='modal-btn'
							onClick={onClickHandler}
						>
							Cancel
						</button>
						<button
							className='modal-btn'
							type='submit'
						>
							Confirm
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
