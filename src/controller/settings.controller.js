const Settings = require("../models/settings.schema.js");
const EmailService = require("../templates/email-service");
const emailService = new EmailService();

// Get current settings
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = new Settings();
            await settings.save();
        }
        res.status(200).json({ settings });
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update settings
const updateSettings = async (req, res) => {
    const updates = req.body;

    // Basic validation
    if (!updates.schoolName || !updates.schoolEmail) {
        return res.status(400).json({ message: "School name and email are required" });
    }

    if (updates.systemPreferences && typeof updates.systemPreferences.maxStudentsPerCourse === 'number') {
        if (updates.systemPreferences.maxStudentsPerCourse < 1) {
            return res.status(400).json({ message: "Max students per course must be at least 1" });
        }
    }

    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        // Update settings
        Object.assign(settings, updates);
        await settings.save();

        // Send settings update notification email (non-blocking)
        emailService.sendSettingsUpdateEmail(settings, req.user?.email || 'Admin').catch(emailError => {
            console.error("Failed to send settings update notification email:", emailError.message);
        });

        res.status(200).json({ message: "Settings updated successfully", settings });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
