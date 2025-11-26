import { useContext, useState, useEffect } from 'react';
import CardButton from './CardButton';
import CardListProvider from '../context/CardListContextProvider';
import './CSS/taskcard.css';

export default function TaskCard({ title, desc }) {
	const [listForCard, setListForCard] = useState('');

	useEffect(() => {
		console.log(listForCard);
	}, [listForCard]);

	const cardListSetter = list => {
		setListForCard(list);
	};

	return (
		<div className='task-card'>
			<CardListProvider>
				<p className='task-title'>{title}</p>
				<p className='task-desc'>{desc}</p>
				<div className='task-buttons'>
					{/* 
          need context here for;
          show assign button when in task list
          hide complete button when in task list
          Show complete button when in in-progress list
          hide assign button when in in-progress list
          hide both buttons when in the complete list
         */}
					{/* <button className='assign-button btn'>Assign</button>
				<button className='complete-button btn'>Complete</button> */}
					<CardButton listSetter={cardListSetter} />
				</div>
			</CardListProvider>
		</div>
	);
}
