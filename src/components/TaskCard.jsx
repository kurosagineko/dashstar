import { useState, useEffect } from 'react';
import CardButton from './CardButton';
import './CSS/taskcard.css';

export default function TaskCard({
	status,
	user_id,
	task_id,
	title,
	desc,
	refreshHandler,
}) {
	return (
		<div className='task-card'>
			<p className='task-title'>{title}</p>
			<p className='task-desc'>{desc}</p>
			<div className='task-buttons'>
				<CardButton
					status={status}
					user_id={user_id}
					task_id={task_id}
					refreshHandler={refreshHandler}
				/>
			</div>
		</div>
	);
}
