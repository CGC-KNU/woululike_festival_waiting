import { Routes, Route } from 'react-router-dom';
import './index.css';
import { StarBackground } from './components/StarBackground';
import { useWaitingList } from './hooks/useWaitingList';
import { UserFlow } from './pages/UserFlow';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const {
    waitingList,
    waitingOnly,
    calledOnly,
    addGuest,
    callGuest,
    seatGuest,
    cancelGuest,
    clearAll,
  } = useWaitingList();

  return (
    <>
      <StarBackground />
      <Routes>
        <Route
          path="/"
          element={
            <UserFlow addGuest={addGuest} waitingOnly={waitingOnly} />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminDashboard
              waitingList={waitingList}
              waitingOnly={waitingOnly}
              calledOnly={calledOnly}
              callGuest={callGuest}
              seatGuest={seatGuest}
              cancelGuest={cancelGuest}
              clearAll={clearAll}
            />
          }
        />
      </Routes>
    </>
  );
}
