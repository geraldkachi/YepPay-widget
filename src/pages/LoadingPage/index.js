// import React from 'react';
// import Spinner from '../../components/Spinner';

// const LoadingPage = () => (
// 	<div style={{height: '100%'}} className="h-full md:w-full flex justify-center items-center absolute top-1/2">
// 		<div className="flex mt-20 justify-center">
// 			<Spinner height="50" width="50" colour="#0066FF" />
// 		</div>
// 	</div>
// );

// export default LoadingPage;

import React from 'react';
import Spinner from '../../components/Spinner';

const LoadingPage = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <Spinner height="50" width="50" colour="#0066FF" />
  </div>
);

export default LoadingPage;