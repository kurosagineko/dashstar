import CircularText from './CircularText';
import './CSS/loading.css';

export default function Loading() {
	return (
		<div className='loading-container'>
			<CircularText
				text='Loading * Loading * Loading * '
				onHover='speedUp'
				spinDuration={20}
				className='custom-class'
			/>
			<p>Redirecting to dashboard...</p>
			<p>┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻</p>
		</div>
	);
}
