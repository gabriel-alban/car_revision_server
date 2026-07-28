import bcrypt from 'bcrypt';

class Hash {
    async encrypt(value: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(value, salt);
    }

    async compare(bodyPass: string, userPass: string) {
        return await bcrypt.compare(bodyPass, userPass);
    }

}

export default new Hash();