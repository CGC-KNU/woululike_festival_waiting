import { useState } from 'react';
import { Home } from './Home';
import { GuestRegister } from './GuestRegister';
import { GuestSuccess } from './GuestSuccess';

export function UserFlow({ addGuest, waitingOnly }) {
  const [page, setPage] = useState('home');
  const [successData, setSuccessData] = useState(null);

  const navigate = (target, data) => {
    if (target === 'success' && data) setSuccessData(data);
    setPage(target);
  };

  return (
    <>
      {page === 'home' && <Home navigate={navigate} />}
      {page === 'register' && (
        <GuestRegister navigate={navigate} addGuest={addGuest} waitingOnly={waitingOnly} />
      )}
      {page === 'success' && (
        <GuestSuccess navigate={navigate} successData={successData} />
      )}
    </>
  );
}
