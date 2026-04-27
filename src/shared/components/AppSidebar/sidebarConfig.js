export const studentNavigation = [
  {
    title: 'Main',
    items: [
      { icon: '▦', label: 'Dashboard', to: '/dashboard' },
      { icon: '◎', label: 'My Attachment', to: '/attachments' },
      { icon: '✎', label: 'Daily Logs', to: '/logs/new' },
      { icon: '⊞', label: 'Weekly Reviews', to: '/reviews' }
    ]
  },
  {
    title: 'Account',
    items: [
      { icon: '◉', label: 'Profile', to: '/profile' }
    ]
  }
];

export const adminNavigation = [
  {
    title: 'Main',
    items: [
      { icon: '▦', label: 'Dashboard', to: '/admin/dashboard' },
      { icon: '👥', label: 'Students', to: '/admin/students' },
      { icon: '📊', label: 'Reports', to: '/admin/reports' },
      { icon: '⚙️', label: 'Settings', to: '/admin/settings' }
    ]
  },
  {
    title: 'Account',
    items: [
      { icon: '◉', label: 'Profile', to: '/admin/profile' }
    ]
  }
];

export const supervisorNavigation = [
  {
    title: 'Main',
    items: [
      { icon: '▦', label: 'Dashboard', to: '/supervisor/dashboard' },
      { icon: '👁️', label: 'Students', to: '/supervisor/students' },
      { icon: '📝', label: 'Reviews', to: '/supervisor/reviews' },
      { icon: '📈', label: 'Analytics', to: '/supervisor/analytics' }
    ]
  },
  {
    title: 'Account',
    items: [
      { icon: '◉', label: 'Profile', to: '/supervisor/profile' }
    ]
  }
];
