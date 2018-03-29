import requiredParam from '../requiredParam';

test('throws a required parameter error', () => {
  expect(() => {
    requiredParam('id');
  }).toThrowError();
});
