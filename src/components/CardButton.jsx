import { useEffect, useState } from 'react';

import tasks from '../../data/tasks.json';
JSON.stringify(tasks);

export default function CardButton({ task_id, listSetter }) {
	const [list, setList] = useState('task');

	useEffect(() => {
		listSetter(list);
		console.log('list after state change (via useEffect):', list);

		const newData = tasks.map(element => {
			if (element.id === task_id) {
				return { ...element, list: list };
			}
			return element;
		});
		console.log('newData:', newData);
		console.log('taskData', tasks);
	}, [list, listSetter]);

	const ButtonStyle = {
		assign: {
			backgroundColor: 'rgb(56, 14, 134)',
		},
		complete: {
			backgroundColor: 'rgb(14, 134, 94)',
		},
	};

	const handleClick = () => {
		console.log('list before setState:', list);
		setList(prev => (prev === 'task' ? 'inprogress' : 'complete'));
	};

	if (list === 'complete') return null;

	return (
		<div>
			{list !== 'complete' ? (
				<button
					className='btn'
					style={list === 'task' ? ButtonStyle.assign : ButtonStyle.complete}
					onClick={handleClick}
				>
					{list === 'task' ? 'Assign' : 'complete'}
				</button>
			) : (
				<></>
			)}
		</div>
	);
}
