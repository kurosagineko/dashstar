import { useState, useEffect } from 'react';
import CardButton from './CardButton';
import './CSS/taskcard.css';

export default function TaskCard({ task_id, title, desc }) {
	const [listForCard, setListForCard] = useState('');

	useEffect(() => {
		console.log('uplift callback:', listForCard);
	}, [listForCard]);

	const cardListSetter = list => {
		setListForCard(list);
	};

	return (
		<div className='task-card'>
			<p className='task-title'>{title}</p>
			<p className='task-desc'>{desc}</p>
			<div className='task-buttons'>
				<CardButton
					task_id={task_id}
					listSetter={cardListSetter}
				/>
			</div>
		</div>
	);
}
