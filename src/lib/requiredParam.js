function requiredParam(param) {
  const requiredParamError = new Error(`Required parameter "${param}" is missing.`);
  // preserve original stack trace
  Error.captureStackTrace(requiredParamError, requiredParam);
  throw requiredParamError;
}

export default requiredParam;
