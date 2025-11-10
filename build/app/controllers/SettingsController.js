"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
class SettingsController {
    async index(request, response) {
        const user = request.user;
        if (!user) {
            return response.redirect("/login");
        }
        const userWithSettings = await DB_1.default.table("users")
            .where({ id: user.id })
            .select('settings')
            .first();
        let savedSettings = null;
        if (userWithSettings?.settings) {
            try {
                savedSettings = JSON.parse(userWithSettings.settings);
            }
            catch (e) {
                console.error("Error parsing settings:", e);
            }
        }
        return response.inertia("Settings/Index", {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            savedSettings
        });
    }
    async store(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: "Unauthorized" });
            }
            const settings = await request.json();
            await DB_1.default.table("users")
                .where({ id: user.id })
                .update({
                settings: JSON.stringify(settings),
                updated_at: Date.now()
            });
            return response.json({
                message: "Settings saved successfully",
                settings
            });
        }
        catch (error) {
            console.error("Error saving settings:", error);
            return response.status(500).json({ error: "Failed to save settings" });
        }
    }
    async get(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: "Unauthorized" });
            }
            const userWithSettings = await DB_1.default.table("users")
                .where({ id: user.id })
                .select('settings')
                .first();
            console.log(userWithSettings);
            let settings = null;
            if (userWithSettings?.settings) {
                try {
                    settings = JSON.parse(userWithSettings.settings);
                }
                catch (e) {
                    console.error("Error parsing settings:", e);
                }
            }
            return response.json({ settings });
        }
        catch (error) {
            console.error("Error getting settings:", error);
            return response.status(500).json({ error: "Failed to get settings" });
        }
    }
}
exports.default = new SettingsController();
//# sourceMappingURL=SettingsController.js.map