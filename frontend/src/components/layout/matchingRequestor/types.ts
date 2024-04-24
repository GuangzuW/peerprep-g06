export type MatchingRequestorStore = {
  requestedAt: Date;
  matchingId?: string;
  matchedQuestionId?: string;
};

export type MatchingRequestorLauncherProps = {
  onClick: () => void;
};

export type MatchingRequestorFormInputs = {
  categories: string[];
  complexities: string[];
};

export type MatchingRequest = MatchingRequestorFormInputs & {
  requestedAt: Date;
}

export type MatchingRequestorFormDialogProps = {
  categories: string[];
  complexities: string[];
  onSuccess?: (data: MatchingRequest) => void;
  onClose: () => void;
};

export type MatchingRequestorIndicatorProps = {
  store?: MatchingRequestorStore;
  maxWaitingTime: number;
  onWaitingTimeOver: () => void;
  onRetry: () => void;
  onCancel: () => void;
};

export type MatchingNotificationProps = {
  onGo: () => void;
}
