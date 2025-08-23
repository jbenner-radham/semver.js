export default function isIntLike(value) {
    if (Number.isNaN(value)) {
        return false;
    }

    const parsedInt = Number.parseInt(value);

    // Handle floats in a string.
    if (typeof value === 'string' && `${parsedInt}` !== value) {
        return false;
    }

    // Handle floats.
    if (typeof value === 'number' && parsedInt !== value) {
        return false;
    }

    return !Number.isNaN(parsedInt);
}
