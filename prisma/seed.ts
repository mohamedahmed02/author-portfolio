import "dotenv/config";
import { PrismaClient, PostStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function ensureSingleAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin account.");
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  const passwordHash = await hashPassword(password);

  const existing = await prisma.user.findMany();
  if (existing.length === 0) {
    await prisma.user.create({
      data: { email, passwordHash, role: "ADMIN" },
    });
    console.log("Created single admin user.");
    return;
  }

  // Enforce single admin: keep first, delete extras, sync credentials from env
  const [primary, ...rest] = existing;
  if (rest.length) {
    await prisma.user.deleteMany({
      where: { id: { in: rest.map((u) => u.id) } },
    });
    console.log(`Removed ${rest.length} extra user(s).`);
  }

  await prisma.user.update({
    where: { id: primary.id },
    data: { email, passwordHash, role: "ADMIN" },
  });
  console.log("Synced single admin user from environment.");
}

async function main() {
  await ensureSingleAdmin();

  await prisma.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      siteNameEn: "Chaza",
      siteNameId: "Chaza",
      authorName: "Chaza",
      heroEyebrowEn: "Writer & Essayist",
      heroEyebrowId: "Penulis & Esais",
      heroHeadlineEn: "Writing with clarity, patience, and precision",
      heroHeadlineId: "Menulis dengan kejelasan, kesabaran, dan ketelitian",
      heroDescriptionEn:
        "Essays, articles, and notes on culture, language, and the quiet architecture of everyday life.",
      heroDescriptionId:
        "Esai, artikel, dan catatan tentang budaya, bahasa, dan arsitektur tenang kehidupan sehari-hari.",
      heroCtaLabelEn: "Explore the writing",
      heroCtaLabelId: "Jelajahi tulisan",
      contactEmail: process.env.CONTACT_TO_EMAIL || "",
      defaultSeoTitleEn: "Chaza — Writer & Essayist",
      defaultSeoTitleId: "Chaza — Penulis & Esais",
      defaultSeoDescriptionEn:
        "A premium editorial portfolio of essays, articles, and notes.",
      defaultSeoDescriptionId:
        "Portofolio editorial premium berisi esai, artikel, dan catatan.",
    },
  });

  const categories = [
    { nameEn: "Essay", nameId: "Esai", slug: "essay" },
    { nameEn: "Article", nameId: "Artikel", slug: "article" },
    { nameEn: "Personal", nameId: "Personal", slug: "personal" },
    { nameEn: "Notes", nameId: "Catatan", slug: "notes" },
    { nameEn: "Poetry", nameId: "Puisi", slug: "poetry" },
    { nameEn: "Journal", nameId: "Jurnal", slug: "journal" },
    { nameEn: "Opinion", nameId: "Opini", slug: "opinion" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameEn: cat.nameEn, nameId: cat.nameId },
      create: cat,
    });
  }

  const essay = await prisma.category.findUnique({ where: { slug: "essay" } });
  const notes = await prisma.category.findUnique({ where: { slug: "notes" } });
  const article = await prisma.category.findUnique({ where: { slug: "article" } });

  const samplePosts = [
    {
      titleEn: "The things we don't say",
      titleId: "Hal-hal yang tidak kita katakan",
      slug: "the-things-we-dont-say",
      excerptEn:
        "On silence, restraint, and the sentences that live between what is spoken and what is known.",
      excerptId:
        "Tentang keheningan, pengekangan, dan kalimat yang hidup di antara yang diucapkan dan yang diketahui.",
      bodyEn: `<p>There is a discipline to leaving things unsaid. Not every thought deserves the page, and not every feeling benefits from being named too quickly.</p><blockquote><p>Clarity is not the same as confession.</p></blockquote><p>In careful writing, silence is not absence. It is structure—the white space that allows meaning to settle.</p><h2>Listening first</h2><p>Before drafting, listen. Before revising, wait. The best sentences often arrive after the urgency to speak has passed.</p>`,
      bodyId: `<p>Ada disiplin dalam membiarkan sesuatu tidak terucap. Tidak setiap pikiran layak ditulis, dan tidak setiap perasaan perlu dinamai terlalu cepat.</p><blockquote><p>Kejelasan tidak sama dengan pengakuan.</p></blockquote><p>Dalam penulisan yang cermat, keheningan bukanlah ketiadaan. Ia adalah struktur—ruang putih yang memungkinkan makna mengendap.</p><h2>Mendengar terlebih dahulu</h2><p>Sebelum menulis, dengarkan. Sebelum merevisi, tunggu. Kalimat terbaik sering datang setelah urgensi untuk berbicara berlalu.</p>`,
      categoryId: essay?.id,
      featured: true,
      status: PostStatus.PUBLISHED,
      readingTime: 6,
      publishedAt: new Date("2026-03-12"),
      seoTitleEn: "The things we don't say",
      seoTitleId: "Hal-hal yang tidak kita katakan",
      seoDescriptionEn: "An essay on silence, restraint, and careful writing.",
      seoDescriptionId: "Sebuah esai tentang keheningan, pengekangan, dan menulis dengan cermat.",
    },
    {
      titleEn: "Notes on reading slowly",
      titleId: "Catatan tentang membaca perlahan",
      slug: "notes-on-reading-slowly",
      excerptEn: "Why pace matters when attention is the scarcest resource.",
      excerptId: "Mengapa tempo penting ketika perhatian adalah sumber daya yang paling langka.",
      bodyEn: `<p>Slow reading is not nostalgia. It is a method—an insistence that language deserves time.</p><p>When we rush, we skim for utility. When we linger, we notice cadence, hesitation, and the writer's private architecture of thought.</p>`,
      bodyId: `<p>Membaca perlahan bukan nostalgia. Ia adalah metode—desakan bahwa bahasa pantas diberi waktu.</p><p>Ketika kita buru-buru, kita menyisir demi utilitas. Ketika kita berlama-lama, kita memperhatikan irama, keraguan, dan arsitektur pribadi pemikiran penulis.</p>`,
      categoryId: notes?.id,
      featured: true,
      status: PostStatus.PUBLISHED,
      readingTime: 4,
      publishedAt: new Date("2026-02-20"),
    },
    {
      titleEn: "Cities as unfinished drafts",
      titleId: "Kota sebagai draf yang belum selesai",
      slug: "cities-as-unfinished-drafts",
      excerptEn: "Walking as a form of research, revision, and belonging.",
      excerptId: "Berjalan sebagai bentuk penelitian, revisi, dan rasa memiliki.",
      bodyEn: `<p>A city edits itself every morning. Scaffolding appears, shopfronts change, and neighborhoods renegotiate their sentences.</p><p>To write about place is to accept that your draft will always be slightly behind the street.</p>`,
      bodyId: `<p>Sebuah kota mengedit dirinya setiap pagi. Perancah muncul, etalase berubah, dan lingkungan menegosiasikan ulang kalimatnya.</p><p>Menulis tentang tempat berarti menerima bahwa draf Anda akan selalu sedikit tertinggal dari jalanan.</p>`,
      categoryId: article?.id,
      featured: true,
      status: PostStatus.PUBLISHED,
      readingTime: 7,
      publishedAt: new Date("2026-01-08"),
    },
  ];

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
