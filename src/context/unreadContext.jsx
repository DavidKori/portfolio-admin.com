import { createContext } from "react";
import { useState } from "react";

export const UnreadContext = createContext(null);

export function UnreadProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <UnreadContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </UnreadContext.Provider>
  );
}
