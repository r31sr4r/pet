import ClassValidatorFields from '../class-validator-fields';
import * as libClassValidator from 'class-validator';

class StubClassValidatorFields extends ClassValidatorFields<{
	field: string;
}> {}

describe('ClassValidatorFields Unit Tests', () => {
	it('should initialize errors and validatedData variables with null', () => {
		const validator = new StubClassValidatorFields();
		expect(validator.errors).toBeNull();
		expect(validator.validatedData).toBeNull();
	});

	it('should validate with errors', () => {
		const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
		spyValidateSync.mockReturnValue([
			{
				property: 'field',
				constraints: { isRequired: 'field is required' },
			},
		]);
		const validator = new StubClassValidatorFields();
		expect(validator.validate({ field: undefined })).toBe(false);
        expect(spyValidateSync).toHaveBeenCalled();
        expect(validator.validatedData).toBeNull();
        expect(validator.errors).toStrictEqual({ field: ['field is required'] });
	});


	it('should validate without errors', () => {
		const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
		spyValidateSync.mockReturnValue([]);
		const validator = new StubClassValidatorFields();
        expect(validator.validate({ field: 'some value' })).toBe(true);
        expect(spyValidateSync).toHaveBeenCalled();
        expect(validator.validatedData).toStrictEqual({ field: 'some value' });
        expect(validator.errors).toBeNull();        
		
	});

});
