export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  imageUrl?: string;
  hint?: string;
}

export interface Round {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export const ROUNDS: Round[] = [
  {
    id: 1,
    title: "Babak 1: Alam & Lingkungan NTT",
    description: "Tebak tentang kekayaan alam dan lingkungan di NTT!",
    questions: [
      {
        id: 101,
        question: "Hewan purba yang hanya ada di NTT, tepatnya di Pulau Komodo dan Rinca adalah...",
        options: ["Komodo", "Badak", "Gajah", "Harimau"],
        answer: "Komodo",
        imageUrl: ""
      },
      {
        id: 102,
        question: "Danau tiga warna yang sangat terkenal di Pulau Flores adalah...",
        options: ["Kelimutu", "Toba", "Batur", "Sentani"],
        answer: "Kelimutu",
        imageUrl: ""
      },
      {
        id: 103,
        question: "NTT dikenal memiliki padang rumput yang luas, yang sering disebut...",
        options: ["Sabana", "Hutan Hujan", "Gurun", "Rawa"],
        answer: "Sabana",
        imageUrl: ""
      },
      {
        id: 104,
        question: "Sandal kayu yang menjadi ciri khas daerah NTT disebut...",
        options: ["Sandal Jepit", "Lakamola", "Bakiak", "Terompah"],
        answer: "Lakamola",
        imageUrl: ""
      },
      {
        id: 105,
        question: "Tanaman yang menjadi sumber pangan alternatif di NTT karena tahan kekeringan adalah...",
        options: ["Jagung", "Gandum", "Kedelai", "Kacang Tanah"],
        answer: "Jagung",
        imageUrl: ""
      }
    ]
  },
  {
    id: 2,
    title: "Babak 2: Budaya & Tradisi NTT",
    description: "Uji pengetahuanmu tentang kebudayaan khas NTT!",
    questions: [
      {
        id: 201,
        question: "Alat musik petik tradisional NTT yang terbuat dari daun lontar adalah...",
        options: ["Sasando", "Angklung", "Gamelan", "Kecapi"],
        answer: "Sasando",
        imageUrl: ""
      },
      {
        id: 202,
        question: "Rumah adat yang berbentuk kerucut di desa Wae Rebo, Manggarai disebut...",
        options: ["Mbaru Niang", "Joglo", "Gadang", "Honai"],
        answer: "Mbaru Niang",
        imageUrl: ""
      },
      {
        id: 203,
        question: "Kain tenun ikat NTT yang terkenal dengan motif cantiknya disebut...",
        options: ["Tenun Ikat", "Batik", "Songket", "Ulos"],
        answer: "Tenun Ikat",
        imageUrl: ""
      },
      {
        id: 204,
        question: "Tarian perang tradisional dari Sumba yang melibatkan kuda dan tombak kayu disebut...",
        options: ["Pasola", "Ja'i", "Kecak", "Piring"],
        answer: "Pasola",
        imageUrl: ""
      },
      {
        id: 205,
        question: "Tarian dari daerah Ngada yang ditarikan secara masal dalam lingkaran adalah...",
        options: ["Ja'i", "Lego-lego", "Caci", "Kataga"],
        answer: "Ja'i",
        imageUrl: ""
      }
    ]
  },
  {
    id: 3,
    title: "Babak 3: Kehidupan Sosial NTT",
    description: "Kearifan lokal dan kehidupan masyarakat di NTT.",
    questions: [
      {
        id: 301,
        question: "Tradisi berburu paus secara tradisional di NTT terdapat di desa...",
        options: ["Lamalera", "Wae Rebo", "Bena", "Praijing"],
        answer: "Lamalera",
        imageUrl: ""
      },
      {
         id: 302,
         question: "Pohon yang dijuluki 'Pohon Kehidupan' di NTT karena hampir semua bagiannya berguna adalah...",
         options: ["Lontar", "Kelapa", "Jati", "Beringin"],
         answer: "Lontar",
         imageUrl: ""
      },
      {
        id: 303,
        question: "Upacara syukur atas hasil panen di daerah Timor disebut dengan...",
        options: ["Fulan Mutu", "Penti", "Reba", "Ka'aba"],
        answer: "Fulan Mutu",
        imageUrl: ""
      },
      {
        id: 304,
        question: "Sirih pinang dalam budaya masyarakat NTT melambangkan...",
        options: ["Persaudaraan", "Permusuhan", "Kekayaan", "Kesedihan"],
        answer: "Persaudaraan",
        imageUrl: ""
      },
      {
        id: 305,
        question: "Mata uang tradisional yang digunakan dalam mas kawin di NTT (khususnya Alor) disebut...",
        options: ["Moko", "Rupiah", "Dolar", "Emas"],
        answer: "Moko",
        imageUrl: ""
      }
    ]
  }
];
