import { attachmentService } from './attachmentService';

const ACTIVE_STATUS = 'active';

export const isActiveAttachment = (attachment) => {
  return String(attachment?.status || '').toLowerCase() === ACTIVE_STATUS;
};

const extractAttachments = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.attachments)) return response.attachments;
  if (Array.isArray(response?.data?.attachments)) return response.data.attachments;
  return [];
};

export const studentHasActiveAttachment = async () => {
  const response = await attachmentService.getMyAttachments();
  return extractAttachments(response).some(isActiveAttachment);
};

export const getStudentLandingPath = async () => {
  try {
    return (await studentHasActiveAttachment()) ? '/dashboard' : '/attachments';
  } catch (error) {
    console.error('Unable to verify active attachment:', error);
    return '/attachments';
  }
};
