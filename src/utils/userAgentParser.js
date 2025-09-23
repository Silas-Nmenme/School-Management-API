/**
 * Utility to parse User-Agent string and extract detailed device information.
 * @param {string} userAgent - The User-Agent string from req.headers['user-agent']
 * @returns {object} - Parsed device info
 */
function parseUserAgent(userAgent) {
    if (!userAgent || typeof userAgent !== 'string') {
        return {
            os: 'Unknown',
            deviceModel: 'Unknown',
            browser: 'Unknown',
            browserVersion: 'Unknown',
            deviceType: 'Unknown'
        };
    }

    const ua = userAgent;

    // Extract OS
    let os = 'Unknown';
    if (ua.includes('Android')) {
        const androidMatch = ua.match(/Android (\d+(?:\.\d+)?)/);
        os = androidMatch ? `Android ${androidMatch[1]}` : 'Android';
    } else if (ua.includes('iOS')) {
        const iosMatch = ua.match(/OS (\d+(?:_\d+)?)/);
        os = iosMatch ? `iOS ${iosMatch[1].replace('_', '.')}` : 'iOS';
    } else if (ua.includes('Windows')) {
        os = 'Windows';
    } else if (ua.includes('Mac')) {
        os = 'macOS';
    } else if (ua.includes('Linux')) {
        os = 'Linux';
    }

    // Extract Device Model (e.g., 'K' from the example)
    let deviceModel = 'Unknown';
    const modelMatch = ua.match(/\(([^)]*)\)/);
    if (modelMatch) {
        const parts = modelMatch[1].split(';');
        if (parts.length > 2) {
            deviceModel = parts[2].trim();
        }
    }

    // Extract Browser
    let browser = 'Unknown';
    let browserVersion = 'Unknown';
    if (ua.includes('Chrome')) {
        const chromeMatch = ua.match(/Chrome\/(\d+(?:\.\d+)?)/);
        browser = 'Chrome';
        browserVersion = chromeMatch ? chromeMatch[1] : 'Unknown';
    } else if (ua.includes('Safari')) {
        const safariMatch = ua.match(/Version\/(\d+(?:\.\d+)?)/);
        browser = 'Safari';
        browserVersion = safariMatch ? safariMatch[1] : 'Unknown';
    } else if (ua.includes('Firefox')) {
        const firefoxMatch = ua.match(/Firefox\/(\d+(?:\.\d+)?)/);
        browser = 'Firefox';
        browserVersion = firefoxMatch ? firefoxMatch[1] : 'Unknown';
    }

    // Determine Device Type
    let deviceType = 'Unknown';
    if (ua.includes('Mobile')) {
        deviceType = 'Mobile';
    } else if (ua.includes('Tablet')) {
        deviceType = 'Tablet';
    } else {
        deviceType = 'Desktop';
    }

    return {
        os,
        deviceModel,
        browser,
        browserVersion,
        deviceType
    };
}

module.exports = { parseUserAgent };
