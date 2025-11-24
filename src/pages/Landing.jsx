// Basically the homepage when not logged in, this is where the user can choose to register or login and this gives some information about the app
// users after registering or logging in should be redirected to the dashboard
import LandingHeader from '../components/LandingHeader';
import CarouselBanner from '../components/CarouselBanner';
import './CSS/landing.css';

export default function Landing() {
	return (
		<div className='landing'>
			<LandingHeader />
			<h2 className='tagline'>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
				explicabo?
			</h2>
			<CarouselBanner />
		</div>
	);
}