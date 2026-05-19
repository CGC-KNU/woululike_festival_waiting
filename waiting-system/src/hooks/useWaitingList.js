import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wouldulike_waiting_list';

export function useWaitingList() {
  const [waitingList, setWaitingList] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(waitingList));
  }, [waitingList]);

  const addGuest = (guest) => {
    const newGuest = {
      id: Date.now(),
      name: guest.name,
      phone: guest.phone,
      partySize: guest.partySize,
      registeredAt: new Date().toISOString(),
      status: 'waiting',
    };
    setWaitingList((prev) => [...prev, newGuest]);
    return newGuest;
  };

  const callGuest = (id) => {
    setWaitingList((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: 'called', calledAt: new Date().toISOString() } : g
      )
    );
  };

  const seatGuest = (id) => {
    setWaitingList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'seated' } : g))
    );
  };

  const cancelGuest = (id) => {
    setWaitingList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'cancelled' } : g))
    );
  };

  const clearAll = () => {
    setWaitingList([]);
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
