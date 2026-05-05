import { useState, useEffect, useCallback } from 'react';
import { attachmentService } from './attachmentService';

export const useAttachments = () => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all attachments for current student
  const fetchAttachments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attachmentService.getMyAttachments();
      // Handle different response structures
      const attachmentsArray = Array.isArray(data) ? data : data.attachments || data.data || [];
      setAttachments(attachmentsArray.map(attachment => 
        attachmentService.formatAttachmentForDisplay(attachment)
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single attachment by ID
  const getAttachment = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attachmentService.getAttachmentById(id);
      return attachmentService.formatAttachmentForDisplay(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new attachment
  const createAttachment = useCallback(async (attachmentData) => {
    setLoading(true);
    setError(null);
    try {
      // Validate dates
      attachmentService.validateDates(attachmentData.startDate, attachmentData.endDate);
      
      const data = await attachmentService.createAttachment(attachmentData);
      const formattedAttachment = attachmentService.formatAttachmentForDisplay(data);
      
      setAttachments(prev => [...prev, formattedAttachment]);
      return formattedAttachment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update attachment
  const updateAttachment = useCallback(async (id, attachmentData) => {
    setLoading(true);
    setError(null);
    try {
      // Validate dates if provided
      if (attachmentData.startDate && attachmentData.endDate) {
        attachmentService.validateDates(attachmentData.startDate, attachmentData.endDate);
      }
      
      const data = await attachmentService.updateAttachment(id, attachmentData);
      const formattedAttachment = attachmentService.formatAttachmentForDisplay(data);
      
      setAttachments(prev => 
        prev.map(att => att.id === id ? formattedAttachment : att)
      );
      return formattedAttachment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit attachment for activation
  const submitForActivation = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attachmentService.submitForActivation(id);
      const formattedAttachment = attachmentService.formatAttachmentForDisplay(data);
      
      setAttachments(prev => 
        prev.map(att => att.id === id ? formattedAttachment : att)
      );
      return formattedAttachment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get attachment progress
  const getAttachmentProgress = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attachmentService.getAttachmentProgress(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get attachment logs
  const getAttachmentLogs = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attachmentService.getAttachmentLogs(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get attachment reviews
  const getAttachmentReviews = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attachmentService.getAttachmentReviews(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  return {
    attachments,
    loading,
    error,
    fetchAttachments,
    getAttachment,
    createAttachment,
    updateAttachment,
    submitForActivation,
    getAttachmentProgress,
    getAttachmentLogs,
    getAttachmentReviews,
    clearError,
  };
};

export default useAttachments;
