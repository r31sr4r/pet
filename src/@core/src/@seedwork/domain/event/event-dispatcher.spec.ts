import AssignUserToGroupAndRoleWhenUserIsCreatedHandler from '#user/domain/event/handler/assign-user-to-group-and-role-when-user-is-created.handler';
import UserCreatedEvent from '#user/domain/event/user-created.event';
import EventDispatcher from './event-dispatcher';

describe('Domain events tests', () => {
	it('should register an event handler', () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler =
			new AssignUserToGroupAndRoleWhenUserIsCreatedHandler();

		eventDispatcher.register('UserCreatedEvent', eventHandler);

		expect(
			eventDispatcher.getEventHandlers['UserCreatedEvent']
		).toBeDefined();
		expect(
			eventDispatcher.getEventHandlers['UserCreatedEvent'].length
		).toBe(1);
		expect(
			eventDispatcher.getEventHandlers['UserCreatedEvent'][0]
		).toMatchObject(eventHandler);
	});

	it('should unregister an event handler', () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler =
			new AssignUserToGroupAndRoleWhenUserIsCreatedHandler();

		eventDispatcher.register('UserCreatedEvent', eventHandler);
		expect(
			eventDispatcher.getEventHandlers['UserCreatedEvent'][0]
		).toMatchObject(eventHandler);

		eventDispatcher.unregister('UserCreatedEvent', eventHandler);

		expect(
			eventDispatcher.getEventHandlers['UserCreatedEvent']
		).toBeDefined();
		expect(
			eventDispatcher.getEventHandlers['UserCreatedEvent'].length
		).toBe(0);
	});

	it('should unregister all event handlers', () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler =
			new AssignUserToGroupAndRoleWhenUserIsCreatedHandler();

		eventDispatcher.register('UserCreatedEvent', eventHandler);
		expect(
			eventDispatcher.getEventHandlers['UserCreatedEvent'][0]
		).toMatchObject(eventHandler);

		eventDispatcher.unregisterAll();

		expect(eventDispatcher.getEventHandlers['UserCreatedEvent']).toBe(
			undefined
		);
	});

	it('should notify all event handlers', () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler =
			new AssignUserToGroupAndRoleWhenUserIsCreatedHandler();
		const spyEventHandler = jest.spyOn(eventHandler, 'handle');

		eventDispatcher.register('UserCreatedEvent', eventHandler);

		expect(
			eventDispatcher.getEventHandlers['UserCreatedEvent'][0]
		).toMatchObject(eventHandler);

		const userCreatedEvent = new UserCreatedEvent({
			user_id: '70779ff1-7db3-4c9e-847b-17b36c70fa61',
			name: 'User Name',
			email: 'usermail@mail.com',
			group_id: '84e18b50-c6ae-4a74-bf78-ca8620138b3e',
			group_name: 'some group',
			role_id: 'b0ad42b5-6fa0-44a8-b174-83d014a35227',
			role_name: 'some role',
		});

		eventDispatcher.notify(userCreatedEvent);

		expect(spyEventHandler).toHaveBeenCalled();
	});
});
