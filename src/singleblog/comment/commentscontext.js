// /src/contexts/CommentsContext.js

import React, { createContext, useContext, useState } from "react";

const CommentsContext = createContext({
  updateTrigger: 0,
  triggerUpdate: () => {},
});

export const useComments = () => useContext(CommentsContext);

export const CommentsProvider = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = () => {
    setUpdateTrigger(Date.now());
  };

  return (
    <CommentsContext.Provider value={{ updateTrigger, triggerUpdate }}>
      {children}
    </CommentsContext.Provider>
  );
};

export default CommentsContext;