import { useList } from "@refinedev/core";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Layout } from "../../components/layout";
import { Loading } from "../../components/loading";
import * as questionUtils from "../questions/utils";

export const PublicHome = () => {
  const { data, isLoading, isError } = useList({
    resource: "questions",
    pagination: {
      mode: "off",
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return "Error";
  }

  const questions = data?.data;
  const maxDescriptionLength = 200;

  return (
    <Layout>
      <Grid container spacing={2}>
        {
          questions?.map((question, index) => (
            <Grid key={index} item xs="auto">
              <Card sx={{
                width: 290,
                height: "100%",
                minHeight: 290,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <CardContent>
                    <Typography variant="h5">
                      {question.title}
                    </Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {questionUtils.renderComplexity(question.complexity)}
                      {questionUtils.renderCategories(question.categories)}
                    </Stack>
                    <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
                      {
                        question.description.length > maxDescriptionLength
                          ? question.description.substring(0, maxDescriptionLength - 1) + "…"
                          : question.description
                      }
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button component={RouterLink} to={`/question/${question._id}`} size="small" sx={{ textTransform: "none" }}>
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </Layout>
  );
};
