const words = [
    "Coconut", "River", "Forest", "Golden", "Shadow", "Crimson", "House", "Bridge",
    "Silver", "Maple", "Falcon", "Ocean", "Mountain", "Crystal", "Thunder", "Echo",
    "Flame", "Snow", "Meadow", "Stone", "Morning", "Sunset", "Pine", "Aurora",
    "Misty", "Garden", "Comet", "Willow", "Rain", "Storm"
];

export function generateRandomGameName() {
    const chosen = [];

    while (chosen.length < 3) {
        const word = words[Math.floor(Math.random() * words.length)];
        if (!chosen.includes(word)) {
            chosen.push(word);
        }
    }

    return chosen.join(" ");
}