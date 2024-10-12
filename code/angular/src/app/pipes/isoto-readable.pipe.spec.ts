import { ISOToReadablePipe } from './isoto-readable.pipe';

describe('ISOToReadablePipe', () => {
  it('create an instance', () => {
    const pipe = new ISOToReadablePipe();
    expect(pipe).toBeTruthy();
  });
});
