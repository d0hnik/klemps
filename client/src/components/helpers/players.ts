import { PLAYER_AVATARS } from "../../entities/player";

export const PLAYER_COUNT_OPTIONS = [2, 3, 4, 5, 6, 7];

export function getDefaultAvatarIndex(playerIndex: number) {
  return playerIndex % PLAYER_AVATARS.length;
}

export function getNextAvatarIndex(
  avatarIndex: number,
  direction: "left" | "right",
) {
  if (direction === "left") {
    return avatarIndex === 0 ? PLAYER_AVATARS.length - 1 : avatarIndex - 1;
  }

  return avatarIndex === PLAYER_AVATARS.length - 1 ? 0 : avatarIndex + 1;
}
