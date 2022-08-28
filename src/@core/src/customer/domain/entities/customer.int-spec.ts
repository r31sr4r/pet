import { Customer } from './customer';

describe('Customer Integration Tests', () => {
	describe('create method', () => {
		it('should throw an error when name is invalid', () => {
			expect(
				() => new Customer({ name: null, email: 'somemail@mail.com' })
			).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be longer than or equal to 3 characters',
					'name must be shorter than or equal to 255 characters',
				],
			});

			expect(
				() => new Customer({ name: '', email: 'somemail@mail.com' })
			).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be longer than or equal to 3 characters',
				],
			});

			expect(
				() =>
					new Customer({ name: 5 as any, email: 'somemail@mail.com' })
			).containsErrorMessages({
				name: [
					'name must be a string',
					'name must be longer than or equal to 3 characters',
					'name must be shorter than or equal to 255 characters',
				],
			});

			expect(
				() =>
					new Customer({
						name: 't'.repeat(101),
						email: 'somemail@mail.com',
					})
			).containsErrorMessages({
				name: ['name must be shorter than or equal to 255 characters'],
			});
		});

		it('should throw an error when email is invalid', () => {
			expect(
				() => new Customer({ name: 'John Doe', email: null })
			).containsErrorMessages({
				email: [
					'email should not be empty',
					'email must be a string',
					'email must be shorter than or equal to 255 characters',
					'email must be an email',
				],
			});

			expect(
				() => new Customer({ name: 'John Doe', email: '' })
			).containsErrorMessages({
				email: ['email should not be empty', 'email must be an email'],
			});

			expect(
				() => new Customer({ name: 'John Doe', email: 5 as any })
			).containsErrorMessages({
				email: [
					'email must be a string',
					'email must be shorter than or equal to 255 characters',
					'email must be an email',
				],
			});
		});

		it('should throw an error when cellphone is invalid', () => {
			expect(
				() =>
					new Customer({
						name: 'John Doe',
						email: 'somemail@mail.com',
						cellphone: 5 as any,
					})
			).containsErrorMessages({
				cellphone: ['cellphone must be a phone number'],
			});

			expect(
				() =>
					new Customer({
						name: 'John Doe',
						email: 'somemail@mail.com',
						cellphone: 'asdasd',
					})
			).containsErrorMessages({
				cellphone: ['cellphone must be a phone number'],
			});
		});

		it('should throw an error when cpf format is invalid', () => {
			expect(
				() =>
					new Customer({
						name: 'John Doe',
						email: 'somemail@mail.com',
						cpf: '145678901',
					})
			).containsErrorMessages({
				cpf: ['Incorrect format for cpf. Expected: xxx.xxx.xxx-xx'],
			});

			expect(
				() =>
					new Customer({
						name: 'John Doe',
						email: 'somemail@mail.com',
						cpf: 'mycpf',
					})
			).containsErrorMessages({
				cpf: ['Incorrect format for cpf. Expected: xxx.xxx.xxx-xx'],
			});
		});

		it('should throw an error when gender is invalid', () => {
			expect(
				() =>
					new Customer({
						name: 'John Doe',
						email: 'somemail@mail.com',
						gender: 5 as any,
					})
			).containsErrorMessages({
				gender: ['gender must be a string'],
			});
		});

		it('should throw an error when birth_date is invalid', () => {
			expect(
				() =>
					new Customer({
						name: 'John Doe',
						email: 'somemail@mail.com',
						birth_date: '2021-04-03' as any,
					})
			).containsErrorMessages({
				birth_date: ['birth_date must be a Date instance'],
			});
		});

		it('should throw an error when is_active is invalid', () => {
			expect(
				() =>
					new Customer({
						name: 'John Doe',
						email: 'somemail@mail.com',
						is_active: 5 as any,
					})
			).containsErrorMessages({
				is_active: ['is_active must be a boolean value'],
			});
		});

		it('shoul create a customer', () => {
			expect.assertions(0);
			new Customer({ name: 'John Doe', email: 'somemail@mail.com' }); //NOSONAR
			/* NOSONAR */ new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
			});
			/* NOSONAR */ new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
				cpf: '123.456.789-10',
			});
			/* NOSONAR */ new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
				cpf: '123.456.789-10',
				gender: 'Male',
			});
			/* NOSONAR */ new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
				cpf: '123.456.789-10',
				gender: 'Male',
				birth_date: new Date('2020-04-03'),
				is_active: false,
			});
			/* NOSONAR */ new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
				cpf: '123.456.789-10',
				gender: 'Male',
				birth_date: new Date('2020-04-03'),
			});
		});
	});

	describe('update method', () => {
		it('should throw an error when name is invalid', () => {
			const customer = new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
			});

			expect(() => customer.update(null, 'Dog')).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be longer than or equal to 3 characters',
					'name must be shorter than or equal to 255 characters',
				],
			});

			expect(() =>
				customer.update('', 'somemail@mail.com')
			).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be longer than or equal to 3 characters',
				],
			});

			expect(() =>
				customer.update(5 as any, 'somemail@mail.com')
			).containsErrorMessages({
				name: [
					'name must be a string',
					'name must be longer than or equal to 3 characters',
					'name must be shorter than or equal to 255 characters',
				],
			});

			expect(() =>
				customer.update('t'.repeat(256), 'somemail@mail.com')
			).containsErrorMessages({
				name: ['name must be shorter than or equal to 255 characters'],
			});
		});

		it('should throw an error when email is invalid', () => {
			const customer = new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
			});

			expect(() =>
				customer.update('John Doe', null)
			).containsErrorMessages({
				email: [
					'email should not be empty',
					'email must be a string',
					'email must be shorter than or equal to 255 characters',
					'email must be an email',
				],
			});

			expect(() => customer.update('John Doe', '')).containsErrorMessages(
				{
					email: [
						'email should not be empty',
						'email must be an email',
					],
				}
			);

			expect(() =>
				customer.update('John Doe', 5 as any)
			).containsErrorMessages({
				email: [
					'email must be a string',
					'email must be shorter than or equal to 255 characters',
					'email must be an email',
				],
			});
		});

		it('should throw an error when cellphone is invalid', () => {
			const customer = new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
			});

			expect(() =>
				customer.update('John Doe', 'somemail2@mail.com', 5 as any)
			).containsErrorMessages({
				cellphone: ['cellphone must be a phone number'],
			});
		});

		it('should throw an error when cpf format is invalid', () => {
			const customer = new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
			});

			expect(() =>
				customer.update(
					'John Doe',
					'somemail2@mail.com',
					'+55 (11) 99999-9999',
					5 as any
				)
			).containsErrorMessages({
				cpf: ['Incorrect format for cpf. Expected: xxx.xxx.xxx-xx'],
			});
		});

		it('should throw an error when gender is invalid', () => {
			const customer = new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
			});

			expect(() =>
				customer.update(
					'John Doe',
					'somemail@mail.com',
					'+55 11 98745-7878',
					'123.456.789-00',
					5 as any
				)
			).containsErrorMessages({
				gender: ['gender must be a string'],
			});
		});

		it('should throw an error when birth_date is invalid', () => {
			const customer = new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
			});

			expect(() =>
				customer.update(
					'John Doe',
					'somemail@mail.com',
					'+55 11 98745-7878',
					'123.456.789-00',
					'Male',
					'2021-04-02' as any
				)
			).containsErrorMessages({
				birth_date: ['birth_date must be a Date instance'],
			});
		});

		it('should update the customer', () => {
			expect.assertions(0);
			const customer = new Customer({
				name: 'John Doe',
				email: 'somemail@mail.com',
			});

			customer.update('titi', 'somemail@mail.com');
			customer.update(
				'Joey',
				'somemail2@mail.com',
				'+55 (11) 99999-9999'
			);
			customer.update(
				'Joey',
				'somemail2@mail.com',
				'+55 (11) 99999-9999',
				'123.456.789-00'
			);
			customer.update(
				'Sara Doe',
				'somemail2@mail.com',
				'+55 (11) 99999-9999',
				'123.456.789-00',
				'Female'
			);		
			customer.update(
				'Sara Doe',
				'somemail2@mail.com',
				'+55 (11) 99999-9999',
				'123.456.789-00',
				'Female',
				new Date('2021-04-02')
			);					
			customer.update(
				'Sara Doe',
				'somemail2@mail.com',
				'+55 (11) 99999-9999',
				'123.456.789-00',
				'Female',
				new Date('2021-04-02'),
			);		
		});
	});
});
