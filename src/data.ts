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
    title: "Babak 1: Baju Adat",
    description: "Tebak asal suku atau daerah dari baju adat berikut!",
    questions: [
      {
        id: 101,
        question: "Baju adat 'Ulos' berasal dari suku...",
        options: ["Batak", "Minangkabau", "Dayak", "Asmat"],
        answer: "Batak",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Batak_Bride_2.jpg/600px-Batak_Bride_2.jpg"
      },
      {
        id: 102,
        question: "Baju adat 'Baju Bodo' berasal dari suku...",
        options: ["Bugis", "Toraja", "Madura", "Bali"],
        answer: "Bugis",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Bugis_traditional_clothes.jpg/600px-Bugis_traditional_clothes.jpg"
      },
      {
        id: 103,
        question: "Baju adat 'Aesan Gede' adalah ciri khas dari daerah...",
        options: ["Palembang", "Lampung", "Aceh", "Jambi"],
        answer: "Palembang",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pakaian_Adat_Sumsel_Aesan_Gede_01.jpg/600px-Pakaian_Adat_Sumsel_Aesan_Gede_01.jpg"
      },
      {
        id: 104,
        question: "Baju adat 'Kebaya' yang anggun sering dikaitkan dengan suku...",
        options: ["Jawa", "Papua", "Dayak", "Minahasa"],
        answer: "Jawa",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Kebaya_Encim.jpg/600px-Kebaya_Encim.jpg"
      },
      {
        id: 105,
        question: "Baju adat 'Koteka' berasal dari suku di daerah...",
        options: ["Papua", "NTT", "Maluku", "Sulawesi"],
        answer: "Papua",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Papuans_in_Koteka.jpg/600px-Papuans_in_Koteka.jpg"
      }
    ]
  },
  {
    id: 2,
    title: "Babak 2: Makanan Khas",
    description: "Tebak asal daerah dari makanan lezat nusantara ini!",
    questions: [
      {
        id: 201,
        question: "Makanan 'Gudeg' yang manis dan gurih berasal dari kota...",
        options: ["Yogyakarta", "Solo", "Semarang", "Salatiga"],
        answer: "Yogyakarta",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gudeg.jpg/600px-Gudeg.jpg"
      },
      {
        id: 202,
        question: "Suku mana yang terkenal dengan makanan 'Papeda'?",
        options: ["Papua", "Ambon", "Manado", "Flores"],
        answer: "Papua",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Papeda_ikan_kuah_kuning.jpg/600px-Papeda_ikan_kuah_kuning.jpg"
      },
      {
        id: 203,
        question: "Makanan khas 'Rendang' diakui dunia berasal dari suku...",
        options: ["Minangkabau", "Melayu", "Betawi", "Sunda"],
        answer: "Minangkabau",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Rendang_Western_Sumatra.jpg/600px-Rendang_Western_Sumatra.jpg"
      },
      {
        id: 204,
        question: "Makanan 'Pempek' yang menggunakan ikan berasal dari...",
        options: ["Palembang", "Padang", "Pekanbaru", "Pontianak"],
        answer: "Palembang",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pempek_Palembang_Indonesia.jpg/600px-Pempek_Palembang_Indonesia.jpg"
      },
      {
        id: 205,
        question: "Sate Lilit yang aromanya sedap berasal dari pulau...",
        options: ["Bali", "Lombok", "Jawa", "Madura"],
        answer: "Bali",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sate_lilit.JPG/600px-Sate_lilit.JPG"
      }
    ]
  },
  {
    id: 3,
    title: "Babak 3: Lokasi Wilayah",
    description: "Tebak lokasi atau pulau tempat suku ini berasal!",
    questions: [
      {
        id: 301,
        question: "Suku 'Dayak' banyak mendiami pulau...",
        options: ["Kalimantan", "Sumatera", "Sulawesi", "Jawa"],
        answer: "Kalimantan",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dayak_woman-costume1.jpg/600px-Dayak_woman-costume1.jpg"
      },
      {
        id: 302,
        question: "Suku 'Sasak' berasal dari pulau...",
        options: ["Lombok", "Bali", "Sumbawa", "Madura"],
        answer: "Lombok",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sasak_girl_Lombok.jpg/600px-Sasak_girl_Lombok.jpg"
      },
      {
        id: 303,
        question: "Suku 'Baduy' terletak di provinsi...",
        options: ["Banten", "Jawa Barat", "DKI Jakarta", "Lampung"],
        answer: "Banten",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Baduy_tribe_Banten_Indonesia.jpg/600px-Baduy_tribe_Banten_Indonesia.jpg"
      },
      {
        id: 304,
        question: "Suku 'Asmat' berasal dari pulau...",
        options: ["Papua", "Kepulauan Aru", "Maluku", "Seram"],
        answer: "Papua",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Asmat_Tribesmen.jpg/600px-Asmat_Tribesmen.jpg"
      },
      {
        id: 305,
        question: "Candi Borobudur sebagai warisan budaya terletak di...",
        options: ["Jawa Tengah", "Jawa Barat", "Jawa Timur", "Yogyakarta"],
        answer: "Jawa Tengah",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Borobudur_Temple.jpg/600px-Borobudur_Temple.jpg"
      }
    ]
  }
];
