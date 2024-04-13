import { useShow } from "@refinedev/core";
import {
  DateField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as questionUtils from "./utils";

export const QuestionShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {"ID"}
          </Typography>
          <TextField value={record?._id} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {"Title"}
          </Typography>
          <TextField value={record?.title} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {"Description"}
          </Typography>
          <TextField value={record?.description?.split("\n").map((line: string) => <>{line}<br /></>)} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {"Categories"}
          </Typography>
          {questionUtils.renderCategories(record?.categories)}
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {"Complexity"}
          </Typography>
          {questionUtils.renderComplexity(record?.complexity)}
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {"CreatedAt"}
          </Typography>
          <DateField value={record?.createdAt} />
        </Box>
      </Stack>
    </Show>
  );
};
