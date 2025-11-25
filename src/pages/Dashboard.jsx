import { useState, useContext } from 'react';
import './CSS/dashboard.css';

import avatarDefault from '../assets/avatardefault.svg';

export default function Dashboard() {
	const [level, setLevel] = useState(5);
	const [totalXp, settotalXp] = useState(503);
	const [nextXp, setnextXp] = useState(25);
	const [xPSession, setxPSession] = useState(25);
	const [usersName, setusersName] = useState('Eri');
	const [usersSurname, setusersSurname] = useState('Belladonna');

	return (
		<div className='dashboard'>
			<div className='dash-header'>
				<div className='burger-menu'>
					<p>≡</p>
				</div>
				<div className='widgets'>
					<div className='level-widget'>
						<div className='current-level'>
							<p>Level: {level}</p>
							<p>Total XP: {totalXp}</p>
						</div>
						<p>XP To Next: {nextXp}</p>
						<p>XP This session: {xPSession}</p>
					</div>
					<div className='profile-widget'>
						<div className='user-info'>
							<p>{usersName}</p>
							<p>{usersSurname}</p>
						</div>
						<div className='profile-pic'>
							<img
								src={avatarDefault}
								alt=''
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='dash-main'>
				<div className='dash-buttons'>
					<div className='dash-button'>
						<p>■</p>
					</div>
					<div className='dash-button'>
						<p>■</p>
					</div>
					<div className='dash-button'>
						<p>■</p>
					</div>
					<div className='dash-button'>
						<p>■</p>
					</div>
				</div>
				<div className='task-view-container'>
					<div className='assigned-tasks'>
						<p className='list-title'>Tasks</p>
						<ul className='task-list'>
							<li>
								<div className='task-card'>
									<p className='task-title'>task title</p>
									<p className='task-desc'>task description</p>
									<div className='task-buttons'>
										<button className='assign-button btn'>Assign</button>
										<button className='complete-button btn'>Complete</button>
									</div>
								</div>
							</li>
							<li>
								<div className='task-card'>
									<p className='task-title'>task title</p>
									<p className='task-desc'>task description</p>
									<div className='task-buttons'>
										<button className='assign-button btn'>Assign</button>
										<button className='complete-button btn'>Complete</button>
									</div>
								</div>
							</li>
							<li>
								<div className='task-card'>
									<p className='task-title'>task title</p>
									<p className='task-desc'>task description</p>
									<div className='task-buttons'>
										<button className='assign-button btn'>Assign</button>
										<button className='complete-button btn'>Complete</button>
									</div>
								</div>
							</li>
							<li>
								<div className='task-card'>
									<p className='task-title'>task title</p>
									<p className='task-desc'>task description</p>
									<div className='task-buttons'>
										<button className='assign-button btn'>Assign</button>
										<button className='complete-button btn'>Complete</button>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div className='inprogress-tasks'>
						<p className='list-title'>In-progress</p>
						<ul className='task-list'>
							<li>
								<div className='task-card'>
									<p className='task-title'>task title</p>
									<p className='task-desc'>task description</p>
									<div className='task-buttons'>
										<button className='assign-button btn'>Assign</button>
										<button className='complete-button btn'>Complete</button>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div className='complete-tasks'>
						<p className='list-title'>Complete</p>
						<ul className='task-list'>
							<li>
								<div className='task-card'>
									<p className='task-title'>task title</p>
									<p className='task-desc'>task description</p>
									<div className='task-buttons'>
										<button className='assign-button btn'>Assign</button>
										<button className='complete-button btn'>Complete</button>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div className='metrics-view-container'></div>
			</div>
		</div>
	);
}
