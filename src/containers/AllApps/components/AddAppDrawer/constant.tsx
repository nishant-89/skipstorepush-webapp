import * as Yup from "yup";

export interface FormValues {
  name: string;
  platform: string;
}

export interface AppResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    name: string;
    ownerId: string;
    osType: string;
    appIcon: string;
    id: string;
    status: string;
    createdDate: string;
    updatedDate: string;
  };
  error: Record<string, unknown>;
}

export const initialValues: FormValues = {
  name: "",
  platform: "ANDROID",
};

// Yup validation schema using the custom function
export const validationSchema = Yup.object({
  name: Yup.string()
    .required("App Name is required")
    .min(2, "App name must be at least 2 characters long")
    .max(50, "App Name should not exceed 50 characters.")
    .matches(
      /^[a-zA-Z0-9 _\-!@]+$/,
      "Only letters, numbers, spaces, and the characters - _ ! @ are allowed"
    ),
});
