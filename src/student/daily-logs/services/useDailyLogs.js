import { useState, useEffect, useCallback } from 'react';
import { dailyLogService } from './dailyLogService';

export const useDailyLogs = (attachmentId = null) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Fetch logs
  const fetchLogs = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = attachmentId 
        ? await dailyLogService.getLogsByAttachment(attachmentId, page, limit)
        : await dailyLogService.getMyLogs(page, limit);
      
      // Handle different response structures
      const logsArray = Array.isArray(data) ? data : data.logs || data.data || [];
      const paginationData = data.pagination || { page: 1, limit: 20, total: logsArray.length, pages: 1 };
      
      setLogs(logsArray.map(log => 
        dailyLogService.formatLogForDisplay(log)
      ));
      setPagination(paginationData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [attachmentId]);

  // Get single log by ID
  const getLog = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dailyLogService.getLogById(id);
      return dailyLogService.formatLogForDisplay(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new log
  const createLog = useCallback(async (logData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dailyLogService.createLog(logData);
      const formattedLog = dailyLogService.formatLogForDisplay(data);
      
      setLogs(prev => [formattedLog, ...prev]);
      return formattedLog;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update log
  const updateLog = useCallback(async (id, logData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dailyLogService.updateLog(id, logData);
      const formattedLog = dailyLogService.formatLogForDisplay(data);
      
      setLogs(prev => 
        prev.map(log => log.id === id ? formattedLog : log)
      );
      return formattedLog;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit log for review
  const submitLog = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dailyLogService.submitLog(id);
      const formattedLog = dailyLogService.formatLogForDisplay(data);
      
      setLogs(prev => 
        prev.map(log => log.id === id ? formattedLog : log)
      );
      return formattedLog;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete log
  const deleteLog = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await dailyLogService.deleteLog(id);
      
      setLogs(prev => prev.filter(log => log.id !== id));
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
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    pagination,
    fetchLogs,
    getLog,
    createLog,
    updateLog,
    submitLog,
    deleteLog,
    clearError,
  };
};

export default useDailyLogs;
