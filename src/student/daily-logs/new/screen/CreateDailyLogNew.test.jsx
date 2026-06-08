import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import CreateDailyLog from './CreateDailyLogNew';

vi.mock('react-router-dom', () => ({
  useParams: () => ({}),
  useLocation: () => ({ state: null })
}));

vi.mock('../../../../unisup/dashboard/widgets/WeekDots', () => ({
  default: () => <div data-testid="week-dots" />
}));

vi.mock('../../../../shared/components/AppSidebar/AppSidebar', () => ({
  default: () => <aside data-testid="app-sidebar" />
}));

vi.mock('../../../../shared/profile/profileService', () => ({
  profileService: {
    fetchProfile: vi.fn().mockResolvedValue(null),
    getNavigationItems: vi.fn().mockReturnValue([]),
    getUserDisplayInfo: vi.fn().mockReturnValue({ name: 'Test Student' })
  }
}));

vi.mock('../../services/useDailyLogs', () => ({
  useDailyLogs: () => ({
    createLog: vi.fn(),
    submitLog: vi.fn(),
    getLog: vi.fn(),
    updateLog: vi.fn()
  })
}));

vi.mock('../../../attachments/services/attachmentService', () => ({
  attachmentService: {
    getMyAttachments: vi.fn().mockResolvedValue([
      {
        id: 'attachment-1',
        organization_name: 'Test Organization',
        start_date: '2026-06-01',
        end_date: '2026-08-01'
      }
    ])
  }
}));

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', name: 'Test Student', role: 'student' }
  })
}));

describe('CreateDailyLog', () => {
  test('disables the Submit button when Tasks Performed is empty', () => {
    render(<CreateDailyLog />);

    expect(screen.getByRole('button', { name: /submit log for today/i })).toBeDisabled();
  });
});
