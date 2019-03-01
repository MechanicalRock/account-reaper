import AWSXray from 'aws-xray-sdk';
import { logError } from "../../src/utils";
import { errorSpy } from '../setup';

describe('error logging', () => {

    it('should call addError and log the error to the console', () => {

        const segment = new AWSXray.Segment('segment');
        jest.spyOn(segment, 'addError');

        const newError = new Error('new error');
        const message = 'Some error has occured';

        logError(segment, message, newError);

        expect(segment.addError).toHaveBeenCalledWith(newError);
        expect(errorSpy).toHaveBeenCalledWith(message, newError);
    });
});