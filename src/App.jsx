import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Landing from './pages/Landing';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={<Landing />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App
