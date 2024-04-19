import { useState, useEffect } from "react";
import { useGetIdentity, useOne } from "@refinedev/core";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useWindowSize } from "react-use";
import { Editor } from "../../components/editor";
import { Loading } from "../../components/loading";
import { IUser } from "../../components/layout/types";
import { appConfig } from "../../config";
import * as questionUtils from "../questions/utils";

export const Collaboration = () => {
  const { id } = useParams();
  const { data: identity } = useGetIdentity<IUser>();
  const { height: windowHeight } = useWindowSize();
  const [maxPanelHeight, setMaxPanelHeight] = useState<string>("80vh");
  const [minEditorHeight, setMinEditorHeight] = useState<string>("100px");

  const routeIdItems = (id ?? "default.").split(".");
  const matchingId = routeIdItems[0];
  const questionId = routeIdItems[1];
  const { data, isLoading, isError } = useOne({ resource: questionId ? "questions" : "", id: questionId });

  const question = data?.data;

  useEffect(() => {
    if (!question) {
      return;
    }

    const appBarElement = document.getElementById("app-bar");
    const containerElement = document.getElementById("collaboration-container");
    const codePanelElement = document.getElementById("collaboration-code-panel");
    const codeEditorElement = document.getElementById("collaboration-code-editor");
    if (!appBarElement || !containerElement || !codePanelElement || !codeEditorElement) {
      throw new Error("Required elements not found!");
    }
    const containerRect = containerElement.getBoundingClientRect();
    const codePanelRect = codePanelElement.getBoundingClientRect();
    const codeEditorRect = codeEditorElement.getBoundingClientRect();
    const containerTopPadding = containerRect.top - appBarElement.offsetHeight;
    const codePanelTopPadding = codePanelRect.top - containerRect.top;
    const codeEditorTopPadding = codeEditorRect.top - codePanelRect.top;
    const maxPanelHeight = windowHeight - appBarElement.offsetHeight - containerTopPadding * 2 - codePanelTopPadding * 2;
    const minEditorHeight = maxPanelHeight - codeEditorTopPadding * 2;
    setMaxPanelHeight(`${Math.max(maxPanelHeight, 100)}px`);
    setMinEditorHeight(`${Math.max(minEditorHeight, 100)}px`);
  }, [windowHeight, question]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return "Error";
  }

  return (
    <Grid id="collaboration-container" container spacing={2} height="100%">
      <Grid item xs={6}>
        <Paper elevation={3} sx={{ p: 2, height: "100%", maxHeight: { maxPanelHeight }, overflow: "auto" }}>
          <Stack gap={1}>
            <Typography variant="h6">Problem: {question?.title}</Typography>
            <Stack direction="row" gap={1}>
              {questionUtils.renderComplexity(question?.complexity)}
              {questionUtils.renderCategories(question?.categories)}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {question?.description?.split("\n").map((line: string, index: number) => <span key={index}>{line}<br /></span>)}
            </Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper id="collaboration-code-panel" elevation={3} sx={{ p: 2, height: "100%", maxHeight: { maxPanelHeight }, overflow: "auto" }}>
          <Editor
            id="collaboration-code-editor"
            serviceUrl={appConfig.collaborationService.yjsWebSocketEndpoint + "?"}
            username={identity?.username}
            rootName={matchingId}
            minHeight={minEditorHeight}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};
