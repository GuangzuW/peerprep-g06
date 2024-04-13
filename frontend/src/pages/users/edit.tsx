import { useCustomMutation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Edit } from "@refinedev/mui";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import { appConfig } from "../../config";

export const UserEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    formState: { errors },
    watch,
  } = useForm({});
  const { mutate } = useCustomMutation();

  const record = queryResult?.data?.data;

  // Clear password
  if (record) {
    record.password = "";
  }

  const isGrantAdminPrivilegeButtonVisible = record && !record.isAdmin;
  const grantAdminPrivilegeButtonProps = {
    ...(queryResult?.isLoading ? { disabled: true } : {}),
    startIcon: <AddModeratorIcon />,
    onClick: () => {
      mutate({
        url: appConfig.userService.updatePrivilegeEndpoint,
        method: "patch",
        values: {
          email: record?.email,
          isAdmin: true,
        },
        successNotification: () => {
          return {
            message: "Update successful.",
            description: "Success",
            type: "success",
          };
        },
      }, {
        onSuccess: () => {
          queryResult?.refetch();
        },
      });
    }
  };
  const GrantAdminPrivilegeButton = (props: ButtonProps) => {
    return <Button {...props}>Grant Admin Privilege</Button>;
  }

  const isRevokeAdminPrivilegeButtonVisible = record && record.isAdmin;
  const revokeAdminPrivilegeButtonProps = {
    ...(queryResult?.isLoading ? { disabled: true } : {}),
    startIcon: <RemoveModeratorIcon />,
    onClick: () => {
      mutate({
        url: appConfig.userService.updatePrivilegeEndpoint,
        method: "patch",
        values: {
          email: record?.email,
          isAdmin: false,
        },
        successNotification: () => {
          return {
            message: "Update successful.",
            description: "Success",
            type: "success",
          };
        },
      }, {
        onSuccess: () => {
          queryResult?.refetch();
        },
      });
    }
  };
  const RevokeAdminPrivilegeButton = (props: ButtonProps) => {
    return <Button color="error" {...props}>Revoke Admin Privilege</Button>;
  }

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {isGrantAdminPrivilegeButtonVisible && <GrantAdminPrivilegeButton {...grantAdminPrivilegeButtonProps} />}
          {isRevokeAdminPrivilegeButtonVisible && <RevokeAdminPrivilegeButton {...revokeAdminPrivilegeButtonProps} />}
          {defaultButtons}
        </>
      )}>
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
          label={"Username *"}
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
          label={"Email *"}
          name="email"
        />
        <TextField
          {...register("isAdmin")}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          disabled
          label={"Admin"}
          name="isAdmin"
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
          label={"Password *"}
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
          label={"Confirm Password *"}
          name="confirmPassword"
        />
      </Box>
    </Edit>
  );
};
