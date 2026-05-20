type ErrorLike = {
  message?: string;
  code?: string;
};

function extractErrorText(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const typedError = error as ErrorLike;
    return `${typedError.code ?? ""} ${typedError.message ?? ""}`.trim();
  }

  return "";
}

export function getFriendlyErrorMessage(error: unknown): string {
  const errorText = extractErrorText(error).toLowerCase();

  if (!errorText) {
    return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  if (
    errorText.includes("42501") ||
    errorText.includes("row-level security") ||
    errorText.includes("row level security")
  ) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  if (errorText.includes("failed to fetch")) {
    return "인터넷 연결을 확인해주세요.";
  }

  if (
    errorText.includes("not found") ||
    errorText.includes("no rows found") ||
    errorText.includes("requested resource was not found") ||
    errorText.includes("could not find the requested resource")
  ) {
    return "요청한 게시글을 찾을 수 없습니다.";
  }

  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}