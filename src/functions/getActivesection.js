export default function getActivesection(activesection) {
    if (!activesection) return '';
    const active = Object.keys(activesection).find(k => activesection[k] == true);
    return active ?? '';
};