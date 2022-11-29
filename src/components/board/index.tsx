import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';

export default function Board() {
  const { token } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.main);
  const { _id } = useParams();

  if (!token) {
    return <Navigate to="/welcome" />;
  }

  const board = boards.find((board) => board._id === _id);

  return (
    <>
      <main className="light-bg-brand main-padding">
        <div>Board-{_id}</div>
        <p>{board?.title}</p>
        <p>{board?.description}</p>
        <p>{board?.owner}</p>
      </main>
    </>
  );
}
