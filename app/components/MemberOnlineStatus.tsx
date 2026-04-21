"use client";

import React from "react";
import styles from "@/styles/trips.module.css";

const AVATAR_COLORS = ["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#d35400", "#16a085"];

interface OnlineStatusProps {
  allMembers: string[];
  onlineUsernames?: string[];
}

const MemberOnlineStatus: React.FC<OnlineStatusProps> = ({
  allMembers,
  onlineUsernames = [],
}) => {
  const displayMax = 5;

  if (allMembers.length === 0) return null;

  const shownAvatars = allMembers.slice(0, displayMax);
  const overflowCount = allMembers.length - shownAvatars.length;

  return (
    <div className={styles.avatarStack}>
      {shownAvatars.map((username, index) => {
        const isOnline = onlineUsernames.includes(username);
        return (
          <div
            key={username}
            className={styles.avatar}
            style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length], position: "relative" }}
            title={`${username} ${isOnline ? "(online)" : "(offline)"}`}
          >
            {username.substring(0, 2).toUpperCase()}
            {isOnline && (
              <span style={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#2ecc71",
                border: "1.5px solid white",
              }} />
            )}
          </div>
        );
      })}
      {overflowCount > 0 && (
        <div
          className={`${styles.avatar} ${styles.avatarOverflow}`}
          title={`+${overflowCount} more`}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  );
};

export default MemberOnlineStatus;
