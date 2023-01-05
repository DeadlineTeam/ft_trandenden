import "./gameInvite.css"
import axios  from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

type GameInviteNotifProps = {
	UserName: string;
	GameId: string;
}


export function GameInviteNotif (props: GameInviteNotifProps) {
	const [action, setAction] = useState (false);
	const navigate = useNavigate ();

	useEffect (() => {
		return () => {
			if (!action) {
				axios.post (`http://localhost:3001/game/decline/${props.GameId}`, {}, {
					withCredentials: true
				})
			}
		}
	}, [])

	const acceptInvite = (props: GameInviteNotifProps) => {
		setAction (true);
		axios.post (`http://localhost:3001/game/accept/${props.GameId}`, {}, {
			withCredentials: true
		}).then (() => {
			navigate (`/Game?invite=${props.GameId}`);
		}).catch (() => {
			toast (`${props.UserName} quitted the game`)
		})
	}

	const declineInvite = (props: GameInviteNotifProps) => {
		setAction (true);
		axios.post (`http://localhost:3001/game/decline/${props.GameId}`, {}, {
			withCredentials: true
		})
	}

	return (
		<div>
			<p>Game invitation from: {props.UserName}</p>
			<div className="inviteButtons">
				<button onClick={(event) => acceptInvite (props)}>Accept</button>
				<button onClick={(event) => declineInvite (props)}>Decline</button>
			</div>
		</div>
	)
}