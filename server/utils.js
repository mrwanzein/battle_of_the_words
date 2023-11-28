import crypto from 'crypto';

export const generateRoomId = () => {
    return crypto.randomBytes(6).toString("hex");
}