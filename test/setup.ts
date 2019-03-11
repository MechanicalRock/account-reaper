import 'aws-xray-mock';

export const logSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());
export const infoSpy = jest.spyOn(console, 'info').mockImplementation(jest.fn());
export const errorSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
