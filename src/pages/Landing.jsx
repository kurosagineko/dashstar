import LandingHeader from '../components/LandingHeader';
import CarouselBanner from '../components/CarouselBanner';
import LandingFooter from '../components/LandingFooter';
import FeatureSection from '../components/FeatureSection';
import './CSS/landing.css';

const features = [
	{
		name: 'Manage your workflow.',
		description: 'Tasks created by admins, direct to your board.',
		icon: '◈',
	},
	{
		name: 'Earn XP, Level up. Win.',
		description:
			'Complete tasks to earn xp, compete with your team or against other teams, work with goals.',
		icon: '◈',
	},
	{
		name: 'Database backups.',
		description:
			'Everything is secured on a database, so no need to worry about losing your tasks.',
		icon: '◈',
	},
];

export default function Landing() {
	return (
		<div className='landing'>
			<LandingHeader />
			<h2 className='tagline'>Free, fun and intuitive task management</h2>
			<FeatureSection features={features} />
			<LandingFooter />
		</div>
	);
}
