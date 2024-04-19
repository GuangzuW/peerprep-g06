import React, { } from "react";
import { Authenticated, useCustomMutation } from "@refinedev/core";
import {
  useForm as useFormHook,
  SubmitHandler as HookSubmitHandler,
  Controller,
} from "react-hook-form"
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { appConfig } from "../../../config";
import { MatchingRequest, MatchingRequestorFormDialogProps, MatchingRequestorFormInputs } from "./types";

export const MatchingRequestorFormDialog: React.FC<MatchingRequestorFormDialogProps> = ({
  categories,
  complexities,
  onSuccess,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormHook<MatchingRequestorFormInputs>()
  const { mutate } = useCustomMutation();

  const handleClose = () => {
    onClose();
  };

  const handleSuccess = (matchingRequest: MatchingRequest) => {
    onSuccess && onSuccess(matchingRequest);
    onClose();
  };

  const onSubmit: HookSubmitHandler<MatchingRequestorFormInputs> = (data) => {
    const matchingRequest = {
      ...data,
      requestedAt: new Date()
    };
    mutate({
      url: appConfig.matchingService.requestEndpoint,
      method: "post",
      values: matchingRequest,
      successNotification: () => {
        return {
          message: "Request sent.",
          description: "Success",
          type: "success",
        };
      },
      errorNotification: (data) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          message: (data?.message as any).message ?? "Request failed.",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: (data?.message as any)?.error ?? "Error",
          type: "error",
        };
      },
    }, {
      onSuccess: () => handleSuccess(matchingRequest),
    });
  };

  return (
    <Authenticated key="matching-form-dialog">
      <Dialog
        fullWidth
        open={true}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit(onSubmit),
        }}
      >
        <DialogTitle>Request a match</DialogTitle>
        <DialogContent>
          <Controller
            control={control}
            name={"categories"}
            rules={{ required: "This field is required" }}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={categories}
                onChange={(_, value) => {
                  field.onChange(value);
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    error={!!(errors as any)?.categories}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    helperText={(errors as any)?.categories?.message}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    label="Categories *"
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name={"complexities"}
            rules={{ required: "This field is required" }}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={complexities}
                onChange={(_, value) => {
                  field.onChange(value);
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    error={!!(errors as any)?.complexities}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    helperText={(errors as any)?.complexities?.message}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    label="Complexities *"
                  />
                )}
              />
            )}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Authenticated>
  );
};
