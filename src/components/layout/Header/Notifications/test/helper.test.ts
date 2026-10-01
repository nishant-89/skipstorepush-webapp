import {
  canAcceptInvite,
  formatRelativeTime,
  getActorImage,
  getActorInitials,
  getHighlightedMessageParts,
  getNotificationDestination,
  isCollaboratorInvite,
} from "../helper";
import { NOTIFICATION_TYPE, NotificationItem } from "../types";

const base: NotificationItem = {
  id: 1,
  type: NOTIFICATION_TYPE.RELEASE_CREATED,
  title: "Release",
  message: "A release was created",
  appId: 9,
  targetType: "RELEASE",
  targetId: 44,
  payload: { actorName: "Ada Lovelace", appName: "Store" },
  isRead: false,
  readDate: null,
  createdDate: new Date().toISOString(),
};

describe("notification helpers", () => {
  it("routes collaborator invites to the invitation page", () => {
    const item = {
      ...base,
      type: NOTIFICATION_TYPE.COLLABORATOR_INVITED,
      targetType: "COLLABORATOR",
      targetId: 77,
    };
    expect(isCollaboratorInvite(item)).toBe(true);
    expect(getNotificationDestination(item)).toBe("/invitations/77");
  });

  it("routes releases and apps, and skips deleted apps", () => {
    expect(getNotificationDestination(base)).toBe(
      "/all-apps/details/9/release/44"
    );
    expect(
      getNotificationDestination({
        ...base,
        type: NOTIFICATION_TYPE.APP_DELETED,
        targetType: "APP",
        targetId: 9,
      })
    ).toBeNull();
    expect(
      getNotificationDestination({
        ...base,
        appExists: false,
      })
    ).toBeNull();
    expect(
      getNotificationDestination({
        ...base,
        type: NOTIFICATION_TYPE.COLLABORATOR_ACCEPTED,
        targetType: "APP",
        targetId: 9,
        appId: 9,
      })
    ).toBe("/all-apps/details/9");
  });

  it("formats relative time, initials, and actor image", () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe("Just now");
    expect(getActorInitials(base)).toBe("AL");
    expect(formatRelativeTime("not-a-date")).toBe("");
    expect(getActorImage({ ...base, actorProfileImage: "https://cdn/a.png" })).toBe(
      "https://cdn/a.png"
    );
    expect(
      canAcceptInvite({
        ...base,
        type: NOTIFICATION_TYPE.COLLABORATOR_INVITED,
        accepted: true,
      })
    ).toBe(false);
    expect(
      canAcceptInvite({
        ...base,
        type: NOTIFICATION_TYPE.COLLABORATOR_INVITED,
        declined: true,
      })
    ).toBe(false);
    expect(
      canAcceptInvite({
        ...base,
        type: NOTIFICATION_TYPE.COLLABORATOR_INVITED,
      })
    ).toBe(true);
  });

  it("bolds actor and app names inside the stored message", () => {
    const item = {
      ...base,
      actorName: "nishant-89",
      message: "nishant-89 accepted your invite to Owltext",
      payload: { actorName: "nishant-89", appName: "Owltext" },
    };
    expect(getHighlightedMessageParts(item.message, item)).toEqual([
      { text: "nishant-89", highlight: true },
      { text: " accepted your invite to ", highlight: false },
      { text: "Owltext", highlight: true },
    ]);
  });
});
