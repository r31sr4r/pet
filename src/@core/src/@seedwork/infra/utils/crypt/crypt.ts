import * as bcrypt from 'bcrypt';

export class Crypt {
	static hashSync(password: string): string {
		const salt = bcrypt.genSaltSync();
		return bcrypt.hashSync(password, salt);
	}

    static async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    static compareSync(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }

    static async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
