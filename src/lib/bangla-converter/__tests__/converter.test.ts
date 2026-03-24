import { bijoyToUnicode, unicodeToBijoy } from '../index';

const testCases = [
    { unicode: "আমার সোনার বাংলা", bijoy: "Avgvi ‡mvbvi evsjv" },
    { unicode: "আমি তোমায় ভালোবাসি", bijoy: "Avwg ‡Zvgvq fv‡jvevwm" },
    { unicode: "বিজ্ঞান ও প্রযুক্তি", bijoy: "weÁvb I c«hyw³" }, // Complex conjuncts test
];

let allPassed = true;

for (let i = 0; i < testCases.length; i++) {
    const { unicode, bijoy } = testCases[i];

    const convertedToBijoy = unicodeToBijoy(unicode);
    const convertedToUnicode = bijoyToUnicode(bijoy);

    if (convertedToBijoy !== bijoy) {
        console.error(`❌ Test ${i + 1} Failed: Unicode to Bijoy.\nExpected: "${bijoy}"\nGot: "${convertedToBijoy}"`);
        allPassed = false;
    }

    if (convertedToUnicode !== unicode) {
        console.error(`❌ Test ${i + 1} Failed: Bijoy to Unicode.\nExpected: "${unicode}"\nGot: "${convertedToUnicode}"`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("✅ All conversion validation tests passed perfectly.");
} else {
    console.error("❌ Some tests failed.");
    process.exit(1);
}
