import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

console.log("🌱 Starting database seed...");

import {
  PrismaClient,
  Role,
  BookLoanStatus,
  BookLoanRequestStatus,
  BookSecurityDepositState,
  BookPaymentMethod,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authors = [
  {
    name: "J.K. Rowling",
    bio: "British author best known for the Harry Potter series",
  },
  {
    name: "George R.R. Martin",
    bio: "American novelist and short-story writer",
  },
  { name: "Jane Austen", bio: "English novelist known for romantic fiction" },
  {
    name: "Stephen King",
    bio: "American author of horror, supernatural fiction",
  },
  {
    name: "Gabriel García Márquez",
    bio: "Colombian novelist and Nobel Prize winner",
  },
  { name: "Margaret Atwood", bio: "Canadian poet and novelist" },
  { name: "Yuval Noah Harari", bio: "Israeli historian and professor" },
  { name: "Michelle Obama", bio: "Former First Lady and author" },
  {
    name: "Brandon Sanderson",
    bio: "American fantasy and science fiction writer",
  },
  { name: "Rebecca Yarros", bio: "Contemporary romance author" },
  { name: "Ernest Hemingway", bio: "American novelist and short story writer" },
  { name: "Isabel Allende", bio: "Chilean writer of magical realism" },
  { name: "Haruki Murakami", bio: "Japanese writer of surrealist fiction" },
  { name: "Agatha Christie", bio: "English writer known for detective novels" },
  { name: "Toni Morrison", bio: "American novelist and Nobel laureate" },
];

const categories = [
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Thriller",
  "Historical Fiction",
  "Biography",
  "Self-Help",
  "Science",
  "Technology",
  "Business",
  "Classics",
  "Young Adult",
  "Children",
  "Poetry",
  "Horror",
  "Cookbooks",
  "Travel",
  "Art",
  "Philosophy",
];

const imageUrls = [
  "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
  "https://images.unsplash.com/photo-1706717738138-8a9a95afe9ff?w=400",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
  "https://images.unsplash.com/photo-1650737845108-3b551c9cd1ee?w=400",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400",
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400",
  "https://images.unsplash.com/photo-1497633762265-9d4e4b771b0a?w=400",
  "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400",
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400",
];

const users = [
  {
    username: "john_reader",
    password: "password123",
    dni: "AB123456",
    role: Role.MEMBER,
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    username: "sarah_booklover",
    password: "password123",
    dni: "CD789012",
    role: Role.MEMBER,
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    username: "mike_student",
    password: "password123",
    dni: "EF345678",
    role: Role.MEMBER,
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
  },
  {
    username: "librarian_anna",
    password: "password123",
    dni: "GH901234",
    role: Role.LIBRARIAN,
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
  },
  {
    username: "admin_system",
    password: "password123",
    dni: "IJ567890",
    role: Role.SUPERADMIN,
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
];

// Generate unique book titles
function generateUniqueBookTitles(count: number): string[] {
  const prefixes = [
    "The",
    "A",
    "Tales of",
    "Chronicles of",
    "Book of",
    "History of",
    "Adventures of",
    "Mystery of",
    "Secret of",
    "Legend of",
  ];
  const middle = [
    "Lost",
    "Hidden",
    "Dark",
    "Forgotten",
    "Ancient",
    "Magical",
    "Infinite",
    "Silent",
    "Broken",
    "Eternal",
  ];
  const subjects = [
    "Kingdom",
    "Forest",
    "City",
    "Ocean",
    "Mountain",
    "Star",
    "Soul",
    "Dream",
    "Shadow",
    "Light",
  ];
  const suffixes = [
    "Saga",
    "Trilogy",
    "Collection",
    "Anthology",
    "Story",
    "Tale",
    "Legend",
    "Myth",
    "Chronicle",
    "Memoir",
  ];

  const titles = new Set<string>();
  while (titles.size < count) {
    const pattern = Math.floor(Math.random() * 5);
    let title = "";
    switch (pattern) {
      case 0:
        title = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${middle[Math.floor(Math.random() * middle.length)]} ${subjects[Math.floor(Math.random() * subjects.length)]}`;
        break;
      case 1:
        title = `${subjects[Math.floor(Math.random() * subjects.length)]} of the ${middle[Math.floor(Math.random() * middle.length)]}`;
        break;
      case 2:
        title = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${subjects[Math.floor(Math.random() * subjects.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        break;
      case 3:
        title = `The ${middle[Math.floor(Math.random() * middle.length)]} ${subjects[Math.floor(Math.random() * subjects.length)]}`;
        break;
      default:
        title = `${subjects[Math.floor(Math.random() * subjects.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }
    // Add a unique suffix to avoid duplicates
    const uniqueSuffix = ` #${titles.size + 1}`;
    titles.add(title + uniqueSuffix);
  }
  return Array.from(titles);
}

const keywords = [
  "adventure",
  "magic",
  "fantasy",
  "science",
  "history",
  "romance",
  "mystery",
  "thriller",
  "horror",
  "biography",
  "self-help",
  "classic",
  "young adult",
  "children",
  "poetry",
  "cooking",
  "travel",
  "art",
  "philosophy",
  "drama",
];

async function cleanDatabase() {
  console.log("🧹 Cleaning existing data...");

  try {
    await prisma.bookLoanRequest.deleteMany();
    await prisma.bookSecurityDeposit.deleteMany();
    await prisma.bookLoan.deleteMany();
    await prisma.bookRating.deleteMany();
    await prisma.bookCopy.deleteMany();

    await prisma.bookTitle.deleteMany();
    await prisma.bookCategory.deleteMany();
    await prisma.bookAuthor.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.userAccount.deleteMany();

    console.log("✅ Database cleaned");
  } catch (error) {
    console.log(error);
    console.log(
      "⚠️  Could not clean database (maybe tables do not exist yet). Continuing...",
    );
  }
}

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    await cleanDatabase();

    // Crear usuarios
    console.log("👥 Creating users...");
    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.userAccount.create({
        data: {
          username: userData.username,
          password: await bcrypt.hash(userData.password, 12),
          dni: userData.dni,
          role: userData.role,
          img: userData.img,
        },
      });
      createdUsers.push(user);
      console.log(`   Created ${user.role.toLowerCase()}: ${user.username}`);
    }

    // Crear autores
    console.log("✍️ Creating authors...");
    const createdAuthors = [];
    for (const authorData of authors) {
      const author = await prisma.bookAuthor.create({
        data: { author_name: authorData.name },
      });
      createdAuthors.push(author);
    }
    console.log(`   Created ${createdAuthors.length} authors`);

    // Crear categorías
    console.log("🏷️ Creating categories...");
    const createdCategories: { id: string; name: string }[] = [];
    for (const categoryName of categories) {
      const category = await prisma.bookCategory.create({
        data: { name: categoryName },
      });
      createdCategories.push(category);
    }
    console.log(`   Created ${createdCategories.length} categories`);

    // ==================== CREAR 200 LIBROS ÚNICOS ====================
    console.log("📚 Creating 200 book titles...");
    const bookTitlesToCreate = 200;
    const generatedTitles = generateUniqueBookTitles(bookTitlesToCreate);
    const createdBookTitles = [];

    for (let i = 0; i < bookTitlesToCreate; i++) {
      // Seleccionar autor aleatorio
      const author =
        createdAuthors[Math.floor(Math.random() * createdAuthors.length)];

      // Seleccionar entre 1 y 3 categorías aleatorias
      const numCategories = Math.floor(Math.random() * 3) + 1;
      const shuffledCategories = [...createdCategories].sort(
        () => 0.5 - Math.random(),
      );
      const selectedCategories = shuffledCategories
        .slice(0, numCategories)
        .map((cat) => ({ id: cat.id }));

      // Seleccionar imagen aleatoria
      const img = imageUrls[Math.floor(Math.random() * imageUrls.length)];

      // Generar palabras clave (3-5)
      const numKeywords = Math.floor(Math.random() * 3) + 3;
      const shuffledKeywords = [...keywords].sort(() => 0.5 - Math.random());
      const selectedKeywords = shuffledKeywords.slice(0, numKeywords);

      // Precio aleatorio entre 5 y 30
      const price = (Math.random() * 25 + 5).toFixed(2);

      // Descripción genérica
      const description = `A fascinating ${selectedCategories.map((c) => createdCategories.find((cat) => cat.id === c.id)?.name).join(", ")} book that will captivate readers.`;

      const bookTitle = await prisma.bookTitle.create({
        data: {
          title: generatedTitles[i],
          description,
          authorName: author.author_name,
          authorId: author.id,
          book_price: price,
          stock: Math.floor(Math.random() * 8) + 2, // 2-9 copias
          averageRating: 3 + Math.random() * 2, // 3.0-5.0
          loanCount: Math.floor(Math.random() * 150) + 10,
          lastLoanedAt: new Date(
            Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
          ),
          img,
          usuallySearchedBy: selectedKeywords,
          categories: {
            connect: selectedCategories,
          },
        },
      });
      createdBookTitles.push(bookTitle);

      if ((i + 1) % 50 === 0) {
        console.log(`   ... ${i + 1} books created`);
      }
    }
    console.log(`   ✅ Created ${createdBookTitles.length} book titles`);

    // ==================== CREAR COPIES ====================
    console.log("📑 Creating book copies...");
    const createdBookCopies = [];
    for (const bookTitle of createdBookTitles) {
      const numberOfCopies = Math.floor(Math.random() * 3) + 2; // 2-4 copias por título
      for (let i = 1; i <= numberOfCopies; i++) {
        const bookCopy = await prisma.bookCopy.create({
          data: {
            bookTitleId: bookTitle.id,
            copy_number: i,
            durationDays: [7, 14, 21][Math.floor(Math.random() * 3)], // Random duration
          },
        });
        createdBookCopies.push(bookCopy);
      }
    }
    console.log(`   Created ${createdBookCopies.length} book copies`);

    console.log("⭐ Creating ratings...");
    const ratingPromises = [];
    for (const user of createdUsers) {
      // Each user rates 3-5 random books
      const booksToRate = createdBookTitles
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 3);

      for (const book of booksToRate) {
        ratingPromises.push(
          prisma.bookRating.create({
            data: {
              rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
              userId: user.id,
              bookTitleId: book.id,
            },
          }),
        );
      }
    }
    await Promise.all(ratingPromises);
    console.log(`   Created ${ratingPromises.length} ratings`);

    console.log("📅 Creating active book loans...");
    const loanPromises = [];
    for (let i = 0; i < 8; i++) {
      const user =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const copy =
        createdBookCopies[Math.floor(Math.random() * createdBookCopies.length)];

      const loanDate = new Date(
        Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000,
      );
      const returnDate = new Date(
        loanDate.getTime() + 14 * 24 * 60 * 60 * 1000,
      );

      loanPromises.push(
        prisma.bookLoan.create({
          data: {
            bookCopyId: copy.id,
            userId: user.id,
            status:
              Math.random() > 0.3
                ? BookLoanStatus.ISSUED
                : BookLoanStatus.IN_STOCK,
            loanDate,
            returnDate,
          },
        }),
      );
    }
    await Promise.all(loanPromises);
    console.log(`   Created ${loanPromises.length} book loans`);

    console.log("💰 Creating security deposits and loan requests...");
    const depositAndRequestPromises = [];

    for (let i = 0; i < 6; i++) {
      const user =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const copy =
        createdBookCopies[Math.floor(Math.random() * createdBookCopies.length)];

      depositAndRequestPromises.push(
        (async () => {
          const deposit = await prisma.bookSecurityDeposit.create({
            data: {
              userId: user.id,
              bookCopyId: copy.id,
              amount: (Math.random() * 20 + 5).toFixed(2),
              state: BookSecurityDepositState.ACTIVE,
              paymentMethod: [
                BookPaymentMethod.CASH,
                BookPaymentMethod.DIGITAL,
                BookPaymentMethod.TRANSFER,
              ][Math.floor(Math.random() * 3)],
              depositDate: new Date(
                Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
              ),
              paidDate: new Date(
                Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000,
              ),
            },
          });

          return prisma.bookLoanRequest.create({
            data: {
              bookCopyId: copy.id,
              userId: user.id,
              status: [
                BookLoanRequestStatus.PENDING,
                BookLoanRequestStatus.ACCEPTED,
                BookLoanRequestStatus.DECLINED,
              ][Math.floor(Math.random() * 3)],
              requestDate: new Date(
                Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000,
              ),
              acceptanceDate:
                Math.random() > 0.5
                  ? new Date(
                      Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000,
                    )
                  : null,
              description: [
                "Need for research paper",
                "Personal reading",
                "Book club selection",
                "Course requirement",
                "Gift for a friend",
              ][Math.floor(Math.random() * 5)],
              bookSecurityDepositId: deposit.id,
            },
          });
        })(),
      );
    }

    const createdRequests = await Promise.all(depositAndRequestPromises);
    console.log(
      `   Created ${createdRequests.length} loan requests with security deposits`,
    );

    console.log("🔔 Creating notifications...");
    const notificationData = [
      {
        message: 'Your book "Harry Potter" is due in 2 days',
        userId: createdUsers[0].id,
      },
      {
        message: "Your loan request has been approved",
        userId: createdUsers[1].id,
      },
      {
        message: 'New arrival: "The Way of Kings" is now available',
        userId: createdUsers[2].id,
      },
      {
        message: "Your security deposit has been refunded",
        userId: createdUsers[3].id,
      },
      {
        message: "Library maintenance scheduled for tomorrow",
        userId: createdUsers[0].id,
      },
      {
        message: "Welcome to our digital library system!",
        userId: createdUsers[4].id,
      },
    ];

    await prisma.notification.createMany({
      data: notificationData.map((n) => ({
        message: n.message,
        userId: n.userId,
        read: Math.random() > 0.5,
      })),
    });
    console.log(`   Created ${notificationData.length} notifications`);

    console.log("📊 Updating book statistics...");
    for (const bookTitle of createdBookTitles) {
      const ratings = await prisma.bookRating.findMany({
        where: { bookTitleId: bookTitle.id },
      });

      if (ratings.length > 0) {
        const avgRating =
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        await prisma.bookTitle.update({
          where: { id: bookTitle.id },
          data: { averageRating: parseFloat(avgRating.toFixed(1)) },
        });
      }
    }

    console.log("✨ Seed completed successfully!");
    console.log("\n📊 DEMO DATA SUMMARY:");
    console.log("====================");
    console.log(
      `👥 Users: ${createdUsers.length} (${createdUsers.filter((u) => u.role === Role.MEMBER).length} members, ${createdUsers.filter((u) => u.role === Role.LIBRARIAN).length} librarian, ${createdUsers.filter((u) => u.role === Role.SUPERADMIN).length} admin)`,
    );
    console.log(`✍️ Authors: ${createdAuthors.length}`);
    console.log(`🏷️ Categories: ${createdCategories.length}`);
    console.log(`📚 Book Titles: ${createdBookTitles.length}`);
    console.log(`📑 Book Copies: ${createdBookCopies.length}`);
    console.log(`⭐ Ratings: ${ratingPromises.length}`);
    console.log(`📅 Active Loans: ${loanPromises.length}`);
    console.log(`💰 Security Deposits: ${depositAndRequestPromises.length}`);
    console.log(`📋 Loan Requests: ${createdRequests.length}`);
    console.log(`🔔 Notifications: ${notificationData.length}`);

    console.log("\n🔑 DEMO CREDENTIALS:");
    console.log("==================");
    console.log("Member accounts (all with password: password123):");
    console.log("  • john_reader (Regular member)");
    console.log("  • sarah_booklover (Regular member)");
    console.log("  • mike_student (Regular member)");
    console.log("\nStaff accounts:");
    console.log("  • librarian_anna (Librarian - can manage loans)");
    console.log("  • admin_system (Super Admin - full access)");

    console.log("\n📚 FEATURED BOOKS IN DEMO:");
    console.log("========================");
    createdBookTitles.slice(0, 10).forEach((book, i) => {
      console.log(`  ${i + 1}. ${book.title} (${book.stock} copies available)`);
    });
  } catch (error) {
    console.error("❌ Error during seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { main };
