import * as Yup from "yup";

export const Modal = {
  deleteTitle: "Delete App?",
  deleteDesc:
    "Are you sure you want to delete this app? This will permanently remove all versions, history, & metadata. This action cannot be undone.",
  inviteTitle: "Invite Collaborator",
  inviteDesc:
    "Enter the email address of the collaborator you’d like to invite to this app. They will receive access to manage releases, view logs, and update settings.",
  deleteCollabTitle: "Are you sure you want to delete this collaborator?",
  deleteCollabDesc: "This action will remove their access permanently.",
};

export const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email address is required."),
});
