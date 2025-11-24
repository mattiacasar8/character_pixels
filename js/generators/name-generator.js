// Name Generator

export class NameGenerator {
    constructor() {
        this.prefixes = [
            'Aer', 'Bal', 'Cael', 'Dor', 'El', 'Fen', 'Gal', 'Hro', 'Ior', 'Kor',
            'Lun', 'Mor', 'Nar', 'Oro', 'Pel', 'Quin', 'Ral', 'Syl', 'Thal', 'Ur',
            'Val', 'Wyn', 'Xal', 'Yor', 'Zeph', 'Bran', 'Eld', 'Fir', 'Grim', 'Hal',
            'Kir', 'Lor', 'Mal', 'Nev', 'Ral', 'Ser', 'Tor', 'Var', 'Zar', 'Ash',
            'Cyr', 'Drak', 'Eth', 'Kael', 'Lyr', 'Myr', 'Nyx', 'Rax', 'Vex', 'Zul'
        ];
        this.suffixes = [
            'th', 'mar', 'ion', 'or', 'is', 'wen', 'gard', 'mir', 'dor', 'wyn',
            'ak', 'ius', 'eon', 'ara', 'iel', 'ran', 'eth', 'in', 'on', 'ul',
            'ix', 'ax', 'ex', 'gar', 'kar', 'tar', 'var', 'ril', 'dil', 'thir'
        ];
        this.titles = [
            'the Brave', 'Sun-shield', 'Storm-walker', 'Shadow-blade', 'Fire-heart',
            'Ice-born', 'Sky-seeker', 'Stone-hand', 'Swift-foot', 'Iron-will',
            'Moon-eye', 'Star-touched', 'Dawn-bringer', 'Night-walker', 'Wind-rider',
            'Frost-bearer', 'Flame-keeper', 'Dark-hunter', 'Light-bringer', 'Death-dealer'
        ];
    }

    generate() {
        const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
        const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        const name = prefix + suffix;

        // 30% chance to add a title
        if (Math.random() < 0.3) {
            const title = this.titles[Math.floor(Math.random() * this.titles.length)];
            return `${name} ${title}`;
        }

        return name;
    }

    generateUniqueFilename(baseName) {
        // Add random ID for file uniqueness
        const randomID = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        // Remove spaces and special characters for filename safety
        const safeName = baseName.replace(/[^a-zA-Z0-9-]/g, '_');
        return `${safeName}_${randomID}`;
    }
}

export const nameGenerator = new NameGenerator();
