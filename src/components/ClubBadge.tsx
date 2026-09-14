import React from 'react';
import { PROV_HUE, getClubInitials } from '../data/runningData';

interface ClubBadgeProps {
  name: string;
  prov: string;
  size?: number;
  id?: string;
}

export const ClubBadge: React.FC<ClubBadgeProps> = ({ name, prov, size = 36, id }) => {
  const color = PROV_HUE[prov] || '#e28b37';
  const monogram = getClubInitials(name);

  return (
    <svg
      id={id}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className="shrink-0 select-none"
      role="img"
      aria-label={`${name} badge`}
    >
      <circle cx="20" cy="20" r="19" fill="#242c38" stroke={color} strokeWidth="2" />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontFamily="'Big Shoulders Display', sans-serif"
        fontWeight="700"
        fontSize="15"
        letterSpacing="0.5px"
        fill={color}
      >
        {monogram}
      </text>
    </svg>
  );
};
