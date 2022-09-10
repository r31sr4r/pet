export type GroupsAndRoles = {
    group: string;
    role: string;
};

export interface JwtPayload {
    email: string;
    profile: GroupsAndRoles[];
}
