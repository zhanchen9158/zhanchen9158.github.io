export default function getActiveSection(activeSection) {
    if (!activeSection) return '';

    for (const key in activeSection) {
        if (Object.prototype.hasOwnProperty.call(activeSection, key) && activeSection[key] === true) {
            return key;
        }
    }

    return '';
}