jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));
