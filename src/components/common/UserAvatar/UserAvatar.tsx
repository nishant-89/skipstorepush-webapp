type UserAvatarProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  iconSize?: number;
};

const hasPhoto = (src?: string | null) =>
  typeof src === "string" && src.trim().length > 0;

const UserPlaceholderMark = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1 12.3333C2.55719 10.6817 4.67134 9.66667 7 9.66667C9.32866 9.66667 11.4428 10.6817 13 12.3333M10 4C10 5.65685 8.65685 7 7 7C5.34315 7 4 5.65685 4 4C4 2.34315 5.34315 1 7 1C8.65685 1 10 2.34315 10 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserAvatar = ({
  src,
  alt = "",
  className = "",
  iconSize = 20,
}: UserAvatarProps) => {
  if (hasPhoto(src)) {
    return <img className={className} src={src as string} alt={alt} />;
  }

  return (
    <span
      className={`${className} isPlaceholder`.trim()}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <UserPlaceholderMark size={iconSize} />
    </span>
  );
};

export default UserAvatar;
