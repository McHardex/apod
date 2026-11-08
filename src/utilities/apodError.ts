type ApodErrorPayload = {
  msg: string;
  [key: string]: unknown;
};

const hasAxiosResponseData = (
  error: unknown
): error is { response: { data: Record<string, unknown> } } => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return false;
  }

  const response = (error as { response?: { data?: unknown } }).response;
  return Boolean(response && typeof response.data === 'object' && response.data !== null);
};

const fallbackMessage = 'Unable to load the picture of the day. Please try again.';

export const getApodRequestErrorPayload = (error: unknown): ApodErrorPayload => {
  if (hasAxiosResponseData(error)) {
    const data = error.response.data;

    if (typeof data.msg === 'string') {
      return data as ApodErrorPayload;
    }

    return {
      ...data,
      msg: fallbackMessage
    };
  }

  return {
    msg: fallbackMessage
  };
};
