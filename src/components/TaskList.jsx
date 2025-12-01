import './CSS/tasklist.css';

export default function TaskList({ children, title, showCreateBtn }) {
	return (
		<div>
			<div className='list-header'>
				<p className='list-title'>{title}</p>
				{showCreateBtn && <button className='create-task-btn'>Create</button>}
			</div>

			<div className='scroll-area'>
				<div className='list-wrapper'>{children}</div>
			</div>
		</div>
	);
}
