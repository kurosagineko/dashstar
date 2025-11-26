import { useState, useMemo, Children } from 'react';
import { CardListContext } from './AppContext';

export default function CardListProvider({ children }) {
	const [list, setList] = useState('task');

	const changeList = () => {
		setList(last => (last === 'task' ? 'inprogress' : 'complete'));
	};

	const value = useMemo(() => ({ list, changeList }), [list]);

	return (
		<CardListContext.Provider value={value}>
			{children}
		</CardListContext.Provider>
	);
}
