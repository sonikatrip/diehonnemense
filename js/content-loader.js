// Diehonnemense Content Loader
// Fetches and parses markdown content from the content directory

const ContentLoader = (function() {
    'use strict';

    const CONTENT_BASE = 'content';

    // Parse YAML-like frontmatter from markdown
    function parseFrontmatter(markdown) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = markdown.match(frontmatterRegex);

        if (!match) {
            return { metadata: {}, content: markdown };
        }

        const frontmatter = match[1];
        const content = match[2];

        // Parse simple YAML (key: value pairs)
        const metadata = {};
        frontmatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();

                // Convert boolean strings
                if (value === 'true') value = true;
                else if (value === 'false') value = false;
                // Keep empty strings as empty
                else if (value === '') value = '';

                metadata[key] = value;
            }
        });

        return { metadata, content };
    }

    // Parse markdown sections (## headers)
    function parseSections(content) {
        const sections = {};
        const sectionRegex = /## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g;
        let match;

        while ((match = sectionRegex.exec(content)) !== null) {
            const title = match[1].trim().toLowerCase().replace(/\s+/g, '_');
            sections[title] = match[2].trim();
        }

        return sections;
    }

    // Check if an image exists (returns promise)
    async function imageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Get all images for an animal/entry (1.jpg, 2.jpg, etc.)
    async function getImages(basePath) {
        const images = [];
        let index = 1;
        const maxImages = 10; // Reasonable limit

        while (index <= maxImages) {
            // Try both .jpg and .jpeg extensions
            const jpgPath = `${basePath}/${index}.jpg`;
            const jpegPath = `${basePath}/${index}.jpeg`;

            if (await imageExists(jpgPath)) {
                images.push(jpgPath);
            } else if (await imageExists(jpegPath)) {
                images.push(jpegPath);
            } else {
                break; // Stop when we don't find an image
            }
            index++;
        }

        return images;
    }

    // Load a single animal
    async function loadAnimal(slug) {
        const basePath = `${CONTENT_BASE}/animals/${slug}`;

        try {
            const response = await fetch(`${basePath}/animal.md`);
            if (!response.ok) throw new Error(`Failed to load ${slug}`);

            const markdown = await response.text();
            const { metadata, content } = parseFrontmatter(markdown);
            const sections = parseSections(content);
            const images = await getImages(basePath);

            return {
                slug,
                name: metadata.name || slug,
                breed: metadata.breed || '',
                rescueDate: metadata.rescue_date || '',
                rescuedFrom: metadata.rescued_from || '',
                status: metadata.status || 'available',
                sensitive: metadata.sensitive === true,
                urgent: metadata.urgent === true,
                urgentNeed: metadata.urgent_need || '',
                urgentReason: metadata.urgent_reason || '',
                story: sections.story || '',
                currentSituation: sections.current_situation || '',
                images: images,
                basePath: basePath
            };
        } catch (error) {
            console.error(`Error loading animal ${slug}:`, error);
            return null;
        }
    }

    // Load all animals
    async function loadAnimals() {
        try {
            const response = await fetch(`${CONTENT_BASE}/animals/manifest.json`);
            if (!response.ok) throw new Error('Failed to load animals manifest');

            const manifest = await response.json();
            const animals = await Promise.all(
                manifest.animals.map(slug => loadAnimal(slug))
            );

            return animals.filter(animal => animal !== null);
        } catch (error) {
            console.error('Error loading animals:', error);
            return [];
        }
    }

    // Load a single gratitude entry
    async function loadGratitudeEntry(slug) {
        const basePath = `${CONTENT_BASE}/gratitude/${slug}`;

        try {
            const response = await fetch(`${basePath}/entry.md`);
            if (!response.ok) throw new Error(`Failed to load ${slug}`);

            const markdown = await response.text();
            const { metadata, content } = parseFrontmatter(markdown);
            const images = await getImages(basePath);

            return {
                slug,
                name: metadata.name || slug,
                date: metadata.date || '',
                type: metadata.type || 'donation',
                description: content.trim(),
                image: images.length > 0 ? images[0] : null
            };
        } catch (error) {
            console.error(`Error loading gratitude entry ${slug}:`, error);
            return null;
        }
    }

    // Load all gratitude entries
    async function loadGratitude() {
        try {
            const response = await fetch(`${CONTENT_BASE}/gratitude/manifest.json`);
            if (!response.ok) throw new Error('Failed to load gratitude manifest');

            const manifest = await response.json();
            const entries = await Promise.all(
                manifest.entries.map(slug => loadGratitudeEntry(slug))
            );

            return entries.filter(entry => entry !== null);
        } catch (error) {
            console.error('Error loading gratitude:', error);
            return [];
        }
    }

    // Load a single outreach
    async function loadOutreach(slug) {
        const basePath = `${CONTENT_BASE}/outreaches/${slug}`;

        try {
            const response = await fetch(`${basePath}/outreach.md`);
            if (!response.ok) throw new Error(`Failed to load ${slug}`);

            const markdown = await response.text();
            const { metadata, content } = parseFrontmatter(markdown);
            const images = await getImages(basePath);

            return {
                slug,
                title: metadata.title || slug,
                icon: metadata.icon || 'heart',
                statNumber: metadata.stat_number || '',
                statLabel: metadata.stat_label || '',
                description: content.trim(),
                images: images
            };
        } catch (error) {
            console.error(`Error loading outreach ${slug}:`, error);
            return null;
        }
    }

    // Load all outreaches
    async function loadOutreaches() {
        try {
            const response = await fetch(`${CONTENT_BASE}/outreaches/manifest.json`);
            if (!response.ok) throw new Error('Failed to load outreaches manifest');

            const manifest = await response.json();
            const outreaches = await Promise.all(
                manifest.outreaches.map(slug => loadOutreach(slug))
            );

            return outreaches.filter(outreach => outreach !== null);
        } catch (error) {
            console.error('Error loading outreaches:', error);
            return [];
        }
    }

    // Helper function to format dates
    function formatDate(dateString, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-ZA', options);
    }

    // Helper function to calculate months since a date
    function getMonthsSince(dateString) {
        if (!dateString) return 0;
        const date = new Date(dateString);
        const now = new Date();
        return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    }

    // Public API
    return {
        loadAnimals,
        loadGratitude,
        loadOutreaches,
        formatDate,
        getMonthsSince
    };

})();
