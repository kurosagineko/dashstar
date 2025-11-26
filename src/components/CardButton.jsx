import { useContext, useEffect } from 'react';
import { CardListContext } from '../context/AppContext';

export default function CardButton({ listSetter }) {
	const ctx = useContext(CardListContext);
	const { list, changeList } = ctx;

	useEffect(() => {
		onListChange();
	});

	const ButtonStyle = {
		assign: {
			backgroundColor: 'rgb(56, 14, 134)',
		},
		complete: {
			backgroundColor: 'rgb(14, 134, 94)',
		},
	};

	const onListChange = () => {
		listSetter(list);
	};

	return (
		<div>
			{list !== 'complete' ? (
				<button
					className='btn'
					style={list === 'task' ? ButtonStyle.assign : ButtonStyle.complete}
					onClick={() => {
						changeList();
						onListChange();
					}}
				>
					{list === 'task' ? 'Assign' : 'complete'}
				</button>
			) : (
				<></>
			)}
		</div>
	);
}
