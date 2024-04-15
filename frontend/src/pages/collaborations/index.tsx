import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useWindowSize } from "react-use";
import { Editor } from "../../components/editor";
import { IUser } from "../../components/layout/types";

export const Collaboration = () => {
  const { data: identity } = useGetIdentity<IUser>();
  const { height: windowHeight } = useWindowSize();
  const [maxPanelHeight, setMaxPanelHeight] = useState<string>("80vh");
  const [minEditorHeight, setMinEditorHeight] = useState<string>("100px");

  useEffect(() => {
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
  }, [windowHeight]);

  return (
    <Grid id="collaboration-container" container spacing={2} height="100%">
      <Grid item xs={6}>
        <Paper elevation={3} sx={{ p: 2, height: "100%", maxHeight: { maxPanelHeight }, overflow: "auto" }}>
          <Stack gap={1}>
            <Typography variant="h6">Problem 1. Reverse a String</Typography>
            <Stack direction="row" gap={1}>
              <Chip label="Easy" color="success" />
              <Chip label="Strings" />
              <Chip label="Algorithms" />
            </Stack>
            <Typography variant="body1">
              Write a function that
              reverses a string. The
              input string is given as
              an array of characters
              s.
              You must do this by
              modifying the input
              array in-place with
              O(1) extra memory.
              Example 1:
              Input: s =
              ["h","e","l","l","o"]
              Output:
              ["o","l","l","e","h"]
              Example 2:
              Input: s =
              ["H","a","n","n","a","
              h"]
              Output:
              ["h","a","n","n","a","
              H"]
              Constraints:
              1 = s.length = 105
              s[i] is a printable ascii
              character.
            </Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper id="collaboration-code-panel" elevation={3} sx={{ p: 2, height: "100%", maxHeight: { maxPanelHeight }, overflow: "auto" }}>
          <Editor id="collaboration-code-editor" username={identity?.username} rootName="default" minHeight={minEditorHeight} />
        </Paper>
      </Grid>
    </Grid>
  );
};
