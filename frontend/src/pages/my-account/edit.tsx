import { useGetIdentity, useNavigation } from "@refinedev/core";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import { Edit } from "@refinedev/mui";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as utils from "../../utils";
import { IUser } from "../../components/layout/types";

export const MyAccountEdit = () => {
  const { data: user } = useGetIdentity<IUser>();
  const { push } = useNavigation();
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    formState: { errors },
    watch,
  } = useForm({
    refineCoreProps: user?.email
      ? {
        action: "edit",
        resource: "users",
        id: utils.base64UrlEncode(user.email),
        redirect: false,
        onMutationSuccess: () => {
          push("/my-account");
        }
      }
      : {}
  });

  // Clear password
  if (queryResult?.data?.data) {
    queryResult.data.data.password = "";
  }

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      goBack={""}
      title={
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} underline="hover" color="inherit" to="/my-account" >My Account</Link>
          <Typography color="text.primary">Edit</Typography>
        </Breadcrumbs>
      }
      headerButtonProps={{ display: "none" }}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <input
          {...register("_id")}
          hidden
          name="_id"
        />
        <TextField
          {...register("username", {
            required: "This field is required",
          })}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error={!!(errors as any)?.username}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          helperText={(errors as any)?.username?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Username"}
          name="username"
        />
        <TextField
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error={!!(errors as any)?.email}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          helperText={(errors as any)?.email?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Email"}
          name="email"
        />
        <TextField
          {...register("password", {
            required: "This field is required",
          })}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error={!!(errors as any)?.password}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          helperText={(errors as any)?.password?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="password"
          label={"Password"}
          name="password"
        />
        <TextField
          {...register("confirmPassword", {
            required: "This field is required",
            validate: (val: string) => {
              if (watch("password") !== val) {
                return "Your passwords do no match";
              }
            },
          })}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error={!!(errors as any)?.confirmPassword}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          helperText={(errors as any)?.confirmPassword?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="password"
          label={"Confirm Password"}
          name="confirmPassword"
        />
      </Box>
    </Edit>
  );
};
