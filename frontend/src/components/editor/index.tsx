import { useRef, useEffect, useContext } from "react";
import * as Y from 'yjs'
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript'
import * as random from 'lib0/random'
import { ColorModeContext } from "../../contexts/color-mode";

type EditorProps = {
  id?: string;
  username?: string;
  rootName: string;
  minHeight: string;
};

const usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' }
];

const userColor = usercolors[random.uint32() % usercolors.length];

export const Editor: React.FC<EditorProps> = ({
  id,
  username = 'Anonymous ' + Math.floor(Math.random() * 100),
  rootName,
  minHeight,
}) => {
  const { mode } = useContext(ColorModeContext);
  const editor = useRef(null);

  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider(
    `ws${location.protocol.slice(4)}//${location.hostname}:3004/ws/yjs?`,
    rootName,
    ydoc,
  );
  const ytext = ydoc.getText('codemirror');

  provider.awareness.setLocalStateField('user', {
    name: username,
    color: userColor.color,
    colorLight: userColor.light
  });

  const customTheme = EditorView.theme({
    ".cm-content": {
      padding: "1em 0", // https://github.com/yjs/y-codemirror.next/issues/24
      minHeight,
    },
  });

  const state = EditorState.create({
    doc: ytext.toString(),
    extensions: [
      keymap.of([
        ...yUndoManagerKeymap
      ]),
      basicSetup,
      javascript(),
      yCollab(ytext, provider.awareness),
      ...(mode === "dark" ? [oneDark] : []),
      customTheme,
    ]
  });

  useEffect(() => {
    const view = new EditorView({ state, parent: editor.current ?? undefined });

    return () => {
      // provider.destroy();
      view.destroy();
    };
  });

  return (
    <div {...(id && { id })} ref={editor} />
  );
};
