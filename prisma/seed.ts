// prisma/seed.ts
import dotenv from "dotenv";
import path from "path";

// Load environment variables FIRST
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

// Sample data arrays
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

const bookTitles = [
  {
    title: "Harry Potter and the Philosopher's Stone",
    description:
      "The first book in the Harry Potter series where Harry discovers he is a wizard",
    authorIndex: 0,
    price: "19.99",
    categories: ["Fantasy", "Young Adult", "Children"],
    img: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400",
    usuallySearchedBy: ["magic", "wizard school", "fantasy"],
  },
  {
    title: "A Game of Thrones",
    description:
      "First novel in the epic fantasy series A Song of Ice and Fire",
    authorIndex: 1,
    price: "24.99",
    categories: ["Fantasy", "Historical Fiction"],
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    usuallySearchedBy: ["medieval", "dragon", "political intrigue"],
  },
  {
    title: "Pride and Prejudice",
    description:
      "Romantic novel of manners that charts the emotional development of protagonist Elizabeth Bennet",
    authorIndex: 2,
    price: "14.99",
    categories: ["Classics", "Romance", "Historical Fiction"],
    img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    usuallySearchedBy: ["regency", "romance", "classic literature"],
  },
  {
    title: "The Shining",
    description: "Horror novel about a family's winter at an isolated hotel",
    authorIndex: 3,
    price: "18.50",
    categories: ["Horror", "Thriller"],
    img: "https://images.unsplash.com/photo-1706717738138-8a9a95afe9ff?w=400",
    usuallySearchedBy: [
      "haunted hotel",
      "psychological horror",
      "supernatural",
    ],
  },
  {
    title: "One Hundred Years of Solitude",
    description: "Landmark magical realism novel about the Buendía family",
    authorIndex: 4,
    price: "22.95",
    categories: ["Classics", "Historical Fiction"],
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    usuallySearchedBy: [
      "magical realism",
      "latin american literature",
      "family saga",
    ],
  },
  {
    title: "The Handmaid's Tale",
    description: "Dystopian novel set in a totalitarian society",
    authorIndex: 5,
    price: "16.99",
    categories: ["Science Fiction", "Dystopian", "Feminist Literature"],
    img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    usuallySearchedBy: ["dystopia", "feminism", "political fiction"],
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    description: "Explores the history of human evolution",
    authorIndex: 6,
    price: "21.99",
    categories: ["Science", "History", "Non-fiction"],
    img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
    usuallySearchedBy: ["human history", "evolution", "anthropology"],
  },
  {
    title: "Becoming",
    description: "Memoir by former First Lady Michelle Obama",
    authorIndex: 7,
    price: "25.00",
    categories: ["Biography", "Memoir", "Self-Help"],
    img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    usuallySearchedBy: ["memoir", "inspiration", "autobiography"],
  },
  {
    title: "The Way of Kings",
    description: "Epic fantasy novel set in the world of Roshar",
    authorIndex: 8,
    price: "28.99",
    categories: ["Fantasy", "Epic Fantasy"],
    img: "https://images.unsplash.com/photo-1650737845108-3b551c9cd1ee?w=400",
    usuallySearchedBy: ["epic fantasy", "world building", "magic system"],
  },
  {
    title: "Fourth Wing",
    description:
      "Romantic fantasy about a young woman training to become a dragon rider",
    authorIndex: 9,
    price: "17.99",
    categories: ["Fantasy", "Romance", "Young Adult"],
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
    usuallySearchedBy: ["dragon riders", "romantasy", "academy setting"],
  },
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

async function cleanDatabase() {
  console.log("🧹 Cleaning existing data...");

  try {
    // Usa deleteMany en lugar de TRUNCATE
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

    // Optional: Uncomment to clean database first
    await cleanDatabase();

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

    console.log("✍️ Creating authors...");
    const createdAuthors = [];
    for (const authorData of authors) {
      const author = await prisma.bookAuthor.create({
        data: {
          author_name: authorData.name,
        },
      });
      createdAuthors.push(author);
    }
    console.log(`   Created ${createdAuthors.length} authors`);

    console.log("🏷️ Creating categories...");
    const createdCategories = [];
    for (const categoryName of categories) {
      const category = await prisma.bookCategory.create({
        data: { name: categoryName },
      });
      createdCategories.push(category);
    }
    console.log(`   Created ${createdCategories.length} categories`);

    console.log("📚 Creating book titles...");
    const createdBookTitles = [];
    for (const bookData of bookTitles) {
      // Find category IDs for this book
      const categoryIds = createdCategories
        .filter((cat) => bookData.categories.includes(cat.name))
        .map((cat) => ({ id: cat.id }));

      const bookTitle = await prisma.bookTitle.create({
        data: {
          title: bookData.title,
          description: bookData.description,
          authorId: createdAuthors[bookData.authorIndex].id,
          book_price: bookData.price,
          stock: Math.floor(Math.random() * 5) + 2, // 2-6 copies
          averageRating: 4 + Math.random(), // 4.0-5.0
          loanCount: Math.floor(Math.random() * 100) + 20,
          lastLoanedAt: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          ),
          img: bookData.img,
          usuallySearchedBy: bookData.usuallySearchedBy,
          categories: {
            connect: categoryIds,
          },
        },
      });
      createdBookTitles.push(bookTitle);
    }
    console.log(`   Created ${createdBookTitles.length} book titles`);

    console.log("📑 Creating book copies...");
    const createdBookCopies = [];
    for (const bookTitle of createdBookTitles) {
      const numberOfCopies = Math.floor(Math.random() * 3) + 2; // 2-4 copies per title
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
          // First create a security deposit
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

          // Then create the loan request linked to the deposit
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
              bookSecurityDepositId: deposit.id, // This field is required
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

    // Update book statistics based on created data
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
    createdBookTitles.forEach((book, i) => {
      console.log(`  ${i + 1}. ${book.title} (${book.stock} copies available)`);
    });
  } catch (error) {
    console.error("❌ Error during seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute
if (require.main === module) {
  main();
}

export { main };
