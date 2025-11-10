import { Response, Request } from "../../type";
import DB from "../services/DB";

class SettingsController {
    
    /**
     * Show settings page
     */
    public async index(request: Request, response: Response) {
        const user = request.user;

        if (!user) {
            return response.redirect("/login");
        }

        // Get user settings from database
        const userWithSettings = await DB.table("users")
            .where({ id: user.id })
            .select('settings')
            .first();
 
        let savedSettings = null;
        if (userWithSettings?.settings) {
            try {
                savedSettings = JSON.parse(userWithSettings.settings);
            } catch (e) {
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

    /**
     * Save user settings to database
     */
    public async store(request: Request, response: Response) {
        try {
            const user = request.user;

            if (!user) {
                return response.status(401).json({ error: "Unauthorized" });
            }

            const settings = await request.json();

            // Save settings to database as JSON string
            await DB.table("users")
                .where({ id: user.id })
                .update({
                    settings: JSON.stringify(settings),
                    updated_at: Date.now()
                });
            
            return response.json({ 
                message: "Settings saved successfully",
                settings 
            });

        } catch (error) {
            console.error("Error saving settings:", error);
            return response.status(500).json({ error: "Failed to save settings" });
        }
    }

    /**
     * Get user settings
     */
    public async get(request: Request, response: Response) {
        try {
            const user = request.user;

            if (!user) {
                return response.status(401).json({ error: "Unauthorized" });
            }

            const userWithSettings = await DB.table("users")
                .where({ id: user.id })
                .select('settings')
                .first();

                console.log(userWithSettings)

            let settings = null;
            if (userWithSettings?.settings) {
                try {
                    settings = JSON.parse(userWithSettings.settings);
                } catch (e) {
                    console.error("Error parsing settings:", e);
                }
            }

            return response.json({ settings });

        } catch (error) {
            console.error("Error getting settings:", error);
            return response.status(500).json({ error: "Failed to get settings" });
        }
    }
}

export default new SettingsController();
