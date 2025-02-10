export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const serverUri = "http://localhost:2000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/login",
    REGISTER: "/api/register",
    GET_USER_INFO: "/api/getuser",
    UPDATE_PROFILE: "/api/update",
  },
  POLLS: {
    CREATE: "/poll/create",
    GET_ALL: "/poll/getallpolls",
    GET_BY_ID: (pollId: string) => `/poll/${pollId}`,
    VOTE: (pollId: string) => `/poll/${pollId}/vote`,
    CLOSE: (pollId: string) => `/poll/${pollId}/close`,
    BOOKMARK: (pollId: string) => `/poll/${pollId}/bookmarked`,
    GET_BOOKMARKED: "/poll/user/bookmark",
    VOTED_POLLS: "/poll/votedpoll",
    DELETE: (pollId: string) => `/poll/${pollId}/delete`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/upload-image",
  },
};

export const getInitials = (name: string) => {
  if (!name) return "";

  const words = name.trim().split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const getPollBookmarked = (
  pollId: string,
  userBookmarks: string[] = []
) => {
  return userBookmarks.includes(pollId);
};
