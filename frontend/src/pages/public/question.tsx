import { useOne } from "@refinedev/core";
import { useParams, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Layout } from "../../components/layout";
import { Loading } from "../../components/loading";
import * as questionUtils from "../questions/utils";

export const PublicQuestion = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useOne({ resource: "questions", id });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return "Error";
  }

  const record = data?.data;

  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} underline="hover" color="inherit" to="/" >Questions</Link>
        <Typography color="text.primary">View</Typography>
      </Breadcrumbs>
      <Paper elevation={2} sx={{ my: 2, p: 2 }}>
        <Stack gap={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {record?.title}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {"Complexity"}
            </Typography>
            {questionUtils.renderComplexity(record?.complexity)}
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {"Categories"}
            </Typography>
            {questionUtils.renderCategories(record?.categories)}
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {"Description"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {record?.description?.split("\n").map((line: string, index: number) => <span key={index}>{line}<br /></span>)}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Layout>
  );
};
