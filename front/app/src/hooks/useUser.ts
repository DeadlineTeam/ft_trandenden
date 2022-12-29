import { useContext } from "react";
import { UserContext } from "../components/ProtectedLayout";

export default function useUserContext () {
	const user = useContext(UserContext);
	return user;
}
