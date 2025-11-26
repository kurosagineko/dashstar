import './CSS/taskcard.css';

export default function TaskCard({ title, desc }) {
	return (
		<div className='task-card'>
			<p className='task-title'>{title}</p>
			<p className='task-desc'>{desc}</p>
			<div className='task-buttons'>
				{/* 
          show assign button when in task list
          hide complete button when in task list
          Show complete button when in in-progress list
          hide assign button when in in-progress list
          hide both buttons when in the complete list
         */}
				<button className='assign-button btn'>Assign</button>
				<button className='complete-button btn'>Complete</button>
			</div>
		</div>
	);
}
