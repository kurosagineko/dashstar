import LandingHeader from '../components/LandingHeader';
import CarouselBanner from '../components/CarouselBanner';
import LandingFooter from '../components/LandingFooter';
import FeatureSection from '../components/FeatureSection';
import './CSS/landing.css';

const features = [
	{
		name: 'Manage your workflow.',
		description: 'Tasks created by admins, direct to your board.',
		icon: 'o',
	},
	{
		name: 'Earn XP, Level up. Win.',
		description:
			'Complete tasks to earn xp, compete with your team or against other teams, work with goals.',
		icon: 'o',
	},
	{
		name: 'Database backups.',
		description:
			'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
		icon: 'o',
	},
];

export default function Landing() {
	return (
		<div className='landing'>
			<LandingHeader />
			<h2 className='tagline'>Free, fun and intuitive task management</h2>
			<FeatureSection features={features} />
			<CarouselBanner />
			<p className='pitch'>
				Selling Pitch here. Lorem ipsum, dolor sit amet consectetur adipisicing
				elit. Inventore, dolores odit, magnam ab molestias, tempore fugiat ut
				debitis iure deleniti voluptate natus quaerat laudantium modi velit
				quasi quo molestiae qui deserunt! Voluptates numquam tempora, itaque
				necessitatibus iusto velit ullam cum dolor ut delectus assumenda non
				natus doloribus ab alias in adipisci corporis commodi minus libero!
				Recusandae voluptatem eligendi quae repellendus. Magni commodi, iure
				maxime laborum aut eveniet, quisquam ratione ullam voluptatem possimus
				sequi cum neque nisi veritatis, fugiat soluta minus ea earum. Temporibus
				voluptate recusandae consectetur delectus provident! Porro perspiciatis
				doloremque minus. Nisi vero est qui beatae velit in atque?
			</p>
			<div className='functionality'>
				<div>
					<p>Some functionality here</p>
					<ul>
						<li>Lorem ipsum dolor sit amet.</li>
						<li>Lorem ipsum dolor sit amet.</li>
						<li>Lorem ipsum dolor sit amet.</li>
						<li>Lorem ipsum dolor sit amet.</li>
					</ul>
				</div>
				<div>
					<p>Some functionality here</p>
					<ul>
						<li>Lorem ipsum dolor sit amet.</li>
						<li>Lorem ipsum dolor sit amet.</li>
						<li>Lorem ipsum dolor sit amet.</li>
						<li>Lorem ipsum dolor sit amet.</li>
					</ul>
				</div>
			</div>
			<LandingFooter />
		</div>
	);
}
