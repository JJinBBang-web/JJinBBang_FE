// src/util/fileUpload.ts
export const validateFile = (file: File) => {
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('PDF 또는 이미지 파일만 업로드 가능합니다.');
  }

  if (file.size > maxSize) {
    throw new Error('파일 크기는 10MB 이하여야 합니다.');
  }

  return true;
};

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/v1/certificates/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('파일 업로드에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};
