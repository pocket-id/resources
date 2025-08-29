import { BadgePreset, defineConfig, tierPresets } from 'sponsorkit';
import fs from 'fs/promises';

const past: BadgePreset = {
  avatar: {
    size: 20,
  },
  boxWidth: 22,
  boxHeight: 22,
  container: {
    sidePadding: 35,
  },
};

const login = process.env.SPONSORKIT_GITHUB_LOGIN ?? 'unknown';
const outputJson = `sponsors.${login}.json`;

export default defineConfig({
  tiers: [
    {
      title: 'Past Sponsors',
      preset: past,
    },
    {
      title: 'Sponsors',
      monthlyDollars: 1,
      preset: {
        avatar: {
          size: 42,
        },
        boxWidth: 52,
        boxHeight: 52,
        container: {
          sidePadding: 30,
        },
      },
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 5,
      preset: tierPresets.medium,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 10,
      preset: tierPresets.large,
    },
  ],

  async onSponsorsReady(sponsors) {
    await fs.writeFile(
      outputJson,
      JSON.stringify(
        sponsors
          .filter((i) => i.privacyLevel !== 'PRIVATE')
          .map((i) => {
            return {
              name: i.sponsor.name,
              login: i.sponsor.login,
              avatar: i.sponsor.avatarUrl,
              link: i.sponsor.linkUrl || i.sponsor.websiteUrl,
              org: i.sponsor.type === 'Organization',
            };
          })
          .sort((a, b) => b.amount - a.amount),
        null,
        2
      )
    );
  },
});
