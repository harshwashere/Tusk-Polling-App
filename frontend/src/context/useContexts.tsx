import { useContext } from "react";
import { UserContext } from "./userContext";

const useContexts = () => {
    const authContextValue = useContext(UserContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
};

export default useContexts