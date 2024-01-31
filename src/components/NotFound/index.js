import React from 'react';

export const NotFound = ({ errors }) => {
  return (
    <div className="not_found">
      <h1>NotFound Page {errors}</h1>
      <img src="https://static.thenounproject.com/png/4147383-200.png" />
    </div>
  );
};
