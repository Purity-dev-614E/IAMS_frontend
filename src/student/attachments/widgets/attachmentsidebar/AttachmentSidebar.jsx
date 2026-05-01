import React from 'react';
import AppSidebar from '../../../../shared/components/AppSidebar/AppSidebar';
import { studentNavigation } from '../../../../shared/components/AppSidebar/sidebarConfig';

const AttachmentSidebar = () => {
  const user = {
    initials: 'PS',
    name: 'Purity Sang',
    role: 'Student · BBIT'
  };

  return (
    <AppSidebar 
      navigationItems={studentNavigation} 
      user={user} 
    />
  );
};

export default AttachmentSidebar;
