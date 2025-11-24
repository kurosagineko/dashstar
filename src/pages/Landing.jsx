// Basically the homepage when not logged in, this is where the user can choose to register or login and this gives some information about the app
// users after registering or logging in should be redirected to the dashboard
import LandingHeader from '../components/LandingHeader';
import CarouselBanner from '../components/CarouselBanner';
import LandingFooter from '../components/LandingFooter';
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