import * as Yup from "yup";
export const initialValues: FormValues = {
  name: "",
};

export interface FormValues {
  name: string;
}

export const validationSchema = Yup.object({
  name: Yup.string()
    .trim("Name is required")
    .strict(true)
    .required("Name is required")
    .max(20, "Max 20 characters allowed"),
});

export interface AddResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    azureEnvId: string;
    key: string;
    appId: string;
    name: string;
    azureAppId: string;
    id: string;
    createdDate: string;
    updatedDate: string;
  };
  error: Record<string, unknown>;
}
