// src/utils/assetLoader.ts

// Eagerly load bundled image assets as URL strings, accepting PNG and WEBP files.
const images = Object.assign(
  {},
  import.meta.glob('../assets/images/**/*.png', { eager: true, import: 'default' }),
  import.meta.glob('../assets/images/**/*.webp', { eager: true, import: 'default' }),
);

const normalizeAssetName = (value: string): string => {
  return value
    .trim()
    .replace(/\.(png|webp)$/i, '')
    .replace(/[_\-]+/g, ' ')
    .replace(/[^a-z0-9 ]/gi, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
};

const getCandidateNames = (value: string): string[] => {
  const trimmed = value.trim();
  const names = new Set<string>();

  if (!trimmed) return [];

  names.add(trimmed);
  names.add(trimmed.replace(/\.(png|webp)$/i, ''));
  names.add(trimmed.replace(/\s+/g, ' '));
  names.add(trimmed.replace(/\s+/g, '_'));
  names.add(trimmed.replace(/\s+/g, ''));

  return [...names];
};

/**
 * Retrieves the bundled image URL for a given item.
 * @param category - The subfolder name (e.g., 'defect', 'ironclad', 'relics')
 * @param name - The exact filename without the .png extension (e.g., 'Claw', 'Claw+')
 */
export const getAssetUrl = (category: string, name: string): string | null => {
  const baseName = String(name ?? '').trim();
  if (!baseName) return null;

  const supportedExtensions = ['png', 'webp'];
  const exactCandidates = supportedExtensions.map((ext) => {
    const fileName = baseName.toLowerCase().endsWith(`.${ext}`) ? baseName : `${baseName}.${ext}`;
    return `../assets/images/${category}/${fileName}`;
  });

  for (const exactPath of exactCandidates) {
    if (images[exactPath]) {
      return images[exactPath] as string;
    }
  }

  const normalizedInput = normalizeAssetName(baseName);
  const categoryPrefix = `../assets/images/${category}/`;

  for (const [path, url] of Object.entries(images)) {
    if (!path.startsWith(categoryPrefix)) continue;

    const filename = path.replace(categoryPrefix, '').replace(/\.(png|webp)$/i, '');
    const normalizedFilename = normalizeAssetName(filename);

    if (normalizedFilename === normalizedInput) {
      return url as string;
    }

    if (normalizedFilename.startsWith(normalizedInput) || normalizedInput.startsWith(normalizedFilename)) {
      return url as string;
    }

    const inputCandidates = getCandidateNames(baseName);
    for (const candidate of inputCandidates) {
      if (normalizeAssetName(candidate) === normalizedFilename) {
        return url as string;
      }
    }
  }

  return null;
};