import { useState, useCallback } from 'react';
import { EndOfAttachmentReport } from '../../../models';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    // Check if file exists
    if (!file) {
      throw new Error('Please select a file');
    }

    // Check file type
    if (!EndOfAttachmentReport.isValidPdfFile(file.name)) {
      throw new Error('Only PDF files are allowed');
    }

    // Check file size
    if (!EndOfAttachmentReport.validatePdfFileSize(file.size)) {
      const maxSizeMB = Math.round(EndOfAttachmentReport.getMaxPdfFileSize() / (1024 * 1024));
      throw new Error(`File size too large. Maximum size is ${maxSizeMB}MB`);
    }

    return true;
  }, []);

  const uploadFile = useCallback(async (file, onProgress) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Validate file
      validateFile(file);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(progress);
              onProgress(progress);
            }
          });
        }

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (parseError) {
              reject(new Error('Invalid response from server'));
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse?.message || `Upload failed with status ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        // Handle timeout
        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timed out'));
        });

        // Set up request
        const token = localStorage.getItem('iams_token');
        xhr.open('POST', `${import.meta.env.VITE_API_URL || "https://iamsbackend-production.up.railway.app/api"}/upload/reports`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.timeout = 60000; // 60 seconds timeout

        // Send request
        xhr.send(formData);
      });

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [validateFile]);

  const resetUpload = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getFileExtension = useCallback((filename) => {
    return filename.split('.').pop().toLowerCase();
  }, []);

  const generatePreviewUrl = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  }, []);

  const cleanupPreviewUrl = useCallback((url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, []);

  return {
    uploading,
    uploadProgress,
    error,
    uploadFile,
    resetUpload,
    validateFile,
    formatFileSize,
    getFileExtension,
    generatePreviewUrl,
    cleanupPreviewUrl
  };
};
