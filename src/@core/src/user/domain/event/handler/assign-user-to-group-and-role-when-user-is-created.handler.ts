import EventHandlerInterface from '#seedwork/domain/event/event-handler.interface';
import UserCreatedEvent from '../user-created.event';

export default class AssignUserToGroupAndRoleWhenUserIsCreatedHandler
	implements EventHandlerInterface<UserCreatedEvent>
{
	handle(event: UserCreatedEvent): void {
		console.log(
			`Assigning user to group and role when user is created: ${event.eventData.userId}. Group: ${event.eventData.groupId}. Role: ${event.eventData.roleId}`
		);
		// const { userId, groupId, roleId } = event.eventData;
		// const user = User.findOne({ _id: userId });
		// const group = Group.findOne({ _id: groupId });
		// const role = Role.findOne({ _id: roleId });
		// if (user && group && role) {
		// 	user.groups.push(group);
		// 	user.roles.push(role);
		// 	user.save();
		// }
	}
}
