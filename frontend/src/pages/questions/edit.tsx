import { useCustom } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { appConfig } from "../../config";
import { Controller } from "react-hook-form";

export const QuestionEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({});
  const record = queryResult?.data?.data;
  console.log(record);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useCustom({
    url: appConfig.questionService.questionCategoriesEndpoint,
    method: "get",
  });
  const categories = categoriesData?.data as string[] ?? [];

  return (
    <Edit isLoading={formLoading || isCategoriesLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("title", {
            required: "This field is required",
          })}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error={!!(errors as any)?.title}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          helperText={(errors as any)?.title?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Title *"}
          name="title"
        />
        <TextField
          {...register("description", {
            required: "This field is required",
          })}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error={!!(errors as any)?.description}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          helperText={(errors as any)?.description?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ resize: "both" }}
          type="text"
          multiline
          rows={20}
          label={"Description *"}
          name="description"
        />
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
              freeSolo
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
                  placeholder="Select or enter a category, then press <Enter>"
                />
              )}
            />
          )}
        />
        <TextField
          {...register("complexity", {
            required: "This field is required",
          })}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error={!!(errors as any)?.complexity}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          helperText={(errors as any)?.complexity?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          select
          label={"Complexity *"}
          value={record?.complexity ?? ""}
          name="complexity"
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </TextField>
      </Box>
    </Edit>
  );
};
