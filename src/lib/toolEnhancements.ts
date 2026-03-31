export interface ToolEnhancement {
  heroExample: {
    label: string
    input: string
    output: string
    note: string
  }
  useCases: string[]
  bestFor: string[]
  notBestFor: string[]
  limitations: string[]
}

export const toolEnhancements: Record<string, ToolEnhancement> = {
  'webp-to-png': {
    heroExample: {
      label: 'Fast compatibility fix',
      input: 'A WebP product image that will not open correctly in an older design workflow.',
      output: 'A PNG download that keeps transparency and works in more tools.',
      note: 'This is the strongest “make it compatible now” workflow for web and design handoff.',
    },
    useCases: [
      'Opening WebP assets in software that still expects PNG files.',
      'Preserving transparency for logos, overlays, UI assets, and ecommerce exports.',
      'Preparing browser-ready assets for teams that need a more universal format.',
    ],
    bestFor: [
      'Designers who need transparent PNG output.',
      'Quick compatibility fixes for older tools and CMS workflows.',
      'Teams converting modern web assets into more editable formats.',
    ],
    notBestFor: [
      'Large image libraries where PNG size inflation would hurt storage.',
      'Cases where WebP compatibility is already good and smaller files matter more.',
    ],
    limitations: [
      'PNG output is usually larger than WebP because PNG is lossless.',
      'This page is for format conversion, not advanced retouching or image enhancement.',
      'If you only need a smaller file, Image Compressor is a better next step.',
    ],
  },
  'png-to-jpg': {
    heroExample: {
      label: 'Smaller image export',
      input: 'A PNG screenshot or product image that needs a lighter upload size.',
      output: 'A JPG version that is easier to upload to websites, email, or listings.',
      note: 'Use this when file size matters more than transparency.',
    },
    useCases: [
      'Reducing image weight for websites, email, listing pages, and CMS uploads.',
      'Turning screenshots or flat graphics into a more storage-efficient format.',
      'Creating fast-loading web assets when transparency is not required.',
    ],
    bestFor: [
      'Web page images without transparent backgrounds.',
      'Email attachments and marketplace uploads with size limits.',
      'General-purpose photo distribution and lightweight content publishing.',
    ],
    notBestFor: [
      'Logos, stickers, or icons that rely on transparency.',
      'Design assets that will be edited repeatedly after export.',
    ],
    limitations: [
      'JPG does not preserve transparency; transparent areas will be flattened.',
      'Lossy compression can soften hard edges on text or UI screenshots.',
      'If you need editable quality, use PNG or keep the original source file.',
    ],
  },
  'jpg-to-png': {
    heroExample: {
      label: 'Editing-friendly output',
      input: 'A JPG image that needs to move into a more flexible editing workflow.',
      output: 'A PNG file that is better suited for design handoff and future edits.',
      note: 'This does not restore quality lost in the original JPG, but it gives you a lossless next format.',
    },
    useCases: [
      'Moving photos or screenshots into design workflows that prefer PNG output.',
      'Saving future edits in a lossless format after the original JPG stage.',
      'Preparing website or presentation assets that will be annotated or combined later.',
    ],
    bestFor: [
      'Design or presentation work where the next export should be lossless.',
      'Screenshots and interface captures that will be marked up.',
      'Users who want PNG consistency across mixed-format asset sets.',
    ],
    notBestFor: [
      'Reducing file size for faster delivery or upload.',
      'Trying to recover detail already lost in a compressed JPG.',
    ],
    limitations: [
      'PNG output will often be larger than the original JPG.',
      'Converting JPG to PNG does not magically increase source quality.',
      'If you only need a smaller or more universal file, keep JPG instead.',
    ],
  },
  'background-remover': {
    heroExample: {
      label: 'Clean product cutout',
      input: 'A product or portrait image with a busy background.',
      output: 'A transparent PNG ready for mockups, cards, banners, or catalog work.',
      note: 'This is one of the fastest high-intent pages on the site because it solves a specific before/after problem.',
    },
    useCases: [
      'Preparing ecommerce product images with cleaner backgrounds.',
      'Creating quick transparent cutouts for presentations and social graphics.',
      'Making profile images or creative assets easier to reuse in design tools.',
    ],
    bestFor: [
      'Simple products, portraits, and subjects with clear separation from the background.',
      'Fast cutout workflows where privacy matters and uploads are a concern.',
      'Designers who need transparent PNG output immediately.',
    ],
    notBestFor: [
      'Complex studio-grade masking or hair-level retouching.',
      'Large production batches that require manual QA on every image.',
    ],
    limitations: [
      'Very complex edges may still need manual cleanup in a design tool.',
      'Busy or low-contrast backgrounds can lower extraction quality.',
      'The final transparent PNG can be significantly larger than the source JPG.',
    ],
  },
  'image-compress': {
    heroExample: {
      label: 'Faster web upload',
      input: 'A heavy JPG or PNG that loads slowly on a page or marketplace listing.',
      output: 'A smaller image file that is easier to upload and faster to serve.',
      note: 'This page is a strong organic candidate because users often search by the problem, not the brand.',
    },
    useCases: [
      'Reducing image weight for websites, portfolios, and online stores.',
      'Shrinking email attachments and document-ready image exports.',
      'Preparing uploads for CMS, marketplace, and social publishing limits.',
    ],
    bestFor: [
      'Website owners trying to improve page speed and upload reliability.',
      'Content teams compressing batches of screenshots and product images.',
      'Anyone with file-size limits on forms, email, or ad platforms.',
    ],
    notBestFor: [
      'Heavy artistic editing or creative retouching.',
      'Cases where original-size archival quality matters more than speed.',
    ],
    limitations: [
      'Very aggressive compression can soften details or create artifacts.',
      'Resizing changes dimensions, so it is not ideal for every print workflow.',
      'If a format change is the bigger issue, use a dedicated converter next.',
    ],
  },
  'jfif-to-png': {
    heroExample: {
      label: 'Compatibility fix for desktop apps',
      input: 'An image downloaded from a website that saved as a .jfif file instead of a normal .jpg.',
      output: 'A completely standard PNG file that works in any design application or CMS.',
      note: 'This tool exists purely as a frustration-saver when your software refuses to open a downloaded web image.',
    },
    useCases: [
      'Fixing "unsupported file format" errors when uploading images to a CMS.',
      'Opening web graphics in older versions of Photoshop or Word.',
      'Standardizing messy downloaded image assets into a reliable format.',
    ],
    bestFor: [
      'Content managers, social media marketers, and designers.',
      'Anyone dealing with images downloaded straight from modern web browsers.',
    ],
    notBestFor: [
      'When smallest file size matters more than compatibility (use PNG to JPG next).',
      'When the target app already reads JFIF natively.',
    ],
    limitations: [
      'The file size will be larger since it converts from compressed JPEG data to uncompressed PNG data.',
      'It cannot restore lost quality from the original compressed JFIF file.',
    ],
  },
  'bijoy-to-unicode': {
    heroExample: {
      label: 'Legacy publishing text fix',
      input: 'Bangla text typed in Bijoy or SutonnyMJ and copied from an older publishing workflow.',
      output: 'Readable Unicode Bangla that works better on modern websites and apps.',
      note: 'This is one of the best low-budget growth opportunities because the need is real and less crowded than generic image keywords.',
    },
    useCases: [
      'Converting legacy Bangla copy for web publishing and modern editors.',
      'Fixing text pasted out of old design or office documents.',
      'Helping teams move from older Bangla workflows to Unicode-safe publishing.',
    ],
    bestFor: [
      'Publishers, designers, and editors handling older Bangla text sources.',
      'People fixing copy for websites, CMS editors, docs, and messaging apps.',
      'Bangladesh-focused workflows where font compatibility is a daily issue.',
    ],
    notBestFor: [
      'Font design or advanced typography correction beyond encoding issues.',
      'Image-based text that needs OCR rather than character conversion.',
    ],
    limitations: [
      'Some legacy formatting still needs manual review after conversion.',
      'Unusual custom keyboard mappings can produce imperfect output.',
      'Complex DTP layouts may need font cleanup after the Unicode conversion.',
    ],
  },
  'unicode-to-bijoy': {
    heroExample: {
      label: 'Back to legacy layout support',
      input: 'Modern Unicode Bangla text from Avro, web editors, or mobile keyboards.',
      output: 'Bijoy-style output for older publishing environments that still require it.',
      note: 'This is a practical task page for Bangladesh and print-oriented workflows.',
    },
    useCases: [
      'Preparing modern Bangla text for older DTP and layout software.',
      'Sharing copy with clients or editors who still depend on Bijoy-based workflows.',
      'Bridging modern typing habits with legacy production requirements.',
    ],
    bestFor: [
      'Publishing teams with mixed modern and legacy Bangla systems.',
      'Designers exporting copy into Illustrator or InDesign-era workflows.',
      'Editors who must hand off text to older production pipelines.',
    ],
    notBestFor: [
      'Fully modern web publishing stacks that already support Unicode everywhere.',
      'Cases where raw font rendering, not encoding, is the real issue.',
    ],
    limitations: [
      'Results depend on the target environment expecting standard Bijoy mappings.',
      'Final copy should still be proofread in the destination software.',
      'Unicode is still the better long-term format for web and cross-device use.',
    ],
  },
  'json-formatter': {
    heroExample: {
      label: 'Readable API payload',
      input: 'A minified or messy JSON response copied from an API, config file, or log output.',
      output: 'A readable, validated structure you can inspect or copy back into a workflow.',
      note: 'Developer pages like this can earn traffic from both query intent and community distribution.',
    },
    useCases: [
      'Beautifying API responses and config blobs during debugging.',
      'Validating JSON before pushing it into an app or request body.',
      'Cleaning sample payloads for docs, tickets, tutorials, and demos.',
    ],
    bestFor: [
      'Developers checking syntax and structure quickly in the browser.',
      'Technical writers cleaning payloads for examples and documentation.',
      'Support teams reviewing JSON pasted into tickets or forms.',
    ],
    notBestFor: [
      'Full IDE workflows with schema-aware editing and autocomplete.',
      'Mass data transformation across large files or repositories.',
    ],
    limitations: [
      'This page is built for quick formatting and validation, not full data modeling.',
      'Very large payloads may still feel better in dedicated local tooling.',
      'If you need transformations or scripting, use a coding environment next.',
    ],
  },
}
