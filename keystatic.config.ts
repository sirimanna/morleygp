import { config, fields, singleton, collection } from '@keystatic/core';

export default config({
  // Live editing with client login. Replace the repo with YOUR GitHub repo (owner/name).
  // To edit locally without GitHub auth, temporarily switch back to { kind: 'local' }.
  storage: {
    kind: 'github',
    repo: 'sirimanna/morleygp',
  },
  ui: {
    // Replaces the "sirimanna/morleygp" repo label in the admin sidebar.
    brand: { name: 'MorleyGP' },
  },
  singletons: {
    business: singleton({
      label: 'Business details',
      path: 'src/content/business/',
      format: { data: 'json' },
      schema: {
        clinicName: fields.text({ label: 'Clinic name' }),
        slogan: fields.text({ label: 'Slogan / tagline', description: 'Short brand line, e.g. Your Health, Our Priority' }),
        introduction: fields.text({ label: 'Introduction text', description: 'Hero / intro paragraph', multiline: true }),
        logo: fields.image({
          label: 'Logo',
          description: 'Leave empty to use the default logo.',
          directory: 'public/images/brand',
          publicPath: '/images/brand/',
        }),

        // Contact
        phone: fields.text({ label: 'Phone' }),
        email: fields.text({ label: 'Email' }),
        address: fields.text({ label: 'Address', multiline: true }),
        abn: fields.text({ label: 'ABN' }),

        // Booking
        hotdocUrl: fields.url({ label: 'HotDoc booking link' }),
        healthengineUrl: fields.url({ label: 'HealthEngine booking link' }),

        // Social media
        social: fields.object(
          {
            facebook: fields.url({ label: 'Facebook URL' }),
            instagram: fields.url({ label: 'Instagram URL' }),
            linkedin: fields.url({ label: 'LinkedIn URL' }),
            youtube: fields.url({ label: 'YouTube URL' }),
          },
          { label: 'Social media links' }
        ),

        // SEO
        seo: fields.object(
          {
            title: fields.text({ label: 'SEO title' }),
            description: fields.text({ label: 'SEO meta description', multiline: true }),
            ogImage: fields.image({
              label: 'Social share image (OG image)',
              description: 'Shown when the site is shared on social media. Ideal size ~1200×630px.',
              directory: 'public/images/social',
              publicPath: '/images/social/',
            }),
          },
          { label: 'SEO defaults' }
        ),
        hours: fields.array(
          fields.object({
            label: fields.text({ label: 'Days', description: 'e.g. Monday – Friday' }),
            time: fields.text({ label: 'Hours', description: 'e.g. 8:30 am – 5:30 pm, or Closed' }),
            closed: fields.checkbox({ label: 'Mark as closed (greyed out)', defaultValue: false }),
          }),
          {
            label: 'Opening hours',
            itemLabel: (props) => `${props.fields.label.value}: ${props.fields.time.value}`,
          }
        ),
      },
    }),

    fees: singleton({
      label: 'Consultation Fees',
      path: 'src/content/fees/',
      format: { data: 'json' },
      schema: {
        rows: fields.array(
          fields.object({
            type: fields.text({ label: 'Consultation type' }),
            time: fields.text({ label: 'Day / time' }),
            fee: fields.text({ label: 'Fee' }),
            rebate: fields.text({ label: 'Medicare rebate' }),
            oop: fields.text({ label: 'Out of pocket' }),
          }),
          {
            label: 'Fee schedule',
            itemLabel: (props) => `${props.fields.type.value} — ${props.fields.time.value}`,
          }
        ),
      },
    }),
  },
  collections: {
    team: collection({
      label: 'Care Team (Doctors)',
      path: 'src/content/team/*/',
      slugField: 'name',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        credentials: fields.text({ label: 'Credentials' }),
        photo: fields.image({
          label: 'Photo',
          description: "Upload the doctor's headshot (portrait, ideally square or taller).",
          directory: 'public/images/team',
          publicPath: '/images/team/',
        }),
        gender: fields.select({
          label: 'Gender',
          options: [
            { label: 'Female', value: 'Female' },
            { label: 'Male', value: 'Male' },
          ],
          defaultValue: 'Female',
        }),
        languages: fields.array(fields.text({ label: 'Language' }), {
          label: 'Languages',
          itemLabel: (props) => props.value,
        }),
        bio: fields.text({ label: 'Short bio', multiline: true }),
        detailedBio: fields.text({ label: 'Detailed bio', multiline: true }),
        interests: fields.array(fields.text({ label: 'Interest' }), {
          label: 'Special interests',
          itemLabel: (props) => props.value,
        }),
        billingNote: fields.text({ label: 'Billing note', multiline: true }),
        telehealth: fields.checkbox({ label: 'Offers telehealth', defaultValue: true }),
        order: fields.integer({ label: 'Display order', defaultValue: 1 }),
      },
    }),

    services: collection({
      label: 'Services',
      path: 'src/content/services/*/',
      slugField: 'title',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        desc: fields.text({ label: 'Short description', multiline: true }),
        detail: fields.text({ label: 'Listing detail', multiline: true }),
        fullDesc: fields.text({ label: 'Full description', multiline: true }),
        image: fields.image({
          label: 'Header image',
          description: 'Upload the header image for this service (wide, ideally 1200×500 or similar).',
          directory: 'public/images/services',
          publicPath: '/images/services/',
        }),
        features: fields.array(fields.text({ label: 'Feature' }), {
          label: "What's included",
          itemLabel: (props) => props.value,
        }),
        order: fields.integer({ label: 'Display order', defaultValue: 1 }),
      },
    }),

    news: collection({
      label: 'News & Articles',
      path: 'src/content/news/*/',
      slugField: 'title',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Clinic News', value: 'Clinic News' },
            { label: 'Health Tips', value: 'Health Tips' },
            { label: 'Services', value: 'Services' },
            { label: 'Preventive Health', value: 'Preventive Health' },
            { label: "Women's Health", value: "Women's Health" },
            { label: 'Mental Health', value: 'Mental Health' },
          ],
          defaultValue: 'Clinic News',
        }),
        date: fields.text({ label: 'Date label', description: 'e.g. July 2025' }),
        readTime: fields.text({ label: 'Read time', description: 'e.g. 3 min read' }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        body: fields.text({ label: 'Body', multiline: true }),
        image: fields.image({
          label: 'Image',
          description: 'Upload the article image (wide, ideally 800×500 or similar).',
          directory: 'public/images/news',
          publicPath: '/images/news/',
        }),
        featured: fields.checkbox({ label: 'Featured article', defaultValue: false }),
        order: fields.integer({ label: 'Display order', defaultValue: 1 }),
      },
    }),
  },
});
