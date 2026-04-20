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
    title: "Babak 1: Lambang & Sila",
    description: "Tebak lambang dan isi dari sila-sila Pancasila!",
    questions: [
      {
        id: 101,
        question: "Lambang dari Sila ke-1 Pancasila adalah...",
        options: ["Bintang", "Rantai", "Pohon Beringin", "Kepala Banteng"],
        answer: "Bintang",
        imageUrl: ""
      },
      {
        id: 102,
        question: "Sila ke-3 Pancasila berbunyi...",
        options: ["Persatuan Indonesia", "Keadilan Sosial", "Kemanusiaan yang Adil", "Ketuhanan yang Maha Esa"],
        answer: "Persatuan Indonesia",
        imageUrl: ""
      },
      {
        id: 103,
        question: "Lambang 'Padi dan Kapas' melambangkan sila ke...",
        options: ["5", "4", "3", "2"],
        answer: "5",
        imageUrl: ""
      },
      {
        id: 104,
        question: "Sila ke-2 disimbolkan dengan gambar...",
        options: ["Rantai", "Bintang", "Pohon Beringin", "Kepala Banteng"],
        answer: "Rantai",
        imageUrl: ""
      },
      {
        id: 105,
        question: "Bunyi Sila ke-5 adalah 'Keadilan Sosial bagi seluruh rakyat...'",
        options: ["Indonesia", "Nusantara", "Dunia", "Bangsa"],
        answer: "Indonesia",
        imageUrl: ""
      }
    ]
  },
  {
    id: 2,
    title: "Babak 2: Sejarah Singkat",
    description: "Uji pengetahuanmu tentang sejarah kelahiran Pancasila!",
    questions: [
      {
        id: 201,
        question: "Hari Lahir Pancasila diperingati setiap tanggal...",
        options: ["1 Juni", "17 Agustus", "1 Oktober", "10 November"],
        answer: "1 Juni",
        imageUrl: ""
      },
      {
        id: 202,
        question: "Siapa tokoh yang menyampaikan pidato tentang Pancasila pada 1 Juni 1945?",
        options: ["Ir. Soekarno", "Moh. Hatta", "Moh. Yamin", "Mr. Soepomo"],
        answer: "Ir. Soekarno",
        imageUrl: ""
      },
      {
        id: 203,
        question: "Di mana proklamasi kemerdekaan Indonesia dibacakan?",
        options: ["Jl. Pegangsaan Timur No. 56", "Istana Negara", "Monas", "Lubang Buaya"],
        answer: "Jl. Pegangsaan Timur No. 56",
        imageUrl: ""
      },
      {
        id: 204,
        question: "Lambang negara Indonesia adalah burung...",
        options: ["Garuda", "Elang", "Cenderawasih", "Rajawali"],
        answer: "Garuda",
        imageUrl: ""
      },
      {
        id: 205,
        question: "Semboyan 'Bhinneka Tunggal Ika' artinya...",
        options: ["Berbeda-beda tetapi tetap satu", "Berani karena benar", "Bersatu kita teguh", "Pantang menyerah"],
        answer: "Berbeda-beda tetapi tetap satu",
        imageUrl: ""
      }
    ]
  },
  {
    id: 3,
    title: "Babak 3: Nilai-Nilai",
    description: "Penerapan nilai Pancasila dalam kehidupan sehari-hari.",
    questions: [
      {
        id: 301,
        question: "Menolong teman yang sedang kesulitan adalah pengamalan sila ke...",
        options: ["2", "1", "3", "4"],
        answer: "2",
        imageUrl: ""
      },
      {
        id: 302,
        question: "Menghormati teman yang sedang beribadah adalah contoh sila ke...",
        options: ["1", "2", "3", "5"],
        answer: "1",
        imageUrl: ""
      },
      {
        id: 303,
        question: "Bermusyawarah untuk mengambil keputusan bersama adalah sila ke...",
        options: ["4", "3", "2", "5"],
        answer: "4",
        imageUrl: ""
      },
      {
        id: 304,
        question: "Bangga menggunakan produk buatan dalam negeri adalah sila ke...",
        options: ["3", "4", "2", "1"],
        answer: "3",
        imageUrl: ""
      },
      {
        id: 305,
        question: "Hidup hemat dan tidak boros merupakan pengamalan sila ke...",
        options: ["5", "4", "3", "2"],
        answer: "5",
        imageUrl: ""
      }
    ]
  }
];
