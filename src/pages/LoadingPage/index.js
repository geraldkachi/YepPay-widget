import React from 'react';
import Spinner from '../../components/Spinner';

const LoadingPage = () => (
	<div className="h-full md:w-full flex justify-center items-center absolute top-1/2">
		<div className="flex mt-20 justify-center">
			<Spinner height="50" width="50" colour="#0066FF" />
		</div>
	</div>
);

export default LoadingPage;
