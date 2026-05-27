type PostValidationInput = {
  title: string;
  content: string;
  titleMinLength?: number;
  contentMinLength?: number;
};

type ValidationFieldErrors = {
  title: string;
  content: string;
};

export type PostValidationResult = {
  isValid: boolean;
  trimmedTitle: string;
  trimmedContent: string;
  fieldErrors: ValidationFieldErrors;
};

export function validatePost({
  title,
  content,
  titleMinLength = 2,
  contentMinLength = 5,
}: PostValidationInput): PostValidationResult {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  const fieldErrors: ValidationFieldErrors = {
    title: "",
    content: "",
  };

  if (!trimmedTitle) {
    fieldErrors.title = "제목은 필수입니다.";
  } else if (trimmedTitle.length < titleMinLength) {
    fieldErrors.title = `제목은 최소 ${titleMinLength}자 이상이어야 합니다.`;
  }

  if (!trimmedContent) {
    fieldErrors.content = "내용은 필수입니다.";
  } else if (trimmedContent.length < contentMinLength) {
    fieldErrors.content = `내용은 최소 ${contentMinLength}자 이상이어야 합니다.`;
  }

  return {
    isValid: !fieldErrors.title && !fieldErrors.content,
    trimmedTitle,
    trimmedContent,
    fieldErrors,
  };
}

export function validateImageSize(file: File, maxSizeBytes = 5 * 1024 * 1024): string | null {
  if (file.size > maxSizeBytes) {
    return `이미지는 ${Math.round(maxSizeBytes / 1024 / 1024)}MB 이하만 업로드할 수 있습니다.`;
  }

  return null;
}