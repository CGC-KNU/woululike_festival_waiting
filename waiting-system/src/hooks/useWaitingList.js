import { useState, useEffect } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { db } from '../firebase';

const LIST_REF = 'waitingList';

export function useWaitingList() {
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    const listRef = ref(db, LIST_REF);
    const unsubscribe = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setWaitingList([]);
        return;
      }
      const list = Object.entries(data).map(([firebaseKey, value]) => ({
        ...value,
        firebaseKey,
      }));
      list.sort((a, b) => a.id - b.id);
      setWaitingList(list);
    });

    return () => unsubscribe();
  }, []);

  const addGuest = (guest) => {
    const newGuest = {
      id: Date.now(),
      name: guest.name,
      phone: guest.phone,
      partySize: guest.partySize,
      registeredAt: new Date().toISOString(),
      status: 'waiting',
    };
    push(ref(db, LIST_REF), newGuest);
    return newGuest;
  };

  const callGuest = (id) => {
    const guest = waitingList.find((g) => g.id === id);
    if (!guest) return;
    update(ref(db, `${LIST_REF}/${guest.firebaseKey}`), {
      status: 'called',
      calledAt: new Date().toISOString(),
    });
  };

  const seatGuest = (id) => {
    const guest = waitingList.find((g) => g.id === id);
    if (!guest) return;
    update(ref(db, `${LIST_REF}/${guest.firebaseKey}`), { status: 'seated' });
  };

  const cancelGuest = (id) => {
    const guest = waitingList.find((g) => g.id === id);
    if (!guest) return;
    update(ref(db, `${LIST_REF}/${guest.firebaseKey}`), { status: 'cancelled' });
  };

  const clearAll = () => {
    waitingList.forEach((guest) => {
      update(ref(db, `${LIST_REF}/${guest.firebaseKey}`), { status: 'cancelled' });
    });
  };

  const activeList = waitingList.filter(
    (g) => g.status === 'waiting' || g.status === 'called'
  );
  const waitingOnly = waitingList.filter((g) => g.status === 'waiting');
  const calledOnly = waitingList.filter((g) => g.status === 'called');

  const getPositionById = (id) => {
    const idx = waitingOnly.findIndex((g) => g.id === id);
    return idx === -1 ? null : idx + 1;
  };

  return {
    waitingList,
    activeList,
    waitingOnly,
    calledOnly,
    addGuest,
    callGuest,
    seatGuest,
    cancelGuest,
    clearAll,
    getPositionById,
  };
}
