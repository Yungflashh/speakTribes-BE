"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error?.issues) {
                return res.status(400).json({ errors: error.issues });
            }
            return res.status(400).json({ error: error.message });
        }
    };
};
exports.validateRequest = validateRequest;
