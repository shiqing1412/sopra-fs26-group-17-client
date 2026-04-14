"use client";

import React, { useState } from "react";
import { Trip } from "@/types/trip";
import { User } from "@/types/user";
import styles from "@/styles/trips.module.css";

const AVATAR_COLORS = ["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#d35400", "#16a085"];

interface OnlineStatusProps {
  trip: Trip | null;
  currentUser?: User | null;
  onlineUsernames?: string[]; 
  allMembers: string[];
  maxAvatars?: number; 
}

const MemberOnlineStatus: React.FC<OnlineStatusProps> = ({ 
  trip, 
  currentUser,
  onlineUsernames = [], 
  allMembers,
  maxAvatars 
}) => {
  const [isLoading] = useState<boolean>(true);

  if (isLoading) return null;

  const displayMax = 5;
  // online members excluding current user
  const onlineMembers = allMembers.filter(
    (username) => onlineUsernames.includes(username) && username !== currentUser?.username
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
          const colorIndex = allMembers.indexOf(username);
          const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
          const initials = username.substring(0, 2).toUpperCase();

          return (
            <div
              key={username}
              className={styles.avatar}
              style={{ backgroundColor: color }}
              title={username}
            >
              {initials}
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
