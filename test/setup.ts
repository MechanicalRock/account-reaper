jest.mock('aws-xray-sdk', () => {
    class Segment {
        constructor(name: string) {
        }

        addNewSubsegment(name: string): Segment {
            return new Segment(name);
        }

        addError(error: Error): void {
        }

        close(): void {
        }
    }

    let segment: Segment;

    return {
        Segment,
        getSegment: jest.fn(() => {
            if (!segment) {
                return new Segment('');
            }
            return segment;
        }),
        captureAWSClient: <T>(client: T) => client
    };
});

// export const logSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());
// export const infoSpy = jest.spyOn(console, 'info').mockImplementation(jest.fn());
// export const errorSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
