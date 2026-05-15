import React, { useState, useEffect } from 'react';
import styles from './DailyLogs.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { profileService } from '../../../shared/profile/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import Weekstoggle from "../widgets/weekstoggle/weekstoggle";
import Button from '../../../shared/components/Button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import WeeklyLogs from '../widgets/weeklylogswidget/WeeklyLogs';
import { attachmentService } from '../../attachments/services/attachmentService';

const DailyLogs = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [attachment, setAttachment] = useState(null);
  
  // Initialize to Monday of current week
  const getInitialDate = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate());

  // Helper to parse YYYY-MM-DD or ISO string to local Date at midnight
  const parseLocalDate = (dateInput) => {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) {
      const d = new Date(dateInput);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    
    // Handle "YYYY-MM-DD" string specifically to avoid timezone shifts
    if (typeof dateInput === 'string' && dateInput.includes('-')) {
      const parts = dateInput.split('T')[0].split('-');
      if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
      }
    }
    
    const d = new Date(dateInput);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Fetch profile data and attachment on component mount
  useEffect(() => {
    fetchProfileData();
    fetchAttachment();
  }, []);

  useEffect(() => {
    if (attachment) {
      // Constrain current date to attachment range
      const startStr = attachment.startDate || attachment.start_date;
      const endStr = attachment.endDate || attachment.end_date;
      
      if (startStr && endStr) {
        const start = parseLocalDate(startStr);
        const end = parseLocalDate(endStr);
        end.setHours(23, 59, 59, 999);
        
        const current = new Date(currentDate);
        current.setHours(12, 0, 0, 0);
        
        // If current date is before attachment start, set to attachment start week
        if (current < start) {
          const startMonday = new Date(start);
          const startDay = start.getDay();
          const startDiff = startDay === 0 ? -6 : 1 - startDay;
          startMonday.setDate(start.getDate() + startDiff);
          startMonday.setHours(0, 0, 0, 0);
          setCurrentDate(startMonday);
        }
        // If current date is after attachment end, set to attachment end week
        else if (current > end) {
          const endMonday = new Date(end);
          const endDay = end.getDay();
          const endDiff = endDay === 0 ? -6 : 1 - endDay;
          endMonday.setDate(end.getDate() + endDiff);
          endMonday.setHours(0, 0, 0, 0);
          setCurrentDate(endMonday);
        }
      }
    }
  }, [attachment]);

  const fetchProfileData = async () => {
    try {
      const profile = await profileService.fetchProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const fetchAttachment = async () => {
    try {
      console.log('📡 Fetching attachments...');
      const response = await attachmentService.getMyAttachments();
      console.log('📥 Raw attachment response:', response);
      
      // The service now returns { ..., data: [transformedModels] }
      let attachmentsArray = [];
      if (response && response.data) {
        attachmentsArray = Array.isArray(response.data) ? response.data : [response.data];
      } else if (response && response.attachments) {
        attachmentsArray = response.attachments;
      }
      
      console.log('📊 Processed attachments array:', attachmentsArray);
      
      if (attachmentsArray && attachmentsArray.length > 0) {
        const activeAttachment = attachmentsArray[0];
        console.log('✅ Setting active attachment:', activeAttachment);
        
        // Debug week calculation values
        console.log('📅 Attachment Start Date:', activeAttachment.startDate || activeAttachment.start_date);
        console.log('📅 Current Reference Date:', currentDate.toISOString());
        
        setAttachment(activeAttachment);
      } else {
        console.warn('⚠️ No active attachments found for this student.');
      }
    } catch (error) {
      console.error('❌ Error fetching attachment:', error);
    }
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  const formatDateWithOrdinal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
  };

  const handlePrevious = () => {
    if (isPrevDisabled()) return;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    if (isNextDisabled()) return;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const isPrevDisabled = () => {
    // Don't disable if we're still loading attachment data
    if (!attachment) return false;
    
    const startStr = attachment.startDate || attachment.start_date;
    if (!startStr) return false;
    
    try {
      const start = parseLocalDate(startStr);
      start.setHours(0, 0, 0, 0);

      // Calculate the Monday of the previous week
      const prevMonday = new Date(currentDate);
      prevMonday.setDate(currentDate.getDate() - 7);
      const prevDay = prevMonday.getDay();
      const prevDiff = prevDay === 0 ? -6 : 1 - prevDay;
      prevMonday.setDate(prevMonday.getDate() + prevDiff);
      prevMonday.setHours(0, 0, 0, 0);

      // Calculate the Friday of the previous week
      const prevFriday = new Date(prevMonday);
      prevFriday.setDate(prevMonday.getDate() + 4);
      prevFriday.setHours(23, 59, 59, 999);

      // Disable if the entire previous week (Mon-Fri) is before the attachment start date
      return prevFriday.getTime() < start.getTime();
    } catch (e) {
      return false;
    }
  };

  const isNextDisabled = () => {
    // Don't disable if we're still loading attachment data
    if (!attachment) return false;
    
    const endStr = attachment.endDate || attachment.end_date;
    if (!endStr) return false;
    
    try {
      const end = parseLocalDate(endStr);
      end.setHours(23, 59, 59, 999);

      // Calculate the Monday of the next week
      const nextMonday = new Date(currentDate);
      nextMonday.setDate(currentDate.getDate() + 7);
      const nextDay = nextMonday.getDay();
      const nextDiff = nextDay === 0 ? -6 : 1 - nextDay;
      nextMonday.setDate(nextMonday.getDate() + nextDiff);
      nextMonday.setHours(0, 0, 0, 0);

      // Disable if the Monday of the next week is after the attachment end date
      return nextMonday.getTime() > end.getTime();
    } catch (e) {
      return false;
    }
  };

  return (
    <div className={styles.shell}>
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(profileData || user)} 
        user={profileService.getUserDisplayInfo(profileData || user)}
      />
      <div className={styles.main}>
        <div className={styles.header}>
          <Weekstoggle />
        </div>
        <div className={styles.content}>
          {attachment && (
            <div style={{padding: '0.5rem 1.25rem', fontSize: '12px', color: 'var(--subtle)', borderBottom: '1px solid var(--border)'}}>
              <strong>Attachment Period:</strong> {formatDateWithOrdinal(attachment.startDate || attachment.start_date)} to {formatDateWithOrdinal(attachment.endDate || attachment.end_date)}
              <span style={{margin: '0 0.5rem'}}>|</span>
              <strong>Current Week:</strong> {formatDateWithOrdinal(currentDate)}
            </div>
          )}
          <WeeklyLogs currentDate={currentDate} attachment={attachment} />
        </div>
        <div className={styles.pagination}>
          <Button icon={FaArrowLeft} onClick={handlePrevious} disabled={isPrevDisabled()}>previous</Button>
          <Button icon={FaArrowRight} onClick={handleNext} disabled={isNextDisabled()}>next</Button>
        </div>
      </div>
    
    </div>
  );
};

export default DailyLogs;
