import TestRenderer, { act } from 'react-test-renderer';
import { Alert } from 'react-native';
import { useSurveyRequests } from '../../src/hooks/useSurveyRequests';
import { surveyService } from '../../src/services/surveyService';
import {
  SurveyRequestEntity,
  SurveyRequestData,
} from '../../src/domain/entities/SurveyRequestEntity';
let mockRole = 'admin';
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'one', role: mockRole, full_name: 'Admin' },
  }),
}));
jest.mock('../../src/services/surveyService', () => ({
  surveyService: {
    getBookings: jest.fn(),
    claimBooking: jest.fn(),
    deleteBooking: jest.fn(),
  },
}));
const booking: SurveyRequestData = {
  id: 'SRV-001',
  rawDbId: 1,
  clientName: 'Client',
  companyName: 'Company',
  phone: '0812345',
  email: 'client@example.com',
  structureType: 'Building',
  location: 'Office',
  submittedDate: '',
  notes: '',
  status: 'pending',
};
let api!: ReturnType<typeof useSurveyRequests>;
function Harness() {
  api = useSurveyRequests();
  return null;
}
let view: TestRenderer.ReactTestRenderer;
beforeEach(async () => {
  jest.resetAllMocks();
  mockRole = 'admin';
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  jest.mocked(surveyService.getBookings).mockResolvedValue([booking]);
  await act(async () => {
    view = TestRenderer.create(<Harness />);
  });
});
afterEach(() => {
  act(() => view.unmount());
  jest.restoreAllMocks();
});
it('rejects a missing database ID instead of pretending a claim succeeded', () => {
  act(() =>
    api.handleClaim(
      new SurveyRequestEntity({ ...booking, rawDbId: undefined }),
    ),
  );
  expect(Alert.alert).toHaveBeenCalledWith(
    'Data Survei Tidak Valid',
    expect.any(String),
  );
  expect(surveyService.claimBooking).not.toHaveBeenCalled();
  expect(api.pendingCount).toBe(1);
});
it('does not remove a booking without its database ID', () => {
  act(() =>
    api.handleDelete(
      new SurveyRequestEntity({ ...booking, rawDbId: undefined }),
    ),
  );
  expect(Alert.alert).toHaveBeenCalledWith(
    'Data Survei Tidak Valid',
    expect.any(String),
  );
  expect(surveyService.deleteBooking).not.toHaveBeenCalled();
  expect(api.totalCount).toBe(1);
});
it('uses the persisted claim and reloads the server result', async () => {
  jest.mocked(surveyService.claimBooking).mockResolvedValue();
  jest
    .mocked(surveyService.getBookings)
    .mockResolvedValue([{ ...booking, status: 'claimed' }]);
  act(() => api.handleClaim(new SurveyRequestEntity(booking)));
  const confirm = jest
    .mocked(Alert.alert)
    .mock.calls[0][2]?.find(button => button.text === 'Ya, Ambil')?.onPress;
  expect(confirm).toBeDefined();
  await act(async () => {
    await confirm?.();
  });
  expect(surveyService.claimBooking).toHaveBeenCalledWith(
    1,
    expect.objectContaining({ status: 'claimed', claimed_by: 'Admin (Admin)' }),
  );
  expect(api.claimedCount).toBe(1);
});
