import React, { useState, useEffect } from "react";
import { useGetIdentity, useOne } from "@refinedev/core";
import { useParams } from "react-router-dom";
import * as Y from 'yjs'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ShareIcon from '@mui/icons-material/Share';
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useWindowSize } from "react-use";
import { Editor } from "../../components/editor";
import { Loading } from "../../components/loading";
import { IUser } from "../../components/layout/types";
import { appConfig } from "../../config";
import * as questionUtils from "../questions/utils";

const contentTemplate = `
// JavaScript

/**
 * Description of the function.
 * @param {any[]} args - Description of the arguments
 * @return {any} Description of the return value
 */
function functionName(...args) {
  // Your code here
  return "Hello World";
}

/* Test cases */
const test1Input = [];
console.log("Test Case 1:", functionName(...test1Input));

const test2Input = [];
console.log("Test Case 2:", functionName(...test2Input));
`;

const runCode = (code: string) => {
  const outputLines: string[] = [];
  console.log = (...args) => {
    outputLines.push(args.join(" "));
  }
  eval(`'use strict'; ${code}`);
  return outputLines;
};

type ShareDialogProps = {
  onClose: () => void;
};

type OutputDialogProps = {
  ytext: Y.Text;
  onClose: () => void;
};

const ShareDialog: React.FC<ShareDialogProps> = ({
  onClose,
}) => {
  const [isCopied, setCopied] = useState(false);

  const collaborationUrl = location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(collaborationUrl);
    setCopied(true);
  };

  return (
    <Dialog
      fullWidth
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Share"}
      </DialogTitle>
      <DialogContent>
          <Typography>
            Share your collaboration at this URL:
          </Typography>
          <TextField
            variant="standard"
            value={collaborationUrl}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
        />
      </DialogContent>
      <DialogActions>
        <Button startIcon={isCopied ? <CheckIcon /> : null} onClick={handleCopy}>
          {isCopied ? "Copied" : "Copy"}
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog >
  )
};

const OutputDialog: React.FC<OutputDialogProps> = ({
  ytext,
  onClose,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let output: { result?: string[], error?: any };
  try {
    const result = runCode(ytext.toString());
    output = { result };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    output = { error };
  }

  return (
    <Dialog
      fullWidth
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Output"}
      </DialogTitle>
      <DialogContent>
        <Typography {... (output.error ? { color: "error" } : {})}>
          {output.result?.map((line, index) => <span key={index}>{line}<br /></span>) ?? output.error?.toString()}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog >
  )
};

export const Collaboration = () => {
  const { id } = useParams();
  const { data: identity } = useGetIdentity<IUser>();
  const { height: windowHeight } = useWindowSize();
  const [maxPanelHeight, setMaxPanelHeight] = useState<string>("80vh");
  const [minEditorHeight, setMinEditorHeight] = useState<string>("100px");
  const [isShareDialogOpen, setShareDialogOpen] = useState(false);
  const [isOutputDialogOpen, setOutputDialogOpen] = useState(false);

  const routeIdItems = (id ?? "default.").split(".");
  const matchingId = routeIdItems[0];
  const questionId = routeIdItems[1];
  const { data, isLoading, isError } = useOne({ resource: questionId ? "questions" : "", id: questionId });

  const ydoc = new Y.Doc();
  const ytext = ydoc.getText("codemirror");
  const question = data?.data;

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleRun = () => {
    setOutputDialogOpen(true);
  };

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
    <Box>
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
              ytext={ytext}
              defaultValue={contentTemplate.trim()}
              minHeight={minEditorHeight}
            />
          </Paper>
        </Grid>
      </Grid>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<BuildCircleIcon />}
      >
        <SpeedDialAction
          icon={<PlayArrowIcon />}
          tooltipTitle={"Run"}
          onClick={handleRun}
        />
        <SpeedDialAction
          icon={<ShareIcon />}
          tooltipTitle={"Share"}
          onClick={handleShare}
        />
      </SpeedDial>
      {isShareDialogOpen && <ShareDialog onClose={() => setShareDialogOpen(false)} />}
      {isOutputDialogOpen && <OutputDialog ytext={ytext} onClose={() => setOutputDialogOpen(false)} />}
    </Box>
  );
};
