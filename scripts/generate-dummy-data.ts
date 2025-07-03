// scripts/generate-dummy-data.ts
import { config } from 'dotenv';
import { resolve } from 'path';
import { faker } from '@faker-js/faker';
import { createAdminSupabaseClient } from '@/lib/supabase/admin-client'; // From new admin-client file
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Define types to fix 'implicit any' errors
type Role = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

type NewUser = {
  id: string;
  email: string;
  full_name: string;
  role_id: string;
};

// Indonesian names for more realistic data
const indonesianFirstNames = [
  'Ahmad', 'Siti', 'Budi', 'Rani', 'Agus', 'Sri', 'Joko', 'Rini', 'Eko', 'Lestari',
  'Fajar', 'Dewi', 'Bambang', 'Indira', 'Dedi', 'Ratna', 'Hendra', 'Maya', 'Rudi', 'Sari',
  'Wahyu', 'Nita', 'Indra', 'Wulan', 'Ferdi', 'Putri', 'Andi', 'Ayu', 'Rahman', 'Fitri'
];

const indonesianLastNames = [
  'Prasetyo', 'Wibowo', 'Susanto', 'Handayani', 'Kurniawan', 'Sari', 'Santoso', 'Lestari',
  'Setiawan', 'Rahayu', 'Utomo', 'Maharani', 'Nugroho', 'Permatasari', 'Wijaya', 'Kusuma',
  'Adiputra', 'Anggraini', 'Saputra', 'Melati', 'Pratama', 'Safitri', 'Putra', 'Indrasari'
];

// Realistic complaint templates for Yogyakarta context
const complaintTemplates = [
  // Infrastructure complaints
  'Jalan di {location} rusak parah, banyak lubang yang membahayakan pengendara motor dan mobil.',
  'Lampu penerangan jalan di {location} sudah mati lebih dari 2 minggu, sangat gelap di malam hari.',
  'Saluran air di {location} tersumbat sampah, sering banjir saat hujan deras.',
  'Trotoar di {location} rusak dan berlubang, berbahaya untuk pejalan kaki.',
  'Jembatan penyeberangan di {location} kotor dan kurang terawat.',
  
  // Public service complaints
  'Pelayanan di kantor kelurahan {location} sangat lambat, sudah antri 3 jam belum selesai.',
  'Petugas keamanan di {location} kurang responsif terhadap gangguan ketertiban.',
  'Fasilitas toilet umum di {location} kotor dan tidak terawat dengan baik.',
  'Tempat sampah di {location} sudah penuh dan menimbulkan bau tidak sedap.',
  'Halte bus di {location} rusak dan tidak ada tempat duduk.',
  
  // Environmental complaints
  'Banyak pedagang yang membuang limbah sembarangan di sungai dekat {location}.',
  'Polusi udara di {location} sangat parah akibat asap kendaraan dan pabrik.',
  'Suara bising dari konstruksi di {location} mengganggu warga sekitar.',
  'Pohon tumbang menghalangi jalan di {location} setelah hujan kemarin.',
  'Pencemaran air di {location} karena limbah industri.',
  
  // Social issues
  'Anak jalanan sering mengganggu pengendara di traffic light {location}.',
  'Premanisme di pasar {location} membuat pedagang tidak nyaman berjualan.',
  'Parkir liar di {location} mengganggu arus lalu lintas.',
  'Kegiatan karaoke hingga larut malam di {location} mengganggu istirahat warga.',
  'Pengemis asing berkeliaran di area wisata {location}.',
  
  // Healthcare and education
  'Puskesmas di {location} kekurangan obat-obatan dasar untuk pasien.',
  'Fasilitas sekolah di {location} rusak dan membahayakan keselamatan siswa.',
  'Antrian vaksinasi di {location} tidak tertib dan berdesak-desakan.',
  'Tenaga medis di {location} kurang dan waktu tunggu sangat lama.',
  
  // Transportation
  'Bus Trans Jogja sering telat dan tidak sesuai jadwal di halte {location}.',
  'Ojek online sulit ditemukan di area {location}, terutama malam hari.',
  'Tempat parkir motor di {location} tidak aman, sering terjadi pencurian.',
  'Kemacetan parah di {location} setiap jam kerja karena kurang rambu lalu lintas.',
  
  // Administrative services
  'Proses pengurusan KTP di {location} berbelit-belit dan memakan waktu lama.',
  'Website layanan online pemda sering error dan sulit diakses.',
  'Biaya retribusi di {location} terlalu tinggi dan memberatkan pedagang kecil.',
  'Informasi persyaratan administrasi di {location} tidak jelas dan membingungkan.'
];

