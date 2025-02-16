import {
  createContext,
  useState,
  useContext,
  useMemo,
  ReactNode,
  FC,
} from "react";

type UserType = {
  _id?: string; // Optional, so update checks accordingly
  totalPollsVotes?: number;
  totalPollsCreated?: number;
  totalPollsBookmarked?: number;
  username?: string;
  fullname?: string;
  email?: string;
  profileimageUrl?: string;
  bookmarkedPolls: string[];
};


type UserContextType = {
  user: UserType | null;
  updateUser: (userData: UserType) => void;
  clearUser: () => void;
  onPollCreateOrDelete: (type?: "create" | "delete") => void;
  onUserVoted: () => void;
  toggleBookmarkId: (id: string) => void
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

type UserProviderProps = {
  children: ReactNode;
};

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const updateUser = (userData: UserType) => setUser(userData);
  const clearUser = () => setUser(null);

  const updateUserStatus = (key: keyof UserType, value: number) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [key]: value ?? prev[key],
      };
    });
  };

  const onUserVoted = () => {
    const totalPollsVotes = user?.totalPollsVotes || 0;

    updateUserStatus("totalPollsVotes", totalPollsVotes + 1);
  };

  const onPollCreateOrDelete = async (type = "create") => {
    const totalPollsCreated = user?.totalPollsCreated || 0;
    updateUserStatus(
      "totalPollsCreated",
      type == "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
    );
  };

  const toggleBookmarkId = async (id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
    
      const bookmarks = prev.bookmarkedPolls || [];
      const index = bookmarks.indexOf(id);
      const updatedBookmarks = index === -1
        ? [...bookmarks, id]
        : bookmarks.filter((item) => item !== id);
    
      return {
        ...prev,
        bookmarkedPolls: updatedBookmarks,
        totalPollsBookmarked: (prev.totalPollsBookmarked || 0) + (index === -1 ? 1 : -1),
      };
    });
    
  };

  const contextValue = useMemo(
    () => ({
      user,
      updateUser,
      clearUser,
      onPollCreateOrDelete,
      onUserVoted,
      toggleBookmarkId,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
