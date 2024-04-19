import React, { useState, useEffect, useRef } from "react";
import { useCustom, useCustomMutation, useNavigation } from "@refinedev/core";
import { MatchingRequestorLauncher } from "./launcher";
import { MatchingRequestorFormDialog } from "./formDiaglog";
import { MatchingRequestorIndicator } from "./indicator";
import { authProvider } from "../../../authProvider";
import { appConfig } from "../../../config";
import { MatchingRequest, MatchingRequestorStore } from "./types";
import { MatchingNotification } from "./notification";

const MATCHING_REQUEST_KEY = "matching-request";
const maxWaitingTime = 30; // in seconds
const retryTimeWindow = 10; // in seconds
const getAndManageStore = () => {
  const storage = sessionStorage.getItem(MATCHING_REQUEST_KEY);
  if (!storage) {
    return undefined
  }
  const store = JSON.parse(storage) as MatchingRequestorStore;
  store.requestedAt = new Date(store.requestedAt);
  if (store.matchedQuestionId) {
    return store;
  }

  if (new Date().getTime() > store.requestedAt.getTime() + maxWaitingTime * 1000 + retryTimeWindow * 1000) {
    sessionStorage.removeItem(MATCHING_REQUEST_KEY);
    return undefined;
  }
  return store;
};
const getCollaborationId = (store?: MatchingRequestorStore) => {
  return store?.matchingId && store?.matchedQuestionId
    ? `${store.matchingId}.${store.matchedQuestionId}`
    : undefined;
}

export const MatchingRequestor: React.FC = () => {
  const [store, setStore] = useState(() => getAndManageStore());
  const [collaborationId, setCollaborationId] = useState(() => getCollaborationId(store));
  const [launcherVisible, setLauncherVisible] = useState(!collaborationId && !store);
  const [formDialogOpened, setFormDialogOpened] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(!collaborationId && !!store);
  const indicatorCleanerTimerRef = useRef<number | undefined>((undefined));
  const webSocketRef = useRef<WebSocket | undefined>(undefined);

  const { data: categoriesData } = useCustom({
    url: appConfig.questionService.questionCategoriesEndpoint,
    method: "get",
  });
  const { mutate } = useCustomMutation();
  const { push } = useNavigation();

  const saveStore = (store: MatchingRequestorStore) => {
    sessionStorage.setItem(MATCHING_REQUEST_KEY, JSON.stringify(store));
    setCollaborationId(getCollaborationId(store));
    setStore(store);
  };

  const removeStore = () => {
    sessionStorage.removeItem(MATCHING_REQUEST_KEY)
    setCollaborationId(undefined);
    setStore(undefined);
  };

  const startIndicatorCleanerTimer = () => {
    stopIndicatorCleanerTimer();
    indicatorCleanerTimerRef.current = setInterval(() => {
      const store = getAndManageStore();
      if (!store) {
        clearInterval(indicatorCleanerTimerRef.current);
        setIndicatorVisible(false);
        setLauncherVisible(true);
        indicatorCleanerTimerRef.current = undefined;
      }
    }, 1000) as unknown as number;
  };

  const stopIndicatorCleanerTimer = () => {
    const timerId = indicatorCleanerTimerRef.current;
    if (timerId) {
      clearInterval(timerId);
      indicatorCleanerTimerRef.current = undefined;
    }
  };

  const startWebSocket = () => {
    stopWebSocket();
    const webSocket = new WebSocket(appConfig.matchingService.webSocketEndpoint);
    webSocket.onopen = () => {
      const token = authProvider.getToken();
      if (token) {
        webSocket.send(JSON.stringify({
          event: "auth",
          data: token,
        }));
      }

    }
    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "request-matched" && store) {
        store.matchingId = message.data.matchingId;
        store.matchedQuestionId = message.data.questionId;
        saveStore(store);
        setLauncherVisible(false);
        setIndicatorVisible(false);
      }
    };
    webSocketRef.current = webSocket;
  };

  const stopWebSocket = () => {
    const webSocket = webSocketRef.current;
    if (webSocket) {
      webSocket.close();
      webSocketRef.current = undefined;
    }
  };

  const categories = categoriesData?.data as string[] ?? [];
  const complexities = ["Easy", "Medium", "Hard"];

  const onRequested = (matchingRequest: MatchingRequest) => {
    const store: MatchingRequestorStore = { ...matchingRequest, requestedAt: matchingRequest.requestedAt };
    saveStore(store);
    setLauncherVisible(false);
    setIndicatorVisible(true);
    startIndicatorCleanerTimer();
  };

  const onRetry = () => {
    const matchingRequest: MatchingRequestorStore = { ...store, requestedAt: new Date() };
    mutate({
      url: appConfig.matchingService.requestEndpoint,
      method: "post",
      values: matchingRequest
    });
    saveStore(matchingRequest);
    startIndicatorCleanerTimer();
  };

  const onCancel = () => {
    mutate({
      url: appConfig.matchingService.cancelEndpoint,
      method: "post",
      values: {}
    });
    removeStore();
    setIndicatorVisible(false);
    setLauncherVisible(true);
  };

  const onGo = () => {
    removeStore();
    push(`/collaborate/${collaborationId}`);
  };

  useEffect(() => {
    if (store) {
      startIndicatorCleanerTimer();
      startWebSocket();
    }

    return () => {
      stopIndicatorCleanerTimer();
      stopWebSocket();
    };
  });

  return (
    <>
      {launcherVisible && <MatchingRequestorLauncher onClick={() => setFormDialogOpened(true)} />}
      {
        formDialogOpened && <MatchingRequestorFormDialog
          categories={categories}
          complexities={complexities}
          onSuccess={(matchingRequest) => onRequested(matchingRequest)}
          onClose={() => setFormDialogOpened(false)}
        />
      }
      {
        indicatorVisible &&
        <MatchingRequestorIndicator
          store={store}
          maxWaitingTime={maxWaitingTime}
          onRetry={onRetry}
          onCancel={onCancel}
        />
      }
      {collaborationId && <MatchingNotification onGo={onGo} />}
    </>
  )
};
