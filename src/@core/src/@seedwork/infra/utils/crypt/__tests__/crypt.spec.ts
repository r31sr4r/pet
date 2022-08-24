import { Crypt } from '../crypt';

describe('Crypt Unit Tests', () => {
	it('should be able to hash a password in Sync', () => {
		const password = 'password';
		const hash = Crypt.hashSync(password);
		expect(hash).toBeDefined();
	});

	it('should be able to hash a password in Async', async () => {
		const password = 'password';
		const hash = await Crypt.hash(password);
		expect(hash).toBeDefined();
	});

    it('should be able to compare a password in Sync', () => {
		const password = 'password';
		const hash = Crypt.hashSync(password);
		const isValid = Crypt.compareSync(password, hash);
		expect(isValid).toBeTruthy();

		const invalidPassword = 'invalidPassword';
		const isInvalid = Crypt.compareSync(invalidPassword, hash);
		expect(isInvalid).toBeFalsy();
	});

	it('should be able to compare a password in Async', async () => {
		const password = 'password';
		const hash = await Crypt.hash(password);
		const isValid = await Crypt.compare(password, hash);
		expect(isValid).toBeTruthy();

		const invalidPassword = 'invalidPassword';
		const isInvalid = await Crypt.compare(invalidPassword, hash);
		expect(isInvalid).toBeFalsy();
	});


});
