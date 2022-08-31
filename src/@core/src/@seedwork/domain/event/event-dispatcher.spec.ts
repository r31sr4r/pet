import AssignUserToGroupAndRoleWhenUserIsCreatedHandler from '#user/domain/event/handler/assign-user-to-group-and-role-when-user-is-created.handler';
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
});
