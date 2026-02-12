import { Treasure } from "./type";

export const imgsTreasure: Record<number, any> = {
    1: require('@assets/images/treasures/beetle.png'),
    2: require('@assets/images/treasures/hieroglyph.png'),
    3: require('@assets/images/treasures/pharaoh.png'),
    4: require('@assets/images/treasures/runes.png'),
    5: require('@assets/images/treasures/book-of-the-dead.png'),
    6: require('@assets/images/treasures/crook.png'),
    7: require('@assets/images/treasures/eye-of-ra.png'),
    8: require('@assets/images/treasures/papyrus.png'),
    9: require('@assets/images/treasures/obelisk.png'),
    10: require('@assets/images/treasures/necklace.png'),
}

export const treasures: Treasure[] = [
    {
        id: 1,
        img: 1,
        title: "Jeweled Scarab",
        desc: "An ancient beetle-shaped amulet believed to carry the soul safely through the afterlife.",
        isOpen: false,
        price: 10,
        isPurchased: false
    },
    {
        id: 2,
        img: 2,
        title: "Scroll of the Ancients",
        desc: "A weathered parchment inscribed with forgotten spells and royal decrees.",
        isOpen: false,
        price: 15,
        isPurchased: false
    },
    {
        id: 3,
        img: 3,
        title: "Pharaoh's Sarcophagus",
        desc: "A golden coffin adorned with protective symbols, said to guard the resting spirit of a mighty ruler.",
        isOpen: false,
        price: 25,
        isPurchased: false
    },
    {
        id: 4,
        img: 4,
        title: "Stone of Runes",
        desc: "A circular relic etched with divine symbols, pulsing with a faint magical glow.",
        isOpen: false,
        price: 20,
        isPurchased: false
    },
    {
        id: 5,
        img: 5,
        title: "Book of the Dead",
        desc: "A mystical tome guiding souls through the trials of the underworld.",
        isOpen: false,
        price: 30,
        isPurchased: false
    },
    {
        id: 6,
        img: 6,
        title: "Wands of Divine Authority",
        desc: "Twin ceremonial rods once held by the pharaoh to command gods and men alike.",
        isOpen: false,
        price: 35,
        isPurchased: false
    },
    {
        id: 7,
        img: 7,
        title: "Eye of Ra",
        desc: "A radiant gem representing the sun god's gaze — a symbol of protection and fiery wrath.",
        isOpen: false,
        price: 40,
        isPurchased: false
    },
    {
        id: 8,
        img: 8,
        title: "Hieroglyphic Papyrus",
        desc: "A sacred scroll covered in ancient script, said to reveal secrets of the gods.",
        isOpen: false,
        price: 18,
        isPurchased: false
    },
    {
        id: 9,
        img: 9,
        title: "Obelisk Fragment",
        desc: "A shard from a towering stone monument, humming with celestial energy.",
        isOpen: false,
        price: 22,
        isPurchased: false
    },
    {
        id: 10,
        img: 10,
        title: "Pharaoh's Necklace",
        desc: "An ornate collar of gold and lapis lazuli, imbued with blessings from the heavens.",
        isOpen: false,
        price: 50,
        isPurchased: false
    }
]
