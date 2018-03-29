function mockRequestResponse() {
  const req = {
    params: {},
    body: {}
  };
  const res = {
    end: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
    status: jest.fn(),
    reset: resetMock
  };

  res.end.mockImplementation(() => res);
  res.json.mockImplementation(() => res);
  res.send.mockImplementation(() => res);
  res.status.mockImplementation(() => res);

  function resetMock() {
    this.end.mockClear();
    this.json.mockClear();
    this.send.mockClear();
    this.status.mockClear();
  }

  return { req, res };
}

export { mockRequestResponse };
