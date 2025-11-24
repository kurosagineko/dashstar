import './CSS/carouselbanner.css';
import placeholderImage from '../assets/programming-1857236_1280.jpg';

export default function CarouselBanner() {
	return (
		<div className='carousel'>
			<img
				src={placeholderImage}
				alt='placeholder'
			/>
		</div>
	);
}
