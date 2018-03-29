const defaultResponse = { data: {} };

const get = jest.fn(() => Promise.resolve(defaultResponse));

const post = jest.fn(() => Promise.resolve(defaultResponse));

export { get, post };
