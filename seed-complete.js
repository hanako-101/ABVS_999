import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'internship-management';

// 1. COLLECTION USERS - Comptes utilisateurs
const usersData = [
  // Admin
  {
    name: 'hanako',
    email: 'hanako@gmail.com',
    password: 'h123456789',
    role: 'admin',
    phone: '+212600000001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Stagiaires
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'stagiaire123',
    role: 'stagiaire',
    phone: '+212611111111',
    university: 'University of Technology',
    major: 'Computer Science',
    year: 'Senior Year',
    skills: ['JavaScript', 'React', 'Node.js'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    password: 'stagiaire123',
    role: 'stagiaire',
    phone: '+212622222222',
    university: 'Engineering School',
    major: 'Software Engineering',
    year: 'Master 2',
    skills: ['Python', 'Django', 'PostgreSQL'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    password: 'stagiaire123',
    role: 'stagiaire',
    phone: '+212633333333',
    university: 'Business School',
    major: 'Information Systems',
    year: '3rd Year',
    skills: ['Java', 'Spring Boot', 'MySQL'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 2. COLLECTION STAGIAIRES - Profils détaillés des stagiaires
const stagiairesData = [
  {
    userId: null, // Sera mis à jour après création des users
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+212611111111',
    cin: 'JD123456',
    university: 'University of Technology',
    faculty: 'Faculty of Computer Science',
    major: 'Computer Science',
    year: 'Senior Year',
    internshipType: 'Final Year Project',
    company: 'Tech Solutions Inc.',
    companyAddress: '123 Tech Street, Casablanca',
    supervisor: 'Dr. James Smith',
    supervisorEmail: 'james.smith@techsolutions.com',
    supervisorPhone: '+212644444444',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-06-30'),
    duration: '5 months',
    status: 'active',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    projects: [
      {
        title: 'Internship Management System',
        description: 'Development of a web-based internship management platform',
        technologies: ['Next.js', 'MongoDB', 'Tailwind CSS'],
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-30')
      }
    ],
    academicTutor: 'Prof. Maria Garcia',
    tutorEmail: 'maria.garcia@university.edu',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: null,
    fullName: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+212622222222',
    cin: 'SW789012',
    university: 'Engineering School',
    faculty: 'Software Engineering Department',
    major: 'Software Engineering',
    year: 'Master 2',
    internshipType: 'Summer Internship',
    company: 'Data Analytics Corp',
    companyAddress: '456 Data Avenue, Rabat',
    supervisor: 'Ms. Lisa Brown',
    supervisorEmail: 'lisa.brown@datacorp.com',
    supervisorPhone: '+212655555555',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-08-31'),
    duration: '2 months',
    status: 'pending',
    skills: ['Python', 'Django', 'PostgreSQL', 'Data Analysis'],
    projects: [
      {
        title: 'Customer Analytics Dashboard',
        description: 'Building a real-time analytics dashboard for customer data',
        technologies: ['Python', 'Django', 'PostgreSQL', 'Chart.js'],
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-08-31')
      }
    ],
    academicTutor: 'Dr. Robert Chen',
    tutorEmail: 'robert.chen@engineeringschool.edu',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: null,
    fullName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+212633333333',
    cin: 'MJ345678',
    university: 'Business School',
    faculty: 'Information Systems Department',
    major: 'Information Systems',
    year: '3rd Year',
    internshipType: 'Professional Internship',
    company: 'Banking Solutions Ltd',
    companyAddress: '789 Finance Road, Marrakech',
    supervisor: 'Mr. David Wilson',
    supervisorEmail: 'david.wilson@bankingsolutions.com',
    supervisorPhone: '+212666666666',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-09-15'),
    duration: '6 months',
    status: 'active',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
    projects: [
      {
        title: 'Banking API Development',
        description: 'Developing RESTful APIs for banking transaction processing',
        technologies: ['Java', 'Spring Boot', 'MySQL', 'Swagger'],
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-09-15')
      }
    ],
    academicTutor: 'Prof. Anna Kumar',
    tutorEmail: 'anna.kumar@businessschool.edu',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 3. COLLECTION ATTENDANCE - Enregistrements de présence
function generateAttendanceData(stagiaireId, startDate, days = 60) {
  const attendance = [];
  const statuses = ['present', 'absent', 'late', 'half-day'];
  const reasons = [
    'Sick leave',
    'Personal reasons',
    'Academic obligations',
    'Medical appointment',
    null
  ];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const checkIn = status === 'present' || status === 'late' 
      ? new Date(date.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60)))
      : null;
    
    const checkOut = status === 'present' || status === 'half-day'
      ? new Date(date.setHours(16 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60)))
      : null;

    attendance.push({
      stagiaireId: stagiaireId,
      date: new Date(date),
      status: status,
      checkIn: checkIn,
      checkOut: checkOut,
      hoursWorked: checkIn && checkOut 
        ? ((checkOut - checkIn) / (1000 * 60 * 60)).toFixed(2)
        : '0.00',
      notes: status === 'absent' || status === 'late' 
        ? reasons[Math.floor(Math.random() * reasons.length)]
        : null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return attendance;
}

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB...');
    
    const db = client.db(DB_NAME);
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('stagiaires').deleteMany({});
    await db.collection('attendance').deleteMany({});
    console.log('🧹 Old data cleared');

    // 1. Create users with hashed passwords
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    const usersResult = await db.collection('users').insertMany(usersWithHashedPasswords);
    console.log(`✅ ${usersResult.insertedCount} users created`);

    // 2. Create stagiaires with correct user IDs
    const stagiairesWithUserIds = stagiairesData.map((stagiaire, index) => {
      const user = usersWithHashedPasswords[index + 1]; // +1 to skip admin
      return {
        ...stagiaire,
        userId: usersResult.insertedIds[index + 1] // Link to corresponding user
      };
    });

    const stagiairesResult = await db.collection('stagiaires').insertMany(stagiairesWithUserIds);
    console.log(`✅ ${stagiairesResult.insertedCount} stagiaires created`);

    // 3. Create attendance records for each stagiaire
    let totalAttendanceRecords = 0;
    const stagiaireIds = Object.values(stagiairesResult.insertedIds);
    
    for (let i = 0; i < stagiaireIds.length; i++) {
      const stagiaireId = stagiaireIds[i];
      const stagiaire = stagiairesWithUserIds[i];
      const attendanceData = generateAttendanceData(stagiaireId, stagiaire.startDate);
      
      const attendanceResult = await db.collection('attendance').insertMany(attendanceData);
      totalAttendanceRecords += attendanceResult.insertedCount;
      console.log(`✅ ${attendanceResult.insertedCount} attendance records created for ${stagiaire.fullName}`);
    }

    console.log(`\n🎉 Database seeded successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${usersResult.insertedCount}`);
    console.log(`   🎓 Stagiaires: ${stagiairesResult.insertedCount}`);
    console.log(`   📅 Attendance Records: ${totalAttendanceRecords}`);

    // Display login information
    console.log(`\n🔐 Login Information:`);
    console.log(`   👑 Admin: hanako@gmail.com / h123456789`);
    console.log(`   🎓 Stagiaire 1: john.doe@example.com / stagiaire123`);
    console.log(`   🎓 Stagiaire 2: sarah.wilson@example.com / stagiaire123`);
    console.log(`   🎓 Stagiaire 3: mike.johnson@example.com / stagiaire123`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

// Run the seed
seedDatabase();