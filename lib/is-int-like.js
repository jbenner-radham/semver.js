export default function isIntLike(value) {
    const parsedInt = Number.parseInt(value);

    return !Number.isNaN(parsedInt);
}
