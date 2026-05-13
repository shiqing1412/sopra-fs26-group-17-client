"use client";

import React from "react";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";
import { getAvatarColor, getAvatarInitial } from "@/utils/avatarColors";

interface OnlineStatusProps {
  currentUser?: User | null;
  onlineUsernames?: string[]; 
  allMembers: string[];
}

const MemberOnlineStatus: React.FC<OnlineStatusProps> = ({ 
  currentUser,
  onlineUsernames = [], 
  allMembers,
}) => {
  const displayMax = 5;
  // online members excluding current user
  const onlineMembers = allMembers.filter(
    (username) => onlineUsernames.includes(username)
  );
  const onlineCount = onlineMembers.length;
  if (onlineCount === 0) return null;
  const shownAvatars = onlineMembers.slice(0, displayMax);
  const overflowCount = onlineCount - shownAvatars.length;

  return (
    <div className={styles.onlineStatusContainer}>
      
      {/* online badge and text */}
      <div className={styles.onlineBadgeWrapper}>
        <span className={styles.onlineDot}></span>
        <span className={styles.onlineStatusText}>
          {onlineCount} online
        </span>
      </div>

      {/* overlapping avatars */}
      <div className={styles.avatarStack}>
        {shownAvatars.map((username) => {
          return (
            <div
              key={username}
              className={styles.avatar}
              style={{ background: getAvatarColor(username ?? null) }}
              title={username}
            >
              {getAvatarInitial(username)}
            </div>
          );
        })}
        
        {/* +N avatar bubbles */}
        {overflowCount > 0 && (
          <div 
            className={`${styles.avatar} ${styles.avatarOverflow}`}
            title={`+ ${overflowCount}`}
          >
            +{overflowCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberOnlineStatus;
