import { useCustomMutation, useNavigation, RegisterFormTypes } from "@refinedev/core";
import { AuthPage } from "@refinedev/mui";
import { Title } from "../../components/layout/title";
import { appConfig } from "../../config";

export const Register = () => {
  const { mutate } = useCustomMutation();
  const { push } = useNavigation();

  return <AuthPage
    type="register"
    title={<Title collapsed={false} />}
    formProps={{
      onSubmit: (values: RegisterFormTypes) => {
        mutate({
          url: appConfig.userService.createEndpoint,
          method: "post",
          values: {
            username: values.email,
            email: values.email,
            password: values.password,
          },
          successNotification: () => {
            return {
              message: "User registration successful.",
              description: "Success",
              type: "success",
            };
          },
          errorNotification: () => {
            return {
              message: "User registration failed.",
              description: "Error",
              type: "error",
            };
          },
        }, {
          onSuccess: () => {
            push("/login");
          }
        });
      },
    }}
  />;
};
