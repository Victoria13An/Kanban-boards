// src/components/UserSelector.jsx
import React from "react";
import "./UserSelector.css";

const USERS = [
	{ id: "user1", name: "Vova", initials: "V", color: "#F54927" },
	{ id: "user2", name: "Lola", initials: "L", color: "#E075D0" },
	{ id: "user3", name: "Oleg", initials: "O", color: "#2cb494" },
];

function UserSelector({ onSelectUser, selectedUserId }) {
	return (
		<div className="users-horizontal">
			{USERS.map((user) => (
				<div
					key={user.id}
					className="user-card"
					onClick={() => onSelectUser?.(user)}
				>
					<div
						className="user-avatar"
						style={{ backgroundColor: user.color }}
					>
						{user.initials}
					</div>
					<div className="user-name">{user.name}</div>
				</div>
			))}
		</div>
	);
}

export default UserSelector;
