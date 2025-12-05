import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskList from '../components/TaskList';
import TeamIconButton from '../components/TeamIconButton';
import CreateTaskModal from '../components/CreateTaskModal';
import './CSS/dashboard.css';

import avatarDefault from '../assets/avatardefault.svg';
import burgerMenuIcon from '../assets/BurgerMenuIcon.png';

// show dashboard btn on landing instead of login register if already logged in
// forgot password link
// Add a way to view and restore archived tasks
// task streaks
// show teams of workspace
// show members of team
// metrics
// badges
// achievements
// get stars for leveling up, spend stars in a shop with company added rewards
// change theme

export default function Dashboard() {
	const { user, logout } = useAuth();
	const [level, setLevel] = useState(0);
	const [totalXp, setTotalXp] = useState(0);
	const [nextXp, setNextXp] = useState(0);
	const [xPSession, setXPSession] = useState(0);
	const [username, setUsername] = useState('');
	const [avatar, setAvatar] = useState(avatarDefault);
	const [taskList, setTaskList] = useState([]);
	const [inprogressList, setInprogressList] = useState([]);
	const [completeList, setCompleteList] = useState([]);
	const [currentBoard, setCurrentBoard] = useState('Personal');
	const [showTaskModal, setShowTaskModal] = useState(false);
	const [refreshCounter, setRefreshCounter] = useState(0); // bump this when a change happens in the task lists to trigger the hook

	useEffect(() => {
		console.log('Dashboard', user);
		setLevel(user.level);
		setTotalXp(user.xp);
		setUsername(user.username);
		if (user.avatar_url !== '') setAvatar(user.avatar_url);
	}, []);

	useEffect(() => {
		const abort = new AbortController();

		try {
			fetch(`http://localhost:3002/api/tasks?user_id=${user.id}`, {
				signal: abort.signal,
			})
				.then(res => {
					if (!res.ok) {
						console.log({ error: 'Something went wrong fetching tasks' });
					}
					return res.json();
				})
				.then(data => {
					const openTasks = data.tasks.filter(task => task.status === 'open');
					setTaskList([...openTasks]);

					const inprogressTasks = data.tasks.filter(
						task => task.status === 'inprogress'
					);
					setInprogressList([...inprogressTasks]);

					const completeTasks = data.tasks.filter(
						task => task.status === 'complete'
					);
					setCompleteList([...completeTasks]);
				});
		} catch (error) {
			console.log('Error loading tasks', error);
		}
	}, [refreshCounter]);

	const populateTeamIconButtons = () => {};

	const toggleCreateTaskModal = () => setShowTaskModal(prev => !prev);

	const showCreateNewTeamModal = () => {};

	const switchDashboard = () => {};

	// make reusable
	const TaskListPlaceHolder = () => {
		const placeholderStyle = {
			height: '100%',
			width: '100%',
			color: '#eba8ffff',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '2rem',
			border: '2px solid rgb(76, 0, 57)',
			borderRadius: '20px',
		};
		return (
			<div style={placeholderStyle}>
				<p>No tasks in this list</p>
				{/* Maybe switch for an image here */}
				<p>(～￣▽￣)～</p>
			</div>
		);
	};

	const CreateTaskList = ({ title, list, showCreateBtn }) => {
		return (
			<TaskList
				title={title}
				showCreateBtn={showCreateBtn}
				onClickHandler={toggleCreateTaskModal}
			>
				{list.length !== 0 ? (
					<ul className='task-list dash-bg dash-border dash-shadow'>
						{list.map(task => (
							<li key={task.id}>
								<TaskCard
									status={task.status}
									user_id={user.id}
									task_id={task.id}
									title={task.task_name}
									desc={task.task_desc}
									refreshHandler={setRefreshCounter}
								/>
							</li>
						))}
					</ul>
				) : (
					<TaskListPlaceHolder />
				)}
			</TaskList>
		);
	};

	return (
		<div className='dashboard'>
			<div>
				<div
					className='modal-bg '
					style={showTaskModal ? { display: 'block' } : { display: 'none' }}
					onClick={() => toggleCreateTaskModal()}
				></div>
				<div style={showTaskModal ? { display: 'block' } : { display: 'none' }}>
					<CreateTaskModal
						onClickHandler={toggleCreateTaskModal}
						refreshHandler={setRefreshCounter}
						id={user.id}
					/>
				</div>
			</div>

			<div className='dash-header'>
				<div className='burger-menu'>
					<img
						src={burgerMenuIcon}
						alt='Open menu icon'
					/>
				</div>

				<button onClick={() => logout()}>Logout</button>

				<div className='workspace-label'>
					<h2>{currentBoard}</h2>
				</div>

				<div className='widgets'>
					<div className='level-widget dash-bg dash-border dash-shadow'>
						<div className='current-level'>
							<p>Level: {level}</p>
							<p>Total XP: {totalXp}</p>
						</div>
						<p>XP To Next: {nextXp}</p>
						<p>XP This session: {xPSession}</p>
					</div>

					<Link to='/profile'>
						<div className='profile-widget dash-bg dash-border dash-shadow'>
							<div className='user-info'>
								<p>{username}</p>
							</div>
							<div className='profile-pic-container'>
								<img
									className='profile-pic'
									src={avatar || avatarDefault}
									alt='user profile picture'
								/>
							</div>
						</div>
					</Link>
				</div>
			</div>
			{}

			<div className='dash-main'>
				{/* Add images for buttons here with onClick functionality */}
				<div className='dash-buttons dash-border dash-shadow'>
					<div
						className='team-buttons-alignment'
						style={{ marginBottom: '40px' }}
					>
						<TeamIconButton
							teamName={'Personal'}
							icon='🏠'
						/>
					</div>
					<div className='team-buttons-alignment'>
						<TeamIconButton
							teamName={'Create Team'}
							icon='+'
							fontSize={'2rem'}
							onClickHandler={() => console.log('click')}
						/>
					</div>
					<div className='team-buttons-alignment'>
						<TeamIconButton
							teamName={'Alpha Squad'}
							icon='▶'
						/>
					</div>
					<div className='dash-button dash-bg dash-border dash-shadow'>
						<p>■</p>
					</div>
					<div className='dash-button dash-bg dash-border dash-shadow'>
						<p>■</p>
					</div>
				</div>
				{}
				<div className='task-view-container dash-border dash-shadow'>
					<CreateTaskList
						title='Tasks'
						list={taskList}
						showCreateBtn={true}
					/>
					<CreateTaskList
						title='In-progress'
						list={inprogressList}
					/>
					<CreateTaskList
						title='Complete'
						list={completeList}
					/>
				</div>
			</div>
			{/* <div className='metrics-view-container dash-border dash-shadow'></div> */}
		</div>
	);
}