// Yogyakarta locations for more realistic context
const yogyakartaLocations = [
  'Jl. Malioboro', 'Jl. Solo', 'Jl. Kaliurang', 'Jl. Bantul', 'Jl. Wates', 'Jl. Imogiri',
  'Tugu Jogja', 'Alun-alun Kidul', 'Alun-alun Utara', 'Pasar Beringharjo', 'Pasar Kranggan',
  'Terminal Giwangan', 'Terminal Jombor', 'Stasiun Tugu', 'Universitas Gadjah Mada',
  'Universitas Negeri Yogyakarta', 'Kraton Yogyakarta', 'Tamansari', 'Kotagede',
  'Prawirotaman', 'Sosrowijayan', 'Pakualaman', 'Gondokusuman', 'Umbulharjo',
  'Mergangsan', 'Danurejan', 'Gedongtengen', 'Jetis', 'Tegalrejo', 'Gamping',
  'Mlati', 'Sleman', 'Depok', 'Ngaglik', 'Kalasan', 'Prambanan', 'Bantul',
  'Sewon', 'Kasihan', 'Pajangan', 'Pleret', 'Piyungan', 'Dlingo', 'Imogiri'
];

async function main() {
  const supabase = createAdminSupabaseClient();
  console.log('Seeding database...');

  // Get existing roles and categories
  const { data: rolesData, error: rolesError } = await supabase.from('roles').select('id, name');
  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
    return;
  }
  const roles: Role[] = rolesData;

  const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('id, name');
  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return;
  }
  const categories: Category[] = categoriesData;

  const newUsers: NewUser[] = [];
  
  // Generate random users with Indonesian names
  roles.forEach((role: Role) => {
    if (role.name !== 'system_admin') {
      for (let i = 0; i < 5; i++) { // Generate 5 users for each role
        const firstName = faker.helpers.arrayElement(indonesianFirstNames);
        const lastName = faker.helpers.arrayElement(indonesianLastNames);
        const fullName = `${firstName} ${lastName}`;
        newUsers.push({
          id: uuidv4(),
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          full_name: fullName,
          role_id: role.id,
        });
      }
    }
  });

  // Generate realistic complaints with Indonesian context
  const newComplaints = [];
  if (newUsers.length > 0) {
    for (let i = 0; i < 200; i++) {
        const randomUser = faker.helpers.arrayElement(newUsers);
        const randomCategory = faker.helpers.arrayElement(categories);
        const randomLocation = faker.helpers.arrayElement(yogyakartaLocations);
        const randomTemplate = faker.helpers.arrayElement(complaintTemplates);
        
        // Replace {location} placeholder with actual Yogyakarta location
        const complaintText = randomTemplate.replace('{location}', randomLocation);
        
        // Yogyakarta bounds (more precise)
        const diyBounds = {
            north: -7.6,
            south: -8.1,
            east: 110.6,
            west: 110.1,
        };
        const latitude = faker.location.latitude({ min: diyBounds.south, max: diyBounds.north });
        const longitude = faker.location.longitude({ min: diyBounds.west, max: diyBounds.east });
        
        // More realistic status distribution
        const statusOptions = ['open', 'in_progress', 'resolved'];
        const statusWeights = [0.4, 0.35, 0.25]; // 40% open, 35% in progress, 25% resolved
        const status = faker.helpers.weightedArrayElement([
          { weight: statusWeights[0], value: statusOptions[0] },
          { weight: statusWeights[1], value: statusOptions[1] },
          { weight: statusWeights[2], value: statusOptions[2] }
        ]);
        
        // More realistic priority distribution
        const priorityOptions = ['low', 'medium', 'high'];
        const priorityWeights = [0.5, 0.35, 0.15]; // 50% low, 35% medium, 15% high
        const priority = faker.helpers.weightedArrayElement([
          { weight: priorityWeights[0], value: priorityOptions[0] },
          { weight: priorityWeights[1], value: priorityOptions[1] },
          { weight: priorityWeights[2], value: priorityOptions[2] }
        ]);
        
        // More realistic sentiment distribution based on complaint type
        let sentiment = 'Negative'; // Most complaints are negative by nature
        if (complaintText.includes('terima kasih') || complaintText.includes('bagus') || complaintText.includes('baik')) {
          sentiment = 'Positive';
        } else if (Math.random() < 0.1) { // 10% chance for neutral
          sentiment = 'Neutral';
        }
        
                 // Generate AI-processed fields for some complaints
         const shouldHaveAI = Math.random() < 0.6; // 60% chance to have AI analysis
         let main_topic = null;
         let ai_summary = null;
         let ai_advice = null;
         let ai_what_to_do = null;
         
         if (shouldHaveAI) {
             // Generate realistic AI analysis based on complaint text
             if (complaintText.includes('jalan') || complaintText.includes('lubang')) {
                 main_topic = 'Infrastruktur Jalan Rusak';
                 ai_summary = 'Pengaduan terkait kerusakan infrastruktur jalan yang memerlukan perbaikan segera untuk keselamatan pengguna jalan.';
                 ai_advice = 'Prioritaskan perbaikan jalan berdasarkan tingkat kerusakan dan volume lalu lintas.';
                 ai_what_to_do = 'Koordinasi dengan Dinas PU untuk survey lokasi dan penjadwalan perbaikan dalam 1-2 minggu.';
             } else if (complaintText.includes('lampu') || complaintText.includes('penerangan')) {
                 main_topic = 'Sistem Penerangan Jalan';
                 ai_summary = 'Masalah pada sistem penerangan jalan umum yang mempengaruhi keselamatan dan kenyamanan masyarakat.';
                 ai_advice = 'Lakukan pengecekan rutin sistem kelistrikan dan ganti komponen yang rusak.';
                 ai_what_to_do = 'Hubungi PLN dan teknisi untuk pemeriksaan dan perbaikan dalam 3-5 hari kerja.';
             } else if (complaintText.includes('air') || complaintText.includes('banjir')) {
                 main_topic = 'Manajemen Air dan Drainase';
                 ai_summary = 'Permasalahan sistem drainase dan pengelolaan air yang dapat menyebabkan genangan atau banjir.';
                 ai_advice = 'Pembersihan saluran dan peningkatan kapasitas drainase di area rawan banjir.';
                 ai_what_to_do = 'Mobilisasi tim pembersihan saluran dan evaluasi sistem drainase eksisting.';
             } else if (complaintText.includes('pelayanan') || complaintText.includes('antri')) {
                 main_topic = 'Kualitas Pelayanan Publik';
                 ai_summary = 'Keluhan masyarakat terhadap kualitas pelayanan administrasi yang perlu diperbaiki.';
                 ai_advice = 'Optimalisasi alur pelayanan dan peningkatan kompetensi petugas.';
                 ai_what_to_do = 'Training petugas dan evaluasi SOP pelayanan untuk mempercepat proses.';
             } else {
                 main_topic = 'Isu Lingkungan dan Kebersihan';
                 ai_summary = 'Permasalahan lingkungan dan kebersihan yang memerlukan tindakan kolektif.';
                 ai_advice = 'Koordinasi lintas sektor dan peningkatan kesadaran masyarakat.';
                 ai_what_to_do = 'Sosialisasi dan pembentukan program partisipatif dengan masyarakat.';
             }
         }
         
         newComplaints.push({
             category_id: randomCategory.id,
             text_content: complaintText,
             sentiment: sentiment,
             status: status,
             priority: priority,
             latitude: latitude,
             longitude: longitude,
             main_topic: main_topic,
             ai_summary: ai_summary,
             ai_advice: ai_advice,
             ai_what_to_do: ai_what_to_do,
             // Use recent dates to make the data relevant for "this week" queries.
             submitted_at: faker.date.recent({ days: 30 }).toISOString(),
         });
    }
  }

  // Insert users into auth and public users table
  for (const u of newUsers) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: u.full_name }
    });

    if (authError) {
        console.error(`Error creating auth user ${u.email}:`, authError.message);
    } else if (authUser.user) {
        const { error: usersInsertError } = await supabase.from('users').insert({
            id: authUser.user.id, // Use the ID from the created auth user
            full_name: u.full_name,
            email: u.email,
            role_id: u.role_id
        });
        if (usersInsertError) {
            console.error(`Error inserting user profile for ${u.email}:`, usersInsertError.message);
            // Clean up the auth user if the profile insert fails
            await supabase.auth.admin.deleteUser(authUser.user.id);
        }
    }
  }
  console.log('Users seeded.');

  const { error: complaintsInsertError } = await supabase.from('complaints').insert(newComplaints);
  if (complaintsInsertError) console.error('Error inserting complaints:', complaintsInsertError);
  else console.log('Complaints seeded.');

  console.log('Database seeding complete.');
}

main();