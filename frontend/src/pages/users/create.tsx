import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

export const UserCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
    watch,
  } = useForm({});

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
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
    </Create>
  );
};
